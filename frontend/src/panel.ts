import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { element } from "./define";
import { t } from "./i18n";
import { PARTS, shared } from "./styles";
import type { HomeAssistant } from "./types";
import "./views/situations";
import "./views/plan";
import "./views/journal";
import "./views/settings";
import "./views/ai";
import "./views/learning";
import "./views/rules";
import "./views/chat";
import "./views/presence";

// HomeAI adds up to four panels to the sidebar, all drawn by this element; `panel.config.view` says which one.
// A panel with more than one tab shows them in its top bar.
type View = "situations" | "plan" | "chat" | "manage";
type Tab = "situations" | "plan" | "presence" | "chat" | "learning" | "journal" | "rules" | "settings" | "ai";

const TABS: Record<View, Tab[]> = {
  situations: ["situations"],
  plan: ["plan", "presence"],
  chat: ["chat"],
  manage: ["learning", "journal", "rules", "settings", "ai"],
};
const ADMIN_TABS: Tab[] = ["rules", "settings", "ai"];
const ICONS: Record<Tab, string> = {
  situations: "mdi:home-heart",
  plan: "mdi:calendar-clock",
  presence: "mdi:account-clock-outline",
  chat: "mdi:message-text-outline",
  learning: "mdi:school-outline",
  journal: "mdi:notebook-outline",
  rules: "mdi:format-list-checks",
  settings: "mdi:tune-variant",
  ai: "mdi:creation-outline",
};
// Paths of the other panels, for links from before the panels were split (`/homeai?tab=plan`).
const PATHS: Record<View, string> = { situations: "/homeai", plan: "/homeai-plan", chat: "/homeai-chat", manage: "/homeai-manage" };
// Views that read best as one column of text
const READING: Tab[] = ["situations", "presence", "chat", "learning", "journal", "rules"];

