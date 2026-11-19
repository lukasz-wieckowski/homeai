"""Diagnostics: everything useful for a bug report, with secrets and personal names removed."""

from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import VERSION

TO_REDACT = {
    "api_key",
    "token",
    "password",
    "secret",
    "user_id",
    "system_user_id",
    "base_url",
    "user",
    "author",
    "author_name",
    "requester",
    "decided_by",
    "acked_by",
    "handled_by",
    "note",
    "executor.local_url",
    "notify.targets",
}


def _anonymise(value: Any, names: dict[str, str]) -> Any:
    """People's names and person entities replaced by “Person 1”, “person.1” everywhere in the export."""
    if isinstance(value, dict):
        return {_anonymise(k, names): _anonymise(v, names) for k, v in value.items()}
    if isinstance(value, (list, tuple)):
        return [_anonymise(v, names) for v in value]
    if isinstance(value, str):
        for real, alias in names.items():
            value = value.replace(real, alias)
    return value


async def async_get_config_entry_diagnostics(hass: HomeAssistant, entry: ConfigEntry) -> dict[str, Any]:
    rt = entry.runtime_data
    data: dict[str, Any] = {
        "version": VERSION,
        "entry": async_redact_data(dict(entry.data), TO_REDACT),
        "subentries": [
            {"type": s.subentry_type, "title": s.title, "data": async_redact_data(dict(s.data), TO_REDACT)}
            for s in entry.subentries.values()
        ],
        "ready": rt.ready,
        "language": rt.language,
        "world": rt.world.summary(),
        "settings": async_redact_data(rt.settings.export(), TO_REDACT),
        "settings_history": async_redact_data(rt.settings.history(50), TO_REDACT),
        "journal": async_redact_data(rt.journal.recent(200), TO_REDACT),
        "modules": {},
    }
    for name, module in rt.modules.items():
        diag = getattr(module, "diagnostics", None)
        if diag is not None:
            try:
                data["modules"][name] = async_redact_data(diag(), TO_REDACT)
            except Exception as err:
                data["modules"][name] = {"error": str(err)}
        else:
            data["modules"][name] = {"loaded": True}
    names: dict[str, str] = {}
    people = sorted(rt.world.persons.values(), key=lambda p: p.entity_id)
    for n, person in enumerate(people, start=1):
        names[person.entity_id] = f"person.{n}"
    for n, person in sorted(enumerate(people, start=1), key=lambda x: -len(x[1].name or "")):
        if person.name and len(person.name) > 1:  # longer names first, so “Anna Maria” is not left as “Person 1 Maria”
            names[person.name] = f"Person {n}"
    return _anonymise(data, names)
