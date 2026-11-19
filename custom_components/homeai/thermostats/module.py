"""Thermostats that speak the schedule contract: HomeAI's overrides, valve limits and schedule proposals.

- **Overrides for a while** (R2): from the presence calendar and live presence (`intents.py`). HomeAI sets them by
  itself, through the policy like any change of a device: by the autonomy level, and only observed during the
  observation period. Each carries `source: homeai`, a reason and a stable id. HomeAI renews its rolling overrides,
  trims them when a higher reason comes, and removes them when the reason is gone. When a person removes one on the
  thermostat, HomeAI does not set it again for the same reason and learns from it as from an undo.
- **Valve limits** (R2): while an activity entity is active (a desk's power), the thermostat's valve-limit `number`
  is set to `heating.activity_valve` and put back afterwards (with `heating.activity_action: valve_limit`).
- **Schedule proposals** (R4): from habits (`habits.py`), a new weekly schedule an administrator approves. A proposal
  that no longer fits the thermostat's schedule (someone edited it) is withdrawn and never runs.

Normal control does not change: people and HomeAI set a temperature or preset like on any thermostat (R2), and the
thermostat keeps that until its next block.
"""

from __future__ import annotations

import asyncio
from collections.abc import Callable
from datetime import datetime, timedelta
from typing import Any

from homeassistant.const import EVENT_STATE_CHANGED
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, State, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.debounce import Debouncer
from homeassistant.helpers.event import async_track_time_change
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from ..const import DOMAIN, LOGGER
from ..policy import ActionRequest, Risk
from ..settings import Target, parse_time
from . import contract
from .contract import Thermostat
from .habits import find_shifts, shifted_week
from .intents import Inputs, Intent, resolve, wanted

STORAGE_KEY = f"{DOMAIN}.thermostats"
NEAR = timedelta(minutes=1)
VERIFY_EVERY = timedelta(minutes=5)
RETRY_AFTER = timedelta(minutes=15)
GRACE = timedelta(minutes=2)  # an override this fresh may not be listed by the thermostat yet
MANUAL_MAX = 1000  # remembered manual changes per thermostat
OK = ("done", "unverified")
# A record's status: what became of HomeAI's request.
LIVE = ("applied", "approved")  # on the thermostat (approved: allowed, to be sent again with fresh times)
FINAL = ("refused", "expired", "removed")  # people said no or took it off: not again for this reason
ACTIVE_STATES = ("on", "playing")


def _iso(value: datetime) -> str:
    return value.isoformat(timespec="seconds")


def _time(value: Any) -> datetime | None:
    parsed = dt_util.parse_datetime(str(value)) if value else None
    return dt_util.as_utc(parsed) if parsed is not None else None


