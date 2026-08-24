(function () {
  const SITE_CODE = 'A';
  const DEFAULTS = {
    VHC: ['Hyundai', 'Kia', 'Genesis', 'BMW', 'Mercedes-Benz', 'Lexus', 'Toyota', 'Audi'],
    PRT: ['OEM', 'Bosch', 'Mann-Filter', 'Mobil 1', 'Brembo', 'Denso', 'NGK', 'KYB'],
    CSM: ['Anua', 'celimax', 'AXIS-Y', 'COSRX', 'Dr.G', 'ROUND LAB', 'BEAUTY OF JOSEON', "d'Alba", 'medicube', 'SKIN1004'],
    LPT: ['Samsung', 'LG', 'ASUS', 'Lenovo', 'HP', 'Acer', 'Dell', 'Apple']
  };

  function apiCandidates() {
    const stored = localStorage.getItem('koruz_api_base') || '';
    return [...new Set([
      location.protocol.startsWith('http') ? location.origin : '',
      stored,
      'http://127.0.0.1:63385',
      'http://localhost:63385'
    ].filter(Boolean).map(x => x.replace(/\/$/, '')))];
  }

  function chipsHtml(names, variant) {
    const tone = variant === 'alt' ? ' data-tone="black"' : '';
    return names.map((name, i) => {
      const size = i % 4 === 0 ? ' data-size="lg"' : (i % 5 === 0 ? ' data-size="sm"' : '');
      return `<span class="logo-chip"${tone}${size}>${escapeHtml(name)}</span>`;
    }).join('');
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"');
  }

  function buildMarquee(code, names) {
    const list = (names || []).map(x => String(x).trim()).filter(Boolean);
    if (!list.length) return null;

    const set = chipsHtml(list, 'main');
    const setAlt = chipsHtml(list, 'alt');
    const wrap = document.createElement('div');
    wrap.className = 'logo-marquee';
    wrap.setAttribute('data-logo-category', code);
    wrap.setAttribute('aria-label', code + ' brands');
    wrap.innerHTML = `
      <div class="logo-track">
        <div class="logo-set">${set}</div>
        <div class="logo-set" aria-hidden="true">${set}</div>
      </div>
      <div class="logo-track reverse" aria-hidden="true">
        <div class="logo-set">${setAlt}</div>
        <div class="logo-set" aria-hidden="true">${setAlt}</div>
      </div>
    `;
    return wrap;
  }

  function applyLogos(logos) {
    const data = Object.assign({}, DEFAULTS, logos || {});
    document.querySelectorAll('.cat-card').forEach(card => {
      const codeEl = card.querySelector('.cat-code');
      if (!codeEl) return;
      const code = codeEl.textContent.trim().toUpperCase();
      if (!data[code]) return;

      const marquee = buildMarquee(code, data[code]);
      if (!marquee) return;

      const existingMarquee = card.querySelector('.logo-marquee');
      const canvas = card.querySelector('canvas');
      if (existingMarquee) {
        existingMarquee.replaceWith(marquee);
      } else if (canvas) {
        canvas.replaceWith(marquee);
      } else {
        const h3 = card.querySelector('h3');
        if (h3) card.insertBefore(marquee, h3);
        else card.appendChild(marquee);
      }
    });
  }

  async function load() {
    for (const base of apiCandidates()) {
      try {
        const response = await fetch(base + '/api/sitecontent/' + SITE_CODE);
        if (!response.ok) continue;
        localStorage.setItem('koruz_api_base', base);
        const data = await response.json();
        applyLogos(data?.siteContent?.logos);
        return;
      } catch (e) {}
    }
    applyLogos(DEFAULTS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
