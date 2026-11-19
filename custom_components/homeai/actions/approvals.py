"""Approvals: actions waiting for a person's yes.

Residents may approve R1–R2, administrators approve R3 and above (R6 is never run on approval: an
administrator does it themselves with confirmation). Requests go to the panel, a persistent notification and
phones with Approve / Deny buttons, and expire after `policy.approval_minutes`.

A person's own request approved by an administrator runs in that administrator's context. A request that needs
the person's own yes and came where HomeAI cannot ask in the conversation (another assistant using HomeAI's tools)
becomes an approval addressed to that person (`approver: requester`); their Approve is their confirmation.

Besides actions, other modules ask here for a yes about something that is not an action (`kind`): a fact HomeAI
noticed and would remember, a habit it would add to the plan. Such a request waits in the inbox without a push and
without expiring; the module that asked says what Approve and Deny do (`register_kind`) and settles the request
when it was decided elsewhere.
"""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any

from homeassistant.components import persistent_notification
from homeassistant.core import Event, callback
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util, ulid as ulid_util

from ..const import DOMAIN, LOGGER
from ..notify.recipients import targets_for
from ..policy import ActionRequest, Decision


@dataclass(frozen=True, slots=True)
class Kind:
    """What Approve and Deny do for requests of one kind; each returns False when the thing asked about is gone."""

    approve: Callable[[dict[str, Any], str | None], Awaitable[bool]]
    deny: Callable[[dict[str, Any], str | None], Awaitable[bool]]


STORAGE_KEY = f"{DOMAIN}.approvals"
EVENT_APPROVAL = "homeai_approval"
PREFIX = "HOMEAI_APPROVAL_"
HISTORY = 50


