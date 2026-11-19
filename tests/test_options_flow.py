"""The integration's options: every settings section as a form, settings for a place, undo and reset."""

from __future__ import annotations

import json
from pathlib import Path
import subprocess
import sys
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType, section
import voluptuous as vol

from custom_components.homeai.options_flow import (
    ADVANCED,
    LITERAL_PLACEHOLDERS,
    field,
    layout,
    translated_options,
)
from custom_components.homeai.settings import Target, build_registry

from .common import setup_homeai
from .home import standard_home

ROOT = Path(__file__).parents[1]


def answers(schema: vol.Schema) -> dict[str, Any]:
    """What the frontend sends for an untouched form: defaults and suggested values, parts as nested objects."""
    out: dict[str, Any] = {}
    for key, value in schema.schema.items():
        name = str(key)
        if isinstance(value, section):
            out[name] = answers(value.schema)
            continue
        default = key.default() if callable(getattr(key, "default", None)) else vol.UNDEFINED
        suggested = (key.description or {}).get("suggested_value") if isinstance(key.description, dict) else None
        if default is not vol.UNDEFINED:
            out[name] = default
        elif suggested not in (None, "", []):
            out[name] = suggested
    return out


async def open_step(hass: HomeAssistant, entry_id: str, step: str) -> dict[str, Any]:
    result = await hass.config_entries.options.async_init(entry_id)
    assert result["type"] is FlowResultType.MENU and result["step_id"] == "init"
    return await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": step})


async def test_menu_lists_every_section_and_the_tools(hass: HomeAssistant) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    result = await hass.config_entries.options.async_init(rt.entry.entry_id)
    assert result["type"] is FlowResultType.MENU
    assert list(result["menu_options"]) == [*build_registry().sections(), "place", "undo", "reset"]
    assert "prompts" in result["menu_options"]


async def test_section_form_saves_changes_and_hides_advanced_ones(hass: HomeAssistant) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    result = await open_step(hass, rt.entry.entry_id, "general")
    assert result["type"] is FlowResultType.FORM and result["step_id"] == "general"
    schema = result["data_schema"].schema
    fields = {str(k) for k in schema}
    assert {"general_language", "general_night_start", ADVANCED} <= fields
    advanced = next(v for k, v in schema.items() if str(k) == ADVANCED)
    assert advanced.options["collapsed"] is True
    assert "general_tick_seconds" in {str(k) for k in advanced.schema.schema}
    data = answers(result["data_schema"])
    assert data["general_night_start"] == "23:00:00"
    data.update(general_language="pl", general_night_start="22:30:00", general_assistant_name="Jarvis")
    result = await hass.config_entries.options.async_configure(result["flow_id"], data)
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert rt.settings.get("general.language") == "pl" and rt.settings.get("general.night_start") == "22:30"
    assert rt.settings.get("general.assistant_name") == "Jarvis"
    assert rt.settings.get("general.journal_retention_days") == 30  # untouched values stay default
    assert rt.settings.source("general.journal_retention_days") == "default"
    assert rt.journal.recent(1, kind="setting")[0]["text"].startswith("Zmiana ustawienia")


async def test_durations_lists_and_empty_texts(hass: HomeAssistant) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    result = await open_step(hass, rt.entry.entry_id, "situations")
    data = answers(result["data_schema"])
    assert data["situations_close_after"] == {"hours": 0, "minutes": 0, "seconds": 0}  # tests run with 0
    data["situations_close_after"] = {"hours": 1, "minutes": 2, "seconds": 3}
    await hass.config_entries.options.async_configure(result["flow_id"], data)
    assert rt.settings.get("situations.close_after") == 3723

    result = await open_step(hass, rt.entry.entry_id, "privacy")
    data = answers(result["data_schema"])
    data["privacy_never_send_entities"] = ["sensor.secret"]
    await hass.config_entries.options.async_configure(result["flow_id"], data)
    assert rt.settings.get("privacy.never_send_entities") == ["sensor.secret"]
    result = await open_step(hass, rt.entry.entry_id, "privacy")
    data = answers(result["data_schema"])
    assert data["privacy_never_send_entities"] == ["sensor.secret"]
    del data["privacy_never_send_entities"]  # a cleared field is not sent
    await hass.config_entries.options.async_configure(result["flow_id"], data)
    assert rt.settings.get("privacy.never_send_entities") == []


