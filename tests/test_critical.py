"""Only safety matters are critical: everything else, however it is raised, stops at urgent (3)."""

from __future__ import annotations

from datetime import timedelta

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
import pytest

from custom_components.homeai.const import EVENT_NOTIFICATION
from custom_components.homeai.settings.definitions import build_registry
from custom_components.homeai.settings.registry import Scope
from custom_components.homeai.signals.base import Category, Signal, limit_severity

from .common import phone_targets, phones, settle, setup_homeai
from .home import standard_home

SAFETY_SEVERITIES = {
    "detectors.safety.severity_leak",
    "detectors.safety.severity_smoke",
    "detectors.safety.severity_gas",
    "detectors.safety.severity_carbon_monoxide",
    "detectors.safety.severity_safety",
}


def pushes(calls) -> list:
    return [c for c in calls if c.data.get("message") != "clear_notification"]


async def test_open_window_while_everyone_is_away_is_urgent_not_critical(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    home = standard_home(hass)
    calls = phones(hass, "anna", "ben")
    rt = await setup_homeai(hass, {"detectors.security.away_minutes": 0}, overrides=phone_targets("anna", "ben"))
    events: list[dict] = []
    hass.bus.async_listen(EVENT_NOTIFICATION, lambda e: events.append(dict(e.data)))
    home.set("person.anna", "not_home")
    home.set("binary_sensor.bedroom_window", "on")
    await settle(hass, rt)

    [s] = rt.module("situations").open()
    assert s.kind == "opening_away" and s.category == "security"
    assert s.severity == 3
    assert {"everyone_away", "critical_is_safety_only"} <= set(s.assessment["reasons"])
    sent = pushes(calls)
    assert {c.service for c in sent} == {"mobile_app_anna", "mobile_app_ben"}
    for call in sent:
        push = call.data["data"]["push"]
        assert push["interruption-level"] == "time-sensitive"
        assert "sound" not in push or not isinstance(push["sound"], dict)  # no critical sound
    assert events and not any(e["critical"] for e in events)

    # no repeat every five minutes: nothing new until the ladder's next step
    router = rt.module("notify")
    for minutes in (5, 10):
        await router.deliver(s, dt_util.utcnow() + timedelta(minutes=minutes))
    assert len(pushes(calls)) == 2


async def test_a_leak_while_everyone_is_away_stays_critical(hass: HomeAssistant) -> None:
    home = standard_home(hass)
    calls = phones(hass, "anna")
    rt = await setup_homeai(hass, overrides=phone_targets("anna"))
    home.set("person.anna", "not_home")
    home.set("binary_sensor.sink_leak", "on")
    await settle(hass, rt)
    [s] = rt.module("situations").open()
    assert s.severity == 4 and "critical_is_safety_only" not in s.assessment["reasons"]
    assert pushes(calls)[0].data["data"]["push"]["interruption-level"] == "critical"


@pytest.mark.parametrize(
    ("category", "expected"),
    [
        (Category.SAFETY, 4),
        (Category.SECURITY, 3),
        (Category.DAMAGE, 3),
        (Category.SYSTEM, 3),
        (Category.ENERGY, 3),
        (Category.COMFORT, 3),
        (Category.MAINTENANCE, 3),
        (Category.INFO, 3),
    ],
)
async def test_only_safety_can_be_critical(hass: HomeAssistant, category: Category, expected: int) -> None:
    """A rule, another integration or an override may say 4; outside safety it counts as urgent."""
    standard_home(hass)
    rt = await setup_homeai(hass, {"triage.severity_overrides": {"external": 4}})
    engine = rt.module("situations")
    engine.on_signals(
        {"x": Signal(id="x", detector="test", kind="external", category=category, severity=4, data={"title": "X"})}
    )
    await hass.async_block_till_done()
    await engine.process()
    [s] = engine.open()
    assert s.severity == expected


async def test_critical_label_makes_other_matters_urgent(hass: HomeAssistant) -> None:
    home = standard_home(hass)
    critical = home.label("Critical")
    rt = await setup_homeai(hass, {"world.label_critical": critical})
    home.entity("sensor.freezer", "-18", labels=(critical,))
    engine = rt.module("situations")
    engine.on_signals(
        {
            "freezer": Signal(
                id="freezer",
                detector="test",
                kind="stale_sensor",
                category=Category.DAMAGE,
                severity=1,
                entities=("sensor.freezer",),
                data={"title": "Freezer"},
            )
        }
    )
    await hass.async_block_till_done()
    await engine.process()
    [s] = engine.open()
    assert s.severity == 3 and "critical_label" in s.assessment["reasons"]


async def test_ai_cannot_make_other_matters_critical(hass: HomeAssistant) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    engine, triage = rt.module("situations"), rt.module("triage")
    engine.on_signals(
        {"x": Signal(id="x", detector="test", kind="external", category=Category.DAMAGE, severity=2, data={})}
    )
    await hass.async_block_till_done()
    await engine.process()
    [s] = engine.open()
    triage.apply_ai(s, {"severity": 4, "who": "member", "confidence": 0.9, "reason": "", "steps": []}, "p1")
    assert s.severity == 3 and s.assessment["assessed_by"] == "p1"


def test_limit_severity() -> None:
    assert limit_severity(Category.SAFETY, 4) == 4
    assert limit_severity("safety", 9) == 4
    assert limit_severity("security", 4) == 3
    assert limit_severity(Category.COMFORT, 2) == 2
    assert limit_severity(Category.SYSTEM, -1) == 0


def test_no_detector_outside_safety_can_be_set_critical() -> None:
    registry = build_registry()
    severities = [s for s in registry if s.key.endswith("severity") or "severity_" in s.key.rsplit(".", 1)[-1]]
    severities = [s for s in severities if s.type == "int" and s.min == 0 and not s.key.startswith("ai.")]
    assert len(severities) > 20
    for setting in severities:
        top = 4 if setting.key in SAFETY_SEVERITIES else 3
        assert setting.max == top, setting.key
        assert setting.default <= top, setting.key


async def test_stored_severity_4_outside_safety_becomes_3(hass: HomeAssistant) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    clean = rt.settings._clean(
        {"detectors.window_heating.severity": 4, "detectors.safety.severity_leak": 4, "detectors.stale.severity": 9},
        Scope.GLOBAL,
    )
    assert clean == {
        "detectors.window_heating.severity": 3,
        "detectors.safety.severity_leak": 4,
        "detectors.stale.severity": 3,
    }
