"""Facts and preferences.

A fact has a scope (home, person:<id>, area:<id>, device:<id>, entity:<id>), a source (person, ai, learning), a
confidence and an optional expiry. What people say is approved at once; what HomeAI notices by itself is only a
proposal until someone approves it: it waits in the inbox as an approval request (kind `fact`). Approved facts are
the items of the memory to-do list (`todo.py`). Retrieval is by scope and words; no vector database is needed.
"""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from homeassistant.core import callback
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util, ulid as ulid_util

from ..actions.approvals import Kind
from ..const import DOMAIN, LOGGER

STORAGE_KEY = f"{DOMAIN}.memory"
KIND = "fact"  # approval requests about a fact HomeAI would remember
MAX_FACTS = 1000
SOURCES = ("person", "ai", "learning")


class Memory:
    def __init__(self, runtime: Any) -> None:
        self.rt = runtime
        self.hass = runtime.hass
        self._store: Store[dict[str, Any]] = Store(self.hass, 1, STORAGE_KEY)
        self.facts: dict[str, dict[str, Any]] = {}
        self._listeners: list[Callable[[], None]] = []
        self._unsubs: list[Callable[[], None]] = []

    async def async_setup(self) -> None:
        data = await self._store.async_load() or {}
        self.facts = {f["id"]: f for f in data.get("facts", []) if isinstance(f, dict) and "id" in f}
        self._prune()
        if (approvals := self.rt.module("approvals")) is not None:
            self._unsubs.append(approvals.register_kind(KIND, Kind(self._approve_request, self._deny_request)))
            # facts waiting for a yes from before 1.7, or whose request was lost: ask; requests for facts that are
            # gone or approved meanwhile: stop asking
            for fact in list(self.facts.values()):
                if not fact.get("approved"):
                    self._ask(fact)
            for item in approvals.pending():
                if item.get("kind") == KIND and self.facts.get(item["ref"], {}).get("approved", True):
                    approvals.settle(KIND, item["ref"])

    async def async_unload(self) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        await self._store.async_save(self._data())

    # ——— Approval requests ———
    def _ask(self, fact: dict[str, Any]) -> None:
        approvals = self.rt.module("approvals")
        if approvals is None:
            return
        scope = str(fact.get("scope") or "home")
        person = None
        if scope.startswith("person:"):
            person = self.rt.world.persons.get(scope.removeprefix("person:"))
        approvals.ask(
            KIND,
            fact["id"],
            self.rt.text("approvals|remember", fact=fact["text"]),
            self.rt.text(f"approvals|fact_from_{fact.get('source', 'ai')}"),
            approver="requester" if person is not None and person.user_id else "residents",
            requester=person.user_id if person is not None else None,
            private=scope.startswith("person:"),
        )

    def _settle(self, fact_id: str, status: str) -> None:
        if (approvals := self.rt.module("approvals")) is not None:
            approvals.settle(KIND, fact_id, status)

    async def _approve_request(self, item: dict[str, Any], _user_id: str | None) -> bool:
        return self.approve(item["ref"])

    async def _deny_request(self, item: dict[str, Any], _user_id: str | None) -> bool:
        return self.remove(item["ref"])

    def _data(self) -> dict[str, Any]:
        return {"facts": list(self.facts.values())}

    @callback
    def listen(self, cb: Callable[[], None]) -> Callable[[], None]:
        self._listeners.append(cb)
        return lambda: self._listeners.remove(cb) if cb in self._listeners else None

    def _changed(self) -> None:
        self._store.async_delay_save(self._data, 5)
        for cb in list(self._listeners):
            try:
                cb()
            except Exception:
                LOGGER.exception("Memory listener failed")

    def _prune(self) -> None:
        now = dt_util.utcnow()
        gone = []
        for fid, fact in list(self.facts.items()):
            expires = dt_util.parse_datetime(fact["expires"]) if fact.get("expires") else None
            if expires is not None and expires <= now:
                del self.facts[fid]
                gone.append(fid)
        while len(self.facts) > MAX_FACTS:  # forget the least confident, oldest first
            worst = min(self.facts.values(), key=lambda f: (f.get("approved", False), f["confidence"], f["created"]))
            del self.facts[worst["id"]]
            gone.append(worst["id"])
        for fid in gone:
            self._settle(fid, "withdrawn")

    def add(
        self,
        text: str,
        *,
        scope: str = "home",
        source: str = "person",
        confidence: float = 1.0,
        expires: str | None = None,
        author: str | None = None,
        data: dict[str, Any] | None = None,
        approved: bool | None = None,
    ) -> dict[str, Any]:
        """Remember a fact. Approved at once when a person said it (or `approved`); otherwise it waits for a yes."""
        text = " ".join(str(text).split())[:500]
        for fact in self.facts.values():  # the same thing said again refreshes it
            if fact["scope"] == scope and fact["text"].lower() == text.lower():
                fact["confidence"] = max(fact["confidence"], confidence)
                fact["updated"] = dt_util.utcnow().isoformat(timespec="seconds")
                self._changed()
                return fact
        fact = {
            "id": ulid_util.ulid_now().lower(),
            "text": text,
            "scope": scope,
            "source": source if source in SOURCES else "ai",
            "confidence": max(0.0, min(1.0, confidence)),
            "approved": source == "person" if approved is None else approved,
            "created": dt_util.utcnow().isoformat(timespec="seconds"),
            "expires": expires,
            "author": author,
            "data": data or {},
        }
        self.facts[fact["id"]] = fact
        self._prune()
        if not fact["approved"] and fact["id"] in self.facts:
            self._ask(fact)
        self._changed()
        return fact

    def approve(self, fact_id: str) -> bool:
        fact = self.facts.get(fact_id)
        if fact is None:
            return False
        fact["approved"] = True
        self._settle(fact_id, "approved")
        self._changed()
        return True

    def update_text(self, fact_id: str, text: str) -> bool:
        """A person corrected what HomeAI remembers."""
        fact = self.facts.get(fact_id)
        text = " ".join(str(text).split())[:500]
        if fact is None or not text:
            return False
        if text != fact["text"]:
            fact.update(text=text, updated=dt_util.utcnow().isoformat(timespec="seconds"))
            self._changed()
        return True

    def remove(self, fact_id: str) -> bool:
        if self.facts.pop(fact_id, None) is None:
            return False
        self._settle(fact_id, "withdrawn")
        self._changed()
        return True

    def search(
        self, words: str = "", *, scopes: list[str] | None = None, limit: int = 10, approved_only: bool = True
    ) -> list[dict[str, Any]]:
        terms = [w for w in words.lower().split() if len(w) > 2]
        out = []
        for fact in self.facts.values():
            if approved_only and not fact.get("approved"):
                continue
            if scopes and fact["scope"] not in scopes and fact["scope"] != "home":
                continue
            score = sum(1 for t in terms if t in fact["text"].lower()) if terms else 1
            if terms and not score:
                continue
            out.append((score, fact["confidence"], fact["created"], fact))
        out.sort(key=lambda x: (x[0], x[1], x[2]), reverse=True)
        return [x[3] for x in out[:limit]]
