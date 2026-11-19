"""Custom detectors: rules without code, validated, evaluated, added and changed as the integration's subentries."""

from __future__ import annotations

from datetime import timedelta

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
import pytest

from custom_components.homeai.settings import SettingError
from custom_components.homeai.signals.detectors.custom import validate_rules

from .common import settle, setup_homeai
from .home import standard_home

FREEZER = {
    "id": "freezer",
    "name": "Freezer too warm",
    "target": {"entities": ["sensor.freezer"]},
    "condition": {"type": "above", "value": -10},
    "minutes": 15,
    "severity": 3,
    "category": "damage",
    "advice": "Check that the door is closed.",
}


def test_validation() -> None:
    [rule] = validate_rules([FREEZER])
    assert rule["mode"] == "each" and rule["when"] == "always" and rule["need"] == "member"
    for bad, reason in (
        ({**FREEZER, "id": "Bad Id"}, "id"),
        ({**FREEZER, "target": {}}, "target"),
        ({**FREEZER, "condition": {"type": "above", "value": "warm"}}, "number"),
        ({**FREEZER, "severity": 7}, "severity"),
        ({**FREEZER, "category": "fun"}, "category"),
    ):
        with pytest.raises(SettingError, match=reason):
            validate_rules([bad])
    with pytest.raises(SettingError, match="unique"):
        validate_rules([FREEZER, FREEZER])


async def test_rule_opens_a_situation_after_its_time(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    home = standard_home(hass)
    home.entity(
        "sensor.freezer", "-18", area="Kitchen", attrs={"unit_of_measurement": "°C", "friendly_name": "Freezer"}
    )
    rt = await setup_homeai(hass, rules=[FREEZER])
    hub = rt.module("signals")
    home.set("sensor.freezer", "-5")
    assert not [s for s in hub.evaluate().values() if s and s.kind == "custom"]
    freezer.tick(timedelta(minutes=16))
    await settle(hass, rt)
    [s] = rt.module("situations").open()
    assert s.kind == "custom" and s.severity == 3 and s.category == "damage"
    assert s.title("en") == "Freezer too warm: Freezer" and s.description("en") == "Check that the door is closed."


async def test_label_targets_and_all_mode(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    home = standard_home(hass)
    label = home.label("Plants")
    home.entity("sensor.fern", "10", labels=("Plants",))
    home.entity("sensor.cactus", "40", labels=("Plants",))
    each = {
        "id": "dry",
        "name": "Plant dry",
        "target": {"label": label},
        "condition": {"type": "below", "value": 20},
        "minutes": 0,
        "severity": 1,
        "category": "maintenance",
    }
    every = {**each, "id": "all_dry", "name": "All plants dry", "mode": "all"}
    rt = await setup_homeai(hass, rules=[each, every])
    found = [s for s in rt.module("signals").evaluate().values() if s and s.kind == "custom"]
    assert [s.entities for s in found] == [("sensor.fern",)]
    home.set("sensor.cactus", "5")
    found = {s.id for s in rt.module("signals").evaluate().values() if s and s.kind == "custom"}
    assert "custom:all_dry:all" in found and "custom:dry:sensor.cactus" in found


async def test_only_when_away(hass: HomeAssistant) -> None:
    home = standard_home(hass)
    rule = {
        "id": "tv",
        "name": "TV on in an empty home",
        "target": {"entities": ["switch.coffee"]},
        "condition": {"type": "state", "value": "on"},
        "when": "away",
        "severity": 1,
        "category": "energy",
    }
    rt = await setup_homeai(hass, rules=[rule])
    home.set("switch.coffee", "on")
    hub = rt.module("signals")
    hub.evaluate()
    assert not [s for s in hub.signals.values() if s.kind == "custom"]
    home.set("person.anna", "not_home")
    hub.evaluate()
    assert [s for s in hub.signals.values() if s.kind == "custom"]


async def test_rules_websocket(hass: HomeAssistant, hass_ws_client) -> None:
    home = standard_home(hass)
    home.entity("sensor.freezer", "-5", area="Kitchen")
    await setup_homeai(hass, rules=[FREEZER])
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "homeai/rules/preview", "rule": FREEZER})
    msg = await client.receive_json()
    assert msg["result"]["covered"][0]["entity_id"] == "sensor.freezer" and msg["result"]["meeting"] == [
        "sensor.freezer"
    ]
    await client.send_json_auto_id({"type": "homeai/rules/preview", "rule": {**FREEZER, "severity": 9}})
    msg = await client.receive_json()
    assert not msg["success"] and msg["error"]["code"] == "invalid_format"
    await client.send_json_auto_id({"type": "homeai/rules/list"})
    msg = await client.receive_json()
    assert msg["result"]["rules"][0]["id"] == "freezer" and msg["result"]["rules"][0]["firing"] is False


