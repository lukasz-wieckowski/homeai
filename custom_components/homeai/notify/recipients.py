"""Who receives notifications and on which devices.

Phones are discovered without names typed by anyone: a person's device tracker from the companion app, or a
companion-app registration made by the person's own user account, gives the `notify.mobile_app_<device>`
service. Settings may add notify entities or services per person, or exclude tablets and computers.
"""

from __future__ import annotations

import re

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.util import slugify

from ..settings import SettingsManager, Target

APP = "mobile_app"


def _is_handheld(data: dict) -> bool:
    """A phone, not a tablet or computer. What the device is comes from its model and system; its name is the
    owner's (“Maciek's iPhone” is not a Mac) and counts only as whole words."""
    kind = f"{data.get('model', '')} {data.get('os_name', '')}".lower()
    if any(x in kind for x in ("ipad", "mac", "windows", "linux")):
        return False
    words = set(re.split(r"[^a-z0-9]+", str(data.get("device_name", "")).lower()))
    return not words & {"ipad", "tablet", "macbook", "imac", "tab"}


def app_targets(hass: HomeAssistant, person_entity_id: str, *, include_tablets: bool = False) -> list[str]:
    """`notify.mobile_app_*` services for one person."""
    state = hass.states.get(person_entity_id)
    if state is None:
        return []
    entries = {e.entry_id: e for e in hass.config_entries.async_entries(APP)}
    ents = er.async_get(hass)
    devs = dr.async_get(hass)
    candidates: list[dict] = []
    for tracker in state.attributes.get("device_trackers") or []:
        e = ents.async_get(tracker)
        if e is None or e.platform != APP:
            continue
        if e.config_entry_id in entries:
            candidates.append(dict(entries[e.config_entry_id].data))
        elif e.device_id and (d := devs.async_get(e.device_id)) and d.config_entry_id in entries:
            candidates.append(dict(entries[d.config_entry_id].data))
    if user_id := state.attributes.get("user_id"):
        candidates += [dict(e.data) for e in entries.values() if e.data.get("user_id") == user_id]
    out: list[str] = []
    for data in candidates:
        name = data.get("device_name")
        if not name or (not include_tablets and not _is_handheld(data)):
            continue
        service = f"notify.mobile_app_{slugify(str(name))}"
        if hass.services.has_service("notify", service.split(".", 1)[1]) and service not in out:
            out.append(service)
    return out


def targets_for(hass: HomeAssistant, settings: SettingsManager, person_entity_id: str) -> list[str]:
    """All notification targets of a person: discovered app services plus configured ones."""
    target = Target(person_id=person_entity_id)
    configured = list(settings.get("notify.targets", target))
    discovered = (
        app_targets(hass, person_entity_id, include_tablets=bool(settings.get("notify.include_tablets", target)))
        if settings.get("notify.discover_apps", target)
        else []
    )
    return list(dict.fromkeys(configured + discovered))
