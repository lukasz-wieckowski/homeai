# Integrating with HomeAI

Other integrations and automations can talk to HomeAI through stable contracts.

## Report signals

**Service** `homeai.report_signal`: `id`, `title`, optional `description`, `severity` 0–4, `category` (safety,
security, damage, system, energy, comfort, maintenance, info), `need` (nobody, member, admin, service),
`entities`, `group` (signals with the same group form one situation), `expires_minutes`. `homeai.clear_signal`
with the same `id` clears it.

**Entity attribute** `homeai_signals`: any entity may expose a list of
`{id, title, severity, category?, description?, need?, group?}`; HomeAI reads it on every evaluation and
removes signals that disappear from the list.

## Events

| Event | When | Data |
|---|---|---|
| `homeai_situation` | situation lifecycle | `event` (opened, updated, escalated, acknowledged, snoozed, handled, dismissed, resolved), `id`, `kind`, `category`, `severity`, `title`, `who`, `entities` |
| `homeai_notification` | a ladder step with the `event` channel, and when it is cleared | `situation_id`, `title`, `message`, `severity`, `category`, `kind`, `state` (active, cleared), `critical` |
| `homeai_action` | every action HomeAI ran, refused or observed | `action_id`, `status`, `risk`, `what`, `actor`, `situation_id`, `entities` |
| `homeai_approval` | approval requests and decisions | `id`, `status`, `what`, `risk` |

The same lifecycle is available as `event.homeai_situation` and `event.homeai_notification` entities.

## Calendars

- `calendar.homeai_plan`: the home's plan. Create an event to add a reminder; delete an occurrence to skip it.
  It also shows what other integrations plan (below).
- `calendar.homeai_presence`: trips, guests, working from home, sickness. Create events from any calendar UI;
  the title picks the kind (“Vacation Anna”, “Goście”). Heating or other integrations can read it with a
  calendar trigger.

## Publish your plans

**Entity attribute** `homeai_plan`: any entity may expose a list of `{start, title, end?}` (ISO times; up to 50).
HomeAI shows these in `calendar.homeai_plan` and in the panel's plan next to its own entries, so people see
everything the house will do in one place. HomeAI never runs them; your integration does. Setting *Plans from
other integrations* turns this off.

```yaml
homeai_plan:
  - start: "2026-11-12T22:00:00+01:00"
    end: "2026-11-13T00:30:00+01:00"
    title: "Dishwasher: eco program"
```

## Thermostat schedule contract

A heating integration lets HomeAI work with its thermostats' schedules by speaking this contract (version 1).
HomeAI then sets overrides for a while from presence by itself (by its policy) and proposes changes of the weekly
schedule, which an administrator approves. Heat Zones (`heat_zones`) speaks it; any integration can.

**Announce it** with an attribute on the `climate` entity:

```yaml
homeai_schedule:
  version: 1
  domain: heat_zones   # the domain of the services below
```

**Services** in that domain, each with a target on the climate entity (`entity_id`):

| Service | Fields | Response |
|---|---|---|
| `add_override` | `end` (required, ISO time), `start` (optional, now when left out), exactly one of `preset_mode` / `temperature`, `reason` (up to 200 characters), `source`, `override_id` (optional: an override with this id is replaced) | `{override_id}` |
| `remove_override` | `override_id` or `source` | — |
| `get_schedule` | — | `{<entity_id>: {enabled, weekly: [{days, time, preset_mode \| temperature}], overrides: [...]}}` |
| `set_schedule` | `weekly`: the whole week, blocks as in `get_schedule` | — |
| `estimate` | `temperature` | `{<entity_id>: {minutes \| null, confidence}}` |

- `weekly` is a list of blocks `{days: [mon, tue, wed, thu, fri, sat, sun], time: "HH:MM", preset_mode | temperature}`.
  A block lasts until the next one.
- `overrides` lists `{override_id, start, end, preset_mode | temperature, reason, source}`.
- An override takes precedence over the weekly schedule from `start` to `end`, then ends on its own.
- A temperature or preset set with the usual `climate` services is a manual change that lasts until the next
  block, as on any programmable thermostat.
- `add_override` should accept being called without asking for a response (`SupportsResponse.OPTIONAL`), so
  automations can use it too; HomeAI asks for the response only when the service requires it.
- **Open end** (extension `open_end`): `add_override` also accepts `open_end: true`. The end is then only a horizon
  the caller renews while its reason lasts and removes when the reason goes, so the thermostat must not heat ahead
  towards it (an override always wins for its whole time; after it is removed the schedule simply resumes). HomeAI
  sends it with its open-ended overrides (nobody home, vacation mode, activity), and only to thermostats that list
  `open_end` in `homeai_schedule.features`. Overrides with a real end (a trip, guests) leave it out, so the thermostat
  can heat up in time for the end.
