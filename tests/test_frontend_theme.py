"""The panel and the cards take their look from the Home Assistant theme: no fixed colours, fonts, radii, shadows or
spacing in the frontend sources, every `--homeai-*` variable and part documented in the README."""

from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).parent.parent
SOURCES = sorted((ROOT / "frontend" / "src").rglob("*.ts"))
README = (ROOT / "README.md").read_text()
README_PL = (ROOT / "README.pl.md").read_text()

# properties that carry a colour, a font, a radius, a shadow or a spacing
THEMED = re.compile(
    r"^(color|background(-color)?|accent-color|border(-(top|right|bottom|left))?(-(color|width|radius))?|"
    r"border-radius|box-shadow|font(-(family|size|weight))?|margin(-\w+)?|padding(-\w+)?|gap|row-gap|column-gap)$"
)
KEYWORDS = {"0", "auto", "none", "solid", "transparent", "inherit"}
PANEL_PARTS = {"header", "header-title", "tabs", "tab", "tab-active", "tab-icon", "tab-label", "content"}


def strip_vars(value: str) -> str:
    """The value without its var(...) references (nested ones too)."""
    out, depth, i = [], 0, 0
    while i < len(value):
        if value.startswith("var(", i) and depth == 0:
            depth, i = 1, i + 4
            continue
        if depth:
            depth += {"(": 1, ")": -1}.get(value[i], 0)
        else:
            out.append(value[i])
        i += 1
    return "".join(out)


def css_blocks() -> list[tuple[str, str]]:
    blocks = []
    for path in SOURCES:
        for template in re.findall(r"css`(.*?)`", path.read_text(), re.S):
            css = re.sub(r"/\*.*?\*/", "", template, flags=re.S)
            blocks += [(path.name, body) for body in re.findall(r"\{([^{}]*)\}", css)]
    return blocks


def declarations() -> list[tuple[str, str, str]]:
    out = []
    for name, body in css_blocks():
        for decl in body.split(";"):
            if ":" in decl:
                prop, value = decl.split(":", 1)
                out.append((name, prop.strip(), value.strip()))
    return out


def test_no_fixed_colours_fonts_radii_shadows_or_spacing() -> None:
    checked = 0
    for name, prop, value in declarations():
        if prop.startswith("--") or not THEMED.match(prop):
            continue
        checked += 1
        left = set(strip_vars(value).split())
        assert left <= KEYWORDS, f"{name}: {prop}: {value}"
    assert checked > 50


def test_no_literal_colours_or_pixels_anywhere_in_the_sources() -> None:
    for path in SOURCES:
        text = path.read_text()
        assert not re.search(r"#[0-9a-fA-F]{3,8}\b", text), path.name
        assert not re.search(r"\b(rgba?|hsla?)\(", text), path.name
        assert not re.search(r"\d+px\b", text), path.name
        assert "style=" not in text, f"{path.name}: inline style (use a class, so themes and parts reach it)"


def test_private_tokens_are_defined_and_public_ones_documented() -> None:
    text = "\n".join(p.read_text() for p in SOURCES)
    defined = set(re.findall(r"(--_[\w-]+)\s*:", text))
    used = set(re.findall(r"var\((--_[\w-]+)", text))
    assert used <= defined, used - defined
    public = set(re.findall(r"var\((--homeai-[\w-]+)", text))
    assert len(public) > 40
    documented = set(re.findall(r"`(--homeai-[\w-]+)`", README))
    assert public == documented, {"undocumented": public - documented, "unknown": documented - public}
    assert public == set(re.findall(r"`(--homeai-[\w-]+)`", README_PL))
    for line in re.findall(r"^\s*(--_[\w-]+:.*)$", (ROOT / "frontend/src/styles.ts").read_text(), re.M):
        assert "var(" in line, line  # every token is derived from a variable


def test_parts_are_exported_and_documented() -> None:
    styles = (ROOT / "frontend/src/styles.ts").read_text()
    exported = set(re.findall(r'^\s*"([a-z0-9-]+)",$', styles, re.M))
    used: set[str] = set()
    for path in SOURCES:
        for value in re.findall(r'part="([^"]+)"', path.read_text()):
            names = re.sub(r"\$\{[^}]*\}", "$", value)  # badge-${severity} is one of badge-0 … badge-4
            used |= {p for p in names.split() if "$" not in p}
        for expression in re.findall(r"part=\$\{([^}]*)\}", path.read_text()):
            for quoted in re.findall(r'"([^"]*)"', expression):
                used |= set(quoted.split())
    assert used - PANEL_PARTS <= exported, used - PANEL_PARTS - exported
    for part in exported | PANEL_PARTS:
        assert f"`{part}`" in README, part
        assert f"`{part}`" in README_PL, part
    panel = (ROOT / "frontend/src/panel.ts").read_text()
    assert panel.count("exportparts=${PARTS}") == 4  # every view passes its parts on
    assert "exportparts=${PARTS}" in (ROOT / "frontend/src/card.ts").read_text()  # the chat card too


def test_liquid_glass_only_on_the_navigation_layer() -> None:
    """Glass (a backdrop filter) only on the top bar, the glass groups and sheets, never on content; and it gives way
    to reduced transparency, increased contrast and browsers without color-mix()."""
    glass = set()
    for path in SOURCES:
        for template in re.findall(r"css`(.*?)`", path.read_text(), re.S):
            css = re.sub(r"/\*.*?\*/", "", template, flags=re.S)
            for selector, body in re.findall(r"([^{};]+)\{([^{}]*)\}", css):
                if "backdrop-filter" in body:
                    glass.add(selector.strip())
    assert glass == {".glass", ".card.sheet", ".toolbar"}, glass
    styles = (ROOT / "frontend/src/styles.ts").read_text()
    for query in (
        "prefers-reduced-transparency: reduce",
        "prefers-contrast: more",
        "@supports not (background: color-mix",
    ):
        assert query in styles, query
    assert "--ha-animation-duration-" in styles  # Home Assistant turns these down for reduced motion
