"""What HomeAI wants its thermostat overrides to be right now — a pure function of the home's state.

From the presence calendar (`calendar.homeai_presence`) and live presence:

| Reason | When | Thermostats | Preset setting |
|---|---|---|---|
| `guests` | a guests exception | common spaces (else rooms that are not bedrooms or bathrooms) | `guests_preset` |
| `away` | a household trip or vacation, or every resident's own trip at once | all | `away_preset` |
| `vacation_mode` | vacation mode or the house mode says vacation | all | `away_preset` |
| `nobody_home` | no resident home for `heating.nobody_home_minutes` | all | `nobody_home_preset` |
| `activity` | an entity labelled `HomeAI: activity` is active | the rooms of that entity | `activity_preset` |
| `sick` | a sickness exception | all | `sick_preset` |
| `home_office` | working from home | the person's workplace | `home_office_preset` |

Calendar reasons start at the event's start (sent up to `heating.lead_hours` ahead, so the thermostat can heat up in
time) and end with it. Live reasons have no known end: their override runs `heating.rolling_hours` ahead and is
renewed while the reason lasts. One thermostat carries at most one HomeAI override at a time: a reason higher in the
table trims a lower one around it, and what is left of the lower one comes back when the higher one ends.
"""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass, field, replace
from datetime import datetime, timedelta
from typing import Any

from .contract import Thermostat, override_id

PRIORITY = ("guests", "away", "vacation_mode", "nobody_home", "activity", "sick", "home_office")
ROLLING = frozenset({"vacation_mode", "nobody_home", "activity"})
MIN_LENGTH = timedelta(minutes=5)


@dataclass(frozen=True, slots=True)
class Intent:
    kind: str
    key: str  # what it comes from: an exception id, "now", an activity entity
    entity_id: str  # the thermostat
    preset: str
    start: datetime  # UTC; at or before now = from now on
    end: datetime
    reason: str

    @property
    def rolling(self) -> bool:
        return self.kind in ROLLING

    @property
    def override_id(self) -> str:
        return override_id(self.kind, self.key, self.entity_id)


@dataclass(slots=True)
class Inputs:
    now: datetime
    thermostats: dict[str, Thermostat]
    roles: Callable[[str], frozenset[str]]  # area → room roles
    exceptions: list[dict[str, Any]]  # presence exceptions, start/end as UTC datetimes
    residents: list[str]  # person entity ids
    workplaces: dict[str, set[str]]  # person → workplace areas
    lead: timedelta
    rolling: timedelta
    preset: Callable[[str, str], str]  # (kind, thermostat) → preset
    enabled: Callable[[str], bool]  # thermostat → presence overrides allowed
    describe: Callable[[str, dict[str, Any] | None], str]  # (kind, exception or activity) → reason
    nobody_home: bool = False
    vacation_mode: bool = False
    activity: dict[str, list[str]] = field(default_factory=dict)  # area → active activity entities
    all_workplaces: set[str] = field(default_factory=set)


def _rooms(t: Thermostat, roles: Callable[[str], frozenset[str]]) -> frozenset[str]:
    out: set[str] = set()
    for area in t.areas:
        out |= roles(area)
    return frozenset(out)


def _guest_rooms(inputs: Inputs) -> list[str]:
    common = [e for e, t in inputs.thermostats.items() if "common" in _rooms(t, inputs.roles)]
    if common:
        return common
    private = {"bedroom", "bathroom"}
    return [
        e for e, t in inputs.thermostats.items() if not (_rooms(t, inputs.roles) and _rooms(t, inputs.roles) <= private)
    ]


def _workplace_thermostats(inputs: Inputs, person: str | None) -> list[str]:
    if person is None:
        areas = set(inputs.all_workplaces)
    else:
        areas = set(inputs.workplaces.get(person) or ())
        if not areas and len(inputs.all_workplaces) == 1:
            areas = set(inputs.all_workplaces)  # one workplace in the home: it is theirs
    return [e for e, t in inputs.thermostats.items() if areas & set(t.areas)]


