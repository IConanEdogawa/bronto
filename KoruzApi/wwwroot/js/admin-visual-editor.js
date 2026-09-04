(function () {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const siteCode = (params.get('site') || 'A').toUpperCase();
  const queryApiBase = params.get('apiBase');
  const pagePath = siteCode === 'B' ? 'site-b/index.html' : 'site-a/index.html';
  const livePath = siteCode === 'B' ? '/site-b/' : '/';
  const siteName = siteCode === 'B' ? 'Website B' : 'Website A';
  const defaultImageKeys = siteCode === 'B' ? ['Cosmetics', 'Vehicle', 'Laptop'] : [];
  const categorySections = siteCode === 'A'
    ? [
        { code: 'VHC', label: 'Vehicles' },
        { code: 'PRT', label: 'Auto parts' },
        { code: 'CSM', label: 'Cosmetics' },
        { code: 'LPT', label: 'Laptops' }
      ]
    : [];

  const DEFAULT_I18N = {
    en: {
      nav_cat: 'Categories', nav_process: 'Process', nav_contact: 'Contact',
      hero_eyebrow: 'Sourcing \u00b7 Seoul \u2192 Tashkent',
      hero_title: 'Direct sourcing from South Korea',
      hero_sub: 'We find, verify, and ship goods from Korean sellers \u2014 vehicles, parts, cosmetics, and laptops. No dealer markups, no middleman chains.',
      hero_cta: 'Request a quote', hero_cta2: 'View categories',
      meta_1: 'EST. 2026', meta_2: '4 categories', meta_3: 'Inspection before purchase',
      cat_eyebrow: 'What we source', cat_title: 'Four categories',
      cat1_name: 'Vehicles', cat1_desc: 'Used and new cars sourced from Korean marketplaces and auctions, inspected before purchase.',
      cat2_name: 'Auto parts', cat2_desc: 'OEM and aftermarket parts located by VIN or part number, from engines to body panels.',
      cat3_name: 'Cosmetics', cat3_desc: 'K-beauty products purchased in wholesale volumes directly from verified sellers.',
      cat4_name: 'Laptops', cat4_desc: 'Business and consumer laptops, graded and tested before shipment.',
      proc_eyebrow: 'How it works', proc_title: 'From request to delivery',
      step1_name: 'Request', step1_desc: 'Tell us what you need \u2014 a model, a part number, or just a budget and a goal.',
      step2_name: 'Sourcing & inspection', step2_desc: 'We locate options, check condition and history, and send you a report with photos.',
      step3_name: 'Purchase', step3_desc: 'You approve, we buy directly from the seller at the local price.',
      step4_name: 'Delivery', step4_desc: 'Packing, export paperwork, and shipping to Uzbekistan \u2014 handled end to end.',
      why1_name: 'Direct purchase', why1_desc: 'We buy from sellers at local Korean prices. No dealer margins built into your quote.',
      why2_name: 'Verified before payment', why2_desc: 'You see inspection reports and photos before committing a single sum.',
      why3_name: 'Korea \u2194 Uzbekistan', why3_desc: 'We operate on both ends: sourcing in Seoul, delivery and paperwork in Tashkent.',
      ct_eyebrow: 'Contact', ct_title: 'Tell us what you need',
      ct_sub: 'Describe the product, send a link or a part number \u2014 we reply with options and a quote.',
      ct_loc: 'Seongdong-gu, Seoul',
      f_name: 'Name', f_contact: 'Telegram or phone', f_cat: 'Category', f_msg: 'What are you looking for?',
      f_send: 'Send request', f_note: 'We usually reply within 24 hours.',
      f_ok: "Request received \u2014 we'll get back to you shortly.",
      footer_disclaimer: 'KORUZ is an independent sourcing service. We are not a dealer, distributor, or authorized representative of any manufacturer or brand. All products are purchased directly from their respective sellers.'
    },
    ko: {
      nav_cat: '\uce74\ud14c\uace0\ub9ac', nav_process: '\uc9c4\ud589 \uc808\ucc28', nav_contact: '\ubb38\uc758',
      hero_eyebrow: '\uc18c\uc2f1 \u00b7 \uc11c\uc6b8 \u2192 \ud0c0\uc288\ucf04\ud2b8',
      hero_title: '\ub300\ud55c\ubbfc\uad6d \uc9c1\uc811 \uc18c\uc2f1',
      hero_sub: '\ucc28\ub7c9, \ubd80\ud488, \ud654\uc7a5\ud488, \ub178\ud2b8\ubd81 \u2014 \ud55c\uad6d \ud310\ub9e4\uc790\ub85c\ubd80\ud130 \uc0c1\ud488\uc744 \ucc3e\uace0, \uac80\uc99d\ud558\uace0, \ubc30\uc1a1\ud569\ub2c8\ub2e4. \ub51c\ub7ec \ub9c8\uc9c4\ub3c4, \ubd88\ud544\uc694\ud55c \uc911\uac04 \ub2e8\uacc4\ub3c4 \uc5c6\uc2b5\ub2c8\ub2e4.',
      hero_cta: '\uacac\uc801 \uc694\uccad', hero_cta2: '\uce74\ud14c\uace0\ub9ac \ubcf4\uae30',
      meta_1: 'EST. 2026', meta_2: '4\uac1c \uce74\ud14c\uace0\ub9ac', meta_3: '\uad6c\ub9e4 \uc804 \uac80\uc218',
      cat_eyebrow: '\ucde8\uae09 \ud488\ubaa9', cat_title: '\ub124 \uac00\uc9c0 \uce74\ud14c\uace0\ub9ac',
      cat1_name: '\ucc28\ub7c9', cat1_desc: '\ud55c\uad6d \uc911\uace0\ucc28 \ud50c\ub7ab\ud3fc\uacfc \uacbd\ub9e4\uc5d0\uc11c \ucc28\ub7c9\uc744 \ucc3e\uc544 \uad6c\ub9e4 \uc804 \uc0c1\ud0dc\ub97c \uc810\uac80\ud569\ub2c8\ub2e4.',
      cat2_name: '\uc790\ub3d9\ucc28 \ubd80\ud488', cat2_desc: 'VIN \ub610\ub294 \ubd80\ud488 \ubc88\ud638\ub85c OEM\u00b7\uc560\ud504\ud130\ub9c8\ucf13 \ubd80\ud488\uc744 \ucc3e\uc544\ub4dc\ub9bd\ub2c8\ub2e4.',
      cat3_name: '\ud654\uc7a5\ud488', cat3_desc: '\uac80\uc99d\ub41c \ud310\ub9e4\uc790\ub85c\ubd80\ud130 K-\ube44\uc6b0\ud2f0 \uc81c\ud488\uc744 \ub3c4\ub9e4 \ubb3c\ub7c9\uc73c\ub85c \uad6c\ub9e4\ud569\ub2c8\ub2e4.',
      cat4_name: '\ub178\ud2b8\ubd81', cat4_desc: '\ube44\uc988\ub2c8\uc2a4\u00b7\uc77c\ubc18 \ub178\ud2b8\ubd81\uc744 \ub4f1\uae09 \ubd84\ub958 \ubc0f \ud14c\uc2a4\ud2b8 \ud6c4 \ubc1c\uc1a1\ud569\ub2c8\ub2e4.',
      proc_eyebrow: '\uc9c4\ud589 \uc808\ucc28', proc_title: '\uc694\uccad\ubd80\ud130 \ubc30\uc1a1\uae4c\uc9c0',
      step1_name: '\uc694\uccad', step1_desc: '\ud544\uc694\ud55c \uac83\uc744 \uc54c\ub824\uc8fc\uc138\uc694 \u2014 \ubaa8\ub378\uba85, \ubd80\ud488 \ubc88\ud638, \ub610\ub294 \uc608\uc0b0\uacfc \ubaa9\uc801\ub9cc\uc73c\ub85c\ub3c4 \ucda9\ubd84\ud569\ub2c8\ub2e4.',
      step2_name: '\uc18c\uc2f1 \ubc0f \uac80\uc218', step2_desc: '\uc635\uc158\uc744 \ucc3e\uc544 \uc0c1\ud0dc\uc640 \uc774\ub825\uc744 \ud655\uc778\ud558\uace0, \uc0ac\uc9c4\uacfc \ud568\uaed8 \ub9ac\ud3ec\ud2b8\ub97c \ubcf4\ub0b4\ub4dc\ub9bd\ub2c8\ub2e4.',
      step3_name: '\uad6c\ub9e4', step3_desc: '\uc2b9\uc778\ud558\uc2dc\uba74 \ud604\uc9c0 \uac00\uaca9 \uadf8\ub300\ub85c \ud310\ub9e4\uc790\uc5d0\uac8c\uc11c \uc9c1\uc811 \uad6c\ub9e4\ud569\ub2c8\ub2e4.',
      step4_name: '\ubc30\uc1a1', step4_desc: '\ud3ec\uc7a5, \uc218\ucd9c \uc11c\ub958, \uc6b0\uc988\ubca0\ud0a4\uc2a4\ud0c4\uae4c\uc9c0\uc758 \ubc30\uc1a1 \u2014 \uc804 \uacfc\uc815\uc744 \ucc98\ub9ac\ud569\ub2c8\ub2e4.',
      why1_name: '\uc9c1\uc811 \uad6c\ub9e4', why1_desc: '\ud55c\uad6d \ud604\uc9c0 \uac00\uaca9\uc73c\ub85c \ud310\ub9e4\uc790\uc5d0\uac8c\uc11c \uc9c1\uc811 \uad6c\ub9e4\ud569\ub2c8\ub2e4. \ub51c\ub7ec \ub9c8\uc9c4\uc774 \uc5c6\uc2b5\ub2c8\ub2e4.',
      why2_name: '\uacb0\uc81c \uc804 \uac80\uc99d', why2_desc: '\uacb0\uc81c \uc804\uc5d0 \uac80\uc218 \ub9ac\ud3ec\ud2b8\uc640 \uc0ac\uc9c4\uc744 \uba3c\uc800 \ud655\uc778\ud558\uc2e4 \uc218 \uc788\uc2b5\ub2c8\ub2e4.',
      why3_name: '\ud55c\uad6d \u2194 \uc6b0\uc988\ubca0\ud0a4\uc2a4\ud0c4', why3_desc: '\uc11c\uc6b8\uc5d0\uc11c \uc18c\uc2f1, \ud0c0\uc288\ucf04\ud2b8\uc5d0\uc11c \ubc30\uc1a1\uacfc \uc11c\ub958 \ucc98\ub9ac \u2014 \uc591\ucabd\uc5d0\uc11c \uc6b4\uc601\ud569\ub2c8\ub2e4.',
      ct_eyebrow: '\ubb38\uc758', ct_title: '\ud544\uc694\ud55c \uac83\uc744 \uc54c\ub824\uc8fc\uc138\uc694',
      ct_sub: '\uc81c\ud488 \uc124\uba85, \ub9c1\ud06c \ub610\ub294 \ubd80\ud488 \ubc88\ud638\ub97c \ubcf4\ub0b4\uc8fc\uc2dc\uba74 \uc635\uc158\uacfc \uacac\uc801\uc73c\ub85c \ub2f5\ubcc0\ub4dc\ub9bd\ub2c8\ub2e4.',
      ct_loc: '\uc11c\uc6b8 \uc131\ub3d9\uad6c',
      f_name: '\uc774\ub984', f_contact: '\ud154\ub808\uadf8\ub7a8 \ub610\ub294 \uc804\ud654\ubc88\ud638', f_cat: '\uce74\ud14c\uace0\ub9ac', f_msg: '\uc5b4\ub5a4 \uc0c1\ud488\uc744 \ucc3e\uc73c\uc2dc\ub098\uc694?',
      f_send: '\uc694\uccad \ubcf4\ub0b4\uae30', f_note: '\ubcf4\ud1b5 24\uc2dc\uac04 \uc774\ub0b4\uc5d0 \ub2f5\ubcc0\ub4dc\ub9bd\ub2c8\ub2e4.',
      f_ok: '\uc694\uccad\uc774 \uc811\uc218\ub418\uc5c8\uc2b5\ub2c8\ub2e4 \u2014 \uace7 \uc5f0\ub77d\ub4dc\ub9ac\uaca0\uc2b5\ub2c8\ub2e4.',
      footer_disclaimer: 'KORUZ\ub294 \ub3c5\ub9bd \uc18c\uc2f1 \uc11c\ube44\uc2a4\uc785\ub2c8\ub2e4. \ub2f9\uc0ac\ub294 \uc5b4\ub5a4 \uc81c\uc870\uc0ac\ub098 \ube0c\ub79c\ub4dc\uc758 \ub51c\ub7ec, \uc720\ud1b5\uc0ac \ub610\ub294 \uacf5\uc2dd \ub300\ub9ac\uc810\uc774 \uc544\ub2d9\ub2c8\ub2e4. \ubaa8\ub4e0 \uc81c\ud488\uc740 \ud574\ub2f9 \ud310\ub9e4\uc790\ub85c\ubd80\ud130 \uc9c1\uc811 \uad6c\ub9e4\ud569\ub2c8\ub2e4.'
    }
  };

  const SECTIONS = [
    { id: 'nav', title: '1 \u00b7 Navigation', keys: ['nav_cat', 'nav_process', 'nav_contact'] },
    { id: 'hero', title: '2 \u00b7 Hero', keys: ['hero_eyebrow', 'hero_title', 'hero_sub', 'hero_cta', 'hero_cta2', 'meta_1', 'meta_2', 'meta_3'] },
    { id: 'categories', title: '3 \u00b7 Categories', keys: ['cat_eyebrow', 'cat_title', 'cat1_name', 'cat1_desc', 'cat2_name', 'cat2_desc', 'cat3_name', 'cat3_desc', 'cat4_name', 'cat4_desc'] },
    { id: 'process', title: '4 \u00b7 Process', keys: ['proc_eyebrow', 'proc_title', 'step1_name', 'step1_desc', 'step2_name', 'step2_desc', 'step3_name', 'step3_desc', 'step4_name', 'step4_desc'] },
    { id: 'why', title: '5 \u00b7 Why us', keys: ['why1_name', 'why1_desc', 'why2_name', 'why2_desc', 'why3_name', 'why3_desc'] },
    { id: 'contact', title: '6 \u00b7 Contact + Footer', keys: ['ct_eyebrow', 'ct_title', 'ct_sub', 'ct_loc', 'f_name', 'f_contact', 'f_cat', 'f_msg', 'f_send', 'f_note', 'f_ok', 'footer_disclaimer'] }
  ];

  let translations = { en: { ...DEFAULT_I18N.en }, ko: { ...DEFAULT_I18N.ko } };
  let currentLang = 'en';
  let currentSectionId = 'hero';
  let currentImages = {};
  let currentCategoryImages = { VHC: [], PRT: [], CSM: [], LPT: [] };
  let dirty = false;
  let changeVersion = 0;
  let saveInProgress = false;

  if (queryApiBase) localStorage.setItem('koruz_api_base', queryApiBase);
  const token = localStorage.getItem('koruz_admin_token');
  if (!token) {
    window.location.href = 'admin-login.html';
    return;
  }

  document.getElementById('siteLabel').textContent = `${siteName} (${siteCode})`;

  function authHeaders(extra) {
    return Object.assign({ Authorization: 'Bearer ' + token }, extra || {});
  }

  function getApiCandidates() {
    const stored = localStorage.getItem('koruz_api_base') || '';
    const list = [queryApiBase, stored, window.location.protocol.startsWith('http') ? window.location.origin : '', 'http://127.0.0.1:63385', 'http://localhost:63385'];
    return [...new Set(list.filter(Boolean).map((b) => b.replace(/\/$/, '')))];
  }

  async function requestApi(path, options) {
    const errors = [];
    const opts = options || {};
    opts.headers = authHeaders(opts.headers || {});
    if (!opts.cache) opts.cache = 'no-store';
    for (const base of getApiCandidates()) {
      try {
        const response = await fetch(`${base}${path}`, opts);
        if ((response.status === 404 || response.status === 405) && base === window.location.origin) {
          errors.push(`${base}: HTTP ${response.status}`);
          continue;
        }
        localStorage.setItem('koruz_api_base', base);
        return response;
      } catch (e) {
        errors.push(`${base}: ${e.message || 'failed'}`);
      }
    }
    throw new Error('API unreachable: ' + errors.join('; '));
  }

  async function readJsonSafe(response) {
    const text = await response.text();
    if (!text) return null;
    try { return JSON.parse(text); } catch { return null; }
  }

  function setStatus(msg) {
    const el = document.getElementById('statusMessage');
    if (el) el.textContent = msg || '';
  }

  function showToast(title, body) {
    const toast = document.getElementById('saveToast');
    document.getElementById('toastTitle').textContent = title || 'Saved';
    document.getElementById('toastBody').textContent = body || 'Both languages saved.';
    toast.classList.remove('hidden');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.add('hidden'), 3200);
  }

  function markDirty() {
    dirty = true;
    changeVersion += 1;
    const btn = document.getElementById('saveBtn');
    if (btn && !btn.dataset.baseLabel) btn.dataset.baseLabel = btn.textContent;
    if (btn) btn.textContent = 'Save both languages *';
  }

  function clearDirty() {
    dirty = false;
    const btn = document.getElementById('saveBtn');
    if (btn) btn.textContent = btn.dataset.baseLabel || 'Save both languages';
  }

  function t(key) {
    const langMap = translations[currentLang] || {};
    if (langMap[key] != null && langMap[key] !== '') return langMap[key];
    const defaultMap = DEFAULT_I18N[currentLang] || {};
    if (defaultMap[key] != null) return defaultMap[key];
    return key;
  }

  function setT(key, value, lang) {
    const target = lang || currentLang;
    if (!translations[target]) translations[target] = {};
    translations[target][key] = value;
    markDirty();
  }

  // Always pass the language the canvas currently represents.
  // Never flush after switching currentLang while old DOM is still on screen.
  function flushCanvasToState(lang) {
    const target = lang || currentLang;
    const canvas = document.getElementById('sectionCanvas');
    if (!canvas) return;
    canvas.querySelectorAll('[data-i18n-key]').forEach((el) => {
      const key = el.getAttribute('data-i18n-key');
      if (!key) return;
      const val = (el.innerText || el.textContent || '').replace(/\u00a0/g, ' ').trim();
      setT(key, val, target);
    });
  }

  function editable(key, className, asBlock) {
    const value = t(key);
    const tag = asBlock ? 'div' : 'span';
    const safe = escapeHtml(value);
    return `<${tag} class="editable-hit ${className || ''}" contenteditable="true" data-i18n-key="${key}" data-placeholder="${key}" spellcheck="true">${safe}</${tag}>`;
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderNav() {
    return `
      <div class="flex items-center justify-between gap-4 border-b border-white/10 pb-4 mb-2">
        <div class="white font-black tracking-widest text-sm">KORUZ<span class="dim">\u00b7KR</span></div>
        <div class="flex gap-6 text-sm">
          ${editable('nav_cat', 'muted')}
          ${editable('nav_process', 'muted')}
          ${editable('nav_contact', 'muted')}
        </div>
      </div>
      <p class="text-xs dim mt-3">Click a nav label to rename it.</p>
    `;
  }

  function renderHero() {
    return `
      <div class="max-w-3xl">
        <div class="mono mb-3">${editable('hero_eyebrow')}</div>
        <h1 class="white text-3xl sm:text-5xl font-black leading-tight tracking-tight mb-4" style="text-transform:uppercase">
          ${editable('hero_title', '', true)}
        </h1>
        <p class="muted text-base sm:text-lg mb-6 max-w-xl leading-relaxed">
          ${editable('hero_sub', '', true)}
        </p>
        <div class="flex flex-wrap gap-3 mb-10">
          <span class="inline-block bg-white text-black font-semibold text-sm px-5 py-3 rounded-sm">
            ${editable('hero_cta', 'text-black')}
          </span>
          <span class="inline-block border border-white/30 text-sm px-5 py-3 rounded-sm">
            ${editable('hero_cta2')}
          </span>
        </div>
        <div class="flex flex-wrap gap-6 mono">
          <span>${editable('meta_1')}</span>
          <span>${editable('meta_2')}</span>
          <span>${editable('meta_3')}</span>
        </div>
      </div>
    `;
  }

  function renderCategories() {
    const cards = [1, 2, 3, 4].map((n) => {
      const codes = ['VHC', 'PRT', 'CSM', 'LPT'];
      return `
        <div class="border border-white/10 p-5">
          <div class="mono mb-3">${codes[n - 1]}</div>
          <h3 class="white font-bold text-lg mb-2">${editable('cat' + n + '_name')}</h3>
          <p class="muted text-sm leading-relaxed">${editable('cat' + n + '_desc', '', true)}</p>
        </div>
      `;
    }).join('');
    return `
      <div class="mono mb-2">${editable('cat_eyebrow')}</div>
      <h2 class="white text-2xl sm:text-3xl font-black mb-6" style="text-transform:uppercase">${editable('cat_title')}</h2>
      <div class="grid sm:grid-cols-2 gap-0 border border-white/10">${cards}</div>
    `;
  }

  function renderProcess() {
    const steps = [1, 2, 3, 4].map((n) => `
      <div class="pr-4">
        <div class="mono mb-2">0${n}</div>
        <h3 class="white font-semibold mb-1">${editable('step' + n + '_name')}</h3>
        <p class="muted text-sm leading-relaxed">${editable('step' + n + '_desc', '', true)}</p>
      </div>
    `).join('');
    return `
      <div class="mono mb-2">${editable('proc_eyebrow')}</div>
      <h2 class="white text-2xl sm:text-3xl font-black mb-8" style="text-transform:uppercase">${editable('proc_title')}</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-white/10 pt-6">${steps}</div>
    `;
  }

  function renderWhy() {
    const items = [1, 2, 3].map((n) => `
      <div>
        <div class="w-10 h-px bg-white mb-4"></div>
        <h3 class="white font-semibold mb-2">${editable('why' + n + '_name')}</h3>
        <p class="muted text-sm leading-relaxed">${editable('why' + n + '_desc', '', true)}</p>
      </div>
    `).join('');
    return `<div class="grid sm:grid-cols-3 gap-8">${items}</div>`;
  }

  function renderContact() {
    return `
      <div class="grid lg:grid-cols-2 gap-10">
        <div>
          <div class="mono mb-2">${editable('ct_eyebrow')}</div>
          <h2 class="white text-2xl font-black mb-3" style="text-transform:uppercase">${editable('ct_title')}</h2>
          <p class="muted mb-4 leading-relaxed">${editable('ct_sub', '', true)}</p>
          <p class="muted text-sm">${editable('ct_loc')}</p>
        </div>
        <div class="space-y-3 text-sm">
          <div class="border border-white/10 rounded px-3 py-2 muted">${editable('f_name')}</div>
          <div class="border border-white/10 rounded px-3 py-2 muted">${editable('f_contact')}</div>
          <div class="border border-white/10 rounded px-3 py-2 muted">${editable('f_cat')}</div>
          <div class="border border-white/10 rounded px-3 py-2 muted min-h-[72px]">${editable('f_msg', '', true)}</div>
          <div class="inline-block bg-white text-black font-semibold px-4 py-2 rounded-sm">${editable('f_send', 'text-black')}</div>
          <p class="dim text-xs">${editable('f_note')}</p>
          <p class="muted text-xs">${editable('f_ok')}</p>
        </div>
      </div>
      <p class="dim text-xs mt-10 leading-relaxed max-w-3xl border-t border-white/10 pt-6">
        ${editable('footer_disclaimer', '', true)}
      </p>
    `;
  }

  const RENDERERS = { nav: renderNav, hero: renderHero, categories: renderCategories, process: renderProcess, why: renderWhy, contact: renderContact };

  function bindEditableEvents() {
    const canvas = document.getElementById('sectionCanvas');
    if (!canvas) return;
    canvas.querySelectorAll('[data-i18n-key]').forEach((el) => {
      el.addEventListener('input', () => {
        const key = el.getAttribute('data-i18n-key');
        const val = (el.innerText || el.textContent || '').replace(/\u00a0/g, ' ');
        if (!translations[currentLang]) translations[currentLang] = {};
        translations[currentLang][key] = val;
        markDirty();
      });
      el.addEventListener('blur', () => {
        const key = el.getAttribute('data-i18n-key');
        const val = (el.innerText || el.textContent || '').replace(/\u00a0/g, ' ').trim();
        setT(key, val);
        el.textContent = val;
      });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && el.tagName === 'SPAN') {
          e.preventDefault();
          el.blur();
        }
      });
    });
  }

  function renderCurrentSection() {
    // Do NOT flush here: after a language switch the DOM still shows the previous
    // language until we replace innerHTML. Flush must happen before currentLang changes.
    const section = SECTIONS.find((s) => s.id === currentSectionId) || SECTIONS[0];
    document.getElementById('sectionTitle').textContent = section.title;
    document.getElementById('langBadge').textContent = currentLang.toUpperCase();
    const renderer = RENDERERS[section.id] || (() => '<p class="muted">No preview</p>');
    const canvas = document.getElementById('sectionCanvas');
    canvas.innerHTML = renderer();
    bindEditableEvents();
    document.querySelectorAll('.nav-sec').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.section === section.id);
    });
    const contactPanel = document.getElementById('contactPanel');
    if (contactPanel) contactPanel.classList.toggle('hidden', section.id !== 'contact');
  }

  function buildSectionNav() {
    const nav = document.getElementById('sectionNav');
    nav.innerHTML = '';
    SECTIONS.forEach((s) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nav-sec w-full text-left rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50 transition';
      btn.dataset.section = s.id;
      btn.textContent = s.title;
      btn.addEventListener('click', () => {
        flushCanvasToState(currentLang);
        currentSectionId = s.id;
        renderCurrentSection();
      });
      nav.appendChild(btn);
    });
  }

  function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'ko') return;
        if (lang === currentLang) {
      // Same language: still draw the section (needed on first load).
      renderCurrentSection();
      return;
    }
    // Save edits into the language that is currently on screen, then switch.
    flushCanvasToState(currentLang);
    currentLang = lang;
    document.getElementById('langEn').classList.toggle('active', lang === 'en');
    document.getElementById('langKo').classList.toggle('active', lang === 'ko');
    document.getElementById('langEn').classList.toggle('text-slate-600', lang !== 'en');
    document.getElementById('langKo').classList.toggle('text-slate-600', lang !== 'ko');
    renderCurrentSection();
  }

  function fillContact(contact) {
    const c = contact || {};
    document.getElementById('contactEmail').value = c.email || '';
    document.getElementById('contactTelegram').value = c.telegram || '';
    document.getElementById('contactPhone').value = c.phone || '';
    document.getElementById('contactLocation').value = c.location || '';
  }

  function collectContact() {
    return {
      email: document.getElementById('contactEmail').value.trim(),
      telegram: document.getElementById('contactTelegram').value.trim(),
      phone: document.getElementById('contactPhone').value.trim(),
      location: document.getElementById('contactLocation').value.trim()
    };
  }

  function normalizeUrlList(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string' && value.trim()) return [value.trim()];
    return [];
  }

  function renderCategoryCarousels(categoryImages) {
    const grid = document.getElementById('carouselGrid');
    const section = document.getElementById('carouselSection');
    if (!grid || !section) return;
    grid.innerHTML = '';
    if (!categorySections.length) { section.classList.add('hidden'); return; }
    section.classList.remove('hidden');
    const source = categoryImages || {};
    categorySections.forEach((sec) => {
      currentCategoryImages[sec.code] = normalizeUrlList(source[sec.code]);
      const card = document.createElement('div');
      card.className = 'rounded-2xl border border-slate-200 p-4';
      card.innerHTML = `
        <h3 class="font-semibold mb-1">${sec.label} \u00b7 ${sec.code}</h3>
        <p class="text-xs text-slate-500 mb-3">Logo images for this category.</p>
        <div class="flex flex-wrap gap-2 mb-3 min-h-[64px] thumb-row"></div>
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple class="block w-full text-sm text-slate-600" />
      `;
      const thumbs = card.querySelector('.thumb-row');
      const redraw = () => {
        thumbs.innerHTML = '';
        currentCategoryImages[sec.code].forEach((url, index) => {
          const thumb = document.createElement('div');
          thumb.className = 'relative h-16 w-16 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden';
          thumb.innerHTML = `<img class="h-full w-full object-contain" alt="" /><button type="button" class="absolute top-1 right-1 rounded-md bg-white/90 border border-rose-200 text-rose-700 text-xs px-1.5">\u00d7</button>`;
          thumb.querySelector('img').src = url;
          thumb.querySelector('button').addEventListener('click', () => {
            currentCategoryImages[sec.code].splice(index, 1);
            redraw();
            markDirty();
          });
          thumbs.appendChild(thumb);
        });
      };
      redraw();
      card.querySelector('input[type="file"]').addEventListener('change', async (event) => {
        const files = [...(event.target.files || [])];
        if (!files.length) return;
        setStatus(`Uploading ${sec.code}...`);
        try {
          for (const file of files) {
            const body = new FormData();
            body.append('file', file);
            const response = await requestApi('/api/upload', { method: 'POST', body });
            const result = await readJsonSafe(response);
            if (!response.ok) throw new Error(result?.message || 'Upload failed');
            currentCategoryImages[sec.code].push(result.url);
          }
          redraw();
          markDirty();
          setStatus(`${sec.code} uploaded \u2014 click Save`);
        } catch (e) {
          setStatus(e.message || 'Upload failed');
        }
        event.target.value = '';
      });
      grid.appendChild(card);
    });
  }

  function renderImageEditor(images) {
    const grid = document.getElementById('imageGrid');
    const section = document.getElementById('imagesSection');
    if (!grid || !section) return;
    grid.innerHTML = '';
    const keys = [...new Set([...defaultImageKeys, ...Object.keys(images || {})])];
    if (!keys.length) { section.classList.add('hidden'); return; }
    section.classList.remove('hidden');
    currentImages = { ...(images || {}) };
    keys.forEach((key) => {
      if (!(key in currentImages)) currentImages[key] = '';
      const url = currentImages[key] || '';
      const card = document.createElement('div');
      card.className = 'rounded-2xl border border-slate-200 p-4';
      card.innerHTML = `
        <h3 class="font-semibold mb-3"></h3>
        <img class="w-full h-40 object-cover rounded-xl bg-slate-100 mb-3" alt="" />
        <p class="text-xs text-slate-500 mb-3 break-all meta"></p>
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" class="block w-full text-sm text-slate-600" />
      `;
      card.querySelector('h3').textContent = key;
      const img = card.querySelector('img');
      const meta = card.querySelector('.meta');
      img.src = url || 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="160"><rect width="100%" height="100%" fill="#eee"/><text x="50%" y="50%" text-anchor="middle" fill="#888" font-size="14">No image</text></svg>');
      meta.textContent = url || 'Default';
      card.querySelector('input[type="file"]').addEventListener('change', async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setStatus('Uploading...');
        try {
          const body = new FormData();
          body.append('file', file);
          const response = await requestApi('/api/upload', { method: 'POST', body });
          const result = await readJsonSafe(response);
          if (!response.ok) throw new Error(result?.message || 'Upload failed');
          currentImages[key] = result.url;
          img.src = result.url;
          meta.textContent = result.url;
          markDirty();
          setStatus('Uploaded \u2014 click Save');
        } catch (e) {
          setStatus(e.message || 'Upload failed');
        }
        event.target.value = '';
      });
      grid.appendChild(card);
    });
  }

  async function loadOriginalTranslations() {
    try {
      const response = await fetch(pagePath + '?v=' + Date.now(), { cache: 'no-store' });
      const html = await response.text();
      const match = html.match(/const\s+I18N\s*=\s*([\s\S]*?)\n\};\s*\n\s*function\s+setLang/);
      if (!match) return null;
      return Function('"use strict"; return (' + match[1] + '\n});')();
    } catch { return null; }
  }

  async function load() {
    setStatus('Loading...');
    document.getElementById('summary').textContent = 'Loading content\u2026';
    try {
      const [savedRes, original] = await Promise.all([
        requestApi(`/api/sitecontent/${siteCode}`),
        loadOriginalTranslations()
      ]);
      const data = await readJsonSafe(savedRes);
      if (!savedRes.ok) throw new Error(data?.message || `HTTP ${savedRes.status}`);
      const saved = data?.siteContent || {};
      const baseEn = { ...(original?.en || DEFAULT_I18N.en), ...(saved.translations?.en || {}) };
      const baseKo = { ...(original?.ko || DEFAULT_I18N.ko), ...(saved.translations?.ko || {}) };
      translations = { en: baseEn, ko: baseKo };
      fillContact(saved.contact);
      renderCategoryCarousels(saved.categoryImages || {});
      renderImageEditor(saved.images || {});
      const updated = data?.updatedAtUtc ? new Date(data.updatedAtUtc).toLocaleString() : '\u2014';
      document.getElementById('summary').textContent =
        `${siteName} \u00b7 last saved ${updated} \u00b7 click text in the dark preview to edit \u00b7 toggle EN/KO keeps both drafts`;
      clearDirty();
      buildSectionNav();
      setLanguage('en');
      setStatus('');
    } catch (e) {
      document.getElementById('summary').textContent = 'Load failed: ' + (e.message || e);
      setStatus(e.message || 'Load failed');
      buildSectionNav();
      setLanguage('en');
    }
  }

  async function save() {
    if (saveInProgress) return;

    flushCanvasToState(currentLang);
    const saveVersion = changeVersion;
    const saveButton = document.getElementById('saveBtn');
    saveInProgress = true;
    if (saveButton) {
      saveButton.disabled = true;
      saveButton.textContent = 'Saving...';
    }
    setStatus('Saving both languages\u2026');
    const payload = {
      translations: { en: { ...translations.en }, ko: { ...translations.ko } },
      contact: collectContact()
    };
    if (Object.keys(currentImages).length) payload.images = currentImages;
    if (categorySections.length) payload.categoryImages = currentCategoryImages;
    try {
      const response = await requestApi(`/api/sitecontent/${siteCode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await readJsonSafe(response);
      if (!response.ok) throw new Error(data?.message || `HTTP ${response.status}`);
      if (changeVersion === saveVersion) clearDirty();
      setStatus('');
      showToast('Saved', changeVersion === saveVersion
        ? 'English and Korean are live on the public site.'
        : 'Saved. New changes still need to be saved.');
      const updated = data?.updatedAtUtc ? new Date(data.updatedAtUtc).toLocaleString() : 'now';
      document.getElementById('summary').textContent =
        `${siteName} \u00b7 last saved ${updated} \u00b7 click text in the dark preview to edit \u00b7 toggle EN/KO keeps both drafts`;
    } catch (e) {
      setStatus('Save failed: ' + (e.message || e));
      showToast('Save failed', e.message || 'Unknown error');
    } finally {
      saveInProgress = false;
      if (saveButton) {
        saveButton.disabled = false;
        saveButton.textContent = dirty
          ? 'Save both languages *'
          : (saveButton.dataset.baseLabel || 'Save both languages');
      }
    }
  }

  document.getElementById('langEn').addEventListener('click', () => setLanguage('en'));
  document.getElementById('langKo').addEventListener('click', () => setLanguage('ko'));
  document.getElementById('saveBtn').addEventListener('click', save);
  document.getElementById('backBtn').addEventListener('click', () => {
    if (dirty && !confirm('Unsaved changes. Leave anyway?')) return;
    window.location.href = 'admin-dashboard.html';
  });
  document.getElementById('viewBtn').addEventListener('click', () => {
    window.open(livePath + '?v=' + Date.now(), '_blank');
  });
  ['contactEmail', 'contactTelegram', 'contactPhone', 'contactLocation'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', markDirty);
  });
  window.addEventListener('beforeunload', (e) => {
    if (!dirty) return;
    e.preventDefault();
    e.returnValue = '';
  });

  load();
})();
