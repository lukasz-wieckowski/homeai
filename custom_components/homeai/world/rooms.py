"""Room roles: what a room is for — bedroom, bathroom, common space, workplace.

A room (a Home Assistant area) gets its roles, in this order:

1. the administrator's choice for that area (setting `world.room_roles`; `none` means no role at all);
2. HomeAI's role labels (`HomeAI: bedroom`, `HomeAI: bathroom`, `HomeAI: common space`, `HomeAI: workplace`)
   on the area itself, or on a device or entity in it (a desk plug labelled workplace makes its room a workplace);
3. when `world.room_roles_auto` is on: the area's icon, then words in its name (English and Polish).

A room may have several roles (a living room with a desk is a common space and a workplace). Heating uses them:
guests warm the common spaces, working from home warms the person's workplace.
"""

from __future__ import annotations

from collections.abc import Iterable
import re
from typing import TYPE_CHECKING

from ..const import ROOM_ROLES
from ..settings import Target

if TYPE_CHECKING:
    from .model import WorldModel

ROLE_LABELS = {role: f"label_{role}" for role in ROOM_ROLES}  # role → world.label_<role> setting

# Material Design icons people pick for rooms in Home Assistant's area editor.
ICONS: dict[str, tuple[str, ...]] = {
    "bedroom": ("mdi:bed", "mdi:bed-king", "mdi:bed-queen", "mdi:bed-double", "mdi:bed-empty", "mdi:bunk-bed"),
    "bathroom": ("mdi:shower", "mdi:bathtub", "mdi:toilet", "mdi:shower-head", "mdi:paper-roll"),
    "common": ("mdi:sofa", "mdi:television", "mdi:silverware-fork-knife", "mdi:sofa-single", "mdi:fireplace"),
    "workplace": ("mdi:desk", "mdi:desktop-classic", "mdi:laptop", "mdi:briefcase", "mdi:office-building"),
}
# Words in an area's name (lowercase, matched at the start of a word).
WORDS: dict[str, tuple[str, ...]] = {
    "bedroom": ("bedroom", "sypialni", "nursery", "pokój dzieci", "pokoj dzieci", "dziecięcy", "guest room"),
    "bathroom": ("bathroom", "łazienk", "lazienk", "toilet", "wc", "toaleta", "shower", "prysznic"),
    "common": (
        "living",
        "lounge",
        "salon",
        "dining",
        "jadalni",
        "kitchen",
        "kuchni",
        "family room",
        "dzienny",
        "dzienna",
    ),
    "workplace": ("office", "study", "biur", "gabinet", "workroom", "pracowni"),
}


def _word_match(name: str, words: Iterable[str]) -> bool:
    return any(re.search(rf"(^|[\s\-_/(]){re.escape(w)}", name) for w in words)


def auto_roles(name: str, icon: str | None) -> frozenset[str]:
    """Roles guessed from an area's icon, else from its name; empty when nothing fits."""
    if icon:
        found = {role for role, icons in ICONS.items() if icon in icons}
        if found:
            return frozenset(found)
    text = name.lower()
    return frozenset(role for role, words in WORDS.items() if _word_match(text, words))


def room_roles(world: WorldModel, area_id: str | None) -> frozenset[str]:
    """The roles of one area (see the module docstring for the order of sources)."""
    if not area_id or area_id not in world.areas:
        return frozenset()
    area = world.areas[area_id]
    chosen = world.settings.get("world.room_roles", Target(area_id=area_id, floor_id=area.floor_id))
    if chosen:
        return frozenset(r for r in chosen if r in ROOM_ROLES)  # ["none"] → no roles
    labels = {world.label(which): role for role, which in ROLE_LABELS.items()}
    found = {labels[label] for label in area.labels if label in labels}
    for entity_id in world.in_area(area_id):
        info = world.entities.get(entity_id)
        if info is not None:
            found |= {labels[label] for label in info.labels if label in labels}
    if found:
        return frozenset(found)
    if world.settings.get("world.room_roles_auto"):
        return auto_roles(area.name, area.icon)
    return frozenset()
