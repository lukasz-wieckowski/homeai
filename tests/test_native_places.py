"""What moved into Home Assistant's own places in 1.7: memory as a to-do list, facts and habits as approval
requests in the inbox, the journal in the logbook, AI spend and budgets as entities, settings export and import as
services."""

from __future__ import annotations

from datetime import datetime, timedelta

from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import ServiceValidationError
from homeassistant.util import dt as dt_util
import pytest

from .common import settle, setup_homeai
from .home import standard_home


def _changes(entity_id: str, hour: int, minute: int, days: int) -> list[tuple[datetime, str]]:
    now = dt_util.now()
    return [
        ((now - timedelta(days=d + 1)).replace(hour=hour, minute=minute, second=0, microsecond=0), "on")
        for d in range(days)
        if (now - timedelta(days=d + 1)).weekday() < 5
    ]


async def _items(hass: HomeAssistant, entity_id: str = "todo.homeai_memory") -> list[dict]:
    response = await hass.services.async_call(
        "todo", "get_items", {"entity_id": entity_id}, blocking=True, return_response=True
    )
    return response[entity_id]["items"]


# ——— Memory as a to-do list ———
async def test_memory_is_a_todo_list(hass: HomeAssistant, hass_admin_user) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    memory = rt.module("memory")
    memory.add("The bins go out on Tuesdays", source="person")
    memory.add("Anna likes it warm", scope="person:person.anna", source="person")  # personal: not listed
    memory.add("Guests often stay on Fridays", source="ai")  # not approved yet: not listed
    await hass.async_block_till_done()
    assert hass.states.get("todo.homeai_memory").state == "1"
    [item] = await _items(hass)
    assert item["summary"] == "The bins go out on Tuesdays" and item["status"] == "needs_action"

    await hass.services.async_call(
        "todo", "add_item", {"entity_id": "todo.homeai_memory", "item": "The cat is called Tom"}, blocking=True
    )
    fact = next(f for f in memory.facts.values() if f["text"] == "The cat is called Tom")
    assert fact["approved"] and fact["source"] == "person" and fact["scope"] == "home"

    await hass.services.async_call(
        "todo",
        "update_item",
        {"entity_id": "todo.homeai_memory", "item": fact["id"], "rename": "The cat is called Tommy"},
        blocking=True,
    )
    assert memory.facts[fact["id"]]["text"] == "The cat is called Tommy"
    await hass.services.async_call(
        "todo",
        "update_item",
        {"entity_id": "todo.homeai_memory", "item": fact["id"], "status": "completed"},
        blocking=True,
    )
    assert fact["id"] in memory.facts  # a fact is not a task: ticking it off changes nothing
    assert all(i["status"] == "needs_action" for i in await _items(hass))

    await hass.services.async_call(
        "todo", "remove_item", {"entity_id": "todo.homeai_memory", "item": fact["id"]}, blocking=True
    )
    assert fact["id"] not in memory.facts
    assert hass.states.get("todo.homeai_memory").state == "1"


async def test_only_residents_change_the_memory(hass: HomeAssistant, hass_admin_user) -> None:
    from homeassistant.core import Context

    standard_home(hass)
    rt = await setup_homeai(hass)
    fact = rt.module("memory").add("The bins go out on Tuesdays", source="person")
    await hass.async_block_till_done()
    # an account without a person (not the owner: that is the administrator) is not a resident
    visitor = await hass.auth.async_create_user("Visitor", group_ids=["system-users"])
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            "todo",
            "add_item",
            {"entity_id": "todo.homeai_memory", "item": "Leave the door open"},
            blocking=True,
            context=Context(user_id=visitor.id),
        )
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            "todo",
            "remove_item",
            {"entity_id": "todo.homeai_memory", "item": fact["id"]},
            blocking=True,
            context=Context(user_id=visitor.id),
        )
    assert list(rt.module("memory").facts) == [fact["id"]]


# ——— Facts and habits as approval requests ———
async def test_a_fact_noticed_by_ai_waits_in_the_inbox(hass: HomeAssistant, hass_admin_user, hass_ws_client) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    memory, approvals = rt.module("memory"), rt.module("approvals")
    fact = memory.add("Guests often stay on Fridays", source="ai")
    [item] = approvals.pending()
    assert item["kind"] == "fact" and item["ref"] == fact["id"] and item["expires"] is None
    assert "Guests often stay on Fridays" in item["what"]
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "homeai/approvals/list"})
    assert (await client.receive_json())["result"]["pending"][0]["id"] == item["id"]
    await client.send_json_auto_id({"type": "homeai/approvals/approve", "approval_id": item["id"]})
    msg = await client.receive_json()
    assert msg["success"] and msg["result"]["status"] == "approved"
    assert memory.facts[fact["id"]]["approved"] and not approvals.pending()
    await hass.async_block_till_done()
    assert [i["summary"] for i in await _items(hass)] == ["Guests often stay on Fridays"]

    other = memory.add("Nobody is home on Mondays", source="ai")
    [item] = approvals.pending()
    await client.send_json_auto_id({"type": "homeai/approvals/deny", "approval_id": item["id"]})
    assert (await client.receive_json())["result"]["status"] == "denied"
    assert other["id"] not in memory.facts


