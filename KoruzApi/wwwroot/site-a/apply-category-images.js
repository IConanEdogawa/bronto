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

  function normalizeList(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string' && value.trim()) return [value.trim()];
    return [];
  }

  function buildTrack(urls) {
    const track = document.createElement('div');
    track.className = 'cat-marquee-track';

    const makeSet = () => {
      const set = document.createElement('div');
      set.className = 'cat-marquee-set';
      urls.forEach(url => {
        const slot = document.createElement('div');
        slot.className = 'cat-logo-slot';
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'logo';
        img.loading = 'lazy';
        img.decoding = 'async';
        slot.appendChild(img);
        set.appendChild(slot);
      });
      return set;
    };

    track.appendChild(makeSet());
    track.appendChild(makeSet()); // seamless loop
    return track;
  }

  function applyCategoryImages(categoryImages) {
    const source = categoryImages || {};

    SECTION_ORDER.forEach(code => {
      const host = document.querySelector(`[data-cat-marquee="${code}"]`);
      if (!host) return;

      const urls = normalizeList(source[code]);
      host.querySelectorAll('.cat-marquee-track').forEach(el => el.remove());

      if (!urls.length) {
        host.dataset.hasLogos = '0';
        return;
      }

      host.dataset.hasLogos = '1';
      host.appendChild(buildTrack(urls));
    });
  }

  async function load() {
    for (const base of apiCandidates()) {
      try {
        const response = await fetch(`${base}/api/sitecontent/${SITE_CODE}`);
        if (!response.ok) continue;
        localStorage.setItem('koruz_api_base', base);
        const data = await response.json();
        applyCategoryImages(data?.siteContent?.categoryImages || {});
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
