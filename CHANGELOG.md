# Changelog

All notable changes to HomeAI are documented here. The project follows
[Semantic Versioning](https://semver.org/).

## [1.7.1]

### Fixed
- **HomeAI's heating overrides run by themselves**, as designed: an override for a while (trip, guests, working
  from home, an empty home, someone at the desk) and a valve limit at a desk now go through the policy as their own
  actor, *Heating overrides*, whose devices level (`policy.actor_heating_r2`) defaults to *Act*. Before, they used
  HomeAI's general level for devices (*Propose and ask*), so every override waited for a resident's approval. Other
  device actions still ask; a new weekly schedule is still configuration (R4) for an administrator; the observation
  period still only notes. Requests already waiting are withdrawn and carried out once the policy allows them.

## [1.7.0]

Managing HomeAI moves to the places Home Assistant users already know; the *Manage HomeAI* panel is gone.

### Changed
- **Settings are the integration's options**: *Settings → Devices & services → HomeAI → Configure*. The menu lists
  the sections; each is a form generated from the settings registry with a label and a description for every
  setting (labels generated into `translations/*.json` by `scripts/gen_translations.py`), advanced settings in a
  collapsed part, *Detection* split into collapsed parts by what it watches. **Settings for a place** sets values
  for one floor, area, device, entity or person (empty inherits, clearing removes the place's own value). **Undo
  the last change** and **Reset a section to defaults** are menu items. A change that lowers protection asks for
  confirmation first; a setting read only at start reloads HomeAI when saved.
- **Rules are the integration's entries**: *Add rule* on the integration's page, changed with *Reconfigure*,
  removed with *Delete*. The last step shows what the rule covers and what meets it now. Rules apply without a
  reload. The rules of the setting `detectors.custom` are moved to rule entries once (entry version 1.3), and an
  older settings export with rules imports them as rules.
- **Memory is a to-do list**, `todo.homeai_memory`: approved facts are items; add, edit or delete them there. Facts
  about one person stay out of the list (every user sees every list) and remain private.
- **Facts HomeAI noticed and habits it found wait in the inbox** as approval requests (kinds `fact` and `habit`):
  no push and no expiry; a fact about one person is asked of that person. Deciding them elsewhere (the old
  WebSocket commands, the to-do list) settles the request.
- **The journal is in Activity**: entries that matter to people (situations opened and resolved, actions, repairs,
  decisions, approvals, notifications, plan and settings changes) are written to the logbook under HomeAI's device,
  actions in their own context. The journal itself stays for diagnostics and the AI's context.
- **AI**: `number.homeai_ai_budget_daily` joins the monthly budget; the cost sensors carry their budget as an
  attribute. Prompts have their own options page, **AI prompts** (the settings `ai.prompt_*` moved to the section
  `prompts`). The built-in prompts and the last requests to each tier are in the diagnostics.
- **Three panels**: HomeAI (inbox), Home plan and Chat. A stored choice of panels keeps the ones that still exist.
  Old links to `/homeai-manage` or with `?tab=settings|rules|ai` open the integration's page, `?tab=learning` the
  inbox and `?tab=journal` Activity.

### Added
- Services `homeai.export_settings` (response data) and `homeai.import_settings`, for administrators.
- Options-flow sections, the place form, the rule subentry flow and its migration, the to-do list, the journal in
  the logbook and the panels without *Manage* are covered by tests; a test keeps the generated translations in sync.

### Removed
- The *Manage HomeAI* panel and its views (learning, journal, rules, settings, AI) and the unused approvals view;
  the WebSocket command `homeai/rules/save` (rules are subentries). The other WebSocket commands stay for cards.
- The setting `detectors.custom` (now rule entries).

## [1.6.0]

HomeAI's screens are split into panels and read as lists instead of a stack of cards.

### Changed
- **Four panels in the sidebar** instead of one with ten tabs: **HomeAI** (situations and approvals, at `/homeai`,
  where notifications open), **Home plan** (`/homeai-plan`: the plan and presence), **Chat** (`/homeai-chat`) and
  **Manage HomeAI** (`/homeai-manage`: learning, the journal and, for administrators, rules, settings and AI). The new
  setting *Which panels* (`general.panels`) chooses which of them HomeAI adds. Old links with `?tab=` open the
  panel that has that tab now.
- **Approvals are part of the inbox.** Requests waiting for you are at the top of the HomeAI panel, then situations
  that need attention, then those only for your information; recently resolved situations and recent decisions are
  folded at the bottom.
- **Lists, not a card per item.** A group is one surface with a row per item: a severity dot, what, where and when.
  A row opens to show why and the buttons; the inbox no longer shows four buttons under every situation.
  Notifications that open `?situation=<id>` open that row.
- **The plan by day.** What comes next is grouped under Today, Tomorrow and the following days, with the time in its
  own column; a row of the plan's own entries opens to skip it this time or edit the entry. On a wide screen the
  timeline and the entries sit side by side. The journal is grouped by day the same way.
- **Plan entries in people's words.** An action is a thing picked by its name (grouped by kind, with its room) and
  what should happen to it: turn on or off, brightness, open, close, position, temperature, run a scene or a
  script — a slider for the one value, no action names, entity ids or JSON. The name is optional (it is made from the
  action). Actions this editor cannot express stay as a custom action that only an administrator changes.
- **Editors are sheets.** Adding or changing a plan entry, a presence exception or a rule opens a modal sheet above
  the list (from the bottom on a phone) with the fields one under another; removing is in the sheet. Weekdays are
  toggles.
- **Settings**: sections are a list beside the settings on a wide screen and a dropdown on a phone; undo, history,
  export and import moved under the list.
- **Pages for long lists**: situations, approvals, decisions, the plan (15 a page, a month ahead), entries,
  presence, the journal (30 a page of the last 500), learning, memory, rules, settings and their history; the
  part `pager` styles them.
- The chat panel fills the page and keeps the composer at the bottom.
- The situations and plan cards for dashboards use the same rows.
- New variables (`--homeai-reading-width`, `--homeai-section-spacing`, `--homeai-row-padding-x`,
  `--homeai-row-padding-y`, `--homeai-row-hover-background`, `--homeai-dot-size`, `--homeai-scrim-color`) and parts
  (`row`, `row-title`, `row-meta`, `time`, `day`, `button-quiet`, `tab-icon`, `tab-label`) are listed in the README,
  section *Theming*. A chosen weekday is `button-primary`, like a chosen option.

## [1.5.0]

The panel and the cards look like Liquid Glass by default, still made only from Home Assistant's variables, so a
home's theme can restyle every part of it.

### Changed
- **Glass on the navigation layer only.** The top bar, the tabs, the buttons, the chat composer and the editors are
  a translucent, blurred material (`--homeai-glass-*`, tinted with the card colour, blurred with `--ha-space-5`); the
  content (cards, lists, text) stays solid like Home Assistant's cards.
- The top bar and the tabs stay on top while the content scrolls underneath. The tabs are one floating glass capsule
  with the open tab prominent; the settings sections are the same kind of capsule.
- Buttons are glass capsules, the main action is prominent (accent fill, `--ha-box-shadow-s`). They react to the
  pointer and to a press, and show a focus ring for the keyboard.
- The editors of the plan, presence and rules are sheets: glass, rounder (`--ha-border-radius-3xl`), floating higher
  (`--ha-box-shadow-l`). The chat composer is a glass bar holding the field and the send button.
- Reduce transparency and increase contrast make the material solid (with clear edges for contrast), and reduce
  motion stops the animations. Browsers without `color-mix()` get solid theme colours.
- New variables and the parts `segmented`, `sheet` and `composer` are listed in the README, section *Theming*.

## [1.4.0]

Decisions after testing HomeAI on a copy of a real home: critical alerts are for danger to people only, and the
panel and the cards follow the Home Assistant theme, so a home with its own look can restyle them.

### Changed
- **Only safety is critical.** Severity 4 (critical alerts, everyone, repeated every 5 minutes until someone reacts)
  is now reserved for safety matters: a leak, smoke, gas, carbon monoxide and other safety sensors. Every other
  matter stops at urgent (3, one push now, everyone after 15 minutes, no critical alert, no repeating), whatever
  raised it: a detector, presence, the *HomeAI: critical* label, an override, an own rule, another integration's
  signal or an AI tier. A window left open while everyone is away used to become critical (3 from the detector, one
  more for the empty home) and sent critical alerts every 5 minutes; it is now urgent.
- Severity settings of detectors outside safety go from 0 to 3; a stored 4 becomes 3.
- The triage prompt tells the AI that only safety is critical.
- **Theming.** The panel `/homeai` and the cards have no colours, fonts, radii, shadows or spacing of their own any
  more: everything comes from `--homeai-*` variables whose defaults are Home Assistant theme variables (including
  `--ha-card-*`, `--ha-space-*`, `--ha-border-radius-*` and `--ha-font-*`), so they follow the light and dark theme
  and a theme can restyle them. Parts (`::part()`) for what variables cannot change; the panel passes its tabs' parts
  on. Listed in the README, section *Theming*.

### Added
- A preview page (`frontend/preview/`) with example data and Home Assistant's light and dark variables, for looking
  at the panel and the cards without Home Assistant, and a test that keeps fixed styles out of the frontend.

## [1.3.1]

Fixes from testing HomeAI 1.3.0 together with Heat Zones on a copy of a real home.

### Fixed
- The observation period asks nobody: what HomeAI would only propose (R1–R3, its own rules, AI and system actions
  without a playbook) is noted in the journal like everything else, instead of becoming approval requests and
  phone notifications right after installing (#18). *Never* stays never; configuration (R4) is still proposed.
- Open-ended heating overrides (nobody home, vacation mode, activity) no longer make the thermostat heat ahead
  towards their end, which is only a horizon HomeAI renews: they are sent with `open_end: true` to thermostats that
  announce the `open_end` extension in `homeai_schedule.features` (#19, agreed with Heat Zones, heat-zones#2).
- The device registry is iterated instead of being used as a mapping, which Home Assistant reports as deprecated and
  stops supporting in 2027.9 (#20).

## [1.3.0]

HomeAI and heating: thermostats that speak HomeAI's schedule contract keep their own weekly schedule, and HomeAI
changes it for a while from presence and proposes lasting changes.

### Added
- **Thermostat schedule contract** (version 1): a `climate` entity announces `homeai_schedule: {version, domain}` and
  offers `add_override`, `remove_override`, `get_schedule`, `set_schedule` and `estimate` in that domain. Described in
  [docs/integrations.md](docs/integrations.md#thermostat-schedule-contract); Heat Zones speaks it, any integration can.
- **Overrides from presence**, set by HomeAI itself as device actions (R2) by the autonomy level, and only noted during
  the observation period: a household trip or every resident's trip at once and vacation mode → `away`; guests →
  `comfort` in common spaces; working from home → `comfort` at the person's workplace; sickness → `comfort`; nobody
  home for a while → `eco` until someone is back. Each carries `source: homeai`, a reason and a stable id; calendar
  events are sent ahead so rooms warm up in time; open-ended reasons are renewed; a higher reason trims a lower one.
  HomeAI removes its override when the reason is gone and withdraws a request nobody answered yet. An override a
  person removes on the thermostat is not set again for that reason and counts as an undo; after a person changes
  the thermostat by hand, HomeAI no longer renews or moves its override, so their change is not overruled. Long
  reasons are sent at most 30 days ahead and renewed.
- **Activity**: entities labelled *HomeAI: activity* (a desk's power above a threshold, a PC) warm their room with an
  override, or lower the thermostat's valve limit (a `valve_limit` number) and put it back afterwards.
- **Schedule proposals from habits**: when people change a thermostat by hand to what its next block would set, some
  time before that block, on most workdays or weekend days, HomeAI proposes moving the block. Manual changes come
  from the thermostat's optional `source` attribute (also turns of the knob), else from the change's context. A new
  week is configuration (R4): an administrator approves it in *Approvals*, and a proposal is withdrawn and never runs
  when the thermostat's week changed meanwhile.
- **Room roles** in the world model: bedroom, bathroom, common space and workplace, from the setting *Room roles* per
  room, from the labels *HomeAI: bedroom / bathroom / common space / workplace* on a room or on a device in it, or
  from the room's icon and name. AI sees them in its description of the home. A person's *Workplace* is a setting.
- The AI tool `get_heating`: thermostats' weeks, overrides with reasons, room roles and, with a temperature, the
  estimate.
- Settings section *Heating* (19 settings), room-role and activity settings, all in English and Polish.

### Changed
- `set_schedule` on a contract thermostat is at least R4, whatever labels or class overrides say; reading the
  schedule and estimates is R0; overrides are R2.
- A *follow-up* (HomeAI renewing, trimming or removing its own override, putting back a valve limit) runs up to R2
  without a new decision: it continues or undoes what was allowed or approved.
- People's refusals and undo of a thermostat override are remembered per preset: refusing comfort for guests does not
  silence away for a vacation on the same thermostat.
- The executor asks for a response when a service only works with one, and returns it with the result.
- Contract services are not snapshotted for undo (a scene cannot undo an override).
- Approvals can be withdrawn by the module that asked (status *withdrawn*), and modules can check before an approved
  request runs that it still fits.

## [1.2.1]

Fixes from a second review of the whole code.

### Security
- A call is judged by everything it changes. `scene.apply` and turning on a scene take the class of the entities
  inside them (a scene could unlock a door as a comfort action). An integration's own service on another domain's
  entity is never lighter than that entity. Services HomeAI does not know and that name no entity are R3; shell
  commands, Python scripts and `conversation.process` are R4. HomeAI's own setting entities are R4.
- `config.helper_save` can no longer run another WebSocket command through its fields.
- A plan entry asked for through a model (chat, another assistant) holds only what needs no confirmation: up to
  R2 for a known person, R1 for a speaker without an account, who is no longer treated as an administrator.
  Entries of a deleted or deactivated author stop; the plan calendar edits only entries without an author.
- A model can call only the tools it was offered: a read-only conversation or mission cannot act. Other
  assistants get what *What chat may do* allows.
- Reading automations, scripts and dashboards needs an administrator also when the speaker has no account.
- A confirmation code works only in the person's next message, as documented, not in any later one.
- Memory, learning proposals, presence exceptions, undo and skipping plan entries check who is asking; people
  who are not administrators no longer see the raw data of other people's actions.
- An approval is refused when its time ran out or the action became riskier than what was asked about.
- A prompt built for one connection's privacy level is never sent to a stricter connection. `recall` returns only
  the home's and the speaker's facts; a fact about the home from a guest or unknown speaker waits for approval.
  The system log is cleaned like other data and not sent with minimal privacy; *Full* privacy respects private
  areas and the private label.

### Fixed
- A leak, smoke, gas or CO sensor that stops answering while alarming keeps its alarm for an hour. *Not a
  problem* on a safety alarm is silent only while that alarm lasts. Safety alarms do not wait for the startup
  grace period once Home Assistant is up.
- *Got it* and snooze end when something new joins the matter or it gets worse; after a snooze the notifications
  start again. Situations are not resolved and reopened after a restart.
- Phones were dropped as computers when the owner's name contained “mac”, “linux” or “tablet”.
- Critical pushes sound on Android phones that are silent (alarm stream). One notify call has 15 seconds;
  protective actions no longer delay telling people; a step is never sent twice.
- The plan ran old occurrences: an entry added after its time ran later that day with another entry, and a new
  entry could run once for every day the plan had been empty. Missed entries are caught up after Home Assistant
  has started. Security actions that could never run are refused when saved.
- Custom rules with *above* or *below* never fired on sensors that report often: the wait now counts how long the
  condition holds.
- Unusable AI answers (refusal, cut off, bad JSON) are counted in the cost ledger. A tool call cut off by the
  token limit is not run. Claude Haiku 4.5 is no longer sent `effort`.
- Panel: prompt edits were lost when anything in the home changed; settings controls could show a value that was
  not stored; dates follow Home Assistant's time zone; a second rule with the same name no longer replaces the
  first.
- Undoing a new override removes it; undo goes back one change at a time.
- A repair interrupted by a restart is retried; a repair that was only observed is not reported as failed; a
  backup is started without waiting for it. Signals reported through the service survive a restart.
- Limits in °C apply to sensors that report °F. Diagnostics leave out people's names and accounts.
- `const.py` carried 1.1.0, so browsers could keep an old panel after an update.

## [1.2.0]

Fixes from an independent review before the first installation in a real home.

### Security
- Confirmation comes from the person, never from a model: AI tools no longer take `confirmed`. A conversation gets
  a one-time code bound to the person, the conversation and the exact action; it works only in the person's next
  message, only when that message is a plain yes, and only once. Other assistants using HomeAI's tools get an
  approval addressed to the person instead.
- Action targets are resolved like Home Assistant resolves a service call (entities, devices, areas, floors,
  labels, groups; every entity, also those HomeAI does not watch), and the action runs on exactly the judged list.
  `homeassistant.turn_off` on a floor or label can no longer pass as a comfort action. A target with nothing behind
  it and `entity_id: all` are refused.
- Controls take the class of their device (a thermostat's valve position is a device action, a lock's relay a
  security one); a device's configuration entities are at least R2; restart buttons are R3.
- Reading automations, scripts and dashboards through HomeAI is for administrators only.

### Fixed
- Learned norms with sparse hours were stored as NaN, came back as null and crashed the anomaly detector on every
  evaluation after a restart.
- An administrator's approval of a resident's request created a new approval instead of running it; it now runs
  once, in the administrator's account. Residents approving R1–R2 requests no longer fail.
- The observation period covers system repairs too: a new home sees nothing reloaded or backed up before people
  have watched HomeAI work (set the period to 0 to act at once).
- A stale backup follows Home Assistant's backup schedule (twice a week is not stale after 30 hours), and switched
  off automatic backups are never retried. Backup locations are listed every 6 hours or after a backup, not every
  5 minutes; periodic work no longer overlaps when a tick runs long.
- Conversations keep working past their turn limit on models with preserved thinking: when old turns are dropped,
  the kept turns lose their thinking blocks instead of being rejected.
- The Anthropic SDK is imported off the event loop.
- iPhones report battery state as "Charging" / "Full"; charging sensors now understand them.
- A situation whose severity changes right after opening no longer pushes the same step twice.
- AI cost sensors report `last_reset`, so the recorder no longer sees the daily or monthly reset as negative spend.
- Configuration changes kept for undo are capped at 50.

### Added
- People without a chosen role are administrators when their Home Assistant account is one; the wizard stores
  every role it is given.
- A config entry not made by HomeAI's wizard (for example one left by an earlier integration with the same domain)
  is cleaned of foreign data and Repairs offers *Finish setting up HomeAI* (language, privacy, roles).
- Repair playbook *Restart a hub with its restart button* (`press_restart`): used when a hub with a working restart
  button goes offline (installations without the Supervisor included), and when a hub reports that it needs a
  restart — then only while nobody is home or everyone at home is asleep. Repairs can postpone themselves.

## [1.1.0]

### Added
- Interfaces from the plan: the autonomy slider `select.homeai_autonomy`, `switch.homeai_ai`,
  `switch.homeai_vacation`, `number.homeai_ai_budget_monthly`, `sensor.homeai_next_plan_change`,
  `binary_sensor.homeai_attention_needed`, the services `homeai.ask` and `homeai.run_mission`, and Repairs hints
  for a home without residents, phones or areas.
- Custom detectors without code: rules in the panel's Rules tab (entities, label, area or domain; state, above,
  below, unavailable; how long; when; each or all) with a live preview.
- Panel: chat, presence exceptions, a form for the plan, settings per floor, room, device, entity or person,
  settings history, section reset and import; dashboard cards for the plan and for chat.
- Policy: an actor × class matrix (HomeAI's own rules, AI, repairs, the plan), risk classes by action and by
  label, choice of repair playbooks and integrations never reloaded, who may add to the plan and defaults for
  new entries.
- AI: prompts per mission with the built-in prompt shown and restorable; who may talk to HomeAI, what
  conversations may do, answer length and shared conversations; longest answer, timeout and daily budget per
  tier connection.
- “Tell me when” commitments (`homeai.watch`, also from conversations), plans from other integrations through a
  `homeai_plan` attribute, a plant watering detector for soil moisture sensors, notification title and text
  templates, and a performance test for a large home.

## [1.0.0]

First release of HomeAI 1.0, rewritten from scratch.

### Added
- Setup wizard (language, privacy, roles of people), quick options and a settings registry with 230+ settings,
  many per floor, area, device, entity or person, with history, undo, export and import.
- World model from Home Assistant's registries, roles for entities, presence and sleep from four sources.
- Detectors for safety, security, availability, integrations, backups, updates, the log, the internet,
  batteries, consumables, problems and plants, silent sensors, indoor environment, disagreeing sensors, lights
  in an empty home, windows open while heating, hubs and bridges, anomalies against learned norms, and signals
  from other integrations (service or entity attribute).
- Situation engine with correlation, suppression and a lifecycle; triage with severity, urgency and who is
  needed; people's reactions (acknowledge, take, snooze, dismiss).
- Notification router with escalation ladders, presence- and sleep-aware recipients, phone actions, digest,
  speech and an event channel; blueprints for AWTRIX and notify displays.
- Risk policy R0–R6 with autonomy levels, an observation period and protective actions; the `HomeAI` system
  user; executor with verification, undo, journal and logbook; approvals; configuration editing through Home
  Assistant's own editors.
- Repair playbooks with retries and escalation; adapter for hubs, bridges and Zigbee2MQTT.
- The home's plan and presence exceptions as calendars.
- AI tiers P1, P2 and P3 as subentries: Anthropic and OpenAI-compatible providers, budgets, privacy levels,
  P1 triage, P2 investigation with tools, conversations, the HomeAI LLM API, the arbiter with decision
  dossiers, AI-written digest and weekly review, and a triage eval.
- Learning: norms, anomalies, habit proposals, memory of facts and preferences, feedback from undo and
  refusals, weekly review.
- Panel (situations, approvals, plan, learning, journal, settings, AI) and a dashboard card.
