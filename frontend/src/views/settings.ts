import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { live } from "lit/directives/live.js";
import { repeat } from "lit/directives/repeat.js";
import { element } from "../define";
import { t, when } from "../i18n";
import { paged } from "../pager";
import { shared } from "../styles";
import type { HomeAssistant, SettingItem, SettingsSchema, WorldSummary } from "../types";

const SCOPES = ["global", "floor", "area", "device", "entity", "person"] as const;
type ScopeType = (typeof SCOPES)[number];

interface Change { ts: string; key: string; scope: string; old: unknown; new: unknown; reset: boolean; user: string | null }

// Every setting is rendered from the backend's registry: adding a setting needs no frontend change.
// A scope (floor, room, device, entity, person) shows only the settings that can be overridden there.
@element("homeai-settings")
export class HomeAISettings extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private schema?: SettingsSchema;
  @state() private world?: WorldSummary;
  @state() private section = "general";
  @state() private filter = "";
  @state() private advanced = false;
  @state() private message = "";
  @state() private scopeType: ScopeType = "global";
  @state() private scopeRef = "";
  @state() private scopeValues: Record<string, unknown> = {};
  @state() private history?: Change[];
  @state() pages: Record<string, number> = {};

  static styles = [
    shared,
    css`
      :host { container-type: inline-size; }
      .tools { display: grid; gap: var(--_space); margin-bottom: var(--_section-spacing); }
      .tools input[type="search"] { width: 100%; }
      .layout { display: grid; gap: var(--_section-spacing); }
      .nav { display: none; }
      .nav button { display: block; width: 100%; text-align: start; }
      @container (min-width: 52em) {
        .layout { grid-template-columns: 14em minmax(0, 1fr); align-items: start; }
        .nav { display: grid; gap: var(--_space-s); position: sticky; top: calc(var(--header-height) + var(--_space-l)); }
        .picker { display: none; }
      }
      .setting { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: center; column-gap: var(--_space-l);
        row-gap: var(--_space); padding: var(--_row-y) var(--_row-x); }
      .setting .control { justify-self: end; max-width: 18em; }
      .setting .control textarea, .setting .control select[multiple] { width: 18em; max-width: 100%; }
      @container (max-width: 34em) {
        .setting { grid-template-columns: minmax(0, 1fr) auto; }
        .setting .control { grid-column: 1 / -1; justify-self: stretch; max-width: none; }
        .setting .control > * { width: 100%; }
      }
      .footer { display: flex; flex-wrap: wrap; gap: var(--_space); margin-top: var(--_section-spacing); }
    `,
  ];

  connectedCallback(): void {
    super.connectedCallback();
    this.load();
  }

  private get skey(): string {
    return this.scopeType === "global" || !this.scopeRef ? "global" : `${this.scopeType}:${this.scopeRef}`;
  }

  private async load(): Promise<void> {
    this.schema = await this.hass.callWS<SettingsSchema>({ type: "homeai/settings/schema", language: this.hass.language });
    if (!this.world) this.world = await this.hass.callWS<WorldSummary>({ type: "homeai/world/summary" });
    await this.loadScope();
  }

  private async loadScope(): Promise<void> {
    if (this.skey === "global") {
      this.scopeValues = {};
      return;
    }
    const res = await this.hass.callWS<{ values: Record<string, unknown> }>({ type: "homeai/settings/scope", scope: this.skey });
    this.scopeValues = res.values;
  }

  private targets(): { id: string; name: string }[] {
    const hass = this.hass;
    switch (this.scopeType) {
      case "floor": return (this.world?.floors ?? []).map((f) => ({ id: f.id, name: f.name }));
      case "area": return (this.world?.areas ?? []).map((a) => ({ id: a.id, name: a.name }));
      case "person": return (this.world?.persons ?? []).map((p) => ({ id: p.id, name: p.name }));
      case "device":
        return Object.values(hass.devices ?? {})
          .map((d) => ({ id: d.id, name: d.name_by_user || d.name || d.id }))
          .sort((a, b) => a.name.localeCompare(b.name));
      case "entity":
        return Object.values(hass.states)
          .map((s) => ({ id: s.entity_id, name: `${s.attributes.friendly_name ?? s.entity_id} (${s.entity_id})` }))
          .sort((a, b) => a.name.localeCompare(b.name));
      default: return [];
    }
  }

  private parse(item: SettingItem, raw: string | boolean | string[]): unknown {
    switch (item.type) {
      case "bool": return Boolean(raw);
      case "int": case "duration": return parseInt(String(raw), 10);
      case "float": return parseFloat(String(raw));
      case "multiselect": return raw;
      case "entities": case "strings": return String(raw).split(/[\n,]/).map((x) => x.trim()).filter(Boolean);
      case "json": return JSON.parse(String(raw));
      default: return raw;
    }
  }

  private async save(item: SettingItem, raw: string | boolean | string[]): Promise<void> {
    let value: unknown;
    try {
      value = this.parse(item, raw);
    } catch (err) {
      this.message = `${item.label}: ${err}`;
      return;
    }
    const scope = this.skey;
    try {
      const res = await this.hass.callWS<{ needs_confirmation?: boolean }>({ type: "homeai/settings/set", key: item.key, value, scope });
      if (res.needs_confirmation) {
        if (!confirm(`${item.label}\n\n${t(this.hass.language, "confirm_change")}`)) {
          await this.load();
          return;
        }
        await this.hass.callWS({ type: "homeai/settings/set", key: item.key, value, scope, confirmed: true });
      }
      this.message = `${item.label}: ${t(this.hass.language, "saved")}`;
    } catch (err: any) {
      this.message = err?.message ?? String(err);
    }
    await this.load();
  }

  private async reset(item: SettingItem): Promise<void> {
    await this.hass.callWS({ type: "homeai/settings/reset", key: item.key, scope: this.skey });
    await this.load();
  }

  private async resetSection(): Promise<void> {
    const section = this.schema?.sections.find((s) => s.id === this.section);
    if (!section || !confirm(`${section.label}\n\n${t(this.hass.language, "reset_section_confirm")}`)) return;
    const res = await this.hass.callWS<{ reset: number }>({ type: "homeai/settings/reset_section", section: this.section });
    this.message = `${section.label}: ${res.reset} × ${t(this.hass.language, "reset")}`;
    await this.load();
  }

  private async undo(): Promise<void> {
    if (!confirm(t(this.hass.language, "undo_confirm"))) return; // an undo can switch a protection back off
    await this.hass.callWS({ type: "homeai/settings/undo" });
    await this.load();
  }

  private async exportSettings(): Promise<void> {
    const data = await this.hass.callWS({ type: "homeai/settings/export" });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "homeai-settings.json";
    a.click();
  }

  private async importSettings(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file || !confirm(t(this.hass.language, "import_confirm"))) return;
    try {
      const data = JSON.parse(await file.text());
      const res = await this.hass.callWS<{ changed: number }>({ type: "homeai/settings/import", data });
      this.message = `${t(this.hass.language, "import")}: ${res.changed}`;
    } catch (err: any) {
      this.message = err?.message ?? String(err);
    }
    await this.load();
  }

  private async toggleHistory(): Promise<void> {
    if (this.history) {
      this.history = undefined;
      return;
    }
    const res = await this.hass.callWS<{ history: Change[] }>({ type: "homeai/settings/history", limit: 100 });
    this.history = res.history;
  }

  private input(item: SettingItem, v: unknown) {
    const onChange = (e: Event) => {
      const el = e.target as HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement;
      if (item.type === "bool") return this.save(item, el.checked);
      if (item.type === "multiselect") return this.save(item, Array.from(el.selectedOptions).map((o) => o.value));
      return this.save(item, el.value);
    };
    switch (item.type) {
      case "bool":
        return html`<input part="input" type="checkbox" .checked=${live(Boolean(v))} @change=${onChange} />`;
      case "select":
        return html`<select part="input" @change=${onChange}>${item.options.map((o) => html`<option value=${o} .selected=${live(o === v)}>${item.option_labels?.[o] ?? o}</option>`)}</select>`;
      case "multiselect":
        return html`<select part="input" multiple size=${Math.min(item.options.length, 6)} @change=${onChange}>
          ${item.options.map((o) => html`<option value=${o} .selected=${live(((v as string[]) ?? []).includes(o))}>${item.option_labels?.[o] ?? o}</option>`)}</select>`;
      case "int": case "float": case "duration":
        return html`<input part="input" type="number" class="w-m" .value=${live(String(v))} min=${item.min ?? ""} max=${item.max ?? ""}
          step=${item.step ?? (item.type === "float" ? "any" : 1)} @change=${onChange} /> ${item.unit ?? ""}`;
      case "time":
        return html`<input part="input" type="time" .value=${live(String(v))} @change=${onChange} />`;
      case "json":
        return html`<textarea part="input" .value=${live(JSON.stringify(v, null, 2))} @change=${onChange}></textarea>`;
      case "entities": case "strings":
        return html`<textarea part="input" .value=${live(((v as string[]) ?? []).join("\n"))} @change=${onChange} placeholder="one per line"></textarea>`;
      case "text":
        return html`<textarea part="input" .value=${live(String(v ?? ""))} @change=${onChange}></textarea>`;
      default:
        return html`<input part="input" type="text" .value=${live(String(v ?? ""))} @change=${onChange} />`;
    }
  }

  private scopeBar() {
    const lang = this.hass.language;
    const targets = this.targets();
    return html`<div class="pair">
      <label class="field"><span class="label">${t(lang, "scope")}</span><select part="input" @change=${(e: Event) => {
        this.scopeType = (e.target as HTMLSelectElement).value as ScopeType;
        this.scopeRef = "";
        this.loadScope();
      }}>${SCOPES.map((x) => html`<option value=${x} ?selected=${x === this.scopeType}>${t(lang, `scope_${x}`)}</option>`)}</select></label>
      ${this.scopeType === "global" ? nothing : html`<label class="field"><span class="label">\u00a0</span><select part="input" @change=${(e: Event) => {
        this.scopeRef = (e.target as HTMLSelectElement).value;
        this.loadScope();
      }}><option value="">—</option>${targets.map((x) => html`<option value=${x.id} ?selected=${x.id === this.scopeRef}>${x.name}</option>`)}</select></label>`}
    </div>`;
  }

  private historyCard() {
    const lang = this.hass.language;
    const labels = new Map((this.schema?.settings ?? []).map((x) => [x.key, x.label]));
    const show = (v: unknown) => (v === null || v === undefined ? "—" : typeof v === "object" ? JSON.stringify(v) : String(v));
    return html`<section class="section">
      <div class="section-head"><h2 part="heading" class="heading">${t(lang, "history")}</h2>
        <button part="button button-quiet" class="quiet" @click=${this.toggleHistory}>${t(lang, "close")}</button></div>
      <ul part="card list" class="list">${paged(this, "history", this.history ?? [], lang, 15).items.map((c) => html`<li part="row"><div class="item-main plain">
        <span class="item-text"><span part="row-title" class="item-title">${labels.get(c.key) ?? c.key}${c.scope !== "global" ? html` <span class="muted">(${c.scope})</span>` : nothing}</span>
          <span part="row-meta" class="item-meta">${c.key === "import" ? t(lang, "import") : c.reset ? `${show(c.old)} → ${t(lang, "default")}` : `${show(c.old)} → ${show(c.new)}`}${c.user ? ` · ${c.user}` : ""}</span></span>
        <span part="time" class="item-aside">${when(c.ts, lang)}</span></div></li>`)}</ul>
      ${paged(this, "history", this.history ?? [], lang, 15).nav}
    </section>`;
  }

  render() {
    const lang = this.hass.language;
    if (!this.hass.user.is_admin) return html`<div part="empty" class="empty">${t(lang, "admin_only")}</div>`;
    if (!this.schema) return nothing;
    const q = this.filter.toLowerCase();
    const scoped = this.skey !== "global";
    // a section that does not exist (any more) falls back to the first one
    const section = this.schema.sections.find((x) => x.id === this.section) ?? this.schema.sections[0];
    const current = section?.id ?? this.section;
    const all = this.schema.settings.filter(
      (x) =>
        (q ? `${x.label} ${x.description} ${x.key}`.toLowerCase().includes(q) : x.section === current) &&
        (this.advanced || !x.advanced || q) &&
        (this.scopeType === "global" || x.scopes.includes(this.scopeType)),
    );
    // one list of pages for each section, search and place, so changing any of them starts at its first page
    const page = paged(this, `${q ? `?${q}` : current}|${this.skey}|${this.advanced}`, all, lang, 20);
    const items = page.items;

    return html`
      <div class="tools">
        <input part="input" type="search" placeholder=${t(lang, "search")} aria-label=${t(lang, "search")} .value=${this.filter} @input=${(e: Event) => (this.filter = (e.target as HTMLInputElement).value)} />
        ${this.scopeBar()}
        <label class="check"><input part="input" type="checkbox" .checked=${this.advanced} @change=${(e: Event) => (this.advanced = (e.target as HTMLInputElement).checked)} />${t(lang, "advanced")}</label>
      </div>
      ${this.history ? this.historyCard() : nothing}
      ${this.message ? html`<div part="card" class="card muted">${this.message}</div>` : nothing}
      <div class="layout">
        ${q ? html`<div></div>` : html`<nav part="segmented" class="nav glass segmented" aria-label=${t(lang, "section")}>
          ${this.schema.sections.map((x) => html`<button part=${x.id === current ? "button button-primary" : "button"} class=${x.id === current ? "primary" : ""}
            aria-current=${x.id === current ? "true" : "false"} @click=${() => (this.section = x.id)}>${x.label}</button>`)}
        </nav>`}
        <section>
          ${q ? nothing : html`<label class="field picker section"><span class="label">${t(lang, "section")}</span>
            <select part="input" @change=${(e: Event) => (this.section = (e.target as HTMLSelectElement).value)}>
              ${this.schema.sections.map((x) => html`<option value=${x.id} ?selected=${x.id === current}>${x.label}</option>`)}</select></label>`}
          ${q || !section ? nothing : html`<div class="section-head"><h2 part="heading" class="heading">${section.label}</h2>
            ${scoped ? nothing : html`<button part="button button-quiet" class="quiet" @click=${this.resetSection}>${t(lang, "reset_section")}</button>`}</div>
            <p class="hint">${section.description}</p>`}
          ${this.scopeType !== "global" && !this.scopeRef ? html`<div part="empty" class="empty">${t(lang, "scope_pick")}</div>` : html`<ul part="card list" class="list">
            ${items.length ? nothing : html`<li class="empty">${t(lang, "scope_none")}</li>`}
            ${repeat(page.items, (item) => `${this.skey}|${item.key}`, (item) => {
              const here = scoped && item.key in this.scopeValues;
              const value = here ? this.scopeValues[item.key] : item.value;
              const count = Object.keys(item.overrides || {}).length;
              const note = here ? t(lang, "overridden") : scoped ? t(lang, "inherited") : count ? `${count} × ${t(lang, "overridden")}` : "";
              return html`<li part="row" class="setting">
                <span class="item-text"><span part="row-title" class="item-title">${item.label}</span>
                  <span part="row-meta" class="item-meta wrap">${item.description}${note ? html` · <b>${note}</b>` : nothing}</span></span>
                ${(scoped ? here : item.source !== "default") ? html`<button part="button button-quiet" class="quiet" title=${t(lang, "reset")} aria-label=${`${t(lang, "reset")}: ${item.label}`} @click=${() => this.reset(item)}>↺</button>` : html`<span></span>`}
                <span class="control">${this.input(item, value)}</span>
              </li>`;
            })}
          </ul>${page.nav}`}
          <div class="footer">
            <button part="button button-quiet" class="quiet" @click=${this.undo}>${t(lang, "undo")}</button>
            <button part="button button-quiet" class="quiet" @click=${this.toggleHistory}>${t(lang, "history")}</button>
            <button part="button button-quiet" class="quiet" @click=${this.exportSettings}>${t(lang, "export")}</button>
            <span><button part="button button-quiet" class="quiet" @click=${(e: Event) => ((e.currentTarget as HTMLElement).nextElementSibling as HTMLInputElement).click()}>${t(lang, "import")}</button><input part="input" type="file" accept="application/json,.json" hidden @change=${this.importSettings} /></span>
          </div>
        </section>
      </div>`;
  }
}
