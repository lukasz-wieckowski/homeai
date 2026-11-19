"""Tier configuration (from subentries) and provider construction."""

from __future__ import annotations

from dataclasses import dataclass
import importlib
from typing import Any

from homeassistant.core import HomeAssistant

from .pricing import DEFAULT_EFFORT, price_for
from .providers.base import Provider


@dataclass(frozen=True, slots=True)
class TierConfig:
    subentry_id: str
    tier: str
    provider: str
    model: str
    api_key: str = ""
    base_url: str = ""
    effort: str | None = None
    fallbacks: bool = True
    privacy: str = "default"
    priority: int = 1
    price_input: float | None = None
    price_output: float | None = None
    max_tokens: int | None = None  # cap on the answer length for this connection
    timeout: float | None = None  # seconds; replaces the tier's timeout setting
    budget_daily: float | None = None  # dollars per day for this connection; then the next one is tried
    title: str = ""

    @classmethod
    def from_data(cls, subentry_id: str, data: dict[str, Any], title: str = "") -> TierConfig:
        tier = data.get("tier", "p1")
        return cls(
            subentry_id=subentry_id,
            tier=tier,
            provider=data.get("provider", "anthropic"),
            model=str(data.get("model", "")),
            api_key=str(data.get("api_key") or ""),
            base_url=str(data.get("base_url") or ""),
            effort=data.get("effort")
            or (DEFAULT_EFFORT.get(tier) if data.get("provider", "anthropic") == "anthropic" else None),
            fallbacks=bool(data.get("fallbacks", True)),
            privacy=str(data.get("privacy") or "default"),
            priority=int(data.get("priority") or 1),
            price_input=data.get("price_input"),
            price_output=data.get("price_output"),
            max_tokens=int(data["max_tokens"]) if data.get("max_tokens") else None,
            timeout=float(data["timeout"]) if data.get("timeout") else None,
            budget_daily=float(data["budget_daily"]) if data.get("budget_daily") else None,
            title=title,
        )

    @property
    def local(self) -> bool:
        return self.provider == "openai_compatible" and any(
            h in self.base_url for h in ("localhost", "127.0.0.1", "192.168.", "10.", ".local", "172.16.")
        )


async def build_provider(hass: HomeAssistant, cfg: TierConfig) -> Provider:
    price = price_for(cfg.model, cfg.price_input, cfg.price_output)
    # Provider modules import their SDKs (anthropic takes seconds on a small machine): import them in the import
    # executor, never on the event loop. Later calls find them in sys.modules.
    load = importlib.import_module
    if cfg.provider == "openai_compatible":
        compat = await hass.async_add_import_executor_job(load, f"{__package__}.providers.openai_compat")
        return compat.OpenAICompatProvider(hass, cfg.base_url, cfg.model, price, cfg.api_key)
    module = await hass.async_add_import_executor_job(load, f"{__package__}.providers.anthropic")
    client = await module.async_create_client(hass, cfg.api_key)
    return module.AnthropicProvider(client, cfg.model, price, fallbacks=cfg.fallbacks)
