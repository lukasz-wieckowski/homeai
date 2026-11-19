"""Risk classes and how a service call is classified.

R0 read · R1 reversible comfort · R2 devices · R3 system · R4 configuration · R5 security · R6 destructive.
The class comes from the domain and service (or the administrator's `policy.risk_by_service` for a domain or a
`domain.service`), the entity's device class, the device it controls, the administrator's class for a label
(`policy.risk_by_label`, the highest among the entity's labels), then the override for an entity, device, area or
floor (`policy.risk_override`). The highest class among the targets wins.

A control entity (number, select, switch, button, text, time…) is never lighter than the device it belongs to:
the valve position of a thermostat counts as the thermostat, a lock's auto-relock time as the lock. A device's
own configuration entities (`entity_category: config`) are at least R2.

Thermostats that speak the schedule contract (`homeai_schedule`, see `thermostats/contract.py`): reading the
schedule or an estimate is R0, an override for a while is R2 like any change of the thermostat, and a new weekly
schedule (`set_schedule`) is configuration: at least R4 whatever a label or override says, so HomeAI only ever
proposes it and an administrator approves.
"""

from __future__ import annotations

from enum import IntEnum
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from ..settings import SettingsManager
    from ..world import WorldModel


class Risk(IntEnum):
    R0 = 0
    R1 = 1
    R2 = 2
    R3 = 3
    R4 = 4
    R5 = 5
    R6 = 6

    @classmethod
    def parse(cls, value: object) -> Risk | None:
        if isinstance(value, Risk):
            return value
        if isinstance(value, int) and not isinstance(value, bool) and 0 <= value <= 6:
            return cls(value)
        if isinstance(value, str) and len(value) == 2 and value[0] in "Rr" and value[1].isdigit():
            return cls.parse(int(value[1]))
        return None


DOMAIN_RISK: dict[str, Risk] = {
    # reversible comfort
    "light": Risk.R1,
    "fan": Risk.R1,
    "media_player": Risk.R1,
    "scene": Risk.R1,
    "notify": Risk.R1,
    "persistent_notification": Risk.R1,
    "tts": Risk.R1,
    "remote": Risk.R1,
    "input_boolean": Risk.R1,
    "input_number": Risk.R1,
    "input_select": Risk.R1,
    "input_text": Risk.R1,
    "input_datetime": Risk.R1,
    "input_button": Risk.R1,
    "counter": Risk.R1,
    "timer": Risk.R1,
    "number": Risk.R1,
    "select": Risk.R1,
    "text": Risk.R1,
    "humidifier": Risk.R1,
    "todo": Risk.R1,
    "calendar": Risk.R1,
    # devices
    "switch": Risk.R2,
    "cover": Risk.R2,
    "climate": Risk.R2,
    "water_heater": Risk.R2,
    "vacuum": Risk.R2,
    "lawn_mower": Risk.R2,
    "button": Risk.R2,
    "valve": Risk.R2,
    "script": Risk.R2,
    "automation": Risk.R2,
    "time": Risk.R2,
    "date": Risk.R2,
    "datetime": Risk.R2,
    "event": Risk.R2,
    # system
    "update": Risk.R4,
    "backup": Risk.R3,
    "hassio": Risk.R3,
    "recorder": Risk.R3,
    "logger": Risk.R3,
    "system_log": Risk.R1,
    "zone": Risk.R4,
    "person": Risk.R4,
    "group": Risk.R3,
    "template": Risk.R3,
    # security
    "lock": Risk.R5,
    "alarm_control_panel": Risk.R5,
    "camera": Risk.R5,
    "siren": Risk.R5,
    # services that can do anything: they run commands, code or other services the policy cannot see
    "shell_command": Risk.R4,
    "python_script": Risk.R4,
    "pyscript": Risk.R4,
    "conversation": Risk.R4,
    "cloud": Risk.R4,
    "rest_command": Risk.R3,
    "mqtt": Risk.R3,
    "zwave_js": Risk.R3,
    "zha": Risk.R3,
    "homeassistant": Risk.R3,
}

