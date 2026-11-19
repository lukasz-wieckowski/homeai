"""Custom rules as config subentries: "Add rule" on the integration page, changed with reconfigure.

A rule is one subentry of type `rule`; its data is the rule as `validate_rules` normalises it (see
`detectors/custom.py`). The custom detector reads the rules from the runtime, which takes them from the subentries;
adding, changing or removing a rule does not reload HomeAI. Before 1.7 the rules were one setting
(`detectors.custom`); `async_move_legacy_rules` turns them into subentries once.
"""

from __future__ import annotations

from dataclasses import replace
from types import MappingProxyType
from typing import Any

from homeassistant.config_entries import ConfigEntry, ConfigSubentry, ConfigSubentryFlow, SubentryFlowResult
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import section
from homeassistant.helpers.selector import (
    AreaSelector,
    BooleanSelector,
    EntitySelector,
    EntitySelectorConfig,
    LabelSelector,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
    TextSelectorConfig,
)
from homeassistant.helpers.storage import Store
from homeassistant.util import slugify
import voluptuous as vol

from ..const import DOMAIN, LOGGER, SUBENTRY_RULE
from ..settings import SettingError
from .base import Category, Need
from .detectors.custom import CONDITIONS, MODES, WHEN, meets, targets, validate_rules

LEGACY_KEY = "detectors.custom"
PREVIEW_NAMES = 15
# The rule's form in three parts: what it watches, when it fires, and the situation it opens.
PARTS: dict[str, tuple[str, ...]] = {
    "target": ("entities", "label", "area", "domain"),
    "condition": ("condition", "value", "minutes", "when", "mode"),
    "situation": ("severity", "category", "need", "advice"),
}


def rules_of(entry: ConfigEntry) -> list[dict[str, Any]]:
    """The rules stored as subentries, in the order they were added."""
    return [dict(sub.data) for sub in entry.subentries.values() if sub.subentry_type == SUBENTRY_RULE]


def add_rules(hass: HomeAssistant, entry: ConfigEntry, raw: Any) -> int:
    """Add rules in the old list format as subentries; a rule that does not validate, or whose id is taken, is
    skipped (logged). Returns how many were added."""
    if not isinstance(raw, list):
        return 0
    taken = {sub.unique_id for sub in entry.subentries.values() if sub.subentry_type == SUBENTRY_RULE}
    added = 0
    for item in raw:
        try:
            [rule] = validate_rules([item])
        except SettingError as err:
            LOGGER.warning("Rule %s not moved: %s", item.get("id") if isinstance(item, dict) else item, err)
            continue
        if rule["id"] in taken:
            continue
        hass.config_entries.async_add_subentry(
            entry,
            ConfigSubentry(
                data=MappingProxyType(rule), subentry_type=SUBENTRY_RULE, title=rule["name"], unique_id=rule["id"]
            ),
        )
        taken.add(rule["id"])
        added += 1
    return added


async def async_move_legacy_rules(hass: HomeAssistant, entry: ConfigEntry) -> int:
    """Rules from the `detectors.custom` setting become subentries; the setting is removed from the store."""
    store: Store[dict[str, Any]] = Store(hass, 1, f"{DOMAIN}.settings")
    data = await store.async_load()
    if not isinstance(data, dict) or LEGACY_KEY not in (data.get("global") or {}):
        return 0
    added = add_rules(hass, entry, data["global"].pop(LEGACY_KEY))
    await store.async_save(data)
    LOGGER.info("Moved %s custom rules to the integration's rules", added)
    return added


def _unique_id(entry: ConfigEntry, name: str) -> str:
    base = (slugify(name) or "rule")[:34].strip("_") or "rule"
    taken = {sub.unique_id for sub in entry.subentries.values()}
    rid, n = base, 2
    while rid in taken:
        rid, n = f"{base}_{n}", n + 1
    return rid


def _select(options: tuple[str, ...] | list[str], key: str | None = None, *, custom: bool = False) -> SelectSelector:
    config = SelectSelectorConfig(options=list(options), mode=SelectSelectorMode.DROPDOWN, custom_value=custom)
    if key:
        config["translation_key"] = key
    return SelectSelector(config)


def _optional(name: str, value: Any) -> vol.Optional:
    return vol.Optional(name, description={"suggested_value": value} if value not in (None, "", []) else None)