- Between an override and a person's manual change the newer instruction wins. An override sent again **unchanged**
  (same start, end and value) keeps its age; one sent with other times or another value is a new instruction.
- The thermostat's own changes (schedule blocks, heating ahead, the end of an override) are written with a fresh
  context, without a user or a parent; a change somebody asked for carries the caller's context.

**Optional attributes** HomeAI uses when they are there:

| Attribute | Meaning |
|---|---|
| `homeai_schedule.areas` | the area ids the thermostat heats (a zone of several rooms, or a device without an area) |
| `homeai_schedule.features` | optional contract extensions the thermostat understands, e.g. `["open_end"]` |
| `source` | where the current target comes from: `schedule`, `override`, `hold` (a manual change until the next block), `manual` (the schedule is off), `preheat` |
| `preset_temperatures` | what each preset means in °C, e.g. `{comfort: 21, eco: 18}` |

**How HomeAI uses it**

- **Policy.** `get_schedule` and `estimate` are R0. `add_override` and `remove_override` are R2, like any change of
  the thermostat: HomeAI sets its overrides by the autonomy level for R2, only observes them during the observation
  period, and people approve them when the level is *propose and ask*. `set_schedule` is configuration, at least R4
  whatever labels or overrides say: HomeAI only proposes a new week and an administrator approves it.
- **Its overrides** carry `source: homeai`, a reason people can read (“Vacation”, “Guests”, “Nobody home”) and a stable
  `override_id` per reason and thermostat, so HomeAI replaces, renews and removes them after a restart. An
  override never reaches more than 30 days ahead: a longer trip is sent in pieces and renewed. HomeAI
  removes its override when the reason is gone (the trip was cancelled, someone came home). When a person removes
  HomeAI's override on the thermostat, HomeAI does not set it again for the same reason and treats it like an undo.
  When a person changes the thermostat by hand while HomeAI's override runs, HomeAI no longer renews or moves it (that
  would be a newer instruction than theirs): the override runs out, and HomeAI still removes it when the reason goes.
- **Reasons**: a household trip or every resident's own trip at once (`away`), guests (common spaces), working from
  home (the person's workplace), sickness (the whole home), nobody home for a while (`eco`, until someone is back),
  vacation mode, and activity in a room (an entity labelled *HomeAI: activity*). Presets and timings are settings
  (section *Heating*). Calendar reasons are sent ahead (*Send overrides ahead*), so the thermostat can heat up in
  time; reasons without a known end (nobody home, vacation mode, activity) run a few hours ahead, are renewed, and
  carry `open_end` where the thermostat supports it.
- **Rooms.** The thermostat's rooms come from `homeai_schedule.areas` (`{version: 1, domain: …, areas: [living_room,
  kitchen]}`), else from its entity or device area.
- **Valve limit.** For activity, HomeAI can lower a valve limit instead of setting an override: a `number` of the
  thermostat's device whose translation key is `valve_limit` (or whose id ends with `_valve_limit`, or the entity
  in the setting *Valve-limit entity*). HomeAI puts the previous value back afterwards.
- **Proposals.** HomeAI notices people changing the target by hand before a block that would do the same (warming
  up earlier, going to sleep earlier) on most workdays or weekend days, and proposes moving that block with
  `set_schedule`. Manual changes are told apart by the `source` attribute when the thermostat has one (`hold` or
  `manual`, also a turn of the knob), else by the change's context: a person's account, or an automation a button or
  remote started. What a preset means comes from `preset_temperatures`, else from what the thermostat showed. A proposal is withdrawn when the
  thermostat's week changes before it is approved.
- **Plan and signals.** Publish the next 36 hours of the schedule and overrides as `homeai_plan` and the zone's
  problems as `homeai_signals` (both above); HomeAI shows them in `calendar.homeai_plan` and handles the signals as
  situations.
- **Reading.** The AI tool `get_heating` reads the week, the overrides with their reasons, the room roles and, with
  a temperature, the estimate.

## “Tell me when”

**Service** `homeai.watch`: `entity_id`, `condition` (state, not_state, above, below, changes), `value`,
`message`, `hours`. HomeAI tells the calling person once when the entity meets the condition, then stops. People
can ask the same in a conversation (“tell me when the washing machine is done”); the panel's plan lists what is
being watched.

## Blueprints

`blueprints/automation/homeai/` contains:

- **notification_to_awtrix.yaml**: show HomeAI notifications on an AWTRIX clock over MQTT.
- **notification_to_notify.yaml**: send HomeAI notifications to any notify entity (a TV, a tablet, a display).

## LLM API

Select the **HomeAI** API in any conversation agent to let it read situations, the plan and states, and act through
HomeAI's policy in the speaking person's account.
