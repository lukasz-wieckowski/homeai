"""Restarting a hub through its own restart button (`button` with device class `restart`).

Many hubs and bridges expose one (Zigbee2MQTT, network gear, media servers). It is the generic way to restart a
hub on any installation, with or without the Supervisor's add-ons. HomeAI presses it when the hub says it needs a
restart (a `problem` binary sensor about a restart, e.g. Zigbee2MQTT's "Restart required") — at a quiet moment —
and as a repair when the hub is offline but its button still works.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

RESTART_WORDS = ("restart", "reboot")
UNAVAILABLE = ("unavailable",)


def restart_button(hass: HomeAssistant, device_id: str | None) -> str | None:
    """The device's working restart button, if it has one."""
    if not device_id:
        return None
    registry = er.async_get(hass)
    for entry in er.async_entries_for_device(registry, device_id):
        if entry.domain != "button" or entry.disabled_by:
            continue
        state = hass.states.get(entry.entity_id)
        device_class = (
            entry.device_class
            or entry.original_device_class
            or (state.attributes.get("device_class") if state else None)
        )
        if device_class == "restart" and state is not None and state.state not in UNAVAILABLE:
            return entry.entity_id
    return None


def asks_for_restart(hass: HomeAssistant, entity_id: str) -> bool:
    """A problem sensor that is about a needed restart (by its id, translation key or original name)."""
    entry = er.async_get(hass).async_get(entity_id)
    if entry is None:
        return False
    texts = (entry.unique_id, entry.translation_key or "", entry.original_name or "")
    return any(word in str(t).lower() for t in texts for word in RESTART_WORDS)


def quiet_now(rt: Any) -> bool:
    """A good moment to restart a hub: nobody is home, or everyone at home is asleep."""
    residents = rt.presence.residents()
    at_home = [p for p in residents if p.home]
    return not at_home or all(p.sleep.asleep for p in at_home)
