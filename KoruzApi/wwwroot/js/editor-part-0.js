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
      footer_disclaimer: 'KOR