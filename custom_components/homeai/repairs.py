"""Repairs that HomeAI can fix with a short flow.

`finish_setup`: the config entry was not made by HomeAI's setup wizard — for example an entry left by an earlier
integration that also used the domain `homeai`. HomeAI then runs with defaults (people's roles from their Home
Assistant accounts, language from Home Assistant, standard privacy). The flow asks what the wizard would have asked
and writes it to the settings, like the wizard does.
"""

from __future__ import annotations

from typing import Any

from homeassistant import data_entry_flow
from homeassistant.components.repairs import RepairsFlow
from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir
from homeassistant.helpers.selector import SelectSelector, SelectSelectorConfig, SelectSelectorMode
import voluptuous as vol

from .const import CONF_NEEDS_SETUP, DOMAIN
from .settings.definitions import ROLES

ISSUE_FINISH_SETUP = "finish_setup"
LANGUAGES = ["auto", "en", "pl"]
PRIVACY = ["standard", "minimal", "full"]


def _select(options: list[str], key: str) -> SelectSelector:
    return SelectSelector(SelectSelectorConfig(options=options, translation_key=key, mode=SelectSelectorMode.DROPDOWN))


def async_check_setup(hass: HomeAssistant, runtime: Any) -> None:
    """Show `finish_setup` in Repairs while the entry still needs it."""
    if runtime.entry.data.get(CONF_NEEDS_SETUP):
        ir.async_create_issue(
            hass,
            DOMAIN,
            ISSUE_FINISH_SETUP,
            is_fixable=True,
            is_persistent=False,
            severity=ir.IssueSeverity.WARNING,
            translation_key=ISSUE_FINISH_SETUP,
            data={"entry_id": runtime.entry.entry_id},
        )
    else:
        ir.async_delete_issue(hass, DOMAIN, ISSUE_FINISH_SETUP)


class FinishSetupFlow(RepairsFlow):
    """The setup wizard's questions, for an entry that skipped it."""

    def __init__(self, entry_id: str) -> None:
        self.entry_id = entry_id
        self._chosen: dict[str, Any] = {}

    def _runtime(self) -> Any:
        entry = self.hass.config_entries.async_get_entry(self.entry_id)
        return getattr(entry, "runtime_data", None) if entry is not None else None

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> data_entry_flow.FlowResult:
        runtime = self._runtime()
        if runtime is None:
            return self.async_abort(reason="not_loaded")
        if user_input is not None:
            self._chosen = dict(user_input)
            return await self.async_step_people()
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Required("language", default=str(runtime.settings.get("general.language"))): _select(
                        LANGUAGES, "language"
                    ),
                    vol.Required("privacy", default=str(runtime.settings.get("privacy.level"))): _select(
                        PRIVACY, "privacy"
                    ),
                }
            ),
        )

    async def async_step_people(self, user_input: dict[str, Any] | None = None) -> data_entry_flow.FlowResult:
        runtime = self._runtime()
        if runtime is None:
            return self.async_abort(reason="not_loaded")
        persons = sorted((s.entity_id, s.name) for s in self.hass.states.async_all("person"))
        if user_input is not None or not persons:
            settings = runtime.settings
            settings.set("general.language", self._chosen["language"], user="setup", confirmed=True)
            settings.set("privacy.level", self._chosen["privacy"], user="setup", confirmed=True)
            for entity_id, _name in persons:
                role = (user_input or {}).get(entity_id, runtime.presence.role(entity_id))
                settings.set("presence.role", role, skey=f"person:{entity_id}", user="setup", confirmed=True)
            entry = runtime.entry
            data = {k: v for k, v in entry.data.items() if k != CONF_NEEDS_SETUP}
            self.hass.config_entries.async_update_entry(entry, data=data)
            ir.async_delete_issue(self.hass, DOMAIN, ISSUE_FINISH_SETUP)
            return self.async_create_entry(data={})
        schema = {
            vol.Required(entity_id, default=runtime.presence.role(entity_id)): _select(list(ROLES), "role")
            for entity_id, _name in persons
        }
        names = ", ".join(f"{name} ({entity_id})" for entity_id, name in persons)
        return self.async_show_form(
            step_id="people", data_schema=vol.Schema(schema), description_placeholders={"people": names}
        )


async def async_create_fix_flow(hass: HomeAssistant, issue_id: str, data: dict[str, Any] | None) -> RepairsFlow:
    if issue_id == ISSUE_FINISH_SETUP and data and data.get("entry_id"):
        return FinishSetupFlow(str(data["entry_id"]))
    raise ValueError(f"No repair flow for {issue_id}")