@element("homeai-panel")
export class HomeAIPanel extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) panel?: { title?: string | null; config?: { view?: View } };
  @state() private tab?: Tab;

  static styles = [
    shared,
    css`
      :host { background: var(--_background); min-height: 100%; container-type: inline-size; }
      /* the navigation layer stays on top while the content scrolls underneath, blurred by the glass */
      .toolbar { position: sticky; top: 0; z-index: 2; display: flex; flex-wrap: wrap; align-items: center;
        column-gap: var(--_space); min-height: var(--homeai-header-height, var(--header-height));
        padding: 0 var(--_space-l); background: var(--_header-background); color: var(--_header-text);
        backdrop-filter: var(--_glass-filter); -webkit-backdrop-filter: var(--_glass-filter);
        border-bottom: var(--_border-width) solid var(--_glass-border); box-sizing: border-box; }
      .toolbar h1 { font-family: var(--_font-family); font-size: var(--_header-font-size);
        font-weight: var(--_header-font-weight); margin: 0; flex: 1 1 auto; min-width: 0;
        min-height: var(--homeai-header-height, var(--header-height)); display: flex; align-items: center;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      /* the tabs: one glass capsule beside the title, or under it when there is no room */
      .tabs { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; margin: var(--_space-s) 0; }
      .tabs::-webkit-scrollbar { display: none; }
      .tabs button { display: inline-flex; align-items: center; gap: var(--_space-s); white-space: nowrap; }
      .tabs button.active { background: var(--_button-prominent-background); color: var(--_on-accent);
        box-shadow: var(--_button-prominent-shadow); }
      .tabs ha-icon { display: none; }
      @container (max-width: 36em) {
        .tabs { order: 3; flex: 1 0 100%; margin: 0 0 var(--_space); }
        .tabs button { flex: 1 1 0; justify-content: center; }
        /* many tabs on a phone: icons, with the name for screen readers */
        .tabs.many ha-icon { display: inline-flex; }
        .tabs.many .label { position: absolute; width: 1em; height: 1em; overflow: hidden; clip-path: inset(50%);
          white-space: nowrap; }
      }
      main { box-sizing: border-box; max-width: var(--homeai-content-max-width, 68em); margin: 0 auto;
        padding: var(--_space-l) var(--_content-padding) var(--_section-spacing); }
      main.reading { max-width: calc(var(--_reading-width) + var(--_content-padding) * 2); }
      main.chat { display: flex; flex-direction: column; padding-bottom: 0;
        min-height: calc(100dvh - var(--header-height) - var(--safe-area-inset-top, 0) - var(--safe-area-inset-bottom, 0)); }
      main.chat homeai-chat { flex: 1 1 auto; }
    `,
  ];

  private get view(): View {
    const view = this.panel?.config?.view;
    return view && view in TABS ? view : "situations";
  }

  private tabs(): Tab[] {
    return TABS[this.view].filter((tab) => this.hass?.user?.is_admin || !ADMIN_TABS.includes(tab));
  }

  protected firstUpdated(): void {
    const wanted = new URLSearchParams(location.search).get("tab");
    if (!wanted) return;
    if ((TABS[this.view] as string[]).includes(wanted)) {
      this.tab = wanted as Tab;
      return;
    }
    // a link from before the panels were split (`/homeai?tab=plan`): open the panel that has this tab now
    const home = (Object.keys(TABS) as View[]).find((v) => (TABS[v] as string[]).includes(wanted)) ?? (wanted === "approvals" ? "situations" : undefined);
    if (!home || home === this.view || !this.panel?.config?.view) return;
    history.replaceState(null, "", home === "situations" ? PATHS[home] : `${PATHS[home]}?tab=${wanted}`);
    window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: true } }));
  }

  private select(tab: Tab): void {
    this.tab = tab;
    const url = new URL(location.href);
    url.searchParams.set("tab", tab);
    history.replaceState(history.state, "", url);
  }

  private content(tab: Tab) {
    switch (tab) {
      case "plan": return html`<homeai-plan exportparts=${PARTS} .hass=${this.hass}></homeai-plan>`;
      case "presence": return html`<homeai-presence exportparts=${PARTS} .hass=${this.hass}></homeai-presence>`;
      case "chat": return html`<homeai-chat exportparts=${PARTS} .hass=${this.hass} fill></homeai-chat>`;
      case "learning": return html`<homeai-learning exportparts=${PARTS} .hass=${this.hass}></homeai-learning>`;
      case "journal": return html`<homeai-journal exportparts=${PARTS} .hass=${this.hass}></homeai-journal>`;
      case "rules": return html`<homeai-rules exportparts=${PARTS} .hass=${this.hass}></homeai-rules>`;
      case "settings": return html`<homeai-settings exportparts=${PARTS} .hass=${this.hass}></homeai-settings>`;
      case "ai": return html`<homeai-ai exportparts=${PARTS} .hass=${this.hass}></homeai-ai>`;
      default: return html`<homeai-situations exportparts=${PARTS} .hass=${this.hass}></homeai-situations>`;
    }
  }

  render() {
    if (!this.hass) return html``;
    const lang = this.hass.language;
    const tabs = this.tabs();
    const tab = this.tab && tabs.includes(this.tab) ? this.tab : tabs[0];
    const title = this.panel?.title || t(lang, this.view);
    return html`
      <div part="header" class="toolbar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <h1 part="header-title">${title}</h1>
        ${tabs.length > 1
          ? html`<nav part="tabs" class="tabs segmented glass ${tabs.length > 3 ? "many" : ""}" role="tablist">
              ${tabs.map((x) => html`<button part=${x === tab ? "tab tab-active" : "tab"} class=${x === tab ? "active" : ""} role="tab"
                aria-selected=${x === tab ? "true" : "false"} aria-label=${t(lang, x)} @click=${() => this.select(x)}>
                <ha-icon part="tab-icon" .icon=${ICONS[x]}></ha-icon><span part="tab-label" class="label">${t(lang, x)}</span></button>`)}
            </nav>`
          : nothing}
      </div>
      <main part="content" class=${tab === "chat" ? "chat" : READING.includes(tab) ? "reading" : ""}>${this.content(tab)}</main>
    `;
  }
}
