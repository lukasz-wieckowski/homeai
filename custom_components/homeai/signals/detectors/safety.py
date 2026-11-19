"""Safety and security: leaks, smoke, gas, CO, tampering, openings and locks while nobody is home or at night."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import ClassVar

from ...world import Role
from ..base import Category, DetectionContext, Detector, Need, Signal
from .util import UNAVAILABLE, area_of, device_of, held_for, name, setting, state, where

# An alarm whose sensor stops answering (burnt, flooded, no power, hub down) stays an alarm this long.
LOST_HOLD = timedelta(minutes=60)


class SafetyDetector(Detector):
    """Any leak, smoke, gas, carbon monoxide or safety sensor that is on."""

    key = "safety"
    roles = (Role.LEAK, Role.SMOKE, Role.GAS, Role.CARBON_MONOXIDE, Role.SAFETY, Role.TAMPER)
    KINDS: ClassVar[dict[Role, tuple[str, Category]]] = {  # severities are settings
        Role.LEAK: ("leak", Category.SAFETY),
        Role.SMOKE: ("smoke", Category.SAFETY),
        Role.GAS: ("gas", Category.SAFETY),
        Role.CARBON_MONOXIDE: ("carbon_monoxide", Category.SAFETY),
        Role.SAFETY: ("safety", Category.SAFETY),
        Role.TAMPER: ("tamper", Category.SECURITY),
    }

    def __init__(self) -> None:
        # sensors that are alarming: entity → (alarm since, when the sensor was lost or None)
        self._alarming: dict[str, tuple[datetime, datetime | None]] = {}

    def _since(self, ctx: DetectionContext, entity_id: str) -> datetime | None:
        """Since when the sensor alarms, or None when it does not. Only an explicit “off” ends an alarm at once:
        a sensor that becomes unavailable while alarming keeps its alarm for LOST_HOLD."""
        s = state(ctx, entity_id)
        if s is not None and s.state == "on":
            self._alarming[entity_id] = (s.last_changed, None)
            return s.last_changed
        held = self._alarming.get(entity_id)
        if held is not None and (s is None or s.state in UNAVAILABLE):
            since, lost = held
            lost = lost or ctx.now
            if ctx.now - lost < LOST_HOLD:
                self._alarming[entity_id] = (since, lost)
                return since
        self._alarming.pop(entity_id, None)
        return None

    def evaluate(self, ctx: DetectionContext) -> list[Signal]:
        out: list[Signal] = []
        for role, (kind, category) in self.KINDS.items():
            for entity_id in sorted(ctx.world.with_role(role)):
                since = self._since(ctx, entity_id)
                if since is None:
                    continue
                area = area_of(ctx, entity_id)
                out.append(
                    Signal(
                        id=f"{kind}:{entity_id}",
                        detector=self.key,
                        kind=kind,
                        category=category,
                        severity=int(setting(ctx, f"detectors.safety.severity_{kind}", entity_id)),
                        entities=(entity_id,),
                        device_id=device_of(ctx, entity_id),
                        area_id=area,
                        since=since,
                        data={"name": name(ctx, entity_id), "where": where(ctx, area_id=area)},
                        need=Need.MEMBER,
                        root=f"{kind}:{area or entity_id}",
                    )
                )
        return out


class SecurityDetector(Detector):
    """Doors, windows, garage doors and locks left open while everyone is away or everyone is asleep."""

    key = "security"
    roles = (Role.OPENING, Role.LOCK, Role.GARAGE_DOOR, Role.GATE, Role.PERSON)

    def evaluate(self, ctx: DetectionContext) -> list[Signal]:
        away = ctx.presence.everyone_away()
        residents = ctx.presence.residents(ctx.now)
        asleep = (
            bool(residents) and all(p.sleep.asleep or not p.home for p in residents) and any(p.home for p in residents)
        )
        if not away and not asleep:
            return []
        out: list[Signal] = []
        delay_key = "detectors.security.away_minutes" if away else "detectors.security.night_minutes"
        kind_suffix = "away" if away else "night"
        candidates: list[tuple[str, str, bool]] = []
        for entity_id in ctx.world.with_role(Role.OPENING):
            candidates.append((entity_id, "opening", True))
        for entity_id in ctx.world.with_role(Role.GARAGE_DOOR, Role.GATE):
            candidates.append((entity_id, "garage", True))
        for entity_id in ctx.world.with_role(Role.LOCK):
            candidates.append((entity_id, "lock", True))
        for entity_id, family, _ in sorted(candidates):
            s = state(ctx, entity_id)
            if s is None:
                continue
            is_open = (s.state == "unlocked") if family == "lock" else (s.state in ("on", "open", "opening"))
            if not is_open or not held_for(s, ctx.now, float(setting(ctx, delay_key, entity_id))):
                continue
            if family == "opening" and not away and not setting(ctx, "detectors.security.openings_at_night", entity_id):
                continue
            kind = f"{family}_{kind_suffix}"
            area = area_of(ctx, entity_id)
            out.append(
                Signal(
                    id=f"{kind}:{entity_id}",
                    detector=self.key,
                    kind=kind,
                    category=Category.SECURITY,
                    severity=3 if away else 2,
                    entities=(entity_id,),
                    device_id=device_of(ctx, entity_id),
                    area_id=area,
                    since=s.last_changed,
                    data={"name": name(ctx, entity_id), "where": where(ctx, area_id=area)},
                    need=Need.MEMBER,
                    root=f"security_{kind_suffix}",
                )
            )
        return out
