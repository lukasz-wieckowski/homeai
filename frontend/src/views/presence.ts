import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { element } from "../define";
import { inZone, t, when } from "../i18n";
import { paged } from "../pager";
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
  @state() pages: Record<string, number> = {};

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
      this.close();
    } catch (err: any) {
      this.error = err?.message ?? String(err);
    }
    await this.load();
  }

  private close(): void {
    this.draft = undefined;
    this.error = "";
  }

  protected updated(): void {
    const dialog = this.renderRoot.querySelector("dialog");
    if (dialog && !dialog.open) dialog.showModal();
  }

  private form() {
    const lang = this.hass.language;
    const d = this.draft!;
    const set = (patch: Partial<Draft>) => (this.draft = { ...d, ...patch });
    const field = (label: string, content: unknown) => html`<label class="field"><span class="label">${label}</span>${content}</label>`;
    return html`<dialog part="sheet" class="card sheet" aria-labelledby="sheet-title" @close=${this.close}>
      <div class="sheet-head"><h2 id="sheet-title" part="title" class="title">${t(lang, d.id ? "presence_change" : "presence_new")}</h2></div>
      <div class="sheet-body fields">
        <div class="pair">
          ${field(t(lang, "presence_kind"), html`<select part="input" @change=${(e: Event) => set({ kind: (e.target as HTMLSelectElement).value })}>
            ${KINDS.map((k) => html`<option value=${k} ?selected=${k === d.kind}>${t(lang, `presence_${k}`)}</option>`)}</select>`)}
          ${field(t(lang, "presence_person"), html`<select part="input" @change=${(e: Event) => set({ person: (e.target as HTMLSelectElement).value })}>
            <option value="" ?selected=${!d.person}>${t(lang, "presence_everyone")}</option>
            ${(this.world?.persons ?? []).map((p) => html`<option value=${p.id} ?selected=${p.id === d.person}>${p.name}</option>`)}</select>`)}
        </div>
        <div class="pair">
          ${field(t(lang, "presence_from"), html`<input part="input" type="date" .value=${d.start} @change=${(e: Event) => set({ start: (e.target as HTMLInputElement).value })} />`)}
          ${field(t(lang, "presence_to"), html`<input part="input" type="date" .value=${d.end} @change=${(e: Event) => set({ end: (e.target as HTMLInputElement).value })} />`)}
        </div>
        ${field(t(lang, "presence_note"), html`<input part="input" maxlength="300" .value=${d.note} @input=${(e: Event) => set({ note: (e.target as HTMLInputElement).value })} />`)}
        ${this.error ? html`<div part="error" class="error">${this.error}</div>` : nothing}
      </div>
      <div class="sheet-foot">
        ${d.id ? html`<button part="button button-quiet" class="quiet danger" @click=${() => this.removeItem(d.id!)}>${t(lang, "remove")}</button>` : nothing}
        <span class="grow"></span>
        <button part="button" @click=${this.close}>${t(lang, "cancel")}</button>
        <button part="button button-primary" class="primary" @click=${this.save}>${t(lang, "save")}</button>
      </div>
    </dialog>`;
  }

  render() {
    const lang = this.hass.language;
    const tz = this.hass.config?.time_zone;
    return html`
      ${this.draft ? this.form() : nothing}
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${t(lang, "presence")}</h2>
          <button part="button button-primary" class="primary" @click=${() => (this.draft = { kind: "away", person: "", start: day(tz), end: day(tz, 1), note: "" })}>${t(lang, "presence_add")}</button></div>
        <p class="hint">${t(lang, "presence_hint")}</p>
        ${!this.draft && this.error ? html`<div part="card error" class="card error">${this.error}</div>` : nothing}
        ${this.items.length
          ? html`<ul part="card list" class="list">${paged(this, "items", this.items, lang).items.map((i) => html`<li part="row">
              <button class="item-main plain" @click=${() => (this.draft = { id: i.id, kind: i.kind, person: i.person ?? "", start: localDay(i.start, tz), end: localDay(i.end, tz, true), note: i.note })}>
                <span class="item-text"><span part="row-title" class="item-title">${t(lang, `presence_${i.kind}`)} · ${this.personName(i.person)}</span>
                  <span part="row-meta" class="item-meta">${span(i.start, i.end, lang, tz)}${i.note ? ` · ${i.note}` : ""}</span></span>
                <span class="chevron">›</span>
              </button></li>`)}</ul>${paged(this, "items", this.items, lang).nav}`
          : html`<div part="empty" class="empty">${t(lang, "presence_none")}</div>`}
      </section>`;
  }
}
