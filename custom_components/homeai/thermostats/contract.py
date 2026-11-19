"""The thermostat schedule contract (version 1), as HomeAI uses it.

A `climate` entity says it speaks the contract with the attribute

    homeai_schedule: {"version": 1, "domain": "<integration domain>"}

and offers these services in that domain, each targeting the climate entity:

- `add_override` — `end` (required), `start`, exactly one of `preset_mode` / `temperature`, `reason` (≤ 200),
  `source`, `override_id` (an override with that id is replaced). Responds `{override_id}`.
- `remove_override` — `override_id` or `source`.
- `get_schedule` — responds `{entity_id: {enabled, weekly: [{days, time "HH:MM", preset_mode | temperature}],
  overrides: [...]}}`.
- `set_schedule` — `weekly`: the whole week.
- `estimate` — responds `{entity_id: {minutes | null, confidence}}`.

Optional extensions a thermostat announces in `homeai_schedule.features`:

- `open_end`: `add_override` accepts `open_end: true` — the end is only a horizon the caller renews or removes, so the
  thermostat does not heat ahead towards it. HomeAI sends it with its open-ended overrides (nobody home, vacation
  mode, activity) to thermostats that announce it.

Changes keep their usual meaning: `climate.set_temperature` / `set_preset_mode` are a manual change that lasts until
the next block of the schedule. HomeAI's overrides carry `source: homeai` and a reason.
"""

from __future__ import annotations

from dataclasses import dataclass
import hashlib
import re
from typing import Any

from homeassistant.core import HomeAssistant, State

ATTRIBUTE = "homeai_schedule"
VERSION = 1
SOURCE = "homeai"
REASON_MAX = 200
OPEN_END = "open_end"  # optional feature: an override's end is only a horizon
SERVICES = ("add_override", "remove_override", "get_schedule", "set_schedule", "estimate")
REQUIRED_SERVICES = ("add_override", "remove_override", "get_schedule")
DAYS = ("mon", "tue", "wed", "thu", "fri", "sat", "sun")
_DOMAIN = re.compile(r"^[a-z0-9_]+$")
_TIME = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")


@dataclass(frozen=True, slots=True)
class Thermostat:
    entity_id: str
    domain: str  # where the contract's services live
    areas: tuple[str, ...]  # the rooms it heats
    device_id: str | None
    presets: tuple[str, ...]  # the climate entity's preset_modes ("" when it does not list them)
    available: bool
    features: frozenset[str] = frozenset()  # optional contract extensions it announces (`open_end`)

    def has_preset(self, preset: str) -> bool:
        return not self.presets or preset in self.presets


def contract_domain(state: State | None) -> str | None:
    """The contract domain a climate entity announces, or None when it does not speak version 1."""
    if state is None or not state.entity_id.startswith("climate."):
        return None
    info = state.attributes.get(ATTRIBUTE)
    if not isinstance(info, dict):
        return None
    version, domain = info.get("version"), info.get("domain")
    if isinstance(version, bool) or version != VERSION or not isinstance(domain, str) or not _DOMAIN.match(domain):
        return None
    return domain


def speaks_contract(hass: HomeAssistant, domain: str, entity_id: str) -> bool:
    """Whether `entity_id` announces the contract with services in `domain` (used by the risk policy)."""
    return contract_domain(hass.states.get(entity_id)) == domain


def discover(hass: HomeAssistant, world: Any) -> dict[str, Thermostat]:
    """Every climate entity HomeAI watches that announces the contract and whose services exist."""
    found: dict[str, Thermostat] = {}
    for state in hass.states.async_all("climate"):
        domain = contract_domain(state)
        if domain is None or not all(hass.services.has_service(domain, s) for s in REQUIRED_SERVICES):
            continue
        info = world.entity(state.entity_id)
        if info is None:  # ignored, out of HomeAI's scope or disabled
            continue
        raw_areas = state.attributes[ATTRIBUTE].get("areas")
        areas = tuple(a for a in raw_areas if isinstance(a, str)) if isinstance(raw_areas, list) else ()
        if not areas and info.area_id:
            areas = (info.area_id,)
        presets = state.attributes.get("preset_modes")
        raw_features = state.attributes[ATTRIBUTE].get("features")
        features = (
            frozenset(f for f in raw_features if isinstance(f, str)) if isinstance(raw_features, list) else frozenset()
        )
        found[state.entity_id] = Thermostat(
            entity_id=state.entity_id,
            domain=domain,
            areas=areas,
            device_id=info.device_id,
            presets=tuple(str(p) for p in presets) if isinstance(presets, (list, tuple)) else (),
            available=state.state not in ("unavailable", "unknown"),
            features=features,
        )
    return found