FORM = {
    "name": "Freezer too warm",
    "enabled": True,
    "target": {"entities": ["sensor.freezer"]},
    "condition": {"condition": "above", "value": "-10", "minutes": 15, "when": "always", "mode": "each"},
    "situation": {"severity": 3, "category": "damage", "need": "member", "advice": "Check the door."},
}


async def test_rule_is_added_and_changed_as_a_subentry(hass: HomeAssistant) -> None:
    """Add rule on the integration page: a form, then a preview of what it covers; saving applies it without a
    reload. Reconfigure changes it and keeps its id."""
    from homeassistant.config_entries import SOURCE_RECONFIGURE, SOURCE_USER
    from homeassistant.data_entry_flow import FlowResultType

    home = standard_home(hass)
    home.entity("sensor.freezer", "-5", area="Kitchen", attrs={"friendly_name": "Freezer"})
    rt = await setup_homeai(hass)
    entry = rt.entry
    flows = hass.config_entries.subentries
    result = await flows.async_init((entry.entry_id, "rule"), context={"source": SOURCE_USER})
    assert result["type"] is FlowResultType.FORM and result["step_id"] == "rule"
    bad = {**FORM, "condition": {**FORM["condition"], "value": "warm"}}
    result = await flows.async_configure(result["flow_id"], bad)
    assert result["step_id"] == "rule" and result["errors"] == {"base": "invalid_rule"}
    assert "number" in result["description_placeholders"]["error"]
    result = await flows.async_configure(result["flow_id"], FORM)
    assert result["step_id"] == "preview"
    preview = result["description_placeholders"]
    assert preview["count"] == "1" and preview["covered"] == "Freezer" and preview["meeting"] == "Freezer"
    result = await flows.async_configure(result["flow_id"], {})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert entry.runtime_data is rt  # applied without a reload
    [rule] = rt.rules
    assert rule["id"] == "freezer_too_warm" and rule["condition"] == {"type": "above", "value": -10.0}
    assert rule["severity"] == 3 and rule["advice"] == "Check the door."
    assert "sensor.freezer" in rt.module("signals")._watch

    [sub] = [s for s in entry.subentries.values() if s.subentry_type == "rule"]
    result = await flows.async_init(
        (entry.entry_id, "rule"), context={"source": SOURCE_RECONFIGURE, "subentry_id": sub.subentry_id}
    )
    assert result["step_id"] == "rule"
    result = await flows.async_configure(
        result["flow_id"], {**FORM, "name": "Freezer warm", "situation": {**FORM["situation"], "severity": 2}}
    )
    result = await flows.async_configure(result["flow_id"], {})
    assert result["type"] is FlowResultType.ABORT and result["reason"] == "reconfigure_successful"
    await hass.async_block_till_done()
    assert entry.runtime_data is rt
    assert rt.rules[0]["id"] == "freezer_too_warm" and rt.rules[0]["severity"] == 2
    assert entry.subentries[sub.subentry_id].title == "Freezer warm"

    hass.config_entries.async_remove_subentry(entry, sub.subentry_id)
    await hass.async_block_till_done()
    assert entry.runtime_data is rt and rt.rules == []


async def test_rules_from_the_old_setting_become_subentries(hass: HomeAssistant, hass_storage) -> None:
    """Before 1.7 the rules were the setting `detectors.custom`: the entry's migration moves each valid rule to a
    subentry once and drops the setting; other settings stay."""
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    from custom_components.homeai.const import DOMAIN

    from .common import FAST

    hass_storage["homeai.settings"] = {
        "version": 1,
        "minor_version": 1,
        "key": "homeai.settings",
        "data": {
            "global": {"detectors.custom": [FREEZER, {"id": "Not valid"}], "general.language": "pl"},
            "overrides": {},
            "history": [],
        },
    }
    standard_home(hass)
    entry = MockConfigEntry(
        domain=DOMAIN,
        data={"initial_settings": dict(FAST), "initial_settings_applied": True},
        version=1,
        minor_version=2,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.minor_version == 3
    [sub] = [s for s in entry.subentries.values() if s.subentry_type == "rule"]
    assert sub.unique_id == "freezer" and sub.title == "Freezer too warm" and sub.data["minutes"] == 15
    rt = entry.runtime_data
    assert [r["id"] for r in rt.rules] == ["freezer"]
    assert rt.settings.get("general.language") == "pl"
    assert "detectors.custom" not in hass_storage["homeai.settings"]["data"]["global"]
