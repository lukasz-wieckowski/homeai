"""Constants for HomeAI."""

from __future__ import annotations

import logging
from typing import Final

DOMAIN: Final = "homeai"
NAME: Final = "HomeAI"
VERSION: Final = "1.7.0"
LOGGER = logging.getLogger(__package__)

# Bus events other automations can react to
EVENT_SITUATION: Final = "homeai_situation"
EVENT_ACTION: Final = "homeai_action"
EVENT_NOTIFICATION: Final = "homeai_notification"

# Config entry data keys
CONF_SYSTEM_USER: Final = "system_user_id"
CONF_INSTALLED_AT: Final = "installed_at"
CONF_INITIAL_SETTINGS: Final = "initial_settings"
CONF_INITIAL_APPLIED: Final = "initial_settings_applied"
CONF_NEEDS_SETUP: Final = "needs_setup"  # an entry HomeAI's wizard did not make (Repairs → finish setup)

# Config subentry types: AI connections and custom rules
SUBENTRY_TIER: Final = "tier"
SUBENTRY_RULE: Final = "rule"

# What a room is for (world/rooms.py); heating uses them
ROOM_ROLES: Final = ("bedroom", "bathroom", "common", "workplace")

PANEL_URL: Final = "homeai"
# The panels in the sidebar: the inbox (situations and approvals) keeps the integration's own path, where
# notifications open; the others are views of the same panel element (`config.view`). Settings, rules, memory and
# the journal live where Home Assistant keeps them: the integration's options and subentries, a to-do list and
# the logbook.
PANELS: Final = ("situations", "plan", "chat")
PANEL_PATHS: Final = {"situations": PANEL_URL, "plan": "homeai-plan", "chat": "homeai-chat"}
PANEL_ICONS: Final = {
    "situations": "mdi:home-heart",
    "plan": "mdi:calendar-clock",
    "chat": "mdi:message-text-outline",
}
# Before 1.7 HomeAI had a fourth panel for managing it; its old links are sent to where those things are now.
LEGACY_PANEL_PATH: Final = "homeai-manage"
STATIC_URL: Final = "/homeai_static"
