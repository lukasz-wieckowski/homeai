import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { element } from "../define";
import { t, when } from "../i18n";
import { shared } from "../styles";
import type { HomeAssistant } from "../types";

interface Proposal { id: string; title: string; days_seen: number; days_possible: number }
interface Fact { id: string; text: string; scope: string; source: string; approved: boolean; created: string }
interface Review { ts: string; text: string }

@element("homeai-learning")
export class HomeAILearning extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private proposals: Proposal[] = [];
  @state() private facts: Fact[] = [];
  @state() private reviews: Review[] = [];
  @state() private draft = "";

  static styles = shared;

  connectedCallback(): void {
    super.connectedCallback();
    this.load();
  }

  private async load(): Promise<void> {
    const res = await this.hass.callWS<{ proposals: Proposal[]; facts: Fact[]; reviews: Review[] }>({ type: "homeai/learning/status" });
    this.proposals = res.proposals;
    this.facts = res.facts;
    this.reviews = res.reviews;
  }

  private async call(type: string, data: Record<string, unknown>): Promise<void> {
    await this.hass.callWS({ type, ...data });
    await this.load();
  }

  private async remember(): Promise<void> {
    if (!this.draft.trim()) return;
    await this.call("homeai/memory/add", { text: this.draft });
    this.draft = "";
  }

  render() {
    const lang = this.hass.language;
    const scopeName = (f: Fact) => (f.scope === "home" ? t(lang, "memory_home")
      : this.hass.states[f.scope.replace(/^person:/, "")]?.attributes.friendly_name ?? f.scope);
    return html`
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${t(lang, "proposals")}${this.proposals.length ? html` <span class="count">${this.proposals.length}</span>` : nothing}</h2></div>
        ${this.proposals.length
          ? html`<ul part="card list" class="list">${this.proposals.map((p) => html`<li part="row" class="open">
              <div class="item-main plain"><span class="item-text"><span part="row-title" class="item-title">${p.title}</span>
                <span part="row-meta" class="item-meta">${p.days_seen} ${t(lang, "days_of")} ${p.days_possible} ${t(lang, "days_word")}</span></span></div>
              <div class="item-more flush"><div class="item-actions end">
                <button part="button" @click=${() => this.call("homeai/learning/reject", { proposal_id: p.id })}>${t(lang, "deny")}</button>
                <button part="button button-primary" class="primary" @click=${() => this.call("homeai/learning/approve", { proposal_id: p.id })}>${t(lang, "approve")}</button>
              </div></div></li>`)}</ul>`
          : html`<p class="hint">${t(lang, "no_proposals")}</p>`}
      </section>
      <section class="section">
        <div class="section-head"><h2 part="heading" class="heading">${t(lang, "memory")}${this.facts.length ? html` <span class="count">${this.facts.length}</span>` : nothing}</h2></div>
        <ul part="card list" class="list">
          <li part="row"><div class="item-main plain">
            <input part="input" .value=${this.draft} placeholder=${t(lang, "remember_hint")} aria-label=${t(lang, "remember_hint")}
              @input=${(e: Event) => (this.draft = (e.target as HTMLInputElement).value)} @keydown=${(e: KeyboardEvent) => e.key === "Enter" && this.remember()} />
            <button part="button" ?disabled=${!this.draft.trim()} @click=${this.remember}>${t(lang, "remember")}</button>
          </div></li>
          ${this.facts.map((f) => html`<li part="row"><div class="item-main plain">
            <span class="item-text"><span part="row-title" class="item-title">${f.text}</span>
              <span part="row-meta" class="item-meta">${scopeName(f)} · ${t(lang, `memory_from_${f.source}`)}</span></span>
            <span class="item-actions">
              ${f.approved ? nothing : html`<button part="button" @click=${() => this.call("homeai/memory/approve", { fact_id: f.id })}>${t(lang, "approve")}</button>`}
              <button part="button button-quiet" class="quiet" aria-label=${`${t(lang, "remove")}: ${f.text}`} @click=${() => this.call("homeai/memory/remove", { fact_id: f.id })}>${t(lang, "remove")}</button>
            </span></div></li>`)}
        </ul>
      </section>
      ${this.reviews.length
        ? html`<section class="section">
            <div class="section-head"><h2 part="heading" class="heading">${t(lang, "review")}</h2><span class="muted">${when(this.reviews[0].ts, lang)}</span></div>
            <div part="card" class="card"><p class="pre-line">${this.reviews[0].text}</p></div>
          </section>`
        : nothing}
    `;
  }
}
