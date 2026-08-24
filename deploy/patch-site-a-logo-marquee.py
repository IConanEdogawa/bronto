#!/usr/bin/env python3
"""Fix Site A spinning text logos:
1) Exclude .logo-marquee from staticText edits (they break seamless loop)
2) Harden CSS so track width/animation is stable
"""
from pathlib import Path

PATHS = [
    Path("/var/www/KoruzApi/publish/wwwroot/site-a/index.html"),
    Path("/var/www/KoruzApi/KoruzApi/wwwroot/site-a/index.html"),
]

OLD = "if(parent.closest('script,style,noscript,template,[data-i18n]')) continue;"
NEW = "if(parent.closest('script,style,noscript,template,[data-i18n],.logo-marquee,.logo-track,.logo-set,.logo-chip,.koruz-img-marquee')) continue;"

CSS_SNIPPET = """
<style id="logo-marquee-fix">
.logo-marquee{overflow:hidden;position:relative}
.logo-track{display:flex;align-items:center;gap:26px;width:max-content;will-change:transform}
.logo-set{display:flex;align-items:center;gap:26px;flex:0 0 auto}
.logo-chip{white-space:nowrap}
</style>
"""

for path in PATHS:
    if not path.exists():
        print("skip missing", path)
        continue
    text = path.read_text(encoding="utf-8", errors="replace")
    changed = False

    if OLD in text and NEW not in text:
        text = text.replace(OLD, NEW)
        changed = True
        print("patched staticText exclude", path)
    elif NEW in text:
        print("exclude already present", path)
    else:
        print("staticText pattern not found", path)

    if 'id="logo-marquee-fix"' not in text and "</head>" in text:
        text = text.replace("</head>", CSS_SNIPPET + "</head>", 1)
        changed = True
        print("injected logo CSS", path)
    else:
        print("logo CSS ok", path)

    if changed:
        path.write_text(text, encoding="utf-8")
