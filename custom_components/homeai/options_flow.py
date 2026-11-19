"""Options: every HomeAI setting, in Settings → Devices & services → HomeAI → Configure.

The menu lists the settings sections, each a form generated from the settings registry: everyday settings on top,
advanced ones in a collapsed part (Detection is split by what it watches instead). Further items set values for one
place (a floor, area, device, entity or person), undo the last change and reset a section. Changes go through the
settings store exactly like the WebSocket command does; one that lowers protection asks for confirmation first.

Home Assistant takes form labels only from `translations/<lang>.json`, so the field names are the setting keys with
`_` for `.` and their labels and descriptions are generated there from HomeAI's own texts
(`scripts/gen_translations.py`; a test keeps them in sync).
"""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigFlowResult, OptionsFlow
from homeassistant.data_entry_flow import section
from homeassistant.helpers import area_registry as ar, device_registry as dr, floor_registry as fr
from homeassistant.helpers.selector import (
    AreaSelector,
    AreaSelectorConfig,
    BooleanSelector,
    DeviceSelector,
    DurationSelector,
    DurationSelectorConfig,
    EntitySelector,
    EntitySelectorConfig,
    FloorSelector,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    ObjectSelector,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
    TextSelectorConfig,
    TimeSelector,
)
import voluptuous as vol

from . import i18n
from .settings import Scope, Setting, SettingError, SettingsRegistry, build_registry
from .settings.manager import parse_scope_key
from .settings.registry import SettingType as T

ADVANCED = "advanced"
# Sections split into collapsed parts by the second part of the key (`detectors.battery.…` → battery).
GROUPED = ("detectors",)
PLACE_SCOPES: tuple[Scope, ...] = (Scope.FLOOR, Scope.AREA, Scope.DEVICE, Scope.ENTITY, Scope.PERSON)
MENU_EXTRA = ("place", "undo", "reset")
# Types whose empty value is meaningful (no entity, no items, no own prompt): optional fields in the form.
EMPTY: dict[T, Any] = {
    T.STRING: "",
    T.TEXT: "",
    T.ENTITY: "",
    T.ENTITIES: [],
    T.STRINGS: [],
    T.MULTISELECT: [],
}
ON, OFF = "on", "off"


def field(key: str) -> str:
    """A setting's field name: translation keys cannot contain dots."""
    return key.replace(".", "_")


def layout(registry: SettingsRegistry, sid: str) -> tuple[list[Setting], dict[str, list[Setting]]]:
    """A section's form: the settings shown at once, and the collapsed parts (by group, then advanced)."""
    top: list[Setting] = []
    parts: dict[str, list[Setting]] = {}
    advanced: list[Setting] = []
    for s in registry:
        if s.section != sid:
            continue
        if sid in GROUPED and s.group:
            parts.setdefault(s.group, []).append(s)
        elif s.advanced:
            advanced.append(s)
        else:
            top.append(s)
    if advanced:
        parts[ADVANCED] = advanced
    return top, parts


def place_layout(registry: SettingsRegistry, scope: Scope) -> dict[str, list[Setting]]:
    """The settings that can have their own value for this kind of place, by section."""
    out: dict[str, list[Setting]] = {}
    for s in registry:
        if scope in s.scopes:
            out.setdefault(s.section, []).append(s)
    return out


def _select(options: list[str] | tuple[str, ...], key: str, *, multiple: bool = False) -> SelectSelector:
    mode = SelectSelectorMode.LIST if multiple and len(options) <= 8 else SelectSelectorMode.DROPDOWN
    return SelectSelector(
        SelectSelectorConfig(options=list(options), translation_key=key, multiple=multiple, mode=mode)
    )


