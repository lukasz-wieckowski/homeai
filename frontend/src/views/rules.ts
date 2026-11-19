import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { element } from "../define";
import { t } from "../i18n";
import { shared } from "../styles";
import type { HomeAssistant } from "../types";

interface Rule {
  id: string;
  name: string;
  enabled: boolean;
  target: { entities: string[]; label: string | null; area: string | null; domain: string | null };
  condition: { type: string; value?: string | number };
  minutes: number;
  severity: number;
  category: string;
  need: string;
  advice: string;
  when: string;
  mode: string;
  firing?: boolean;
}

const EMPTY: Rule = {
  id: "", name: "", enabled: true, target: { entities: [], label: null, area: null, domain: null },
  condition: { type: "state", value: "on" }, minutes: 10, severity: 1, category: "info", need: "member",
  advice: "", when: "always", mode: "each",
};
const CONDITIONS = ["state", "not_state", "above", "below", "unavailable"];
const CATEGORIES = ["safety", "security", "damage", "system", "energy", "comfort", "maintenance", "info"];
const NEEDS = ["nobody", "member", "admin", "service"];
const WHEN = ["always", "night", "away", "home"];

// Custom detectors without code: the backend validates every rule again on save.
@element("homeai-rules")
export class HomeAIRules extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private rules: Rule[] = [];
  @state() private editing?: Rule;
  @state() private preview?: { covered: { entity_id: string; name: string }[]; meeting: string[] };
  @state() private error = "";

  static styles = shared;

  connectedCallback(): void {
    super.connectedCallback();
    this.load();
  }

  private async load(): Promise<void> {
    const res = await this.hass.callWS<{ rules: Rule[] }>({ type: "homeai/rules/list" });
    this.rules = res.rules;
  }

  private async saveAll(rules: Rule[]): Promise<void> {
    this.error = "";
    try {
      await this.hass.callWS({ type: "homeai/rules/save", rules: rules.map(({ firing, ...r }) => r) });
      this.editing = undefined;
      this.preview = undefined;
      await this.load();
    } catch (err: any) {
      this.error = err?.message ?? String(err);
    }
  }

  private async save(): Promise<void> {
    const rule = this.editing!;
    if (!rule.id) {
      const base = rule.name.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 36) || "rule";
      const taken = new Set(this.rules.map((r) => r.id));
      let id = base;
      for (let n = 2; taken.has(id); n++) id = `${base}_${n}`; // a second rule with the same name never replaces the first
      rule.id = id;
    }
    const others = this.rules.filter((r) => r.id !== rule.id);
    await this.saveAll([...others, rule]);
  }

  private async previewRule(): Promise<void> {
    this.error = "";
    try {
      this.preview = await this.hass.callWS({ type: "homeai/rules/preview", rule: this.editing });
    } catch (err: any) {
      this.error = err?.message ?? String(err);
    }
  }

  private set(path: string, value: unknown): void {
    const rule = structuredClone(this.editing!) as any;
    const keys = path.split(".");
    let node = rule;
    for (const k of keys.slice(0, -1)) node = node[k];
    node[keys[keys.length - 1]] = value;
    this.editing = rule;
  }

  private field(label: string, input: unknown) {
    return html`<label class="field"><span class="label">${label}</span>${input}</label>`;
  }

  private close(): void {
    this.editing = undefined;
    this.preview = undefined;
    this.error = "";
  }

  protected updated(): void {
    const dialog = this.renderRoot.querySelector("dialog");
    if (dialog && !dialog.open) dialog.showModal();
  }

  private async removeRule(rule: Rule): Promise<void> {
    if (!confirm(`${rule.name}\n\n${t(this.hass.language, "remove_confirm")}`)) return;
    await this.saveAll(this.rules.filter((x) => x.id !== rule.id));
  }

  private select(path: string, value: string, options: string[]) {
    return html`<select part="input" @change=${(e: Event) => this.set(path, (e.target as HTMLSelectElement).value)}>
      ${options.map((o) => html`<option value=${o} ?selected=${o === value}>${t(this.hass.language, `rule_${o}`)}</option>`)}</select>`;
  }

  private renderEditor() {
    const lang = this.hass.language;
    const r = this.editing!;
    const areas = Object.values((this.hass as any).areas ?? {}) as { area_id: string; name: string }[];
    const known = this.rules.some((x) => x.id === r.id);
    return html`<dialog part="sheet" class="card sheet" aria-labelledby="sheet-title" @close=${this.close}>
      <div class="sheet-head"><h2 id="sheet-title" part="title" class="title">${t(lang, known ? "rule_change" : "rule_new")}</h2></div>
      <div class="sheet-body fields">
        ${this.field(t(lang, "rule_name"), html`<input part="input" .value=${r.name} @input=${(e: Event) => this.set("name", (e.target as HTMLInputElement).value)} />`)}
        ${this.field(t(lang, "rule_entities"), html`<textarea part="input" .value=${r.target.entities.join("\n")} placeholder="sensor.freezer"
          @change=${(e: Event) => this.set("target.entities", (e.target as HTMLTextAreaElement).value.split(/[\n,]/).map((x) => x.trim()).filter(Boolean))}></textarea>`)}
        <div class="pair">
          ${this.field(t(lang, "rule_area"), html`<select part="input" @change=${(e: Event) => this.set("target.area", (e.target as HTMLSelectElement).value || null)}>
            <option value="">—</option>${areas.map((a) => html`<option value=${a.area_id} ?selected=${a.area_id === r.target.area}>${a.name}</option>`)}</select>`)}
          ${this.field(t(lang, "rule_label"), html`<input part="input" .value=${r.target.label ?? ""} @input=${(e: Event) => this.set("target.label", (e.target as HTMLInputElement).value || null)} />`)}
          ${this.field(t(lang, "rule_domain"), html`<input part="input" .value=${r.target.domain ?? ""} placeholder="sensor" @input=${(e: Event) => this.set("target.domain", (e.target as HTMLInputElement).value || null)} />`)}
        </div>
        <div class="pair">
          ${this.field(t(lang, "rule_condition"), this.select("condition.type", r.condition.type, CONDITIONS))}
          ${r.condition.type === "unavailable" ? nothing : this.field("\u00a0", html`<input part="input" .value=${String(r.condition.value ?? "")}
            @input=${(e: Event) => this.set("condition.value", (e.target as HTMLInputElement).value)} />`)}
          ${this.field(`${t(lang, "rule_minutes")} (min)`, html`<input part="input" type="number" min="0" max="10080" .value=${String(r.minutes)}
            @change=${(e: Event) => this.set("minutes", Number((e.target as HTMLInputElement).value))} />`)}
        </div>
        <div class="pair">
          ${this.field(t(lang, "rule_when"), this.select("when", r.when, WHEN))}
          ${this.field(t(lang, "rule_mode"), this.select("mode", r.mode, ["each", "all"]))}
        </div>
        <div class="pair">
          ${this.field(t(lang, "rule_category"), this.select("category", r.category, CATEGORIES))}
          ${this.field(t(lang, "severity"), html`<input part="input" type="number" min="0" max=${r.category === "safety" ? 4 : 3} .value=${String(r.severity)}
            @change=${(e: Event) => this.set("severity", Number((e.target as HTMLInputElement).value))} />`)}
          ${this.field(t(lang, "who"), this.select("need", r.need, NEEDS))}
        </div>
        ${this.field(t(lang, "rule_advice"), html`<textarea part="input" .value=${r.advice} @change=${(e: Event) => this.set("advice", (e.target as HTMLTextAreaElement).value)}></textarea>`)}
        <label class="check"><input part="input" type="checkbox" .checked=${r.enabled} @change=${(e: Event) => this.set("enabled", (e.target as HTMLInputElement).checked)} />${t(lang, "rule_enabled")}</label>
        ${this.preview ? html`<p class="muted">${t(lang, "rule_covers")}: ${this.preview.covered.length} · ${t(lang, "rule_meeting")}: ${this.preview.meeting.map((id) => this.preview!.covered.find((c) => c.entity_id === id)?.name ?? id).join(", ") || "—"}</p>` : nothing}
        ${this.error ? html`<div part="error" class="error">${this.error}</div>` : nothing}
      </div>
      <div class="sheet-foot">
        ${known ? html`<button part="button button-quiet" class="quiet danger" @click=${() => this.removeRule(r)}>${t(lang, "remove")}</button>` : nothing}
        <button part="button button-quiet" class="quiet" @click=${this.previewRule}>${t(lang, "rule_preview")}</button>
        <span class="grow"></span>
        <button part="button" @click=${this.close}>${t(lang, "cancel")}</button>
        <button part="button button-primary" class="primary" @click=${this.save}>${t(lang, "save")}</button>
      </div>
    </dialog>`;
  }

  render() {
    const lang = this.hass.language;
    if (!this.hass.user.is_admin) return html`<div part="empty" class="empty">${t(lang, "admin_only")}</div>`;
    return html`
      ${this.editing ? this.renderEditor() : nothing}
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${t(lang, "rules")}${this.rules.length ? html` <span class="count">${this.rules.length}</span>` : nothing}</h2>
          <button part="button button-primary" class="primary" @click=${() => { this.editing = structuredClone(EMPTY); this.preview = undefined; }}>${t(lang, "rule_add")}</button></div>
        ${!this.editing && this.error ? html`<div part="card error" class="card error">${this.error}</div>` : nothing}
        ${this.rules.length
          ? html`<ul part="card list" class="list">${this.rules.map((r) => html`<li part="row">
              <button class="item-main" @click=${() => { this.editing = structuredClone(r); this.preview = undefined; }}>
                <span part="badge badge-${r.severity}" class="dot sev-${r.severity}"></span>
                <span class="item-text"><span part="row-title" class="item-title ${r.enabled ? "" : "off"}">${r.name}</span>
                  <span part="row-meta" class="item-meta">${t(lang, `rule_${r.condition.type}`)}${r.condition.type === "unavailable" ? "" : ` ${r.condition.value ?? ""}`} · ${r.minutes} min · ${t(lang, `rule_${r.when}`)}${r.enabled ? "" : ` · ${t(lang, "rule_off")}`}${r.firing ? ` · ${t(lang, "rule_firing")}` : ""}</span></span>
                <span class="chevron">›</span>
              </button></li>`)}</ul>`
          : html`<div part="empty" class="empty">${t(lang, "no_rules")}</div>`}
      </section>
    `;
  }
}
