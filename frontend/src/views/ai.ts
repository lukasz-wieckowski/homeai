import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { live } from "lit/directives/live.js";
import { element } from "../define";
import { t } from "../i18n";
import { shared } from "../styles";
import type { HomeAssistant } from "../types";

interface AIStatus {
  enabled: boolean;
  tiers?: Record<string, { model: string; provider: string; priority: number; status: string | null }[]>;
  ledger?: { today: number; month: number; calls_today: number; limits: { period: string; spent: number; limit: number }[]; allowed: boolean };
  last_prompts?: Record<string, { ts: string; model: string; purpose: string; system: string; messages: unknown[]; answer: string; cost: number }>;
}

interface Prompt { mission: string; key: string; default: string; custom: string }

@element("homeai-ai")
export class HomeAIAI extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private status?: AIStatus;
  @state() private prompts: Prompt[] = [];
  @state() private message = "";
  // What is typed into each prompt, kept across re-renders (the view re-renders on every state change in the home).
  @state() private drafts: Record<string, string> = {};

  static styles = shared;

  async connectedCallback(): Promise<void> {
    super.connectedCallback();
    if (!this.hass.user.is_admin) return;
    try {
      this.status = await this.hass.callWS<AIStatus>({ type: "homeai/ai/status" });
      await this.loadPrompts();
    } catch (err: any) {
      this.status = { enabled: false };
      this.message = err?.message ?? String(err);
    }
  }

  private async loadPrompts(): Promise<void> {
    this.prompts = (await this.hass.callWS<{ prompts: Prompt[] }>({ type: "homeai/ai/prompts" })).prompts;
  }

  private async savePrompt(p: Prompt, value: string): Promise<void> {
    try {
      await this.hass.callWS({ type: "homeai/settings/set", key: p.key, value });
      this.message = `${t(this.hass.language, `prompt_${p.mission}`)}: ${t(this.hass.language, "saved")}`;
      const { [p.mission]: _saved, ...rest } = this.drafts;
      this.drafts = rest;
    } catch (err: any) {
      this.message = err?.message ?? String(err);
    }
    await this.loadPrompts();
  }

  private async restorePrompt(p: Prompt): Promise<void> {
    await this.hass.callWS({ type: "homeai/settings/reset", key: p.key });
    this.message = `${t(this.hass.language, `prompt_${p.mission}`)}: ${t(this.hass.language, "prompt_restored")}`;
    const { [p.mission]: _restored, ...rest } = this.drafts;
    this.drafts = rest;
    await this.loadPrompts();
  }

  private promptCard(p: Prompt) {
    const lang = this.hass.language;
    const draft = this.drafts[p.mission] ?? (p.custom || p.default);
    return html`<details part="card" class="card"><summary class="row"><span part="row-title" class="item-title grow">${t(lang, `prompt_${p.mission}`)}</span>
        <span class="muted">${p.custom ? t(lang, "prompt_custom") : t(lang, "prompt_default")}</span></summary>
      <p class="muted">${t(lang, "prompt_hint")}</p>
      <textarea part="input" class="tall" .value=${live(draft)} @input=${(e: Event) => (this.drafts = { ...this.drafts, [p.mission]: (e.target as HTMLTextAreaElement).value })}></textarea>
      <div class="row actions">
        <button part="button button-primary" class="primary" @click=${() => this.savePrompt(p, draft.trim() === p.default.trim() ? "" : draft)}>${t(lang, "save")}</button>
        ${p.custom ? html`<button part="button" @click=${() => this.restorePrompt(p)}>${t(lang, "prompt_restore")}</button>` : nothing}
      </div>
      ${p.custom ? html`<details><summary class="muted">${t(lang, "prompt_show_default")}</summary><textarea part="input" readonly class="tall">${p.default}</textarea></details>` : nothing}
    </details>`;
  }

  render() {
    const lang = this.hass.language;
    if (!this.hass.user.is_admin) return html`<div part="empty" class="empty">${t(lang, "admin_only")}</div>`;
    const s = this.status;
    if (!s) return nothing;
    const tiers = Object.entries(s.tiers ?? {});
    const stat = (label: string, value: string) => html`<li part="row"><div class="item-main plain">
      <span class="item-text"><span part="row-meta" class="item-meta">${label}</span><span part="row-title" class="item-title title">${value}</span></span></div></li>`;
    return html`
      <section class="section">
        <ul part="card list" class="list">
          ${stat(t(lang, "cost_today"), `$${(s.ledger?.today ?? 0).toFixed(3)}`)}
          ${stat(t(lang, "cost_month"), `$${(s.ledger?.month ?? 0).toFixed(2)}`)}
          ${(s.ledger?.limits ?? []).map((l) => stat(t(lang, `limit_${l.period}`), `$${l.spent.toFixed(2)} / $${l.limit}`))}
        </ul>
      </section>
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${t(lang, "tiers")}</h2></div>
        ${tiers.length
          ? html`<ul part="card list" class="list">${tiers.flatMap(([tier, list]) => list.map((c) => html`<li part="row"><div class="item-main">
              <b>${tier.toUpperCase()}</b>
              <span class="item-text"><span part="row-title" class="item-title">${c.model}</span><span part="row-meta" class="item-meta">${c.provider} · ${c.priority}</span></span>
              <span part="time" class="item-aside">${c.status ?? "—"}</span></div></li>`))}</ul>`
          : html`<p class="hint">${t(lang, "no_tiers")}</p>`}
      </section>
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${t(lang, "prompts")}</h2></div>
        ${this.message ? html`<p class="hint">${this.message}</p>` : nothing}
        ${this.prompts.map((p) => this.promptCard(p))}
      </section>
      ${Object.keys(s.last_prompts ?? {}).length
        ? html`<section class="section">
            <div class="section-head"><h2 part="heading" class="heading">${t(lang, "last_prompt")}</h2></div>
            ${Object.entries(s.last_prompts ?? {}).map(
              ([tier, p]) => html`<details part="card" class="card"><summary class="row"><span part="row-title" class="item-title grow">${tier.toUpperCase()} · ${p.model} · ${p.purpose}</span>
                <span class="muted">$${p.cost.toFixed(4)}</span></summary>
                <p class="muted">${p.ts}</p><textarea part="input" readonly>${JSON.stringify(p.messages, null, 2)}</textarea><textarea part="input" readonly>${p.answer}</textarea></details>`,
            )}
          </section>`
        : nothing}`;
  }
}
