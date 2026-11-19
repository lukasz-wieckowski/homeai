import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { element } from "../define";
import { clock, dayLabel, homeDay, inZone, t, when } from "../i18n";
import { VERBS, describeAction, domainOf, things, thingName, understand, verbOf } from "../actions";
import { paged } from "../pager";
import { shared } from "../styles";
import type { HomeAssistant } from "../types";

interface When { kind: string; time?: string; date?: string; days?: number[]; event?: string; offset?: number }
interface Occurrence { at: string; entry_id: string; title: string; external?: boolean; source?: string | null }
interface Watch { id: string; what: string; message: string; expires: string; person: string }
interface Entry {
  id: string;
  title: string;
  when: When;
  enabled: boolean;
  skip_when_away: boolean;
  author_name: string;
  last_result: string | null;
  reminder?: string;
  to?: string;
  action?: { service: string; entity_ids: string[]; data: Record<string, unknown> };
}
interface Draft {
  id?: string;
  type: "action" | "reminder";
  title: string;
  // a simple action: a thing, a verb and its value
  thing: string;
  verb: string;
  value: number | null;
  // anything else (an administrator's own action): kept as it is
  custom: boolean;
  service: string;
  entities: string;
  data: string;
  reminder: string;
  to: string;
  when: When;
  enabled: boolean;
  skip_when_away: boolean;
}

const KINDS = ["daily", "weekly", "once", "sun"];
const EVENTS = ["sunset", "sunrise", "dusk", "dawn", "solar_noon"];
const TO = ["home_or_all", "home", "all", "admins"];

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function blank(): Draft {
  return { type: "action", title: "", thing: "", verb: "", value: null, custom: false, service: "", entities: "", data: "",
    reminder: "", to: "home_or_all", when: { kind: "daily", time: "08:00" }, enabled: true, skip_when_away: false };
}

function fromEntry(e: Entry): Draft {
  const simple = understand(e.action);
  return {
    id: e.id, type: e.reminder ? "reminder" : "action", title: e.title,
    thing: simple?.thing ?? "", verb: simple?.verb ?? "", value: simple?.value ?? null, custom: !!e.action && !simple,
    service: e.action?.service ?? "", entities: (e.action?.entity_ids ?? []).join(", "),
    data: e.action && Object.keys(e.action.data).length ? JSON.stringify(e.action.data) : "",
    reminder: e.reminder ?? "", to: e.to ?? "home_or_all", when: { ...e.when }, enabled: e.enabled, skip_when_away: e.skip_when_away,
  };
}

export function describeWhen(w: When, lang: string): string {
  const names = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(lang, { weekday: "short" }));
  const days = w.days?.length ? w.days.map((d) => names[d]).join(", ") : "";
  switch (w.kind) {
    case "once": return `${w.date ? new Date(`${w.date}T12:00`).toLocaleDateString(lang, { weekday: "short", day: "numeric", month: "long" }) : ""} ${w.time}`;
    case "daily": return `${t(lang, "plan_daily")} ${w.time}`;
    case "weekly": return `${days} ${w.time}`;
    case "sun": {
      const off = w.offset ? ` ${w.offset > 0 ? "+" : ""}${w.offset} min` : "";
      return `${t(lang, `plan_${w.event}`)}${off}${days ? ` · ${days}` : ""}`;
    }
    default: return JSON.stringify(w);
  }
}

