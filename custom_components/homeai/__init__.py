"""HomeAI: home intelligence for Home Assistant.

One config entry runs one `HomeAIRuntime`: world model, detection, situations, notifications, policy, actions,
scheduler, memory and the optional AI tiers. Everything is configured from the UI: the setup wizard, the options
(every setting, also per floor, area, device, entity or person) and subentries for AI tiers and custom rules.
"""

from __future__ import annotations

import importlib
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .api.services import async_register_services
from .api.websocket import async_register as async_register_websocket
from .const import (
    CONF_INITIAL_APPLIED,
    CONF_INITIAL_SETTINGS,
    CONF_INSTALLED_AT,
    CONF_NEEDS_SETUP,
    CONF_SYSTEM_USER,
    DOMAIN,
    LOGGER,
    SUBENTRY_RULE,
)
from .platforms import PLATFORMS
from .runtime import HomeAIRuntime

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

type HomeAIConfigEntry = ConfigEntry[HomeAIRuntime]


def _preload() -> None:
    """Import every HomeAI module in an executor thread; the event loop then only finds them in sys.modules."""
    from . import stages
    from .api import registry  # noqa: F401

    for name in stages.STAGE_MODULES:
        importlib.import_module(f".{name}", __package__)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register things that live as long as Home Assistant: WebSocket commands and services."""
    await hass.async_add_executor_job(_preload)
    async_register_websocket(hass)
    async_register_services(hass)
    return True


ENTRY_KEYS = (CONF_INITIAL_SETTINGS, CONF_INITIAL_APPLIED, CONF_SYSTEM_USER, CONF_INSTALLED_AT, CONF_NEEDS_SETUP)


async def async_migrate_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """1.1 → 1.2. An entry HomeAI's wizard did not make (it has no wizard answers — e.g. one left by an earlier
    integration with the same domain) keeps only HomeAI's own keys, so foreign data such as an old API key does not
    linger in it, and is flagged so Repairs offers to finish the setup.

    1.2 → 1.3. Custom rules move from the `detectors.custom` setting to rule subentries."""
    if entry.version > 1:
        return False
    if entry.minor_version < 2:
        data = {k: v for k, v in entry.data.items() if k in ENTRY_KEYS}
        if CONF_INITIAL_SETTINGS not in entry.data:
            data[CONF_NEEDS_SETUP] = True
            LOGGER.warning("HomeAI's config entry was not made by its setup wizard; finish the setup in Repairs")
        hass.config_entries.async_update_entry(entry, data=data, minor_version=2)
    if entry.minor_version < 3:
        from .signals.rules import async_move_legacy_rules

        await async_move_legacy_rules(hass, entry)
        hass.config_entries.async_update_entry(entry, minor_version=3)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: HomeAIConfigEntry) -> bool:
    """Set up HomeAI from a config entry."""
    runtime = HomeAIRuntime(hass, entry)
    entry.runtime_data = runtime
    try:
        await runtime.async_setup()
        from .repairs import async_check_setup

        async_check_setup(hass, runtime)
        runtime.subentry_snapshot = _subentries(entry)
        await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
        from .panel import async_setup_panel

        await async_setup_panel(hass, runtime)
    except Exception:
        # a failed setup leaves nothing running: no listeners, timers or plan that a retry would then double
        await runtime.async_unload()
        raise
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    return True


def _subentries(entry: ConfigEntry) -> dict[str, Any]:
    """The subentries a change of which needs a reload (AI tiers); rules are applied without one."""
    return {
        sid: (sub.subentry_type, dict(sub.data))
        for sid, sub in entry.subentries.items()
        if sub.subentry_type != SUBENTRY_RULE
    }


async def _async_update_listener(hass: HomeAssistant, entry: HomeAIConfigEntry) -> None:
    """Subentries changed. AI tiers: reload so modules pick them up. Rules: the custom detector takes the new list
    at once. Data written by HomeAI itself does not reload."""
    runtime = getattr(entry, "runtime_data", None)
    if runtime is None or getattr(runtime, "subentry_snapshot", None) != _subentries(entry):
        await hass.config_entries.async_reload(entry.entry_id)
        return
    from .signals.rules import rules_of

    runtime.set_rules(rules_of(entry))


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """HomeAI removed: remove its system user too."""
    if (user_id := entry.data.get(CONF_SYSTEM_USER)) and (user := await hass.auth.async_get_user(user_id)):
        await hass.auth.async_remove_user(user)


async def async_unload_entry(hass: HomeAssistant, entry: HomeAIConfigEntry) -> bool:
    """Unload a HomeAI config entry."""
    ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if ok:
        from .panel import async_remove_panel

        async_remove_panel(hass)
        await entry.runtime_data.async_unload()
    return ok
