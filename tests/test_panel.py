"""The panel module is served by the integration."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from .common import setup_homeai
from .home import standard_home


async def test_panel_module_is_served(hass: HomeAssistant, hass_client) -> None:
    standard_home(hass)
    await setup_homeai(hass)
    client = await hass_client()
    resp = await client.get("/homeai_static/homeai-panel.js")
    assert resp.status == 200
    body = await resp.text()
    assert "homeai-panel" in body and "homeai-situations-card" in body


async def test_each_view_is_its_own_panel(hass: HomeAssistant) -> None:
    """Four panels, one element: the inbox keeps /homeai (notifications open there), the others get their own path;
    `general.panels` chooses which ones are added."""
    from unittest.mock import AsyncMock, patch

    from custom_components.homeai import panel

    standard_home(hass)
    rt = await setup_homeai(hass)
    hass.config.components.add("frontend")
    register = AsyncMock()
    with patch("homeassistant.components.panel_custom.async_register_panel", register):
        await panel.async_setup_panel(hass, rt)
    calls = {c.kwargs["frontend_url_path"]: c.kwargs for c in register.call_args_list}
    assert set(calls) == {"homeai", "homeai-plan", "homeai-chat", "homeai-manage"}
    assert {k: v["config"]["view"] for k, v in calls.items()} == {
        "homeai": "situations", "homeai-plan": "plan", "homeai-chat": "chat", "homeai-manage": "manage",
    }
    assert all(v["webcomponent_name"] == "homeai-panel" for v in calls.values())
    assert calls["homeai"]["sidebar_title"] == "HomeAI"
    assert calls["homeai-manage"]["sidebar_title"] == "Manage HomeAI"

    rt.settings.set("general.panels", ["situations", "chat"], user="test", confirmed=True)
    register.reset_mock()
    with patch("homeassistant.components.panel_custom.async_register_panel", register):
        await panel.async_setup_panel(hass, rt)
    assert {c.kwargs["frontend_url_path"] for c in register.call_args_list} == {"homeai", "homeai-chat"}
