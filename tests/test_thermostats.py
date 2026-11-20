"""Thermostats with HomeAI's schedule contract: overrides from presence, cleanup, policy, activity, proposals."""

from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import Context, HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.homeai.policy import ActionRequest, Risk, Verdict
from custom_components.homeai.thermostats import contract
from custom_components.homeai.thermostats.habits import find_shifts, shifted_week
from custom_components.homeai.thermostats.intents import Inputs, Intent, household_trips, resolve, wanted

from .common import setup_homeai
from .thermostat import FakeHeat, heated_home

ACT = {"policy.observation_days": 0, "policy.autonomy_r2": "act", "executor.verify_seconds": 0}
NOW = "2026-11-18 17:00:00+00:00"  # a Wednesday, 9:00 in the tests' time zone (US/Pacific)


def local(text: str) -> datetime:
    return dt_util.as_utc(datetime.fromisoformat(text).replace(tzinfo=dt_util.get_default_time_zone()))


async def thermostats_rt(hass: HomeAssistant, settings: dict[str, Any] | None = None, **kw: Any) -> tuple[Any, Any]:
    _home, heat = heated_home(hass)
    rt = await setup_homeai(hass, {**ACT, **(settings or {})}, **kw)
    return rt, heat


def preset_calls(heat: FakeHeat, entity_id: str) -> list[str]:
    return [c.data["preset_mode"] for c in heat.calls_of("add_override") if entity_id in c.data["entity_id"]]


# ——— The contract ———
async def test_discovery_and_risk(hass: HomeAssistant) -> None:
    rt, _heat = await thermostats_rt(hass)
    found = contract.discover(hass, rt.world)
    assert set(found) == {"climate.living", "climate.bedroom", "climate.bathroom"}
    assert found["climate.living"].domain == "fake_heat" and found["climate.living"].areas
    # a climate entity without the attribute, or with another version, does not speak it
    hass.states.async_set("climate.other", "heat", {"homeai_schedule": {"version": 2, "domain": "fake_heat"}})
    hass.states.async_set("climate.plain", "heat", {})
    await hass.async_block_till_done()
    assert set(contract.discover(hass, rt.world)) == set(found)

    policy = rt.module("policy")

    def risk(service: str, entity: str = "climate.living", domain: str = "fake_heat") -> Risk:
        return policy.risk(ActionRequest(domain, service, {}, entity_ids=[entity]))

    assert risk("get_schedule") == Risk.R0 and risk("estimate") == Risk.R0
    assert risk("add_override") == Risk.R2 and risk("remove_override") == Risk.R2
    assert risk("set_schedule") == Risk.R4
    # normal control is unchanged: a thermostat is a device
    assert risk("set_temperature", domain="climate") == Risk.R2
    assert risk("set_preset_mode", domain="climate") == Risk.R2
    # a lower class for the thermostat never makes a new week automatic
    rt.settings.set("policy.risk_override", "R1", skey="entity:climate.living", confirmed=True)
    assert risk("add_override") == Risk.R1
    assert risk("set_schedule") == Risk.R4
    decision = await policy.decide(
        ActionRequest("fake_heat", "set_schedule", {"weekly": []}, entity_ids=["climate.living"], actor="homeai")
    )
    assert decision.verdict is Verdict.ASK and decision.approver == "admins"
    # the same service names on a climate entity that does not announce the contract are not contract services
    assert risk("set_schedule", entity="climate.plain") == Risk.R2


async def test_room_roles(hass: HomeAssistant) -> None:
    rt, _heat = await thermostats_rt(hass)
    world, h = rt.world, None
    from .home import Home

    h = Home(hass)
    living, bedroom, bathroom = h.area("Living room"), h.area("Bedroom"), h.area("Bathroom")
    office = h.area("Study corner")
    await hass.async_block_till_done()
    world.rebuild()  # areas are picked up after a short pause; do it now
    assert world.room_roles(living) == {"common"}  # the sofa icon
    assert world.room_roles(bedroom) == {"bedroom"} and world.room_roles(bathroom) == {"bathroom"}
    assert world.room_roles(office) == {"workplace"}  # “study” in the name
    # a label on a device in the room gives the role; the administrator's choice wins over everything
    desk = h.device("Desk lamp", area="Living room", labels=("HomeAI: workplace",))
    h.entity("light.desk", "off", device=desk)
    await hass.async_block_till_done()
    world.rebuild()
    assert world.room_roles(living) == {"workplace"}
    rt.settings.set("world.room_roles", ["common", "workplace"], skey=f"area:{living}", confirmed=True)
    assert world.room_roles(living) == {"common", "workplace"}
    rt.settings.set("world.room_roles", ["none"], skey=f"area:{office}", confirmed=True)
    assert world.room_roles(office) == frozenset()
    rt.settings.set("world.room_roles_auto", False, confirmed=True)
    assert world.room_roles(bedroom) == frozenset()
    assert world.areas_with_role("workplace") == {living}


