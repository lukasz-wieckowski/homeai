"""Tools for AI tiers. Reads are filtered by privacy; every change goes through the executor and its policy,
in the context of the person who asked (chat) or of HomeAI (missions).
"""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from dataclasses import dataclass, field
from datetime import timedelta
import json
from typing import Any

from homeassistant.util import dt as dt_util

from ..policy import ActionRequest, Decision, Risk, Verdict
from .privacy import Privacy, clean
from .providers.base import ToolSpec

MAX_RESULT = 6000


@dataclass(slots=True)
class ToolContext:
    rt: Any
    privacy: Privacy
    actor: str = "ai"  # "ai" (a mission) or "person" (chat)
    user_id: str | None = None
    situation_id: str | None = None
    actions: list[dict[str, Any]] = field(default_factory=list)
    # HomeAI's own conversations: which thread, which of the person's messages this is and what they said — a
    # confirmation code is redeemed only in a later message that is itself a yes. None elsewhere (other assistants
    # using HomeAI's tools): there a needed yes becomes an approval addressed to the person.
    conversation_id: str | None = None
    turn: int | None = None
    said: str = ""


Handler = Callable[[ToolContext, dict[str, Any]], Awaitable[Any]]


@dataclass(frozen=True, slots=True)
class Tool:
    name: str
    description: str
    schema: dict[str, Any]
    handler: Handler
    changes: bool = False  # goes through the executor

    def spec(self) -> ToolSpec:
        return ToolSpec(self.name, self.description, self.schema)


def _obj(properties: dict[str, Any], required: list[str] | None = None) -> dict[str, Any]:
    return {"type": "object", "properties": properties, "required": required or [], "additionalProperties": False}


STR = {"type": "string"}
STRS = {"type": "array", "items": {"type": "string"}}


# ——— Reading ———
async def find_entities(ctx: ToolContext, args: dict[str, Any]) -> Any:
    world, query = ctx.rt.world, str(args.get("query") or "").lower()
    area_q, domain = str(args.get("area") or "").lower(), args.get("domain")
    out = []
    for entity_id, info in sorted(world.entities.items()):
        if domain and info.domain != domain:
            continue
        if not ctx.privacy.allowed(entity_id):
            continue
        area = world.area_name(info.area_id)
        name = world.display_name(entity_id)
        if query and query not in name.lower() and query not in entity_id:
            continue
        if area_q and area_q not in area.lower():
            continue
        state = ctx.rt.hass.states.get(entity_id)
        out.append(
            {
                "entity_id": entity_id,
                "name": ctx.privacy.entity_name(entity_id),
                "area": ctx.privacy.area(area),
                "state": clean(state.state, 40) if state else None,
            }
        )
        if len(out) >= min(int(args.get("limit") or 30), 100):
            break
    return out


async def get_states(ctx: ToolContext, args: dict[str, Any]) -> Any:
    from .context import KEEP_ATTRIBUTES

    out = []
    for entity_id in (args.get("entity_ids") or [])[:30]:
        state = ctx.rt.hass.states.get(entity_id)
        if state is None or not ctx.privacy.allowed(entity_id):
            out.append({"entity_id": entity_id, "error": "not_available"})
            continue
        out.append(
            {
                "entity_id": entity_id,
                "name": ctx.privacy.entity_name(entity_id),
                "state": clean(state.state, 60),
                "since": state.last_changed.isoformat(timespec="minutes"),
                "attributes": ctx.privacy.attributes(
                    dict(state.attributes),
                    # the real name would undo the alias a minimal-privacy provider is given
                    KEEP_ATTRIBUTES if ctx.privacy.level == "minimal" else (*KEEP_ATTRIBUTES, "friendly_name"),
                ),
            }
        )
    return out


async def get_history(ctx: ToolContext, args: dict[str, Any]) -> Any:
    entity_id = str(args.get("entity_id") or "")
    if not ctx.privacy.allowed(entity_id) or ctx.rt.hass.states.get(entity_id) is None:
        return {"error": "not_available"}
    if "recorder" not in ctx.rt.hass.config.components:
        return {"error": "no_recorder"}
    from homeassistant.components.recorder import get_instance, history

    hours = max(1, min(int(args.get("hours") or 24), 168))
    start = dt_util.utcnow() - timedelta(hours=hours)
    states = await get_instance(ctx.rt.hass).async_add_executor_job(
        history.state_changes_during_period, ctx.rt.hass, start, None, entity_id, True, True, 100
    )
    return [
        {"at": s.last_changed.isoformat(timespec="minutes"), "state": clean(s.state, 40)}
        for s in reversed(states.get(entity_id, []))
    ]


