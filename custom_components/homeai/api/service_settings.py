"""Services for settings: export them (as response data) and import an export.

Settings are changed in the integration's options; these services move them between installations or keep a copy
in an automation's or a script's variables. Both are for administrators.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.exceptions import ServiceValidationError
import voluptuous as vol

from ..const import DOMAIN
from ..settings import SettingError, parse_scope_key
from ..signals.rules import LEGACY_KEY, add_rules
from .services import SERVICES, ServiceDef


async def export_settings(rt: Any, call: ServiceCall) -> ServiceResponse:
    """Everything that differs from the defaults: global values and values for places."""
    return rt.settings.export()


async def import_settings(rt: Any, call: ServiceCall) -> ServiceResponse:
    """Replace all settings with an export (all or nothing). Rules in an export from before 1.7 become rules."""
    data: dict[str, Any] = {
        "global": dict(call.data["settings"].get("global") or {}),
        "overrides": dict(call.data["settings"].get("overrides") or {}),
    }
    legacy = data["global"].pop(LEGACY_KEY, None)
    try:
        for skey in data["overrides"]:
            parse_scope_key(skey)
        changed = rt.settings.import_(data, user=call.context.user_id)
    except SettingError as err:
        raise ServiceValidationError(
            translation_domain=DOMAIN, translation_key="settings_invalid", translation_placeholders={"reason": str(err)}
        ) from err
    rules = add_rules(rt.hass, rt.entry, legacy) if legacy is not None else 0
    rt.journal.add("setting", rt.text("journal|settings_imported", count=changed), actor="person")
    return {"changed": changed, "rules_added": rules}


SERVICES.extend(
    [
        ServiceDef("export_settings", export_settings, vol.Schema({}), SupportsResponse.ONLY, admin=True),
        ServiceDef(
            "import_settings",
            import_settings,
            vol.Schema({vol.Required("settings"): dict}),
            SupportsResponse.OPTIONAL,
            admin=True,
        ),
    ]
)