async def test_detection_is_split_by_what_it_watches(hass: HomeAssistant) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    _top, parts = layout(rt.settings.registry, "detectors")
    assert "battery" in parts and "safety" in parts and ADVANCED in parts
    result = await open_step(hass, rt.entry.entry_id, "detectors")
    data = answers(result["data_schema"])
    assert data["battery"]["detectors_battery_threshold"] == 20
    data["battery"]["detectors_battery_threshold"] = 35
    await hass.config_entries.options.async_configure(result["flow_id"], data)
    assert rt.settings.get("detectors.battery.threshold") == 35

    rt.settings.set("detectors.consumables.used_up_entities", ["sensor.filter"], user="test")
    result = await open_step(hass, rt.entry.entry_id, "detectors")
    await hass.config_entries.options.async_configure(result["flow_id"], {})  # parts not sent keep their values
    assert rt.settings.get("detectors.consumables.used_up_entities") == ["sensor.filter"]


async def test_a_change_that_lowers_protection_asks_first(hass: HomeAssistant) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    result = await open_step(hass, rt.entry.entry_id, "privacy")
    data = {**answers(result["data_schema"]), "privacy_level": "full"}
    result = await hass.config_entries.options.async_configure(result["flow_id"], data)
    assert result["type"] is FlowResultType.MENU and result["step_id"] == "confirm"
    assert result["menu_options"] == ["apply", "init"] and "→" in result["description_placeholders"]["changes"]
    assert rt.settings.get("privacy.level") == "standard"  # nothing saved yet
    back = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "init"})
    assert back["type"] is FlowResultType.MENU and back["step_id"] == "init"
    assert rt.settings.get("privacy.level") == "standard"

    result = await open_step(hass, rt.entry.entry_id, "privacy")
    data = {**answers(result["data_schema"]), "privacy_level": "full"}
    result = await hass.config_entries.options.async_configure(result["flow_id"], data)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "apply"})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert rt.settings.get("privacy.level") == "full"


async def test_values_the_setting_rejects_are_explained(hass: HomeAssistant) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    result = await open_step(hass, rt.entry.entry_id, "notify")
    data = answers(result["data_schema"])
    data[ADVANCED]["notify_ladder_1"] = [{"after": 0, "to": "nobody at all"}]
    result = await hass.config_entries.options.async_configure(result["flow_id"], data)
    assert result["type"] is FlowResultType.FORM and result["errors"] == {"base": "invalid_setting"}
    assert "to is one of" in result["description_placeholders"]["error"]
    assert rt.settings.source("notify.ladder_1") == "default"


async def test_prompts_have_their_own_page(hass: HomeAssistant) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    result = await open_step(hass, rt.entry.entry_id, "prompts")
    assert {str(k) for k in result["data_schema"].schema} == {
        f"ai_prompt_{m}" for m in ("triage", "investigate", "chat", "arbiter", "digest")
    }
    await hass.config_entries.options.async_configure(result["flow_id"], {"ai_prompt_chat": "Be brief.\nBe kind."})
    assert rt.settings.get("ai.prompt_chat") == "Be brief.\nBe kind."
    result = await open_step(hass, rt.entry.entry_id, "prompts")
    await hass.config_entries.options.async_configure(result["flow_id"], {})  # emptied: the built-in prompt
    assert rt.settings.get("ai.prompt_chat") == ""


async def test_a_setting_read_at_start_reloads_homeai(hass: HomeAssistant) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    entry = rt.entry
    result = await open_step(hass, entry.entry_id, "general")
    data = answers(result["data_schema"])
    data[ADVANCED]["general_tick_seconds"] = {"hours": 0, "minutes": 2, "seconds": 0}
    await hass.config_entries.options.async_configure(result["flow_id"], data)
    await hass.async_block_till_done()
    assert entry.runtime_data is not rt and entry.runtime_data.settings.get("general.tick_seconds") == 120