async def list_situations(ctx: ToolContext, args: dict[str, Any]) -> Any:
    engine = ctx.rt.module("situations")
    return [
        {
            "situation_id": s.id,
            "title": clean(s.title(ctx.rt.language), 120) if ctx.privacy.level != "minimal" else s.kind,
            "kind": s.kind,
            "severity": s.severity,
            "category": s.category,
            "who": s.assessment.get("who"),
            "acknowledged": s.acked_at is not None,
            "repair": s.repair.get("status"),
        }
        for s in engine.open()
    ]


async def get_situation(ctx: ToolContext, args: dict[str, Any]) -> Any:
    engine = ctx.rt.module("situations")
    s = engine.get(str(args.get("situation_id") or ""))
    if s is None:
        return {"error": "not_found"}
    from .missions.triage import situation_text

    out: dict[str, Any] = {"text": situation_text(ctx.rt, s, ctx.privacy)}
    if ctx.privacy.level != "minimal":  # history and reasons carry real names
        out["history"] = [
            {"at": h.get("ts"), "event": clean(h.get("event", ""), 40), "text": clean(h.get("text", ""), 200)}
            for h in s.history[-15:]
        ]
        out["assessment"] = {k: _clean_value(v) for k, v in s.assessment.items()}
    return out


async def get_journal(ctx: ToolContext, args: dict[str, Any]) -> Any:
    if ctx.privacy.level == "minimal":
        return {"error": "not_available_with_minimal_privacy"}
    return [
        {"at": e["ts"], "kind": e["kind"], "text": clean(e["text"], 200)}
        for e in ctx.rt.journal.recent(int(args.get("limit") or 20))
    ]


async def get_system_log(ctx: ToolContext, args: dict[str, Any]) -> Any:
    """Log lines are text from anywhere (integrations, devices, the network): cleaned like every other data, and
    not sent at all with minimal privacy (they name devices, people and addresses)."""
    hub = ctx.rt.module("signals")
    if hub is None:
        return {}
    if ctx.privacy.level == "minimal":
        return {"error": "not_available_with_minimal_privacy"}
    return {
        "log": [_clean_value(item) for item in hub.system.log[:20]],
        "failed_automations": [_clean_value(item) for item in hub.system.traces[:20]],
    }


def _clean_value(value: Any, limit: int = 300) -> Any:
    if isinstance(value, dict):
        return {clean(k, 60): _clean_value(v, limit) for k, v in list(value.items())[:20]}
    if isinstance(value, (list, tuple)):
        return [_clean_value(v, limit) for v in value[:20]]
    if isinstance(value, (bool, int, float)) or value is None:
        return value
    return clean(value, limit)


async def get_plan(ctx: ToolContext, args: dict[str, Any]) -> Any:
    scheduler = ctx.rt.module("scheduler")
    now = dt_util.utcnow()
    days = max(1, min(int(args.get("days") or 7), 60))
    return [
        {
            "at": dt_util.as_local(t).isoformat(timespec="minutes"),
            "entry_id": e["id"],
            "title": clean(e["title"], 120) if ctx.privacy.level != "minimal" else "plan entry",
        }
        for t, e in scheduler.occurrences(now, now + timedelta(days=days))
    ][:100]


async def get_heating(ctx: ToolContext, args: dict[str, Any]) -> Any:
    """Thermostats that speak the schedule contract: week, overrides (with HomeAI's reasons), optional estimate."""
    module = ctx.rt.module("thermostats")
    if module is None:
        return {"error": "heating is not available"}
    temperature = args.get("temperature")
    try:
        temperature = float(temperature) if temperature is not None else None
    except TypeError, ValueError:
        return {"error": "temperature must be a number"}
    entity_id = args.get("entity_id") or None
    if entity_id and not ctx.privacy.allowed(str(entity_id)):
        return {"error": "not allowed"}
    out = []
    for item in await module.overview(entity_id, temperature):
        if not ctx.privacy.allowed(item["entity_id"]):
            continue
        item["name"] = ctx.privacy.entity_name(item["entity_id"])
        item["rooms"] = [{"area": ctx.privacy.area(r["area"]), "roles": r["roles"]} for r in item["rooms"]]
        if ctx.privacy.level == "minimal":  # reasons name people and rooms
            for override in [*item["homeai_overrides"], *((item.get("schedule") or {}).get("overrides") or [])]:
                override.pop("reason", None)
        out.append(_clean_value(item, 200))
    return out


