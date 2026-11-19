import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import { element } from "../define";
import { clock, dayLabel, homeDay, t } from "../i18n";
import { shared } from "../styles";
import type { HomeAssistant, JournalEntry } from "../types";

@element("homeai-journal")
export class HomeAIJournal extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private entries: JournalEntry[] = [];

  static styles = shared;

  async connectedCallback(): Promise<void> {
    super.connectedCallback();
    try {
      const res = await this.hass.callWS<{ entries: JournalEntry[] }>({ type: "homeai/journal/recent", limit: 200 });
      this.entries = res.entries;
    } catch {
      this.entries = [];
    }
  }

  render() {
    const lang = this.hass.language;
    const tz = this.hass.config?.time_zone;
    if (!this.entries.length) return html`<div part="empty" class="empty">—</div>`;
    const rows: unknown[] = [];
    let last = "";
    for (const e of this.entries) {
      const day = homeDay(e.ts, tz);
      if (day !== last) {
        rows.push(html`<li part="day" class="day">${dayLabel(e.ts, lang, tz)}</li>`);
        last = day;
      }
      rows.push(html`<li part="row"><div class="item-main timed">
        <span part="time" class="time">${clock(e.ts, lang, tz)}</span>
        <span class="item-text"><span part="row-title" class="item-title">${e.text}</span>
          <span part="row-meta" class="item-meta">${t(lang, `kind_${e.kind}`).replace(/^kind_/, "")}</span></span>
        <span></span></div></li>`);
    }
    return html`<ul part="card list" class="list">${rows}</ul>`;
  }
}