SERVICE_RISK: dict[tuple[str, str], Risk] = {
    ("homeassistant", "turn_on"): Risk.R1,  # refined by targets
    ("homeassistant", "turn_off"): Risk.R1,
    ("homeassistant", "toggle"): Risk.R1,
    ("homeassistant", "update_entity"): Risk.R0,
    ("homeassistant", "reload_config_entry"): Risk.R3,
    ("homeassistant", "reload_core_config"): Risk.R3,
    ("homeassistant", "reload_all"): Risk.R3,
    ("homeassistant", "check_config"): Risk.R0,
    ("homeassistant", "restart"): Risk.R6,
    ("homeassistant", "stop"): Risk.R6,
    ("homeassistant", "set_location"): Risk.R4,
    ("backup", "create"): Risk.R3,
    ("backup", "create_automatic"): Risk.R3,
    ("hassio", "addon_restart"): Risk.R3,
    ("hassio", "addon_start"): Risk.R3,
    ("hassio", "addon_stop"): Risk.R4,
    ("hassio", "host_reboot"): Risk.R6,
    ("hassio", "host_shutdown"): Risk.R6,
    ("hassio", "backup_full"): Risk.R3,
    ("hassio", "backup_partial"): Risk.R3,
    ("hassio", "restore_full"): Risk.R6,
    ("hassio", "restore_partial"): Risk.R6,
    ("recorder", "purge"): Risk.R6,
    ("recorder", "purge_entities"): Risk.R6,
    ("recorder", "disable"): Risk.R4,
    ("automation", "reload"): Risk.R3,
    ("automation", "turn_off"): Risk.R4,
    ("automation", "turn_on"): Risk.R4,
    ("automation", "trigger"): Risk.R2,
    ("script", "reload"): Risk.R3,
    ("scene", "reload"): Risk.R3,
    ("scene", "create"): Risk.R1,
    ("scene", "delete"): Risk.R4,
    ("scene", "apply"): Risk.R1,
    ("update", "skip"): Risk.R3,
    ("update", "clear_skipped"): Risk.R3,
    ("camera", "snapshot"): Risk.R5,
    ("camera", "turn_on"): Risk.R5,
    ("camera", "turn_off"): Risk.R5,
    ("system_log", "clear"): Risk.R3,
    ("logger", "set_level"): Risk.R3,
    ("logger", "set_default_level"): Risk.R3,
    ("todo", "remove_item"): Risk.R2,
    ("todo", "remove_completed_items"): Risk.R2,
}

# Services of the thermostat schedule contract, on a climate entity that announces it.
SCHEDULE_SERVICE_RISK: dict[str, Risk] = {
    "get_schedule": Risk.R0,
    "estimate": Risk.R0,
    "add_override": Risk.R2,
    "remove_override": Risk.R2,
    "set_schedule": Risk.R4,
}

SECURITY_COVER_CLASSES = frozenset({"garage", "gate", "door"})

# Entities that adjust a device rather than being the device: they take the class of the device's main entities.
CONTROL_DOMAINS = frozenset({"number", "select", "switch", "button", "text", "time", "date", "datetime"})
# The main entity domains that make a device heavier than its controls on their own.
DEVICE_DOMAINS = frozenset(
    {
        "climate",
        "water_heater",
        "valve",
        "cover",
        "vacuum",
        "lawn_mower",
        "lock",
        "alarm_control_panel",
        "camera",
        "siren",
    }
)

