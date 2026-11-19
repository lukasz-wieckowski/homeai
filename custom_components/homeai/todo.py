"""What HomeAI remembers, as a to-do list (`todo.homeai_memory`).

Each approved fact is an item: adding an item tells HomeAI a fact (as said by a person), editing it changes the
text, deleting it makes HomeAI forget it. Ticking an item off changes nothing: a fact is not a task. Facts HomeAI
noticed by itself are not items until someone approves them in the inbox. Facts about one person stay out of the
list: Home Assistant shows every list to every user, and such facts are only for that person and administrators.
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.todo import TodoItem, TodoItemStatus, TodoListEntity, TodoListEntityFeature
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import DOMAIN
from .entity import HomeAIEntity


async def async_setup_entry(
    hass: HomeAssistant, entry: Any, async_add_entities: AddConfigEntryEntitiesCallback
) -> None:
    rt = entry.runtime_data
    if rt.module("memory") is not None:
        async_add_entities([MemoryList(rt)])


def listed(fact: dict[str, Any]) -> bool:
    return bool(fact.get("approved")) and not str(fact.get("scope", "")).startswith("person:")


class MemoryList(HomeAIEntity, TodoListEntity):
    """Approved facts and preferences, editable by the household."""

    platform_domain = "todo"
    _attr_supported_features = (
        TodoListEntityFeature.CREATE_TODO_ITEM
        | TodoListEntityFeature.UPDATE_TODO_ITEM
        | TodoListEntityFeature.DELETE_TODO_ITEM
    )

    def __init__(self, runtime: Any) -> None:
        super().__init__(runtime, "memory")
        self._attr_todo_items = self._items()

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(self.rt.module("memory").listen(self._changed))

    @callback
    def _changed(self) -> None:
        self._attr_todo_items = self._items()
        self.async_write_ha_state()

    def _items(self) -> list[TodoItem]:
        facts = sorted(
            (f for f in self.rt.module("memory").facts.values() if listed(f)), key=lambda f: f["created"], reverse=True
        )
        return [
            TodoItem(
                summary=f["text"],
                uid=f["id"],
                status=TodoItemStatus.NEEDS_ACTION,
                description=self._about(f["scope"]),
            )
            for f in facts
        ]

    def _about(self, scope: str) -> str | None:
        """Where a fact applies, when not the whole home."""
        kind, _, ref = scope.partition(":")
        if kind in ("", "home") or not ref:
            return None
        if kind == "area":
            name = self.rt.world.area_name(ref)
        elif kind == "entity":
            name = self.rt.world.display_name(ref)
        else:
            name = ref
        return self.rt.text("approvals|about", where=name or ref)

    # ——— Changes from the list ———
    async def _user(self) -> tuple[str | None, bool]:
        """(user id, may change anything) of whoever changes the list; automations are not limited."""
        user_id = self._context.user_id if self._context else None
        if not user_id:
            return None, True
        user = await self.hass.auth.async_get_user(user_id)
        if user is not None and user.is_admin:
            return user_id, True
        if not self.rt.presence.resident_user(user_id):
            raise ServiceValidationError(translation_domain=DOMAIN, translation_key="memory_residents_only")
        return user_id, False

    def _fact(self, uid: str | None, user_id: str | None, admin: bool) -> dict[str, Any]:
        fact = self.rt.module("memory").facts.get(uid or "")
        if fact is None or not listed(fact):
            raise ServiceValidationError(translation_domain=DOMAIN, translation_key="memory_not_found")
        if not admin and fact.get("author") != user_id:
            raise ServiceValidationError(translation_domain=DOMAIN, translation_key="memory_not_yours")
        return fact

    async def async_create_todo_item(self, item: TodoItem) -> None:
        user_id, _admin = await self._user()
        if (item.summary or "").strip():
            self.rt.module("memory").add(item.summary, scope="home", source="person", author=user_id)

    async def async_update_todo_item(self, item: TodoItem) -> None:
        user_id, admin = await self._user()
        fact = self._fact(item.uid, user_id, admin)
        if item.summary is not None and item.summary.strip() and item.summary != fact["text"]:
            self.rt.module("memory").update_text(fact["id"], item.summary)
        else:
            self._changed()  # a tick or an empty text: the item stays as it was

    async def async_delete_todo_items(self, uids: list[str]) -> None:
        user_id, admin = await self._user()
        memory = self.rt.module("memory")
        for uid in uids:
            memory.remove(self._fact(uid, user_id, admin)["id"])