def household_trips(inputs: Inputs) -> list[tuple[datetime, datetime, str, dict[str, Any]]]:
    """Time spans when the whole household is away by the calendar: household trips, and the overlap of every
    resident's own trips. (start, end, key, the exception the span comes from)."""
    out = []
    trips = [e for e in inputs.exceptions if e["kind"] in ("away", "vacation")]
    for item in trips:
        if not item.get("person"):
            out.append((item["start"], item["end"], item["id"], item))
    if not inputs.residents:
        return out
    personal = {p: [e for e in trips if e.get("person") == p] for p in inputs.residents}
    if any(not v for v in personal.values()):
        return out
    spans = [(e["start"], e["end"], e) for e in personal[inputs.residents[0]]]
    for person in inputs.residents[1:]:
        spans = [
            (max(s, e2["start"]), min(e, e2["end"]), item)
            for s, e, item in spans
            for e2 in personal[person]
            if max(s, e2["start"]) < min(e, e2["end"])
        ]
    out += [(s, e, f"everyone:{item['id']}", item) for s, e, item in spans]
    return out


def wanted(inputs: Inputs) -> list[Intent]:
    """Every override HomeAI would like, before conflicts are resolved."""
    now, horizon = inputs.now, inputs.now + inputs.lead
    out: list[Intent] = []

    def add(kind: str, key: str, targets: list[str], start: datetime, end: datetime, source: Any) -> None:
        if end <= now or start > horizon:
            return
        for entity_id in targets:
            if not inputs.enabled(entity_id):
                continue
            preset = inputs.preset(kind, entity_id)
            t = inputs.thermostats[entity_id]
            if not preset or not t.has_preset(preset):
                continue
            out.append(Intent(kind, key, entity_id, preset, max(start, now), end, inputs.describe(kind, source)))

    everyone = list(inputs.thermostats)
    for start, end, key, item in household_trips(inputs):
        add("away", key, everyone, start, end, item)
    for item in inputs.exceptions:
        if item["kind"] == "guests":
            add("guests", item["id"], _guest_rooms(inputs), item["start"], item["end"], item)
        elif item["kind"] == "sick":
            add("sick", item["id"], everyone, item["start"], item["end"], item)
        elif item["kind"] == "home_office":
            add(
                "home_office",
                item["id"],
                _workplace_thermostats(inputs, item.get("person")),
                item["start"],
                item["end"],
                item,
            )
    rolling_end = now + inputs.rolling
    if inputs.vacation_mode:
        add("vacation_mode", "now", everyone, now, rolling_end, None)
    if inputs.nobody_home:
        add("nobody_home", "now", everyone, now, rolling_end, None)
    for area, entities in sorted(inputs.activity.items()):
        targets = [e for e, t in inputs.thermostats.items() if area in t.areas]
        add("activity", area, targets, now, rolling_end, {"entities": entities, "area": area})
    return out


def resolve(intents: list[Intent], now: datetime) -> list[Intent]:
    """At most one override per thermostat at a time: higher reasons trim lower ones around them."""
    by_thermostat: dict[str, list[Intent]] = {}
    for intent in intents:
        by_thermostat.setdefault(intent.entity_id, []).append(intent)
    out: list[Intent] = []
    for items in by_thermostat.values():
        items.sort(key=lambda i: (PRIORITY.index(i.kind), i.start, i.key))
        kept: list[Intent] = []
        for intent in items:
            start, end = intent.start, intent.end
            moved = True
            while moved and start < end:  # start only grows and end only shrinks: this ends
                moved = False
                for higher in kept:
                    if higher.start < end and start < higher.end:  # overlapping
                        moved = True
                        if higher.start <= start:
                            start = higher.end  # what is left after the higher one
                        else:
                            end = higher.start  # until the higher one starts; the rest comes back after it
            if end - start < MIN_LENGTH or end <= now:
                continue
            kept.append(replace(intent, start=start, end=end))
        out += kept
    return sorted(out, key=lambda i: (i.entity_id, i.start))