# Services that make things safer: allowed as protective actions on entities labelled by the administrator.
PROTECTIVE_SERVICES: frozenset[tuple[str, str]] = frozenset(
    {
        ("valve", "close_valve"),
        ("switch", "turn_off"),
        ("lock", "lock"),
        ("cover", "close_cover"),
        ("water_heater", "turn_off"),
        ("climate", "turn_off"),
        ("fan", "turn_on"),
        ("light", "turn_on"),
        ("siren", "turn_on"),
        ("alarm_control_panel", "alarm_arm_away"),
        ("alarm_control_panel", "alarm_arm_home"),
        ("alarm_control_panel", "alarm_arm_night"),
        ("media_player", "media_pause"),
        ("homeassistant", "turn_off"),
    }
)


def base_risk(domain: str, service: str) -> Risk:
    if domain == "config":  # configuration editing through HA's editors (see actions/config.py)
        if service.endswith(("_get", "_list")):
            return Risk.R0
        return Risk.R6 if service.endswith("_delete") else Risk.R4
    if (domain, service) in SERVICE_RISK:
        return SERVICE_RISK[(domain, service)]
    if service in ("reload",):
        return Risk.R3
    return DOMAIN_RISK.get(domain, Risk.R2)


def classify(
    domain: str,
    service: str,
    entity_ids: list[str] | tuple[str, ...] | set[str],
    *,
    world: WorldModel | None = None,
    settings: SettingsManager | None = None,
) -> Risk:
    """The risk of calling `domain.service` on these entities."""
    by_service = dict(settings.get("policy.risk_by_service") or {}) if settings is not None else {}
    by_label = dict(settings.get("policy.risk_by_label") or {}) if settings is not None else {}
    base = _configured(domain, service, by_service)
    if not entity_ids:
        # a service HomeAI knows nothing about, with no entity to judge it by, is a system action
        return base if _known(domain, service, by_service) else max(base, Risk.R3)
    risks = []
    for entity_id in entity_ids:
        e_domain = entity_id.split(".", 1)[0]
        risk = _configured(e_domain, service, by_service) if domain == "homeassistant" and service in _GENERIC else base
        contract = schedule_service(world, domain, service, entity_id)
        configured = Risk.parse(by_service.get(f"{domain}.{service}")) if contract else None
        if contract:
            risk = configured if configured is not None else SCHEDULE_SERVICE_RISK[service]
        elif domain not in ("homeassistant", e_domain):
            # an integration's own service on another domain's entity (`zwave_js.set_lock_usercode` on a lock) is
            # never lighter than that entity's domain
            risk = max(risk, _configured(e_domain, service, by_service))
        info = world.entity(entity_id) if world is not None else None
        if world is not None and _own(world, entity_id):
            risk = max(risk, Risk.R4)  # HomeAI's own switches, selects and numbers are its settings
        if e_domain == "cover" and _device_class(world, entity_id, info) in SECURITY_COVER_CLASSES:
            risk = max(risk, Risk.R5)
        if e_domain == "button" and _device_class(world, entity_id, info) == "restart":
            risk = max(risk, Risk.R3)  # restarting a device or hub is a system action
        if e_domain in CONTROL_DOMAINS and world is not None:
            risk = max(risk, _device_risk(world, entity_id, service, by_service))
        if info is not None and by_label:
            labelled = [r for label in info.labels if (r := Risk.parse(by_label.get(label))) is not None]
            if labelled:
                risk = max(labelled)
        if settings is not None and world is not None:
            override = Risk.parse(settings.get("policy.risk_override", world.target(entity_id)))
            if override is not None:
                risk = override
        if contract and service == "set_schedule":
            risk = max(risk, Risk.R4)  # a new week is configuration: never lowered by a label or an override
        elif contract and configured is None and SCHEDULE_SERVICE_RISK[service] == Risk.R0:
            risk = Risk.R0  # reading the schedule or an estimate changes nothing
        risks.append(risk)
    return max(risks)


