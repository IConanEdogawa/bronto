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
    const handle = v.replace(/^@/, '');
    return 'https://t.me/' + handle;
  }

  function applyContact(contact) {
    if (!contact || typeof contact !== 'object') return;

    const email = (contact.email || '').trim();
    const telegram = (contact.telegram || '').trim();
    const locationText = (contact.location || '').trim();
    const phone = (contact.phone || '').trim();

    if (email) {
      document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
        a.href = 'mailto:' + email;
        if (a.textContent && (a.textContent.includes('@') || /mail/i.test(a.textContent))) {
          // keep label structure if mixed with mono prefix
          const mono = a.querySelector('.mono');
          if (mono) {
            a.innerHTML = '';
            a.appendChild(mono);
            a.appendChild(document.createTextNode(' ' + email));
          } else if (!a.querySelector('*')) {
            a.textContent = email;
          }
        }
      });
    }

    if (telegram) {
      const href = normalizeTelegram(telegram);
      const label = telegram.startsWith('@') || telegram.includes('t.me') ? telegram : ('@' + telegram.replace(/^@/, ''));
      document.querySelectorAll('a[href*="t.me"], a[href*="telegram"]').forEach(a => {
        a.href = href;
        const mono = a.querySelector('.mono');
        if (mono) {
          a.innerHTML = '';
          a.appendChild(mono);
          a.appendChild(document.createTextNode(' ' + label.replace(/^https?:\/\/t\.me\//, '@')));
        }
      });
    }

    if (locationText) {
      document.querySelectorAll('[data-i18n="ct_loc"]').forEach(el => {
        el.textContent = locationText;
      });
    }

    if (phone) {
      document.querySelectorAll('a[href^="tel:"]').forEach(a => {
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
