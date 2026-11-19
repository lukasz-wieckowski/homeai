"""Write the generated parts of `custom_components/homeai/translations/<lang>.json`.

Home Assistant takes the labels of an options form only from the integration's translations, so the forms that
the options flow generates from the settings registry need a translation for every setting. They come from
HomeAI's own texts (`i18n/<lang>.json`): the section pages (menu items, titles, field labels and descriptions,
collapsed parts), the form for one place, and the choices of every select. Everything else in the translations is
written by hand and left as it is.

python scripts/gen_translations.py          # write
python scripts/gen_translations.py --check  # exit 1 when a file is out of date
"""

from __future__ import annotations

import json
from pathlib import Path
import re
import sys
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from custom_components.homeai.options_flow import ADVANCED, field, layout, translated_options  # noqa: E402
from custom_components.homeai.settings.definitions import build_registry  # noqa: E402
from custom_components.homeai.settings.registry import Scope  # noqa: E402

BASE = ROOT / "custom_components" / "homeai"
LANGUAGES = ("en", "pl")
ADVANCED_NAME = {"en": "Advanced", "pl": "Zaawansowane"}
STEP_ORDER = ("init", "place", "place_target", "place_settings", "confirm", "undo", "reset")


def literal(text: str) -> str:
    """HomeAI's text as a Home Assistant translation, which is an ICU message: a JSON example (`{"updates": 1}`)
    becomes the YAML the object editor shows (`updates: 1`); a word in braces (`{name}`) stays a placeholder, which
    the options flow fills with itself (`options_flow.LITERAL_PLACEHOLDERS`)."""

    def example(match: re.Match[str]) -> str:
        try:
            value = json.loads(match.group(0))
        except ValueError:
            return match.group(0)
        if isinstance(value, dict):
            return ", ".join(f"{k}: {v}" for k, v in value.items())
        return match.group(0)

    return re.sub(r"\{[^{}]*\}", lambda m: m.group(0) if re.fullmatch(r"\{\w+\}", m.group(0)) else example(m), text)


def _fields(lang_texts: dict[str, Any], settings: list[Any]) -> dict[str, dict[str, str]]:
    labels = lang_texts["settings"]
    data = {field(s.key): literal(labels[s.key]["label"]) for s in settings}
    descriptions = {field(s.key): literal(labels[s.key]["description"]) for s in settings}
    return {"data": data, "data_description": descriptions}


def generated(lang: str) -> dict[str, Any]:
    texts = json.loads((BASE / "i18n" / f"{lang}.json").read_text(encoding="utf-8"))
    registry = build_registry()
    sections = texts["sections"]
    steps: dict[str, Any] = {}
    menu: dict[str, str] = {}
    menu_descriptions: dict[str, str] = {}
    for sid in registry.sections():
        info = sections[sid]
        menu[sid] = literal(info["label"])
        menu_descriptions[sid] = literal(info.get("description", ""))
        top, parts = layout(registry, sid)
        step: dict[str, Any] = {"title": literal(info["label"]), "description": literal(info.get("description", ""))}
        step.update(_fields(texts, top))
        if parts:
            step["sections"] = {
                name: {
                    "name": ADVANCED_NAME[lang] if name == ADVANCED else literal(texts["groups"][f"{sid}.{name}"]),
                    **_fields(texts, items),
                }
                for name, items in parts.items()
            }
        steps[sid] = step
    place: dict[str, Any] = {}
    for sid in registry.sections():
        items = [s for s in registry if s.section == sid and s.scopes - {Scope.GLOBAL}]
        if items:
            place[sid] = {"name": literal(sections[sid]["label"]), **_fields(texts, items)}
    selectors: dict[str, Any] = {}
    options = texts["options"]
    for s in registry:
        if translated_options(s):
            selectors[field(s.key)] = {"options": {o: literal(options[s.key][o]) for o in s.options}}
    selectors["settings_section"] = {"options": {sid: literal(sections[sid]["label"]) for sid in registry.sections()}}
    return {
        "steps": steps,
        "menu": menu,
        "menu_descriptions": menu_descriptions,
        "place": place,
        "selectors": selectors,
    }


def render(lang: str) -> str:
    path = BASE / "translations" / f"{lang}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    gen = generated(lang)
    options = data.setdefault("options", {})
    old_steps: dict[str, Any] = options.get("step", {})
    init = old_steps.get("init", {})
    extra_menu = {k: v for k, v in (init.get("menu_options") or {}).items() if k not in gen["menu"]}
    extra_descriptions = {
        k: v for k, v in (init.get("menu_option_descriptions") or {}).items() if k not in gen["menu_descriptions"]
    }
    init = {
        **{k: v for k, v in init.items() if k not in ("menu_options", "menu_option_descriptions")},
        "menu_options": {**gen["menu"], **extra_menu},
        "menu_option_descriptions": {**gen["menu_descriptions"], **extra_descriptions},
    }
    place_settings = {**old_steps.get("place_settings", {}), "sections": gen["place"]}
    hand = {k: v for k, v in old_steps.items() if k not in gen["steps"]}
    steps: dict[str, Any] = {"init": init}
    steps.update(gen["steps"])
    for key in STEP_ORDER[1:]:
        if key == "place_settings":
            steps[key] = place_settings
        elif key in hand:
            steps[key] = hand[key]
    steps.update({k: v for k, v in hand.items() if k not in steps})
    options["step"] = steps
    selectors = data.setdefault("selector", {})
    for s in build_registry():  # choices labelled by HomeAI's own texts have no translation
        if s.options and not translated_options(s):
            selectors.pop(field(s.key), None)
    selectors.update(gen["selectors"])
    return json.dumps(data, indent=2, ensure_ascii=False) + "\n"


def main() -> int:
    stale = []
    for lang in LANGUAGES:
        path = BASE / "translations" / f"{lang}.json"
        content = render(lang)
        if "--check" in sys.argv:
            if path.read_text(encoding="utf-8") != content:
                stale.append(path.name)
        else:
            path.write_text(content, encoding="utf-8")
    if stale:
        print(f"translations out of date ({', '.join(stale)}): run python scripts/gen_translations.py")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
