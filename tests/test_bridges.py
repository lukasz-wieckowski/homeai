"""Hubs and bridges: a hub offline explains the devices behind it."""

from __future__ import annotations

from datetime import timedelta

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr

from custom_components.homeai.policy import ActionRequest, Risk

from .common import setup_homeai
from .home import standard_home


async def test_hub_offline_folds_child_devices(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    home = standard_home(hass)
    hub = home.device("Hue bridge", area="Living room")
    home.entity("binary_sensor.hue_bridge_connected", "on", device=hub, device_class="connectivity")
    bulb = home.device("Hall bulb", area="Living room")
    dr.async_get(hass).async_update_device(bulb, via_device_id=hub)
    home.entity("light.hall", "on", device=bulb)
    rt = await setup_homeai(hass, {"adapters.bridge_minutes": 1, "detectors.availability.minutes": 1})
    hub_signals = rt.module("signals")

    home.set("binary_sensor.hue_bridge_connected", "off")
    home.set("light.hall", "unavailable")
    freezer.tick(timedelta(minutes=2))
    hub_signals.evaluate()
    bridge = hub_signals.signals[f"bridge_offline:{hub}"]
    assert bridge.suppresses == frozenset({f"via:{hub}"}) and bridge.repair["playbook"] == "reload_entry"
    child = next(s for s in hub_signals.signals.values() if s.kind == "device_unavailable")
    assert f"via:{hub}" in child.tags

    engine = rt.module("situations")
    await engine.process()
    [s] = engine.open()
    assert s.kind == "bridge_offline" and child.id in s.suppressed


async def test_zigbee2mqtt_bridge_restarts_addon(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    home = standard_home(hass)
    mqtt = MockConfigEntry(domain="mqtt", title="MQTT")
    mqtt.add_to_hass(hass)
    bridge = home.device("Zigbee2MQTT Bridge", identifiers=("mqtt", "zigbee2mqtt_bridge_0x00"), entry=mqtt)
    home.entity("binary_sensor.z2m_connection_state", "on", device=bridge, device_class="connectivity", entry=mqtt)
    rt = await setup_homeai(hass, {"adapters.zigbee2mqtt_addon": "45df7312_zigbee2mqtt", "adapters.bridge_minutes": 0})
    home.set("binary_sensor.z2m_connection_state", "off")
    # without the Supervisor (Home Assistant in Docker) there is no add-on to restart: reload instead
    signal = rt.module("signals").evaluate()[f"bridge_offline:{bridge}"]
    assert signal.repair["playbook"] == "reload_entry"
    hass.services.async_register("hassio", "addon_restart", lambda call: None)
    home.set("binary_sensor.z2m_connection_state", "on")
    rt.module("signals").evaluate()
    home.set("binary_sensor.z2m_connection_state", "off")
    signal = rt.module("signals").evaluate()[f"bridge_offline:{bridge}"]
    assert "zigbee" in signal.suppresses
    assert signal.repair == {"playbook": "restart_addon", "addon": "45df7312_zigbee2mqtt"}


async def test_hub_with_a_restart_button(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    """Any hub with a working `restart` button: pressed when it is offline (any installation), and when it asks
    for a restart — then only at a quiet moment (nobody home, or everyone at home asleep)."""
    from homeassistant.core import ServiceCall

    home = standard_home(hass)
    hub = home.device("Media server")
    home.entity("binary_sensor.media_server_online", "on", device=hub, device_class="connectivity")
    home.entity("button.media_server_restart", "unknown", device=hub, device_class="restart")
    home.entity(
        "binary_sensor.media_server_restart_required",
        "off",
        device=hub,
        device_class="problem",
        unique_id="media_server_restart_required",
    )
    bulb = home.device("Speaker")
    dr.async_get(hass).async_update_device(bulb, via_device_id=hub)
    pressed: list[ServiceCall] = []
    hass.services.async_register("button", "press", pressed.append)
    rt = await setup_homeai(hass, {"adapters.bridge_minutes": 0, "policy.observation_days": 0})
    signals = rt.module("signals")

    home.set("binary_sensor.media_server_online", "off")
    offline = signals.evaluate()[f"bridge_offline:{hub}"]
    assert offline.repair == {"playbook": "press_restart", "device_id": hub}
    home.set("binary_sensor.media_server_online", "on")
    signals.evaluate()

    home.set("binary_sensor.media_server_restart_required", "on")
    asks = signals.evaluate()["problem:binary_sensor.media_server_restart_required"]
    assert asks.repair == {"playbook": "press_restart", "device_id": hub, "quiet": True}
    restart = ActionRequest("button", "press", entity_ids=["button.media_server_restart"])
    assert rt.module("policy").risk(restart) == Risk.R3

    from custom_components.homeai.repair.playbooks import PLAYBOOKS, Defer

    engine = rt.module("situations")
    await engine.process()
    s = next(x for x in engine.open() if x.kind == "problem_entity")
    try:  # people are home and awake: not now
        PLAYBOOKS["press_restart"].build(rt, s, {"device_id": hub, "quiet": True})
        raise AssertionError("expected Defer")
    except Defer as later:
        assert later.minutes == 30
    for person in hass.states.async_entity_ids("person"):
        home.set(person, "not_home")
    await hass.async_block_till_done()
    [request] = PLAYBOOKS["press_restart"].build(rt, s, {"device_id": hub, "quiet": True})
    assert (request.domain, request.service, request.entity_ids) == ("button", "press", ["button.media_server_restart"])
