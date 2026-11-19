"""The policy: may this action run now, does it need someone's approval, or is it refused?

Actors:
- `person`: a resident asked for it; it runs in their Home Assistant user context, so HA permissions apply.
  R0–R1 run; R2 runs or asks the person to confirm (`policy.person_r2`); R3–R4 need an administrator;
  R5 needs the person's explicit confirmation; R6 needs an administrator's explicit confirmation.
- `homeai` (autonomy), `ai`, `repair`, `schedule`: run as the HomeAI user. Each class has a level
  (`policy.autonomy_r1` … `policy.autonomy_r4`): never → observe → propose → act and tell → act.
  R5 and R6 are never autonomous, except protective actions on entities the administrator labelled.
  Repairs may only run R3 actions from playbooks, within the daily limit. Schedule entries run up to the
  class their author approved. During the first `policy.observation_days` autonomy only observes (R1–R3,
  repairs included; set the period to 0 to start acting at once).
  The actor × class matrix (`policy.actor_<actor>_r<n>`) gives one actor its own level for a class, e.g. AI
  only proposes device actions while HomeAI's own rules act on them; schedule entries then follow that level.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import datetime, timedelta
from enum import StrEnum
from typing import Any

from homeassistant.util import dt as dt_util

from .risk import Risk, carried_entities, classify, is_protective

ACTORS = ("person", "homeai", "ai", "repair", "schedule")
MATRIX_ACTORS = ("homeai", "ai", "repair", "schedule")  # actors with their own row in the actor × class matrix
LEVELS = ("never", "observe", "propose", "act_tell", "act")


class Verdict(StrEnum):
    ALLOW = "allow"  # run now
    CONFIRM = "confirm"  # the requesting person must confirm explicitly
    ASK = "ask"  # someone else must approve (residents for R1–R2, administrators for R3+)
    OBSERVE = "observe"  # record what would have been done, do nothing
    DENY = "deny"


@dataclass(slots=True)
class ActionRequest:
    domain: str
    service: str
    data: dict[str, Any] = field(default_factory=dict)
    entity_ids: list[str] = field(default_factory=list)
    actor: str = "homeai"
    user_id: str | None = None
    reason: str = ""
    situation_id: str | None = None
    playbook: str | None = None
    approved_risk: int | None = None  # schedule entries: the class approved by their author
    # The person confirmed (R5/R6, or R2 when asked). Set only from a person's own act: a button in the panel, the
    # requester's approval, or a confirmation code redeemed in a later message of theirs — never from a model.
    confirmed: bool = False
    approved_by: str | None = None  # an approval was granted (the approver's name, for the journal)
    approved_by_user: str | None = None  # the Home Assistant user who granted it (people's approvals)
    dry_run: bool = False
    # Start the service and do not wait for it to finish (a backup takes longer than any sensible timeout); the
    # result is then judged by what follows, not by the call.
    background: bool = False

    def as_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, d: dict[str, Any]) -> ActionRequest:
        return cls(**{k: v for k, v in d.items() if k in cls.__dataclass_fields__})


@dataclass(slots=True)
class Decision:
    verdict: Verdict
    risk: Risk
    reason: str
    approver: str | None = None  # "residents" or "admins" when verdict is ASK
    tell: bool = False  # notify people after acting (level act_tell, protective actions)
    protective: bool = False

    def as_dict(self) -> dict[str, Any]:
        return {
            "verdict": str(self.verdict),
            "risk": int(self.risk),
            "reason": self.reason,
            "approver": self.approver,
            "tell": self.tell,
            "protective": self.protective,
        }


class Policy:
    def __init__(self, runtime: Any) -> None:
        self.rt = runtime
        self._repairs_today: tuple[str, int] = ("", 0)

    async def async_setup(self) -> None:
        return None

    async def async_unload(self) -> None:
        return None

    # ——— Classification ———
    def risk(self, request: ActionRequest) -> Risk:
        risk = classify(
            request.domain, request.service, request.entity_ids, world=self.rt.world, settings=self.rt.settings
        )
        carried = carried_entities(self.rt.hass, request.domain, request.service, request.data, request.entity_ids)
        if carried:
            inside = classify("homeassistant", "turn_on", carried, world=self.rt.world, settings=self.rt.settings)
            risk = max(risk, inside)
        return risk

    def observing(self, now: datetime | None = None) -> bool:
        days = int(self.rt.settings.get("policy.observation_days"))
        installed = dt_util.parse_datetime(self.rt.installed_at) if self.rt.installed_at else None
        if not days or installed is None:
            return False
        return (now or dt_util.utcnow()) < installed + timedelta(days=days)

    def level(self, risk: Risk, actor: str | None = None) -> str:
        """The level for a class, or for one actor when the actor × class matrix sets one; then the slider."""
        if risk == Risk.R0:
            return "act"
        if risk >= Risk.R5:
            return "never"
        level = self.actor_level(risk, actor) or str(self.rt.settings.get(f"policy.autonomy_r{int(risk)}"))
        return slide(level, risk, str(self.rt.settings.get("policy.slider")))

    def actor_level(self, risk: Risk, actor: str | None) -> str | None:
        if actor not in MATRIX_ACTORS or not Risk.R1 <= risk <= Risk.R4:
            return None
        value = str(self.rt.settings.get(f"policy.actor_{actor}_r{int(risk)}"))
        return None if value == "inherit" else value

    # ——— Decision ———
    async def decide(self, request: ActionRequest, now: datetime | None = None) -> Decision:
        risk = self.risk(request)
        if request.actor == "person":
            return await self._person(request, risk)
        return self._autonomous(request, risk, now)

    async def _person(self, request: ActionRequest, risk: Risk) -> Decision:
        user = await self.rt.hass.auth.async_get_user(request.user_id) if request.user_id else None
        if user is None and not request.user_id and risk <= Risk.R1 and request.domain != "config":
            return Decision(Verdict.ALLOW, risk, "anonymous")  # e.g. a voice satellite without a user
        if user is None or not user.is_active:
            return Decision(Verdict.DENY, risk, "no_user")
        admin = user.is_admin
        if request.domain == "config" and risk == Risk.R0 and not admin:
            # reading automations, scripts or dashboards runs through HA's editors, not as the person: admins only
            return Decision(Verdict.DENY, risk, "admin_required")
        if request.approved_by_user and request.approved_by_user != user.id and risk < Risk.R6:
            # an administrator approved this person's request; it then runs in the administrator's context
            approver = await self.rt.hass.auth.async_get_user(request.approved_by_user)
            if approver is not None and approver.is_active and approver.is_admin:
                return Decision(Verdict.ALLOW, risk, "approved", tell=True)
        if risk <= Risk.R1:
            return Decision(Verdict.ALLOW, risk, "person")
        if risk == Risk.R2:
            if self.rt.settings.get("policy.person_r2") == "act" or request.confirmed:
                return Decision(Verdict.ALLOW, risk, "person")
            return Decision(Verdict.CONFIRM, risk, "person_confirm")
        if risk in (Risk.R3, Risk.R4):
            if not admin:
                return Decision(Verdict.ASK, risk, "admin_required", approver="admins")
            return Decision(Verdict.ALLOW if request.confirmed or risk == Risk.R3 else Verdict.CONFIRM, risk, "admin")
        if risk == Risk.R5:
            return Decision(Verdict.ALLOW if request.confirmed else Verdict.CONFIRM, risk, "security_confirm")
        if not admin:
            return Decision(Verdict.DENY, risk, "admin_required")
        return Decision(Verdict.ALLOW if request.confirmed else Verdict.CONFIRM, risk, "destructive_confirm")

    def _autonomous(self, request: ActionRequest, risk: Risk, now: datetime | None) -> Decision:
        world = self.rt.world
        if request.approved_by:
            # an approval was granted: administrators for R3+, any resident for R1–R2; never R6
            if risk >= Risk.R6:
                return Decision(Verdict.DENY, risk, "never_autonomous")
            return Decision(Verdict.ALLOW, risk, "approved", tell=True)
        if risk == Risk.R0:
            return Decision(Verdict.ALLOW, risk, "read")
        if is_protective(request.domain, request.service, request.entity_ids, world) and self.rt.settings.get(
            "policy.protective_actions"
        ):
            return Decision(Verdict.ALLOW, risk, "protective", tell=True, protective=True)
        if risk >= Risk.R5:
            return Decision(Verdict.DENY, risk, "never_autonomous")
        if request.actor == "schedule":
            approved = Risk.parse(request.approved_risk)
            if approved is None or risk > approved:
                return Decision(Verdict.ASK, risk, "schedule_above_approved", approver=_approver(risk))
            if self.actor_level(risk, "schedule") is None:
                return Decision(Verdict.ALLOW, risk, "schedule")
            return self._by_level(self.level(risk, "schedule"), risk)
        if risk == Risk.R3:
            if request.actor != "repair" or not request.playbook:
                return Decision(Verdict.ASK, risk, "system_needs_playbook", approver="admins")
            if not self._repair_budget(now):
                return Decision(Verdict.ASK, risk, "repair_limit", approver="admins")
        level = self.level(risk, request.actor)
        if risk in (Risk.R1, Risk.R2, Risk.R3) and self.observing(now) and level in ("act", "act_tell"):
            level = "observe"  # repairs too: nothing changes in a new home before people have seen HomeAI work
        learning = self.rt.module("learning")
        if level in ("act", "act_tell") and learning is not None and learning.restricted(request):
            level = "propose"  # people undid this too often
        return self._by_level(level, risk)

    @staticmethod
    def _by_level(level: str, risk: Risk) -> Decision:
        if level == "never":
            return Decision(Verdict.DENY, risk, "level_never")
        if level == "observe":
            return Decision(Verdict.OBSERVE, risk, "observing")
        if level == "propose":
            return Decision(Verdict.ASK, risk, "propose", approver=_approver(risk))
        return Decision(Verdict.ALLOW, risk, f"level_{level}", tell=level == "act_tell")

    def _repair_budget(self, now: datetime | None) -> bool:
        today = dt_util.as_local(now or dt_util.utcnow()).date().isoformat()
        day, count = self._repairs_today
        return not (day == today and count >= int(self.rt.settings.get("policy.repairs_per_day")))

    def count_repair(self, now: datetime | None = None) -> None:
        today = dt_util.as_local(now or dt_util.utcnow()).date().isoformat()
        day, count = self._repairs_today
        self._repairs_today = (today, (count if day == today else 0) + 1)

    def diagnostics(self) -> dict[str, Any]:
        return {"observing": self.observing(), "repairs_today": self._repairs_today}


def slide(level: str, risk: Risk, slider: str) -> str:
    """The autonomy slider over the per-class levels: observe caps everything at observing, cautious at proposing
    (system repairs still run), balanced keeps the levels, bold acts on comfort and devices. Never stays never;
    configuration (R4) is never automatic."""
    order = LEVELS
    if level == "never" or slider == "balanced":
        return level
    if slider == "observe":
        cap = "observe"
    elif slider == "cautious":
        cap = "act" if risk == Risk.R3 else "propose"
    else:  # bold
        raised = {Risk.R1: "act", Risk.R2: "act_tell", Risk.R3: "act", Risk.R4: "propose"}[risk]
        return raised if order.index(raised) > order.index(level) else level
    return cap if order.index(level) > order.index(cap) else level


def _approver(risk: Risk) -> str:
    return "residents" if risk <= Risk.R2 else "admins"
