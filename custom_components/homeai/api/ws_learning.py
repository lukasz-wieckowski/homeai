"""Learning and memory for the panel: proposals, facts, the weekly review."""

from __future__ import annotations

from typing import Any

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
import voluptuous as vol

from .websocket import TYPE, command, person_of, resident

Conn = websocket_api.ActiveConnection


@command({TYPE: "homeai/learning/status"})
def ws_status(hass: HomeAssistant, connection: Conn, msg: dict[str, Any], rt: Any) -> None:
    if not resident(rt, connection, msg):
        return
    learning, memory = rt.module("learning"), rt.module("memory")
    admin = connection.user.is_admin
    facts = [f for f in memory.facts.values() if _may_see(rt, connection, f)] if memory else []
    connection.send_result(
        msg["id"],
        {
            "proposals": [p for p in learning.proposals.values() if p["status"] == "pending"] if learning else [],
            "reviews": list(reversed(learning.reviews)) if learning and admin else [],  # the review is for admins
            "norms": len(learning.baselines.norms) if learning else 0,
            "facts": sorted(facts, key=lambda f: f["created"], reverse=True)[:200],
        },
    )


def _may_see(rt: Any, connection: Conn, fact: dict[str, Any]) -> bool:
    """Facts about one person are for that person and for administrators."""
    if connection.user.is_admin or not str(fact.get("scope", "")).startswith("person:"):
        return True
    return fact["scope"] == f"person:{person_of(rt, connection.user.id)}" or fact.get("author") == connection.user.id


def _may_change(rt: Any, connection: Conn, fact: dict[str, Any] | None) -> bool:
    """Administrators change any fact; others only what they said themselves or what is about them."""
    if fact is None or connection.user.is_admin:
        return True
    own = f"person:{person_of(rt, connection.user.id)}"
    return fact.get("author") == connection.user.id or fact.get("scope") == own


@command({TYPE: "homeai/learning/approve", vol.Required("proposal_id"): str}, is_async=True)
async def ws_approve(hass: HomeAssistant, connection: Conn, msg: dict[str, Any], rt: Any) -> None:
    if not resident(rt, connection, msg):
        return
    proposal = await rt.module("learning").approve(msg["proposal_id"], connection.user.id)
    if proposal is None:
        connection.send_error(msg["id"], "not_found", "No such pending proposal")
        return
    connection.send_result(msg["id"], proposal)


@command({TYPE: "homeai/learning/reject", vol.Required("proposal_id"): str})
def ws_reject(hass: HomeAssistant, connection: Conn, msg: dict[str, Any], rt: Any) -> None:
    if not resident(rt, connection, msg):
        return
    connection.send_result(msg["id"], {"rejected": rt.module("learning").reject(msg["proposal_id"])})


@command({TYPE: "homeai/learning/review"}, admin=True, is_async=True)
async def ws_review(hass: HomeAssistant, connection: Conn, msg: dict[str, Any], rt: Any) -> None:
    connection.send_result(msg["id"], await rt.module("learning").weekly_review())


@command({TYPE: "homeai/memory/add", vol.Required("text"): str, vol.Optional("scope", default="home"): str})
def ws_memory_add(hass: HomeAssistant, connection: Conn, msg: dict[str, Any], rt: Any) -> None:
    if not resident(rt, connection, msg):
        return
    own = f"person:{person_of(rt, connection.user.id)}"
    if msg["scope"].startswith("person:") and msg["scope"] != own and not connection.user.is_admin:
        connection.send_error(msg["id"], "unauthorized", "Facts about another person are for administrators")
        return
    fact = rt.module("memory").add(msg["text"], scope=msg["scope"], source="person", author=connection.user.id)
    connection.send_result(msg["id"], fact)


@command({TYPE: "homeai/memory/approve", vol.Required("fact_id"): str})
def ws_memory_approve(hass: HomeAssistant, connection: Conn, msg: dict[str, Any], rt: Any) -> None:
    if not resident(rt, connection, msg):
        return
    fact = rt.module("memory").facts.get(msg["fact_id"])
    if fact is not None and not _may_see(rt, connection, fact):
        connection.send_error(msg["id"], "unauthorized", "Not your fact")
        return
    connection.send_result(msg["id"], {"approved": rt.module("memory").approve(msg["fact_id"])})


@command({TYPE: "homeai/memory/remove", vol.Required("fact_id"): str})
def ws_memory_remove(hass: HomeAssistant, connection: Conn, msg: dict[str, Any], rt: Any) -> None:
    if not resident(rt, connection, msg):
        return
    if not _may_change(rt, connection, rt.module("memory").facts.get(msg["fact_id"])):
        connection.send_error(msg["id"], "unauthorized", "Only an administrator can remove this fact")
        return
    connection.send_result(msg["id"], {"removed": rt.module("memory").remove(msg["fact_id"])})
