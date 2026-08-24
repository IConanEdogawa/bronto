#!/usr/bin/env python3
"""Patch site-a index.html with BM Holdings SEO meta tags (idempotent)."""
from pathlib import Path

PATHS = [
    Path("/var/www/KoruzApi/publish/wwwroot/site-a/index.html"),
    Path("/var/www/KoruzApi/KoruzApi/wwwroot/site-a/index.html"),
]

OLD_TITLE = "<title>KORUZ — Direct Sourcing from South Korea</title>"
NEW_HEAD = """<title>BM Holdings — Direct Sourcing from South Korea</title>
<meta name=\"description\" content=\"BM Holdings sources vehicles, auto parts, cosmetics, and laptops directly from verified sellers in South Korea.\">
<meta name=\"robots\" content=\"index,follow\">
<link rel=\"canonical\" href=\"https://bmholdings.llc/\">
<meta property=\"og:type\" content=\"website\">
<meta property=\"og:url\" content=\"https://bmholdings.llc/\">
<meta property=\"og:title\" content=\"BM Holdings — Direct Sourcing from South Korea\">
<meta property=\"og:description\" content=\"Vehicles, parts, cosmetics, and laptops sourced directly from South Korea.\">
<meta property=\"og:site_name\" content=\"BM Holdings\">
<meta name=\"twitter:card\" content=\"summary\">
<meta name=\"twitter:title\" content=\"BM Holdings — Direct Sourcing from South Korea\">
<meta name=\"twitter:description\" content=\"Vehicles, parts, cosmetics, and laptops sourced directly from South Korea.\">"""

for path in PATHS:
    if not path.exists():
        print("skip missing", path)
        continue
    text = path.read_text(encoding="utf-8", errors="replace")
    if "BM Holdings — Direct Sourcing" in text and 'name="description"' in text:
        print("already patched", path)
        continue
    if OLD_TITLE not in text:
        print("title not found", path)
        continue
    text = text.replace(OLD_TITLE, NEW_HEAD, 1)
    text = text.replace(
        "document.title = lang==='ko' ? 'KORUZ — 대한민국 직접 소싱' : 'KORUZ — Direct Sourcing from South Korea';",
        "document.title = lang==='ko' ? 'BM Holdings — 대한민국 직접 소싱' : 'BM Holdings — Direct Sourcing from South Korea';",
        1,
    )
    path.write_text(text, encoding="utf-8")
    print("patched", path)
