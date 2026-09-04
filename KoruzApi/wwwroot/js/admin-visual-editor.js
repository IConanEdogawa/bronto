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
      hero_eyebrow: 'Sourcing · Seoul → Tashkent',
      hero_title: 'Direct sourcing from South Korea',
      hero_sub: 'We find, verify, and ship goods from Korean sellers — vehicles, parts, cosmetics, and laptops. No dealer markups, no middleman chains.',
      hero_cta: 'Request a quote', hero_cta2: 'View categories',
      meta_1: 'EST. 2026', meta_2: '4 categories', meta_3: 'Inspection before purchase',
      cat_eyebrow: 'What we source', cat_title: 'Four categories',
      cat1_name: 'Vehicles', cat1_desc: 'Used and new cars sourced from Korean marketplaces and auctions, inspected before purchase.',
      cat2_name: 'Auto parts', cat2_desc: 'OEM and aftermarket parts located by VIN or part number, from engines to body panels.',
      cat3_name: 'Cosmetics', cat3_desc: 'K-beauty products purchased in wholesale volumes directly from verified sellers.',
      cat4_name: 'Laptops', cat4_desc: 'Business and consumer laptops, graded and tested before shipment.',
      proc_eyebrow: 'How it works', proc_title: 'From request to delivery',
      step1_name: 'Request', step1_desc: 'Tell us what you need — a model, a part number, or just a budget and a goal.',
      step2_name: 'Sourcing & inspection', step2_desc: 'We locate options, check condition and history, and send you a report with photos.',
      step3_name: 'Purchase', step3_desc: 'You approve, we buy directly from the seller at the local price.',
      step4_name: 'Delivery', step4_desc: 'Packing, export paperwork, and shipping to Uzbekistan — handled end to end.',
      why1_name: 'Direct purchase', why1_desc: 'We buy from sellers at local Korean prices. No dealer margins built into your quote.',
      why2_name: 'Verified before payment', why2_desc: 'You see inspection reports and photos before committing a single sum.',
      why3_name: 'Korea ↔ Uzbekistan', why3_desc: 'We operate on both ends: sourcing in Seoul, delivery and paperwork in Tashkent.',
      ct_eyebrow: 'Contact', ct_title: 'Tell us what you need',
      ct_sub: 'Describe the product, send a link or a part number — we reply with options and a quote.',
      ct_loc: 'Seongdong-gu, Seoul',
      f_name: 'Name', f_contact: 'Telegram or phone', f_cat: 'Category', f_msg: 'What are you looking for?',
      f_send: 'Send request', f_note: 'We usually reply within 24 hours.',
      f_ok: "Request received — we'll get back to you shortly.",
      footer_disclaimer: 'KORUZ is an independent sourcing service. We are not a dealer, distributor, or authorized representative of any manufacturer or brand. All products are purchased directly from their respective sellers.'
    },
    ko: {
      nav_cat: '카테고리', nav_process: '진행 절차', nav_contact: '문의',
      hero_eyebrow: '소싱 · 서울 → 타슈켄트',
      hero_title: '대한민국 직접 소싱',
      hero_sub: '차량, 부품, 화장품, 노트북 — 한국 판매자로부터 상품을 찾고, 검증하고, 배송합니다. 딜러 마진도, 불필요한 중간 단계도 없습니다.',
      hero_cta: '견적 요청', hero_cta2: '카테고리 보기',
      meta_1: 'EST. 2026', meta_2: '4개 카테고리', meta_3: '구매 전 검수',
      cat_eyebrow: '취급 품목', cat_title: '네 가지 카테고리',
      cat1_name: '차량', cat1_desc: '한국 중고차 플랫폼과 경매에서 차량을 찾아 구매 전 상태를 점검합니다.',
      cat2_name: '자동차 부품', cat2_desc: 'VIN 또는 부품 번호로 OEM·애프터마켓 부품을 찾아드립니다.',
      cat3_name: '화장품', cat3_desc: '검증된 판매자로부터 K-뷰티 제품을 도매 물량으로 구매합니다.',
      cat4_name: '노트북', cat4_desc: '비즈니스·일반 노트북을 등급 분류 및 테스트 후 발송합니다.',
      proc_eyebrow: '진행 절차', proc_title: '요청부터 배송까지',
      step1_name: '요청', step1_desc: '필요한 것을 알려주세요 — 모델명, 부품 번호, 또는 예산과 목적만으로도 충분합니다.',
      step2_name: '소싱 및 검수', step2_desc: '옵션을 찾아 상태와 이력을 확인하고, 사진과 함께 리포트를 보내드립니다.',
      step3_name: '구매', step3_desc: '승인하시면 현지 가격 그대로 판매자에게서 직접 구매합니다.',
      step4_name: '배송', step4_desc: '포장, 수출 서류, 우즈베키스탄까지의 배송 — 전 과정을 처리합니다.',
      why1_name: '직접 구매', why1_desc: '한국 현지 가격으로 판매자에게서 직접 구매합니다. 딜러 마진이 없습니다.',
      why2_name: '결제 전 검증', why2_desc: '결제 전에 검수 리포트와 사진을 먼저 확인하실 수 있습니다.',
      why3_name: '한국 ↔ 우즈베키스탄', why3_desc: '서울에서 소싱, 타슈켄트에서 배송과 서류 처리 — 양쪽에서 운영합니다.',
      ct_eyebrow: '문의', ct_title: '필요한 것을 알려주세요',
      ct_sub: '제품 설명, 링크 또는 부품 번호를 보내주시면 옵션과 견적으로 답변드립니다.',
      ct_loc: '서울 성동구',
      f_name: '이름', f_contact: '텔레그램 또는 전화번호', f_cat: '카테고리', f_msg: '어떤 상품을 찾으시나요?',
      f_send: '요청 보내기', f_note: '보통 24시간 이내에 답변드립니다.',
      f_ok: '요청이 접수되었습니다 — 곧 연락드리겠습니다.',
      footer_disclaimer: 'KORUZ는 독립 소싱 서비스입니다. 당사는 어떤 제조사나 브랜드의 딜러, 유통사 또는 공식 대리점이 아닙니다. 모든 제품은 해당 판매자로부터 직접 구매합니다.'
    }
  };

  const SECTIONS = [
    { id: 'nav', title: '1 · Navigation', keys: ['nav_cat', 'nav_process', 'nav_contact'] },
    { id: 'hero', title: '2 · Hero', keys: ['hero_eyebrow', 'hero_title', 'hero_sub', 'hero_cta', 'hero_cta2', 'meta_1', 'meta_2', 'meta_3'] },
    { id: 'categories', title: '3 · Categories', keys: ['cat_eyebrow', 'cat_title', 'cat1_name', 'cat1_desc', 'cat2_name', 'cat2_desc', 'cat3_name', 'cat3_desc', 'cat4_name', 'cat4_desc'] },
    { id: 'process', title: '4 · Process', keys: ['proc_eyebrow', 'proc_title', 'step1_name', 'step1_desc', 'step2_name', 'step2_desc', 'step3_name', 'step3_desc', 'step4_name', 'step4_desc'] },
    { id: 'why', title: '5 · Why us', keys: ['why1_name', 'why1_desc', 'why2_name', 'why2_desc', 'why3_name', 'why3_desc'] },
    { id: 'contact', title: '6 · Contact + Footer', keys: ['ct_eyebrow', 'ct_title', 'ct_sub', 'ct_loc', 'f_name', 'f_contact', 'f_cat', 'f_msg', 'f_send', 'f_note', 'f_ok', 'footer_disclaimer'] }
  ];

  let translations = { en: { ...DEFAULT_I18N.en }, ko: { ...DEFAULT_I18N.ko } };
  let currentLang = 'en';
  let currentSectionId = 'hero';
  let currentImages = {};
  let currentCategoryImages = { VHC: [], PRT: [], CSM: [], LPT: [] };
  let dirty = false;

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
    const fallback = translations.en || {};
    return fallback[key] != null ? fallback[key] : key;
  }

  function setT(key, value) {
    if (!translations[currentLang]) translations[currentLang] = {};
    translations[currentLang][key] = value;
    markDirty();
  }

  function flushCanvasToState() {
    const canvas = document.getElementById('sectionCanvas');
    if (!canvas) return;
    canvas.querySelectorAll('[data-i18n-key]').forEach((el) => {
      const key = el.getAttribute('data-i18n-key');
      if (!key) return;
      const val = (el.innerText || el.textContent || '').replace(/\u00a0/g, ' ').trim();
      setT(key, val);
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
        <div class="white font-black tracking-widest text-sm">KORUZ<span class="dim">·KR</span></div>
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
    flushCanvasToState();
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
        flushCanvasToState();
        currentSectionId = s.id;
        renderCurrentSection();
      });
      nav.appendChild(btn);
    });
  }

  function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'ko') return;
    flushCanvasToState();
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
        <h3 class="font-semibold mb-1">${sec.label} · ${sec.code}</h3>
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
          thumb.innerHTML = `<img class="h-full w-full object-contain" alt="" /><button type="button" class="absolute top-1 right-1 rounded-md bg-white/90 border border-rose-200 text-rose-700 text-xs px-1.5">×</button>`;
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
          setStatus(`${sec.code} uploaded — click Save`);
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
          setStatus('Uploaded — click Save');
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
    document.getElementById('summary').textContent = 'Loading content…';
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
      const updated = data?.updatedAtUtc ? new Date(data.updatedAtUtc).toLocaleString() : '—';
      document.getElementById('summary').textContent =
        `${siteName} · last saved ${updated} · click text in the dark preview to edit · toggle EN/KO keeps both drafts`;
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
    flushCanvasToState();
    setStatus('Saving both languages…');
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
      clearDirty();
      setStatus('');
      showToast('Saved', 'English and Korean are live on the public site.');
      const updated = data?.updatedAtUtc ? new Date(data.updatedAtUtc).toLocaleString() : 'now';
      document.getElementById('summary').textContent =
        `${siteName} · last saved ${updated} · click text in the dark preview to edit · toggle EN/KO keeps both drafts`;
    } catch (e) {
      setStatus('Save failed: ' + (e.message || e));
      showToast('Save failed', e.message || 'Unknown error');
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
