import { LitElement, css, html, nothing } from "lit";
import { property, query, state } from "lit/decorators.js";
import { element } from "../define";
import { t } from "../i18n";
import { shared } from "../styles";
import type { ChatMessage, HomeAssistant } from "../types";

const STORAGE_KEY = "homeai-chat-conversation";

function remembered(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function remember(key: string, value: string | null): void {
  try {
    if (value) sessionStorage.setItem(key, value);
    else sessionStorage.removeItem(key);
  } catch {
    /* storage unavailable: the thread lasts until the page closes */
  }
}

// A conversation with HomeAI in the viewer's own account. Used by the panel's Chat tab and the chat card.
@element("homeai-chat")
export class HomeAIChat extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: "storage-key" }) storageKey = STORAGE_KEY;
  @property({ type: Boolean }) compact = false;
  // In a panel: the conversation fills the page and the composer floats at the bottom.
  @property({ type: Boolean, reflect: true }) fill = false;
  @state() private messages: ChatMessage[] = [];
  @state() private busy = false;
  @state() private error = "";
  @query("textarea") private box?: HTMLTextAreaElement;
  @query(".log") private log?: HTMLElement;
  private conversation: string | null = null;

  static styles = [
    shared,
    css`
      .log { display: flex; flex-direction: column; gap: var(--_space); max-height: 60vh; overflow-y: auto;
        padding: var(--_space-s) 0 var(--_space-l); }
      :host([compact]) .log { max-height: 24em; }
      .msg { max-width: 85%; padding: var(--_space) var(--_space-l); border-radius: var(--_message-radius);
        white-space: pre-wrap; overflow-wrap: anywhere; }
      .user { align-self: flex-end; background: var(--_user-message-background); color: var(--_user-message-text); }
      .assistant { align-self: flex-start; background: var(--_assistant-message-background); color: var(--_assistant-message-text); }
      textarea { min-height: 3em; font-family: inherit; font-size: inherit; }
      .composer { display: flex; align-items: flex-end; gap: var(--_space); padding: var(--_space-s);
        border-radius: var(--_segment-radius); }
      .composer textarea { border: none; background: transparent; resize: none; min-height: 2.5em; }
      .composer textarea:focus { outline: none; }
      .composer:focus-within { border-color: var(--_accent); }
      :host([fill]) { display: flex; flex-direction: column; }
      :host([fill]) .log { max-height: none; flex: 1 1 auto; justify-content: flex-end; }
      :host([fill]) .bottom { position: sticky; bottom: 0; z-index: 1; padding-bottom: var(--_sheet-foot-padding); }
      .hint-block { margin: auto 0; max-width: 32em; align-self: center; text-align: center; }
    `,
  ];

  connectedCallback(): void {
    super.connectedCallback();
    this.conversation = remembered(this.storageKey);
    if (this.conversation) this.loadHistory();
  }

  private async loadHistory(): Promise<void> {
    const res = await this.hass.callWS<{ messages: ChatMessage[] }>({ type: "homeai/chat/history", conversation_id: this.conversation });
    this.messages = res.messages;
    this.scrollDown();
  }

  private scrollDown(): void {
    this.updateComplete.then(() => {
      if (this.fill) this.renderRoot.querySelector(".composer")?.scrollIntoView({ block: "end" });
      else this.log?.scrollTo({ top: this.log.scrollHeight });
    });
  }

  private async send(): Promise<void> {
    const text = this.box?.value.trim();
    if (!text || this.busy) return;
    this.box!.value = "";
    this.messages = [...this.messages, { role: "user", text }];
    this.busy = true;
    this.error = "";
    this.scrollDown();
    try {
      const res = await this.hass.callWS<{ reply: string; conversation_id: string }>({
        type: "homeai/chat/send",
        text,
        ...(this.conversation ? { conversation_id: this.conversation } : {}),
      });
      this.conversation = res.conversation_id;
      remember(this.storageKey, this.conversation);
      this.messages = [...this.messages, { role: "assistant", text: res.reply }];
    } catch (err: any) {
      this.error = err?.message ?? String(err);
    } finally {
      this.busy = false;
      this.scrollDown();
    }
  }

  private restart(): void {
    this.conversation = null;
    remember(this.storageKey, null);
    this.messages = [];
  }

  private keydown(e: KeyboardEvent): void {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.send();
    }
  }

  render() {
    const lang = this.hass.language;
    const restart = this.messages.length
      ? html`<div class="item-actions end"><button part="button button-quiet" class="quiet" @click=${this.restart}>${t(lang, "chat_new")}</button></div>`
      : nothing;
    return html`
      ${this.fill ? restart : nothing}
      <div part="log" class="log" aria-live="polite">
        ${this.messages.length ? nothing : html`<div class="muted hint-block">${t(lang, "chat_hint")}</div>`}
        ${this.messages.map((m) => html`<div part="message message-${m.role}" class="msg ${m.role}">${m.text}</div>`)}
        ${this.busy ? html`<div part="message message-assistant" class="msg assistant muted">…</div>` : nothing}
      </div>
      ${this.error ? html`<div part="error" class="muted error">${this.error}</div>` : nothing}
      <div class="bottom">
        <div part="composer" class="composer glass">
          <textarea part="input" class="grow" rows="1" placeholder=${t(lang, "chat_placeholder")} aria-label=${t(lang, "chat_placeholder")} @keydown=${this.keydown} ?disabled=${this.busy}></textarea>
          <button part="button button-primary" class="primary" @click=${this.send} ?disabled=${this.busy}>${t(lang, "send")}</button>
        </div>
      </div>
      ${this.fill ? nothing : restart}`;
  }
}