# ——— Changing (through the executor) ———
async def _execute(ctx: ToolContext, request: ActionRequest, confirmation_id: Any = None) -> dict[str, Any]:
    """Run an action for a tool. A model can never confirm on the person's behalf: `confirmed` is set only when a
    confirmation code is redeemed after the person's own yes (see actions/confirmations.py)."""
    person = ctx.actor == "person"
    request.actor = "person" if person else "ai"
    request.user_id = ctx.user_id if person else None
    request.situation_id = request.situation_id or ctx.situation_id
    request.confirmed = False
    executor = ctx.rt.module("executor")
    if person and confirmation_id:
        request.confirmed = executor.confirmations.redeem(
            str(confirmation_id),
            executor.fingerprint(request),
            user_id=ctx.user_id,
            conversation_id=ctx.conversation_id,
            turn=ctx.turn,
            said=ctx.said,
            lang=ctx.rt.language,
        )
    result = await executor.execute(request)
    record = {"what": executor.describe(request), **result.as_dict()}
    out: dict[str, Any] = {"status": result.status, "risk": result.risk, "message": result.message}
    if result.status == "needs_confirmation" and person:
        if ctx.turn is not None:
            out["confirmation_id"] = executor.confirmations.issue(
                executor.fingerprint(request), user_id=ctx.user_id, conversation_id=ctx.conversation_id, turn=ctx.turn
            )
        elif result.risk < Risk.R6 and (approvals := ctx.rt.module("approvals")) is not None:
            # no conversation to ask in: the person confirms with Approve on their phone or in the panel
            decision = Decision(Verdict.ASK, Risk(result.risk), "person_confirm", approver="requester")
            item = await approvals.create(request, decision, executor.describe(request))
            out.update(status="pending_approval", approval_id=item["id"])
            record.update(status="pending_approval", approval_id=item["id"])
    ctx.actions.append(record)
    if result.approval_id:
        out["approval_id"] = result.approval_id
    if result.data is not None:
        out["data"] = result.data
    return out


async def call_service(ctx: ToolContext, args: dict[str, Any]) -> Any:
    domain, _, service = str(args.get("service") or "").partition(".")
    return await _execute(
        ctx,
        ActionRequest(
            domain,
            service,
            dict(args.get("data") or {}),
            entity_ids=list(args.get("entity_ids") or []),
            reason=str(args.get("reason") or ""),
        ),
        args.get("confirmation_id"),
    )


async def edit_config(ctx: ToolContext, args: dict[str, Any]) -> Any:
    return await _execute(
        ctx,
        ActionRequest(
            "config",
            str(args.get("operation") or ""),
            dict(args.get("data") or {}),
            reason=str(args.get("reason") or ""),
        ),
        args.get("confirmation_id"),
    )


async def add_to_plan(ctx: ToolContext, args: dict[str, Any]) -> Any:
    from ..schedule.scheduler import PlanError

    raw = {k: v for k, v in args.items() if k in ("title", "when", "reminder", "to", "skip_when_away", "action")}
    try:
        # asked through a model: no confirmation can be given here, so only what needs none may be planned
        entry = await ctx.rt.module("scheduler").save(
            raw, ctx.user_id if ctx.actor == "person" else None, through_assistant=True
        )
    except PlanError as err:
        return {"error": str(err)}
    ctx.actions.append({"what": f"plan: {entry['title']}", "status": "done"})
    return {"entry_id": entry["id"], "title": entry["title"]}


async def watch(ctx: ToolContext, args: dict[str, Any]) -> Any:
    """“Tell me when …”: only for a person in a conversation; the message goes to that person alone."""
    from ..schedule.commitments import CommitmentError

    commitments = ctx.rt.module("commitments")
    if ctx.actor != "person" or commitments is None:
        return {"error": "not_allowed"}
    try:
        item = commitments.add(
            ctx.user_id,
            str(args.get("entity_id") or ""),
            str(args.get("condition") or ""),
            args.get("value"),
            str(args.get("message") or ""),
            args.get("hours"),
        )
    except CommitmentError as err:
        return {"error": str(err)}
    ctx.actions.append({"what": commitments.describe(item), "status": "done"})
    return {"watch_id": item["id"], "expires": item["expires"]}


