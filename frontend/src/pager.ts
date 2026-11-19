import { html, nothing } from "lit";
import { t } from "./i18n";

// Pages for a long list, kept in the view's `pages` state (one page number per list). The backend sends whole
// lists (with a limit), so the panel cuts them into pages; a page beyond the end (the list got shorter) shows the
// last one.
export interface Paged {
  pages: Record<string, number>;
}

export const PAGE_SIZE = 10;

export function paged<T>(host: Paged, key: string, items: T[], lang: string, size = PAGE_SIZE) {
  const count = Math.max(1, Math.ceil(items.length / size));
  const current = Math.max(0, Math.min(host.pages[key] ?? 0, count - 1));
  const offset = current * size;
  const go = (page: number) => {
    host.pages = { ...host.pages, [key]: page };
  };
  const nav = count > 1
    ? html`<nav part="pager" class="pager" aria-label=${t(lang, "pages")}>
        <button part="button button-quiet" class="quiet" ?disabled=${current === 0} @click=${() => go(current - 1)}>‹ ${t(lang, "page_prev")}</button>
        <span part="time" class="pager-count" aria-live="polite">${offset + 1}–${Math.min(items.length, offset + size)} ${t(lang, "of")} ${items.length}</span>
        <button part="button button-quiet" class="quiet" ?disabled=${current === count - 1} @click=${() => go(current + 1)}>${t(lang, "page_next")} ›</button>
      </nav>`
    : nothing;
  return { items: items.slice(offset, offset + size), nav, offset };
}
