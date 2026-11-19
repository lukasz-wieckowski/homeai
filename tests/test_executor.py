"""Executor: context, verification, undo, audit, approvals and offline cloud devices."""

from __future__ import annotations

from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.setup import async_setup_component

from custom_components.homeai.const import EVENT_ACTION
from custom_components.homeai.policy import ActionRequest, Risk

from .common import phone_targets, phones, setup_homeai
from .home import standard_home


def fake_lights(hass: HomeAssistant, *, obey: bool = True) -> list[ServiceCall]:
    calls: list[ServiceCall] = []

    @callback
    def handle(call: ServiceCall) -> None:
        calls.append(call)
        ids = call.data["entity_id"]
        if obey:
            for entity_id in [ids] if isinstance(ids, str) else ids:
                hass.states.async_set(
                    entity_id, "on" if call.service == "turn_on" else "off", hass.states.get(entity_id).attributes
                )

    hass.services.async_register("light", "turn_on", handle)
    hass.services.async_register("light", "turn_off", handle)
    return calls


async def test_autonomous_action_runs_as_homeai_user(hass: HomeAssistant) -> None:
    standard_home(hass)
    calls = fake_lights(hass)
    rt = await setup_homeai(hass, {"policy.observation_days": 0, "executor.verify_seconds": 1})
    events = []
    hass.bus.async_listen(EVENT_ACTION, callback(lambda e: events.append(e)))  # noqa: PLW0108
    result = await rt.module("executor").execute(ActionRequest("light", "turn_on", entity_ids=["light.ceiling"]))
    assert result.status == "done" and result.risk == 1
    assert calls[0].context.user_id == rt.system_user_id
    user = await hass.auth.async_get_user(rt.system_user_id)
    assert user.system_generated and user.is_admin and user.name == "HomeAI"
    assert events[0].data["status"] == "done" and events[0].context.user_id == rt.system_user_id
    assert rt.journal.recent(1)[0]["result"] == "done"


async def test_unverified_when_state_does_not_follow(hass: HomeAssistant) -> None:
    standard_home(hass)
    fake_lights(hass, obey=False)
    rt = await setup_homeai(hass, {"policy.observation_days": 0, "executor.verify_seconds": 0})
    result = await rt.module("executor").execute(ActionRequest("light", "turn_on", entity_ids=["light.ceiling"]))
    assert result.status == "unverified"


async def test_person_context_and_invalid_requests(hass: HomeAssistant, hass_read_only_user) -> None:
    standard_home(hass)
    calls = fake_lights(hass)
    rt = await setup_homeai(hass)
    executor = rt.module("executor")
    result = await executor.execute(
        ActionRequest("light", "turn_on", entity_ids=["light.ceiling"], actor="person", user_id=hass_read_only_user.id)
    )
    assert result.ok and calls[-1].context.user_id == hass_read_only_user.id
    assert (await executor.execute(ActionRequest("light", "explode"))).status == "invalid"
    assert (await executor.execute(ActionRequest("light", "turn_on", entity_ids=["light.nope"]))).status == "invalid"


async def test_area_targets_are_expanded_and_classified(hass: HomeAssistant) -> None:
    standard_home(hass)
    fake_lights(hass)
    rt = await setup_homeai(hass, {"policy.observation_days": 0})
    req = ActionRequest("light", "turn_off", {"area_id": "living_room"})
    assert rt.module("executor").targets(req) == ["light.ceiling"]


async def test_observing_does_nothing(hass: HomeAssistant) -> None:
    standard_home(hass)
    calls = fake_lights(hass)
    rt = await setup_homeai(hass)  # 14 days of observation by default
    result = await rt.module("executor").execute(ActionRequest("light", "turn_on", entity_ids=["light.ceiling"]))
    assert result.status == "observed" and not calls
    assert rt.journal.recent(1)[0]["text"] == "Would have done: Turn on the light: Ceiling lamp"


