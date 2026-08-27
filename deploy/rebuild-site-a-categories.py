#!/usr/bin/env python3
"""Rebuild Site A #categories into luxury B&W catalog with image marquees.
Archives the previous block next to each index.html.
"""
from pathlib import Path
import re

PATHS = [
    Path("/var/www/KoruzApi/publish/wwwroot/site-a/index.html"),
    Path("/var/www/KoruzApi/KoruzApi/wwwroot/site-a/index.html"),
]

NEW_SECTION = r'''<!-- ============ CATEGORIES ============ -->
<section id="categories">
  <div class="container">
    <div class="section-head reveal">
      <div class="mono" data-i18n="cat_eyebrow"></div>
      <h2 class="display" data-i18n="cat_title"></h2>
    </div>

    <div class="cat-grid reveal">
      <article class="cat-card" data-cat-code="VHC">
        <div class="cat-card-head">
          <span class="cat-code mono">VHC</span>
          <span class="cat-index mono">01</span>
        </div>
        <div class="cat-marquee" data-cat-marquee="VHC" aria-label="Vehicle brand logos">
          <div class="cat-marquee-empty mono">Logos</div>
        </div>
        <h3 data-i18n="cat1_name"></h3>
        <p data-i18n="cat1_desc"></p>
      </article>

      <article class="cat-card" data-cat-code="PRT">
        <div class="cat-card-head">
          <span class="cat-code mono">PRT</span>
          <span class="cat-index mono">02</span>
        </div>
        <div class="cat-marquee" data-cat-marquee="PRT" aria-label="Parts brand logos">
          <div class="cat-marquee-empty mono">Logos</div>
        </div>
        <h3 data-i18n="cat2_name"></h3>
        <p data-i18n="cat2_desc"></p>
      </article>

      <article class="cat-card" data-cat-code="CSM">
        <div class="cat-card-head">
          <span class="cat-code mono">CSM</span>
          <span class="cat-index mono">03</span>
        </div>
        <div class="cat-marquee" data-cat-marquee="CSM" aria-label="Cosmetics brand logos">
          <div class="cat-marquee-empty mono">Logos</div>
        </div>
        <h3 data-i18n="cat3_name"></h3>
        <p data-i18n="cat3_desc"></p>
      </article>

      <article class="cat-card" data-cat-code="LPT">
        <div class="cat-card-head">
          <span class="cat-code mono">LPT</span>
          <span class="cat-index mono">04</span>
        </div>
        <div class="cat-marquee" data-cat-marquee="LPT" aria-label="Laptop brand logos">
          <div class="cat-marquee-empty mono">Logos</div>
        </div>
        <h3 data-i18n="cat4_name"></h3>
        <p data-i18n="cat4_desc"></p>
      </article>
    </div>
  </div>
</section>

'''