async def test_a_fact_approved_elsewhere_stops_asking(hass: HomeAssistant) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    memory, approvals = rt.module("memory"), rt.module("approvals")
    fact = memory.add("The garden is watered at 6", source="ai")
    assert approvals.find("fact", fact["id"]) is not None
    memory.approve(fact["id"])
    assert approvals.find("fact", fact["id"]) is None
    gone = memory.add("The car is grey", source="ai")
    memory.remove(gone["id"])
    assert not approvals.pending()


async def test_waiting_facts_from_before_become_requests(hass: HomeAssistant, hass_storage) -> None:
    hass_storage["homeai.memory"] = {
        "version": 1,
        "minor_version": 1,
        "key": "homeai.memory",
        "data": {
            "facts": [
                {
                    "id": "f1",
                    "text": "The dog sleeps in the hall",
                    "scope": "home",
                    "source": "ai",
                    "confidence": 0.7,
                    "approved": False,
                    "created": "2026-11-01T10:00:00+00:00",
                    "expires": None,
                    "author": None,
                    "data": {},
                }
            ]
        },
    }
    standard_home(hass)
    rt = await setup_homeai(hass)
    [item] = rt.module("approvals").pending()
    assert item["kind"] == "fact" and item["ref"] == "f1"


async def test_a_private_fact_is_asked_of_its_person(
    hass: HomeAssistant, hass_ws_client, hass_read_only_user, hass_read_only_access_token: str
) -> None:
    home = standard_home(hass)
    home.person("ben", "Ben", user_id=hass_read_only_user.id)
    rt = await setup_homeai(hass, overrides={"person:person.ben": {"presence.role": "member"}})
    rt.module("memory").add("Ben starts work at 8", scope="person:person.ben", source="ai")
    [item] = rt.module("approvals").pending()
    assert item["private"] and item["approver"] == "requester" and item["requester"] == hass_read_only_user.id
    ben = await hass_ws_client(hass, hass_read_only_access_token)
    await ben.send_json_auto_id({"type": "homeai/approvals/list"})
    assert [a["id"] for a in (await ben.receive_json())["result"]["pending"]] == [item["id"]]


async def test_a_habit_waits_in_the_inbox(hass: HomeAssistant, hass_admin_user) -> None:
    standard_home(hass)
    hass.services.async_register("light", "turn_on", callback(lambda c: None))
    rt = await setup_homeai(hass)
    learning, approvals = rt.module("learning"), rt.module("approvals")
    [proposal] = await learning.detect_habits({"light.ceiling": _changes("light.ceiling", 6, 40, 21)})
    [item] = approvals.pending()
    assert item["kind"] == "habit" and item["what"] == proposal["title"] and not item["risk"]
    approved = await approvals.approve(item["id"], hass_admin_user.id)
    assert approved is not None and approved["status"] == "approved"
    assert learning.proposals[proposal["id"]]["status"] == "approved"
    [entry] = rt.module("scheduler").entries.values()
    assert entry["author"] == hass_admin_user.id
    # the habit learned is remembered at once, without a request of its own
    assert not approvals.pending()


async def test_a_habit_refused_in_the_inbox_is_not_proposed_again(hass: HomeAssistant, hass_admin_user) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    learning, approvals = rt.module("learning"), rt.module("approvals")
    [proposal] = await learning.detect_habits({"light.ceiling": _changes("light.ceiling", 6, 40, 21)})
    [item] = approvals.pending()
    assert (await approvals.deny(item["id"], hass_admin_user.id))["status"] == "denied"
    assert learning.proposals[proposal["id"]]["status"] == "rejected"
    del learning.proposals[proposal["id"]]
    assert await learning.detect_habits({"light.ceiling": _changes("light.ceiling", 6, 40, 21)}) == []
    # rejected over the old command: the request goes away too
    [again] = await learning.detect_habits({"light.kitchen": _changes("light.kitchen", 7, 10, 21)}) or [None]
    if again is not None:
        learning.reject(again["id"])
        assert not approvals.pending()