class Approvals:
    def __init__(self, runtime: Any) -> None:
        self.rt = runtime
        self.hass = runtime.hass
        self._store: Store[dict[str, Any]] = Store(self.hass, 1, STORAGE_KEY)
        self.items: dict[str, dict[str, Any]] = {}
        self._unsubs: list[Callable[[], None]] = []
        self._listeners: list[Callable[[dict[str, Any]], None]] = []
        # Modules that know when their own request no longer fits (a schedule proposal after the schedule changed).
        self._checks: list[Callable[[dict[str, Any]], Awaitable[bool]]] = []
        self._kinds: dict[str, Kind] = {}  # requests that are not actions: kind → what Approve and Deny do

    async def async_setup(self) -> None:
        data = await self._store.async_load() or {}
        self.items = {a["id"]: a for a in data.get("items", []) if isinstance(a, dict) and "id" in a}
        self._unsubs += [
            self.rt.on_tick(self.tick),
            self.hass.bus.async_listen("mobile_app_notification_action", self._on_action),
        ]

    async def async_unload(self) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        await self._store.async_save(self._data())

    def _data(self) -> dict[str, Any]:
        pending = [a for a in self.items.values() if a["status"] == "pending"]
        done = sorted((a for a in self.items.values() if a["status"] != "pending"), key=lambda a: a["created"])
        return {"items": pending + done[-HISTORY:]}

    def _save(self) -> None:
        self._store.async_delay_save(self._data, 2)

    @callback
    def listen(self, cb: Callable[[dict[str, Any]], None]) -> Callable[[], None]:
        self._listeners.append(cb)
        return lambda: self._listeners.remove(cb) if cb in self._listeners else None

    def _changed(self, item: dict[str, Any]) -> None:
        self._save()
        self.hass.bus.async_fire(EVENT_APPROVAL, {k: item[k] for k in ("id", "status", "what", "risk")})
        for cb in list(self._listeners):
            try:
                cb(item)
            except Exception:
                LOGGER.exception("Approval listener failed")

    @callback
    def add_check(self, check: Callable[[dict[str, Any]], Awaitable[bool]]) -> Callable[[], None]:
        """`check(item)` → True when the request is out of date and must not run on approval."""
        self._checks.append(check)
        return lambda: self._checks.remove(check) if check in self._checks else None

    def pending(self) -> list[dict[str, Any]]:
        return sorted((a for a in self.items.values() if a["status"] == "pending"), key=lambda a: a["created"])

    # ——— Requests that are not actions ———
    @callback
    def register_kind(self, kind: str, handler: Kind) -> Callable[[], None]:
        self._kinds[kind] = handler
        return lambda: self._kinds.pop(kind, None) if self._kinds.get(kind) is handler else None

    def find(self, kind: str, ref: str) -> dict[str, Any] | None:
        """The pending request of this kind about `ref`."""
        return next((a for a in self.pending() if a.get("kind") == kind and a.get("ref") == ref), None)

    def ask(
        self,
        kind: str,
        ref: str,
        what: str,
        reason: str,
        *,
        approver: str = "residents",
        requester: str | None = None,
        private: bool = False,
    ) -> dict[str, Any]:
        """Ask for a yes about something that is not an action. Asking again about the same `ref` returns the
        request already waiting. `private`: only the requester and administrators see it."""
        if (item := self.find(kind, ref)) is not None:
            return item
        item = {
            "id": ulid_util.ulid_now().lower(),
            "kind": kind,
            "ref": ref,
            "request": {},
            "what": what,
            "risk": 0,
            "reason": reason,
            "approver": approver,
            "requester": requester,
            "private": private,
            "created": dt_util.utcnow().isoformat(timespec="seconds"),
            "expires": None,
            "status": "pending",
            "decided_by": None,
            "result": None,
        }
        self.items[item["id"]] = item
        self._changed(item)
        return item

    def settle(self, kind: str, ref: str, status: str = "withdrawn") -> None:
        """What a request asked about was decided or is gone (approved elsewhere, removed): stop asking."""
        item = self.find(kind, ref)
        if item is None:
            return
        item.update(status=status, decided_at=dt_util.utcnow().isoformat(timespec="seconds"))
        self._changed(item)

    async def _decide_kind(self, item: dict[str, Any], verb: str, user_id: str | None) -> dict[str, Any] | None:
        handler = self._kinds.get(item["kind"])
        if handler is None:
            return None
        who = await self._name(user_id)
        status = "approved" if verb == "approve" else "denied"
        # decided before the handler runs, so the module settling its own request finds nothing left to settle
        item.update(status=status, decided_by=who, decided_at=dt_util.utcnow().isoformat(timespec="seconds"))
        try:
            ok = await (handler.approve if verb == "approve" else handler.deny)(item, user_id)
        except Exception:
            LOGGER.exception("Deciding a %s request failed", item["kind"])
            ok = False
        if not ok:
            item.update(status="withdrawn")  # what it asked about is gone
            self._changed(item)
            return None
        key = "journal|approval_granted" if verb == "approve" else "journal|approval_denied"
        self.rt.journal.add("approval", self.rt.text(key, what=item["what"], who=who))
        self._changed(item)
        return item

    # ——— Requests ———
    async def create(self, request: ActionRequest, decision: Decision, what: str) -> dict[str, Any]:
        # the same request already waiting: do not ask twice
        for item in self.pending():
            if item["request"] == request.as_dict():
                return item
        now = dt_util.utcnow()
        item = {
            "id": ulid_util.ulid_now().lower(),
            "request": request.as_dict(),
            "what": what,
            "risk": int(decision.risk),
            "reason": request.reason or decision.reason,
            "approver": decision.approver or "admins",
            "requester": request.user_id if request.actor == "person" else None,
            "created": now.isoformat(timespec="seconds"),
            "expires": (now + timedelta(minutes=int(self.rt.settings.get("policy.approval_minutes")))).isoformat(
                timespec="seconds"
            ),
            "status": "pending",
            "decided_by": None,
            "result": None,
        }
        self.items[item["id"]] = item
        self.rt.journal.add(
            "approval", self.rt.text("journal|approval_requested", what=what), situation_id=request.situation_id
        )
        await self._notify(item)
        self._changed(item)
        return item

    async def _notify(self, item: dict[str, Any]) -> None:
        title = self.rt.text("notify|approval_title")
        message = self.rt.text("notify|approval_message", what=item["what"], reason=item["reason"] or "—")
        persistent_notification.async_create(
            self.hass, message, title=title, notification_id=f"homeai_approval_{item['id']}"
        )
        people = [p for p in self.rt.presence.residents() if self._addressed(item, p)]
        data = {
            "tag": f"homeai_approval_{item['id']}",
            "group": "homeai",
            "actions": [
                {"action": f"{PREFIX}APPROVE_{item['id']}", "title": self.rt.text("notify|action_approve")},
                {"action": f"{PREFIX}DENY_{item['id']}", "title": self.rt.text("notify|action_deny")},
            ],
            "push": {"interruption-level": "time-sensitive" if item["risk"] >= 3 else "active"},
        }
        router = self.rt.module("notify")
        for person in people:
            if person.sleep.asleep:
                continue
            for target in targets_for(self.hass, self.rt.settings, person.entity_id):
                try:
                    if router is not None:
                        await router._send(target, title, message, data)
                except Exception as err:
                    LOGGER.debug("Approval request to %s failed: %s", target, err)

    async def _clear(self, item: dict[str, Any]) -> None:
        persistent_notification.async_dismiss(self.hass, f"homeai_approval_{item['id']}")
        router = self.rt.module("notify")
        if router is None:
            return
        for person in self.rt.presence.residents():
            for target in targets_for(self.hass, self.rt.settings, person.entity_id):
                if self.hass.states.get(target) is not None:
                    continue
                try:
                    await router._send(target, "", "clear_notification", {"tag": f"homeai_approval_{item['id']}"})
                except Exception:
                    LOGGER.debug("Clearing approval on %s failed", target)

    @staticmethod
    def _addressed(item: dict[str, Any], person: Any) -> bool:
        if item["approver"] == "requester":
            return bool(person.user_id) and person.user_id == item.get("requester")
        return item["approver"] == "residents" or person.role == "admin"

    # ——— Decisions ———
    async def can_decide(self, item: dict[str, Any], user_id: str | None) -> bool:
        user = await self.hass.auth.async_get_user(user_id) if user_id else None
        if user is None or not user.is_active:
            return False
        if item["approver"] == "requester":
            return user_id == item.get("requester") or user.is_admin
        if user.is_admin:
            return True
        if item["approver"] != "residents":
            return False
        person = next((p for p in self.rt.presence.residents() if p.user_id == user_id), None)
        return person is not None

    async def approve(self, approval_id: str, user_id: str | None) -> dict[str, Any] | None:
        item = self.items.get(approval_id)
        if item is None or item["status"] != "pending" or not await self.can_decide(item, user_id):
            return None
        if item.get("kind"):
            return await self._decide_kind(item, "approve", user_id)
        who = await self._name(user_id)
        request = ActionRequest.from_dict(item["request"])
        if await self._outdated(item, request):
            return None
        item.update(status="approved", decided_by=who, decided_at=dt_util.utcnow().isoformat(timespec="seconds"))
        request.approved_by = who
        request.approved_by_user = user_id
        if item["approver"] == "requester" and user_id == item.get("requester"):
            request.confirmed = True  # the requester's own Approve is their explicit yes
        item["result"] = await self._execute(request)
        self.rt.journal.add("approval", self.rt.text("journal|approval_granted", what=item["what"], who=who))
        learning = self.rt.module("learning")
        if learning is not None:
            learning.feedback("approve", item)
        await self._clear(item)
        self._changed(item)
        return item

    async def _outdated(self, item: dict[str, Any], request: ActionRequest) -> bool:
        """The request can no longer be approved as it was asked: its time ran out, or what it would touch became
        riskier than the class people were asked about (an entity joined the area or label, a class was changed)."""
        expires = dt_util.parse_datetime(item["expires"])
        executor = self.rt.module("executor")
        probe = ActionRequest.from_dict(item["request"])
        probe.entity_ids = executor.targets(probe)
        risk_now = int(self.rt.module("policy").risk(probe))
        if (expires is None or expires > dt_util.utcnow()) and risk_now <= int(item["risk"]):
            stale = False
            for check in list(self._checks):
                try:
                    stale = stale or await check(item)
                except Exception:
                    LOGGER.exception("Approval check failed")
            if not stale:
                return False
        item["status"] = "expired"
        self.rt.journal.add("approval", self.rt.text("journal|approval_expired", what=item["what"]))
        await self._clear(item)
        self._changed(item)
        return True

    async def _execute(self, request: ActionRequest) -> dict[str, Any]:
        try:
            return (await self.rt.module("executor").execute(request)).as_dict()
        except Exception as err:
            LOGGER.exception("Approved action %s.%s crashed", request.domain, request.service)
            return {"status": "failed", "risk": 0, "message": str(err)[:300]}

    async def deny(self, approval_id: str, user_id: str | None) -> dict[str, Any] | None:
        item = self.items.get(approval_id)
        if item is None or item["status"] != "pending" or not await self.can_decide(item, user_id):
            return None
        if item.get("kind"):
            return await self._decide_kind(item, "deny", user_id)
        who = await self._name(user_id)
        item.update(status="denied", decided_by=who, decided_at=dt_util.utcnow().isoformat(timespec="seconds"))
        self.rt.journal.add("approval", self.rt.text("journal|approval_denied", what=item["what"], who=who))
        learning = self.rt.module("learning")
        if learning is not None:
            learning.feedback("deny", item)
        await self._clear(item)
        self._changed(item)
        return item

    async def withdraw(self, approval_id: str) -> bool:
        """HomeAI no longer needs the request (the reason for it is gone or it was replaced): stop asking."""
        item = self.items.get(approval_id)
        if item is None or item["status"] != "pending":
            return False
        item.update(status="withdrawn", decided_at=dt_util.utcnow().isoformat(timespec="seconds"))
        self.rt.journal.add("approval", self.rt.text("journal|approval_withdrawn", what=item["what"]))
        if not item.get("kind"):
            await self._clear(item)
        self._changed(item)
        return True

    def note(self, item: dict[str, Any]) -> None:
        """Something was added to a request (e.g. the arbiter's recommendation)."""
        self._changed(item)

    async def approve_as_arbiter(self, approval_id: str, decision: dict[str, Any]) -> dict[str, Any] | None:
        """The arbiter approves within its limits (checked by the arbiter; never above R3, never R6)."""
        item = self.items.get(approval_id)
        if item is None or item["status"] != "pending" or int(item["risk"]) > 3 or item.get("kind"):
            return None
        if item["request"].get("actor") == "person" or item["approver"] == "requester":
            return None  # a person's request waits for a person: the arbiter only advises
        who = self.rt.text("ai|arbiter_name")
        request = ActionRequest.from_dict(item["request"])
        if await self._outdated(item, request):
            return None
        item.update(status="approved", decided_by=who, decided_at=dt_util.utcnow().isoformat(timespec="seconds"))
        request.approved_by = who
        item["result"] = await self._execute(request)
        self.rt.journal.add("approval", self.rt.text("journal|approval_granted", what=item["what"], who=who))
        await self._clear(item)
        self._changed(item)
        return item

    async def deny_as_arbiter(self, approval_id: str, decision: dict[str, Any]) -> dict[str, Any] | None:
        item = self.items.get(approval_id)
        if item is None or item["status"] != "pending" or item.get("kind"):
            return None
        who = self.rt.text("ai|arbiter_name")
        item.update(status="denied", decided_by=who, decided_at=dt_util.utcnow().isoformat(timespec="seconds"))
        self.rt.journal.add("approval", self.rt.text("journal|approval_denied", what=item["what"], who=who))
        await self._clear(item)
        self._changed(item)
        return item

    async def tick(self, now: datetime) -> None:
        for item in self.pending():
            expires = dt_util.parse_datetime(item["expires"]) if item.get("expires") else None
            if expires is not None and expires <= now:
                item["status"] = "expired"
                self.rt.journal.add("approval", self.rt.text("journal|approval_expired", what=item["what"]))
                await self._clear(item)
                self._changed(item)

    async def _name(self, user_id: str | None) -> str:
        for p in self.rt.world.persons.values():
            if p.user_id and p.user_id == user_id:
                return p.name
        user = await self.hass.auth.async_get_user(user_id) if user_id else None
        return (user.name if user else None) or "?"

    @callback
    def _on_action(self, event: Event) -> None:
        action = str(event.data.get("action") or "")
        if not action.startswith(PREFIX):
            return
        verb, _, approval_id = action[len(PREFIX) :].partition("_")
        if verb == "APPROVE":
            self.hass.async_create_task(self.approve(approval_id, event.context.user_id))
        elif verb == "DENY":
            self.hass.async_create_task(self.deny(approval_id, event.context.user_id))

    def diagnostics(self) -> dict[str, Any]:
        return {"pending": self.pending()}