# ——— What HomeAI wants (pure) ———
def _thermostat(entity_id: str, *areas: str) -> contract.Thermostat:
    return contract.Thermostat(entity_id, "fake_heat", areas, None, ("comfort", "eco", "away", "sleep"), True)


def _inputs(now: datetime, **kw: Any) -> Inputs:
    roles = {"living": frozenset({"common", "workplace"}), "bed": frozenset({"bedroom"}), "office": frozenset()}
    base: dict[str, Any] = {
        "now": now,
        "thermostats": {
            "climate.living": _thermostat("climate.living", "living"),
            "climate.bed": _thermostat("climate.bed", "bed"),
        },
        "roles": lambda a: roles.get(a, frozenset()),
        "exceptions": [],
        "residents": ["person.anna", "person.ben"],
        "workplaces": {},
        "lead": timedelta(hours=12),
        "rolling": timedelta(hours=4),
        "preset": lambda kind, _e: {"away": "away", "nobody_home": "eco", "vacation_mode": "away"}.get(kind, "comfort"),
        "enabled": lambda _e: True,
        "describe": lambda kind, _s: kind,
        "all_workplaces": {"living"},
    }
    base.update(kw)
    return Inputs(**base)


def test_household_trips_need_everyone() -> None:
    now = dt_util.utcnow()
    trips = [
        {"id": "a", "kind": "vacation", "person": "person.anna", "start": now, "end": now + timedelta(days=5)},
        {
            "id": "b",
            "kind": "away",
            "person": "person.ben",
            "start": now + timedelta(days=1),
            "end": now + timedelta(days=7),
        },
    ]
    spans = household_trips(_inputs(now, exceptions=trips))
    assert [(s - now, e - now) for s, e, _k, _i in spans] == [(timedelta(days=1), timedelta(days=5))]
    # only one person away: nobody's trip warms or cools the home
    assert household_trips(_inputs(now, exceptions=trips[:1])) == []


def test_guests_warm_common_rooms_and_home_office_the_workplace() -> None:
    now = dt_util.utcnow()
    items = [
        {"id": "g", "kind": "guests", "person": None, "start": now, "end": now + timedelta(hours=5)},
        {"id": "w", "kind": "home_office", "person": "person.anna", "start": now, "end": now + timedelta(hours=8)},
    ]
    found = wanted(_inputs(now, exceptions=items))
    assert {(i.kind, i.entity_id) for i in found} == {("guests", "climate.living"), ("home_office", "climate.living")}
    # a person with a workplace of their own
    found = wanted(_inputs(now, exceptions=items[1:], workplaces={"person.anna": {"bed"}}))
    assert [(i.kind, i.entity_id) for i in found] == [("home_office", "climate.bed")]
    # a calendar event further ahead than the lead is not sent yet
    later = [{**items[0], "start": now + timedelta(hours=13), "end": now + timedelta(hours=15)}]
    assert wanted(_inputs(now, exceptions=later)) == []