class Thermostats:
    def __init__(self, runtime: Any) -> None:
        self.rt = runtime
        self.hass: HomeAssistant = runtime.hass
        self._store: Store[dict[str, Any]] = Store(self.hass, 1, STORAGE_KEY)
        self.records: dict[str, dict[str, Any]] = {}  # override id → what HomeAI asked for and what came of it
        self.valves: dict[str, dict[str, Any]] = {}  # valve-limit number → HomeAI's limit
        self.proposals: dict[str, dict[str, Any]] = {}  # proposal key → a proposed new week
        self.manual: dict[str, list[list[Any]]] = {}  # thermostat → [[UTC time, temperature, preset]]
        self.preset_temps: dict[str, dict[str, float]] = {}  # thermostat → preset → temperature it means
        self.thermostats: dict[str, Thermostat] = {}
        self.last_wanted: list[Intent] = []
        self._nobody_since: datetime | None = None
        self._active_since: dict[str, datetime] = {}
        self._inactive_since: dict[str, datetime] = {}
        self._verified = dt_util.utcnow() - VERIFY_EVERY
        self._recheck = True  # observed or refused-by-policy requests are judged again (policy changed)
        self._observing: bool | None = None
        self._lock = asyncio.Lock()
        self._unsubs: list[Callable[[], None]] = []
        self._debounce = Debouncer(self.hass, LOGGER, cooldown=2.0, immediate=False, function=self.reconcile)

    # ——— Lifecycle ———
    async def async_setup(self) -> None:
        data = await self._store.async_load() or {}
        self.records = {k: v for k, v in (data.get("records") or {}).items() if isinstance(v, dict)}
        self.valves = {k: v for k, v in (data.get("valves") or {}).items() if isinstance(v, dict)}
        self.proposals = {k: v for k, v in (data.get("proposals") or {}).items() if isinstance(v, dict)}
        self.manual = {k: v for k, v in (data.get("manual") or {}).items() if isinstance(v, list)}
        self.preset_temps = {k: v for k, v in (data.get("preset_temps") or {}).items() if isinstance(v, dict)}
        bus = self.hass.bus
        self._unsubs += [
            self.rt.on_tick(self._on_tick),
            bus.async_listen(EVENT_STATE_CHANGED, self._on_state, event_filter=_climate),
            self.rt.settings.listen("heating", self._settings_changed),
            self.rt.settings.listen("policy", self._settings_changed),
            self.rt.settings.listen("world", self._settings_changed),
        ]
        if (approvals := self.rt.module("approvals")) is not None:
            self._unsubs += [approvals.listen(self._on_approval), approvals.add_check(self._stale_approval)]
        if (exceptions := self.rt.module("presence_exceptions")) is not None:
            self._unsubs.append(exceptions.listen(self.schedule_reconcile))
        # Proposals are made at the review time (evening by default), when an administrator can answer before the
        # request expires; refused or policy-blocked requests are judged again once a day.
        daily = parse_time(str(self.rt.settings.get("learning.review_time")))
        self._unsubs.append(
            async_track_time_change(self.hass, self._daily, hour=daily.hour, minute=daily.minute, second=30)
        )

    async def async_unload(self) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        self._debounce.async_cancel()
        await self._store.async_save(self._data())

    def _data(self) -> dict[str, Any]:
        return {
            "records": self.records,
            "valves": self.valves,
            "proposals": self.proposals,
            "manual": self.manual,
            "preset_temps": self.preset_temps,
        }

    def _save(self) -> None:
        self._store.async_delay_save(self._data, 5)

    @callback
    def schedule_reconcile(self) -> None:
        self.hass.async_create_task(self._debounce.async_call())

    @callback
    def _settings_changed(self, _key: str) -> None:
        self._recheck = True
        self.schedule_reconcile()

    async def _on_tick(self, now: datetime) -> None:
        await self.reconcile(now)

    # ——— What HomeAI wants ———
    def _enabled(self) -> bool:
        if not self.rt.settings.get("heating.enabled"):
            return False
        policy = self.rt.module("policy")
        return policy is None or policy.level(Risk.R2, "homeai") != "never"

    def _target(self, entity_id: str) -> Target:
        return self.rt.world.target(entity_id)

    def _preset(self, kind: str, entity_id: str) -> str:
        key = "away" if kind == "vacation_mode" else kind
        return str(self.rt.settings.get(f"heating.{key}_preset", self._target(entity_id)) or "")

    def _describe(self, kind: str, source: dict[str, Any] | None) -> str:
        exceptions = self.rt.module("presence_exceptions")
        if kind in ("guests", "sick", "home_office") and source and exceptions is not None:
            return exceptions.describe(source)
        if kind == "away" and source and exceptions is not None:
            if source.get("person"):  # every resident's own trip at once
                return self.rt.text("heating|reason_everyone_away")
            return exceptions.describe(source)
        if kind == "activity" and source:
            names = [self.rt.world.display_name(e) for e in source.get("entities", [])]
            return self.rt.text("heating|reason_activity", names=names)
        return self.rt.text(f"heating|reason_{kind}")

    def _nobody_home(self, now: datetime) -> bool:
        presence = self.rt.presence
        if not presence.everyone_away():
            self._nobody_since = None
            return False
        if self._nobody_since is None:
            # after a restart: since the last resident left, as far as their states tell
            changed = [
                s.last_changed for p in presence.residents() if (s := self.hass.states.get(p.entity_id)) is not None
            ]
            self._nobody_since = max(changed, default=now)
        minutes = int(self.rt.settings.get("heating.nobody_home_minutes"))
        return minutes > 0 and now - self._nobody_since >= timedelta(minutes=minutes)

    def _vacation_mode(self) -> bool:
        presence = self.rt.presence
        if self.rt.settings.get("presence.vacation_mode"):
            return True
        mode = presence.house_mode()
        return bool(mode and mode in self.rt.settings.get("presence.vacation_states"))

    def activity(self, now: datetime) -> dict[str, list[str]]:
        """Rooms with an active activity entity (held for `heating.activity_minutes`, and until it has been
        inactive for `heating.activity_off_minutes`)."""
        world, settings = self.rt.world, self.rt.settings
        label = world.label("label_activity")
        hold = timedelta(minutes=int(settings.get("heating.activity_minutes")))
        off = timedelta(minutes=int(settings.get("heating.activity_off_minutes")))
        out: dict[str, list[str]] = {}
        labelled = {e for e, info in world.entities.items() if label in info.labels}
        for entity_id in list(self._active_since):
            if entity_id not in labelled:
                self._active_since.pop(entity_id, None)
                self._inactive_since.pop(entity_id, None)
        for entity_id in sorted(labelled):
            info = world.entities[entity_id]
            if self._is_active(entity_id):
                self._inactive_since.pop(entity_id, None)
                self._active_since.setdefault(entity_id, now)
            elif entity_id in self._active_since:
                since = self._inactive_since.setdefault(entity_id, now)
                if now - since >= off:
                    self._active_since.pop(entity_id, None)
                    self._inactive_since.pop(entity_id, None)
            started = self._active_since.get(entity_id)
            if started is not None and now - started >= hold and info.area_id:
                out.setdefault(info.area_id, []).append(entity_id)
        return out

    def _is_active(self, entity_id: str) -> bool:
        state = self.hass.states.get(entity_id)
        if state is None or state.state in ("unavailable", "unknown"):
            return False
        try:
            value = float(state.state)
        except ValueError:
            return state.state in ACTIVE_STATES
        threshold = float(self.rt.settings.get("heating.activity_power", self._target(entity_id)))
        return value >= threshold

    def inputs(self, now: datetime) -> Inputs:
        settings, world, presence = self.rt.settings, self.rt.world, self.rt.presence
        lead = timedelta(hours=int(settings.get("heating.lead_hours")))
        exceptions = self.rt.module("presence_exceptions")
        items = []
        if exceptions is not None:
            from ..schedule.presence import parse_moment

            for item in exceptions.between(now, now + lead + timedelta(minutes=1)):
                items.append({**item, "start": parse_moment(item["start"]), "end": parse_moment(item["end"])})
        residents = [p.entity_id for p in presence.residents()]
        return Inputs(
            now=now,
            thermostats=self.thermostats,
            roles=world.room_roles,
            exceptions=items,
            residents=residents,
            workplaces={p: set(settings.get("presence.workplace_areas", Target(person_id=p)) or ()) for p in residents},
            all_workplaces=world.areas_with_role("workplace"),
            lead=lead,
            rolling=timedelta(hours=int(settings.get("heating.rolling_hours"))),
            preset=self._preset,
            enabled=lambda e: bool(settings.get("heating.presence_overrides", self._target(e))),
            describe=self._describe,
            nobody_home=self._nobody_home(now),
            vacation_mode=self._vacation_mode(),
            activity=self.activity(now) if settings.get("heating.activity_action") != "off" else {},
        )

    def wanted(self, now: datetime) -> tuple[list[Intent], dict[str, dict[str, Any]]]:
        """Overrides HomeAI wants now, and valve limits (number entity → limit) for activity in `valve_limit` mode."""
        if not self.thermostats or not self._enabled():
            return [], {}
        inputs = self.inputs(now)
        intents = wanted(inputs)
        valves: dict[str, dict[str, Any]] = {}
        if self.rt.settings.get("heating.activity_action") == "valve_limit":
            keep = []
            for intent in intents:
                valve = self.valve_entity(self.thermostats[intent.entity_id]) if intent.kind == "activity" else None
                if valve is None:
                    keep.append(intent)
                    continue
                limit = int(self.rt.settings.get("heating.activity_valve", self._target(intent.entity_id)))
                valves[valve] = {"thermostat": intent.entity_id, "value": limit, "reason": intent.reason}
            intents = keep
        return resolve(intents, now), valves

    def valve_entity(self, t: Thermostat) -> str | None:
        """The thermostat's valve-limit `number`: the one set in `heating.valve_limit_entity`, else a number of the same
        device whose translation key or id says valve_limit."""
        configured = self.rt.settings.get(
            "heating.valve_limit_entity", Target(entity_id=t.entity_id, device_id=t.device_id)
        )
        if configured and self.hass.states.get(configured) is not None:
            return str(configured)
        if not t.device_id:
            return None
        for entry in er.async_entries_for_device(er.async_get(self.hass), t.device_id):
            if entry.domain == "number" and (
                entry.translation_key == "valve_limit" or entry.entity_id.endswith("_valve_limit")
            ):
                return entry.entity_id
        return None

    # ——— Keeping the thermostats in line ———
    async def reconcile(self, now: datetime | None = None) -> None:
        if not self.rt.ready or self.rt.module("executor") is None:
            return
        async with self._lock:
            now = now or dt_util.utcnow()
            policy = self.rt.module("policy")
            observing = bool(policy and policy.observing(now))
            if self._observing is not None and observing != self._observing:
                self._recheck = True  # the observation period ended: what was only observed may run now
            self._observing = observing
            self.thermostats = contract.discover(self.hass, self.rt.world)
            intents, valves = self.wanted(now)
            self.last_wanted = intents
            try:
                await self._overrides(intents, now)
                await self._valves(valves, now)
                if now - self._verified >= VERIFY_EVERY:
                    self._verified = now
                    await self._verify(now)
            finally:
                self._recheck = False
                self._save()

    def _request(self, intent: Intent, now: datetime, *, follow_up: bool = False) -> ActionRequest:
        t = self.thermostats[intent.entity_id]
        data: dict[str, Any] = {
            "end": _iso(dt_util.as_local(intent.end)),
            "preset_mode": intent.preset,
            "reason": intent.reason[: contract.REASON_MAX],
            "source": contract.SOURCE,
            "override_id": intent.override_id,
        }
        if intent.start > now + NEAR:
            data["start"] = _iso(dt_util.as_local(intent.start))
        return ActionRequest(
            t.domain,
            "add_override",
            data,
            entity_ids=[intent.entity_id],
            actor="homeai",
            reason=intent.reason,
            follow_up=follow_up,
        )

    def _same(self, record: dict[str, Any], intent: Intent, now: datetime) -> bool:
        if record.get("preset") != intent.preset:
            return False
        start, end = _time(record.get("start")), _time(record.get("end"))
        if start is None or end is None:
            return False
        if not ((start <= now + NEAR and intent.start <= now + NEAR) or abs(start - intent.start) < NEAR):
            return False
        if intent.rolling:
            half = timedelta(hours=int(self.rt.settings.get("heating.rolling_hours"))) / 2
            return end - now >= half
        return abs(end - intent.end) < NEAR

    async def _overrides(self, intents: list[Intent], now: datetime) -> None:
        by_id = {i.override_id: i for i in intents}
        for oid, record in list(self.records.items()):
            end = _time(record.get("end"))
            if oid not in by_id:
                await self._drop(oid, record, now)
            elif end is not None and end <= now and record["status"] not in FINAL:
                if record["status"] == "pending":
                    await self._withdraw(record)  # asked about times that are over: ask afresh below
                del self.records[oid]  # over: the thermostat drops an override that has ended
        for oid, intent in by_id.items():
            t = self.thermostats.get(intent.entity_id)
            if t is None or not t.available:
                continue
            record = self.records.get(oid)
            if record is None:
                await self._start(intent, now)
                continue
            status = record["status"]
            if status in FINAL:
                continue
            retry = _time(record.get("retry_at"))
            if retry is not None and retry > now:
                continue
            if status == "pending":
                if not self._same(record, intent, now) and not intent.rolling:
                    await self._withdraw(record)
                    await self._start(intent, now)
            elif status in ("observed", "denied"):
                if self._recheck:
                    await self._start(intent, now)
                else:
                    self._remember(record, intent)  # keep the times current without asking again
            elif status == "approved":
                await self._start(intent, now, follow_up=True)  # allowed: send it with current times
            elif status == "applied":
                if not self._same(record, intent, now):
                    # renew or move it: the same reason and preset continue without a new decision
                    await self._start(intent, now, follow_up=record.get("preset") == intent.preset)
            else:  # failed, or a request that was withdrawn
                await self._start(intent, now)

    def _remember(self, record: dict[str, Any], intent: Intent) -> None:
        record.update(
            preset=intent.preset,
            start=_iso(intent.start),
            end=_iso(intent.end),
            reason=intent.reason,
            kind=intent.kind,
            entity_id=intent.entity_id,
        )

    async def _start(self, intent: Intent, now: datetime, *, follow_up: bool = False) -> None:
        executor = self.rt.module("executor")
        request = self._request(intent, now, follow_up=follow_up)
        result = await executor.execute(request)
        record = self.records.get(intent.override_id) or {"created": _iso(now)}
        if follow_up and result.status in ("failed", "invalid", "blocked"):
            # renewing failed (the thermostat is busy or away): it keeps the override it has; try again later
            record["retry_at"] = _iso(now + RETRY_AFTER)
            self.records[intent.override_id] = record
            return
        status = {
            "done": "applied",
            "unverified": "applied",
            "pending_approval": "pending",
            "observed": "observed",
            "denied": "denied",
        }.get(result.status, "failed")
        self._remember(record, intent)
        record.update(
            domain=request.domain,
            status=status,
            at=_iso(now),
            approval_id=result.approval_id,
            message=result.message,
            retry_at=_iso(now + RETRY_AFTER) if status == "failed" else None,
        )
        self.records[intent.override_id] = record

    async def _withdraw(self, record: dict[str, Any]) -> None:
        approvals = self.rt.module("approvals")
        if approvals is not None and record.get("approval_id"):
            await approvals.withdraw(record["approval_id"])

    async def _drop(self, oid: str, record: dict[str, Any], now: datetime) -> None:
        """The reason is gone: take HomeAI's override off the thermostat (or stop asking for it)."""
        status = record["status"]
        end = _time(record.get("end"))
        retry = _time(record.get("retry_at"))
        if retry is not None and retry > now:
            return
        if status == "pending":
            await self._withdraw(record)
        elif status in LIVE and end is not None and end > now:
            t = self.thermostats.get(record["entity_id"])
            if t is None:
                if self.hass.states.get(record["entity_id"]) is not None:
                    return  # it speaks the contract no more or is out of scope for now: try again later
            elif not t.available:
                return  # cannot reach it now: try again later
            else:
                result = await self.rt.module("executor").execute(
                    ActionRequest(
                        t.domain,
                        "remove_override",
                        {"override_id": oid},
                        entity_ids=[t.entity_id],
                        actor="homeai",
                        reason=self.rt.text("heating|reason_gone", reason=record.get("reason") or ""),
                        follow_up=True,
                    )
                )
                if result.status == "failed" and int(record.get("tries") or 0) < 3:
                    # try again a few times; after that the override still ends on its own at its end
                    record.update(tries=int(record.get("tries") or 0) + 1, retry_at=_iso(now + RETRY_AFTER))
                    return
        self.records.pop(oid, None)

    # ——— Valve limits ———
    async def _valves(self, wanted: dict[str, dict[str, Any]], now: datetime) -> None:
        executor = self.rt.module("executor")
        for entity_id, record in list(self.valves.items()):
            if entity_id in wanted:
                continue
            if record["status"] == "pending":
                await self._withdraw(record)
            elif record["status"] in LIVE and (state := self.hass.states.get(entity_id)) is not None:
                current = _number(state)
                previous = record.get("previous")
                # a person changed the limit meanwhile: theirs stays
                if previous is not None and current is not None and abs(current - float(record["value"])) < 0.5:
                    await executor.execute(
                        ActionRequest(
                            "number",
                            "set_value",
                            {"value": previous},
                            entity_ids=[entity_id],
                            actor="homeai",
                            reason=self.rt.text("heating|reason_gone", reason=record.get("reason") or ""),
                            follow_up=True,
                        )
                    )
            del self.valves[entity_id]
        for entity_id, want in wanted.items():
            record = self.valves.get(entity_id)
            status = record["status"] if record is not None else None
            retry = _time((record or {}).get("retry_at"))
            if status in ("applied", "pending", *FINAL) or (status in ("observed", "denied") and not self._recheck):
                continue
            if status == "failed" and retry is not None and retry > now:
                continue
            state = self.hass.states.get(entity_id)
            if state is None or state.state in ("unavailable", "unknown"):
                continue
            result = await executor.execute(
                ActionRequest(
                    "number",
                    "set_value",
                    {"value": want["value"]},
                    entity_ids=[entity_id],
                    actor="homeai",
                    reason=want["reason"],
                    follow_up=status == "approved",
                )
            )
            status = {
                "done": "applied",
                "unverified": "applied",
                "pending_approval": "pending",
                "observed": "observed",
                "denied": "denied",
            }.get(result.status, "failed")
            self.valves[entity_id] = {
                **want,
                "previous": (record or {}).get("previous", _number(state)),
                "status": status,
                "approval_id": result.approval_id,
                "at": _iso(now),
                "retry_at": _iso(now + RETRY_AFTER) if status == "failed" else None,
            }

    # ——— People's say ———
    @callback
    def _on_approval(self, item: dict[str, Any]) -> None:
        approval_id, status = item["id"], item["status"]
        for record in [*self.records.values(), *self.valves.values(), *self.proposals.values()]:
            if record.get("approval_id") != approval_id or record.get("status") != "pending":
                continue
            if status == "approved":
                done = (item.get("result") or {}).get("status") in OK
                record["status"] = "applied" if done else "approved"
            elif status in ("denied", "expired"):
                record["status"] = "refused" if status == "denied" else "expired"
            elif status == "withdrawn":
                record["status"] = "withdrawn"
            record["decided_at"] = _iso(dt_util.utcnow())
            self._save()
            self.schedule_reconcile()

    async def _verify(self, now: datetime) -> None:
        """A person took HomeAI's override off the thermostat: respect it, and learn from it as from an undo."""
        live: dict[str, list[tuple[str, dict[str, Any]]]] = {}
        for oid, record in self.records.items():
            at, end = _time(record.get("at")), _time(record.get("end"))
            if record["status"] == "applied" and at and end and at < now - GRACE and end > now + NEAR:
                live.setdefault(record["entity_id"], []).append((oid, record))
        for entity_id, items in live.items():
            t = self.thermostats.get(entity_id)
            if t is None or not t.available:
                continue
            schedule = await contract.get_schedule(self.hass, t)
            if schedule is None:
                continue
            present = contract.override_ids(schedule)
            for oid, record in items:
                if oid in present:
                    continue
                record.update(status="removed", decided_at=_iso(now))
                self.rt.journal.add(
                    "decision",
                    self.rt.text(
                        "heating|override_removed",
                        name=self.rt.world.display_name(entity_id),
                        reason=record.get("reason") or "",
                    ),
                )
                learning = self.rt.module("learning")
                if learning is not None:
                    learning.feedback("undo", {"request": self._request_for(record, t).as_dict()})
        await self._check_proposals()

    def _request_for(self, record: dict[str, Any], t: Thermostat) -> ActionRequest:
        return ActionRequest(
            t.domain,
            "add_override",
            {"preset_mode": record.get("preset")},
            entity_ids=[t.entity_id],
            actor="homeai",
        )

    # ——— Manual changes and what presets mean ———
    @callback
    def _on_state(self, event: Event[EventStateChangedData]) -> None:
        new, old = event.data["new_state"], event.data["old_state"]
        if new is None or contract.contract_domain(new) is None:
            return
        temperature, preset = new.attributes.get("temperature"), new.attributes.get("preset_mode")
        changed = old is None or (
            old.attributes.get("temperature") != temperature or old.attributes.get("preset_mode") != preset
        )
        if not changed:
            return
        if self._manual(new) and old is not None:
            log = self.manual.setdefault(new.entity_id, [])
            log.append([_iso(dt_util.utcnow()), temperature, preset if preset not in (None, "none") else None])
            del log[:-MANUAL_MAX]
        elif preset not in (None, "none") and isinstance(temperature, (int, float)):
            self.preset_temps.setdefault(new.entity_id, {})[str(preset)] = float(temperature)
        self._save()

    def _manual(self, state: State) -> bool:
        """A person changed it: in the app or by voice (their user), or through an automation a remote or a button
        started (a parent context). Not the thermostat's own schedule (a fresh context) and not HomeAI."""
        ctx = state.context
        if ctx.user_id:
            return ctx.user_id != self.rt.system_user_id
        return ctx.parent_id is not None

    # ——— Schedule proposals ———
    async def _daily(self, _now: datetime) -> None:
        self._recheck = True
        try:
            await self.propose()
        except Exception:
            LOGGER.exception("Thermostat schedule proposals failed")

    def _prune_manual(self, now: datetime) -> None:
        keep = now - timedelta(days=int(self.rt.settings.get("learning.habit_days")) + 1)
        for entity_id in list(self.manual):
            self.manual[entity_id] = [c for c in self.manual[entity_id] if (t := _time(c[0])) and t >= keep]
            if not self.manual[entity_id]:
                del self.manual[entity_id]

    async def propose(self, now: datetime | None = None) -> list[dict[str, Any]]:
        """Look for habits that call for a different weekly schedule and propose one (R4)."""
        settings = self.rt.settings
        now = now or dt_util.utcnow()
        self._prune_manual(now)
        if not (
            settings.get("heating.enabled")
            and settings.get("heating.schedule_proposals")
            and settings.get("learning.enabled")
            and settings.get("learning.habits")
        ):
            return []
        self.thermostats = contract.discover(self.hass, self.rt.world)
        await self._check_proposals()
        made = []
        quiet = timedelta(days=int(settings.get("learning.deny_quiet_days")))
        for t in self.thermostats.values():
            if not t.available or not self.hass.services.has_service(t.domain, "set_schedule"):
                continue
            if any(p["entity_id"] == t.entity_id and p["status"] == "pending" for p in self.proposals.values()):
                continue
            changes = [
                (dt_util.as_local(at), c[1], c[2]) for c in self.manual.get(t.entity_id, []) if (at := _time(c[0]))
            ]
            if not changes:
                continue
            schedule = await contract.get_schedule(self.hass, t)
            week = contract.canonical_week(schedule["weekly"]) if schedule and schedule["enabled"] else None
            if not week:
                continue
            shifts = find_shifts(
                week,
                changes,
                self.preset_temps.get(t.entity_id, {}),
                today=dt_util.as_local(now).date(),
                days=int(settings.get("learning.habit_days")),
                min_days=int(settings.get("learning.habit_min_days")),
                window=int(settings.get("learning.habit_window")),
                max_shift=int(settings.get("heating.proposal_max_shift")),
            )
            for shift in shifts:
                key = f"{t.entity_id}|{','.join(shift['days'])}|{shift['from']}|{shift['to']}"
                previous = self.proposals.get(key)
                decided = _time((previous or {}).get("decided_at") or (previous or {}).get("created"))
                if previous is not None and (previous["status"] == "applied" or (decided and now - decided < quiet)):
                    continue
                new_week = shifted_week(week, shift)
                if new_week is None:
                    continue
                proposal = await self._propose(t, week, new_week, shift, key, now)
                if proposal is not None:
                    made.append(proposal)
                    break  # one change per thermostat at a time
        self._save()
        return made

    async def _propose(
        self,
        t: Thermostat,
        week: list[dict[str, Any]],
        new_week: list[dict[str, Any]],
        shift: dict[str, Any],
        key: str,
        now: datetime,
    ) -> dict[str, Any] | None:
        reason = self.rt.text(
            "heating|proposal_reason",
            days=self.rt.text(f"heating|days_{shift['kind']}"),
            name=self.rt.world.display_name(t.entity_id),
            **{"from": shift["from"], "to": shift["to"], "seen": shift["seen"], "possible": shift["possible"]},
        )
        request = ActionRequest(
            t.domain, "set_schedule", {"weekly": new_week}, entity_ids=[t.entity_id], actor="homeai", reason=reason
        )
        result = await self.rt.module("executor").execute(request)
        if result.status not in ("pending_approval", "observed"):
            return None
        proposal = {
            "key": key,
            "entity_id": t.entity_id,
            "status": "pending" if result.status == "pending_approval" else "observed",
            "approval_id": result.approval_id,
            "base": contract.week_hash(week),
            "shift": shift,
            "reason": reason,
            "created": _iso(now),
        }
        self.proposals[key] = proposal
        while len(self.proposals) > 100:
            self.proposals.pop(next(iter(self.proposals)))
        return proposal

    async def _check_proposals(self) -> None:
        """Withdraw proposals whose thermostat's week changed since they were made."""
        for proposal in self.proposals.values():
            if proposal["status"] != "pending":
                continue
            if await self._outdated(proposal):
                await self._withdraw(proposal)

    async def _outdated(self, proposal: dict[str, Any]) -> bool:
        t = self.thermostats.get(proposal["entity_id"])
        if t is None:
            t = contract.discover(self.hass, self.rt.world).get(proposal["entity_id"])
        if t is None:
            return True
        schedule = await contract.get_schedule(self.hass, t)
        if schedule is None:
            return False  # cannot tell now; approving will check again
        return contract.week_hash(schedule["weekly"]) != proposal["base"]

    async def _stale_approval(self, item: dict[str, Any]) -> bool:
        """Approvals ask before running: a schedule proposal must still fit the thermostat's current week."""
        proposal = next((p for p in self.proposals.values() if p.get("approval_id") == item["id"]), None)
        if proposal is None:
            return False
        t = contract.discover(self.hass, self.rt.world).get(proposal["entity_id"])
        if t is None:
            return True
        schedule = await contract.get_schedule(self.hass, t)
        return schedule is None or contract.week_hash(schedule["weekly"]) != proposal["base"]

    # ——— Reading ———
    async def overview(self, entity_id: str | None = None, temperature: float | None = None) -> list[dict[str, Any]]:
        """Thermostats with their schedule, overrides and HomeAI's reasons (for AI tools and diagnostics)."""
        out = []
        self.thermostats = contract.discover(self.hass, self.rt.world)
        for t in self.thermostats.values():
            if entity_id and t.entity_id != entity_id:
                continue
            schedule = await contract.get_schedule(self.hass, t) if t.available else None
            item: dict[str, Any] = {
                "entity_id": t.entity_id,
                "rooms": [
                    {"area": self.rt.world.area_name(a), "roles": sorted(self.rt.world.room_roles(a))} for a in t.areas
                ],
                "schedule": schedule,
                "homeai_overrides": [
                    {k: r.get(k) for k in ("kind", "preset", "start", "end", "reason", "status")}
                    for r in self.records.values()
                    if r.get("entity_id") == t.entity_id
                ],
            }
            if temperature is not None and t.available:
                item["estimate"] = await contract.estimate(self.hass, t, temperature)
            out.append(item)
        return out

    def diagnostics(self) -> dict[str, Any]:
        return {
            "thermostats": {e: {"domain": t.domain, "areas": list(t.areas)} for e, t in self.thermostats.items()},
            "records": self.records,
            "valves": self.valves,
            "proposals": list(self.proposals.values())[-20:],
            "manual_changes": {e: len(v) for e, v in self.manual.items()},
            "wanted": [
                {
                    "kind": i.kind,
                    "thermostat": i.entity_id,
                    "preset": i.preset,
                    "start": _iso(i.start),
                    "end": _iso(i.end),
                }
                for i in self.last_wanted
            ],
        }


@callback
def _climate(event_data: EventStateChangedData) -> bool:
    return event_data["entity_id"].startswith("climate.")


def _number(state: State) -> float | None:
    try:
        return float(state.state)
    except TypeError, ValueError:
        return None
