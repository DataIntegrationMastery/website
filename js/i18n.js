/**
 * Data Integration Mastery™ — i18n (Internationalization) Module
 * Supports: EN (English), FI (Finnish), DE (German)
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'dim_language';
  var DEFAULT_LANG = 'en';

  var translations = {
    en: {
      nav_home: 'Home',
      nav_all_patterns: 'All Patterns',
      nav_free_course: 'Free Course',
      nav_courses: 'Courses',
      sidebar_title: 'Pattern Categories',
      sidebar_resilience: '🛡️ Resilience Patterns',
      sidebar_messaging: '📨 Messaging Patterns',
      sidebar_transformation: '🔄 Data Transformation Patterns',
      sidebar_routing: '🔀 Routing Patterns',
      sidebar_security: '🔐 Security Patterns',
      sidebar_orchestration: '🎭 Orchestration Patterns',
      sidebar_observability: '📊 Monitoring & Observability Patterns',
      breadcrumb_home: 'Home',
      breadcrumb_patterns: 'Patterns',
      back_to_patterns: '← Back to All Patterns',
      footer_rights: '©2026 Data Integration Mastery™ — All Rights Reserved',
      lang_switcher_label: 'Language:',
      browse_patterns: 'Browse All Patterns'
    },
    fi: {
      nav_home: 'Etusivu',
      nav_all_patterns: 'Kaikki kaavat',
      nav_free_course: 'Ilmainen kurssi',
      nav_courses: 'Kurssit',
      sidebar_title: 'Kaavioluokat',
      sidebar_resilience: '🛡️ Resilienssikaavat',
      sidebar_messaging: '📨 Viestintäkaavat',
      sidebar_transformation: '🔄 Datanmuunnoskaavat',
      sidebar_routing: '🔀 Reitityskaavat',
      sidebar_security: '🔐 Tietoturvakaavat',
      sidebar_orchestration: '🎭 Orkestrointikaavat',
      sidebar_observability: '📊 Monitorointi- & havainnointik.',
      breadcrumb_home: 'Etusivu',
      breadcrumb_patterns: 'Kaavat',
      back_to_patterns: '← Takaisin kaikkiin kaavoihin',
      footer_rights: '©2026 Data Integration Mastery™ — Kaikki oikeudet pidätetään',
      lang_switcher_label: 'Kieli:',
      browse_patterns: 'Selaa kaikkia kaavoja'
    },
    de: {
      nav_home: 'Startseite',
      nav_all_patterns: 'Alle Muster',
      nav_free_course: 'Kostenloser Kurs',
      nav_courses: 'Kurse',
      sidebar_title: 'Musterkategorien',
      sidebar_resilience: '🛡️ Resilienzmuster',
      sidebar_messaging: '📨 Nachrichtenmuster',
      sidebar_transformation: '🔄 Datentransformationsmuster',
      sidebar_routing: '🔀 Routing-Muster',
      sidebar_security: '🔐 Sicherheitsmuster',
      sidebar_orchestration: '🎭 Orchestrierungsmuster',
      sidebar_observability: '📊 Monitoring & Observability',
      breadcrumb_home: 'Startseite',
      breadcrumb_patterns: 'Muster',
      back_to_patterns: '← Zurück zu allen Mustern',
      footer_rights: '©2026 Data Integration Mastery™ — Alle Rechte vorbehalten',
      lang_switcher_label: 'Sprache:',
      browse_patterns: 'Alle Muster durchsuchen'
    }
  };

  function getStoredLang() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // ignore
    }
  }

  function setLanguage(lang) {
    if (!translations[lang]) { lang = DEFAULT_LANG; }
    var dict = translations[lang];

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Replace data-i18n text nodes
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        els[i].textContent = dict[key];
      }
    }

    // Show/hide data-lang sections
    var sections = document.querySelectorAll('[data-lang]');
    for (var j = 0; j < sections.length; j++) {
      if (sections[j].getAttribute('data-lang') === lang) {
        sections[j].classList.add('lang-active');
      } else {
        sections[j].classList.remove('lang-active');
      }
    }

    // Update active button state
    var btns = document.querySelectorAll('[data-lang-btn]');
    for (var k = 0; k < btns.length; k++) {
      if (btns[k].getAttribute('data-lang-btn') === lang) {
        btns[k].classList.add('active');
      } else {
        btns[k].classList.remove('active');
      }
    }

    storeLang(lang);
  }

  // Expose API
  window.DIM = window.DIM || {};
  window.DIM.setLanguage = setLanguage;

  // Auto-init on DOM ready
  function init() {
    var lang = getStoredLang() || DEFAULT_LANG;
    setLanguage(lang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
