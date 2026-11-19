// Panel texts. Messages from HomeAI itself (titles, journal) arrive already translated by the backend.
const TEXTS: Record<string, Record<string, string>> = {
  en: {
    plan_what: "What", plan_do: "What should happen", plan_pick: "Choose…", plan_name_optional: "Name (optional)",
    plan_custom: "Custom action", plan_custom_hint: "Made in an automation or by an administrator; only an administrator can change it.",
    plan_advanced: "Advanced", plan_time: "Time", plan_moment: "Moment", plan_offset: "Shift (min)", plan_day: "Day",
    verb_activate: "Turn on the scene", verb_run: "Run", verb_on: "Turn on", verb_off: "Turn off", verb_brightness: "Brightness",
    verb_open: "Open", verb_close: "Close", verb_position: "Position", verb_temperature: "Temperature", verb_stop: "Stop",
    verb_start: "Start cleaning", verb_dock: "Back to the dock", verb_press: "Press",
    type_scene: "Scenes", type_script: "Scripts", type_light: "Lights", type_switch: "Plugs and switches", type_fan: "Fans and purifiers",
    type_input_boolean: "Helpers", type_cover: "Blinds and gates", type_climate: "Heating and cooling", type_media_player: "Speakers and TVs",
    type_vacuum: "Vacuums", type_button: "Buttons", type_input_button: "Helper buttons",
    pages: "Pages", page_prev: "Previous", page_next: "Next", of: "of",
    waiting_approval: "Waiting for your approval", needs_attention: "Needs attention",
    for_info: "For your information", decided: "Recent decisions", acked_by: "Acknowledged by",
    today: "Today", tomorrow: "Tomorrow", plan_skip_once: "Skip this time", plan_edit_entry: "Edit the entry",
    plan_new: "New plan entry", plan_change: "Plan entry", presence_new: "New exception", presence_change: "Exception",
    watch_stop: "Stop watching", days_of: "of", days_word: "days", close: "Close", section: "Section", entry_off: "off", from_source: "from",
    status_approved: "approved", status_denied: "denied", status_expired: "expired", status_cancelled: "cancelled", status_withdrawn: "withdrawn",
    situations: "Situations", approvals: "Approvals", plan: "Plan",
    nothing_open: "Nothing needs attention.", ack: "Got it", handle: "I'll handle it", snooze: "Snooze",
    dismiss: "Not a problem", severity: "Severity", who: "Who", repairing: "HomeAI is fixing it",
    approve: "Approve", deny: "Deny", no_approvals: "No requests waiting.", expires: "expires",
    no_plan: "The plan is empty.", remove: "Remove", resolved: "Recently resolved",
    since: "since", reason: "Why", steps: "Steps",
    rule_entities: "Entities", rule_enabled: "Enabled",
    save: "Save", cancel: "Cancel", edit: "Edit",
    chat: "Chat", presence: "Presence", send: "Send", chat_new: "New conversation", chat_placeholder: "Ask HomeAI…",
    chat_hint: "Ask about the house, what happened, or what HomeAI should do. HomeAI acts only within its policy.",
    remove_confirm: "Remove it?",
    plan_add: "Add to plan", plan_next: "Coming up", plan_entries: "Entries", plan_skip: "Skip", plan_type: "Type",
    plan_action: "Action", plan_reminder: "Reminder", plan_reminder_text: "Reminder", plan_to: "Who to remind",
    plan_to_home_or_all: "Who is home, else everyone", plan_to_home: "Who is home", plan_to_all: "Everyone",
    plan_to_admins: "Administrators", plan_service: "Action", plan_data: "Data (JSON)", plan_when: "When",
    plan_once: "Once", plan_daily: "Every day", plan_weekly: "On days", plan_sun: "Around the sun",
    plan_sunrise: "Sunrise", plan_sunset: "Sunset", plan_dawn: "Dawn", plan_dusk: "Dusk", plan_solar_noon: "Solar noon",
    plan_skip_away: "Skip while everyone is away", plan_error: "Not saved",
    presence_add: "Add exception", presence_none: "No trips, guests or other exceptions planned.",
    presence_hint: "Trips, guests and days at home change how HomeAI watches the house and who it tells.",
    presence_kind: "What", presence_person: "Who", presence_everyone: "Whole household", presence_from: "From",
    presence_to: "Until (inclusive)", presence_note: "Note", presence_away: "Away", presence_vacation: "Vacation",
    presence_guests: "Guests", presence_home_office: "Working from home", presence_sick: "Sick at home",
    watching: "Watching for you", until: "until",
    show_all: "Show all", show_less: "Show less",
  },
  pl: {
    plan_what: "Co", plan_do: "Co ma się stać", plan_pick: "Wybierz…", plan_name_optional: "Nazwa (opcjonalnie)",
    plan_custom: "Akcja niestandardowa", plan_custom_hint: "Ułożona w automatyzacji albo przez administratora; zmienić ją może tylko administrator.",
    plan_advanced: "Zaawansowane", plan_time: "Godzina", plan_moment: "Moment", plan_offset: "Przesunięcie (min)", plan_day: "Dzień",
    verb_activate: "Włącz scenę", verb_run: "Uruchom", verb_on: "Włącz", verb_off: "Wyłącz", verb_brightness: "Jasność",
    verb_open: "Otwórz", verb_close: "Zamknij", verb_position: "Pozycja", verb_temperature: "Temperatura", verb_stop: "Zatrzymaj",
    verb_start: "Odkurzaj", verb_dock: "Wróć do stacji", verb_press: "Naciśnij",
    type_scene: "Sceny", type_script: "Skrypty", type_light: "Światła", type_switch: "Gniazdka i przełączniki", type_fan: "Wentylatory i oczyszczacze",
    type_input_boolean: "Przełączniki pomocnicze", type_cover: "Rolety i bramy", type_climate: "Ogrzewanie i klimatyzacja", type_media_player: "Głośniki i telewizory",
    type_vacuum: "Odkurzacze", type_button: "Przyciski", type_input_button: "Przyciski pomocnicze",
    pages: "Strony", page_prev: "Poprzednie", page_next: "Następne", of: "z",
    waiting_approval: "Czeka na Twoją zgodę", needs_attention: "Wymaga uwagi",
    for_info: "Do wiadomości", decided: "Ostatnie decyzje", acked_by: "Potwierdzone przez",
    today: "Dziś", tomorrow: "Jutro", plan_skip_once: "Pomiń tym razem", plan_edit_entry: "Edytuj wpis",
    plan_new: "Nowy wpis planu", plan_change: "Wpis planu", presence_new: "Nowy wyjątek", presence_change: "Wyjątek",
    watch_stop: "Przestań pilnować", days_of: "z", days_word: "dni", close: "Zamknij", section: "Sekcja", entry_off: "wyłączony", from_source: "z",
    status_approved: "zgoda", status_denied: "odmowa", status_expired: "wygasła", status_cancelled: "anulowana", status_withdrawn: "wycofana",
    situations: "Sprawy", approvals: "Zgody", plan: "Plan",
    nothing_open: "Nic nie wymaga uwagi.", ack: "Wiem", handle: "Zajmę się", snooze: "Wycisz",
    dismiss: "To nie problem", severity: "Waga", who: "Kto", repairing: "HomeAI naprawia",
    approve: "Zgoda", deny: "Odmowa", no_approvals: "Brak oczekujących próśb.", expires: "wygasa",
    no_plan: "Plan jest pusty.", remove: "Usuń", resolved: "Ostatnio rozwiązane",
    since: "od", reason: "Dlaczego", steps: "Kroki",
    rule_entities: "Encje", rule_enabled: "Włączona",
    save: "Zapisz", cancel: "Anuluj", edit: "Edytuj",
    chat: "Rozmowa", presence: "Obecność", send: "Wyślij", chat_new: "Nowa rozmowa", chat_placeholder: "Zapytaj HomeAI…",
    chat_hint: "Zapytaj o dom, o to, co się stało, albo co HomeAI ma zrobić. HomeAI działa tylko w granicach swojej polityki.",
    remove_confirm: "Usunąć?",
    plan_add: "Dodaj do planu", plan_next: "Wkrótce", plan_entries: "Wpisy", plan_skip: "Pomiń", plan_type: "Rodzaj",
    plan_action: "Akcja", plan_reminder: "Przypomnienie", plan_reminder_text: "Przypomnienie", plan_to: "Komu przypomnieć",
    plan_to_home_or_all: "Kto jest w domu, inaczej wszystkim", plan_to_home: "Kto jest w domu", plan_to_all: "Wszystkim",
    plan_to_admins: "Administratorom", plan_service: "Akcja", plan_data: "Dane (JSON)", plan_when: "Kiedy",
    plan_once: "Raz", plan_daily: "Codziennie", plan_weekly: "W dni", plan_sun: "Według słońca",
    plan_sunrise: "Wschód słońca", plan_sunset: "Zachód słońca", plan_dawn: "Świt", plan_dusk: "Zmierzch", plan_solar_noon: "Południe słoneczne",
    plan_skip_away: "Pomijaj, gdy nikogo nie ma", plan_error: "Nie zapisano",
    presence_add: "Dodaj wyjątek", presence_none: "Brak zaplanowanych wyjazdów, gości i innych wyjątków.",
    presence_hint: "Wyjazdy, goście i dni w domu zmieniają to, jak HomeAI pilnuje domu i kogo powiadamia.",
    presence_kind: "Co", presence_person: "Kto", presence_everyone: "Cały dom", presence_from: "Od",
    presence_to: "Do (włącznie)", presence_note: "Notatka", presence_away: "Poza domem", presence_vacation: "Urlop",
    presence_guests: "Goście", presence_home_office: "Praca z domu", presence_sick: "Choroba w domu",
    watching: "Pilnuję dla ciebie", until: "do",
    show_all: "Pokaż wszystko", show_less: "Pokaż mniej",
  },
};