def test_resolve_trims_lower_reasons() -> None:
    now = dt_util.utcnow()

    def intent(kind: str, start: float, end: float) -> Intent:
        return Intent(kind, kind, "climate.living", "x", now + timedelta(hours=start), now + timedelta(hours=end), kind)

    out = resolve([intent("home_office", 0, 10), intent("guests", 4, 6)], now)
    assert [(i.kind, (i.start - now).seconds // 3600, (i.end - now).seconds // 3600) for i in out] == [
        ("home_office", 0, 4),
        ("guests", 4, 6),
    ]
    # the higher one covers the start: the lower one waits for it to end
    out = resolve([intent("sick", 0, 10), intent("nobody_home", 0, 4)], now)
    assert [(i.kind, (i.start - now).seconds // 3600) for i in out] == [("nobody_home", 0), ("sick", 4)]
    # fully covered: nothing left of it now
    assert [i.kind for i in resolve([intent("sick", 1, 2), intent("away", 0, 5)], now)] == ["away"]


# ——— Overrides from presence ———
async def test_vacation_sets_away_and_cleans_up(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    freezer.move_to(NOW)
    rt, heat = await thermostats_rt(hass)
    module, exceptions = rt.module("thermostats"), rt.module("presence_exceptions")
    item = exceptions.save({"kind": "vacation", "start": "2026-11-18T08:00:00", "end": "2026-11-22"})
    await module.reconcile()
    calls = heat.calls_of("add_override")
    assert {c.data["entity_id"][0] for c in calls} == {"climate.living", "climate.bedroom", "climate.bathroom"}
    call = calls[0]
    assert call.data["preset_mode"] == "away" and call.data["source"] == "homeai"
    assert call.data["reason"] == "Vacation" and "start" not in call.data
    assert dt_util.parse_datetime(call.data["end"]) == local("2026-11-23T00:00:00")
    assert call.context.user_id == rt.system_user_id
    assert all(len(v) == 1 for v in heat.overrides.values())
    # nothing new while nothing changes
    await module.reconcile()
    assert len(heat.calls_of("add_override")) == 3
    # the trip is cancelled: HomeAI takes its overrides off
    exceptions.remove(item["id"])
    await module.reconcile()
    assert len(heat.calls_of("remove_override")) == 3
    assert all(not v for v in heat.overrides.values())
    assert module.records == {}


async def test_guests_home_office_and_sickness(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    freezer.move_to(NOW)
    rt, heat = await thermostats_rt(hass)
    module, exceptions = rt.module("thermostats"), rt.module("presence_exceptions")
    exceptions.save({"kind": "guests", "start": "2026-11-18T18:00:00", "end": "2026-11-18T23:00:00"})
    await module.reconcile()
    # sent ahead (within the lead), to the common room only, starting with the event
    [call] = heat.calls_of("add_override")
    assert call.data["entity_id"] == ["climate.living"] and call.data["preset_mode"] == "comfort"
    assert dt_util.parse_datetime(call.data["start"]) == local("2026-11-18T18:00:00")
    # working from home warms the person's workplace (the living room has a desk: workplace by setting)
    living = rt.world.entity("climate.living").area_id
    rt.settings.set("presence.workplace_areas", [living], skey="person:person.anna", confirmed=True)
    exceptions.save(
        {"kind": "home_office", "person": "person.anna", "start": "2026-11-18T08:00:00", "end": "2026-11-18T16:00"}
    )
    await module.reconcile()
    office = [c for c in heat.calls_of("add_override") if c.data["reason"] == "Working from home: Anna"]
    assert [c.data["entity_id"] for c in office] == [["climate.living"]]
    # sickness warms the whole home; the bedroom gets it, the living room keeps the higher reasons first
    exceptions.save({"kind": "sick", "person": "person.ben", "start": "2026-11-18T08:00:00", "end": "2026-11-19"})
    await module.reconcile()
    sick = {c.data["entity_id"][0] for c in heat.calls_of("add_override") if c.data["reason"] == "Sick: Ben"}
    assert {"climate.bedroom", "climate.bathroom"} <= sick
    kinds = {(r["entity_id"], r["kind"]) for r in module.records.values()}
    assert ("climate.living", "guests") in kinds and ("climate.bedroom", "sick") in kinds


async def test_nobody_home_goes_eco_until_someone_is_back(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    freezer.move_to(NOW)
    rt, heat = await thermostats_rt(hass, {"heating.nobody_home_minutes": 30})
    module = rt.module("thermostats")
    hass.states.async_set("person.anna", "not_home", {"friendly_name": "Anna"})
    hass.states.async_set("person.ben", "not_home", {"friendly_name": "Ben"})
    await hass.async_block_till_done()
    await module.reconcile()
    assert heat.calls_of("add_override") == []  # not long enough yet
    freezer.tick(timedelta(minutes=31))
    await module.reconcile()
    assert set(preset_calls(heat, "climate.living")) == {"eco"}
    first_end = dt_util.parse_datetime(heat.calls_of("add_override")[0].data["end"])
    assert first_end == dt_util.utcnow() + timedelta(hours=4)
    # renewed before it runs out, with the same id and without asking again
    rt.settings.set("policy.autonomy_r2", "propose", confirmed=True)
    freezer.tick(timedelta(hours=2, minutes=5))
    await module.reconcile()
    renewed = [c for c in heat.calls_of("add_override") if c.data["entity_id"] == ["climate.living"]]
    assert len(renewed) == 2 and renewed[0].data["override_id"] == renewed[1].data["override_id"]
    assert dt_util.parse_datetime(renewed[1].data["end"]) > first_end
    assert rt.module("approvals").pending() == []
    # someone is back: the overrides come off
    hass.states.async_set("person.anna", "home", {"friendly_name": "Anna"})
    await hass.async_block_till_done()
    await module.reconcile()
    assert len(heat.calls_of("remove_override")) == 3 and all(not v for v in heat.overrides.values())


# ——— Policy: observation, proposals, people's say ———
async def test_observation_period_only_notes(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    freezer.move_to(NOW)
    rt, heat = await thermostats_rt(hass, {"policy.observation_days": 14})
    module = rt.module("thermostats")
    rt.module("presence_exceptions").save({"kind": "vacation", "start": "2026-11-18T08:00:00", "end": "2026-11-20"})
    await module.reconcile()
    await module.reconcile()
    assert heat.calls == []
    assert {r["status"] for r in module.records.values()} == {"observed"}
    observed = [e for e in rt.journal.recent(50) if e["text"].startswith("Would have done: Heating override")]
    assert len(observed) == 3  # noted once, not on every pass
    # the observation period is over: what was only noted runs now
    rt.settings.set("policy.observation_days", 0, confirmed=True)
    await module.reconcile()
    assert len(heat.calls_of("add_override")) == 3
    assert {r["status"] for r in module.records.values()} == {"applied"}


async def test_heating_overrides_run_by_themselves_by_default(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    """HomeAI sets its heating overrides itself (they end on their own and a person's change wins), even where other
    device actions are only proposed; nobody is asked and the thermostat gets the preset."""
    freezer.move_to(NOW)
    rt, heat = await thermostats_rt(hass, {"policy.autonomy_r2": "propose"})
    module, approvals = rt.module("thermostats"), rt.module("approvals")
    assert rt.settings.get("policy.actor_heating_r2") == "act"
    rt.module("presence_exceptions").save({"kind": "guests", "start": "2026-11-18T08:00:00", "end": "2026-11-18T23:00"})
    await module.reconcile()
    await hass.async_block_till_done()
    assert approvals.pending() == []
    assert preset_calls(heat, "climate.living") == ["comfort"]
    assert {r["status"] for r in module.records.values()} == {"applied"}
    # a new weekly schedule is still configuration: never the heating actor's own decision
    policy = rt.module("policy")
    from custom_components.homeai.actions.executor import ActionRequest

    weekly = ActionRequest("fake_heat", "set_schedule", {"weekly": {}}, entity_ids=["climate.living"], actor="heating")
    assert (await policy.decide(weekly)).verdict.name != "ALLOW"


async def test_waiting_requests_run_once_the_policy_allows(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    """Requests asked under an older policy do not wait for someone once HomeAI may set overrides itself."""
    freezer.move_to(NOW)
    rt, heat = await thermostats_rt(hass, {"policy.autonomy_r2": "propose", "policy.actor_heating_r2": "propose"})
    module, approvals = rt.module("thermostats"), rt.module("approvals")
    rt.module("presence_exceptions").save({"kind": "guests", "start": "2026-11-18T08:00:00", "end": "2026-11-18T23:00"})
    await module.reconcile()
    [item] = approvals.pending()
    rt.settings.set("policy.actor_heating_r2", "act", user="test", confirmed=True)
    await module.reconcile()
    await hass.async_block_till_done()
    assert approvals.pending() == [] and approvals.items[item["id"]]["status"] == "withdrawn"
    assert preset_calls(heat, "climate.living") == ["comfort"]
    assert {r["status"] for r in module.records.values()} == {"applied"}


async def test_proposed_overrides_wait_for_residents(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory, hass_admin_user
) -> None:
    freezer.move_to(NOW)
    # a home that wants to be asked about HomeAI's heating overrides says so for the heating actor
    rt, heat = await thermostats_rt(hass, {"policy.autonomy_r2": "propose", "policy.actor_heating_r2": "propose"})
    module, approvals = rt.module("thermostats"), rt.module("approvals")
    exceptions = rt.module("presence_exceptions")
    exceptions.save({"kind": "guests", "start": "2026-11-18T08:00:00", "end": "2026-11-18T23:00"})
    await module.reconcile()
    [item] = approvals.pending()
    assert item["approver"] == "residents" and item["risk"] == 2
    assert item["what"] == "Heating override for Living: comfort"
    await module.reconcile()
    assert len(approvals.pending()) == 1  # asked once
    await approvals.approve(item["id"], hass_admin_user.id)
    await hass.async_block_till_done()
    assert preset_calls(heat, "climate.living") == ["comfort"]
    assert next(iter(module.records.values()))["status"] == "applied"
    # a refused one is not asked again for the same reason, and does not silence other presets
    exceptions.save({"kind": "vacation", "start": "2026-11-25", "end": "2026-11-28"})
    freezer.move_to("2026-11-24 22:00:00+00:00")  # 10 hours before the trip
    await module.reconcile()
    pending = approvals.pending()
    assert {p["request"]["data"]["preset_mode"] for p in pending} == {"away"}
    living = next(p for p in pending if p["request"]["entity_ids"] == ["climate.living"])
    await approvals.deny(living["id"], hass_admin_user.id)
    await module.reconcile()
    assert not [p for p in approvals.pending() if p["request"]["entity_ids"] == ["climate.living"]]
    learning = rt.module("learning")
    assert learning.quiet(
        ActionRequest("fake_heat", "add_override", {"preset_mode": "away"}, entity_ids=["climate.living"])
    )
    assert not learning.quiet(
        ActionRequest("fake_heat", "add_override", {"preset_mode": "comfort"}, entity_ids=["climate.living"])
    )


async def test_pending_request_is_withdrawn_when_the_reason_goes(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    freezer.move_to(NOW)
    rt, heat = await thermostats_rt(hass, {"policy.autonomy_r2": "propose", "policy.actor_heating_r2": "propose"})
    module, approvals = rt.module("thermostats"), rt.module("approvals")
    item = rt.module("presence_exceptions").save(
        {"kind": "guests", "start": "2026-11-18T08:00:00", "end": "2026-11-18T23:00"}
    )
    await module.reconcile()
    [pending] = approvals.pending()
    rt.module("presence_exceptions").remove(item["id"])
    await module.reconcile()
    assert approvals.pending() == [] and approvals.items[pending["id"]]["status"] == "withdrawn"
    assert heat.calls == [] and module.records == {}


async def test_person_removing_an_override_is_respected(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    freezer.move_to(NOW)
    rt, heat = await thermostats_rt(hass)
    module = rt.module("thermostats")
    rt.module("presence_exceptions").save({"kind": "sick", "start": "2026-11-18T08:00:00", "end": "2026-11-20"})
    await module.reconcile()
    assert len(heat.calls_of("add_override")) == 3
    heat.overrides["climate.bedroom"].clear()  # someone took it off on the thermostat
    freezer.tick(timedelta(minutes=10))
    await module.reconcile()
    record = next(r for r in module.records.values() if r["entity_id"] == "climate.bedroom")
    assert record["status"] == "removed"
    freezer.tick(timedelta(minutes=10))
    await module.reconcile()
    assert len(heat.calls_of("add_override")) == 3  # not set again for the same reason
    learning = rt.module("learning")
    key = "fake_heat.add_override:climate.bedroom|comfort"
    assert learning.feedback_counts[key]["undo"] == 1


async def test_overrides_off_removes_them(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    freezer.move_to(NOW)
    rt, heat = await thermostats_rt(hass)
    module = rt.module("thermostats")
    rt.module("presence_exceptions").save({"kind": "vacation", "start": "2026-11-18T08:00:00", "end": "2026-11-20"})
    await module.reconcile()
    rt.settings.set("heating.presence_overrides", False, skey="entity:climate.bathroom", confirmed=True)
    await module.reconcile()
    assert [c.data["entity_id"] for c in heat.calls_of("remove_override")] == [["climate.bathroom"]]
    rt.settings.set("heating.enabled", False, confirmed=True)
    await module.reconcile()
    assert all(not v for v in heat.overrides.values()) and module.records == {}


# ——— Activity ———
async def test_activity_override_and_valve_limit(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    freezer.move_to(NOW)
    rt, heat = await thermostats_rt(hass, {"heating.activity_minutes": 10, "heating.activity_off_minutes": 15})
    module = rt.module("thermostats")
    hass.states.async_set("sensor.desk_power", "85", {"unit_of_measurement": "W", "device_class": "power"})
    await hass.async_block_till_done()
    await module.reconcile()
    assert heat.calls == []  # not for long enough
    freezer.tick(timedelta(minutes=11))
    await module.reconcile()
    [call] = heat.calls_of("add_override")
    assert call.data["entity_id"] == ["climate.living"] and call.data["reason"] == "Activity: Desk power"
    hass.states.async_set("sensor.desk_power", "2", {"unit_of_measurement": "W", "device_class": "power"})
    await hass.async_block_till_done()
    await module.reconcile()
    freezer.tick(timedelta(minutes=5))
    await module.reconcile()
    assert heat.calls_of("remove_override") == []  # a short pause is not the end
    freezer.tick(timedelta(minutes=11))
    await module.reconcile()
    assert len(heat.calls_of("remove_override")) == 1

    # with a valve limit instead: the thermostat's valve-limit number goes down and comes back
    values: list[float] = []

    async def set_value(call: Any) -> None:
        values.append(call.data["value"])
        hass.states.async_set(call.data["entity_id"][0], str(call.data["value"]), {"unit_of_measurement": "%"})

    hass.services.async_register("number", "set_value", set_value)
    rt.settings.set("heating.activity_action", "valve_limit", confirmed=True)
    hass.states.async_set("sensor.desk_power", "120", {"unit_of_measurement": "W", "device_class": "power"})
    await hass.async_block_till_done()
    await module.reconcile()
    freezer.tick(timedelta(minutes=11))
    await module.reconcile()
    assert values == [30]
    assert len(heat.calls_of("add_override")) == 1  # no override this time
    hass.states.async_set("sensor.desk_power", "1", {"unit_of_measurement": "W", "device_class": "power"})
    await hass.async_block_till_done()
    await module.reconcile()
    freezer.tick(timedelta(minutes=16))
    await module.reconcile()
    assert values == [30, 100.0]
    assert module.valves == {}


# ——— Schedule proposals from habits ———
def test_find_shifts_from_manual_changes() -> None:
    week = contract.canonical_week(
        [
            {"days": ["mon", "tue", "wed", "thu", "fri"], "time": "06:30", "preset_mode": "comfort"},
            {"days": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], "time": "22:30", "preset_mode": "sleep"},
        ]
    )
    today = date(2026, 11, 18)
    changes = []
    for n in range(1, 22):
        day = today - timedelta(days=n)
        if day.weekday() < 5:
            changes.append((datetime(day.year, day.month, day.day, 6, 2 + n % 4), 21.0, None))
    shifts = find_shifts(week, changes, {"comfort": 21.0}, today=today, days=21, min_days=8, window=20, max_shift=120)
    assert [(s["from"], s["to"], s["kind"], s["seen"]) for s in shifts] == [("06:30", "06:00", "workday", 15)]
    new = shifted_week(week, shifts[0])
    assert {"days": ["mon", "tue", "wed", "thu", "fri"], "time": "06:00", "preset_mode": "comfort"} in new
    assert not any(b["time"] == "06:30" for b in new)
    # other temperatures, or changes after the block, are not a habit of anticipating it
    assert (
        find_shifts(
            week,
            [(c[0], 18.0, None) for c in changes],
            {"comfort": 21.0},
            today=today,
            days=21,
            min_days=8,
            window=20,
            max_shift=120,
        )
        == []
    )


async def test_schedule_proposal_needs_an_administrator(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory, hass_admin_user
) -> None:
    freezer.move_to("2026-11-18 03:30:00+00:00")
    rt, heat = await thermostats_rt(hass)
    module, approvals = rt.module("thermostats"), rt.module("approvals")
    # the thermostat's own schedule says what comfort means; people then warm up by hand before 6:30
    ctx = Context(user_id=hass_admin_user.id)
    hass.states.async_set(
        "climate.living", "heat", {**hass.states.get("climate.living").attributes, "temperature": 21.0}
    )
    await hass.async_block_till_done()
    assert module.preset_temps["climate.living"]["comfort"] == 21.0
    start = dt_util.utcnow()
    for n in range(1, 22):
        day = dt_util.as_local(start - timedelta(days=n))
        if day.weekday() < 5:
            at = day.replace(hour=6, minute=5)
            module.manual.setdefault("climate.living", []).append([at.isoformat(), 21.0, None])
    hass.states.async_set(
        "climate.living",
        "heat",
        {**hass.states.get("climate.living").attributes, "temperature": 19.0, "preset_mode": "none"},
        context=ctx,
    )
    await hass.async_block_till_done()
    assert module.manual["climate.living"][-1][1] == 19.0  # a person's change is recorded
    [proposal] = await module.propose()
    assert proposal["entity_id"] == "climate.living" and proposal["shift"]["to"] == "06:05"
    [item] = approvals.pending()
    assert item["risk"] == 4 and item["approver"] == "admins"
    assert item["request"]["service"] == "set_schedule"
    assert "06:05" in item["reason"]
    assert heat.calls_of("set_schedule") == []
    await module.propose()
    assert len(approvals.pending()) == 1  # one question at a time
    await approvals.approve(item["id"], hass_admin_user.id)
    await hass.async_block_till_done()
    [call] = heat.calls_of("set_schedule")
    assert {"days": ["mon", "tue", "wed", "thu", "fri"], "time": "06:05", "preset_mode": "comfort"} in call.data[
        "weekly"
    ]
    assert proposal["status"] == "applied"


async def test_stale_schedule_proposal_never_runs(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory, hass_admin_user
) -> None:
    freezer.move_to("2026-11-18 03:30:00+00:00")
    rt, heat = await thermostats_rt(hass)
    module, approvals = rt.module("thermostats"), rt.module("approvals")
    module.preset_temps["climate.living"] = {"comfort": 21.0}
    start = dt_util.utcnow()
    for n in range(1, 22):
        day = dt_util.as_local(start - timedelta(days=n))
        if day.weekday() < 5:
            module.manual.setdefault("climate.living", []).append(
                [day.replace(hour=6, minute=0).isoformat(), 21.0, None]
            )
    await module.propose()
    [item] = approvals.pending()
    heat.weekly["climate.living"] = [{"days": ["mon"], "time": "07:00", "preset_mode": "comfort"}]  # edited meanwhile
    assert await approvals.approve(item["id"], hass_admin_user.id) is None
    assert approvals.items[item["id"]]["status"] == "expired"
    assert heat.calls_of("set_schedule") == []


# ——— Reading ———
async def test_thermostat_plan_shows_in_the_plan_calendar(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    freezer.move_to(NOW)
    from .home import Home

    heat = FakeHeat(hass)
    plan = [{"start": "2026-11-18T18:00:00+01:00", "end": "2026-11-18T22:30:00+01:00", "title": "Living: comfort"}]
    heat.thermostat(Home(hass), "climate.living", None, plan=plan)
    rt = await setup_homeai(hass, ACT)
    now = dt_util.utcnow()
    found = rt.module("scheduler").all_occurrences(now, now + timedelta(days=1))
    assert [(e["title"], e["source"]) for _t, e in found] == [("Living: comfort", "climate.living")]
    events = (
        await rt.hass.data["calendar"]
        .get_entity("calendar.homeai_plan")
        .async_get_events(hass, now, now + timedelta(days=1))
    )
    assert [e.summary for e in events] == ["Living: comfort"]


async def test_ai_reads_schedules_and_estimates(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    freezer.move_to(NOW)
    rt, _heat = await thermostats_rt(hass)
    from custom_components.homeai.ai.privacy import Privacy
    from custom_components.homeai.ai.tools import ToolContext, run_tool

    ctx = ToolContext(rt, Privacy(rt))
    text, error = await run_tool(ctx, "get_heating", {"entity_id": "climate.living", "temperature": 22})
    assert not error
    import json

    [item] = json.loads(text)
    assert item["estimate"] == {"minutes": 40, "confidence": 0.7}
    assert item["schedule"]["weekly"][0]["time"] == "06:30"
    assert item["rooms"] == [{"area": "Living room", "roles": ["common"]}]
    from custom_components.homeai.ai.context import home_card

    assert "Living room (common)" in home_card(rt, Privacy(rt))


async def test_executor_asks_for_a_response_when_a_service_needs_one(hass: HomeAssistant) -> None:
    rt, _heat = await thermostats_rt(hass)
    result = await rt.module("executor").execute(
        ActionRequest("fake_heat", "estimate", {"temperature": 21}, entity_ids=["climate.living"], actor="homeai")
    )
    assert result.status == "done" and result.data == {"climate.living": {"minutes": 40, "confidence": 0.7}}


async def test_renewal_that_needs_approval_asks_once(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    freezer.move_to(NOW)
    rt, heat = await thermostats_rt(hass, {"heating.nobody_home_minutes": 30})
    module, approvals = rt.module("thermostats"), rt.module("approvals")
    hass.states.async_set("person.anna", "not_home", {"friendly_name": "Anna"})
    hass.states.async_set("person.ben", "not_home", {"friendly_name": "Ben"})
    await hass.async_block_till_done()
    freezer.tick(timedelta(minutes=31))
    await module.reconcile()
    assert len(heat.calls_of("add_override")) == 3
    # the administrator makes the living room thermostat a system device: a renewal is no longer a follow-up
    rt.settings.set("policy.risk_override", "R3", skey="entity:climate.living", confirmed=True)
    freezer.tick(timedelta(hours=2, minutes=5))
    await module.reconcile()
    freezer.tick(timedelta(minutes=20))
    await module.reconcile()
    living = [p for p in approvals.pending() if p["request"]["entity_ids"] == ["climate.living"]]
    assert len(living) == 1 and living[0]["approver"] == "admins"
    assert len(heat.calls_of("add_override")) == 5  # the two others were renewed without asking


async def test_long_trip_is_sent_in_pieces(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    freezer.move_to(NOW)
    rt, heat = await thermostats_rt(hass)
    module = rt.module("thermostats")
    rt.module("presence_exceptions").save({"kind": "vacation", "start": "2026-11-18T08:00:00", "end": "2027-02-28"})
    await module.reconcile()
    first = [c for c in heat.calls_of("add_override") if c.data["entity_id"] == ["climate.living"]]
    assert dt_util.parse_datetime(first[0].data["end"]) == dt_util.utcnow() + timedelta(days=30)
    freezer.tick(timedelta(days=10))
    await module.reconcile()
    assert len([c for c in heat.calls_of("add_override") if c.data["entity_id"] == ["climate.living"]]) == 1
    freezer.tick(timedelta(days=6))
    await module.reconcile()
    renewed = [c for c in heat.calls_of("add_override") if c.data["entity_id"] == ["climate.living"]]
    assert len(renewed) == 2 and renewed[1].data["override_id"] == renewed[0].data["override_id"]
    assert dt_util.parse_datetime(renewed[1].data["end"]) == dt_util.utcnow() + timedelta(days=30)


async def test_a_change_by_hand_wins_over_renewals(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory, hass_admin_user
) -> None:
    freezer.move_to(NOW)
    rt, heat = await thermostats_rt(hass, {"heating.nobody_home_minutes": 30})
    module = rt.module("thermostats")
    hass.states.async_set("person.anna", "not_home", {"friendly_name": "Anna"})
    hass.states.async_set("person.ben", "not_home", {"friendly_name": "Ben"})
    await hass.async_block_till_done()
    freezer.tick(timedelta(minutes=31))
    await module.reconcile()
    assert len(heat.calls_of("add_override")) == 3
    # on the way home Anna warms the living room up in the app
    freezer.tick(timedelta(minutes=30))
    attrs = dict(hass.states.get("climate.living").attributes)
    hass.states.async_set(
        "climate.living", "heat", {**attrs, "temperature": 22.0}, context=Context(user_id=hass_admin_user.id)
    )
    await hass.async_block_till_done()
    freezer.tick(timedelta(hours=1, minutes=40))
    await module.reconcile()
    renewed = {c.data["entity_id"][0] for c in heat.calls_of("add_override")[3:]}
    assert renewed == {"climate.bedroom", "climate.bathroom"}  # not the living room: Anna's change stays
    record = next(r for r in module.records.values() if r["entity_id"] == "climate.living")
    assert record["status"] == "superseded"
    assert any("changed Living by hand" in e["text"] for e in rt.journal.recent(20))
    freezer.tick(timedelta(minutes=40))
    await module.reconcile()
    assert len([c for c in heat.calls_of("add_override") if c.data["entity_id"] == ["climate.living"]]) == 1
    # home again before it ran out: HomeAI still takes its own override off
    hass.states.async_set("person.anna", "home", {"friendly_name": "Anna"})
    await hass.async_block_till_done()
    await module.reconcile()
    assert ["climate.living"] in [c.data["entity_id"] for c in heat.calls_of("remove_override")]


async def test_source_attribute_tells_manual_changes(hass: HomeAssistant, hass_admin_user) -> None:
    rt, _heat = await thermostats_rt(hass)
    module = rt.module("thermostats")
    attrs = dict(hass.states.get("climate.living").attributes)
    # a turn of the knob: the thermostat writes it with a fresh context but says it is a hold
    hass.states.async_set("climate.living", "heat", {**attrs, "temperature": 23.0, "source": "hold"})
    # its own schedule block, even in the context of a person's earlier call, is not by hand
    hass.states.async_set(
        "climate.living",
        "heat",
        {**attrs, "temperature": 18.0, "preset_mode": "sleep", "source": "schedule"},
        context=Context(user_id=hass_admin_user.id),
    )
    # HomeAI's own change never counts as a person's
    hass.states.async_set(
        "climate.living",
        "heat",
        {**attrs, "temperature": 21.0, "preset_mode": "comfort"},
        context=Context(user_id=rt.system_user_id),
    )
    await hass.async_block_till_done()
    assert [c[1] for c in module.manual["climate.living"]] == [23.0]
    assert module.preset_temps["climate.living"]["sleep"] == 18.0
    hass.states.async_set("climate.living", "heat", {**attrs, "preset_temperatures": {"comfort": 21.5, "eco": "x"}})
    assert module.preset_temperatures("climate.living")["comfort"] == 21.5
    assert module.preset_temperatures("climate.living")["sleep"] == 18.0
    assert "eco" not in module.preset_temperatures("climate.living")


async def test_observation_asks_nobody(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    """homeai#18: with the default levels (R2 propose) the observation period notes overrides, it does not ask."""
    freezer.move_to(NOW)
    rt, heat = await thermostats_rt(
        hass,
        {
            "policy.observation_days": 14,
            "policy.autonomy_r2": "propose",
            "policy.actor_heating_r2": "propose",
            "heating.nobody_home_minutes": 30,
        },
    )
    module, approvals = rt.module("thermostats"), rt.module("approvals")
    hass.states.async_set("person.anna", "not_home", {"friendly_name": "Anna"})
    hass.states.async_set("person.ben", "not_home", {"friendly_name": "Ben"})
    await hass.async_block_till_done()
    freezer.tick(timedelta(minutes=31))
    await module.reconcile()
    assert approvals.pending() == [] and heat.calls == []
    assert {r["status"] for r in module.records.values()} == {"observed"}
    assert hass.states.async_all("persistent_notification") == []
    # once the period is over, HomeAI asks as its level says
    rt.settings.set("policy.observation_days", 0, confirmed=True)
    await module.reconcile()
    assert len(approvals.pending()) == 3


async def test_open_ended_overrides_say_so(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    """homeai#19: an open-ended override's end is only a horizon; a thermostat that announces `open_end` is told."""
    freezer.move_to(NOW)
    from .home import Home

    _home, heat = heated_home(hass)
    heat.thermostat(Home(hass), "climate.study", "Bedroom", features=["open_end"])
    rt = await setup_homeai(hass, {**ACT, "heating.nobody_home_minutes": 30})
    module = rt.module("thermostats")
    assert contract.discover(hass, rt.world)["climate.study"].features == {"open_end"}
    hass.states.async_set("person.anna", "not_home", {"friendly_name": "Anna"})
    hass.states.async_set("person.ben", "not_home", {"friendly_name": "Ben"})
    await hass.async_block_till_done()
    freezer.tick(timedelta(minutes=31))
    await module.reconcile()
    calls = {c.data["entity_id"][0]: c.data for c in heat.calls_of("add_override")}
    assert calls["climate.study"]["open_end"] is True
    assert "open_end" not in calls["climate.living"]  # it does not announce it: never sent there
    assert {r["status"] for r in module.records.values()} == {"applied"}
    # a calendar reason has a real end: the thermostat may heat ahead towards it
    hass.states.async_set("person.anna", "home", {"friendly_name": "Anna"})
    await hass.async_block_till_done()
    rt.module("presence_exceptions").save({"kind": "sick", "start": "2026-11-18T08:00:00", "end": "2026-11-19"})
    await module.reconcile()
    sick = [c.data for c in heat.calls_of("add_override") if c.data["reason"] == "Sick"]
    assert sick and all("open_end" not in d for d in sick)
