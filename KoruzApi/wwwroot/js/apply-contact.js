(function () {
  function detectSiteCode() {
    const path = (location.pathname || '').toLowerCase();
    if (path.includes('/site-b')) return 'B';
    return 'A';
  }

  function apiCandidates() {
    const stored = localStorage.getItem('koruz_api_base') || '';
    return [...new Set([
      location.protocol.startsWith('http') ? location.origin : '',
      stored,
      'http://127.0.0.1:63385',
      'http://localhost:63385'
    ].filter(Boolean).map(x => x.replace(/\/$/, '')))];
  }

  function normalizeTelegram(value) {
    if (!value) return '';
    const v = String(value).trim();
    if (!v) return '';
    if (v.startsWith('http://') || v.startsWith('https://')) return v;
    return 'https://t.me/' + v.replace(/^@/, '');
  }

  function telegramLabel(value) {
    const v = String(value || '').trim();
    if (!v) return '—';
    if (v.includes('t.me/')) {
      const handle = v.split('t.me/')[1].split(/[?#]/)[0];
      return handle ? '@' + handle.replace(/^@/, '') : v;
    }
    return v.startsWith('@') ? v : '@' + v;
  }

  function setValue(selector, text) {
    document.querySelectorAll(selector).forEach(el => {
      el.textContent = text;
    });
  }

  function applyContact(contact) {
    if (!contact || typeof contact !== 'object') return;

    const email = (contact.email || '').trim();
    const telegram = (contact.telegram || '').trim();
    const locationText = (contact.location || '').trim();
    const phone = (contact.phone || '').trim();
    const footerTagline = (contact.footerTagline || contact.tagline || '').trim();

    // Structured rows (Site A v2)
    if (telegram) {
      const href = normalizeTelegram(telegram);
      const label = telegramLabel(telegram);
      document.querySelectorAll('[data-contact="telegram"]').forEach(row => {
        if (row.tagName === 'A') row.setAttribute('href', href);
      });
      setValue('[data-contact-value="telegram"]', label);
    }

    if (phone) {
      const tel = 'tel:' + phone.replace(/\s+/g, '');
      document.querySelectorAll('[data-contact="phone"]').forEach(row => {
        if (row.tagName === 'A') row.setAttribute('href', tel);
      });
      setValue('[data-contact-value="phone"]', phone);
    }

    if (locationText) {
      setValue('[data-contact-value="location"]', locationText);
      setValue('[data-i18n="ct_loc"]', locationText);
    }

    if (footerTagline) {
      setValue('[data-footer-tagline]', footerTagline);
    } else if (locationText) {
      // optional soft fill if tagline empty
    }

    // Legacy mailto / t.me links (Site B or old markup)
    if (email) {
      document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
        a.href = 'mailto:' + email;
        const mono = a.querySelector('.mono');
        if (mono) {
          a.innerHTML = '';
          a.appendChild(mono);
          a.appendChild(document.createTextNode(' ' + email));
        } else if (!a.querySelector('[data-contact-value]')) {
          // only overwrite simple legacy links
          if (!a.querySelector('.contact-meta')) {
            const hasOnlyText = a.childElementCount === 0;
            if (hasOnlyText) a.textContent = email;
          }
        }
      });
    }

    if (telegram) {
      const href = normalizeTelegram(telegram);
      const label = telegramLabel(telegram);
      document.querySelectorAll('a[href*="t.me"], a[href*="telegram"]').forEach(a => {
        if (a.matches('[data-contact="telegram"]')) return;
        a.href = href;
        const mono = a.querySelector('.mono');
        if (mono && !a.querySelector('.contact-meta')) {
          a.innerHTML = '';
          a.appendChild(mono);
          a.appendChild(document.createTextNode(' ' + label));
        }
      });
    }

    if (phone) {
      document.querySelectorAll('a[href^="tel:"]').forEach(a => {
        if (a.matches('[data-contact="phone"]')) return;
        a.href = 'tel:' + phone.replace(/\s+/g, '');
      });
    }
  }

  async function load() {
    const siteCode = detectSiteCode();
    for (const base of apiCandidates()) {
      try {
        const response = await fetch(base + '/api/sitecontent/' + siteCode);
        if (!response.ok) continue;
        localStorage.setItem('koruz_api_base', base);
        const data = await response.json();
        applyContact(data?.siteContent?.contact);
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