NEW_CSS = r'''  /* ---------- CATEGORIES (luxury catalog) ---------- */
  .cat-grid{
    display:grid;
    grid-template-columns:1fr 1fr;
    border:1px solid var(--line);
  }
  .cat-card{
    position:relative;
    padding:28px 28px 32px;
    border-right:1px solid var(--line);
    border-bottom:1px solid var(--line);
    background:transparent;
    transition:background .35s ease;
    min-width:0;
    overflow:hidden;
  }
  .cat-card:nth-child(2n){border-right:0}
  .cat-card:nth-child(n+3){border-bottom:0}
  .cat-card:hover{background:var(--surface)}
  .cat-card-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    margin-bottom:18px;
  }
  .cat-code{color:var(--muted)}
  .cat-index{color:var(--dim)}
  .cat-marquee{
    position:relative;
    height:112px;
    margin:0 0 22px;
    overflow:hidden;
    border:1px solid var(--line);
    background:
      linear-gradient(90deg, rgba(11,11,12,.98), rgba(11,11,12,0) 14%, rgba(11,11,12,0) 86%, rgba(11,11,12,.98)),
      var(--surface);
    display:flex;
    align-items:center;
  }
  .cat-marquee-empty{
    width:100%;
    text-align:center;
    color:var(--dim);
    letter-spacing:.18em;
    font-size:.68rem;
  }
  .cat-marquee[data-has-logos="1"] .cat-marquee-empty{display:none}
  .cat-marquee-track{
    display:flex;
    align-items:center;
    gap:22px;
    width:max-content;
    padding:0 14px;
    animation:cat-logo-scroll 40s linear infinite;
    will-change:transform;
  }
  .cat-marquee:hover .cat-marquee-track{animation-play-state:paused}
  .cat-marquee-set{
    display:flex;
    align-items:center;
    gap:22px;
    flex:0 0 auto;
  }
  .cat-logo-slot{
    flex:0 0 auto;
    height:76px;
    min-width:72px;
    max-width:160px;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:8px 12px;
  }
  .cat-logo-slot img{
    max-height:56px;
    max-width:140px;
    width:auto;
    height:auto;
    object-fit:contain;
    filter:grayscale(1) brightness(1.2) contrast(1.05);
    opacity:.88;
    transition:filter .3s ease, opacity .3s ease;
  }
  .cat-card:hover .cat-logo-slot img{
    filter:grayscale(.25) brightness(1.08);
    opacity:1;
  }
  @keyframes cat-logo-scroll{
    from{transform:translateX(0)}
    to{transform:translateX(-50%)}
  }
  .cat-card h3{
    font-stretch:112%;font-weight:700;text-transform:uppercase;
    letter-spacing:.01em;font-size:1.15rem;color:var(--white);margin-bottom:10px;
  }
  html[lang="ko"] .cat-card h3{font-family:var(--font-kr);font-stretch:normal}
  .cat-card p{color:var(--muted);font-size:.92rem;max-width:42ch;line-height:1.65}

'''


def rebuild(path: Path) -> None:
    if not path.exists():
        print("skip missing", path)
        return

    text = path.read_text(encoding="utf-8", errors="replace")

    if 'data-cat-marquee="VHC"' in text and "cat-logo-scroll" in text:
        print("already rebuilt", path)
        return

    start = text.find("<!-- ============ CATEGORIES ============ -->")
    end = text.find("<!-- ============ PROCESS ============ -->")
    if start < 0 or end < 0:
        print("section markers not found", path)
        return

    archive = path.with_name("_dump_categories_old.html")
    archive.write_text(
        "<!-- ARCHIVED old categories block -->\n" + text[start:end],
        encoding="utf-8",
    )
    print("archived ->", archive)

    text = text[:start] + NEW_SECTION + text[end:]

    css_start = text.find("  /* ---------- CATEGORIES ---------- */")
    if css_start < 0:
        css_start = text.find("  .cat-grid{")
    css_end = text.find("  /* ---------- PROCESS ---------- */")
    if css_start >= 0 and css_end > css_start:
        text = text[:css_start] + NEW_CSS + text[css_end:]
        print("css replaced", path)
    else:
        print("css block not found, HTML still updated", path)

    # mobile heights
    if ".cat-marquee{height:96px}" not in text:
        text = text.replace(
            "    .cat-grid{grid-template-columns:1fr}\n",
            "    .cat-grid{grid-template-columns:1fr}\n"
            "    .cat-marquee{height:96px}\n"
            "    .cat-logo-slot{height:64px;max-width:130px}\n"
            "    .cat-logo-slot img{max-height:48px;max-width:110px}\n",
        )

    old_ex = "if(parent.closest('script,style,noscript,template,[data-i18n]')) continue;"
    new_ex = "if(parent.closest('script,style,noscript,template,[data-i18n],.cat-marquee,.cat-logo-slot')) continue;"
    if old_ex in text and new_ex not in text:
        text = text.replace(old_ex, new_ex)

    path.write_text(text, encoding="utf-8")
    print("rebuilt", path)


for p in PATHS:
    rebuild(p)
