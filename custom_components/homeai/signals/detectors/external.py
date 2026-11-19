"""Signals from other integrations and automations.

Two documented ways in:
- the `homeai.report_signal` service (stored here until cleared or expired);
- an entity attribute `homeai_signals`: a list of {id, title, severity 0–4, category?, description?, need?}.
"""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import replace
from datetime import datetime
from typing import Any

from homeassistant.util import dt as dt_util

from ..base import Category, DetectionContext, Detector, Need, Signal
from .util import area_of, device_of

ATTRIBUTE = "homeai_signals"


def parse_external(raw: Any, *, source: str, entity_id: str | None = None) -> Signal | None:
    """One external signal from service data or an attribute item; None when it is malformed."""
    if not isinstance(raw, dict):
        return None
    sid, title = raw.get("id"), raw.get("title")
    severity = raw.get("severity", 1)
    if not isinstance(sid, str) or not sid.strip() or not isinstance(title, str) or not title.strip():
        return None
    if isinstance(severity, bool) or not isinstance(severity, int) or not 0 <= severity <= 4:
        return None
    try:
        category = Category(raw.get("category", "info"))
        need = Need(raw.get("need", "member"))
    except ValueError:
        return None
    entities = tuple(e for e in (raw.get("entities") or ([entity_id] if entity_id else [])) if isinstance(e, str))
    return Signal(
        id=f"external:{source}:{sid.strip()}",
        detector="external",
        kind="external",
        category=category,
        severity=severity,
        entities=entities,
        data={"title": title.strip()[:200], "description": str(raw.get("description") or "")[:500]},
        need=need,
        root=raw.get("group") if isinstance(raw.get("group"), str) else None,
        confidence=_confidence(raw.get("confidence", 0.8)),
    )


def _confidence(value: Any) -> float:
    try:
        return max(0.0, min(1.0, float(value)))
    except TypeError, ValueError:  # one malformed attribute must not stop every external signal
        return 0.8


class ExternalDetector(Detector):
    key = "external"

    def __init__(self) -> None:
        self.reported: dict[str, tuple[Signal, datetime | None]] = {}
        self.on_change: Callable[[], None] | None = None  # the hub stores reported signals

    def report(self, signal: Signal, expires: datetime | None) -> None:
        self.reported[signal.id] = (signal, expires)
        self._changed()

    def clear(self, signal_id: str) -> bool:
        cleared = self.reported.pop(signal_id, None) is not None
        if cleared:
            self._changed()
        return cleared

    def _changed(self) -> None:
        if self.on_change is not None:
            self.on_change()

    def dump(self) -> list[dict[str, Any]]:
        return [
            {"signal": signal.as_dict(), "expires": expires.isoformat() if expires else None}
            for signal, expires in self.reported.values()
        ]

    def restore(self, items: Any) -> None:
        for item in items if isinstance(items, list) else []:
            try:
                signal = Signal.from_dict(item["signal"])
                expires = dt_util.parse_datetime(item["expires"]) if item.get("expires") else None
            except KeyError, TypeError, ValueError:
                continue
            self.reported[signal.id] = (signal, expires)

    def evaluate(self, ctx: DetectionContext) -> list[Signal]:
        out: list[Signal] = []
        now = dt_util.utcnow()
        for sid, (signal, expires) in list(self.reported.items()):
            if expires is not None and expires <= now:
                del self.reported[sid]
                self._changed()
                continue
            out.append(signal)
        if not ctx.settings.get("detectors.external.attributes"):
            return out
        for state in ctx.hass.states.async_all():
            items = state.attributes.get(ATTRIBUTE)
            if not isinstance(items, (list, tuple)):
                continue
            for raw in items:
                signal = parse_external(raw, source=state.entity_id, entity_id=state.entity_id)
                if signal is None:
                    continue
                area = area_of(ctx, state.entity_id)
                out.append(replace(signal, area_id=area, device_id=device_of(ctx, state.entity_id)))
        return out
