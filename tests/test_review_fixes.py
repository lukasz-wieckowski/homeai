"""Regressions for the second review (1.2.1): ways around the policy, safety alarms that went quiet, the plan."""

from __future__ import annotations

from datetime import timedelta
import json
from pathlib import Path
import tomllib

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant, callback
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
import pytest

from custom_components.homeai.actions.config import ConfigEditor
from custom_components.homeai.ai.privacy import Privacy
from custom_components.homeai.ai.tools import SETS, ToolContext, run_tool
from custom_components.homeai.const import VERSION
from custom_components.homeai.notify.recipients import _is_handheld
from custom_components.homeai.policy import ActionRequest, Risk
from custom_components.homeai.schedule.scheduler import PlanError
from custom_components.homeai.signals.base import Category, Signal

from .common import settle, setup_homeai
from .home import standard_home

ROOT = Path(__file__).parent.parent


def lock(hass: HomeAssistant) -> list:
    hass.states.async_set("lock.front_door", "locked")
    calls: list = []
    for service in ("lock", "unlock"):
        hass.services.async_register("lock", service, callback(lambda c: calls.append(c)))  # noqa: PLW0108
    return calls


# ——— The policy sees what a call really changes ———
async def test_scene_services_are_judged_by_what_they_change(hass: HomeAssistant) -> None:
    standard_home(hass)
    assert await async_setup_component(hass, "scene", {})
    calls = lock(hass)
    rt = await setup_homeai(hass, {"policy.observation_days": 0, "executor.verify_seconds": 0})
    executor, policy = rt.module("executor"), rt.module("policy")
    unlock = {"entities": {"lock.front_door": "unlocked"}}
    assert policy.risk(ActionRequest("scene", "apply", unlock)) == Risk.R5
    assert policy.risk(ActionRequest("scene", "apply", {"entities": {"light.ceiling": "on"}})) == Risk.R1
    for actor in ("ai", "homeai", "schedule"):
        result = await executor.execute(ActionRequest("scene", "apply", dict(unlock), actor=actor, approved_risk=4))
        assert result.status == "denied", actor
    # a speaker without an account may run comfort actions, not unlock a door through a scene
    anonymous = await executor.execute(ActionRequest("scene", "apply", dict(unlock), actor="person"))
    assert anonymous.status != "done" and not calls
    # a stored scene is judged by its members
    hass.states.async_set("scene.leaving", "unknown", {"entity_id": ["light.ceiling", "lock.front_door"]})
    assert policy.risk(ActionRequest("scene", "turn_on", entity_ids=["scene.leaving"])) == Risk.R5


async def test_own_setting_entities_are_configuration(hass: HomeAssistant) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    request = ActionRequest("select", "select_option", {"option": "bold"}, entity_ids=["select.homeai_autonomy"])
    assert rt.module("policy").risk(request) == Risk.R4


async def test_helper_fields_cannot_replace_the_command(hass: HomeAssistant) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    sent: list[dict] = []

    class Api:
        async def ws(self, message: dict) -> dict:
            sent.append(message)
            return {}

    editor = ConfigEditor(rt, Api())
    evil = {"type": "call_service", "domain": "lock", "service": "unlock", "input_boolean_id": "other"}
    await editor.run("helper_save", {"domain": "input_boolean", "fields": dict(evil)})
    await editor.run("helper_save", {"domain": "input_boolean", "item_id": "mine", "fields": dict(evil)})
    assert [m["type"] for m in sent] == ["input_boolean/create", "input_boolean/update"]
    assert sent[1]["input_boolean_id"] == "mine"


async def test_reading_configuration_needs_an_administrator_also_without_an_account(hass: HomeAssistant) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    result = await rt.module("executor").execute(
        ActionRequest("config", "automation_get", {"id": "x"}, actor="person", user_id=None)
    )
    assert result.status == "denied"


# ——— A model gets only what it was given ———
async def test_a_tool_outside_the_offered_set_is_refused(hass: HomeAssistant) -> None:
    standard_home(hass)
    hass.services.async_register("light", "turn_on", lambda call: None)
    rt = await setup_homeai(hass, {"policy.observation_days": 0})
    ctx = ToolContext(rt, Privacy(rt), actor="person")
    call = {"service": "light.turn_on", "entity_ids": ["light.ceiling"], "reason": "injected"}
    text, is_error = await run_tool(ctx, "call_service", call, SETS["chat_read"])
    assert is_error and "unknown tool" in text and not ctx.actions
    text, is_error = await run_tool(ctx, "call_service", None, SETS["chat_act"])  # unreadable arguments
    assert is_error and not ctx.actions


