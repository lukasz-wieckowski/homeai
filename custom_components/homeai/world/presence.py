"""Who is home, who is asleep and what mode the house is in.

Sleep comes from up to four sources, in the order configured in `presence.sleep_sources`; the first source that
knows something wins. An explicit helper (“I'm going to sleep”) beats sensors, sensors beat the AI's inference
from activity, and fixed night hours are the fallback when nothing else is known.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, time, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..settings import SettingsManager, Target, parse_time
from .model import PersonInfo, WorldModel

DAY_PARTS = ("night", "morning", "day", "evening")


@dataclass(slots=True, frozen=True)
class SleepState:
    asleep: bool
    confidence: float
    source: str  # helper / sensors / ai / hours / unknown


@dataclass(slots=True, frozen=True)
class PersonState:
    entity_id: str
    name: str
    role: str
    home: bool
    zone: str
    sleep: SleepState
    user_id: str | None = None  # the person's Home Assistant user (approvals, conversations)


def in_window(now: time, start: time, end: time) -> bool:
    """Whether `now` is in [start, end), where the window may cross midnight."""
    if start == end:
        return False
    if start < end:
        return start <= now < end
    return now >= start or now < end


class Presence:
    """People and house mode, computed on demand from current states and settings."""

    def __init__(self, hass: HomeAssistant, world: WorldModel, settings: SettingsManager) -> None:
        self.hass = hass
        self.world = world
        self.settings = settings
        # AI inference per person: (asleep, confidence, valid_until)
        self._ai_sleep: dict[str, tuple[bool, float, datetime]] = {}
        self.exceptions: Any = None  # PresenceExceptions, set by the schedule stage
        self.admin_users: set[str] = set()  # Home Assistant administrators (people's default role)

    async def async_refresh_users(self) -> None:
        """Remember which Home Assistant users are administrators (on setup and when users change)."""
        users = await self.hass.auth.async_get_users()
        self.admin_users = {u.id for u in users if u.is_admin and u.is_active and not u.system_generated}

    def role(self, person_id: str) -> str:
        """The role set for the person; without one, administrator for a Home Assistant administrator's person and
        the default (member) for everyone else — so a home where nobody chose roles still has administrators."""
        target = Target(person_id=person_id)
        if self.settings.source("presence.role", target) == "default":
            person = self.world.persons.get(person_id)
            if person is not None and person.user_id and person.user_id in self.admin_users:
                return "admin"
        return str(self.settings.get("presence.role", target))

    def user_role(self, user_id: str | None) -> str | None:
        """The role of the person behind a Home Assistant user; None for a user without a person."""
        person = next((p for p in self.world.persons.values() if user_id and p.user_id == user_id), None)
        return self.role(person.entity_id) if person is not None else None

    def resident_user(self, user_id: str | None) -> bool:
        """A Home Assistant administrator, or the user of an administrator or member of the household."""
        return bool(user_id) and (user_id in self.admin_users or self.user_role(user_id) in ("admin", "member"))

    def people(self, now: datetime | None = None) -> list[PersonState]:
        now = now or dt_util.now()
        result = []
        for p in sorted(self.world.persons.values(), key=lambda x: x.entity_id):
            role = self.role(p.entity_id)
            if role == "ignore":
                continue
            result.append(
                PersonState(
                    entity_id=p.entity_id,
                    name=p.name,
                    role=role,
                    home=p.home,
                    zone=p.state,
                    sleep=self.sleep(p, now),
                    user_id=p.user_id,
                )
            )
        return result

    def residents(self, now: datetime | None = None) -> list[PersonState]:
        """People who live here: admins and members (guests and ignored people excluded)."""
        return [p for p in self.people(now) if p.role in ("admin", "member")]

    def someone_home(self) -> bool:
        return any(p.home for p in self.residents())

    def everyone_away(self) -> bool:
        residents = self.residents()
        return bool(residents) and not any(p.home for p in residents)

    def anyone_awake_home(self, now: datetime | None = None) -> bool:
        return any(p.home and not p.sleep.asleep for p in self.residents(now))

    def house_mode(self) -> str | None:
        entity = self.settings.get("presence.home_mode_entity")
        state = self.hass.states.get(entity) if entity else None
        return state.state if state else None

    def vacation(self) -> bool:
        if self.settings.get("presence.vacation_mode"):
            return True
        mode = self.house_mode()
        if mode and mode in self.settings.get("presence.vacation_states"):
            return True
        return bool(self.exceptions is not None and self.exceptions.household_away())

    def expected_away(self, person_id: str, at: datetime | None = None) -> bool:
        """A presence exception (trip, vacation) says this person is away."""
        return bool(self.exceptions is not None and self.exceptions.person_away(person_id, at))

    def set_ai_sleep(self, person_id: str, asleep: bool, confidence: float, minutes: int = 60) -> None:
        self._ai_sleep[person_id] = (asleep, confidence, dt_util.utcnow() + timedelta(minutes=minutes))

    def sleep(self, person: PersonInfo, now: datetime | None = None) -> SleepState:
        now = now or dt_util.now()
        target = Target(person_id=person.entity_id)
        for source in self.settings.get("presence.sleep_sources"):
            result = None
            if source == "helper":
                result = self._helper(target)
            elif source == "sensors":
                result = self._sensors(target, now)
            elif source == "ai":
                result = self._ai(person.entity_id)
            elif source == "hours":
                result = SleepState(self._night(target, now) and person.home, 0.5, "hours")
            if result is not None:
                return result
        return SleepState(False, 0.0, "unknown")

    def _helper(self, target: Target) -> SleepState | None:
        entity = self.settings.get("presence.sleep_helper", target)
        state = self.hass.states.get(entity) if entity else None
        if state is None or state.state in ("unknown", "unavailable"):
            return None
        return SleepState(state.state == self.settings.get("presence.sleep_helper_state", target), 1.0, "helper")

    def _sensors(self, target: Target, now: datetime) -> SleepState | None:
        bed = [self.hass.states.get(e) for e in self.settings.get("presence.bed_entities", target)]
        bed = [s for s in bed if s is not None and s.state not in ("unknown", "unavailable")]
        if bed:
            return SleepState(any(s.state == "on" for s in bed), 0.9, "sensors")
        charging = [self.hass.states.get(e) for e in self.settings.get("presence.charging_entities", target)]
        charging = [s for s in charging if s is not None and s.state not in ("unknown", "unavailable")]
        if charging and self._night(target, now, margin=timedelta(hours=1)):
            # phones report battery state in their own words: iOS "Charging" / "Full", Android "charging" / "full"
            plugged = ("on", "charging", "full")
            return SleepState(any(s.state.lower() in plugged for s in charging), 0.7, "sensors")
        return None

    def _ai(self, person_id: str) -> SleepState | None:
        guess = self._ai_sleep.get(person_id)
        if guess is None or guess[2] < dt_util.utcnow():
            return None
        return SleepState(guess[0], guess[1], "ai")

    def _night(self, target: Target, now: datetime, margin: timedelta = timedelta(0)) -> bool:
        local = dt_util.as_local(now)
        # a night belongs to the evening it starts on: Friday and Saturday nights use the weekend hours
        night_of = local.date() if local.hour >= 12 else local.date() - timedelta(days=1)
        weekend = night_of.weekday() in (4, 5)
        prefix = "presence.weekend_night" if weekend else "presence.night"
        start = parse_time(self.settings.get(f"{prefix}_start", target))
        end = parse_time(self.settings.get(f"{prefix}_end", target))
        start_dt = (datetime.combine(local.date(), start) - margin).time()
        end_dt = (datetime.combine(local.date(), end) + margin).time()
        return in_window(local.time(), start_dt, end_dt)

    def day_part(self, now: datetime | None = None) -> str:
        local = dt_util.as_local(now or dt_util.now()).time()
        bounds = [
            ("night", parse_time(self.settings.get("general.night_start"))),
            ("morning", parse_time(self.settings.get("general.morning_start"))),
            ("day", parse_time(self.settings.get("general.day_start"))),
            ("evening", parse_time(self.settings.get("general.evening_start"))),
        ]
        bounds.sort(key=lambda b: b[1])
        current = bounds[-1][0]
        for name, start in bounds:
            if local >= start:
                current = name
        return current
