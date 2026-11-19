"""System snapshot: data outside the state machine (backups, log, automation traces), fetched periodically.

Detectors evaluate synchronously, so anything that needs an await is collected here first, at most every
`detectors.system_refresh` seconds, and read from the snapshot afterwards.
"""

from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..const import LOGGER

# Listing backups asks every backup location, often a cloud service: not more often than this, unless a backup
# finished since the last listing.
BACKUP_LIST_EVERY = timedelta(hours=6)
WEEKDAYS = ("mon", "tue", "wed", "thu", "fri", "sat", "sun")


@dataclass(slots=True)
class SystemSnapshot:
    fetched_at: datetime | None = None
    backup_agents_failed: list[str] = field(default_factory=list)
    backups_listed_at: datetime | None = None
    backups_listed_after: str | None = None  # the last backup event seen when the locations were listed
    # Hours between automatic backups by Home Assistant's schedule (the longest gap for chosen weekdays);
    # 0 = automatic backups are off; None = unknown (no backup integration, or it could not be read).
    backup_every_hours: float | None = None
    log: list[dict[str, Any]] = field(default_factory=list)
    traces: list[dict[str, Any]] = field(default_factory=list)


def schedule_hours(recurrence: str, days: list[str]) -> float:
    """Hours between automatic backups for Home Assistant's backup schedule (0 when there is none)."""
    if recurrence == "daily":
        return 24.0
    if recurrence != "custom_days":
        return 0.0
    chosen = sorted({WEEKDAYS.index(d) for d in days if d in WEEKDAYS})
    if not chosen:
        return 0.0
    gaps = [(chosen[(i + 1) % len(chosen)] - day) % 7 or 7 for i, day in enumerate(chosen)]
    return 24.0 * max(gaps)


async def async_refresh(hass: HomeAssistant, snapshot: SystemSnapshot, last_backup_event: str | None = None) -> None:
    """Fill the snapshot. Every part is optional and failures only leave that part empty."""
    try:
        if "backup" in hass.config.components:
            from homeassistant.components.backup.const import DATA_MANAGER

            if (manager := hass.data.get(DATA_MANAGER)) is not None:
                schedule = manager.config.data.schedule
                snapshot.backup_every_hours = schedule_hours(
                    str(schedule.recurrence), [str(d) for d in schedule.days or []]
                )
                now = dt_util.utcnow()
                if (
                    snapshot.backups_listed_at is None
                    or now - snapshot.backups_listed_at >= BACKUP_LIST_EVERY
                    or last_backup_event != snapshot.backups_listed_after
                ):
                    async with asyncio.timeout(60):
                        _, failed = await manager.async_get_backups()
                    snapshot.backup_agents_failed = sorted(failed)
                    snapshot.backups_listed_at, snapshot.backups_listed_after = now, last_backup_event
    except Exception as err:
        LOGGER.debug("Backup agents not read: %s", err)
    try:
        if (system_log := hass.data.get("system_log")) is not None:
            snapshot.log = system_log.records.to_list()
    except Exception as err:
        LOGGER.debug("System log not read: %s", err)
    try:
        if "trace" in hass.config.components:
            from homeassistant.components.trace.util import async_list_traces

            snapshot.traces = await async_list_traces(hass, "automation", None)
    except Exception as err:
        LOGGER.debug("Automation traces not read: %s", err)
    snapshot.fetched_at = dt_util.utcnow()