export function t(lang: string, key: string): string {
  const base = (lang || "en").split("-")[0];
  return TEXTS[base]?.[key] ?? TEXTS.en[key] ?? key;
}

// A moment as the home sees it (Home Assistant's time zone), whatever zone the browser is in.
export function inZone(iso: string | number | Date, timeZone?: string): { date: string; hour: number; minute: number } {
  const parts: Record<string, string> = {};
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: timeZone || undefined, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  });
  for (const p of fmt.formatToParts(new Date(iso))) parts[p.type] = p.value;
  return { date: `${parts.year}-${parts.month}-${parts.day}`, hour: Number(parts.hour), minute: Number(parts.minute) };
}

export function when(iso: string | null | undefined, lang: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString(lang, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

// The home's day of a moment (YYYY-MM-DD), whatever zone the browser is in.
export function homeDay(iso: string | number | Date, timeZone?: string): string {
  return inZone(iso, timeZone).date;
}

// "Today", "Tomorrow", or the weekday and date, for a heading over one day of a list.
export function dayLabel(iso: string, lang: string, timeZone?: string): string {
  const day = homeDay(iso, timeZone);
  if (day === homeDay(Date.now(), timeZone)) return t(lang, "today");
  if (day === homeDay(Date.now() + 86400000, timeZone)) return t(lang, "tomorrow");
  return new Date(iso).toLocaleDateString(lang, { weekday: "long", day: "numeric", month: "long", timeZone: timeZone || undefined });
}

// The clock time of a moment in the home's zone.
export function clock(iso: string, lang: string, timeZone?: string): string {
  return new Date(iso).toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit", timeZone: timeZone || undefined });
}

// A short moment for the side of a row: the time today, else the date.
export function shortWhen(iso: string | null | undefined, lang: string, timeZone?: string): string {
  if (!iso) return "";
  if (homeDay(iso, timeZone) === homeDay(Date.now(), timeZone)) return clock(iso, lang, timeZone);
  return new Date(iso).toLocaleDateString(lang, { day: "numeric", month: "short", timeZone: timeZone || undefined });
}
