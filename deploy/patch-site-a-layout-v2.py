#!/usr/bin/env python3
"""Site A layout v2:
- Categories: one card per row, larger logo marquee
- Cosmetics: add text logo marquee (from old dump brands)
- Contact: Telegram / Phone / Location rows (editable via API)
- Footer: tagline + disclaimer marked for editing
Idempotent where possible.
"""
from pathlib import Path
import re

PATHS = [
    Path("/var/www/KoruzApi/publish/wwwroot/site-a/index.html"),
    Path("/var/www/KoruzApi/KoruzApi/wwwroot/site-a/index.html"),
]

COSMETICS_TEXT_LOGOS = [
    "Anua", "celimax", "AXIS-Y", "3W CLINIC", "medicube", "MEDIPEEL+",
    "Luvum", "LAGOM", "Dr.GRAFT", "COSRX", "Dr.G", "WELLDERMA", "SKINDOM",
    "VT COSMETICS", "MERIKIT", "SKIN1004", "Centellian24", "Foellie",
    "ROUND LAB", "BEAUTY OF JOSEON", "d'Alba", "rom&nd", "CLIO PROFESSIONAL",
    "Dr. Althea", "Biodance",
]


def chips_html(extra_attrs: str = "") -> str:
    parts = []
    for name in COSMETICS_TEXT_LOGOS:
        parts.append(f'<span class="logo-chip"{extra_attrs}>{name}</span>')
    return "\n              ".join(parts)


TEXT_MARQUEE = f'''
        <div class="logo-marquee text-logo-marquee" aria-label="Cosmetics brand names">
          <div class="logo-track">
            <div class="logo-set">
              {chips_html()}
            </div>
            <div class="logo-set" aria-hidden="true">
              {chips_html()}
            </div>
          </div>
          <div class="logo-track reverse" aria-hidden="true">
            <div class="logo-set">
              {chips_html(' data-tone="muted"')}
            </div>
            <div class="logo-set" aria-hidden="true">
              {chips_html(' data-tone="muted"')}
            </div>
          </div>
        </div>
'''