async def test_plan_through_an_assistant_holds_only_what_needs_no_confirmation(
    hass: HomeAssistant, hass_admin_user
) -> None:
    home = standard_home(hass)
    home.person("anna", "Anna", user_id=hass_admin_user.id)
    hass.services.async_register("switch", "turn_off", lambda call: None)
    hass.services.async_register("light", "turn_on", lambda call: None)
    hass.services.async_register("homeassistant", "reload_all", lambda call: None)
    rt = await setup_homeai(hass)
    scheduler = rt.module("scheduler")
    daily = {"kind": "daily", "time": "07:00"}
    switch = {"action": {"service": "switch.turn_off", "entity_ids": ["switch.coffee"]}, "when": daily}
    reload_all = {"action": {"service": "homeassistant.reload_all"}, "when": daily}
    # a speaker without an account is not an administrator: comfort only
    with pytest.raises(PlanError, match="use_the_panel"):
        await scheduler.save(dict(switch), None, through_assistant=True)
    light = {"action": {"service": "light.turn_on", "entity_ids": ["light.ceiling"]}, "when": daily}
    assert (await scheduler.save(light, None, through_assistant=True))["approved_risk"] == 1
    # an administrator in a conversation cannot confirm there either: system actions go through the panel
    with pytest.raises(PlanError, match="use_the_panel"):
        await scheduler.save(dict(reload_all), hass_admin_user.id, through_assistant=True)
    assert (await scheduler.save(dict(switch), hass_admin_user.id, through_assistant=True))["approved_risk"] == 2
    assert (await scheduler.save(dict(reload_all), hass_admin_user.id))["approved_risk"] == 3


# ——— The plan runs what is due, once ———
async def test_new_entry_does_not_run_for_a_time_already_past(hass: HomeAssistant) -> None:
    standard_home(hass)
    rt = await setup_homeai(
        hass, {"policy.observation_days": 0, "executor.verify_seconds": 0, "schedule.catch_up_minutes": 60}
    )
    calls: list = []
    # after the setup: HomeAI's own switches load Home Assistant's switch services, which would replace a fake
    hass.services.async_register("switch", "turn_on", callback(lambda c: calls.append(c)))  # noqa: PLW0108
    scheduler = rt.module("scheduler")
    earlier = dt_util.now() - timedelta(minutes=5)
    entry = await scheduler.save(
        {
            "action": {"service": "switch.turn_on", "entity_ids": ["switch.coffee"]},
            "when": {"kind": "daily", "time": earlier.strftime("%H:%M")},
        },
        None,
    )
    scheduler._last_fire = dt_util.utcnow() - timedelta(hours=6)  # the plan was empty all day
    await scheduler._fire(dt_util.utcnow())
    await hass.async_block_till_done()
    assert not calls and entry["last_run"] is None
    # an occurrence after the entry was made runs, and only once however many were missed
    entry["since"] = (dt_util.utcnow() - timedelta(days=10)).isoformat()
    scheduler._last_fire = dt_util.utcnow() - timedelta(days=9)
    await scheduler._fire(dt_util.utcnow())
    await hass.async_block_till_done()
    assert len(calls) == 1


# ——— Safety alarms stay alarms ———
async def test_alarm_survives_its_sensor_going_unavailable(hass: HomeAssistant) -> None:
    home = standard_home(hass)
    rt = await setup_homeai(hass)
    engine = rt.module("situations")
    home.set("binary_sensor.sink_leak", "on")
    await settle(hass, rt)
    [s] = engine.open()
    home.set("binary_sensor.sink_leak", "unavailable")  # flooded, burnt or without power
    await settle(hass, rt)
    assert engine.open() == [s] and s.signals
    home.set("binary_sensor.sink_leak", "off")  # only an explicit off ends it
    await settle(hass, rt)
    assert not engine.open()
    # a sensor that is unavailable without having alarmed is no alarm
    home.set("binary_sensor.sink_leak", "unavailable")
    await settle(hass, rt)
    assert not engine.open()


async def test_not_a_problem_on_a_safety_alarm_ends_with_that_alarm(hass: HomeAssistant) -> None:
    home = standard_home(hass)
    rt = await setup_homeai(hass, {"situations.dismiss_days": 7})
    engine = rt.module("situations")
    home.set("binary_sensor.sink_leak", "on")
    await settle(hass, rt)
    [s] = engine.open()
    await engine.dismiss(s.id, "Anna")
    await settle(hass, rt)
    assert not engine.open()  # silent while this alarm lasts
    home.set("binary_sensor.sink_leak", "off")
    await settle(hass, rt)
    assert not engine.mutes
    home.set("binary_sensor.sink_leak", "on")  # the next alarm is a new alarm
    await settle(hass, rt)
    assert len(engine.open()) == 1