async def test_settings_for_a_place(hass: HomeAssistant) -> None:
    """Pick a kind of place and the place; the form shows only what can differ there. A filled field is the
    place's own value, an emptied one inherits again."""
    home = standard_home(hass)
    kitchen = home.area("Kitchen")
    rt = await setup_homeai(hass)
    result = await open_step(hass, rt.entry.entry_id, "place")
    assert result["step_id"] == "place"
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"scope": "area"})
    assert result["step_id"] == "place_target"
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"target": kitchen})
    assert result["step_id"] == "place_settings" and result["description_placeholders"]["place"] == "Kitchen"
    parts = {str(k): v for k, v in result["data_schema"].schema.items()}
    assert "general" not in parts  # nothing in General can differ per area
    detection = {str(k) for k in parts["detectors"].schema.schema}
    assert "detectors_battery_threshold" in detection and "detectors_internet_minutes" not in detection
    assert all(v.options["collapsed"] for v in parts.values())  # no own values yet
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"detectors": {"detectors_battery_threshold": 40, "detectors_security_openings_at_night": "off"}},
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    target = Target(area_id=kitchen)
    assert rt.settings.get("detectors.battery.threshold", target) == 40
    assert rt.settings.get("detectors.security.openings_at_night", target) is False
    assert rt.settings.get("detectors.battery.threshold") == 20

    result = await open_step(hass, rt.entry.entry_id, "place")
    assert "Kitchen" in result["description_placeholders"]["places"]
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"scope": "area"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"target": kitchen})
    data = answers(result["data_schema"])
    assert data["detectors"]["detectors_battery_threshold"] == 40
    assert data["detectors"]["detectors_security_openings_at_night"] == "off"
    del data["detectors"]["detectors_battery_threshold"]  # emptied: inherit again
    await hass.config_entries.options.async_configure(result["flow_id"], data)
    assert rt.settings.overrides_for(f"area:{kitchen}") == {"detectors.security.openings_at_night": False}

    result = await open_step(hass, rt.entry.entry_id, "place")
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"scope": "area"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"target": kitchen})
    await hass.config_entries.options.async_configure(result["flow_id"], {})  # no part sent: nothing changes
    assert rt.settings.overrides_for(f"area:{kitchen}") == {"detectors.security.openings_at_night": False}


async def test_a_person_gets_a_role(hass: HomeAssistant) -> None:
    home = standard_home(hass)
    rt = await setup_homeai(hass)
    person = next(iter(rt.world.persons))
    result = await open_step(hass, rt.entry.entry_id, "place")
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"scope": "person"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"target": person})
    data = answers(result["data_schema"])
    data.setdefault("presence", {})["presence_role"] = "guest"
    await hass.config_entries.options.async_configure(result["flow_id"], data)
    assert rt.settings.get("presence.role", Target(person_id=person)) == "guest"
    assert home is not None


async def test_undo_and_reset(hass: HomeAssistant) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    result = await hass.config_entries.options.async_init(rt.entry.entry_id)
    first = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "undo"})
    assert first["type"] is FlowResultType.FORM  # the setup wizard's values are changes too

    rt.settings.set("situations.dismiss_days", 3, user="test")
    rt.settings.set("situations.min_duration", 30, user="test")
    result = await open_step(hass, rt.entry.entry_id, "undo")
    assert result["step_id"] == "undo" and "0" in result["description_placeholders"]["change"]
    result = await hass.config_entries.options.async_configure(result["flow_id"], {})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert rt.settings.get("situations.min_duration") == 0 and rt.settings.get("situations.dismiss_days") == 3

    result = await open_step(hass, rt.entry.entry_id, "reset")
    assert result["step_id"] == "reset"
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"section": "situations"})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert rt.settings.get("situations.dismiss_days") == 7 and rt.settings.get("situations.min_duration") == 60