// The home's plan: what happens next, every entry, and a form to add or change one.
@element("homeai-plan")
export class HomeAIPlan extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private occurrences: Occurrence[] = [];
  @state() private entries: Entry[] = [];
  @state() private watches: Watch[] = [];
  @state() private draft?: Draft;
  @state() private error = "";
  @state() pages: Record<string, number> = {};
  @state() private expanded: string | null = null;

  static styles = [
    shared,
    css`
      /* a wide screen: what comes next on the left, what is set up on the right */
      :host { container-type: inline-size; }
      @container (min-width: 56em) {
        .columns { display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); column-gap: var(--_section-spacing); align-items: start; }
      }
    `,
  ];

  connectedCallback(): void {
    super.connectedCallback();
    this.load();
  }

  private async load(): Promise<void> {
    const res = await this.hass.callWS<{ entries: Entry[]; occurrences: Occurrence[] }>({ type: "homeai/plan/list", days: 31 });
    this.entries = res.entries;
    this.occurrences = res.occurrences;
    try {
      this.watches = (await this.hass.callWS<{ items: Watch[] }>({ type: "homeai/watches/list" })).items;
    } catch {
      this.watches = [];
    }
  }

  private async removeWatch(id: string): Promise<void> {
    await this.hass.callWS({ type: "homeai/watches/delete", watch_id: id });
    await this.load();
  }

  private async removeEntry(id: string): Promise<void> {
    if (!confirm(t(this.hass.language, "remove_confirm"))) return;
    await this.hass.callWS({ type: "homeai/plan/delete", entry_id: id });
    this.close();
    await this.load();
  }

  private async skip(o: Occurrence): Promise<void> {
    const date = inZone(o.at, this.hass.config?.time_zone).date; // the home's day, whatever zone the browser is in
    await this.hass.callService("homeai", "plan_skip", { entry_id: o.entry_id, date });
    this.expanded = null;
    await this.load();
  }

  private set(patch: Partial<Draft>): void {
    this.draft = { ...this.draft!, ...patch };
  }

  private setWhen(patch: Partial<When>): void {
    const w = { ...this.draft!.when, ...patch };
    if (patch.kind) {
      if (w.kind === "once" && !w.date) w.date = today();
      if ((w.kind === "weekly") && !w.days?.length) w.days = [0, 1, 2, 3, 4];
      if (w.kind === "sun" && !w.event) w.event = "sunset";
      if (w.kind !== "sun" && !w.time) w.time = "08:00";
    }
    this.set({ when: w });
  }

  private toggleDay(day: number): void {
    // no days chosen means every day: unticking one starts from all seven
    const chosen = this.draft!.when.days ?? [];
    const days = new Set(chosen.length ? chosen : [0, 1, 2, 3, 4, 5, 6]);
    days.has(day) ? days.delete(day) : days.add(day);
    this.setWhen({ days: [...days].sort() });
  }

  private pickThing(id: string): void {
    const first = (VERBS[domainOf(id)] ?? [])[0];
    this.set({ thing: id, verb: first?.key ?? "", value: first?.field ? first.field.fallback : null });
  }

  private pickVerb(key: string): void {
    const verb = verbOf(this.draft!.thing, key);
    const keep = verb?.field && this.draft!.value !== null && this.draft!.verb === key;
    this.set({ verb: key, value: verb?.field ? (keep ? this.draft!.value : verb.field.fallback) : null });
  }

  private async save(): Promise<void> {
    const d = this.draft!;
    const lang = this.hass.language;
    const w: When = { kind: d.when.kind };
    if (d.when.kind !== "sun") w.time = d.when.time;
    if (d.when.kind === "once") w.date = d.when.date;
    if (d.when.kind === "weekly" || (d.when.kind === "sun" && d.when.days?.length)) w.days = d.when.days;
    if (d.when.kind === "sun") {
      w.event = d.when.event;
      w.offset = Number(d.when.offset ?? 0);
    }
    let title = d.title.trim();
    const entry: Record<string, unknown> = { when: w, enabled: d.enabled, skip_when_away: d.skip_when_away };
    if (d.type === "reminder") {
      if (!d.reminder.trim()) return this.fail(t(lang, "plan_reminder_text"));
      entry.reminder = d.reminder;
      entry.to = d.to;
      title ||= d.reminder.trim().slice(0, 60);
    } else if (d.custom) {
      let data = {};
      try {
        data = d.data.trim() ? JSON.parse(d.data) : {};
      } catch (err) {
        return this.fail(`JSON: ${err}`);
      }
      entry.action = { service: d.service.trim(), entity_ids: d.entities.split(/[\s,]+/).filter(Boolean), data };
    } else {
      const verb = verbOf(d.thing, d.verb);
      if (!d.thing || !verb) return this.fail(t(lang, "plan_what"));
      const data = verb.field && d.value !== null ? { [verb.field.name]: d.value } : {};
      entry.action = { service: verb.service, entity_ids: [d.thing], data };
      title ||= describeAction(this.hass, lang, d.thing, d.verb, d.value);
    }
    entry.title = title || t(lang, "plan_custom");
    try {
      await this.hass.callWS({ type: "homeai/plan/save", entry, ...(d.id ? { entry_id: d.id } : {}) });
      this.draft = undefined;
      this.error = "";
      await this.load();
    } catch (err: any) {
      this.fail(err?.message ?? String(err));
    }
  }

  private fail(why: string): void {
    this.error = `${t(this.hass.language, "plan_error")}: ${why}`;
  }

  private close(): void {
    this.draft = undefined;
    this.error = "";
  }

  protected updated(): void {
    const dialog = this.renderRoot.querySelector("dialog");
    if (dialog && !dialog.open) dialog.showModal();
  }

  // What should happen: the thing by its name, then the verbs that fit it, with one slider when there is a value.
  private actionFields() {
    const lang = this.hass.language;
    const d = this.draft!;
    if (d.custom) {
      const names = d.entities.split(/[\s,]+/).filter(Boolean).map((id) => thingName(this.hass, id)).join(", ");
      return html`<div class="field"><span class="label">${t(lang, "plan_do")}</span>
          <div><span part="row-title" class="item-title">${t(lang, "plan_custom")}</span><span part="row-meta" class="item-meta wrap">${names || "—"}</span></div>
          <p class="hint">${t(lang, "plan_custom_hint")}</p></div>
        ${this.hass.user.is_admin
          ? html`<details><summary class="muted">${t(lang, "plan_advanced")}</summary><div class="fields">
              ${this.raw(t(lang, "plan_service"), d.service, (v) => this.set({ service: v }))}
              ${this.raw(t(lang, "rule_entities"), d.entities, (v) => this.set({ entities: v }))}
              ${this.raw(t(lang, "plan_data"), d.data, (v) => this.set({ data: v }))}
            </div></details>`
          : nothing}`;
    }
    const verbs = d.thing ? VERBS[domainOf(d.thing)] ?? [] : [];
    const verb = verbOf(d.thing, d.verb);
    return html`
      <label class="field"><span class="label">${t(lang, "plan_what")}</span>
        <select part="input" @change=${(e: Event) => this.pickThing((e.target as HTMLSelectElement).value)}>
          <option value="" ?selected=${!d.thing} disabled>${t(lang, "plan_pick")}</option>
          ${things(this.hass).map(([domain, list]) => html`<optgroup label=${t(lang, `type_${domain}`)}>
            ${list.map((x) => html`<option value=${x.id} ?selected=${x.id === d.thing}>${x.name}${x.area && !x.name.includes(x.area) ? ` — ${x.area}` : ""}</option>`)}
          </optgroup>`)}
        </select></label>
      ${verbs.length > 1
        ? html`<div class="field"><span class="label">${t(lang, "plan_do")}</span>
            <div class="segmented" role="group" aria-label=${t(lang, "plan_do")}>
              ${verbs.map((v) => html`<button part=${v.key === d.verb ? "button button-primary" : "button"} class=${v.key === d.verb ? "primary" : ""}
                aria-pressed=${v.key === d.verb ? "true" : "false"} @click=${() => this.pickVerb(v.key)}>${t(lang, `verb_${v.key}`)}</button>`)}
            </div></div>`
        : verbs.length ? html`<p class="hint">${t(lang, `verb_${verbs[0].key}`)}</p>` : nothing}
      ${verb?.field
        ? html`<label class="field"><span class="label">${t(lang, `verb_${verb.key}`)}: <b>${d.value ?? verb.field.fallback}${verb.field.unit}</b></span>
            <input part="input" type="range" min=${verb.field.min} max=${verb.field.max} step=${verb.field.step} .value=${String(d.value ?? verb.field.fallback)}
              @input=${(e: Event) => this.set({ value: Number((e.target as HTMLInputElement).value) })} /></label>`
        : nothing}`;
  }

  private raw(label: string, value: string, set: (v: string) => void) {
    return html`<label class="field"><span class="label">${label}</span><input part="input" .value=${value} @input=${(e: Event) => set((e.target as HTMLInputElement).value)} /></label>`;
  }

  private form() {
    const lang = this.hass.language;
    const d = this.draft!;
    const w = d.when;
    const names = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(lang, { weekday: "short" }));
    const field = (label: string, content: unknown) => html`<label class="field"><span class="label">${label}</span>${content}</label>`;
    const choice = <T extends string>(options: readonly T[], current: string, label: (x: T) => string, pick: (x: T) => void) =>
      html`<div class="segmented" role="group">${options.map((x) => html`<button part=${x === current ? "button button-primary" : "button"} class=${x === current ? "primary" : ""}
        aria-pressed=${x === current ? "true" : "false"} @click=${() => pick(x)}>${label(x)}</button>`)}</div>`;
    return html`<dialog part="sheet" class="card sheet" aria-labelledby="sheet-title" @close=${this.close}>
      <div class="sheet-head"><h2 id="sheet-title" part="title" class="title">${t(lang, d.id ? "plan_change" : "plan_new")}</h2></div>
      <div class="sheet-body fields">
        ${d.custom ? nothing : choice(["action", "reminder"] as const, d.type, (x) => t(lang, `plan_${x}`), (x) => this.set({ type: x }))}
        ${d.type === "reminder"
          ? html`${field(t(lang, "plan_reminder_text"), html`<input part="input" .value=${d.reminder} @input=${(e: Event) => this.set({ reminder: (e.target as HTMLInputElement).value })} />`)}
            ${field(t(lang, "plan_to"), html`<select part="input" @change=${(e: Event) => this.set({ to: (e.target as HTMLSelectElement).value })}>
              ${TO.map((x) => html`<option value=${x} ?selected=${x === d.to}>${t(lang, `plan_to_${x}`)}</option>`)}</select>`)}`
          : this.actionFields()}
        <div class="field"><span class="label">${t(lang, "plan_when")}</span>
          ${choice(KINDS, w.kind, (k) => t(lang, `plan_${k}`), (k) => this.setWhen({ kind: k }))}</div>
        <div class="pair">
          ${w.kind === "once" ? field(t(lang, "plan_day"), html`<input part="input" type="date" .value=${w.date ?? ""} @change=${(e: Event) => this.setWhen({ date: (e.target as HTMLInputElement).value })} />`) : nothing}
          ${w.kind === "sun"
            ? html`${field(t(lang, "plan_moment"), html`<select part="input" @change=${(e: Event) => this.setWhen({ event: (e.target as HTMLSelectElement).value })}>
                ${EVENTS.map((x) => html`<option value=${x} ?selected=${x === w.event}>${t(lang, `plan_${x}`)}</option>`)}</select>`)}
              ${field(t(lang, "plan_offset"), html`<input part="input" type="number" min="-720" max="720" step="5" .value=${String(w.offset ?? 0)} @change=${(e: Event) => this.setWhen({ offset: parseInt((e.target as HTMLInputElement).value, 10) || 0 })} />`)}`
            : field(t(lang, "plan_time"), html`<input part="input" type="time" .value=${w.time ?? ""} @change=${(e: Event) => this.setWhen({ time: (e.target as HTMLInputElement).value })} />`)}
        </div>
        ${w.kind === "weekly" || w.kind === "sun"
          ? html`<div class="chips" role="group">${names.map((n, i) => {
              const on = !w.days?.length || w.days.includes(i);
              return html`<button part=${on ? "button button-primary" : "button"} aria-pressed=${on ? "true" : "false"} @click=${() => this.toggleDay(i)}>${n}</button>`;
            })}</div>`
          : nothing}
        ${field(t(lang, "plan_name_optional"), html`<input part="input" .value=${d.title}
          placeholder=${d.type === "action" && !d.custom && d.thing ? describeAction(this.hass, lang, d.thing, d.verb, d.value) : ""}
          @input=${(e: Event) => this.set({ title: (e.target as HTMLInputElement).value })} />`)}
        <label class="check"><input part="input" type="checkbox" .checked=${d.skip_when_away} @change=${(e: Event) => this.set({ skip_when_away: (e.target as HTMLInputElement).checked })} />${t(lang, "plan_skip_away")}</label>
        <label class="check"><input part="input" type="checkbox" .checked=${d.enabled} @change=${(e: Event) => this.set({ enabled: (e.target as HTMLInputElement).checked })} />${t(lang, "rule_enabled")}</label>
        ${this.error ? html`<div part="error" class="error">${this.error}</div>` : nothing}
      </div>
      <div class="sheet-foot">
        ${d.id ? html`<button part="button button-quiet" class="quiet danger" @click=${() => this.removeEntry(d.id!)}>${t(lang, "remove")}</button>` : nothing}
        <span class="grow"></span>
        <button part="button" @click=${this.close}>${t(lang, "cancel")}</button>
        <button part="button button-primary" class="primary" ?disabled=${d.custom && !this.hass.user.is_admin} @click=${this.save}>${t(lang, "save")}</button>
      </div>
    </dialog>`;
  }

  // Occurrences grouped by the home's day; a row of the plan's own entries opens to skip it or edit the entry.
  private timeline() {
    const lang = this.hass.language;
    const tz = this.hass.config?.time_zone;
    const page = paged(this, "next", this.occurrences, lang, 15);
    const shown = page.items;
    const rows: unknown[] = [];
    let last = "";
    shown.forEach((o, i) => {
      const day = homeDay(o.at, tz);
      if (day !== last) {
        rows.push(html`<li part="day" class="day">${dayLabel(o.at, lang, tz)}</li>`);
        last = day;
      }
      const key = `${o.entry_id}|${o.at}|${page.offset + i}`;
      const open = this.expanded === key;
      const source = o.external ? this.hass.states[o.source ?? ""]?.attributes.friendly_name ?? o.source ?? "" : "";
      const meta = source && !o.title.toLowerCase().includes(String(source).toLowerCase()) ? `${t(lang, "from_source")} ${source}` : "";
      const inner = html`<span part="time" class="time">${clock(o.at, lang, tz)}</span>
        <span class="item-text"><span part="row-title" class="item-title">${o.title}</span>${meta ? html`<span part="row-meta" class="item-meta">${meta}</span>` : nothing}</span>
        <span></span>`;
      rows.push(o.external
        ? html`<li part="row"><div class="item-main timed">${inner}</div></li>`
        : html`<li part="row" class=${open ? "open" : ""}>
            <button class="item-main timed" aria-expanded=${open ? "true" : "false"} @click=${() => (this.expanded = open ? null : key)}>${inner}</button>
            ${open
              ? html`<div class="item-more"><div class="item-actions">
                  <button part="button" @click=${() => this.skip(o)}>${t(lang, "plan_skip_once")}</button>
                  ${this.entries.some((e) => e.id === o.entry_id)
                    ? html`<button part="button button-quiet" class="quiet" @click=${() => this.edit(o.entry_id)}>${t(lang, "plan_edit_entry")}</button>`
                    : nothing}
                </div></div>`
              : nothing}
          </li>`);
    });
    return html`<ul part="card list" class="list">${rows}</ul>${page.nav}`;
  }

  private edit(id: string): void {
    const entry = this.entries.find((e) => e.id === id);
    if (entry) this.draft = fromEntry(entry);
  }

  render() {
    const lang = this.hass.language;
    return html`
      ${this.draft ? this.form() : nothing}
      <div class="columns">
        <section class="section">
          <div class="section-head"><h2 part="heading" class="heading">${t(lang, "plan_next")}</h2>
            <button part="button button-primary" class="primary" @click=${() => (this.draft = blank())}>${t(lang, "plan_add")}</button></div>
          ${this.occurrences.length ? this.timeline() : html`<div part="empty" class="empty">${t(lang, "no_plan")}</div>`}
        </section>
        <div>
          ${this.watches.length
            ? html`<section class="section">
                <div class="section-head"><h2 part="heading" class="heading">${t(lang, "watching")} <span class="count">${this.watches.length}</span></h2></div>
                <ul part="card list" class="list">${paged(this, "watches", this.watches, lang).items.map((w) => {
                  const open = this.expanded === `watch|${w.id}`;
                  return html`<li part="row" class=${open ? "open" : ""}>
                    <button class="item-main plain" aria-expanded=${open ? "true" : "false"} @click=${() => (this.expanded = open ? null : `watch|${w.id}`)}>
                      <span class="item-text"><span part="row-title" class="item-title">${w.what}</span>
                        <span part="row-meta" class="item-meta">${w.message ? `${w.message} · ` : ""}${t(lang, "until")} ${when(w.expires, lang)}</span></span>
                      <span></span>
                    </button>
                    ${open ? html`<div class="item-more flush"><div class="item-actions">
                      <button part="button" @click=${() => this.removeWatch(w.id)}>${t(lang, "watch_stop")}</button></div></div>` : nothing}
                  </li>`;
                })}</ul>
                ${paged(this, "watches", this.watches, lang).nav}
              </section>`
            : nothing}
          ${this.entries.length
            ? html`<section class="section">
                <div class="section-head"><h2 part="heading" class="heading">${t(lang, "plan_entries")} <span class="count">${this.entries.length}</span></h2></div>
                <ul part="card list" class="list">${paged(this, "entries", this.entries, lang).items.map((e) => html`<li part="row">
                  <button class="item-main plain" @click=${() => (this.draft = fromEntry(e))}>
                    <span class="item-text"><span part="row-title" class="item-title ${e.enabled ? "" : "off"}">${e.title}</span>
                      <span part="row-meta" class="item-meta">${describeWhen(e.when, lang)} · ${e.author_name}${e.enabled ? "" : ` · ${t(lang, "entry_off")}`}</span></span>
                    <span class="chevron">›</span>
                  </button></li>`)}</ul>
                ${paged(this, "entries", this.entries, lang).nav}
              </section>`
            : nothing}
        </div>
      </div>`;
  }
}
