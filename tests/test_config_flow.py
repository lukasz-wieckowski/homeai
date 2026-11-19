"""Setup wizard, options and single instance."""

from __future__ import annotations

from homeassistant.config_entries import SOURCE_USER
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.homeai.const import CONF_INITIAL_SETTINGS, DOMAIN, NAME


async def test_wizard_without_people(hass: HomeAssistant) -> None:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    assert result["type"] is FlowResultType.FORM and result["step_id"] == "user"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"language": "pl", "privacy": "minimal"})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == NAME
    initial = result["data"][CONF_INITIAL_SETTINGS]
    assert initial["general.language"] == "pl" and initial["privacy.level"] == "minimal"


async def test_wizard_with_people_applies_roles(hass: HomeAssistant) -> None:
    hass.states.async_set("person.anna", "home", {"friendly_name": "Anna"})
    hass.states.async_set("person.guest", "not_home", {"friendly_name": "Guest"})
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"language": "auto", "privacy": "standard"}
    )
    assert result["step_id"] == "people"
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"person.anna": "admin", "person.guest": "guest"}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    entry = result["result"]
    await hass.async_block_till_done()
    rt = entry.runtime_data
    from custom_components.homeai.settings import Target

    assert rt.settings.get("presence.role", Target(person_id="person.anna")) == "admin"
    assert rt.settings.get("presence.role", Target(person_id="person.guest")) == "guest"
    assert entry.data["initial_settings_applied"] is True
    assert await hass.config_entries.async_unload(entry.entry_id)


async def test_only_one_instance(hass: HomeAssistant) -> None:
    MockConfigEntry(domain=DOMAIN).add_to_hass(hass)
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "single_instance_allowed"


async def test_options_quick_settings(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"general_language": "pl", "privacy_level": "standard"}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert entry.runtime_data.settings.get("general.language") == "pl"


async def test_entry_not_made_by_the_wizard_is_cleaned_and_finished_in_repairs(
    hass: HomeAssistant, hass_admin_user, hass_read_only_user
) -> None:
    """An entry left by an earlier integration with the same domain: its foreign data is dropped, people's roles
    follow their Home Assistant accounts until chosen, and Repairs asks the wizard's questions."""
    from homeassistant.helpers import issue_registry as ir
    from homeassistant.setup import async_setup_component

    from custom_components.homeai.const import CONF_NEEDS_SETUP
    from custom_components.homeai.repairs import ISSUE_FINISH_SETUP

    from .home import standard_home

    assert await async_setup_component(hass, "repairs", {})
    home = standard_home(hass)
    home.person("anna", "Anna", user_id=hass_admin_user.id)
    home.person("ben", "Ben", user_id=hass_read_only_user.id)
    entry = MockConfigEntry(domain=DOMAIN, data={"api_key": "sk-old", "something": 1}, version=1, minor_version=1)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.minor_version == 2
    assert "api_key" not in entry.data and "something" not in entry.data and entry.data[CONF_NEEDS_SETUP]
    rt = entry.runtime_data
    assert rt.presence.role("person.anna") == "admin" and rt.presence.role("person.ben") == "member"
    issue = ir.async_get(hass).async_get_issue(DOMAIN, ISSUE_FINISH_SETUP)
    assert issue is not None and issue.is_fixable

    from custom_components.homeai.repairs import async_create_fix_flow

    flow = await async_create_fix_flow(hass, ISSUE_FINISH_SETUP, issue.data)
    flow.hass = hass
    result = await flow.async_step_init()
    assert result["step_id"] == "init"
    result = await flow.async_step_init({"language": "pl", "privacy": "minimal"})
    assert result["step_id"] == "people"
    result = await flow.async_step_people({"person.anna": "admin", "person.ben": "guest"})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert rt.settings.get("general.language") == "pl" and rt.settings.get("privacy.level") == "minimal"
    assert rt.presence.role("person.ben") == "guest"
    assert CONF_NEEDS_SETUP not in entry.data
    assert ir.async_get(hass).async_get_issue(DOMAIN, ISSUE_FINISH_SETUP) is None


async def test_wizard_entries_are_not_flagged(hass: HomeAssistant) -> None:
    from custom_components.homeai.const import CONF_NEEDS_SETUP

    from .common import setup_homeai

    rt = await setup_homeai(hass)
    assert CONF_NEEDS_SETUP not in rt.entry.data and rt.entry.minor_version == 2
