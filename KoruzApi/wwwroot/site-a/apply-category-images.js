(function () {
  const SITE_CODE = 'A';
  const SECTION_ORDER = ['VHC', 'PRT', 'CSM', 'LPT'];

  function apiCandidates() {
    const stored = localStorage.getItem('koruz_api_base') || '';
    return [...new Set([
      location.protocol.startsWith('http') ? location.origin : '',
      stored,
      'http://127.0.0.1:63385',
      'http://localhost:63385'
    ].filter(Boolean).map(x => x.replace(/\/$/, '')))];
  }

  function ensureStyles() {
    if (document.getElementById('koruz-cat-image-carousel-style')) return;
    const style = document.createElement('style');
    style.id = 'koruz-cat-image-carousel-style';
    style.textContent = `
      .koruz-img-marquee {
        position: relative;
        width: 100%;
        height: 150px;
        margin: 0 0 22px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 2px;
        background:
          linear-gradient(90deg, rgba(11,11,12,.98) 0%, rgba(11,11,12,0) 12%, rgba(11,11,12,0) 88%, rgba(11,11,12,.98) 100%),
          linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.01));
        display: flex;
        align-items: center;
      }
      .koruz-img-marquee[data-empty="1"] { display: none; }
      .koruz-img-track {
        display: flex;
        align-items: center;
        gap: 28px;
        width: max-content;
        animation: koruz-img-scroll 42s linear infinite;
        will-change: transform;
        padding: 0 16px;
      }
      .koruz-img-marquee:hover .koruz-img-track {
        animation-play-state: paused;
      }
      .koruz-img-set {
        display: flex;
        align-items: center;
        gap: 28px;
      }
      .koruz-img-slot {
        flex: 0 0 auto;
        height: 96px;
        min-width: 120px;
        max-width: 180px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 14px;
        border: 1px solid rgba(255,255,255,.06);
        background: rgba(255,255,255,.03);
      }
      .koruz-img-slot img {
        max-height: 72px;
        max-width: 150px;
        width: auto;
        height: auto;
        object-fit: contain;
        filter: grayscale(1) brightness(1.15) contrast(1.05);
        opacity: 0.9;
        transition: filter .35s ease, opacity .35s ease, transform .35s ease;
      }
      .koruz-img-marquee:hover .koruz-img-slot img {
        filter: grayscale(0.2) brightness(1.05) contrast(1.05);
        opacity: 1;
      }
      @keyframes koruz-img-scroll {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      @media (max-width: 880px) {
        .koruz-img-marquee { height: 120px; }
        .koruz-img-slot { height: 78px; min-width: 96px; max-width: 140px; }
        .koruz-img-slot img { max-height: 56px; max-width: 120px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .koruz-img-track { animation: none; }
      }
    `;
    document.head.appendChild(style);
  }

  function findCategoryCards() {
    const map = {};
    document.querySelectorAll('.cat-card').forEach(card => {
      const codeEl = card.querySelector('.cat-code');
      const code = (codeEl?.textContent || '').trim().toUpperCase();
      if (code) map[code] = card;
    });
    return map;
  }

  function normalizeList(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string' && value.trim()) return [value.trim()];
    return [];
  }

  function buildMarquee(urls) {
    const wrap = document.createElement('div');
    wrap.className = 'koruz-img-marquee';
    wrap.setAttribute('aria-label', 'Brand logos');
    if (!urls.length) {
      wrap.dataset.empty = '1';
      return wrap;
    }

    const track = document.createElement('div');
    track.className = 'koruz-img-track';

    const makeSet = () => {
      const set = document.createElement('div');
      set.className = 'koruz-img-set';
      urls.forEach(url => {
        const slot = document.createElement('div');
        slot.className = 'koruz-img-slot';
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'logo';
        img.loading = 'lazy';
        slot.appendChild(img);
        set.appendChild(slot);
      });
      return set;
    };

    track.appendChild(makeSet());
    track.appendChild(makeSet());
    wrap.appendChild(track);
    return wrap;
  }

  function applyCategoryImages(categoryImages) {
    ensureStyles();
    const cards = findCategoryCards();
    const source = categoryImages || {};

    SECTION_ORDER.forEach(code => {
      const card = cards[code];
      if (!card) return;

      const urls = normalizeList(source[code]);
      card.querySelectorAll('.koruz-img-marquee').forEach(el => el.remove());

      const host = buildMarquee(urls);
      const h3 = card.querySelector('h3');
      if (h3) card.insertBefore(host, h3);
      else card.appendChild(host);
    });
  }

  async function load() {
    for (const base of apiCandidates()) {
      try {
        const response = await fetch(`${base}/api/sitecontent/${SITE_CODE}`);
        if (!response.ok) continue;
        localStorage.setItem('koruz_api_base', base);
        const data = await response.json();
        const content = data?.siteContent || {};
        applyCategoryImages(content.categoryImages || {});
        return;
      } catch (e) {}
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
