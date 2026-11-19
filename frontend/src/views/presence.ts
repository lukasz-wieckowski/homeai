import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { element } from "../define";
import { inZone, t, when } from "../i18n";
import { shared } from "../styles";
import type { HomeAssistant, WorldSummary } from "../types";

interface Item { id: string; kind: string; person: string | null; start: string; end: string; note: string }
interface Draft { id?: string; kind: string; person: string; start: string; end: string; note: string }

const KINDS = ["away", "vacation", "guests", "home_office", "sick"];

// Days are the home's days (Home Assistant's time zone): a person editing from a trip sees and saves the same dates.
function day(tz: string | undefined, offset = 0): string {
  return inZone(Date.now() + offset * 86400000, tz).date;
}

function localDay(iso: string, tz: string | undefined, end = false): string {
  // Stored ends are exclusive (midnight after the last day); show the last day itself.
  return inZone(new Date(iso).getTime() - (end ? 1000 : 0), tz).date;
}

function midnight(iso: string, tz: string | undefined): boolean {
  const z = inZone(iso, tz);
  return z.hour === 0 && z.minute === 0;
}

// Whole days as dates with the last day included; anything else with times.
function span(start: string, end: string, lang: string, tz: string | undefined): string {
  if (!midnight(start, tz) || !midnight(end, tz)) return `${when(start, lang)} → ${when(end, lang)}`;
  const fmt = (d: Date) => d.toLocaleDateString(lang, { weekday: "short", day: "numeric", month: "short", timeZone: tz || undefined });
  const first = new Date(start);
  const last = new Date(new Date(end).getTime() - 1000);
  return localDay(start, tz) === localDay(end, tz, true) ? fmt(first) : `${fmt(first)} – ${fmt(last)}`;
}

// Trips, guests, working from home: exceptions HomeAI and every automation can read from calendar.homeai_presence.
@element("homeai-presence")
export class HomeAIPresence extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private items: Item[] = [];
  @state() private world?: WorldSummary;
  @state() private draft?: Draft;
  @state() private error = "";

  static styles = shared;

  connectedCallback(): void {
    super.connectedCallback();
    this.load();
  }

  private async load(): Promise<void> {
    try {
      const res = await this.hass.callWS<{ items: Item[] }>({ type: "homeai/presence/list", days: 120 });
      this.items = res.items.sort((a, b) => a.start.localeCompare(b.start));
      if (!this.world) this.world = await this.hass.callWS<WorldSummary>({ type: "homeai/world/summary" });
    } catch (err: any) {
      this.error = err?.message ?? String(err);
    }
  }

  private personName(id: string | null): string {
    if (!id) return t(this.hass.language, "presence_everyone");
    return this.world?.persons.find((p) => p.id === id)?.name ?? id;
  }

  private async save(): Promise<void> {
    const d = this.draft!;
    const item = { kind: d.kind, person: d.person || null, start: d.start, end: d.end, note: d.note };
    try {
      await this.hass.callWS({ type: "homeai/presence/save", item, ...(d.id ? { exception_id: d.id } : {}) });
      this.draft = undefined;
      this.error = "";
      await this.load();
    } catch (err: any) {
      this.error = err?.message ?? String(err);
    }
  }

  private async removeItem(id: string): Promise<void> {
    if (!confirm(t(this.hass.language, "remove_confirm"))) return;
    try {
      await this.hass.callWS({ type: "homeai/presence/delete", exception_id: id });
      this.error = "";
    } catch (err: any) {
      this.error = err?.message ?? String(err);
    }
    await this.load();
  }

  private form() {
    const lang = this.hass.language;
    const d = this.draft!;
    const set = (patch: Partial<Draft>) => (this.draft = { ...d, ...patch });
    const field = (label: string, content: unknown) => html`<label class="row field"><span class="label">${label}</span>${content}</label>`;
    return html`<div part="card" class="card">
      ${field(t(lang, "presence_kind"), html`<select part="input" @change=${(e: Event) => set({ kind: (e.target as HTMLSelectElement).value })}>
        ${KINDS.map((k) => html`<option value=${k} ?selected=${k === d.kind}>${t(lang, `presence_${k}`)}</option>`)}</select>`)}
      ${field(t(lang, "presence_person"), html`<select part="input" @change=${(e: Event) => set({ person: (e.target as HTMLSelectElement).value })}>
        <option value="" ?selected=${!d.person}>${t(lang, "presence_everyone")}</option>
        ${(this.world?.persons ?? []).map((p) => html`<option value=${p.id} ?selected=${p.id === d.person}>${p.name}</option>`)}</select>`)}
      ${field(t(lang, "presence_from"), html`<input part="input" type="date" .value=${d.start} @change=${(e: Event) => set({ start: (e.target as HTMLInputElement).value })} />`)}
      ${field(t(lang, "presence_to"), html`<input part="input" type="date" .value=${d.end} @change=${(e: Event) => set({ end: (e.target as HTMLInputElement).value })} />`)}
      ${field(t(lang, "presence_note"), html`<input part="input" class="grow" maxlength="300" .value=${d.note} @input=${(e: Event) => set({ note: (e.target as HTMLInputElement).value })} />`)}
      ${this.error ? html`<div part="error" class="muted error">${this.error}</div>` : nothing}
      <div class="row actions">
        <button part="button button-primary" class="primary" @click=${this.save}>${t(lang, "save")}</button>
        <button part="button" @click=${() => { this.draft = undefined; this.error = ""; }}>${t(lang, "cancel")}</button>
      </div>
    </div>`;
  }

  render() {
    const lang = this.hass.language;
    return html`
      <div class="row toolbar-row">
        <span class="muted grow">${t(lang, "presence_hint")}</span>
        ${this.draft ? nothing : html`<button part="button button-primary" class="primary" @click=${() => (this.draft = { kind: "away", person: "", start: day(this.hass.config?.time_zone), end: day(this.hass.config?.time_zone, 1), note: "" })}>${t(lang, "presence_add")}</button>`}
      </div>
      ${this.draft ? this.form() : this.error ? html`<div part="card error" class="card error">${this.error}</div>` : nothing}
      ${this.items.length
        ? html`<div part="card" class="card"><ul part="list" class="plain">${this.items.map(
            (i) => html`<li class="row"><span class="grow">${t(lang, `presence_${i.kind}`)} · ${this.personName(i.person)}<br />
              <span class="muted">${span(i.start, i.end, lang, this.hass.config?.time_zone)}${i.note ? ` · ${i.note}` : ""}</span></span>
              <button part="button" @click=${() => (this.draft = { id: i.id, kind: i.kind, person: i.person ?? "", start: localDay(i.start, this.hass.config?.time_zone), end: localDay(i.end, this.hass.config?.time_zone, true), note: i.note })}>${t(lang, "edit")}</button>
              <button part="button" @click=${() => this.removeItem(i.id)}>${t(lang, "remove")}</button></li>`,
          )}</ul></div>`
        : html`<div part="empty" class="empty">${t(lang, "presence_none")}</div>`}`;
  }
}