# ——— The journal in the logbook ———
async def test_journal_entries_that_matter_go_to_the_logbook(hass: HomeAssistant) -> None:
    home = standard_home(hass)
    rt = await setup_homeai(hass)
    hass.config.components.add("logbook")
    entries = []
    hass.bus.async_listen("logbook_entry", callback(lambda e: entries.append(e)))  # noqa: PLW0108
    rt.journal.add("setting", "Setting changed: Language")
    rt.journal.add("ai", "P1 assessed something")  # bookkeeping: journal only
    rt.journal.add("system", "Started")
    await hass.async_block_till_done()
    assert [e.data["message"] for e in entries] == ["Setting changed: Language"]
    assert entries[0].data["name"] == "HomeAI" and entries[0].data["domain"] == "homeai"
    assert entries[0].data["entity_id"] == "sensor.homeai_situations"
    assert len(rt.journal.recent(10)) >= 3  # the journal itself keeps everything

    entries.clear()
    home.set("binary_sensor.sink_leak", "on")
    await settle(hass, rt)
    assert any(e.data["message"].startswith("Situation:") for e in entries)
    home.set("binary_sensor.sink_leak", "off")
    await settle(hass, rt)
    await settle(hass, rt)
    assert any(e.data["message"].startswith("Resolved:") for e in entries)


# ——— AI spend and budgets ———
async def test_ai_spend_sensors_show_their_budgets(hass: HomeAssistant) -> None:
    from .fake_ai import tier

    standard_home(hass)
    rt = await setup_homeai(hass, {"ai.budget_daily": 2.5}, subentries=[tier("p1")])
    await hass.async_block_till_done()
    today = hass.states.get("sensor.homeai_ai_cost_today")
    month = hass.states.get("sensor.homeai_ai_cost_month")
    assert today.attributes["budget"] == 2.5 and month.attributes["budget"] == 10.0
    assert hass.states.get("number.homeai_ai_budget_daily").state == "2.5"
    await hass.services.async_call(
        "number", "set_value", {"entity_id": "number.homeai_ai_budget_daily", "value": 4}, blocking=True
    )
    await hass.async_block_till_done()
    assert rt.settings.get("ai.budget_daily") == 4.0
    assert hass.states.get("sensor.homeai_ai_cost_today").attributes["budget"] == 4.0


# ——— Settings export and import ———
async def test_settings_export_and_import_services(hass: HomeAssistant) -> None:
    standard_home(hass)
    rt = await setup_homeai(hass)
    rt.settings.set("general.language", "pl", user="test")
    rt.settings.set("detectors.battery.threshold", 30, skey="area:kitchen", user="test")
    exported = await hass.services.async_call("homeai", "export_settings", {}, blocking=True, return_response=True)
    assert exported["global"]["general.language"] == "pl"
    assert exported["overrides"]["area:kitchen"] == {"detectors.battery.threshold": 30}

    rt.settings.set("general.language", "en", user="test")
    legacy = {
        **exported,
        "global": {
            **exported["global"],
            "detectors.custom": [
                {
                    "id": "plug",
                    "name": "Plug on",
                    "target": {"entities": ["switch.coffee"]},
                    "condition": {"type": "state", "value": "on"},
                }
            ],
        },
    }
    result = await hass.services.async_call(
        "homeai", "import_settings", {"settings": legacy}, blocking=True, return_response=True
    )
    await hass.async_block_till_done()
    assert result["rules_added"] == 1 and rt.settings.get("general.language") == "pl"
    assert [r["id"] for r in rt.entry.runtime_data.rules] == ["plug"]

    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            "homeai", "import_settings", {"settings": {"global": {"general.language": "xx"}}}, blocking=True
        )
    assert rt.settings.get("general.language") == "pl"  # all or nothing


async def test_diagnostics_keep_settings_and_prompts(hass: HomeAssistant) -> None:
    from custom_components.homeai.diagnostics import async_get_config_entry_diagnostics

    from .fake_ai import tier

    standard_home(hass)
    rt = await setup_homeai(hass, {"ai.prompt_chat": "Be brief."}, subentries=[tier("p1")])
    data = await async_get_config_entry_diagnostics(hass, rt.entry)
    assert data["settings"]["global"]["ai.prompt_chat"] == "Be brief."
    prompts = data["modules"]["ai"]["prompts"]
    assert prompts["chat"]["own"] == "Be brief." and prompts["triage"]["built_in"]
    assert "last_prompts" in data["modules"]["ai"]
