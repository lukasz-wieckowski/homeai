"""Confirmations that come from the person, not from the model.

When the policy needs a person's explicit yes (R2 when asked, R5, R4/R6 for administrators), a conversation gets a
one-time code bound to that person, that conversation, the turn it was issued in and the exact action (service,
data and every entity the call can reach). The model may present the code again only after the person has written
or said something new, and that message must itself be a plain yes. A tool argument, text injected through entity
names or log lines, or the same turn can never confirm anything.

Codes live in memory only (a restart forgets them) and expire after `MINUTES`.
"""

from __future__ import annotations

from datetime import timedelta
import re
import secrets
from typing import Any

from homeassistant.util import dt as dt_util

from .. import i18n

MINUTES = 10
MAX_PENDING = 50
MAX_WORDS = 6  # a confirmation is a short answer, not a new request


def _words(lang: str, key: str) -> list[str]:
    phrases = {i18n.text(lang, f"actions|{key}"), i18n.text(i18n.FALLBACK, f"actions|{key}")}
    out: list[str] = []
    for text in phrases:
        out += [w.strip().lower() for w in text.split(",") if w.strip()]
    return out


def _normalise(text: str) -> str:
    return " ".join(re.sub(r"[^\w\s']", " ", text.lower()).split())


def affirmative(text: str, lang: str) -> bool:
    """A short, plain yes in the person's language (English always counts), with no no in it."""
    said = _normalise(text)
    if not said or len(said.split()) > MAX_WORDS:
        return False
    padded = f" {said} "
    if any(f" {_normalise(w)} " in padded for w in _words(lang, "no_words")):
        return False
    return any(f" {_normalise(w)} " in padded for w in _words(lang, "yes_words"))


class Confirmations:
    def __init__(self) -> None:
        self._pending: dict[str, dict[str, Any]] = {}

    def issue(self, fingerprint: str, *, user_id: str | None, conversation_id: str | None, turn: int) -> str:
        now = dt_util.utcnow()
        self._expire(now)
        code = secrets.token_hex(4)
        self._pending[code] = {
            "fingerprint": fingerprint,
            "user_id": user_id,
            "conversation_id": conversation_id,
            "turn": turn,
            "expires": now + timedelta(minutes=MINUTES),
        }
        while len(self._pending) > MAX_PENDING:
            self._pending.pop(next(iter(self._pending)))
        return code

    def redeem(
        self,
        code: str,
        fingerprint: str,
        *,
        user_id: str | None,
        conversation_id: str | None,
        turn: int | None,
        said: str,
        lang: str,
    ) -> bool:
        """True once, when the same person in the same conversation answered yes in their next message to exactly
        the same action."""
        self._expire(dt_util.utcnow())
        item = self._pending.get(str(code))
        if item is None or turn is None or user_id is None:
            return False
        if item["user_id"] != user_id or item["conversation_id"] != conversation_id:
            return False
        if turn != item["turn"] + 1:
            # only the very next message can be the answer; a yes to some later question confirms nothing
            if turn > item["turn"] + 1:
                del self._pending[str(code)]
            return False
        if item["fingerprint"] != fingerprint or not affirmative(said, lang):
            return False
        del self._pending[str(code)]
        return True

    def _expire(self, now: Any) -> None:
        for code in [c for c, item in self._pending.items() if item["expires"] <= now]:
            del self._pending[code]

    def __len__(self) -> int:
        return len(self._pending)
