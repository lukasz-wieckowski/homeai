"""HomeAI's panels in the sidebar and the Lovelace cards (one module served by the integration).

One web component draws every panel; `config.view` says which: the inbox (situations and approvals, at the
integration's own path, where notifications open), the home's plan with presence, the chat, and managing HomeAI
(learning, journal, rules, settings, AI). `general.panels` chooses which of them appear in the sidebar.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

from homeassistant.core import HomeAssistant

from . import i18n
from .const import LOGGER, PANEL_ICONS, PANEL_PATHS, PANELS, STATIC_URL, VERSION

FILE = "homeai-panel.js"
DATA_STATIC = "homeai_static_registered"


def panel_title(rt: Any, lang: str, view: str) -> str:
    name = str(rt.settings.get("general.assistant_name") or "HomeAI")
    return i18n.text(lang, f"panels|{view}", name=name)


async def async_setup_panel(hass: HomeAssistant, rt: Any) -> None:
    path = Path(__file__).parent / "frontend"
    if not (path / FILE).exists():
        LOGGER.warning("HomeAI panel is not built (%s missing)", FILE)
        return
    module_url = f"{STATIC_URL}/{FILE}?v={VERSION}"
    if not hass.data.get(DATA_STATIC) and getattr(hass, "http", None) is not None:
        from homeassistant.components.http import StaticPathConfig

        await hass.http.async_register_static_paths([StaticPathConfig(STATIC_URL, str(path), cache_headers=False)])
        hass.data[DATA_STATIC] = True
        if "frontend" in hass.config.components:
            from homeassistant.components.frontend import add_extra_js_url

            # Makes the cards available on dashboards: as a module for current browsers, and as a plain script
            # for browsers Home Assistant serves its legacy build to (e.g. iOS before 18.1).
            add_extra_js_url(hass, module_url)
            add_extra_js_url(hass, module_url, es5=True)
    if "frontend" not in hass.config.components or not rt.settings.get("general.panel_sidebar"):
        return
    from homeassistant.components import panel_custom

    lang = i18n.resolve_language(hass, str(rt.settings.get("general.language")))
    wanted = set(rt.settings.get("general.panels") or ())
    for view in PANELS:
        if view not in wanted:
            continue
        try:
            await panel_custom.async_register_panel(
                hass,
                frontend_url_path=PANEL_PATHS[view],
                webcomponent_name="homeai-panel",
                sidebar_title=panel_title(rt, lang, view),
                sidebar_icon=PANEL_ICONS[view],
                module_url=module_url,
                require_admin=bool(rt.settings.get("general.panel_admin_only")),
                config={"view": view},
            )
        except ValueError:
            LOGGER.debug("HomeAI panel %s already registered", view)


def async_remove_panel(hass: HomeAssistant) -> None:
    if "frontend" not in hass.config.components:
        return
    from homeassistant.components.frontend import async_remove_panel

    for url in PANEL_PATHS.values():
        async_remove_panel(hass, url, warn_if_unknown=False)
