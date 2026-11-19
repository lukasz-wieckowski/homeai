// A stand-in for Home Assistant's `hass` object with example data, so the panel and the cards can be looked at in
// a plain browser (preview page only; not shipped with the integration).

const params = new URLSearchParams(location.search);
const language = params.get("lang") || "en";
const now = Date.now();
const iso = (minutes) => new Date(now + minutes * 60000).toISOString();

const situations = [
  {
    id: "s1", title: "Water leak in the kitchen", description: "The sensor under the sink reports water.",
    phase: "open", kind: "leak", category: "safety", severity: 4, opened_at: iso(-3), first_seen: iso(-3),
    acked_by: null, handled_by: null, snoozed_until: null, entities: ["binary_sensor.sink_leak"], history: [],
    assessment: { reason: "Water under the sink while nobody is home.", steps: ["Close the main valve", "Wipe the floor"] },
    repair: {},
  },
  {
    id: "s2", title: "Bedroom window open while everyone is away", description: "",
    phase: "open", kind: "opening_away", category: "security", severity: 3, opened_at: iso(-12), first_seen: iso(-14),
    acked_by: "Anna", handled_by: null, snoozed_until: null, entities: ["binary_sensor.bedroom_window"], history: [],
    assessment: { reason: "Everyone left 12 minutes ago." }, repair: {},
  },
  {
    id: "s3", title: "Hallway hub is offline", description: "", phase: "open", kind: "bridge_offline",
    category: "system", severity: 2, opened_at: iso(-40), first_seen: iso(-41), acked_by: null, handled_by: null,
    snoozed_until: null, entities: [], history: [], assessment: {}, repair: { status: "trying", playbook: "reload_entry" },
  },
  {
    id: "s4", title: "Living room sensor battery at 15%", description: "", phase: "open", kind: "battery_low",
    category: "maintenance", severity: 1, opened_at: iso(-300), first_seen: iso(-300), acked_by: null,
    handled_by: null, snoozed_until: null, entities: [], history: [], assessment: {}, repair: {},
  },
];

