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
        width: 100%;
        height: 120px;
        margin: 0 0 18px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.08);
        background:
          linear-gradient(90deg, rgba(11,11,12,.98), rgba(11,11,12,0) 10%, rgba(11,11,12,0) 90%, rgba(11,11,12,.98)),
          rgba(255,255,255,.02);
        display: flex;
        align-items: center;
      }
      .koruz-img-marquee[data-empty="1"] { display: none; }
      .koruz-img-track {
        display: flex;
        align-items: center;
        gap: 18px;
        width: max-content;
        animation: koruz-img-scroll 36s linear infinite;
        will-change: transform;
        padding: 0 12px;
      }
      .koruz-img-marquee:hover .koruz-img-track {
        animation-play-state: paused;
      }
      .koruz-img-track img {
        height: 72px;
        width: auto;
        max-width: 160px;
        object-fit: contain;
        filter: grayscale(0.15) contrast(1.05);
        opacity: 0.95;
        flex: 0 0 auto;
        background: rgba(255,255,255,.04);
        border-radius: 4px;
        padding: 6px;
      }
      @keyframes koruz-img-scroll {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
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
      set.style.display = 'flex';
      set.style.alignItems = 'center';
      set.style.gap = '18px';
      urls.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'logo';
        img.loading = 'lazy';
        set.appendChild(img);
      });
      return set;
    };

    // duplicate for seamless loop
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
      let host = card.querySelector('.koruz-img-marquee');
      if (host) host.remove();

      host = buildMarquee(urls);

      // Prefer placing after canvas / existing visual, before h3
      const h3 = card.querySelector('h3');
      if (h3) {
        card.insertBefore(host, h3);
      } else {
        card.appendChild(host);
      }
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
        // dedicated key; fallback to images.* if arrays stored there
        const categoryImages = content.categoryImages || content.images || {};
        applyCategoryImages(categoryImages);
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
