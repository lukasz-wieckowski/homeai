import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { element } from "../define";
import { shortWhen, t, when } from "../i18n";
import { PAGE_SIZE, paged } from "../pager";
import { shared } from "../styles";
import type { Approval, HomeAssistant, Situation } from "../types";

// The inbox: requests waiting for someone's approval (actions, facts HomeAI would remember, habits it would add to
// the plan), then open situations by how much they matter. A row shows what and where; it opens to show why and
// what to do. Notifications open `?situation=<id>` here.
@element("homeai-situations")
export class HomeAISituations extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private open: Situation[] = [];
  @state() private resolved: Situation[] = [];
  @state() private pending: Approval[] = [];
  @state() private decided: Approval[] = [];
  @state() private expanded: string | null = new URLSearchParams(location.search).get("situation");
  @state() private error = "";
  @state() pages: Record<string, number> = {};
  private unsubs: (() => void)[] = [];
  private subscribing = false;
  private scrolled = false;

  static styles = [
    shared,
    css`
      :host { container-type: inline-size; }
      /* a request: its two answers beside it, or under it on a phone */
      .approval .item-main { grid-template-columns: minmax(0, 1fr) auto; }
      @container (max-width: 34em) {
        .approval .item-main { grid-template-columns: minmax(0, 1fr); row-gap: var(--_space); }
        .approval .item-actions { justify-content: flex-end; }
      }
    `,
  ];

  connectedCallback(): void {
    super.connectedCallback();
    this.subscribe();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsubs.forEach((u) => u());
    this.unsubs = [];
  }

  private async subscribe(): Promise<void> {
    if (!this.hass || this.unsubs.length || this.subscribing) return;
    this.subscribing = true;
    try {
      const lang = this.hass.language;
      const situations = await this.hass.connection.subscribeMessage<{ type: string; situations?: Situation[] }>(
        (msg) => {
          if (msg.type === "situations" && msg.situations) this.open = msg.situations;
        },
        { type: "homeai/situations/subscribe", language: lang },
      );
      const approvals = await this.hass.connection.subscribeMessage<{ pending: Approval[] }>(
        (msg) => (this.pending = msg.pending),
        { type: "homeai/approvals/subscribe" },
      );
      if (!this.isConnected) {
        situations();
        approvals();
        return; // the panel was left while subscribing
      }
      this.unsubs = [situations, approvals];
      const [list, recent] = await Promise.all([
        this.hass.callWS<{ resolved: Situation[] }>({ type: "homeai/situations/list", resolved: 100, language: lang }),
        this.hass.callWS<{ recent: Approval[] }>({ type: "homeai/approvals/list" }),
      ]);
      this.resolved = list.resolved;
      this.decided = recent.recent.filter((a) => a.status !== "pending");
    } catch (err: any) {
      this.error = err?.message ?? String(err);
    } finally {
      this.subscribing = false;
    }
  }

  private groups(): [Situation[], Situation[]] {
    const byWeight = [...this.open].sort((a, b) => b.severity - a.severity || (b.opened_at || b.first_seen).localeCompare(a.opened_at || a.first_seen));
    return [byWeight.filter((s) => s.severity >= 2), byWeight.filter((s) => s.severity < 2)];
  }

  protected willUpdate(changed: Map<string, unknown>): void {
    // a notification's situation opens on the page it is on
    if (!changed.has("open") || !this.expanded || this.scrolled) return;
    const [attention, info] = this.groups();
    for (const [key, list] of [["needs_attention", attention], ["for_info", info]] as const) {
      const at = list.findIndex((s) => s.id === this.expanded);
      if (at >= 0) this.pages = { ...this.pages, [key]: Math.floor(at / PAGE_SIZE) };
    }
  }

  protected updated(): void {
    if (this.scrolled || !this.expanded) return;
    const row = this.renderRoot.querySelector(`[data-id="${CSS.escape(this.expanded)}"]`);
    if (row) {
      this.scrolled = true;
      row.scrollIntoView({ block: "center" });
    }
  }

  private async act(verb: string, s: Situation): Promise<void> {
    await this.hass.callWS({ type: `homeai/situations/${verb}`, situation_id: s.id });
  }

  private async decide(verb: "approve" | "deny", a: Approval): Promise<void> {
    this.error = "";
    try {
      await this.hass.callWS({ type: `homeai/approvals/${verb}`, approval_id: a.id });
    } catch (err: any) {
      this.error = err?.message ?? String(err);
    }
  }

  private toggle(id: string): void {
    this.expanded = this.expanded === id ? null : id;
  }

  private approval(a: Approval) {
    const lang = this.hass.language;
    const tz = this.hass.config?.time_zone;
    return html`<li part="row" class="approval">
      <div class="item-main">
        <span class="item-text"><span part="row-title" class="item-title">${a.what}</span>
          <span part="row-meta" class="item-meta">${[a.reason, a.expires ? `${t(lang, "expires")} ${shortWhen(a.expires, lang, tz)}` : ""].filter(Boolean).join(" · ")}</span></span>
        <span class="item-actions">
          <button part="button" @click=${() => this.decide("deny", a)}>${t(lang, "deny")}</button>
          <button part="button button-primary" class="primary" @click=${() => this.decide("approve", a)}>${t(lang, "approve")}</button>
        </span>
      </div>
    </li>`;
  }

  private situation(s: Situation) {
    const lang = this.hass.language;
    const tz = this.hass.config?.time_zone;
    const a = s.assessment || {};
    const open = this.expanded === s.id;
    const repairing = ["waiting", "trying", "verifying"].includes(s.repair?.status);
    const meta = [s.description, repairing ? t(lang, "repairing") : "", s.acked_by ? `✓ ${s.acked_by}` : ""].filter(Boolean).join(" · ");
    return html`<li part="row" class=${open ? "open" : ""} data-id=${s.id}>
      <button class="item-main" aria-expanded=${open ? "true" : "false"} @click=${() => this.toggle(s.id)}>
        <span part="badge badge-${s.severity}" class="dot sev-${s.severity}" title=${`${t(lang, "severity")} ${s.severity}`}></span>
        <span class="item-text"><span part="row-title" class="item-title">${s.title}</span>
          ${meta ? html`<span part="row-meta" class="item-meta">${meta}</span>` : nothing}</span>
        <span part="time" class="item-aside">${shortWhen(s.opened_at || s.first_seen, lang, tz)}</span>
      </button>
      ${open
        ? html`<div class="item-more">
            ${a.reason ? html`<p><span class="muted">${t(lang, "reason")}:</span> ${a.reason}</p>` : nothing}
            ${a.steps?.length ? html`<ol>${a.steps.map((x: string) => html`<li>${x}</li>`)}</ol>` : nothing}
            ${repairing ? html`<p class="muted">${t(lang, "repairing")} (${s.repair.playbook})</p>` : nothing}
            ${s.acked_by ? html`<p class="muted">${t(lang, "acked_by")} ${s.acked_by}</p>` : nothing}
            <p class="muted">${t(lang, "since")} ${when(s.opened_at || s.first_seen, lang)}</p>
            <div class="item-actions">
              <button part="button button-primary" class="primary" @click=${() => this.act("handle", s)}>${t(lang, "handle")}</button>
              <button part="button" @click=${() => this.act("ack", s)} ?disabled=${!!s.acked_by}>${t(lang, "ack")}</button>
              <button part="button" @click=${() => this.act("snooze", s)}>${t(lang, "snooze")}</button>
              <button part="button button-quiet" class="quiet" @click=${() => this.act("dismiss", s)}>${t(lang, "dismiss")}</button>
            </div>
          </div>`
        : nothing}
    </li>`;
  }

  private group(key: string, items: Situation[]) {
    if (!items.length) return nothing;
    const page = paged(this, key, items, this.hass.language);
    return html`<section class="section">
      <div class="section-head"><h2 part="heading" class="heading">${t(this.hass.language, key)} <span class="count">${items.length}</span></h2></div>
      <ul part="card list" class="list">${page.items.map((s) => this.situation(s))}</ul>
      ${page.nav}
    </section>`;
  }

  render() {
    const lang = this.hass.language;
    const tz = this.hass.config?.time_zone;
    const [attention, info] = this.groups();
    const pending = paged(this, "pending", this.pending, lang);
    const resolved = paged(this, "resolved", this.resolved, lang);
    const decided = paged(this, "decided", this.decided, lang);
    return html`
      ${this.error ? html`<div part="card error" class="card error">${this.error}</div>` : nothing}
      ${this.pending.length
        ? html`<section class="section">
            <div class="section-head"><h2 part="heading" class="heading">${t(lang, "waiting_approval")} <span class="count">${this.pending.length}</span></h2></div>
            <ul part="card list" class="list">${pending.items.map((a) => this.approval(a))}</ul>
            ${pending.nav}
          </section>`
        : nothing}
      ${this.group("needs_attention", attention)}
      ${this.group("for_info", info)}
      ${!this.pending.length && !this.open.length ? html`<div part="empty" class="empty">${t(lang, "nothing_open")}</div>` : nothing}
      ${this.resolved.length
        ? html`<details class="section">
            <summary class="section-head"><h2 part="heading" class="heading">${t(lang, "resolved")} <span class="count">${this.resolved.length}</span></h2><span class="chevron">›</span></summary>
            <ul part="card list" class="list">${resolved.items.map((s) => html`<li part="row"><div class="item-main plain">
              <span class="item-text"><span part="row-title" class="item-title">${s.title}</span></span>
              <span part="time" class="item-aside">${shortWhen(s.opened_at || s.first_seen, lang, tz)}</span></div></li>`)}</ul>
            ${resolved.nav}
          </details>`
        : nothing}
      ${this.decided.length
        ? html`<details class="section">
            <summary class="section-head"><h2 part="heading" class="heading">${t(lang, "decided")} <span class="count">${this.decided.length}</span></h2><span class="chevron">›</span></summary>
            <ul part="card list" class="list">${decided.items.map((a) => html`<li part="row"><div class="item-main plain">
              <span class="item-text"><span part="row-title" class="item-title">${a.what}</span>
                <span part="row-meta" class="item-meta">${t(lang, `status_${a.status}`).replace(/^status_/, "")}${a.decided_by ? ` · ${a.decided_by}` : ""}</span></span>
              <span part="time" class="item-aside">${shortWhen(a.created, lang, tz)}</span></div></li>`)}</ul>
            ${decided.nav}
          </details>`
        : nothing}
    `;
  }
}
