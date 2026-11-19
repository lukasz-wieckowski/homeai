# Risk policy

One policy decides every change HomeAI makes, whoever asks: a person (panel, conversation, LLM API), HomeAI's
own autonomy, the plan, repair playbooks or an AI tier.

## Classes

| Class | Examples | HomeAI on its own (default) | When a person asks |
|---|---|---|---|
| R0 read | states, history, logs, traces | yes | yes |
| R1 comfort | lights, scenes, fans, media, messages | act and tell (after the observation period) | yes |
| R2 devices | switches and appliances, covers, heating and cooling targets, vacuum | propose and ask | yes, or ask to confirm (setting) |
| R3 system | reload an integration, restart an add-on or a bridge, retry a backup | only from repair playbooks, within a daily limit (after the observation period) | administrators |
| R4 configuration | automations, scripts, scenes, helpers, dashboards, labels, areas | propose; an administrator approves | administrators, with confirmation |
| R5 security | locks, alarm panels, garage doors and gates, cameras, sirens | never, except protective actions | with confirmation |
| R6 destructive | deleting configuration, restarting Home Assistant, purging the recorder | never | administrators, with confirmation |

The class comes from the domain and service, then the device class (a garage or gate cover is R5; a restart
button is R3), then the device a control belongs to: a number, select, switch, button or text entity is never
lighter than its device's main entity (a thermostat's valve position counts as the thermostat, a lock's relay or
auto-relock time as the lock), and a device's configuration entities are at least R2. A call is judged by
everything it changes: `scene.apply` and turning on a scene take the class of the entities inside them, and an
integration's own service on another domain's entity (a lock's user codes through `zwave_js`) is never lighter
than that entity. Services HomeAI knows nothing about and that name no entity are R3; shell commands, scripts in
Python and `conversation.process` are R4, because they can do anything. HomeAI's own switches, selects and
numbers are its settings (R4). Administrators can change it at three levels, each more specific than the last:

1. *Risk class by action*: a class for a whole domain (`switch`) or one action (`script.turn_on`).
2. *Risk class by label*: a class for everything with a label; with several labels the highest wins.
3. *Risk class* per entity, device, area or floor.

When an action targets several entities the highest class counts. Targets are resolved the way Home Assistant
resolves a service call — entities, devices, areas, floors and labels, groups expanded, every entity counted even
if HomeAI does not watch it — and the action then runs on exactly that list. A target with nothing behind it, and
`entity_id: all`, are refused.

## Autonomy levels

For R1–R4 each class has a level: *never*, *only observe* (journal only), *propose and ask* (an approval
request), *act and tell*, *act*. During the observation period (default 14 days after installation) R1–R3
autonomy only observes, system repairs included; set the period to 0 to let HomeAI act at once. An automatic action that people undo too often goes back to *propose*; a request that
was refused is not asked again for a while.

The **autonomy slider** (`select.homeai_autonomy`) moves every level at once: *only observe*, *cautious* (at most
propose, system repairs still run), *balanced* (the levels as set) and *bold* (comfort and device actions run).

The **actor × class matrix** gives one actor its own level for a class: HomeAI's own rules, AI, repairs or the
plan (settings *AI: devices (R2)* and so on, *As the class* by default). For example AI may only propose device
actions while HomeAI's own rules act on them. Plan entries normally run up to the class their author approved;
a level set for the plan in the matrix applies on top of that. The slider still applies to every actor.

## People

Actions requested by people run in their own Home Assistant account, so its permissions apply. Requests without
a user (for example a voice satellite) may only read and run comfort actions. Reading automations, scripts or
dashboards through HomeAI is for administrators only.

**Confirmation comes from the person, never from a model.** When an action needs the person's explicit yes, a
conversation with HomeAI gets a one-time code bound to that person, that conversation and exactly that action
(service, data and every entity it reaches). The code works only in the person's *next* message, only if that
message is itself a short, plain yes, and only once; it expires after ten minutes. A model cannot confirm in the
same turn, and text from devices, logs or calendars cannot stand in for the person. Other assistants that use
HomeAI's tools cannot confirm at all: the action becomes an approval addressed to the person, who confirms it with
*Approve* on their phone or in the panel.

## Approvals

Approval requests go to the panel, a persistent notification and phones with *Approve* and *Deny*. Residents may
approve R1–R2; administrators approve R3 and above. Requests expire (default two hours). The arbiter (P3) may
approve or refuse up to R3 only when the administrator allows it; for higher classes it adds a recommendation. A
person's own request always waits for a person: when an administrator approves it, it runs once, in the
administrator's account.

## Protective actions

Entities labelled *HomeAI: protective action* may receive safe-direction services even when they are security
devices: close a valve, turn off a switch or heating, lock, close a cover, arm an alarm, turn on ventilation.
On a leak, gas, smoke or carbon monoxide alarm HomeAI runs them at once (preferring the alarm's area) and tells
people at the same time.

## Audit

Every decision and action is in HomeAI's journal; actions that ran are also in the logbook with the `HomeAI` user
or the person as the author, and fire `homeai_action`.