async def test_undo_restores_previous_state(hass: HomeAssistant) -> None:
    standard_home(hass)
    fake_lights(hass)
    assert await async_setup_component(hass, "scene", {})
    await hass.async_block_till_done()
    rt = await setup_homeai(hass, {"policy.observation_days": 0, "executor.verify_seconds": 1})
    executor = rt.module("executor")
    result = await executor.execute(ActionRequest("light", "turn_on", entity_ids=["light.ceiling"]))
    assert result.undo and hass.states.get("light.ceiling").state == "on"
    undone = await executor.undo(result.action_id)
    assert undone.status == "done"
    await hass.async_block_till_done()
    assert hass.states.get("light.ceiling").state == "off"
    assert (await executor.undo(result.action_id)).status == "invalid"


async def test_ask_creates_approval_and_approve_runs_it(hass: HomeAssistant, hass_admin_user) -> None:
    home = standard_home(hass)
    home.person("anna", "Anna", user_id=hass_admin_user.id)
    calls_phone = phones(hass, "anna")
    rt = await setup_homeai(hass, {"policy.observation_days": 0}, overrides=phone_targets("anna"))
    switched = []
    hass.services.async_register("switch", "turn_off", callback(lambda c: switched.append(c)))  # noqa: PLW0108
    result = await rt.module("executor").execute(
        ActionRequest("switch", "turn_off", entity_ids=["switch.coffee"], reason="Saving energy")
    )
    assert result.status == "pending_approval"
    approvals = rt.module("approvals")
    [item] = approvals.pending()
    assert item["approver"] == "residents" and item["what"] == "Turn off: Coffee plug"
    request_push = [c for c in calls_phone if c.data.get("data", {}).get("tag", "").startswith("homeai_approval_")]
    assert (
        request_push and request_push[0].data["data"]["actions"][0]["action"] == f"HOMEAI_APPROVAL_APPROVE_{item['id']}"
    )
    # asking again does not create a second request
    await rt.module("executor").execute(
        ActionRequest("switch", "turn_off", entity_ids=["switch.coffee"], reason="Saving energy")
    )
    assert len(approvals.pending()) == 1

    from homeassistant.core import Context

    hass.bus.async_fire(
        "mobile_app_notification_action",
        {"action": f"HOMEAI_APPROVAL_APPROVE_{item['id']}"},
        context=Context(user_id=hass_admin_user.id),
    )
    await hass.async_block_till_done()
    assert item["status"] == "approved" and item["decided_by"] == "Anna"
    assert switched and switched[0].context.user_id == rt.system_user_id


async def test_non_admin_cannot_approve_admin_requests(hass: HomeAssistant, hass_read_only_user) -> None:
    assert await async_setup_component(hass, "homeassistant", {})
    home = standard_home(hass)
    home.person("ben", "Ben", user_id=hass_read_only_user.id)
    rt = await setup_homeai(hass)
    result = await rt.module("executor").execute(
        ActionRequest("homeassistant", "reload_config_entry", {"entry_id": "x"})
    )
    assert result.status == "pending_approval"
    approvals = rt.module("approvals")
    assert await approvals.approve(result.approval_id, hass_read_only_user.id) is None
    assert await approvals.approve(result.approval_id, None) is None
    assert approvals.items[result.approval_id]["status"] == "pending"


async def test_approvals_expire(hass: HomeAssistant) -> None:
    from datetime import timedelta

    from homeassistant.util import dt as dt_util

    assert await async_setup_component(hass, "homeassistant", {})
    standard_home(hass)
    rt = await setup_homeai(hass, {"policy.approval_minutes": 5})
    result = await rt.module("executor").execute(
        ActionRequest("homeassistant", "reload_config_entry", {"entry_id": "x"})
    )
    approvals = rt.module("approvals")
    await approvals.tick(dt_util.utcnow() + timedelta(minutes=6))
    assert approvals.items[result.approval_id]["status"] == "expired"


async def test_cloud_devices_blocked_while_offline(hass: HomeAssistant) -> None:
    from custom_components.homeai.signals.base import Category, Signal

    standard_home(hass)
    fake_lights(hass)
    rt = await setup_homeai(hass, {"policy.observation_days": 0})
    hub = rt.module("signals")
    hub.signals["internet_down"] = Signal(
        id="internet_down", detector="internet", kind="internet_down", category=Category.SYSTEM, severity=3
    )
    from custom_components.homeai.signals.detectors import system

    original = system.device_tags
    system.device_tags = lambda ctx, device_id: frozenset({"cloud"})
    try:
        result = await rt.module("executor").execute(ActionRequest("light", "turn_on", entity_ids=["light.ceiling"]))
    finally:
        system.device_tags = original
    assert result.status == "blocked" and result.message == "internet_down"


