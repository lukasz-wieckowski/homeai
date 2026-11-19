"""Schedule proposals from habits: people keep doing by hand what the next block of the schedule would do anyway.

HomeAI records changes of a thermostat's target that people make (in the app, on a remote, by voice; not the
thermostat's own schedule and not HomeAI). When, on most workdays (or weekend days) of the last weeks, someone sets
by hand what the next block sets — the same preset, or the same temperature within 0.3° — some time before that
block starts, HomeAI proposes moving the block to that time on those days. The proposal is a new weekly schedule
(`set_schedule`, R4): only an administrator's approval changes the thermostat.
"""

from __future__ import annotations

from datetime import date, datetime, timedelta
from statistics import median
from typing import Any

from .contract import DAYS, canonical_week

GROUPS: dict[str, frozenset[str]] = {
    "workday": frozenset({"mon", "tue", "wed", "thu", "fri"}),
    "weekend": frozenset({"sat", "sun"}),
}
TOLERANCE = 0.3  # °C: a manual temperature this close to the block's counts as the same
MIN_SHIFT = 10  # minutes: smaller moves are not worth asking about
SHARE = 0.6  # the habit shows on at least this share of the possible days


def minutes(hhmm: str) -> int:
    hours, mins = hhmm.split(":")
    return int(hours) * 60 + int(mins)


def hhmm(value: int) -> str:
    return f"{value // 60:02d}:{value % 60:02d}"


def setpoint(block: dict[str, Any], preset_temps: dict[str, float]) -> float | None:
    if "temperature" in block:
        return float(block["temperature"])
    return preset_temps.get(block.get("preset_mode") or "")


def _matches(change: tuple[datetime, Any, Any], block: dict[str, Any], preset_temps: dict[str, float]) -> bool:
    _, temperature, preset = change
    if preset and block.get("preset_mode") and preset == block["preset_mode"]:
        return True
    target = setpoint(block, preset_temps)
    return (
        target is not None
        and isinstance(temperature, (int, float))
        and not isinstance(temperature, bool)
        and abs(float(temperature) - target) <= TOLERANCE
    )


def _previous_block(week: list[dict[str, Any]], day: str, before: int) -> int:
    """Minute of the last block on `day` before `before` (0 when none)."""
    times = [minutes(b["time"]) for b in week if day in b["days"] and minutes(b["time"]) < before]
    return max(times, default=0)


def find_shifts(
    week: list[dict[str, Any]],
    changes: list[tuple[datetime, Any, Any]],
    preset_temps: dict[str, float],
    *,
    today: date,
    days: int,
    min_days: int,
    window: int,
    max_shift: int,
) -> list[dict[str, Any]]:
    """Blocks people anticipate by hand. `changes`: (local time, temperature, preset) of manual changes."""
    by_day: dict[date, list[tuple[datetime, Any, Any]]] = {}
    for change in changes:
        by_day.setdefault(change[0].date(), []).append(change)
    past = [today - timedelta(days=n) for n in range(1, days + 1)]
    found = []
    for index, block in enumerate(week):
        start = minutes(block["time"])
        for kind, group in GROUPS.items():
            here = set(block["days"]) & group
            possible = [d for d in past if DAYS[d.weekday()] in here]
            if len(possible) < min_days:
                continue
            seen: list[int] = []
            for day in possible:
                name = DAYS[day.weekday()]
                low = max(_previous_block(week, name, start) + 1, start - max_shift)
                early = [
                    c[0].hour * 60 + c[0].minute
                    for c in by_day.get(day, [])
                    if low <= c[0].hour * 60 + c[0].minute <= start - MIN_SHIFT and _matches(c, block, preset_temps)
                ]
                if early:
                    seen.append(min(early))
            best: list[int] = []
            for centre in seen:
                inside = [m for m in seen if abs(m - centre) <= window]
                if len(inside) > len(best):
                    best = inside
            if len(best) < min_days or len(best) / len(possible) < SHARE:
                continue
            new = int(median(best)) // 5 * 5
            if start - new < MIN_SHIFT:
                continue
            found.append(
                {
                    "block": index,
                    "kind": kind,
                    "days": [d for d in DAYS if d in here],
                    "from": block["time"],
                    "to": hhmm(new),
                    "seen": len(best),
                    "possible": len(possible),
                }
            )
    return sorted(found, key=lambda s: (-s["seen"] / s["possible"], s["block"]))


def shifted_week(week: list[dict[str, Any]], shift: dict[str, Any]) -> list[dict[str, Any]] | None:
    """The week with one block moved on the shift's days (the block stays as it was on its other days)."""
    block = week[shift["block"]]
    rest = [d for d in block["days"] if d not in shift["days"]]
    out = [b for i, b in enumerate(week) if i != shift["block"]]
    if rest:
        out.append({**block, "days": rest})
    moved = {**block, "days": list(shift["days"]), "time": shift["to"]}
    if any(b["time"] == moved["time"] and set(b["days"]) & set(moved["days"]) for b in out):
        return None  # another block already starts then
    out.append(moved)
    return canonical_week(out)