def rule_schema(hass: HomeAssistant, rule: dict[str, Any]) -> vol.Schema:
    """The rule's form, filled with `rule` (stored or as the person typed it)."""
    target = rule.get("target") or {}
    condition = rule.get("condition") or {}
    domains = sorted({s.domain for s in hass.states.async_all()})
    value = condition.get("value")
    return vol.Schema(
        {
            vol.Required("name", default=rule.get("name", "")): TextSelector(),
            vol.Required("enabled", default=rule.get("enabled", True)): BooleanSelector(),
            vol.Required("target"): section(
                vol.Schema(
                    {
                        _optional("entities", target.get("entities")): EntitySelector(
                            EntitySelectorConfig(multiple=True)
                        ),
                        _optional("label", target.get("label")): LabelSelector(),
                        _optional("area", target.get("area")): AreaSelector(),
                        _optional("domain", target.get("domain")): _select(domains, custom=True),
                    }
                )
            ),
            vol.Required("condition"): section(
                vol.Schema(
                    {
                        vol.Required("condition", default=condition.get("type", "state")): _select(
                            CONDITIONS, "rule_condition"
                        ),
                        _optional("value", None if value is None else str(value).removesuffix(".0")): TextSelector(),
                        vol.Required("minutes", default=rule.get("minutes", 0)): NumberSelector(
                            NumberSelectorConfig(
                                min=0, max=10080, step=1, mode=NumberSelectorMode.BOX, unit_of_measurement="min"
                            )
                        ),
                        vol.Required("when", default=rule.get("when", "always")): _select(WHEN, "rule_when"),
                        vol.Required("mode", default=rule.get("mode", "each")): _select(MODES, "rule_mode"),
                    }
                )
            ),
            vol.Required("situation"): section(
                vol.Schema(
                    {
                        vol.Required("severity", default=rule.get("severity", 1)): NumberSelector(
                            NumberSelectorConfig(min=0, max=4, step=1, mode=NumberSelectorMode.SLIDER)
                        ),
                        vol.Required("category", default=rule.get("category", "info")): _select(
                            [str(c) for c in Category], "category"
                        ),
                        vol.Required("need", default=rule.get("need", "member")): _select(
                            [str(n) for n in Need], "need"
                        ),
                        _optional("advice", rule.get("advice")): TextSelector(TextSelectorConfig(multiline=True)),
                    }
                )
            ),
        }
    )


def rule_from_input(rid: str, user_input: dict[str, Any]) -> dict[str, Any]:
    """The form's answers as a rule in the stored format (not yet validated)."""
    flat = dict(user_input)
    for part in PARTS:
        flat.update(flat.pop(part, None) or {})
    kind = flat.get("condition", "state")
    condition: dict[str, Any] = {"type": kind}
    if kind in ("state", "not_state", "above", "below"):
        condition["value"] = str(flat.get("value") or "").strip()
    return {
        "id": rid,
        "name": flat.get("name", ""),
        "enabled": bool(flat.get("enabled", True)),
        "target": {
            "entities": list(flat.get("entities") or []),
            "label": flat.get("label") or None,
            "area": flat.get("area") or None,
            "domain": flat.get("domain") or None,
        },
        "condition": condition,
        "minutes": int(flat.get("minutes") or 0),
        "severity": int(flat.get("severity", 1)),
        "category": flat.get("category", "info"),
        "need": flat.get("need", "member"),
        "advice": flat.get("advice") or "",
        "when": flat.get("when", "always"),
        "mode": flat.get("mode", "each"),
    }


def preview(rt: Any, rule: dict[str, Any]) -> dict[str, str]:
    """Which entities the rule covers and which meet its condition right now (ignoring the waiting time), as
    texts for the flow's description."""
    hub = rt.module("signals") if rt is not None else None
    if hub is None:
        return {"count": "0", "covered": "—", "meeting": "—"}
    ctx = hub.context()
    covered = targets(ctx, rule)
    now = {**rule, "minutes": 0}
    meeting = [e for e in covered if meets(replace(ctx), now, e)]

    def names(ids: list[str]) -> str:
        if not ids:
            return rt.text("rules|nothing")
        shown = [rt.world.display_name(e) for e in ids[:PREVIEW_NAMES]]
        more = len(ids) - len(shown)
        return ", ".join(shown) + (f" {rt.text('rules|and_more', count=more)}" if more else "")

    return {"count": str(len(covered)), "covered": names(covered), "meeting": names(meeting)}


class RuleSubentryFlow(ConfigSubentryFlow):
    """Add or change a custom rule; the last step shows what it covers and what meets it now."""

    def __init__(self) -> None:
        self._rule: dict[str, Any] = {}

    def _runtime(self) -> Any:
        return getattr(self._get_entry(), "runtime_data", None)

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> SubentryFlowResult:
        return await self.async_step_rule(user_input)

    async def async_step_reconfigure(self, user_input: dict[str, Any] | None = None) -> SubentryFlowResult:
        self._rule = dict(self._get_reconfigure_subentry().data)
        return await self.async_step_rule(user_input)

    async def async_step_rule(self, user_input: dict[str, Any] | None = None) -> SubentryFlowResult:
        errors: dict[str, str] = {}
        error = ""
        shown = self._rule
        if user_input is not None:
            rid = self._rule.get("id") or _unique_id(self._get_entry(), str(user_input.get("name") or ""))
            shown = rule_from_input(rid, user_input)
            try:
                [self._rule] = validate_rules([shown])
            except SettingError as err:
                errors["base"] = "invalid_rule"
                error = str(err)
            else:
                return await self.async_step_preview()
        return self.async_show_form(
            step_id="rule",
            data_schema=rule_schema(self.hass, shown),
            errors=errors,
            description_placeholders={"error": error},
        )

    async def async_step_preview(self, user_input: dict[str, Any] | None = None) -> SubentryFlowResult:
        rule = self._rule
        if user_input is not None:
            if self.source == "reconfigure":
                return self.async_update_and_abort(
                    self._get_entry(), self._get_reconfigure_subentry(), title=rule["name"], data=rule
                )
            return self.async_create_entry(title=rule["name"], data=rule, unique_id=rule["id"])
        return self.async_show_form(
            step_id="preview",
            data_schema=vol.Schema({}),
            description_placeholders={"name": rule["name"], **preview(self._runtime(), rule)},
        )
