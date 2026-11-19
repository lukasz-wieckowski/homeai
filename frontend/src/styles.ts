import { css } from "lit";

// Theming. Nothing here is a fixed colour, font, radius, shadow or spacing: every value comes from a public
// `--homeai-*` variable whose default is a Home Assistant theme variable, so the panel and the cards look like the
// rest of Home Assistant and follow its light and dark mode. A Home Assistant theme (or card-mod) may set any
// `--homeai-*` variable; `::part()` reaches what variables cannot (see PARTS). The list is documented in the
// README, section "Theming".
//
// The public variables are read once per component into private `--_*` ones, so a theme can set them anywhere
// above (the theme root, a view, a card) and the defaults stay in this one place.
export const tokens = css`
  :host {
    /* colours */
    --_text: var(--homeai-text-color, var(--primary-text-color));
    --_secondary-text: var(--homeai-secondary-text-color, var(--secondary-text-color));
    --_accent: var(--homeai-accent-color, var(--primary-color));
    --_on-accent: var(--homeai-on-accent-color, var(--text-primary-color));
    --_background: var(--homeai-background, var(--primary-background-color));
    --_surface: var(--homeai-surface-color, var(--secondary-background-color));
    --_divider: var(--homeai-divider-color, var(--divider-color));
    --_error: var(--homeai-error-color, var(--error-color));
    --_header-background: var(--homeai-header-background, color-mix(in srgb, var(--app-header-background-color) 72%, transparent));
    --_header-text: var(--homeai-header-text-color, var(--app-header-text-color));
    --_severity-0: var(--homeai-severity-0-color, var(--secondary-text-color));
    --_severity-1: var(--homeai-severity-1-color, var(--success-color));
    --_severity-2: var(--homeai-severity-2-color, var(--info-color));
    --_severity-3: var(--homeai-severity-3-color, var(--warning-color));
    --_severity-4: var(--homeai-severity-4-color, var(--error-color));
    --_severity-text: var(--homeai-severity-text-color, var(--text-primary-color));

    /* cards: the same variables Home Assistant's own cards read */
    --_card-background: var(--homeai-card-background, var(--ha-card-background, var(--card-background-color)));
    --_card-border-color: var(--homeai-card-border-color, var(--ha-card-border-color, var(--divider-color)));
    --_card-border-width: var(--homeai-card-border-width, var(--ha-card-border-width, var(--ha-border-width-sm)));
    --_card-radius: var(--homeai-card-border-radius, var(--ha-card-border-radius, var(--ha-border-radius-lg)));
    --_card-shadow: var(--homeai-card-box-shadow, var(--ha-card-box-shadow, none));
    --_card-padding: var(--homeai-card-padding, var(--ha-space-4));
    --_card-spacing: var(--homeai-card-spacing, var(--ha-space-3));

    /* controls */
    --_button-radius: var(--homeai-button-border-radius, var(--ha-border-radius-pill));
    --_button-padding: var(--homeai-button-padding, var(--ha-space-2) var(--ha-space-4));
    --_button-border-color: var(--homeai-button-border-color, var(--_glass-border));
    --_button-background: var(--homeai-button-background, color-mix(in srgb, var(--_text) 5%, transparent));
    --_button-hover-background: var(--homeai-button-hover-background, color-mix(in srgb, var(--_accent) 12%, transparent));
    --_button-prominent-background: var(--homeai-button-prominent-background, var(--_accent));
    --_button-prominent-shadow: var(--homeai-button-prominent-box-shadow, var(--ha-box-shadow-s));
    --_input-background: var(--homeai-input-background, var(--input-fill-color));
    --_input-text: var(--homeai-input-text-color, var(--input-ink-color, var(--_text)));
    --_input-border-color: var(--homeai-input-border-color, var(--input-outlined-idle-border-color, var(--_divider)));
    --_input-radius: var(--homeai-input-border-radius, var(--ha-border-radius-sm));
    --_input-padding: var(--homeai-input-padding, var(--ha-space-2));
    --_badge-radius: var(--homeai-badge-border-radius, var(--ha-border-radius-pill));
    --_border-width: var(--ha-border-width-sm);
    --_indicator-width: var(--ha-border-width-md);

    /* chat */
    --_message-radius: var(--homeai-message-border-radius, var(--ha-border-radius-xl));
    --_user-message-background: var(--homeai-user-message-background, var(--_accent));
    --_user-message-text: var(--homeai-user-message-text-color, var(--_on-accent));
    --_assistant-message-background: var(--homeai-assistant-message-background, var(--_surface));
    --_assistant-message-text: var(--homeai-assistant-message-text-color, var(--_text));

    /* Liquid Glass: the navigation layer (top bar, tabs, buttons, the chat composer, sheets) is a translucent
       material floating above the content; the content itself (cards, lists, text) stays solid */
    --_glass-tint: var(--homeai-glass-tint, var(--ha-card-background, var(--card-background-color)));
    --_glass-background: var(--homeai-glass-background, color-mix(in srgb, var(--_glass-tint) 72%, transparent));
    --_glass-filter: var(--homeai-glass-filter, blur(var(--ha-space-5)) saturate(1.8));
    --_glass-border: var(--homeai-glass-border-color, color-mix(in srgb, var(--_text) 12%, transparent));
    --_glass-highlight: var(--homeai-glass-highlight-color, color-mix(in srgb, var(--_text) 6%, transparent));
    --_glass-shadow: var(--homeai-glass-box-shadow, var(--ha-box-shadow-m));
    --_glass-depth: inset 0 var(--_border-width) 0 var(--_glass-highlight), var(--_glass-shadow);
    --_segment-radius: var(--homeai-segmented-border-radius, var(--ha-border-radius-3xl));
    --_sheet-radius: var(--homeai-sheet-border-radius, var(--ha-border-radius-3xl));
    --_sheet-shadow: var(--homeai-sheet-box-shadow, var(--ha-box-shadow-l));
    --_sheet-depth: inset 0 var(--_border-width) 0 var(--_glass-highlight), var(--_sheet-shadow);
    --_motion: var(--homeai-motion-duration, var(--ha-animation-duration-fast));

    /* lists: one surface per group, rows separated by hairlines; a row opens to show its details and actions */
    --_row-x: var(--homeai-row-padding-x, var(--ha-space-4));
    --_row-y: var(--homeai-row-padding-y, var(--ha-space-3));
    --_row-hover-background: var(--homeai-row-hover-background, color-mix(in srgb, var(--_text) 4%, transparent));
    --_dot-size: var(--homeai-dot-size, 0.625em);
    --_row-indent: calc(var(--_row-x) + var(--_dot-size) + var(--_space-l));
    --_section-spacing: var(--homeai-section-spacing, var(--ha-space-6, var(--ha-space-5)));
    --_reading-width: var(--homeai-reading-width, 48em);
    --_scrim: var(--homeai-scrim-color, color-mix(in srgb, var(--primary-text-color) 32%, transparent));
    --_safe-bottom: var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0));
    --_sheet-foot-padding: calc(var(--_space-l) + var(--_safe-bottom));

    /* typography */
    --_font-family: var(--homeai-font-family, var(--ha-font-family-body));
    --_code-font-family: var(--homeai-code-font-family, var(--ha-font-family-code));
    --_font-size: var(--homeai-font-size, var(--ha-font-size-m));
    --_secondary-font-size: var(--homeai-secondary-font-size, var(--ha-font-size-s));
    --_title-font-size: var(--homeai-title-font-size, var(--ha-font-size-l));
    --_title-font-weight: var(--homeai-title-font-weight, var(--ha-font-weight-medium));
    --_header-font-size: var(--homeai-header-font-size, var(--ha-font-size-xl));
    --_header-font-weight: var(--homeai-header-font-weight, var(--ha-font-weight-normal));
    --_strong-font-weight: var(--ha-font-weight-bold);
    --_normal-font-weight: var(--ha-font-weight-normal);

    /* spacing: one base step; smaller and larger ones follow it */
    --_space: var(--homeai-spacing, var(--ha-space-2));
    --_space-s: calc(var(--_space) / 2);
    --_space-l: calc(var(--_space) * 2);
    --_content-padding: var(--homeai-content-padding, var(--ha-content-gutter, var(--ha-space-4)));
  }
`;

