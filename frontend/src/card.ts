import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { element } from "./define";
import { clock, dayLabel, homeDay, shortWhen, t } from "./i18n";
import { PARTS, shared } from "./styles";
import type { HomeAssistant } from "./types";
import "./views/chat";

interface CardConfig { type: string; entity?: string; title?: string; min_severity?: number }
interface Item { id: string; title: string; severity: number; since: string; acknowledged: boolean; repairing: boolean; who: string | null }

// Lovelace card: open situations with quick reactions. Reads sensor.homeai_situations; no setup needed.
@element("homeai-situations-card")
export class HomeAISituationsCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private config: CardConfig = { type: "custom:homeai-situations-card" };

  static styles = shared;

  setConfig(config: CardConfig): void {
    this.config = { entity: "sensor.homeai_situations", min_severity: 1, ...config };
  }

  getCardSize(): number {
    return 3;
  }

  static getStubConfig(): CardConfig {
    return { type: "custom:homeai-situations-card" };
  }

  @state() private expanded: string | null = null;

  private act(service: string, id: string): void {
    this.hass.callService("homeai", service, { situation_id: id });
  }

  render() {
    if (!this.hass) return nothing;
    const lang = this.hass.language;
    const tz = this.hass.config?.time_zone;
    const entity = this.hass.states[this.config.entity ?? "sensor.homeai_situations"];
    const items = ((entity?.attributes.situations ?? []) as Item[]).filter((s) => s.severity >= (this.config.min_severity ?? 1));
    return html`<div part="card" class="card flush">
      ${this.config.title ? html`<div part="title" class="title card-title">${this.config.title}</div>` : nothing}
      ${items.length
        ? html`<ul part="list" class="list bare">${items.map((s) => {
            const open = this.expanded === s.id;
            return html`<li part="row" class=${open ? "open" : ""}>
              <button class="item-main" aria-expanded=${open ? "true" : "false"} @click=${() => (this.expanded = open ? null : s.id)}>
                <span part="badge badge-${s.severity}" class="dot sev-${s.severity}"></span>
                <span class="item-text"><span part="row-title" class="item-title">${s.title}</span>
                  ${s.repairing ? html`<span part="row-meta" class="item-meta">${t(lang, "repairing")}</span>` : nothing}</span>
                <span part="time" class="item-aside">${shortWhen(s.since, lang, tz)}</span>
              </button>
              ${open
                ? html`<div class="item-more"><div class="item-actions">
                    <button part="button button-primary" class="primary" @click=${() => this.act("handle", s.id)}>${t(lang, "handle")}</button>
                    <button part="button" @click=${() => this.act("acknowledge", s.id)} ?disabled=${s.acknowledged}>${t(lang, "ack")}</button>
                    <button part="button" @click=${() => this.act("snooze", s.id)}>${t(lang, "snooze")}</button>
                  </div></div>`
                : nothing}
            </li>`;
          })}</ul>`
        : html`<div part="empty" class="empty">${t(lang, "nothing_open")}</div>`}
    </div>`;
  }
}

interface PlanCardConfig { type: string; title?: string; days?: number; limit?: number }

// Lovelace card: what the home's plan does next. Reads the plan through the WebSocket API.
@element("homeai-plan-card")
export class HomeAIPlanCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private config: PlanCardConfig = { type: "custom:homeai-plan-card" };
  @state() private occurrences: { at: string; title: string }[] = [];
  private timer?: number;

  static styles = shared;

  setConfig(config: PlanCardConfig): void {
    this.config = { days: 2, limit: 6, ...config };
  }

  getCardSize(): number {
    return 2 + Math.min(this.occurrences.length, this.config.limit ?? 6);
  }

  static getStubConfig(): PlanCardConfig {
    return { type: "custom:homeai-plan-card" };
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.timer = window.setInterval(() => this.load(), 5 * 60 * 1000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearInterval(this.timer);
  }

  protected firstUpdated(): void {
    this.load();
  }

  private async load(): Promise<void> {
    if (!this.hass) return;
    try {
      const res = await this.hass.callWS<{ occurrences: { at: string; title: string }[] }>({ type: "homeai/plan/list", days: this.config.days ?? 2 });
      this.occurrences = res.occurrences;
    } catch {
      this.occurrences = [];
    }
  }

  render() {
    if (!this.hass) return nothing;
    const lang = this.hass.language;
    const tz = this.hass.config?.time_zone;
    const items = this.occurrences.slice(0, this.config.limit ?? 6);
    const rows: unknown[] = [];
    let last = homeDay(Date.now(), tz);
    for (const o of items) {
      const day = homeDay(o.at, tz);
      if (day !== last) {
        rows.push(html`<li part="day" class="day">${dayLabel(o.at, lang, tz)}</li>`);
        last = day;
      }
      rows.push(html`<li part="row"><div class="item-main timed"><span part="time" class="time">${clock(o.at, lang, tz)}</span>
        <span class="item-text"><span part="row-title" class="item-title">${o.title}</span></span><span></span></div></li>`);
    }
    return html`<div part="card" class="card flush">
      <div part="title" class="title card-title">${this.config.title ?? t(lang, "plan_next")}</div>
      ${items.length ? html`<ul part="list" class="list bare">${rows}</ul>` : html`<div part="empty" class="empty">${t(lang, "no_plan")}</div>`}
    </div>`;
  }
}

interface ChatCardConfig { type: string; title?: string }

// Lovelace card: talk to HomeAI in your own account, right on a dashboard.
@element("homeai-chat-card")
export class HomeAIChatCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private config: ChatCardConfig = { type: "custom:homeai-chat-card" };

  static styles = shared;

  setConfig(config: ChatCardConfig): void {
    this.config = { ...config };
  }

  getCardSize(): number {
    return 6;
  }

  static getStubConfig(): ChatCardConfig {
    return { type: "custom:homeai-chat-card" };
  }

  render() {
    if (!this.hass) return nothing;
    return html`<div part="card" class="card">
      ${this.config.title ? html`<div part="title" class="title spaced">${this.config.title}</div>` : nothing}
      <homeai-chat exportparts=${PARTS} .hass=${this.hass} compact storage-key="homeai-chat-card"></homeai-chat>
    </div>`;
  }
}

declare global {
  interface Window { customCards?: { type: string; name: string; description: string; preview?: boolean }[] }
}

const CARDS = [
  { type: "homeai-situations-card", name: "HomeAI situations", description: "Open situations from HomeAI with quick reactions.", preview: true },
  { type: "homeai-plan-card", name: "HomeAI plan", description: "What the home's plan does next.", preview: true },
  { type: "homeai-chat-card", name: "HomeAI chat", description: "Talk to HomeAI in your own account.", preview: false },
];

window.customCards = window.customCards || [];
for (const card of CARDS) {
  if (!window.customCards.some((c) => c.type === card.type)) window.customCards.push(card);
}
