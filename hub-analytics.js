/**
 * EmplyFlow Hub — client analytics tracker.
 * Requires window.HUB_ANALYTICS_ENDPOINT (Apps Script web app URL).
 * Respects consent: localStorage efhub_consent = granted|denied.
 */
(function (window, document) {
  'use strict';

  var KEYS = {
    visitor: 'efhub_vid',
    session: 'efhub_sid',
    sessionAt: 'efhub_sid_at',
    consent: 'efhub_consent',
    utm: 'efhub_utm',
    firstSeen: 'efhub_first_seen',
    geo: 'efhub_geo'
  };

  var SESSION_MS = 30 * 60 * 1000;
  var FLUSH_MS = 2000;
  var HEARTBEAT_MS = 15000;
  var SCROLL_MARKS = [25, 50, 75, 90];

  var endpoint = '';
  var queue = [];
  var flushTimer = null;
  var heartbeatTimer = null;
  var pageEnteredAt = Date.now();
  var maxScroll = 0;
  var firedScroll = {};
  var lastPath = '';
  var lastPageType = '';
  var lastMeta = {};
  var pageExited = false;
  var geoCache = null;
  var geoTried = false;
  var sessionStarted = false;
  var debug = false;

  function nowIso() {
    return new Date().toISOString();
  }

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function lsGet(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }
  function lsSet(k, v) {
    try { localStorage.setItem(k, v); } catch (e) {}
  }
  function ssGet(k) {
    try { return sessionStorage.getItem(k); } catch (e) { return null; }
  }
  function ssSet(k, v) {
    try { sessionStorage.setItem(k, v); } catch (e) {}
  }

  function getConsent() {
    return lsGet(KEYS.consent);
  }
  function canTrack() {
    return getConsent() === 'granted';
  }

  function getVisitorId() {
    var id = lsGet(KEYS.visitor);
    if (!id) {
      id = uuid();
      lsSet(KEYS.visitor, id);
    }
    if (!lsGet(KEYS.firstSeen)) lsSet(KEYS.firstSeen, nowIso());
    return id;
  }

  function touchSession() {
    var sid = lsGet(KEYS.session);
    var at = parseInt(lsGet(KEYS.sessionAt) || '0', 10);
    var n = Date.now();
    if (!sid || !at || n - at > SESSION_MS) {
      sid = uuid();
      lsSet(KEYS.session, sid);
      sessionStarted = false;
    }
    lsSet(KEYS.sessionAt, String(n));
    return sid;
  }

  function parseUtm() {
    var q = {};
    try {
      var sp = new URLSearchParams(location.search);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
        var v = sp.get(k);
        if (v) q[k] = v;
      });
    } catch (e) {}
    if (Object.keys(q).length) {
      lsSet(KEYS.utm, JSON.stringify(q));
      return q;
    }
    try {
      return JSON.parse(lsGet(KEYS.utm) || '{}');
    } catch (e2) {
      return {};
    }
  }

  function deviceInfo() {
    var ua = navigator.userAgent || '';
    var w = window.innerWidth || 0;
    var type = w < 680 ? 'mobile' : w <= 1024 ? 'tablet' : 'desktop';
    var os = /Android/i.test(ua) ? 'Android'
      : /iPhone|iPad|iPod/i.test(ua) ? 'iOS'
      : /Mac/i.test(ua) ? 'macOS'
      : /Win/i.test(ua) ? 'Windows'
      : /Linux/i.test(ua) ? 'Linux' : 'other';
    var browser = /Edg\//i.test(ua) ? 'Edge'
      : /Chrome\//i.test(ua) ? 'Chrome'
      : /Safari\//i.test(ua) && !/Chrome/i.test(ua) ? 'Safari'
      : /Firefox\//i.test(ua) ? 'Firefox' : 'other';
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    return {
      device_type: type,
      screen: (window.screen && screen.width || 0) + 'x' + (window.screen && screen.height || 0),
      viewport: w + 'x' + (window.innerHeight || 0),
      language: navigator.language || '',
      timezone: tz,
      os: os,
      browser: browser
    };
  }

  function pathInfo(hash) {
    var h = (hash != null ? hash : location.hash).replace(/^#/, '') || '/competencies';
    var qi = h.indexOf('?');
    var path = qi < 0 ? h : h.slice(0, qi);
    var query = qi < 0 ? '' : h.slice(qi + 1);
    var parts = path.split('/').filter(Boolean);
    var pageType = 'home';
    var competencyId = '';
    var caseId = '';
    if (parts[0] === 'competencies' && !parts[1]) pageType = 'home';
    else if (parts[0] === 'competencies' && parts[1] === 'methodology') pageType = 'methodology';
    else if (parts[0] === 'competencies' && parts[1] === 'request') pageType = 'lead_route';
    else if (parts[0] === 'competencies' && parts[1]) {
      pageType = 'competency';
      competencyId = parts[1];
    } else if (parts[0] === 'cases' && parts[1]) {
      pageType = 'case_detail';
      caseId = parts[1];
    } else if (parts[0] === 'cases') pageType = 'cases_catalog';
    return {
      path: '#' + h,
      page_type: pageType,
      competency_id: competencyId,
      case_id: caseId,
      query: query
    };
  }

  function buildEvent(name, props) {
    var info = pathInfo();
    var device = deviceInfo();
    var utm = parseUtm();
    return {
      event_id: uuid(),
      event_name: name,
      event_at: nowIso(),
      visitor_id: getVisitorId(),
      session_id: touchSession(),
      path: info.path,
      page_type: (props && props.page_type) || info.page_type,
      competency_id: (props && props.competency_id) || info.competency_id || '',
      case_id: (props && props.case_id) || info.case_id || '',
      referrer: document.referrer || '',
      landing_page: ssGet('efhub_landing') || '',
      first_seen_at: lsGet(KEYS.firstSeen) || '',
      props: props || {},
      utm: utm,
      device: device,
      geo: geoCache || {}
    };
  }

  function enqueue(evt) {
    queue.push(evt);
    if (!flushTimer) flushTimer = setTimeout(flush, FLUSH_MS);
  }

  function flush() {
    flushTimer = null;
    if (!queue.length) return;
    var batch = queue.splice(0, queue.length);
    if (!endpoint) {
      if (debug) {
        try { console.info('[hub analytics demo]', batch); } catch (e) {}
      }
      return;
    }
    var body = JSON.stringify({ events: batch });
    try {
      if (navigator.sendBeacon) {
        var blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
        if (navigator.sendBeacon(endpoint, blob)) return;
      }
    } catch (e1) {}
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: body,
      mode: 'cors',
      keepalive: true
    }).catch(function () {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: body,
        mode: 'no-cors',
        keepalive: true
      }).catch(function () {});
    });
  }

  function track(name, props) {
    if (!canTrack()) return;
    touchSession();
    if (!sessionStarted) {
      sessionStarted = true;
      enqueue(buildEvent('session_start', { landing_page: ssGet('efhub_landing') || location.href }));
    }
    enqueue(buildEvent(name, props || {}));
  }

  function ensureLanding() {
    if (!ssGet('efhub_landing')) ssSet('efhub_landing', location.href);
  }

  function fetchGeoOnce() {
    if (geoTried || !canTrack()) return;
    geoTried = true;
    var cached = lsGet(KEYS.geo);
    if (cached) {
      try { geoCache = JSON.parse(cached); return; } catch (e) {}
    }
    // Soft geo via public CORS endpoint (country/city/region only). Fail silently.
    fetch('https://get.geojs.io/v1/ip/geo.json', { method: 'GET', mode: 'cors' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || typeof data !== 'object') return;
        geoCache = {
          country: data.country || data.country_code || '',
          country_code: data.country_code || '',
          region: data.region || '',
          city: data.city || '',
          timezone: data.timezone || ''
        };
        lsSet(KEYS.geo, JSON.stringify(geoCache));
      })
      .catch(function () {});
  }

  function pageExit() {
    if (!canTrack() || !lastPath || pageExited) return;
    pageExited = true;
    var ms = Date.now() - pageEnteredAt;
    track('page_exit', {
      path: lastPath,
      page_type: lastPageType,
      time_on_page_ms: ms,
      scroll_depth_percent: maxScroll,
      competency_id: lastMeta.competency_id || '',
      case_id: lastMeta.case_id || ''
    });
    flush();
  }

  function pageView(extra) {
    if (!canTrack()) return;
    var info = pathInfo();
    if (lastPath && lastPath !== info.path) pageExit();
    pageEnteredAt = Date.now();
    maxScroll = 0;
    firedScroll = {};
    pageExited = false;
    lastPath = info.path;
    lastPageType = info.page_type;
    lastMeta = {
      competency_id: info.competency_id,
      case_id: (extra && extra.case_id) || info.case_id
    };
    var props = {
      path: info.path,
      page_type: info.page_type,
      competency_id: info.competency_id,
      case_id: lastMeta.case_id,
      query: info.query
    };
    if (extra) {
      Object.keys(extra).forEach(function (k) { props[k] = extra[k]; });
    }
    track('page_view', props);
    if (info.page_type === 'competency') track('competency_view', props);
    if (info.page_type === 'case_detail') track('case_view', props);
  }

  function onScroll() {
    if (!canTrack()) return;
    var doc = document.documentElement;
    var scrollable = Math.max(doc.scrollHeight - window.innerHeight, 1);
    var pct = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
    if (pct > maxScroll) maxScroll = pct;
    SCROLL_MARKS.forEach(function (m) {
      if (pct >= m && !firedScroll[m]) {
        firedScroll[m] = true;
        track('scroll_depth', { depth: m, path: lastPath, page_type: lastPageType });
      }
    });
  }

  function startHeartbeat() {
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    heartbeatTimer = setInterval(function () {
      if (!canTrack() || document.visibilityState === 'hidden') return;
      touchSession();
      track('heartbeat', {
        path: lastPath,
        page_type: lastPageType,
        time_on_page_ms: Date.now() - pageEnteredAt,
        scroll_depth_percent: maxScroll
      });
    }, HEARTBEAT_MS);
  }

  function showBanner() {
    var el = document.getElementById('efConsent');
    if (!el) return;
    if (getConsent()) {
      el.classList.remove('on');
      el.hidden = true;
      return;
    }
    el.hidden = false;
    requestAnimationFrame(function () { el.classList.add('on'); });
  }

  function hideBanner() {
    var el = document.getElementById('efConsent');
    if (!el) return;
    el.classList.remove('on');
    setTimeout(function () { el.hidden = true; }, 280);
  }

  function grantConsent() {
    lsSet(KEYS.consent, 'granted');
    hideBanner();
    ensureLanding();
    getVisitorId();
    touchSession();
    fetchGeoOnce();
    track('consent_granted', {});
    pageView();
    startHeartbeat();
  }

  function denyConsent() {
    lsSet(KEYS.consent, 'denied');
    hideBanner();
    queue = [];
    if (heartbeatTimer) clearInterval(heartbeatTimer);
  }

  function getIds() {
    return {
      visitor_id: getVisitorId(),
      session_id: touchSession(),
      consent: getConsent() || ''
    };
  }

  function init(opts) {
    opts = opts || {};
    endpoint = (opts.endpoint || window.HUB_ANALYTICS_ENDPOINT || '').trim();
    debug = !!opts.debug || !!window.HUB_ANALYTICS_DEBUG;
    ensureLanding();
    parseUtm();
    getVisitorId();
    touchSession();

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent]');
      if (!btn) return;
      var v = btn.getAttribute('data-consent');
      if (v === 'grant') grantConsent();
      else if (v === 'deny') denyConsent();
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        pageExit();
        flush();
      }
    });
    window.addEventListener('pagehide', function () {
      pageExit();
      flush();
    });

    showBanner();
    if (canTrack()) {
      fetchGeoOnce();
      startHeartbeat();
    }
  }

  window.HubAnalytics = {
    init: init,
    track: track,
    pageView: pageView,
    pageExit: pageExit,
    flush: flush,
    getIds: getIds,
    grantConsent: grantConsent,
    denyConsent: denyConsent,
    getConsent: getConsent,
    pathInfo: pathInfo
  };
})(window, document);