def selector_for(s: Setting, *, place: bool = False) -> Any:
    """The form control for a setting, by its type and its selector hint."""
    t = s.type
    if t is T.BOOL:
        return _select([ON, OFF], "override_bool") if place else BooleanSelector()
    if t in (T.INT, T.FLOAT):
        config = NumberSelectorConfig(mode=NumberSelectorMode.BOX, step=s.step or (1 if t is T.INT else "any"))
        if s.min is not None:
            config["min"] = s.min
        if s.max is not None:
            config["max"] = s.max
        if s.unit:
            config["unit_of_measurement"] = s.unit
        return NumberSelector(config)
    if t is T.DURATION:
        return DurationSelector(DurationSelectorConfig(enable_day=False))
    if t is T.TIME:
        return TimeSelector()
    if t in (T.SELECT, T.MULTISELECT):
        return _select(s.options, field(s.key), multiple=t is T.MULTISELECT)
    if t is T.TEXT:
        return TextSelector(TextSelectorConfig(multiline=True))
    if t is T.ENTITY:
        return EntitySelector(EntitySelectorConfig(domain="tts") if s.selector == "tts" else EntitySelectorConfig())
    if t is T.ENTITIES:
        config = EntitySelectorConfig(multiple=True)
        if s.selector == "media_player":
            config["domain"] = "media_player"
        return EntitySelector(config)
    if t is T.STRINGS:
        if s.selector == "area":
            return AreaSelector(AreaSelectorConfig(multiple=True))
        if s.selector == "entity":
            return EntitySelector(EntitySelectorConfig(multiple=True))
        return TextSelector(TextSelectorConfig(multiple=True))
    if t is T.JSON:
        return ObjectSelector()
    return TextSelector()