async def test_nothing_to_undo(hass: HomeAssistant) -> None:
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    from custom_components.homeai.const import DOMAIN

    standard_home(hass)
    entry = MockConfigEntry(domain=DOMAIN, data={"initial_settings": {}}, minor_version=3)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    result = await open_step(hass, entry.entry_id, "undo")
    assert result["type"] is FlowResultType.ABORT and result["reason"] == "nothing_to_undo"


def test_field_names_are_unique_and_translated() -> None:
    """Every generated form field has a label in both languages; the generated translations are current."""
    registry = build_registry()
    names = [field(s.key) for s in registry]
    assert len(names) == len(set(names))
    for lang in ("en", "pl"):
        tr = json.loads((ROOT / f"custom_components/homeai/translations/{lang}.json").read_text(encoding="utf-8"))
        steps = tr["options"]["step"]
        for sid in registry.sections():
            assert tr["options"]["step"]["init"]["menu_options"][sid]
            top, parts = layout(registry, sid)
            for s in top:
                assert steps[sid]["data"][field(s.key)], (lang, s.key)
            for name, items in parts.items():
                assert steps[sid]["sections"][name]["name"], (lang, sid, name)
                for s in items:
                    assert steps[sid]["sections"][name]["data"][field(s.key)], (lang, s.key)
        for s in registry:
            if len(s.scopes) > 1:
                assert steps["place_settings"]["sections"][s.section]["data"][field(s.key)], (lang, s.key)
            if translated_options(s):
                assert set(tr["selector"][field(s.key)]["options"]) == set(s.options), (lang, s.key)
            elif s.options:  # R0…R6 cannot be translation keys: labelled from HomeAI's texts in the form
                assert field(s.key) not in tr["selector"], (lang, s.key)
    script = str(ROOT / "scripts/gen_translations.py")
    result = subprocess.run([sys.executable, script, "--check"], capture_output=True, text=True, check=False)
    assert result.returncode == 0, result.stdout


def _strings(node: Any) -> list[str]:
    if isinstance(node, dict):
        return [t for v in node.values() for t in _strings(v)]
    return [node]


def test_translations_follow_home_assistants_rules() -> None:
    """The rules hassfest checks in CI: no HTML, URLs or quoted placeholders in texts, placeholders are identifiers
    (and the generated forms fill every one of them), choices have lowercase keys, field help only for fields."""
    import re
    import string

    key = re.compile(r"^(?!.+[_-]{2})(?![_-])[a-z0-9-_]+(?<![_-])$")
    url = re.compile(r"((https?|mqtts?|ftps?|scp|socket|socks5)://|www\.)[a-z0-9]+([-.][a-z0-9]+)*\.[a-z]{2,5}", re.I)
    for lang in ("en", "pl"):
        tr = json.loads((ROOT / f"custom_components/homeai/translations/{lang}.json").read_text(encoding="utf-8"))

        def walk(node: Any, path: str) -> None:
            if isinstance(node, dict):
                for k, v in node.items():
                    walk(v, f"{path}.{k}")
                return
            assert not re.search(r"<[a-z].*?>", node, re.I), path
            assert not re.search(r"'{\w+}'", node), path
            assert not url.search(node), path
            assert node == node.strip(), path
            for _, name, _, _ in string.Formatter().parse(node):
                assert not name or name.isidentifier(), (path, name)

        walk(tr, lang)
        for name, spec in tr["selector"].items():
            assert all(key.match(option) for option in spec.get("options", {})), (lang, name)
        for sid in build_registry().sections():
            step = tr["options"]["step"][sid]
            assert set(step.get("data_description", {})) <= set(step.get("data", {})), (lang, sid)
            texts = " ".join(_strings(step))
            used = {name for _, name, _, _ in string.Formatter().parse(texts) if name}
            assert used <= set(LITERAL_PLACEHOLDERS) | {"error"}, (lang, sid, used)