NEW_SECTION = f'''<!-- ============ CATEGORIES ============ -->
<section id="categories">
  <div class="container">
    <div class="section-head reveal">
      <div class="mono" data-i18n="cat_eyebrow"></div>
      <h2 class="display" data-i18n="cat_title"></h2>
    </div>

    <div class="cat-grid cat-grid-stack reveal">
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
{TEXT_MARQUEE}
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

NEW_CSS = r'''  /* ---------- CATEGORIES (single-row luxury catalog) ---------- */
  .cat-grid,
  .cat-grid-stack{
    display:grid;
    grid-template-columns:1fr;
    border:1px solid var(--line);
  }
  .cat-card{
    position:relative;
    padding:32px 32px 36px;
    border-bottom:1px solid var(--line);
    border-right:0;
    background:transparent;
    transition:background .35s ease;
    min-width:0;
    overflow:hidden;
  }
  .cat-card:last-child{border-bottom:0}
  .cat-card:hover{background:var(--surface)}
  .cat-card-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    margin-bottom:20px;
  }
  .cat-code{color:var(--muted)}
  .cat-index{color:var(--dim)}
  .cat-marquee{
    position:relative;
    height:168px;
    margin:0 0 18px;
    overflow:hidden;
    border:1px solid var(--line);
    background:
      linear-gradient(90deg, rgba(11,11,12,.98), rgba(11,11,12,0) 12%, rgba(11,11,12,0) 88%, rgba(11,11,12,.98)),
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
    gap:28px;
    width:max-content;
    padding:0 18px;
    animation:cat-logo-scroll 42s linear infinite;
    will-change:transform;
  }
  .cat-marquee:hover .cat-marquee-track{animation-play-state:paused}
  .cat-marquee-set{
    display:flex;
    align-items:center;
    gap:28px;
    flex:0 0 auto;
  }
  .cat-logo-slot{
    flex:0 0 auto;
    height:120px;
    min-width:100px;
    max-width:220px;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:12px 16px;
  }
  .cat-logo-slot img{
    max-height:96px;
    max-width:200px;
    width:auto;
    height:auto;
    object-fit:contain;
    filter:grayscale(1) brightness(1.2) contrast(1.05);
    opacity:.9;
    transition:filter .3s ease, opacity .3s ease;
  }
  .cat-card:hover .cat-logo-slot img{
    filter:grayscale(.2) brightness(1.08);
    opacity:1;
  }
  @keyframes cat-logo-scroll{
    from{transform:translateX(0)}
    to{transform:translateX(-50%)}
  }
  /* Text logos (cosmetics) */
  .text-logo-marquee,
  .logo-marquee{
    width:100%;
    height:88px;
    margin:0 0 20px;
    overflow:hidden;
    display:flex;
    flex-direction:column;
    justify-content:center;
    gap:10px;
    border:1px solid var(--line);
    background:
      linear-gradient(90deg, rgba(11,11,12,.98), rgba(11,11,12,0) 12%, rgba(11,11,12,0) 88%, rgba(11,11,12,.98)),
      linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,0));
  }
  .logo-track{
    display:flex;align-items:center;gap:26px;white-space:nowrap;width:max-content;
    animation:logo-scroll 44s linear infinite;will-change:transform;padding:0 12px;
  }
  .logo-track.reverse{animation-direction:reverse;animation-duration:52s}
  .logo-marquee:hover .logo-track{animation-play-state:paused}
  .logo-set{display:flex;align-items:center;gap:26px}
  .logo-chip{
    display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;
    color:var(--white);font-size:1rem;letter-spacing:.02em;line-height:1;
    opacity:.88;filter:grayscale(1) contrast(1.08);
  }
  .logo-chip[data-tone="muted"]{color:var(--muted)}
  @keyframes logo-scroll{
    from{transform:translateX(0)}
    to{transform:translateX(-50%)}
  }
  .cat-card h3{
    font-stretch:112%;font-weight:700;text-transform:uppercase;
    letter-spacing:.01em;font-size:1.2rem;color:var(--white);margin-bottom:10px;
  }
  html[lang="ko"] .cat-card h3{font-family:var(--font-kr);font-stretch:normal}
  .cat-card p{color:var(--muted);font-size:.95rem;max-width:62ch;line-height:1.65}

  /* Contact channel rows */
  .contact-channels{display:flex;flex-direction:column;gap:16px}
  .contact-row{
    display:flex;align-items:center;gap:14px;
    color:var(--text);text-decoration:none;
    padding:12px 0;
    border-bottom:1px solid var(--line);
    transition:color .25s ease;
  }
  .contact-row:last-child{border-bottom:0}
  .contact-row:hover{color:var(--white)}
  .contact-icon{
    width:36px;height:36px;flex:0 0 auto;
    display:flex;align-items:center;justify-content:center;
    border:1px solid var(--line);border-radius:2px;
    color:var(--text);
  }
  .contact-icon svg{width:18px;height:18px;fill:currentColor}
  .contact-meta{display:flex;flex-direction:column;gap:2px;min-width:0}
  .contact-label{
    font-family:var(--font-mono);font-size:.68rem;letter-spacing:.14em;
    text-transform:uppercase;color:var(--dim);
  }
  .contact-value{font-size:.95rem;color:var(--text);word-break:break-word}

