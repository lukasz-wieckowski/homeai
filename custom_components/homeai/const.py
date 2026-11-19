"""Constants for HomeAI."""

from __future__ import annotations

import logging
from typing import Final

DOMAIN: Final = "homeai"
NAME: Final = "HomeAI"
VERSION: Final = "1.3.0"
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

# What a room is for (world/rooms.py); heating uses them
ROOM_ROLES: Final = ("bedroom", "bathroom", "common", "workplace")

PANEL_URL: Final = "homeai"
STATIC_URL: Final = "/homeai_static"
