#!/usr/bin/env python3
"""Idempotent inject of contact JS, site-b CSS, and site-a category carousels."""
from pathlib import Path

ROOTS = [
    Path("/var/www/KoruzApi/publish/wwwroot"),
    Path("/var/www/KoruzApi/KoruzApi/wwwroot"),
]

CONTACT_TAG = '<script src="/js/apply-contact.js"></script>'
SITE_A_CAT_JS = '<script src="apply-category-images.js"></script>'
SITE_B_CSS = '<link rel="stylesheet" href="site-b-layout-fix.css">'
SITE_B_JS = '<script src="apply-images.js"></script>'


def inject_before_body_end(path: Path, snippet: str, needle: str) -> None:
    if not path.exists():
        print("skip missing", path)
        return
    text = path.read_text(encoding="utf-8", errors="replace")
    if needle in text:
        print("already", needle, path)
        return
    if "</body>" not in text:
        print("no </body>", path)
        return
    path.write_text(text.replace("</body>", snippet + "\n</body>", 1), encoding="utf-8")
    print("injected", needle, "->", path)


def inject_in_head(path: Path, snippet: str, needle: str) -> None:
    if not path.exists():
        print("skip missing", path)
        return
    text = path.read_text(encoding="utf-8", errors="replace")
    if needle in text:
        print("already", needle, path)
        return
    if "</head>" not in text:
        print("no </head>", path)
        return
    path.write_text(text.replace("</head>", snippet + "\n</head>", 1), encoding="utf-8")
    print("injected", needle, "->", path)


for root in ROOTS:
    inject_before_body_end(root / "site-a" / "index.html", CONTACT_TAG, "apply-contact.js")
    inject_before_body_end(root / "site-a" / "index.html", SITE_A_CAT_JS, "apply-category-images.js")
    inject_before_body_end(root / "site-b" / "index.html", CONTACT_TAG, "apply-contact.js")
    inject_before_body_end(root / "site-b" / "index.html", SITE_B_JS, "apply-images.js")
    inject_in_head(root / "site-b" / "index.html", SITE_B_CSS, "site-b-layout-fix.css")
