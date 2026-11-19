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
    """Three panels, one element: the inbox keeps /homeai (notifications open there), the others get their own path;
    `general.panels` chooses which ones are added. The old management panel's address stays only as a hidden
    redirect for old links."""
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
        "homeai": "situations",
        "homeai-plan": "plan",
        "homeai-chat": "chat",
        "homeai-manage": "redirect",
    }
    assert all(v["webcomponent_name"] == "homeai-panel" for v in calls.values())
    assert calls["homeai"]["sidebar_title"] == "HomeAI"
    assert calls["homeai-manage"].get("sidebar_title") is None  # not in the sidebar

    rt.settings.set("general.panels", ["situations", "chat"], user="test", confirmed=True)
    register.reset_mock()
    with patch("homeassistant.components.panel_custom.async_register_panel", register):
        await panel.async_setup_panel(hass, rt)
    assert {c.kwargs["frontend_url_path"] for c in register.call_args_list} == {
        "homeai",
        "homeai-chat",
        "homeai-manage",
    }


async def test_stored_panel_choice_without_the_management_panel(hass: HomeAssistant, hass_storage) -> None:
    """A choice of panels stored before 1.7 keeps the panels that still exist instead of falling back to all."""
    hass_storage["homeai.settings"] = {
        "version": 1,
        "minor_version": 1,
        "key": "homeai.settings",
        "data": {"global": {"general.panels": ["situations", "manage"]}, "overrides": {}, "history": []},
    }
    standard_home(hass)
    rt = await setup_homeai(hass)
    assert rt.settings.get("general.panels") == ["situations"]
    assert "manage" not in rt.settings.registry["general.panels"].options


def test_frontend_sends_old_links_where_things_are_now() -> None:
    """The bundle has no management views; old `?tab=` links go to the integration's page or to Activity."""
    from pathlib import Path

    bundle = (Path(__file__).parents[1] / "custom_components/homeai/frontend/homeai-panel.js").read_text()
    for gone in ("settings", "rules", "learning", "journal", "ai", "approvals"):
        assert f'"homeai-{gone}"' not in bundle, gone
    assert "/config/integrations/integration/homeai" in bundle and "/logbook?entity_id=" in bundle
