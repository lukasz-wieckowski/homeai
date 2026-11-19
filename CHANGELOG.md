# Changelog

All notable changes to HomeAI are documented here. The project follows
[Semantic Versioning](https://semver.org/).

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
