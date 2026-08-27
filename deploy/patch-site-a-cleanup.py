#!/usr/bin/env python3
"""Site A cleanup after layout bugs:
- Disable applyStaticText (index-based text was overwriting codes/logos/footer)
- Footer brand -> BMHOLDINGS
- Hard isolation for category cards / marquees
"""
from pathlib import Path
import re

PATHS = [
    Path("/var/www/KoruzApi/publish/wwwroot/site-a/index.html"),
    Path("/var/www/KoruzApi/KoruzApi/wwwroot/site-a/index.html"),
]

EXTRA_CSS = r'''
  /* cleanup isolation */
  .cat-card{isolation:isolate;overflow:hidden;position:relative;z-index:1}
  .cat-marquee,.text-logo-marquee,.logo-marquee{overflow:hidden;max-width:100%}
  .logo-chip{white-space:nowrap}
  footer .wordmark{letter-spacing:.06em}
'''


def disable_static_text(text: str) -> str:
    # Make applyStaticText a no-op so corrupted saved static keys cannot paint random labels
    if "function applyStaticText" not in text:
        print("applyStaticText not found")
        return text
    text = re.sub(
        r"function applyStaticText\(staticText\)\{[\s\S]*?\n  \}",
        "function applyStaticText(staticText){\n    /* disabled: index-based static text corrupts catalog codes/logos after layout changes */\n    return;\n  }",
        text,
        count=1,
    )
    return text


def fix_footer_brand(text: str) -> str:
    text = text.replace(
        '<a href="#" class="wordmark">KORUZ<span>·KR</span></a>',
        '<a href="#" class="wordmark">BMHOLDINGS<span>·KR</span></a>',
    )
    # nav wordmark too if still KORUZ
    text = text.replace(
        'class="wordmark">KORUZ<span>·KR</span>',
        'class="wordmark">BMHOLDINGS<span>·KR</span>',
    )
    text = text.replace(
        '<div class="mono" style="margin-top:10px" data-footer-tagline>SEOUL — TASHKENT</div>',
        '<div class="mono" style="margin-top:10px" data-footer-tagline>BM HOLDINGS</div>',
    )
    return text


def inject_css(text: str) -> str:
    if "cleanup isolation" in text:
        return text
    if "</style>" in text:
        text = text.replace("</style>", EXTRA_CSS + "\n</style>", 1)
    return text


def patch(path: Path) -> None:
    if not path.exists():
        print("skip", path)
        return
    text = path.read_text(encoding="utf-8", errors="replace")
    text = disable_static_text(text)
    text = fix_footer_brand(text)
    text = inject_css(text)
    path.write_text(text, encoding="utf-8")
    print("cleaned", path)


for p in PATHS:
    patch(p)
