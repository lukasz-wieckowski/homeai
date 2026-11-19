import { LitElement, css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { element } from "./define";
import { t } from "./i18n";
import { PARTS, shared } from "./styles";
import type { HomeAssistant } from "./types";
import "./views/situations";
import "./views/approvals";
import "./views/plan";
import "./views/journal";
import "./views/settings";
import "./views/ai";
import "./views/learning";
import "./views/rules";
import "./views/chat";
import "./views/presence";

const TABS = ["situations", "approvals", "chat", "plan", "presence", "learning", "rules", "journal", "settings", "ai"] as const;
type Tab = (typeof TABS)[number];

@element("homeai-panel")
export class HomeAIPanel extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @state() private tab: Tab = "situations";

  static styles = [
    shared,
    css`
      :host { background: var(--_background); min-height: 100%; }
      /* the navigation layer stays on top while the content scrolls underneath, blurred by the glass */
      .top { position: sticky; top: 0; z-index: 2; }
      .toolbar { display: flex; align-items: center; height: var(--homeai-header-height, var(--header-height));
        padding: 0 var(--_space-l); gap: var(--_space); background: var(--_header-background); color: var(--_header-text);
        backdrop-filter: var(--_glass-filter); -webkit-backdrop-filter: var(--_glass-filter);
        border-bottom: var(--_border-width) solid var(--_glass-border); }
      .toolbar h1 { font-family: var(--_font-family); font-size: var(--_header-font-size);
        font-weight: var(--_header-font-weight); margin: 0; flex: 1; }
      /* the tabs: one floating glass capsule; the open tab is prominent */
      .tabbar { display: flex; justify-content: center; padding: var(--_space) var(--_space-l); pointer-events: none; }
      .tabs { pointer-events: auto; flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none;
        border-radius: var(--_button-radius); }
      .tabs::-webkit-scrollbar { display: none; }
      .tabs button { white-space: nowrap; }
      .tabs button.active { background: var(--_button-prominent-background); color: var(--_on-accent);
        box-shadow: var(--_button-prominent-shadow); }
      main { padding: 0 var(--_content-padding) var(--_content-padding); max-width: var(--homeai-content-max-width, 68em);
        margin: 0 auto; }
    `,
  ];

  connectedCallback(): void {
    super.connectedCallback();
    const wanted = new URLSearchParams(location.search).get("tab") as Tab | null;
    if (wanted && TABS.includes(wanted)) this.tab = wanted;
  }

  private view() {
    switch (this.tab) {
      case "approvals": return html`<homeai-approvals exportparts=${PARTS} .hass=${this.hass}></homeai-approvals>`;
      case "plan": return html`<homeai-plan exportparts=${PARTS} .hass=${this.hass}></homeai-plan>`;
      case "journal": return html`<homeai-journal exportparts=${PARTS} .hass=${this.hass}></homeai-journal>`;
      case "settings": return html`<homeai-settings exportparts=${PARTS} .hass=${this.hass}></homeai-settings>`;
      case "ai": return html`<homeai-ai exportparts=${PARTS} .hass=${this.hass}></homeai-ai>`;
      case "learning": return html`<homeai-learning exportparts=${PARTS} .hass=${this.hass}></homeai-learning>`;
      case "rules": return html`<homeai-rules exportparts=${PARTS} .hass=${this.hass}></homeai-rules>`;
      case "chat": return html`<homeai-chat exportparts=${PARTS} .hass=${this.hass}></homeai-chat>`;
      case "presence": return html`<homeai-presence exportparts=${PARTS} .hass=${this.hass}></homeai-presence>`;
      default: return html`<homeai-situations exportparts=${PARTS} .hass=${this.hass}></homeai-situations>`;
    }
  }

  render() {
    if (!this.hass) return html``;
    const lang = this.hass.language;
    return html`
      <div class="top">
        <div part="header" class="toolbar">
          <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
          <h1 part="header-title">HomeAI</h1>
        </div>
        <div class="tabbar">
          <nav part="tabs" class="tabs segmented glass" role="tablist">
            ${TABS.map((tab) => html`<button part=${tab === this.tab ? "tab tab-active" : "tab"} class=${tab === this.tab ? "active" : ""} role="tab" aria-selected=${tab === this.tab ? "true" : "false"} @click=${() => (this.tab = tab)}>${t(lang, tab)}</button>`)}
          </nav>
        </div>
      </div>
      <main part="content">${this.view()}</main>
    `;
  }
}