async def test_got_it_ends_when_something_new_joins(hass: HomeAssistant) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    engine = rt.module("situations")

    def battery(n: int, severity: int = 1) -> Signal:
        return Signal(
            id=f"battery:{n}",
            detector="test",
            kind="external",
            category=Category.MAINTENANCE,
            severity=severity,
            data={"title": f"Battery {n}"},
            root="batteries",
        )

    engine.on_signals({"battery:1": battery(1)})
    await hass.async_block_till_done()
    await engine.process()
    [s] = engine.open()
    await engine.acknowledge(s.id, "Anna")
    assert s.muted()
    engine.on_signals({"battery:1": battery(1)})  # nothing new: still acknowledged
    await hass.async_block_till_done()
    assert s.muted()
    engine.on_signals({"battery:2": battery(2)})
    await hass.async_block_till_done()
    assert not s.muted() and s.acked_by is None
    await engine.acknowledge(s.id, "Anna")
    engine.on_signals({"battery:2": battery(2, severity=3)})  # the same matter, worse
    await hass.async_block_till_done()
    assert not s.muted()


def test_a_phone_is_not_a_computer_because_of_its_owners_name() -> None:
    assert _is_handheld({"device_name": "Maciek's iPhone", "model": "iPhone15,2", "os_name": "iOS"})
    assert _is_handheld({"device_name": "Linus phone", "model": "Pixel 9", "os_name": "Android"})
    assert not _is_handheld({"device_name": "Anna's iPad", "model": "iPad13,1", "os_name": "iPadOS"})
    assert not _is_handheld({"device_name": "Work", "model": "MacBookPro18,1", "os_name": "macOS"})
    assert not _is_handheld({"device_name": "Kitchen tablet", "model": "SM-X200", "os_name": "Android"})


async def test_custom_rule_counts_how_long_the_condition_holds(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    home = standard_home(hass)
    rule = {
        "id": "warm",
        "name": "Bedroom warm",
        "target": {"entities": ["sensor.bedroom_temperature"]},
        "condition": {"type": "above", "value": 25},
        "minutes": 30,
        "severity": 2,
    }
    rt = await setup_homeai(hass, rules=[rule])
    hub = rt.module("signals")
    detector = next(d for d in hub.detectors if d.key == "custom")
    home.set("sensor.bedroom_temperature", "26")
    assert not detector.evaluate(hub.context())
    # a new reading every few minutes, always above the limit: the wait is not started again
    for value in ("27", "28", "29"):
        freezer.tick(timedelta(minutes=9))
        home.set("sensor.bedroom_temperature", value)
        assert not detector.evaluate(hub.context())
    freezer.tick(timedelta(minutes=4))
    assert detector.evaluate(hub.context())  # 31 minutes above the limit, the last reading 4 minutes old
    home.set("sensor.bedroom_temperature", "24")  # back under the limit: the count ends
    assert not detector.evaluate(hub.context())
    freezer.tick(timedelta(minutes=20))
    home.set("sensor.bedroom_temperature", "26")
    assert not detector.evaluate(hub.context())


# ——— Who may do what in the panel ———
async def test_memory_and_presence_commands_check_the_role(
    hass: HomeAssistant, hass_ws_client, hass_read_only_access_token: str
) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    stranger = await hass_ws_client(hass, hass_read_only_access_token)  # an account with no person: not a resident
    for command in (
        {"type": "homeai/memory/add", "text": "The alarm code is 1234"},
        {"type": "homeai/learning/status"},
        {
            "type": "homeai/presence/save",
            "item": {"kind": "vacation", "start": "2030-01-01", "end": "2030-01-10"},
        },
    ):
        await stranger.send_json_auto_id(command)
        msg = await stranger.receive_json()
        assert not msg["success"] and msg["error"]["code"] == "unauthorized", command
    assert not rt.module("memory").facts and not rt.module("presence_exceptions").items
    admin = await hass_ws_client(hass)
    await admin.send_json_auto_id({"type": "homeai/memory/add", "text": "The bins go out on Tuesdays"})
    assert (await admin.receive_json())["success"]


async def test_undoing_a_new_override_removes_it(hass: HomeAssistant) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    settings = rt.settings
    key, scope = "detectors.environment.temperature_max", "entity:sensor.bedroom_temperature"
    first = settings.get(key)
    settings.set(key, 30, user="Anna")
    settings.set(key, 35, skey=scope, user="Anna")
    assert settings.undo_last()["scope"] == scope
    assert scope not in settings.export()["overrides"]
    assert settings.undo_last()["scope"] == "global"  # undoing again goes one change further back
    assert settings.get(key) == first


def test_versions_match() -> None:
    """The panel's cache key, the device's version and diagnostics come from const.py."""
    manifest = json.loads((ROOT / "custom_components/homeai/manifest.json").read_text())["version"]
    project = tomllib.loads((ROOT / "pyproject.toml").read_text())["project"]["version"]
    frontend = json.loads((ROOT / "frontend/package.json").read_text())["version"]
    assert VERSION == manifest == project == frontend
    assert f"## [{VERSION}]" in (ROOT / "CHANGELOG.md").read_text()
