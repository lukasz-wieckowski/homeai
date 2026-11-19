import { t } from "./i18n";
import type { HomeAssistant } from "./types";

// What a plan entry can do, in people's words: pick a thing by its name, then what should happen to it. Every verb
// is one Home Assistant action with at most one value (brightness, position, temperature), so nobody sees action
// names, entity ids or JSON. Anything else stays a custom action, shown by its parts and changed only by an
// administrator.
export interface Verb {
  key: string;
  service: string;
  field?: { name: string; min: number; max: number; step: number; unit: string; fallback: number };
}

const ON_OFF = (domain: string): Verb[] => [
  { key: "on", service: `${domain}.turn_on` },
  { key: "off", service: `${domain}.turn_off` },
];

export const VERBS: Record<string, Verb[]> = {
  scene: [{ key: "activate", service: "scene.turn_on" }],
  script: [{ key: "run", service: "script.turn_on" }],
  light: [
    ...ON_OFF("light"),
    { key: "brightness", service: "light.turn_on", field: { name: "brightness_pct", min: 1, max: 100, step: 1, unit: "%", fallback: 50 } },
  ],
  switch: ON_OFF("switch"),
  fan: ON_OFF("fan"),
  input_boolean: ON_OFF("input_boolean"),
  cover: [
    { key: "open", service: "cover.open_cover" },
    { key: "close", service: "cover.close_cover" },
    { key: "position", service: "cover.set_cover_position", field: { name: "position", min: 0, max: 100, step: 5, unit: "%", fallback: 50 } },
  ],
  climate: [
    { key: "temperature", service: "climate.set_temperature", field: { name: "temperature", min: 5, max: 30, step: 0.5, unit: "°", fallback: 21 } },
    { key: "off", service: "climate.turn_off" },
  ],
  media_player: [{ key: "off", service: "media_player.turn_off" }, { key: "stop", service: "media_player.media_stop" }],
  vacuum: [{ key: "start", service: "vacuum.start" }, { key: "dock", service: "vacuum.return_to_base" }],
  button: [{ key: "press", service: "button.press" }],
  input_button: [{ key: "press", service: "input_button.press" }],
};

export interface Thing { id: string; name: string; area: string }

export function domainOf(entityId: string): string {
  return entityId.split(".", 1)[0];
}

export function thingName(hass: HomeAssistant, entityId: string): string {
  return String(hass.states[entityId]?.attributes.friendly_name ?? entityId);
}

function areaOf(hass: HomeAssistant, entityId: string): string {
  const entry = hass.entities?.[entityId];
  const area = entry?.area_id ?? (entry?.device_id ? hass.devices?.[entry.device_id]?.area_id : null);
  return area ? hass.areas?.[area]?.name ?? "" : "";
}

// Things a plan can act on, grouped by kind and sorted by room and name; hidden and technical entities are left out.
export function things(hass: HomeAssistant): [string, Thing[]][] {
  const groups = new Map<string, Thing[]>();
  for (const id of Object.keys(hass.states)) {
    const domain = domainOf(id);
    if (!(domain in VERBS)) continue;
    const entry = hass.entities?.[id];
    if (entry?.hidden || entry?.entity_category) continue;
    const list = groups.get(domain) ?? [];
    list.push({ id, name: thingName(hass, id), area: areaOf(hass, id) });
    groups.set(domain, list);
  }
  const order = Object.keys(VERBS);
  return [...groups.entries()]
    .sort(([a], [b]) => order.indexOf(a) - order.indexOf(b))
    .map(([domain, list]) => [domain, list.sort((a, b) => a.area.localeCompare(b.area) || a.name.localeCompare(b.name))]);
}

// The verb and value an action means, when it is one of the simple ones.
export function understand(action?: { service: string; entity_ids: string[]; data: Record<string, unknown> }) {
  if (!action || action.entity_ids.length !== 1) return null;
  const domain = domainOf(action.entity_ids[0]);
  const keys = Object.keys(action.data ?? {});
  for (const verb of VERBS[domain] ?? []) {
    if (verb.service !== action.service) continue;
    if (verb.field ? keys.length === 1 && keys[0] === verb.field.name : keys.length === 0) {
      return { thing: action.entity_ids[0], verb: verb.key, value: verb.field ? Number(action.data[verb.field.name]) : null };
    }
  }
  return null;
}

export function verbOf(thing: string, key: string): Verb | undefined {
  return (VERBS[domainOf(thing)] ?? []).find((v) => v.key === key);
}

// "Living room lamp: brightness 30%" — a title for an entry nobody named.
export function describeAction(hass: HomeAssistant, lang: string, thing: string, key: string, value: number | null): string {
  const verb = verbOf(thing, key);
  const what = t(lang, `verb_${key}`).toLowerCase();
  const amount = verb?.field && value !== null ? ` ${value}${verb.field.unit}` : "";
  return `${thingName(hass, thing)}: ${what}${amount}`;
}