async def test_system_user_removed_with_entry(hass: HomeAssistant) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    user_id = rt.system_user_id
    entry = hass.config_entries.async_entries("homeai")[0]
    assert await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()
    assert await hass.auth.async_get_user(user_id) is None


async def test_system_user_reused_after_reload(hass: HomeAssistant) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    user_id = rt.system_user_id
    entry = hass.config_entries.async_entries("homeai")[0]
    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.runtime_data.system_user_id == user_id
    assert entry.runtime_data.installed_at == rt.installed_at


async def test_logbook_entry_names_homeai(hass: HomeAssistant) -> None:
    standard_home(hass)
    fake_lights(hass)
    rt = await setup_homeai(hass, {"policy.observation_days": 0, "executor.verify_seconds": 1})
    hass.config.components.add("logbook")
    entries = []
    hass.bus.async_listen("logbook_entry", callback(lambda e: entries.append(e)))  # noqa: PLW0108
    await rt.module("executor").execute(ActionRequest("light", "turn_on", entity_ids=["light.ceiling"]))
    await hass.async_block_till_done()
    assert entries and entries[0].data["name"] == "HomeAI" and entries[0].data["entity_id"] == "light.ceiling"
    assert entries[0].context.user_id == rt.system_user_id


async def test_plain_descriptions(hass: HomeAssistant) -> None:
    home = standard_home(hass)
    home.entity("climate.living", "heat", area="Living room", attrs={"friendly_name": "Thermostat"})
    rt = await setup_homeai(hass, {"general.language": "pl"})
    executor = rt.module("executor")
    request = ActionRequest("climate", "set_temperature", {"temperature": 24}, entity_ids=["climate.living"])
    assert executor.describe(request) == "Ustaw Thermostat na 24 °C"
    assert executor.describe(ActionRequest("switch", "turn_off", entity_ids=["switch.coffee"])) == "Wyłącz: Coffee plug"
    assert executor.describe(ActionRequest("climate", "set_temperature", {}, entity_ids=["climate.living"])) == (
        "climate.set_temperature: Thermostat"  # a value is missing: the plain service name
    )
    assert executor.describe(ActionRequest("vacuum", "start", entity_ids=[])) == "vacuum.start: —"


async def test_floor_and_label_targets_reach_every_entity_and_set_the_class(hass: HomeAssistant) -> None:
    """A floor, label, area or device target is resolved from Home Assistant's registries (not only the entities
    HomeAI watches) and the call reaches exactly the list the policy judged."""
    home = standard_home(hass)
    gate = home.device("Gate", area="Living room")
    home.entity("cover.gate", "closed", device=gate, device_class="gate", labels=("Outside",))
    hidden = home.device("Hidden lamp", area="Living room")
    home.entity("light.hidden", "off", device=hidden, labels=("Outside",))
    rt = await setup_homeai(hass, {"policy.observation_days": 0, "world.exclude_entities": ["light.hidden"]})
    executor, policy = rt.module("executor"), rt.module("policy")

    # homeassistant.* reaches every domain behind the target: the gate makes the whole call R5
    by_floor = ActionRequest("homeassistant", "turn_off", {"floor_id": home.floor("Ground")})
    assert {"light.ceiling", "cover.gate", "switch.coffee", "light.hidden"} <= set(executor.targets(by_floor))
    by_floor.entity_ids = executor.targets(by_floor)
    assert policy.risk(by_floor) == Risk.R5
    by_label = ActionRequest("homeassistant", "turn_on", {"label_id": home.label("Outside")})
    by_label.entity_ids = executor.targets(by_label)
    assert set(by_label.entity_ids) == {"cover.gate", "light.hidden"} and policy.risk(by_label) == Risk.R5
    # a domain's own service only reaches that domain's entities; the excluded lamp still counts
    lights = ActionRequest("light", "turn_off", {"area_id": home.area("Living room")})
    assert set(executor.targets(lights)) == {"light.ceiling", "light.hidden"}

    # the call carries the resolved entities instead of the target fields
    calls = fake_lights(hass)
    result = await executor.execute(ActionRequest("light", "turn_off", {"label_id": home.label("Outside")}))
    assert result.ok
    assert calls[-1].data["entity_id"] == ["light.hidden"] and "label_id" not in calls[-1].data

    # a target with nothing behind it, and `entity_id: all`, are refused rather than judged as an empty call
    empty = await executor.execute(ActionRequest("light", "turn_off", {"area_id": home.area("Bedroom")}))
    assert empty.status == "invalid" and empty.message == "no_targets"
    every = await executor.execute(ActionRequest("light", "turn_off", {"entity_id": "all"}))
    assert every.status == "invalid" and every.message == "match_all_not_supported"


