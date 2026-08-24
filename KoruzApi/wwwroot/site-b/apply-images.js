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

  function applyImages(images) {
    if (!images || typeof images !== 'object') return;
    Object.keys(images).forEach(key => {
      const url = images[key];
      if (!url) return;
      document.querySelectorAll('img').forEach(img => {
        if ((img.getAttribute('alt') || '') === key) {
          img.src = url;
        }
      });
    });
  }

  async function loadImages() {
    for (const base of apiCandidates()) {
      try {
        const response = await fetch(`${base}/api/sitecontent/${SITE_CODE}`);
        if (!response.ok) continue;
        localStorage.setItem('koruz_api_base', base);
        const data = await readJson(response);
        applyImages(data?.siteContent?.images);
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