const fixtures = {
  "homeai/situations/list": { resolved: [
    { ...situations[3], id: "r1", title: "Freezer door open", opened_at: iso(-1500) },
    { ...situations[3], id: "r2", title: "Internet down", opened_at: iso(-3000) },
  ] },
  "homeai/approvals/list": { recent: [
    { id: "a2", what: "Turn off the kitchen plug", risk: 2, reason: "", approver: "admins", created: iso(-100), expires: iso(-40), status: "approved", decided_by: "Anna" },
  ] },
  "homeai/journal/recent": { entries: [
    { id: "j1", ts: iso(-3), kind: "situation", actor: "homeai", text: "Water leak in the kitchen: everyone notified." },
    { id: "j2", ts: iso(-12), kind: "action", actor: "homeai", text: "Heating in the bedroom set to eco until someone is back." },
    { id: "j3", ts: iso(-60), kind: "ai", actor: "p1", text: "P1 assessed the hub problem: severity 2." },
  ] },
  "homeai/learning/status": {
    proposals: [{ id: "p1", title: "Turn on the hallway light at sunset on workdays", days_seen: 9, days_possible: 10 }],
    facts: [
      { id: "f1", text: "The cat must not go on the balcony.", scope: "home", source: "person", approved: true, created: iso(-5000) },
      { id: "f2", text: "Anna works from home on Fridays.", scope: "person:person.anna", source: "ai", approved: false, created: iso(-900) },
    ],
    reviews: [{ ts: iso(-600), text: "A calm week.\nTwo leaks tested, one hub restart." }],
  },
  "homeai/plan/list": {
    entries: [
      { id: "e1", title: "Balcony lights off", when: { kind: "daily", time: "23:00" }, enabled: true, skip_when_away: false, author_name: "Anna", last_result: "done", action: { service: "light.turn_off", entity_ids: ["light.balcony"], data: {} } },
      { id: "e2", title: "Water the plants", when: { kind: "weekly", time: "18:00", days: [1, 4] }, enabled: false, skip_when_away: true, author_name: "Ben", last_result: null, reminder: "Water the plants", to: "home_or_all" },
    ],
    occurrences: [
      { at: iso(90), entry_id: "e1", title: "Balcony lights off" },
      { at: iso(300), entry_id: "x", title: "Heating: comfort in the living room", external: true, source: "climate.living" },
      { at: iso(1530), entry_id: "e1", title: "Balcony lights off" },
      { at: iso(1700), entry_id: "e2", title: "Water the plants" },
      { at: iso(2970), entry_id: "e1", title: "Balcony lights off" },
    ],
  },
  "homeai/watches/list": { items: [{ id: "w1", what: "Washing machine finishes", message: "Hang the laundry", expires: iso(180), person: "person.anna" }] },
  "homeai/presence/list": { items: [{ id: "x1", kind: "away", person: "person.ben", start: iso(1440), end: iso(4320), note: "Conference" }] },
  "homeai/world/summary": {
    floors: [{ id: "ground", name: "Ground floor" }],
    areas: [{ id: "kitchen", name: "Kitchen", floor_id: "ground" }, { id: "bedroom", name: "Bedroom", floor_id: "ground" }],
    persons: [{ id: "person.anna", name: "Anna", role: "admin", home: false }, { id: "person.ben", name: "Ben", role: "member", home: false }],
  },
  "homeai/rules/list": { rules: [
    { id: "r1", name: "Freezer too warm", enabled: true, target: { entities: ["sensor.freezer"], label: null, area: null, domain: null }, condition: { type: "above", value: -12 }, minutes: 20, severity: 3, category: "damage", need: "member", advice: "", when: "always", mode: "each", firing: true },
    { id: "r2", name: "Garage door at night", enabled: false, target: { entities: ["cover.garage"], label: null, area: null, domain: null }, condition: { type: "state", value: "open" }, minutes: 10, severity: 2, category: "security", need: "member", advice: "", when: "night", mode: "each" },
  ] },
  "homeai/settings/schema": {
    language,
    sections: [
      { id: "detectors", label: "Detectors", description: "What HomeAI watches and how serious each finding is." },
      { id: "notify", label: "Notifications", description: "Who is told what, and when." },
    ],
    settings: [
      { key: "detectors.security.away_minutes", type: "int", default: 10, section: "detectors", group: "", scopes: ["global"], min: 0, max: 720, step: null, unit: "min", options: [], advanced: false, confirm: null, label: "Open while away after", description: "How long a door or window must be open while everyone is away.", value: 10, source: "default", overrides: {} },
      { key: "detectors.window_heating.severity", type: "int", default: 2, section: "detectors", group: "", scopes: ["global"], min: 0, max: 3, step: null, unit: null, options: [], advanced: false, confirm: null, label: "Window open while heating: severity", description: "Severity 0–3 of window open while heating (0 journal only, 3 urgent; only safety can be critical).", value: 3, source: "global", overrides: { "area:bedroom": 2 } },
      { key: "detectors.safety.enabled", type: "bool", default: true, section: "detectors", group: "", scopes: ["global"], min: null, max: null, step: null, unit: null, options: [], advanced: false, confirm: "disable", label: "Safety: watch", description: "Leaks, smoke, gas and carbon monoxide.", value: true, source: "default", overrides: {} },
      { key: "detectors.environment.appliance_words", type: "strings", default: [], section: "detectors", group: "", scopes: ["global"], min: null, max: null, step: null, unit: null, options: [], advanced: false, confirm: null, label: "Appliance words", description: "Words that mark a sensor as part of an appliance.", value: ["fridge", "oven"], source: "default", overrides: {} },
      { key: "general.language", type: "select", default: "auto", section: "detectors", group: "", scopes: ["global"], min: null, max: null, step: null, unit: null, options: ["auto", "en", "pl"], option_labels: { auto: "Automatic", en: "English", pl: "Polski" }, advanced: false, confirm: null, label: "Language", description: "Language of HomeAI's texts.", value: "auto", source: "default", overrides: {} },
    ],
  },
  "homeai/settings/scope": { values: {} },
  "homeai/ai/status": {
    enabled: true,
    tiers: { p1: [{ model: "claude-haiku-5-5", provider: "anthropic", priority: 1, status: "ok" }], p2: [{ model: "claude-sonnet-5-5", provider: "anthropic", priority: 1, status: null }] },
    ledger: { today: 0.042, month: 1.37, calls_today: 12, limits: [{ period: "month", spent: 1.37, limit: 10 }], allowed: true },
    last_prompts: {},
  },
  "homeai/ai/prompts": { prompts: [{ mission: "triage", key: "ai.prompt_triage", default: "You are the assessment step of HomeAI…", custom: "" }] },
  "homeai/chat/history": { messages: [
    { role: "user", text: "Is anything open?" },
    { role: "assistant", text: "Yes: the bedroom window has been open for 12 minutes, and nobody is home." },
  ] },
};

const subscriptions = {
  "homeai/situations/subscribe": { type: "situations", situations },
  "homeai/approvals/subscribe": { pending: [
    { id: "a1", what: "Restart the hallway hub", risk: 3, reason: "It has not answered for 40 minutes and a reload did not help.", approver: "admins", created: iso(-5), expires: iso(55), status: "pending", decided_by: null },
  ] },
};

try {
  sessionStorage.setItem("homeai-chat-conversation", "preview");
  sessionStorage.setItem("homeai-chat-card", "preview");
} catch {
  /* no storage: the chat starts empty */
}

export const hass = {
  language,
  config: { time_zone: "Europe/Warsaw" },
  user: { id: "u1", name: "Anna", is_admin: true },
  areas: { kitchen: { area_id: "kitchen", name: "Kitchen" } },
  states: {
    "sensor.homeai_situations": {
      entity_id: "sensor.homeai_situations",
      state: "4",
      attributes: {
        situations: situations.map((s) => ({
          id: s.id, title: s.title, severity: s.severity, since: s.opened_at, acknowledged: !!s.acked_by,
          repairing: s.repair.status === "trying", who: "member",
        })),
      },
    },
    "climate.living": { entity_id: "climate.living", state: "heat", attributes: { friendly_name: "Living room" } },
    "person.anna": { entity_id: "person.anna", state: "not_home", attributes: { friendly_name: "Anna" } },
  },
  async callWS(msg) {
    if (msg.type === "homeai/plan/list" && msg.days === 2) {
      return { occurrences: fixtures["homeai/plan/list"].occurrences };
    }
    return structuredClone(fixtures[msg.type] ?? {});
  },
  async callService() {
    return {};
  },
  connection: {
    async subscribeMessage(callback, msg) {
      const data = subscriptions[msg.type];
      if (data) setTimeout(() => callback(structuredClone(data)), 0);
      return () => {};
    },
  },
};