async def test_control_entities_take_the_class_of_their_device(hass: HomeAssistant) -> None:
    home = standard_home(hass)
    trv = home.device("Radiator", area="Bedroom")
    home.entity("climate.radiator", "heat", device=trv)
    home.entity("number.radiator_valve", "100", device=trv)
    home.entity("select.radiator_sensor", "internal", device=trv, category="config")
    door = home.device("Front door", area="Living room")
    home.entity("lock.front_door", "locked", device=door)
    home.entity("number.front_door_relock", "30", device=door, category="config")
    home.entity("switch.front_door_opener", "off", device=door)
    lone = home.device("Tablet", area="Kitchen")
    home.entity("number.tablet_brightness", "40", device=lone)
    home.entity("select.tablet_theme", "dark", device=lone, category="config")
    rt = await setup_homeai(hass)
    policy = rt.module("policy")

    def risk(domain: str, service: str, entity_id: str) -> Risk:
        return policy.risk(ActionRequest(domain, service, entity_ids=[entity_id]))

    assert risk("number", "set_value", "number.radiator_valve") == Risk.R2  # counts as the thermostat
    assert risk("select", "select_option", "select.radiator_sensor") == Risk.R2
    assert risk("number", "set_value", "number.front_door_relock") == Risk.R5  # counts as the lock
    assert risk("switch", "turn_on", "switch.front_door_opener") == Risk.R5
    assert risk("number", "set_value", "number.tablet_brightness") == Risk.R1  # a plain control stays light
    assert risk("select", "select_option", "select.tablet_theme") == Risk.R2  # device configuration


async def test_admin_approval_of_a_residents_request_runs_once_as_the_admin(
    hass: HomeAssistant, hass_admin_user, hass_read_only_user
) -> None:
    """A member asks for something only an administrator may do; the administrator's Approve runs it (it used to
    create a new approval every time) in the administrator's context, so their permissions apply."""
    assert await async_setup_component(hass, "homeassistant", {})
    home = standard_home(hass)
    home.person("anna", "Anna", user_id=hass_admin_user.id)
    home.person("ben", "Ben", user_id=hass_read_only_user.id)
    reloaded: list[ServiceCall] = []
    hass.services.async_register("homeassistant", "reload_config_entry", reloaded.append)
    rt = await setup_homeai(hass, {"policy.observation_days": 0})
    executor, approvals = rt.module("executor"), rt.module("approvals")
    request = ActionRequest(
        "homeassistant", "reload_config_entry", {"entry_id": "x"}, actor="person", user_id=hass_read_only_user.id
    )
    result = await executor.execute(request)
    assert result.status == "pending_approval"
    item = await approvals.approve(result.approval_id, hass_admin_user.id)
    assert item["status"] == "approved" and item["result"]["status"] in ("done", "unverified")
    assert len(approvals.pending()) == 0  # no new approval
    assert reloaded and reloaded[0].context.user_id == hass_admin_user.id
    # the arbiter never stands in for a person on a person's request
    again = await executor.execute(
        ActionRequest(
            "homeassistant", "reload_config_entry", {"entry_id": "y"}, actor="person", user_id=hass_read_only_user.id
        )
    )
    assert await approvals.approve_as_arbiter(again.approval_id, {}) is None


async def test_non_admin_cannot_read_configuration(hass: HomeAssistant, hass_admin_user, hass_read_only_user) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    policy = rt.module("policy")
    read = ActionRequest("config", "automation_get", {"id": "x"}, actor="person", user_id=hass_read_only_user.id)
    assert (await policy.decide(read)).verdict.value == "deny"
    read.user_id = hass_admin_user.id
    assert (await policy.decide(read)).verdict.value == "allow"