def override_id(kind: str, key: str, entity_id: str) -> str:
    """A stable id for one of HomeAI's overrides: the same reason on the same thermostat keeps its id, so HomeAI
    replaces or removes it after a restart without having to remember the thermostat's answer."""
    digest = hashlib.sha1(f"{kind}|{key}|{entity_id}".encode()).hexdigest()[:10]
    return f"homeai_{kind}_{digest}"


async def get_schedule(hass: HomeAssistant, t: Thermostat) -> dict[str, Any] | None:
    """The thermostat's week and overrides, or None when it cannot answer."""
    try:
        response = await hass.services.async_call(
            t.domain, "get_schedule", {"entity_id": t.entity_id}, blocking=True, return_response=True
        )
    except Exception:
        return None
    data = response.get(t.entity_id) if isinstance(response, dict) else None
    if not isinstance(data, dict):
        return None
    weekly = data.get("weekly")
    overrides = data.get("overrides")
    return {
        "enabled": bool(data.get("enabled", True)),
        "weekly": [b for b in weekly if isinstance(b, dict)] if isinstance(weekly, list) else [],
        "overrides": [o for o in overrides if isinstance(o, dict)] if isinstance(overrides, list) else [],
    }


async def estimate(hass: HomeAssistant, t: Thermostat, temperature: float) -> dict[str, Any] | None:
    """How long the thermostat needs to reach `temperature`: {minutes | None, confidence}."""
    if not hass.services.has_service(t.domain, "estimate"):
        return None
    try:
        response = await hass.services.async_call(
            t.domain,
            "estimate",
            {"entity_id": t.entity_id, "temperature": float(temperature)},
            blocking=True,
            return_response=True,
        )
    except Exception:
        return None
    data = response.get(t.entity_id) if isinstance(response, dict) else None
    if not isinstance(data, dict):
        return None
    minutes = data.get("minutes")
    return {
        "minutes": minutes if isinstance(minutes, (int, float)) and not isinstance(minutes, bool) else None,
        "confidence": data.get("confidence"),
    }


def override_ids(schedule: dict[str, Any] | None) -> set[str]:
    if not schedule:
        return set()
    return {
        str(o.get("override_id") or o.get("id")) for o in schedule["overrides"] if o.get("override_id") or o.get("id")
    }


def valid_block(block: Any) -> dict[str, Any] | None:
    """One block of the weekly schedule in its canonical form, or None when it is not valid."""
    if not isinstance(block, dict):
        return None
    days = block.get("days")
    time = block.get("time")
    if not isinstance(days, list) or not days or any(d not in DAYS for d in days):
        return None
    if not isinstance(time, str) or not _TIME.match(time):
        return None
    out: dict[str, Any] = {"days": [d for d in DAYS if d in days], "time": time}
    preset, temperature = block.get("preset_mode"), block.get("temperature")
    if (preset is None) == (temperature is None):
        return None
    if preset is not None:
        if not isinstance(preset, str) or not preset:
            return None
        out["preset_mode"] = preset
    else:
        if isinstance(temperature, bool) or not isinstance(temperature, (int, float)):
            return None
        out["temperature"] = float(temperature)
    return out


def canonical_week(weekly: list[Any]) -> list[dict[str, Any]] | None:
    """The week with every block validated and sorted, or None when any block is not valid."""
    blocks = [valid_block(b) for b in weekly]
    if any(b is None for b in blocks):
        return None
    return sorted(blocks, key=lambda b: (b["time"], DAYS.index(b["days"][0])))  # type: ignore[index]


def week_hash(weekly: list[Any]) -> str:
    week = canonical_week(weekly)
    return hashlib.sha1(repr(week).encode()).hexdigest()[:12]