export const shared = [
  tokens,
  css`
    :host { display: block; color: var(--_text); font-family: var(--_font-family); font-size: var(--_font-size); }
    .card { background: var(--_card-background); border-radius: var(--_card-radius); box-shadow: var(--_card-shadow);
      border: var(--_card-border-width) solid var(--_card-border-color); padding: var(--_card-padding);
      margin-bottom: var(--_card-spacing); color: var(--_text); }
    .row { display: flex; align-items: center; gap: var(--_space); flex-wrap: wrap; }
    .grow { flex: 1 1 auto; min-width: 0; }
    .muted { color: var(--_secondary-text); font-size: var(--_secondary-font-size); }
    .error { color: var(--_error); }
    .title { font-weight: var(--_title-font-weight); font-size: var(--_title-font-size); }
    .title.spaced { margin-bottom: var(--_space); }
    .pre-line { white-space: pre-line; }
    .w-xs { width: 5em; } .w-s { width: 7em; } .w-m { width: 9em; }
    .tall { min-height: 20em; }
    p { margin: var(--_space) 0; }
    b, strong { font-weight: var(--_strong-font-weight); }

    /* sections: a heading with its count and its one action, then one surface */
    .section { margin-bottom: var(--_section-spacing); }
    .section-head { display: flex; align-items: center; gap: var(--_space); min-height: 2.75em;
      margin: 0 0 var(--_space); padding: 0 var(--_space-s); }
    .heading { flex: 1 1 auto; min-width: 0; margin: 0; font-size: var(--_title-font-size);
      font-weight: var(--_title-font-weight); }
    .count { color: var(--_secondary-text); font-weight: var(--_normal-font-weight); }
    .hint { color: var(--_secondary-text); font-size: var(--_secondary-font-size); margin: 0 0 var(--_space);
      padding: 0 var(--_space-s); }
    details.section > summary { list-style: none; cursor: pointer; }
    details.section > summary::-webkit-details-marker { display: none; }
    .chevron { color: var(--_secondary-text); transition: transform var(--_motion); }
    details[open] > summary .chevron { transform: rotate(90deg); }

    /* a list: one surface, rows separated by hairlines */
    .list { list-style: none; margin: 0; padding: 0; overflow: hidden; background: var(--_card-background);
      border: var(--_card-border-width) solid var(--_card-border-color); border-radius: var(--_card-radius);
      box-shadow: var(--_card-shadow); }
    .list > li + li { border-top: var(--_border-width) solid var(--_divider); }
    /* a list inside a card (the Lovelace cards): the card is the surface */
    .card.flush { padding: 0; overflow: hidden; }
    .card-title { padding: var(--_card-padding) var(--_row-x) var(--_space-s); }
    .list.bare { background: transparent; border: none; border-radius: 0; box-shadow: none; }
    .item-main { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center;
      column-gap: var(--_space-l); width: 100%; box-sizing: border-box; min-height: 3.25em; padding: var(--_row-y) var(--_row-x);
      font: inherit; text-align: start; color: inherit; background: transparent; border: none; border-radius: 0;
      box-shadow: none; cursor: pointer; }
    div.item-main { cursor: default; }
    .item-main.plain { grid-template-columns: minmax(0, 1fr) auto; }
    .item-main.timed { grid-template-columns: 3.5em minmax(0, 1fr) auto; }
    button.item-main:active:not(:disabled) { transform: none; }
    @media (hover: hover) {
      button.item-main:hover:not(:disabled) { background: var(--_row-hover-background); }
    }
    button.item-main:focus-visible { outline-offset: calc(var(--_indicator-width) * -2); }
    .item-text { min-width: 0; }
    .item-main input { width: 100%; }
    .item-title { display: block; overflow-wrap: anywhere; }
    .item-meta { display: block; margin-top: var(--_space-s); color: var(--_secondary-text);
      font-size: var(--_secondary-font-size); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .open .item-meta, .item-meta.wrap { white-space: normal; }
    .item-aside { color: var(--_secondary-text); font-size: var(--_secondary-font-size); white-space: nowrap;
      font-variant-numeric: tabular-nums; }
    .time { font-variant-numeric: tabular-nums; color: var(--_secondary-text); }
    .off { color: var(--_secondary-text); }
    .item-more { padding: 0 var(--_row-x) var(--_row-y) var(--_row-indent); }
    .item-more.flush { padding-left: var(--_row-x); }
    .item-more p, .item-more ol { margin: 0 0 var(--_space); }
    .item-actions { display: flex; flex-wrap: wrap; gap: var(--_space); }
    .item-actions.end { justify-content: flex-end; }
    .day { padding: var(--_space-l) var(--_row-x) var(--_space-s); color: var(--_secondary-text);
      font-size: var(--_secondary-font-size); font-weight: var(--_title-font-weight); }
    .list > li.day + li { border-top: none; }
    .dot { display: inline-block; width: var(--_dot-size); height: var(--_dot-size); border-radius: var(--_badge-radius);
      background: var(--_severity-0); }
    .dot.sev-4 { background: var(--_severity-4); } .dot.sev-3 { background: var(--_severity-3); }
    .dot.sev-2 { background: var(--_severity-2); } .dot.sev-1 { background: var(--_severity-1); }
    /* pages of a long list: previous, where you are, next */
    .pager { display: flex; align-items: center; justify-content: space-between; gap: var(--_space);
      padding: var(--_space) 0 0; }
    .pager-count { color: var(--_secondary-text); font-size: var(--_secondary-font-size); font-variant-numeric: tabular-nums; }
    ul.plain { list-style: none; padding: 0; margin: 0; }
    ul.plain li { padding: var(--_space) 0; border-bottom: var(--_border-width) solid var(--_divider); }
    ul.plain li:last-child { border-bottom: none; }

    /* glass buttons: a translucent capsule; the main action is prominent (filled with the accent) */
    button { font: inherit; border: var(--_border-width) solid var(--_button-border-color);
      background: var(--_button-background); color: var(--_accent); border-radius: var(--_button-radius);
      padding: var(--_button-padding); cursor: pointer; min-height: 2.5em;
      transition: background-color var(--_motion), box-shadow var(--_motion), transform var(--_motion); }
    button.primary { background: var(--_button-prominent-background); color: var(--_on-accent); border-color: transparent;
      box-shadow: var(--_button-prominent-shadow); }
    button.quiet { background: transparent; border-color: transparent; box-shadow: none; }
    button.danger { color: var(--_error); }
    @media (hover: hover) {
      button:hover:not(:disabled):not(.primary):not(.item-main) { background: var(--_button-hover-background); }
    }
    button:active:not(:disabled) { transform: scale(0.97); }
    button:focus-visible { outline: var(--_indicator-width) solid var(--_accent); outline-offset: var(--_indicator-width); }
    button:disabled { opacity: 0.5; cursor: default; box-shadow: none; }
    /* the material: one layer per group of controls, never on content */
    .glass { background: var(--_glass-background); backdrop-filter: var(--_glass-filter);
      -webkit-backdrop-filter: var(--_glass-filter); border: var(--_border-width) solid var(--_glass-border);
      box-shadow: var(--_glass-depth); }
    /* a segmented control: options share one glass capsule, the chosen one is prominent */
    .segmented { display: inline-flex; flex-wrap: wrap; align-items: center; gap: var(--_space-s);
      padding: var(--_space-s); border-radius: var(--_segment-radius); max-width: 100%; box-sizing: border-box; }
    .segmented button { border-color: transparent; background: transparent; color: var(--_text); box-shadow: none; }
    .segmented button.primary { background: var(--_button-prominent-background); color: var(--_on-accent); }
    /* inside a sheet the group is not glass again (no glass on glass), only a quiet capsule */
    .sheet .segmented { background: var(--_button-background); }
    /* toggles that read as words (weekdays): pressed ones are prominent */
    .chips { display: flex; flex-wrap: wrap; gap: var(--_space-s); }
    .chips button { min-width: 3.25em; color: var(--_text); }
    .chips button[aria-pressed="true"] { background: var(--_button-prominent-background); color: var(--_on-accent);
      border-color: transparent; }

    /* a sheet: an editor that floats above the list it changes (a modal dialog; a bottom sheet on a phone) */
    .card.sheet { background: var(--_glass-background); backdrop-filter: var(--_glass-filter);
      -webkit-backdrop-filter: var(--_glass-filter); border-color: var(--_glass-border); border-radius: var(--_sheet-radius);
      box-shadow: var(--_sheet-depth); }
    dialog.sheet { width: 32em; max-width: calc(100% - var(--_space-l) * 2); max-height: 88dvh; box-sizing: border-box;
      margin: auto; padding: 0; color: var(--_text); }
    dialog.sheet[open] { display: flex; flex-direction: column; }
    dialog.sheet::backdrop { background: var(--_scrim); }
    .sheet-head { padding: var(--_space-l) var(--_card-padding) var(--_space); }
    .sheet-head .title { margin: 0; }
    .sheet-body { flex: 1 1 auto; overflow-y: auto; padding: var(--_space) var(--_card-padding); }
    .sheet-foot { display: flex; flex-wrap: wrap; align-items: center; gap: var(--_space);
      padding: var(--_space) var(--_card-padding) var(--_sheet-foot-padding); }
    @media (max-width: 40em) {
      dialog.sheet { width: 100%; max-width: 100%; margin: auto 0 0; border-radius: var(--_sheet-radius) var(--_sheet-radius) 0 0; }
    }
    .fields { display: grid; gap: var(--_space-l); }
    .field { display: grid; gap: var(--_space-s); }
    .field > .label { color: var(--_secondary-text); font-size: var(--_secondary-font-size); }
    .field input:not([type="checkbox"]), .field select, .field textarea { width: 100%; }
    .pair { display: grid; grid-template-columns: repeat(auto-fit, minmax(9em, 1fr)); gap: var(--_space); }
    .check { display: flex; align-items: center; gap: var(--_space); cursor: pointer; }

    .sev { display: inline-block; min-width: 1.6em; text-align: center; border-radius: var(--_badge-radius);
      padding: 0 var(--_space-s); font-size: var(--_secondary-font-size); color: var(--_severity-text);
      background: var(--_severity-0); }
    .sev-4 { background: var(--_severity-4); } .sev-3 { background: var(--_severity-3); }
    .sev-2 { background: var(--_severity-2); } .sev-1 { background: var(--_severity-1); }
    input, select, textarea { font: inherit; color: var(--_input-text); background: var(--_input-background);
      border: var(--_border-width) solid var(--_input-border-color); border-radius: var(--_input-radius);
      padding: var(--_input-padding); box-sizing: border-box; min-height: 2.75em; }
    input[type="checkbox"] { accent-color: var(--_accent); min-height: auto; width: 1.25em; height: 1.25em; }
    textarea { width: 100%; min-height: 6em; font-family: var(--_code-font-family); font-size: var(--_secondary-font-size); }
    .empty { padding: var(--_section-spacing) var(--_card-padding); text-align: center; color: var(--_secondary-text); }
    /* Reduce transparency: the material becomes solid; increase contrast: clear edges; browsers without
       color-mix: solid colours from the theme */
    @media (prefers-reduced-transparency: reduce) {
      :host { --_glass-background: var(--_glass-tint); --_glass-filter: none;
        --_header-background: var(--homeai-header-background, var(--app-header-background-color)); }
    }
    @media (prefers-contrast: more) {
      :host { --_glass-background: var(--_glass-tint); --_glass-filter: none; --_glass-border: var(--_text);
        --_button-border-color: var(--_accent);
        --_header-background: var(--homeai-header-background, var(--app-header-background-color)); }
    }
    @supports not (background: color-mix(in srgb, currentColor 50%, transparent)) {
      :host { --_glass-background: var(--_glass-tint); --_glass-border: var(--_divider); --_glass-highlight: transparent;
        --_button-background: transparent; --_button-hover-background: var(--_surface);
        --_row-hover-background: var(--_surface); --_scrim: transparent;
        --_header-background: var(--homeai-header-background, var(--app-header-background-color)); }
    }
  `,
];

// Parts every view and card exposes for `::part()`; the panel and the chat card pass them on with `exportparts`, so
// `homeai-panel::part(card)` reaches the cards inside its views.
export const PARTS = [
  "card",
  "title",
  "heading",
  "badge",
  "badge-0",
  "badge-1",
  "badge-2",
  "badge-3",
  "badge-4",
  "button",
  "button-primary",
  "button-quiet",
  "segmented",
  "sheet",
  "composer",
  "input",
  "list",
  "row",
  "row-title",
  "row-meta",
  "day",
  "time",
  "pager",
  "empty",
  "error",
  "log",
  "message",
  "message-user",
  "message-assistant",
].join(", ");