def to_form(s: Setting, value: Any, *, place: bool = False) -> Any:
    """A stored value as its form control wants it."""
    if s.type is T.DURATION:
        seconds = int(value)
        return {"hours": seconds // 3600, "minutes": seconds % 3600 // 60, "seconds": seconds % 60}
    if s.type is T.TIME:
        return f"{value}:00"
    if s.type is T.BOOL and place:
        return ON if value else OFF
    return value


def from_form(s: Setting, value: Any, *, place: bool = False) -> Any:
    """A form answer as the setting stores it (validated afterwards by the setting itself)."""
    if s.type is T.DURATION and isinstance(value, dict):
        return int(
            float(value.get("days", 0)) * 86400
            + float(value.get("hours", 0)) * 3600
            + float(value.get("minutes", 0)) * 60
            + float(value.get("seconds", 0))
        )
    if s.type is T.TIME and isinstance(value, str):
        return value[:5]
    if s.type is T.BOOL and place:
        return value == ON
    if s.type is T.INT and isinstance(value, float) and value.is_integer():
        return int(value)
    if s.type in EMPTY and value is None:
        return EMPTY[s.type]
    return value


def _empty(value: Any) -> bool:
    return value is None or (isinstance(value, (str, list, dict)) and not value)


def _flatten(user_input: dict[str, Any], parts: set[str]) -> dict[str, Any]:
    flat: dict[str, Any] = {}
    for key, value in user_input.items():
        if key in parts and isinstance(value, dict):
            flat.update(value)
        else:
            flat[key] = value
    return flat


class HomeAIOptionsFlow(OptionsFlow):
    """Every setting of HomeAI, also per place."""

    def __init__(self) -> None:
        self._scope: Scope | None = None
        self._ref: str | None = None
        # Changes waiting for confirmation: (scope key, [(key, value or None to remove)])
        self._pending: tuple[str, list[tuple[str, Any]]] | None = None

    # ——— Helpers ———
    @property
    def _rt(self) -> Any:
        return getattr(self.config_entry, "runtime_data", None)

    def _lang(self) -> str:
        return self._rt.language

    def _label(self, key: str) -> str:
        return (i18n.section(self._lang(), "settings").get(key) or {}).get("label", key)

    def _value_text(self, s: Setting, value: Any) -> str:
        lang = self._lang()
        if value is None or (isinstance(value, (str, list)) and not value):
            return i18n.text(lang, "options_flow|empty")
        if s.type is T.BOOL:
            return i18n.text(lang, f"options_flow|{ON if value else OFF}")
        names = i18n.section(lang, "options").get(s.key) or {}
        if s.type is T.SELECT:
            return str(names.get(value, value))
        if s.type is T.MULTISELECT:
            return i18n.join(lang, [str(names.get(v, v)) for v in value])
        if s.type is T.DURATION:
            return f"{value} s"
        if s.type in (T.TEXT, T.JSON):
            text = str(value)
            return text if len(text) <= 60 else f"{text[:57]}…"
        return f"{i18n._fmt(value, lang)}{f' {s.unit}' if s.unit else ''}"

    def _place_name(self, skey: str) -> str:
        if skey == "global":
            return i18n.text(self._lang(), "options_flow|whole_home")
        scope, ref = parse_scope_key(skey)
        ref = ref or ""
        if scope is Scope.FLOOR and (floor := fr.async_get(self.hass).async_get_floor(ref)):
            return floor.name
        if scope is Scope.AREA and (area := ar.async_get(self.hass).async_get_area(ref)):
            return area.name
        if scope is Scope.DEVICE and (device := dr.async_get(self.hass).async_get(ref)):
            return device.name_by_user or device.name or ref
        if scope in (Scope.ENTITY, Scope.PERSON) and (state := self.hass.states.get(ref)):
            return state.name
        return ref

    # ——— Menu ———
    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if self._rt is None:
            return self.async_abort(reason="not_loaded")
        self._pending = None
        return self.async_show_menu(step_id="init", menu_options=[*self._rt.settings.registry.sections(), *MENU_EXTRA])

    # ——— A section ———
    async def _section_step(self, sid: str, user_input: dict[str, Any] | None) -> ConfigFlowResult:
        settings = self._rt.settings
        top, parts = layout(settings.registry, sid)
        errors: dict[str, str] = {}
        placeholders = {"error": ""}
        shown: dict[str, Any] = {}
        if user_input is not None:
            flat = _flatten(user_input, set(parts))
            changes, problems = self._read(sid, [*top, *(s for p in parts.values() for s in p)], flat, shown)
            if problems:
                errors["base"] = "invalid_setting"
                placeholders["error"] = "; ".join(problems)
            else:
                return await self._apply_or_confirm("global", changes)

        def entry(s: Setting) -> tuple[Any, Any]:
            value = shown[s.key] if s.key in shown else to_form(s, settings.get(s.key))
            if s.type in EMPTY or s.type is T.JSON:
                key = vol.Optional(field(s.key), description={"suggested_value": value})
            else:
                key = vol.Required(field(s.key), default=value)
            return key, selector_for(s)

        schema: dict[Any, Any] = dict(entry(s) for s in top)
        for name, items in parts.items():
            # a part left closed may arrive empty or not at all: its fields then keep their values
            schema[vol.Optional(name, default={})] = section(
                vol.Schema(dict(entry(s) for s in items)), {"collapsed": True}
            )
        return self.async_show_form(
            step_id=sid, data_schema=vol.Schema(schema), errors=errors, description_placeholders=placeholders
        )

    def _read(
        self, sid: str, items: list[Setting], flat: dict[str, Any], shown: dict[str, Any]
    ) -> tuple[list[tuple[str, Any]], list[str]]:
        """Changed values of a section's form, and problems (label: reason) of values that do not validate."""
        settings = self._rt.settings
        changes: list[tuple[str, Any]] = []
        problems: list[str] = []
        for s in items:
            name = field(s.key)
            if name in flat:
                shown[s.key] = flat[name]
                raw = from_form(s, flat[name])
            elif s.type in EMPTY:
                raw = EMPTY[s.type]
            elif s.type is T.JSON:
                raw = s.default
            else:
                continue
            try:
                value = s.validate(raw)
            except SettingError as err:
                problems.append(f"{self._label(s.key)}: {str(err).removeprefix(f'{s.key}: ')}")
                continue
            if value != settings.get(s.key):
                changes.append((s.key, value))
        return changes, problems

    # ——— Saving ———
    async def _apply_or_confirm(self, skey: str, changes: list[tuple[str, Any]]) -> ConfigFlowResult:
        settings = self._rt.settings
        risky = [
            (key, value)
            for key, value in changes
            if value is not None and settings.needs_confirmation(key, value, skey)
        ]
        if not risky:
            return self._apply(skey, changes)
        self._pending = (skey, changes)
        lines = []
        for key, value in risky:
            s = settings.registry[key]
            old = settings.overrides_for(skey).get(key) if skey != "global" else settings.get(key)
            lines.append(f"- {self._label(key)}: {self._value_text(s, old)} → {self._value_text(s, value)}")
        return self.async_show_menu(
            step_id="confirm",
            menu_options=["apply", "init"],
            description_placeholders={"changes": "\n".join(lines), "place": self._place_name(skey)},
        )

    async def async_step_confirm(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """The confirmation is a menu shown by `_apply_or_confirm`; reached directly, it starts over."""
        return await self.async_step_init()

    async def async_step_apply(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if self._pending is None:
            return await self.async_step_init()
        skey, changes = self._pending
        self._pending = None
        return self._apply(skey, changes)

    def _apply(self, skey: str, changes: list[tuple[str, Any]]) -> ConfigFlowResult:
        rt = self._rt
        settings = rt.settings
        user = self.context.get("user_id")
        for key, value in changes:
            if value is None:
                settings.reset(key, skey=skey, user=user)
            else:
                settings.set(key, value, skey=skey, user=user, confirmed=True)
        if changes:
            labels = [self._label(key) for key, _value in changes]
            where = "" if skey == "global" else f" ({self._place_name(skey)})"
            rt.journal.add(
                "setting",
                rt.text("journal|setting_changed", key=i18n.join(rt.language, labels)) + where,
                actor="person",
            )
            self._reload_if_needed([key for key, _value in changes])
        return self.async_create_entry(data=dict(self.config_entry.options))

    def _reload_if_needed(self, keys: list[str]) -> None:
        """Settings marked as not live are read when HomeAI starts: reload it."""
        registry = self._rt.settings.registry
        if any(not registry[key].live for key in keys):
            self.hass.config_entries.async_schedule_reload(self.config_entry.entry_id)

    # ——— A place ———
    async def async_step_place(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if self._rt is None:
            return self.async_abort(reason="not_loaded")
        if user_input is not None:
            self._scope = Scope(user_input["scope"])
            return await self.async_step_place_target()
        places = sorted({self._place_name(skey) for skey in self._rt.settings.scoped_keys()})
        return self.async_show_form(
            step_id="place",
            data_schema=vol.Schema(
                {vol.Required("scope", default=str(Scope.AREA)): _select([str(s) for s in PLACE_SCOPES], "place_scope")}
            ),
            description_placeholders={
                "places": ", ".join(places) if places else i18n.text(self._lang(), "options_flow|no_places")
            },
        )

    async def async_step_place_target(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        scope = self._scope or Scope.AREA
        if user_input is not None:
            self._ref = str(user_input["target"])
            return await self.async_step_place_settings()
        selector: Any = {
            Scope.FLOOR: FloorSelector(),
            Scope.AREA: AreaSelector(),
            Scope.DEVICE: DeviceSelector(),
            Scope.ENTITY: EntitySelector(),
            Scope.PERSON: EntitySelector(EntitySelectorConfig(domain="person")),
        }[scope]
        return self.async_show_form(
            step_id="place_target",
            data_schema=vol.Schema({vol.Required("target"): selector}),
            description_placeholders={"kind": i18n.text(self._lang(), f"options_flow|scope_{scope}")},
        )

    async def async_step_place_settings(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        settings = self._rt.settings
        scope = self._scope or Scope.AREA
        skey = f"{scope}:{self._ref}"
        by_section = place_layout(settings.registry, scope)
        current = settings.overrides_for(skey)
        errors: dict[str, str] = {}
        placeholders = {"place": self._place_name(skey), "error": ""}
        shown: dict[str, Any] = {}
        if user_input is not None:
            flat = _flatten(user_input, set(by_section))
            changes: list[tuple[str, Any]] = []
            problems: list[str] = []
            for items in by_section.values():
                for s in items:
                    raw = flat.get(field(s.key))
                    if _empty(raw):
                        if s.key in current:
                            changes.append((s.key, None))  # empty: this place inherits again
                        continue
                    shown[s.key] = raw
                    try:
                        value = s.validate(from_form(s, raw, place=True))
                    except SettingError as err:
                        problems.append(f"{self._label(s.key)}: {str(err).removeprefix(f'{s.key}: ')}")
                        continue
                    if current.get(s.key, object()) != value:
                        changes.append((s.key, value))
            if problems:
                errors["base"] = "invalid_setting"
                placeholders["error"] = "; ".join(problems)
            else:
                return await self._apply_or_confirm(skey, changes)
        schema: dict[Any, Any] = {}
        for sid, items in by_section.items():
            inner: dict[Any, Any] = {}
            for s in items:
                value = shown.get(s.key, to_form(s, current[s.key], place=True) if s.key in current else None)
                key = vol.Optional(field(s.key), description={"suggested_value": value} if value is not None else None)
                inner[key] = selector_for(s, place=True)
            own = any(s.key in current or s.key in shown for s in items)
            schema[vol.Optional(sid, default={})] = section(vol.Schema(inner), {"collapsed": not own})
        return self.async_show_form(
            step_id="place_settings",
            data_schema=vol.Schema(schema),
            errors=errors,
            description_placeholders=placeholders,
        )

    # ——— Undo and reset ———
    async def async_step_undo(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if self._rt is None:
            return self.async_abort(reason="not_loaded")
        rt = self._rt
        settings = rt.settings
        last = settings.last_undoable()
        if last is None:
            return self.async_abort(reason="nothing_to_undo")
        if user_input is not None:
            settings.undo_last(user=self.context.get("user_id"))
            rt.journal.add("setting", rt.text("journal|setting_undone", key=self._label(last["key"])), actor="person")
            self._reload_if_needed([last["key"]])
            return self.async_create_entry(data=dict(self.config_entry.options))
        s = settings.registry[last["key"]]
        old = s.default if last["old"] is None and last["scope"] == "global" else last["old"]
        change = i18n.text(
            self._lang(),
            "options_flow|undo_change",
            label=self._label(s.key),
            place=self._place_name(last["scope"]),
            old=self._value_text(s, old),
            new=self._value_text(s, s.default if last.get("reset") and last["scope"] == "global" else last["new"]),
        )
        return self.async_show_form(
            step_id="undo", data_schema=vol.Schema({}), description_placeholders={"change": change}
        )

    async def async_step_reset(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if self._rt is None:
            return self.async_abort(reason="not_loaded")
        rt = self._rt
        sections = rt.settings.registry.sections()
        if user_input is not None:
            sid = user_input["section"]
            keys = [s.key for s in rt.settings.registry if s.section == sid]
            count = rt.settings.reset_section(sid, user=self.context.get("user_id"))
            if count:
                label = (i18n.section(rt.language, "sections").get(sid) or {}).get("label", sid)
                rt.journal.add("setting", rt.text("journal|section_reset", section=label), actor="person")
                self._reload_if_needed(keys)
            return self.async_create_entry(data=dict(self.config_entry.options))
        return self.async_show_form(
            step_id="reset",
            data_schema=vol.Schema({vol.Required("section"): _select(sections, "settings_section")}),
        )


def _make_section_step(sid: str) -> Any:
    async def step(self: HomeAIOptionsFlow, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if self._rt is None:
            return self.async_abort(reason="not_loaded")
        return await self._section_step(sid, user_input)

    step.__name__ = f"async_step_{sid}"
    return step


# One step per settings section: the menu's items are their ids.
for _sid in build_registry().sections():
    setattr(HomeAIOptionsFlow, f"async_step_{_sid}", _make_section_step(_sid))