def schedule_service(world: WorldModel | None, domain: str, service: str, entity_id: str) -> bool:
    """`domain.service` is a schedule-contract service and `entity_id` announces the contract in `domain`."""
    if service not in SCHEDULE_SERVICE_RISK or world is None or not entity_id.startswith("climate."):
        return False
    from ..thermostats.contract import speaks_contract

    return speaks_contract(world.hass, domain, entity_id)


def _configured(domain: str, service: str, by_service: dict[str, str]) -> Risk:
    """The built-in class, unless the administrator set one for this `domain.service` or the whole domain."""
    for key in (f"{domain}.{service}", domain):
        if (risk := Risk.parse(by_service.get(key))) is not None:
            return risk
    return base_risk(domain, service)


_GENERIC = frozenset({"turn_on", "turn_off", "toggle"})


def _known(domain: str, service: str, by_service: dict[str, str]) -> bool:
    return (
        domain in DOMAIN_RISK
        or domain == "config"
        or (domain, service) in SERVICE_RISK
        or service == "reload"
        or Risk.parse(by_service.get(f"{domain}.{service}")) is not None
        or Risk.parse(by_service.get(domain)) is not None
    )


def _own(world: WorldModel, entity_id: str) -> bool:
    from homeassistant.helpers import entity_registry as er

    from ..const import DOMAIN

    entry = er.async_get(world.hass).async_get(entity_id)
    return entry is not None and entry.platform == DOMAIN


def carried_entities(hass: object, domain: str, service: str, data: dict, entity_ids: list[str]) -> list[str]:
    """Entities a call changes without naming them as targets: the states `scene.apply` sets and the members of a
    scene that is turned on. They are judged as if each were switched directly."""
    if domain != "scene":
        return []
    out: list[str] = []
    if service == "apply" and isinstance(entities := data.get("entities"), dict):
        out += [str(e) for e in entities]
    if service == "turn_on":
        for scene in entity_ids:
            state = hass.states.get(scene)  # type: ignore[attr-defined]
            members = state.attributes.get("entity_id") if state is not None else None
            if isinstance(members, (list, tuple)):
                out += [str(e) for e in members]
    return out


def _device_class(world: WorldModel | None, entity_id: str, info: object | None) -> str | None:
    """The entity's device class from the world model, or from its state when the world model leaves it out."""
    if info is not None:
        return getattr(info, "device_class", None)
    state = world.state(entity_id) if world is not None else None
    return state.attributes.get("device_class") if state is not None else None


def _device_risk(world: WorldModel, entity_id: str, service: str, by_service: dict[str, str]) -> Risk:
    """The class of the device a control entity belongs to, from the entity registry (all of the device's entities,
    not only those the world model watches); at least R2 for the device's own configuration entities."""
    from homeassistant.helpers import entity_registry as er

    registry = er.async_get(world.hass)
    entry = registry.async_get(entity_id)
    if entry is None or not entry.device_id:
        return Risk.R0
    risk = Risk.R2 if entry.entity_category is not None and str(entry.entity_category) == "config" else Risk.R0
    for sibling in er.async_entries_for_device(registry, entry.device_id):
        s_domain = sibling.entity_id.split(".", 1)[0]
        if s_domain not in DEVICE_DOMAINS:
            continue
        s_risk = DOMAIN_RISK.get(s_domain, Risk.R2)
        if (r := Risk.parse(by_service.get(s_domain))) is not None:
            s_risk = r
        if s_domain == "cover" and _device_class(world, sibling.entity_id, world.entity(sibling.entity_id)) in (
            SECURITY_COVER_CLASSES
        ):
            s_risk = Risk.R5
        risk = max(risk, s_risk)
    return risk


def is_protective(domain: str, service: str, entity_ids: list[str] | tuple[str, ...], world: WorldModel) -> bool:
    """A safe-direction service on entities the administrator labelled as protective actions."""
    if (domain, service) not in PROTECTIVE_SERVICES or not entity_ids:
        return False
    return all(world.has_label(e, "label_protective") for e in entity_ids)
