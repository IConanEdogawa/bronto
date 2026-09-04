(function () {
  const SITE_CODE = 'B';

  function apiCandidates() {
    const stored = localStorage.getItem('koruz_api_base') || '';
    return [...new Set([
      location.protocol.startsWith('http') ? location.origin : '',
      stored,
      'http://127.0.0.1:63385',
      'http://localhost:63385'
    ].filter(Boolean).map(x => x.replace(/\/$/, '')))];
  }

  async function readJson(response) {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  function polishImage(img) {
    img.style.display = 'block';
    img.style.width = '100%';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.maxHeight = '420px';
    img.style.objectFit = 'cover';
    img.style.objectPosition = 'center center';
    img.style.borderRadius = '12px';
    img.style.background = '#111';
  }

  function resolveAssetUrl(url, apiBase) {
    try { return new URL(url, apiBase).href; } catch (e) { return url; }
  }

  function applyImages(images, apiBase) {
    if (!images || typeof images !== 'object') return;
    Object.keys(images).forEach(key => {
      const url = resolveAssetUrl(images[key], apiBase);
      if (!url) return;
      document.querySelectorAll('img').forEach(img => {
        if ((img.getAttribute('alt') || '') === key) {
          img.src = url;
          polishImage(img);
        }
      });
    });

    // Also polish the three default photos even if not overridden
    ['Cosmetics', 'Vehicle', 'Laptop'].forEach(key => {
      document.querySelectorAll('img').forEach(img => {
        if ((img.getAttribute('alt') || '') === key) polishImage(img);
      });
    });
  }

  async function loadImages() {
    // Polish defaults immediately
    applyImages({}, base);

    for (const base of apiCandidates()) {
      try {
        const response = await fetch(`${base}/api/sitecontent/${SITE_CODE}`);
        if (!response.ok) continue;
        localStorage.setItem('koruz_api_base', base);
        const data = await readJson(response);
        applyImages(data?.siteContent?.images || {}, base);
        return;
      } catch (e) {}
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadImages);
  } else {
    loadImages();
  }
})();