async def handle_situation(ctx: ToolContext, args: dict[str, Any]) -> Any:
    engine = ctx.rt.module("situations")
    sid, action = str(args.get("situation_id") or ""), args.get("action")
    who = "HomeAI"
    if ctx.user_id:
        who = next((p.name for p in ctx.rt.world.persons.values() if p.user_id == ctx.user_id), who)
    if action == "acknowledge":
        s = await engine.acknowledge(sid, who)
    elif action == "handle":
        s = await engine.handle(sid, who)
    elif action == "snooze":
        s = await engine.snooze(sid, int(args.get("minutes") or 60), who)
    elif action == "dismiss" and ctx.actor == "person":
        s = await engine.dismiss(sid, who)
    else:
        return {"error": "not_allowed"}
    return {"done": s is not None}


async def remember(ctx: ToolContext, args: dict[str, Any]) -> Any:
    memory = ctx.rt.module("memory")
    if memory is None:
        return {"error": "memory_off"}
    scope = "home"
    if args.get("about_me") and ctx.user_id:
        person = next((p for p in ctx.rt.world.persons.values() if p.user_id == ctx.user_id), None)
        scope = f"person:{person.entity_id}" if person else "home"
    # A fact about the whole home reaches everyone's conversations: it counts as said by a person (approved at once)
    # only when a resident said it. Guests, unknown speakers and missions leave a proposal for the residents.
    own = scope != "home" or ctx.rt.presence.resident_user(ctx.user_id)
    source = "person" if ctx.actor == "person" and own else "ai"
    fact = memory.add(ctx.privacy.restore(str(args.get("fact") or "")), scope=scope, source=source, author=ctx.user_id)
    return {"remembered": fact["text"], "approved": fact["approved"]}


async def recall(ctx: ToolContext, args: dict[str, Any]) -> Any:
    memory = ctx.rt.module("memory")
    if memory is None:
        return []
    person = next((p for p in ctx.rt.world.persons.values() if ctx.user_id and p.user_id == ctx.user_id), None)
    scopes = ["home", *([f"person:{person.entity_id}"] if person else [])]  # never another person's facts
    facts = [
        f
        for f in memory.search(str(args.get("words") or ""), limit=50)
        if not f["scope"].startswith("person:") or f["scope"] in scopes
    ][:10]
    return [{"fact": clean(f["text"], 300), "scope": f["scope"].split(":", 1)[0]} for f in facts]


