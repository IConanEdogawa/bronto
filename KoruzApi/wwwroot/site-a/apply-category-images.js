(function () {
  const SITE_CODE = 'A';
  const SECTION_ORDER = ['VHC', 'PRT', 'CSM', 'LPT'];
  const COSMETICS_LOGOS = ['Anua', 'celimax', 'AXIS-Y', 'COSRX', 'Dr.G', 'ROUND LAB', 'BEAUTY OF JOSEON', "d'Alba", 'medicube', 'SKIN1004'];

  function apiCandidates() {
    const stored = localStorage.getItem('koruz_api_base') || '';
    return [...new Set([
      location.protocol.startsWith('http') ? location.origin : '',
      stored,
      'http://127.0.0.1:63385',
      'http://localhost:63385'
    ].filter(Boolean).map(x => x.replace(/\/$/, '')))];
  }

  function normalizeList(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string' && value.trim()) return [value.trim()];
    return [];
  }

  function resolveAssetUrl(url, apiBase) {
    try { return new URL(url, apiBase).href; } catch (e) { return url; }
  }

  function buildTrack(urls) {
    const track = document.createElement('div');
    track.className = 'logo-track';

    const makeSet = () => {
      const set = document.createElement('div');
      set.className = 'logo-set';
      urls.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'logo';
        img.className = 'uploaded-logo';
        img.loading = 'lazy';
        img.decoding = 'async';
        set.appendChild(img);
      });
      return set;
    };

    track.appendChild(makeSet());
    track.appendChild(makeSet()); // seamless loop
    return track;
  }

  function buildTextTrack(names, reverse) {
    const track = document.createElement('div');
    track.className = 'logo-track' + (reverse ? ' reverse' : '');
    const makeSet = () => {
      const set = document.createElement('div');
      set.className = 'logo-set';
      names.forEach(name => {
        const chip = document.createElement('span');
        chip.className = 'logo-chip';
        chip.textContent = name;
        set.appendChild(chip);
      });
      return set;
    };
    track.appendChild(makeSet());
    track.appendChild(makeSet());
    return track;
  }

  function applyCategoryImages(categoryImages, apiBase) {
    const source = categoryImages || {};

    SECTION_ORDER.forEach(code => {
      const card = [...document.querySelectorAll('.cat-card')].find(el =>
        el.querySelector('.cat-code')?.textContent.trim().toUpperCase() === code
      );
      if (!card) return;

      const urls = normalizeList(source[code]).map(url => resolveAssetUrl(url, apiBase));
      card.querySelectorAll('.uploaded-category-images').forEach(el => el.remove());

      if (!urls.length) return;

      const host = document.createElement('div');
      host.className = 'logo-marquee uploaded-category-images';
      host.dataset.category = code;
      host.setAttribute('aria-label', code + ' category images');
      host.appendChild(buildTrack(urls));
      host.appendChild(buildTrack(urls));
      host.querySelectorAll('.logo-track')[1].classList.add('reverse');
      const existingVisual = card.querySelector('canvas, .logo-marquee');
      const textMarquee = card.querySelector('.logo-marquee:not(.uploaded-category-images)');
      if (code === 'CSM' && textMarquee) textMarquee.classList.add('text-category-logos');
      if (code === 'CSM' && textMarquee) textMarquee.before(host);
      else if (existingVisual) existingVisual.replaceWith(host);
      else card.insertBefore(host, card.querySelector('h3'));

      if (code === 'CSM' && !card.querySelector('.text-category-logos')) {
        const textHost = document.createElement('div');
        textHost.className = 'logo-marquee text-category-logos';
        textHost.setAttribute('aria-label', 'Cosmetics text logos');
        textHost.appendChild(buildTextTrack(COSMETICS_LOGOS, false));
        textHost.appendChild(buildTextTrack(COSMETICS_LOGOS, true));
        host.after(textHost);
      }
    });
  }

  async function load() {
    for (const base of apiCandidates()) {
      try {
        const response = await fetch(`${base}/api/sitecontent/${SITE_CODE}?v=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) continue;
        localStorage.setItem('koruz_api_base', base);
        const data = await response.json();
        applyCategoryImages(data?.siteContent?.categoryImages || {}, base);
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
