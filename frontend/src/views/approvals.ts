import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import { element } from "../define";
import { t, when } from "../i18n";
import { shared } from "../styles";
import type { Approval, HomeAssistant } from "../types";

@element("homeai-approvals")
export class HomeAIApprovals extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private pending: Approval[] = [];
  @state() private recent: Approval[] = [];
  @state() private error = "";
  private unsub?: () => void;

  static styles = shared;

  async connectedCallback(): Promise<void> {
    super.connectedCallback();
    try {
      const unsub = await this.hass.connection.subscribeMessage<{ pending: Approval[] }>(
        (msg) => (this.pending = msg.pending),
        { type: "homeai/approvals/subscribe" },
      );
      if (!this.isConnected) return unsub(); // the tab was left while subscribing
      this.unsub = unsub;
      const list = await this.hass.callWS<{ recent: Approval[] }>({ type: "homeai/approvals/list" });
      this.recent = list.recent.filter((a) => a.status !== "pending");
    } catch (err: any) {
      this.error = err?.message ?? String(err);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsub?.();
    this.unsub = undefined;
  }

  private async decide(verb: "approve" | "deny", a: Approval): Promise<void> {
    this.error = "";
    try {
      await this.hass.callWS({ type: `homeai/approvals/${verb}`, approval_id: a.id });
    } catch (err: any) {
      this.error = err?.message ?? String(err);
    }
  }

  render() {
    const lang = this.hass.language;
    return html`
      ${this.error ? html`<div part="card error" class="card error">${this.error}</div>` : ""}
      ${this.pending.length
        ? this.pending.map(
            (a) => html`<div part="card" class="card">
              <div class="row"><span part="badge badge-${Math.min(a.risk, 4)}" class="sev sev-${Math.min(a.risk, 4)}">R${a.risk}</span><span part="title" class="title grow">${a.what}</span>
                <span class="muted">${t(lang, "expires")} ${when(a.expires, lang)}</span></div>
              <p class="muted">${a.reason}</p>
              <div class="row"><button part="button button-primary" class="primary" @click=${() => this.decide("approve", a)}>${t(lang, "approve")}</button>
                <button part="button" @click=${() => this.decide("deny", a)}>${t(lang, "deny")}</button></div>
            </div>`,
          )
        : html`<div part="empty" class="empty">${t(lang, "no_approvals")}</div>`}
      ${this.recent.length
        ? html`<div part="card" class="card"><ul part="list" class="plain">${this.recent.slice(0, 15).map(
            (a) => html`<li class="row"><span class="grow">${a.what}</span><span class="muted">${a.status}${a.decided_by ? ` · ${a.decided_by}` : ""}</span></li>`,
          )}</ul></div>`
        : ""}
    `;
  }
}
