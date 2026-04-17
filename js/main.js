/* ============================================================
   Data Integration Mastery™ — Main JavaScript
   Handles: cookie consent, analytics loading, video facade,
            smooth scroll, GA4 event tracking
   ============================================================ */

(function () {
  'use strict';

  // --- Cookie Consent ---
  var CONSENT_KEY = 'dim_cookie_consent';
  var consentBanner = document.getElementById('cookie-consent');
  var acceptBtn = document.getElementById('cookie-accept');
  var declineBtn = document.getElementById('cookie-decline');

  function getConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch (e) {
      // Storage not available
    }
  }

  function showBanner() {
    if (consentBanner) {
      consentBanner.hidden = false;
    }
  }

  function hideBanner() {
    if (consentBanner) {
      consentBanner.hidden = true;
    }
  }

  function loadAnalytics() {
    // GA4
    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-XCC86BX1T8';
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-XCC86BX1T8', { send_page_view: false });
    gtag('event', 'page_view', {
      page_title: 'Data Integration Mastery — From Developer to Integration Architect',
      page_location: window.location.href
    });

    // Facebook Pixel
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', '9461194620594906');
    window.fbq('track', 'PageView');

    // TikTok Pixel
    !function (w, d, t) {
      w.TiktokAnalyticsObject = t;
      var ttq = w[t] = w[t] || [];
      ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie', 'holdConsent', 'revokeConsent', 'grantConsent'];
      ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (t) {
        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
        return e;
      };
      ttq.load = function (e, n) {
        var r = 'https://analytics.tiktok.com/i18n/pixel/events.js', o = n && n.partner;
        ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = r;
        ttq._t = ttq._t || {}; ttq._t[e] = +new Date;
        ttq._o = ttq._o || {}; ttq._o[e] = n || {};
        var s = document.createElement('script');
        s.type = 'text/javascript'; s.async = !0; s.src = r + '?sdkid=' + e + '&lib=' + t;
        var a = document.getElementsByTagName('script')[0];
        a.parentNode.insertBefore(s, a);
      };
      ttq.load('D0AS70JC77U3GUQUEQ0G');
      ttq.page();
    }(window, document, 'ttq');

    // Metricool
    (function () {
      var s = document.createElement('script');
      s.src = 'https://tracker.metricool.com/resources/be.js';
      s.onload = function () {
        if (typeof beTracker !== 'undefined') {
          beTracker.t({ hash: '7373b3bf5fded2dfa8028b95001fcc85' });
        }
      };
      document.head.appendChild(s);
    })();
  }

  // Check consent state
  var consent = getConsent();
  if (consent === 'accepted') {
    loadAnalytics();
  } else if (consent === 'declined') {
    // Do nothing — respect decline
  } else {
    showBanner();
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', function () {
      setConsent('accepted');
      hideBanner();
      loadAnalytics();
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', function () {
      setConsent('declined');
      hideBanner();
    });
  }

  // --- YouTube Video Facade (lazy load) ---
  var facade = document.getElementById('video-facade');
  if (facade) {
    function loadVideo() {
      var videoId = facade.getAttribute('data-video-id');
      if (!videoId) return;
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', 'https://www.youtube.com/embed/' + encodeURIComponent(videoId) + '?autoplay=1&rel=0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('title', 'Data Integration Mastery introduction video');
      iframe.style.position = 'absolute';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = '0';
      facade.innerHTML = '';
      facade.appendChild(iframe);
      facade.style.cursor = 'default';

      // Track video play in GA4
      if (window.gtag) {
        window.gtag('event', 'video_play', {
          event_category: 'Engagement',
          event_label: 'Intro video played',
          value: 1
        });
      }
    }

    facade.addEventListener('click', loadVideo);
    facade.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        loadVideo();
      }
    });
  }

  // --- GA4 Event Tracking: Udemy CTA clicks ---
  var ctaC002 = document.getElementById('cta-c002');
  if (ctaC002) {
    ctaC002.addEventListener('click', function () {
      if (window.gtag) {
        window.gtag('event', 'lead_click_to_udemy_c002', {
          event_category: 'Lead',
          event_label: 'Lead clicked C002 Mastering Integration Development link to Udemy',
          value: 1
        });
      }
      if (window.fbq) {
        window.fbq('trackCustom', 'fb_lead_claim_coupon');
      }
    });
  }

  // --- Track all outbound Udemy links ---
  document.querySelectorAll('a[href*="udemy.com"]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.gtag) {
        window.gtag('event', 'outbound_click', {
          event_category: 'Outbound',
          event_label: link.href,
          value: 1
        });
      }
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