TOOLS: dict[str, Tool] = {
    t.name: t
    for t in (
        Tool(
            "find_entities",
            "Find entities by words in their name, by area or by domain.",
            _obj({"query": STR, "area": STR, "domain": STR, "limit": {"type": "integer"}}),
            find_entities,
        ),
        Tool(
            "get_states",
            "Current state and key attributes of entities.",
            _obj({"entity_ids": STRS}, ["entity_ids"]),
            get_states,
        ),
        Tool(
            "get_history",
            "State changes of one entity over the last hours (up to 168).",
            _obj({"entity_id": STR, "hours": {"type": "integer"}}, ["entity_id"]),
            get_history,
        ),
        Tool("list_situations", "Open situations HomeAI is tracking.", _obj({}), list_situations),
        Tool(
            "get_situation",
            "Details of one situation: signals, entities, history, assessment.",
            _obj({"situation_id": STR}, ["situation_id"]),
            get_situation,
        ),
        Tool(
            "get_journal",
            "Recent entries of HomeAI's journal (what happened and what HomeAI did).",
            _obj({"limit": {"type": "integer"}}),
            get_journal,
        ),
        Tool(
            "get_system_log",
            "Recent errors in Home Assistant's log and automations whose last run failed.",
            _obj({}),
            get_system_log,
        ),
        Tool("get_plan", "Upcoming entries of the home's plan.", _obj({"days": {"type": "integer"}}), get_plan),
        Tool(
            "get_heating",
            "Thermostats with a weekly schedule: their blocks (days, time, preset or temperature), overrides for a "
            "while (from people, automations or HomeAI, with reasons) and room roles. With temperature: how many "
            "minutes they need to reach it. A temperature or preset you set lasts until the thermostat's next block; "
            "an override (service <domain>.add_override with end) lasts until its end.",
            _obj({"entity_id": STR, "temperature": {"type": "number"}}),
            get_heating,
        ),
        Tool(
            "call_service",
            "Run a Home Assistant action (service) through HomeAI's policy. The result status is done, unverified, "
            "needs_confirmation (ask the person and end your turn; when they answer yes in their next message, call "
            "the same action again with the confirmation_id you got), pending_approval (someone was asked, possibly "
            "the person on their phone), observed (HomeAI is only observing), denied or failed. Never say something "
            "was done unless the status is done or unverified.",
            _obj(
                {
                    "service": STR,
                    "entity_ids": STRS,
                    "data": {"type": "object"},
                    "reason": STR,
                    "confirmation_id": STR,
                },
                ["service", "reason"],
            ),
            call_service,
            changes=True,
        ),
        Tool(
            "edit_config",
            "Change Home Assistant configuration through its editors: operation is one of automation_get/save/delete, "
            "script_get/save/delete, scene_get/save/delete (data: id, config), helper_list/save/delete (data: domain, "
            "item_id, fields), label_save, area_save, dashboard_get/save. Saves need an administrator; deletions are "
            "destructive.",
            _obj(
                {"operation": STR, "data": {"type": "object"}, "reason": STR, "confirmation_id": STR},
                ["operation", "data", "reason"],
            ),
            edit_config,
            changes=True,
        ),
        Tool(
            "add_to_plan",
            "Add an action or a reminder to the home's plan. when: {kind: once|daily|weekly|sun, time: HH:MM, date, "
            "days: [0-6, Monday is 0], event: sunrise|sunset, offset: minutes}. Either action {service, entity_ids, "
            "data} or reminder (text).",
            _obj(
                {
                    "title": STR,
                    "when": {"type": "object"},
                    "reminder": STR,
                    "to": STR,
                    "skip_when_away": {"type": "boolean"},
                    "action": {"type": "object"},
                },
                ["when"],
            ),
            add_to_plan,
            changes=True,
        ),
        Tool(
            "watch",
            "Tell the speaker when an entity meets a condition (“tell me when the washing machine is done”): "
            "condition is state, not_state, above, below or changes; value for all but changes; message is what "
            "to say then; hours until it expires.",
            _obj(
                {
                    "entity_id": STR,
                    "condition": {"type": "string", "enum": ["state", "not_state", "above", "below", "changes"]},
                    "value": STR,
                    "message": STR,
                    "hours": {"type": "number"},
                },
                ["entity_id", "condition"],
            ),
            watch,
        ),
        Tool(
            "handle_situation",
            "Acknowledge, take, snooze or (for people) dismiss a situation.",
            _obj(
                {
                    "situation_id": STR,
                    "action": {"type": "string", "enum": ["acknowledge", "handle", "snooze", "dismiss"]},
                    "minutes": {"type": "integer"},
                },
                ["situation_id", "action"],
            ),
            handle_situation,
            changes=True,
        ),
        Tool(
            "remember",
            "Remember a fact or preference a person told you (about_me: it concerns the speaker).",
            _obj({"fact": STR, "about_me": {"type": "boolean"}}, ["fact"]),
            remember,
            changes=True,
        ),
        Tool("recall", "Look up remembered facts and preferences by words.", _obj({"words": STR}), recall),
    )
}

READ_TOOLS = (
    "find_entities",
    "get_states",
    "get_history",
    "list_situations",
    "get_situation",
    "get_journal",
    "get_system_log",
    "get_plan",
    "recall",
    "get_heating",
)
SETS = {
    "p1": READ_TOOLS[:5],
    "investigate": (*READ_TOOLS, "call_service"),
    "chat": tuple(TOOLS),
}
SETS["chat_read"] = (*READ_TOOLS, "remember", "watch")
SETS["chat_act"] = tuple(name for name in SETS["chat"] if name != "edit_config")
SETS["chat_act_config"] = SETS["chat"]


async def run_tool(
    ctx: ToolContext, name: str, args: dict[str, Any] | None, allowed: tuple[str, ...] | None = None
) -> tuple[str, bool]:
    """Run a tool; returns (JSON text, is_error). Errors are returned to the model, never raised.

    `allowed` is the set the model was offered: a name outside it is refused even when the tool exists, so a
    read-only conversation or mission cannot act by calling a tool it was never given."""
    tool = TOOLS.get(name)
    if tool is None or (allowed is not None and name not in allowed):
        return json.dumps({"error": f"unknown tool {name}"}), True
    if args is None:
        return json.dumps({"error": "the arguments were not valid JSON; call the tool again"}), True
    try:
        result = await tool.handler(ctx, args if isinstance(args, dict) else {})
    except Exception as err:
        return json.dumps({"error": clean(str(err), 300)}), True
    text = json.dumps(result, ensure_ascii=False, default=str)
    if len(text) > MAX_RESULT:
        text = text[:MAX_RESULT] + "…(truncated)"
    is_error = isinstance(result, dict) and "error" in result
    return text, is_error
