"""A fake heating integration that speaks HomeAI's thermostat schedule contract (version 1)."""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.exceptions import ServiceValidationError
from homeassistant.util import dt as dt_util

from .home import Home

DOMAIN = "fake_heat"


class FakeHeat:
    """Overrides and weekly schedules per climate entity, behind the contract's five services."""

    def __init__(self, hass: HomeAssistant, domain: str = DOMAIN) -> None:
        self.hass = hass
        self.domain = domain
        self.overrides: dict[str, dict[str, dict[str, Any]]] = {}
        self.weekly: dict[str, list[dict[str, Any]]] = {}
        self.calls: list[ServiceCall] = []
        self.minutes: float | None = 40
        for name, handler, response in (
            ("add_override", self._add, SupportsResponse.OPTIONAL),
            ("remove_override", self._remove, SupportsResponse.NONE),
            ("get_schedule", self._get, SupportsResponse.ONLY),
            ("set_schedule", self._set, SupportsResponse.NONE),
            ("estimate", self._estimate, SupportsResponse.ONLY),
        ):
            hass.services.async_register(domain, name, handler, supports_response=response)

    def thermostat(
        self,
        home: Home,
        entity_id: str,
        area: str | None,
        *,
        presets: tuple[str, ...] = ("comfort", "eco", "sleep", "away"),
        weekly: list[dict[str, Any]] | None = None,
        valve: bool = False,
        plan: list[dict[str, Any]] | None = None,
        features: list[str] | None = None,
    ) -> str:
        name = entity_id.split(".", 1)[1].replace("_", " ").title()
        device = home.device(name, area=area)
        attrs: dict[str, Any] = {
            "friendly_name": name,
            "temperature": 20.0,
            "current_temperature": 19.5,
            "preset_mode": "comfort",
            "preset_modes": list(presets),
            "homeai_schedule": {"version": 1, "domain": self.domain},
        }
        if features is not None:
            attrs["homeai_schedule"]["features"] = features
        if plan is not None:
            attrs["homeai_plan"] = plan
        home.entity(entity_id, "heat", device=device, attrs=attrs)
        if valve:
            home.entity(
                f"number.{entity_id.split('.', 1)[1]}_valve_limit",
                "100",
                device=device,
                translation_key="valve_limit",
                attrs={"unit_of_measurement": "%", "min": 0, "max": 100},
            )
        self.overrides[entity_id] = {}
        self.weekly[entity_id] = weekly or [
            {"days": ["mon", "tue", "wed", "thu", "fri"], "time": "06:30", "preset_mode": "comfort"},
            {"days": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], "time": "22:30", "preset_mode": "sleep"},
            {"days": ["sat", "sun"], "time": "08:00", "preset_mode": "comfort"},
        ]
        return entity_id

    def features(self, call: ServiceCall) -> set[str]:
        out: set[str] = set()
        for entity_id in self._entities(call):
            state = self.hass.states.get(entity_id)
            out |= set((state.attributes.get("homeai_schedule") or {}).get("features") or []) if state else set()
        return out

    def calls_of(self, service: str) -> list[ServiceCall]:
        return [c for c in self.calls if c.service == service]

    @staticmethod
    def _entities(call: ServiceCall) -> list[str]:
        value = call.data.get("entity_id")
        return [value] if isinstance(value, str) else list(value or [])

    async def _add(self, call: ServiceCall) -> ServiceResponse:
        self.calls.append(call)
        if "end" not in call.data:
            raise ServiceValidationError("end is required")
        if ("preset_mode" in call.data) == ("temperature" in call.data):
            raise ServiceValidationError("exactly one of preset_mode and temperature")
        end = dt_util.parse_datetime(str(call.data["end"]))
        if end is None or end <= dt_util.utcnow():
            raise ServiceValidationError("end must be in the future")
        if len(str(call.data.get("reason", ""))) > 200:
            raise ServiceValidationError("reason is too long")
        if "open_end" in call.data and "open_end" not in self.features(call):
            raise ServiceValidationError("extra keys not allowed @ data['open_end']")  # like a strict schema
        oid = str(call.data.get("override_id") or f"o{len(self.calls)}")
        for entity_id in self._entities(call):
            self.overrides[entity_id][oid] = {
                "override_id": oid,
                "start": call.data.get("start"),
                "end": call.data["end"],
                **{
                    k: call.data[k]
                    for k in ("preset_mode", "temperature", "reason", "source", "open_end")
                    if k in call.data
                },
            }
        return {"override_id": oid}

    async def _remove(self, call: ServiceCall) -> None:
        self.calls.append(call)
        for entity_id in self._entities(call):
            items = self.overrides[entity_id]
            if oid := call.data.get("override_id"):
                items.pop(oid, None)
            elif source := call.data.get("source"):
                for key in [k for k, v in items.items() if v.get("source") == source]:
                    del items[key]

    async def _get(self, call: ServiceCall) -> ServiceResponse:
        return {
            e: {"enabled": True, "weekly": list(self.weekly[e]), "overrides": list(self.overrides[e].values())}
            for e in self._entities(call)
        }

    async def _set(self, call: ServiceCall) -> None:
        self.calls.append(call)
        for entity_id in self._entities(call):
            self.weekly[entity_id] = list(call.data["weekly"])

    async def _estimate(self, call: ServiceCall) -> ServiceResponse:
        return {e: {"minutes": self.minutes, "confidence": 0.7} for e in self._entities(call)}


def heated_home(hass: HomeAssistant) -> tuple[Home, FakeHeat]:
    """A flat with a living room (common space with a desk), a bedroom, a bathroom, three thermostats, two people."""
    from .home import Home

    h = Home(hass)
    living = h.area("Living room")
    h.areas.async_update(living, icon="mdi:sofa")
    h.area("Bedroom")
    h.area("Bathroom")
    heat = FakeHeat(hass)
    heat.thermostat(h, "climate.living", "Living room", valve=True)
    heat.thermostat(h, "climate.bedroom", "Bedroom")
    heat.thermostat(h, "climate.bathroom", "Bathroom")
    desk = h.device("Desk plug", area="Living room")
    h.entity(
        "sensor.desk_power",
        "3",
        device=desk,
        device_class="power",
        labels=("HomeAI: activity",),
        attrs={"unit_of_measurement": "W", "friendly_name": "Desk power"},
    )
    h.person("anna", "Anna")
    h.person("ben", "Ben")
    return h, heat
