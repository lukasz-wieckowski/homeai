"""A scripted AI provider for tests."""

from __future__ import annotations

from typing import Any

from custom_components.homeai.ai.providers.base import AIError, AIRequest, AIResponse, ToolCall


class FakeProvider:
    name = "fake"

    def __init__(self, answers: list[Any] | None = None, model: str = "fake-model", cost: float = 0.001) -> None:
        self.answers = list(answers or [])
        self.model = model
        self.cost = cost
        self.requests: list[AIRequest] = []

    async def check(self) -> None:
        return None

    async def complete(self, request: AIRequest) -> AIResponse:
        self.requests.append(request)
        answer = self.answers.pop(0) if self.answers else {"text": "ok"}
        if callable(answer):  # an answer that depends on what the model was sent (e.g. a code from a tool result)
            answer = answer(request)
        if isinstance(answer, Exception):
            raise answer
        if isinstance(answer, dict) and "tool_calls" in answer:
            calls = [ToolCall(f"c{i}", name, args) for i, (name, args) in enumerate(answer["tool_calls"])]
            return AIResponse(
                tool_calls=calls,
                model=self.model,
                cost=self.cost,
                stop_reason="tool_use",
                assistant_message={
                    "role": "assistant",
                    "content": [{"type": "tool_use", "id": c.id, "name": c.name, "input": c.input} for c in calls],
                },
            )
        if isinstance(answer, dict) and "text" in answer:
            return AIResponse(
                text=answer["text"],
                model=self.model,
                cost=self.cost,
                input_tokens=100,
                output_tokens=20,
                assistant_message={"role": "assistant", "content": answer["text"]},
            )
        return AIResponse(data=answer, text="{}", model=self.model, cost=self.cost, input_tokens=100, output_tokens=20)

    def tool_results(self, results):
        return [
            {
                "role": "user",
                "content": [
                    {"type": "tool_result", "tool_use_id": c.id, "content": t, "is_error": e} for c, t, e in results
                ],
            }
        ]


def last_tool_result(request: AIRequest) -> dict[str, Any]:
    """The newest tool result the model was sent, parsed."""
    import json

    for message in reversed(request.messages):
        content = message.get("content")
        if message.get("role") == "user" and isinstance(content, list):
            for block in reversed(content):
                if isinstance(block, dict) and block.get("type") == "tool_result":
                    return json.loads(block["content"])
    return {}


def tier(t: str = "p1", model: str = "claude-haiku-5-5", **kw: Any) -> dict[str, Any]:
    return {"tier": t, "provider": "anthropic", "model": model, "api_key": "sk-test", **kw}


def install(rt: Any, tier_name: str, provider: FakeProvider, index: int = 0) -> None:
    cfg = rt.module("ai").tiers[tier_name][index]
    rt.module("ai")._providers[cfg.subentry_id] = provider


__all__ = ["AIError", "FakeProvider", "install", "last_tool_result", "tier"]