'''

CONTACT_CHANNELS = r'''
        <div class="contact-channels">
          <a class="contact-row" data-contact="telegram" href="https://t.me/your_handle" target="_blank" rel="noopener">
            <span class="contact-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.07.018.162.01.252z"/></svg>
            </span>
            <span class="contact-meta">
              <span class="contact-label">Telegram</span>
              <span class="contact-value" data-contact-value="telegram">@your_handle</span>
            </span>
          </a>
          <a class="contact-row" data-contact="phone" href="tel:">
            <span class="contact-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.62 10.79a15.15 15.15 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.4 21 3 13.6 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/></svg>
            </span>
            <span class="contact-meta">
              <span class="contact-label">Phone</span>
              <span class="contact-value" data-contact-value="phone">—</span>
            </span>
          </a>
          <div class="contact-row" data-contact="location">
            <span class="contact-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>
            </span>
            <span class="contact-meta">
              <span class="contact-label">Address</span>
              <span class="contact-value" data-contact-value="location" data-i18n="ct_loc">Seongdong-gu, Seoul</span>
            </span>
          </div>
        </div>
'''


def replace_categories(text: str) -> str:
    start = text.find("<!-- ============ CATEGORIES ============ -->")
    end = text.find("<!-- ============ PROCESS ============ -->")
    if start < 0 or end < 0:
        print("categories markers missing")
        return text
    return text[:start] + NEW_SECTION + text[end:]


def replace_cat_css(text: str) -> str:
    # Prefer luxury block or original categories block
    markers = [
        "  /* ---------- CATEGORIES (single-row luxury catalog) ---------- */",
        "  /* ---------- CATEGORIES (luxury catalog) ---------- */",
        "  /* ---------- CATEGORIES ---------- */",
    ]
    css_start = -1
    for m in markers:
        css_start = text.find(m)
        if css_start >= 0:
            break
    if css_start < 0:
        css_start = text.find("  .cat-grid{")
    css_end = text.find("  /* ---------- PROCESS ---------- */")
    if css_start < 0 or css_end < 0:
        print("css markers missing")
        return text
    return text[:css_start] + NEW_CSS + text[css_end:]


def replace_contact_channels(text: str) -> str:
    m = re.search(
        r'<div class="contact-channels">[\s\S]*?</div>\s*</div>\s*<form',
        text,
    )
    if not m:
        print("contact-channels not found")
        return text
    return text[: m.start()] + CONTACT_CHANNELS + "\n      </div>\n      <form" + text[m.end() :]


def patch_footer(text: str) -> str:
    # Make footer city line editable
    text = text.replace(
        '<div class="mono" style="margin-top:10px">SEOUL — TASHKENT</div>',
        '<div class="mono" style="margin-top:10px" data-footer-tagline>SEOUL — TASHKENT</div>',
    )
    # disclaimer already has data-i18n="footer_disclaimer" — ensure it stays
    if 'data-i18n="footer_disclaimer"' not in text:
        text = text.replace(
            '<p class="disclaimer"',
            '<p class="disclaimer" data-i18n="footer_disclaimer"',
            1,
        )
    # exclude logo marquee from static text
    old = "if(parent.closest('script,style,noscript,template,[data-i18n]')) continue;"
    new = "if(parent.closest('script,style,noscript,template,[data-i18n],.cat-marquee,.cat-logo-slot,.logo-marquee,.logo-chip')) continue;"
    if old in text and new not in text:
        text = text.replace(old, new)
    # mobile
    if ".cat-marquee{height:128px}" not in text:
        text = text.replace(
            "    .cat-grid{grid-template-columns:1fr}\n",
            "    .cat-grid,.cat-grid-stack{grid-template-columns:1fr}\n"
            "    .cat-marquee{height:128px}\n"
            "    .cat-logo-slot{height:96px;max-width:180px}\n"
            "    .cat-logo-slot img{max-height:72px;max-width:160px}\n"
            "    .text-logo-marquee,.logo-marquee{height:72px}\n",
        )
    return text


def patch(path: Path) -> None:
    if not path.exists():
        print("skip", path)
        return
    text = path.read_text(encoding="utf-8", errors="replace")
    text = replace_categories(text)
    text = replace_cat_css(text)
    text = replace_contact_channels(text)
    text = patch_footer(text)
    path.write_text(text, encoding="utf-8")
    print("patched", path)


for p in PATHS:
    patch(p)
