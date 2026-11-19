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
    --_header-background: var(--homeai-header-background, var(--app-header-background-color));
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
    --_button-border-color: var(--homeai-button-border-color, var(--_divider));
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
    .heading { font-weight: var(--_title-font-weight); font-size: var(--_title-font-size); margin: var(--_space-l) 0 var(--_space); }
    .pre-line { white-space: pre-line; }
    .actions { margin-top: var(--_space); }
    .toolbar-row { margin-bottom: var(--_card-spacing); }
    .field { margin: var(--_space-s) 0; }
    .label { min-width: 10em; }
    .when { min-width: 9em; }
    .kind { min-width: 7em; }
    .w-xs { width: 4em; } .w-s { width: 6em; } .w-m { width: 8em; }
    .tall { min-height: 20em; }
    .setting { padding: var(--_space) 0; border-bottom: var(--_border-width) solid var(--_divider); }
    p { margin: var(--_space) 0; }
    b, strong { font-weight: var(--_strong-font-weight); }
    button { font: inherit; border: var(--_border-width) solid var(--_button-border-color); background: transparent;
      color: var(--_accent); border-radius: var(--_button-radius); padding: var(--_button-padding); cursor: pointer; }
    button.primary { background: var(--_accent); color: var(--_on-accent); border-color: var(--_accent); }
    button:disabled { opacity: 0.5; cursor: default; }
    .sev { display: inline-block; min-width: 1.6em; text-align: center; border-radius: var(--_badge-radius);
      padding: 0 var(--_space-s); font-size: var(--_secondary-font-size); color: var(--_severity-text);
      background: var(--_severity-0); }
    .sev-4 { background: var(--_severity-4); } .sev-3 { background: var(--_severity-3); }
    .sev-2 { background: var(--_severity-2); } .sev-1 { background: var(--_severity-1); }
    input, select, textarea { font: inherit; color: var(--_input-text); background: var(--_input-background);
      border: var(--_border-width) solid var(--_input-border-color); border-radius: var(--_input-radius);
      padding: var(--_input-padding); box-sizing: border-box; }
    input[type="checkbox"] { accent-color: var(--_accent); }
    textarea { width: 100%; min-height: 6em; font-family: var(--_code-font-family); font-size: var(--_secondary-font-size); }
    .empty { padding: var(--_space-l) var(--_card-padding); text-align: center; color: var(--_secondary-text); }
    ul.plain { list-style: none; padding: 0; margin: 0; }
    ul.plain li { padding: var(--_space) 0; border-bottom: var(--_border-width) solid var(--_divider); }
    ul.plain li:last-child { border-bottom: none; }
  `,
];

// Parts every view and card exposes for `::part()`; the panel and the chat card pass them on with `exportparts`, so
// `homeai-panel::part(card)` reaches the cards inside its tabs.
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
  "input",
  "list",
  "empty",
  "error",
  "log",
  "message",
  "message-user",
  "message-assistant",
].join(", ");
