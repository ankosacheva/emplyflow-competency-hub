/**
 * EmplyFlow Hub — приём analytics events в Google Sheet.
 *
 * Установка:
 * 1. Создайте отдельный Google Sheet (рекомендуется отдельно от Leads)
 * 2. Расширения → Apps Script → вставьте этот файл целиком
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. URL деплоя положите в window.HUB_ANALYTICS_ENDPOINT на сайте
 * 5. Триггеры → Add Trigger → rollupDaily → Time-driven → Day timer → 01:00–02:00
 *
 * Листы создаются автоматически: raw_events, sessions, visitors, daily_summary
 */

var RAW_SHEET = 'raw_events';
var SESSIONS_SHEET = 'sessions';
var VISITORS_SHEET = 'visitors';
var DAILY_SHEET = 'daily_summary';

var RAW_HEADERS = [
  'event_id', 'event_at', 'visitor_id', 'session_id', 'event_name',
  'path', 'page_type', 'competency_id', 'case_id', 'referrer', 'landing_page',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'device_type', 'os', 'browser', 'language', 'timezone', 'screen', 'viewport',
  'country', 'region', 'city',
  'props_json', 'first_seen_at'
];

var SESSION_HEADERS = [
  'session_id', 'visitor_id', 'started_at', 'ended_at', 'duration_sec',
  'pageviews', 'events_count', 'landing_page', 'exit_page',
  'utm_source', 'referrer', 'country', 'city', 'device_type',
  'lead_submitted', 'top_competency', 'top_case'
];

var VISITOR_HEADERS = [
  'visitor_id', 'first_seen_at', 'last_seen_at', 'sessions_count',
  'total_events', 'first_utm_source', 'last_utm_source',
  'country', 'city', 'device_type', 'lead_submitted'
];

var DAILY_HEADERS = [
  'date', 'users', 'new_users', 'sessions', 'pageviews',
  'avg_session_duration_sec', 'cta_clicks', 'lead_submits',
  'lead_conversion_rate', 'search_queries', 'search_zero',
  'top_competencies', 'top_cases', 'top_searches', 'top_filters'
];

function doGet() {
  return jsonOut({ ok: true, service: 'emplyflow-hub-analytics' });
}

function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) || '{}';
    var data = JSON.parse(raw);
    var events = data.events || (data.event_name ? [data] : []);
    if (!events.length) return jsonOut({ ok: false, error: 'no_events' });

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var rawSheet = ensureSheet_(ss, RAW_SHEET, RAW_HEADERS);
    var sessSheet = ensureSheet_(ss, SESSIONS_SHEET, SESSION_HEADERS);
    var visSheet = ensureSheet_(ss, VISITORS_SHEET, VISITOR_HEADERS);

    var rawRows = [];
    events.forEach(function (ev) {
      rawRows.push(flattenEvent_(ev));
      upsertSession_(sessSheet, ev);
      upsertVisitor_(visSheet, ev);
    });
    if (rawRows.length) {
      var start = rawSheet.getLastRow() + 1;
      rawSheet.getRange(start, 1, start + rawRows.length - 1, RAW_HEADERS.length).setValues(rawRows);
    }

    return jsonOut({ ok: true, written: rawRows.length });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

function flattenEvent_(ev) {
  var utm = ev.utm || {};
  var device = ev.device || {};
  var geo = ev.geo || {};
  var props = ev.props || {};
  return [
    ev.event_id || '',
    ev.event_at || new Date().toISOString(),
    ev.visitor_id || '',
    ev.session_id || '',
    ev.event_name || '',
    ev.path || '',
    ev.page_type || props.page_type || '',
    ev.competency_id || props.competency_id || '',
    ev.case_id || props.case_id || '',
    ev.referrer || '',
    ev.landing_page || props.landing_page || '',
    utm.utm_source || '',
    utm.utm_medium || '',
    utm.utm_campaign || '',
    utm.utm_content || '',
    utm.utm_term || '',
    device.device_type || '',
    device.os || '',
    device.browser || '',
    device.language || '',
    device.timezone || '',
    device.screen || '',
    device.viewport || '',
    geo.country || '',
    geo.region || '',
    geo.city || '',
    JSON.stringify(props),
    ev.first_seen_at || ''
  ];
}

function ensureSheet_(ss, name, headers) {
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function findRowByKey_(sheet, colIndex, key) {
  if (!key) return -1;
  var last = sheet.getLastRow();
  if (last < 2) return -1;
  var values = sheet.getRange(2, colIndex, last, colIndex).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]) === String(key)) return i + 2;
  }
  return -1;
}

function upsertSession_(sheet, ev) {
  var sid = ev.session_id;
  if (!sid) return;
  var row = findRowByKey_(sheet, 1, sid);
  var utm = ev.utm || {};
  var device = ev.device || {};
  var geo = ev.geo || {};
  var props = ev.props || {};
  var at = ev.event_at || new Date().toISOString();
  var isLead = ev.event_name === 'lead_submit_success' ? 'yes' : '';
  var comp = ev.competency_id || props.competency_id || '';
  var cse = ev.case_id || props.case_id || '';

  if (row < 0) {
    sheet.appendRow([
      sid,
      ev.visitor_id || '',
      at,
      at,
      0,
      ev.event_name === 'page_view' ? 1 : 0,
      1,
      ev.landing_page || props.landing_page || ev.path || '',
      ev.path || '',
      utm.utm_source || '',
      ev.referrer || '',
      geo.country || '',
      geo.city || '',
      device.device_type || '',
      isLead,
      comp,
      cse
    ]);
    return;
  }

  var started = sheet.getRange(row, 3).getValue();
  var pageviews = Number(sheet.getRange(row, 6).getValue() || 0);
  var eventsCount = Number(sheet.getRange(row, 7).getValue() || 0) + 1;
  if (ev.event_name === 'page_view') pageviews += 1;
  var startedMs = new Date(started).getTime();
  var endMs = new Date(at).getTime();
  var duration = isFinite(startedMs) && isFinite(endMs) ? Math.max(0, Math.round((endMs - startedMs) / 1000)) : 0;

  sheet.getRange(row, 4).setValue(at);
  sheet.getRange(row, 5).setValue(duration);
  sheet.getRange(row, 6).setValue(pageviews);
  sheet.getRange(row, 7).setValue(eventsCount);
  sheet.getRange(row, 9).setValue(ev.path || sheet.getRange(row, 9).getValue());
  if (isLead) sheet.getRange(row, 15).setValue('yes');
  if (comp) sheet.getRange(row, 16).setValue(comp);
  if (cse) sheet.getRange(row, 17).setValue(cse);
}

function upsertVisitor_(sheet, ev) {
  var vid = ev.visitor_id;
  if (!vid) return;
  var row = findRowByKey_(sheet, 1, vid);
  var utm = ev.utm || {};
  var device = ev.device || {};
  var geo = ev.geo || {};
  var at = ev.event_at || new Date().toISOString();
  var isLead = ev.event_name === 'lead_submit_success' ? 'yes' : '';

  if (row < 0) {
    sheet.appendRow([
      vid,
      ev.first_seen_at || at,
      at,
      1,
      1,
      utm.utm_source || '',
      utm.utm_source || '',
      geo.country || '',
      geo.city || '',
      device.device_type || '',
      isLead
    ]);
    return;
  }

  sheet.getRange(row, 3).setValue(at);
  var events = Number(sheet.getRange(row, 5).getValue() || 0) + 1;
  sheet.getRange(row, 5).setValue(events);
  if (utm.utm_source) sheet.getRange(row, 7).setValue(utm.utm_source);
  if (geo.country) sheet.getRange(row, 8).setValue(geo.country);
  if (geo.city) sheet.getRange(row, 9).setValue(geo.city);
  if (device.device_type) sheet.getRange(row, 10).setValue(device.device_type);
  if (isLead) sheet.getRange(row, 11).setValue('yes');
  if (ev.event_name === 'session_start') {
    var sessions = Number(sheet.getRange(row, 4).getValue() || 0) + 1;
    sheet.getRange(row, 4).setValue(sessions);
  }
}

/** Nightly rollup — add time-driven trigger in Apps Script UI */
function rollupDaily() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var raw = ensureSheet_(ss, RAW_SHEET, RAW_HEADERS);
  var daily = ensureSheet_(ss, DAILY_SHEET, DAILY_HEADERS);
  var last = raw.getLastRow();
  if (last < 2) return;

  var values = raw.getRange(2, 1, last, RAW_HEADERS.length).getValues();
  var byDate = {};

  values.forEach(function (row) {
    var at = row[1];
    var d = '';
    try {
      d = Utilities.formatDate(new Date(at), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    } catch (e) {
      d = String(at).slice(0, 10);
    }
    if (!byDate[d]) {
      byDate[d] = {
        users: {},
        newUsers: {},
        sessions: {},
        pageviews: 0,
        cta: 0,
        leads: 0,
        searches: 0,
        zero: 0,
        comps: {},
        cases: {},
        queries: {},
        filters: {},
        durations: []
      };
    }
    var b = byDate[d];
    var vid = row[2];
    var sid = row[3];
    var name = row[4];
    var comp = row[7];
    var cse = row[8];
    var props = {};
    try { props = JSON.parse(row[26] || '{}'); } catch (e2) {}

    if (vid) b.users[vid] = true;
    if (sid) b.sessions[sid] = true;
    if (name === 'page_view') b.pageviews++;
    if (name === 'cta_click') b.cta++;
    if (name === 'lead_submit_success') b.leads++;
    if (name === 'search_query') {
      b.searches++;
      var q = props.query || '';
      if (q) b.queries[q] = (b.queries[q] || 0) + 1;
    }
    if (name === 'search_zero_results') b.zero++;
    if (name === 'filter_apply') {
      var fk = (props.filter_key || '') + '=' + (props.filter_value || '');
      if (fk !== '=') b.filters[fk] = (b.filters[fk] || 0) + 1;
    }
    if (comp) b.comps[comp] = (b.comps[comp] || 0) + 1;
    if (cse) b.cases[cse] = (b.cases[cse] || 0) + 1;
    if (name === 'page_exit' && props.time_on_page_ms) b.durations.push(Number(props.time_on_page_ms) / 1000);
    if (name === 'session_start' && vid) b.newUsers[vid] = true;
  });

  Object.keys(byDate).sort().forEach(function (date) {
    var b = byDate[date];
    var users = Object.keys(b.users).length;
    var sessions = Object.keys(b.sessions).length;
    var avg = 0;
    if (b.durations.length) {
      avg = Math.round(b.durations.reduce(function (a, x) { return a + x; }, 0) / b.durations.length);
    }
    var conv = users ? Math.round((b.leads / users) * 1000) / 10 : 0;
    var existing = findRowByKey_(daily, 1, date);
    var rowData = [
      date,
      users,
      Object.keys(b.newUsers).length,
      sessions,
      b.pageviews,
      avg,
      b.cta,
      b.leads,
      conv,
      b.searches,
      b.zero,
      topN_(b.comps, 5),
      topN_(b.cases, 5),
      topN_(b.queries, 5),
      topN_(b.filters, 5)
    ];
    if (existing > 0) {
      daily.getRange(existing, 1, 1, DAILY_HEADERS.length).setValues([rowData]);
    } else {
      daily.appendRow(rowData);
    }
  });
}

function topN_(map, n) {
  return Object.keys(map)
    .map(function (k) { return { k: k, v: map[k] }; })
    .sort(function (a, b) { return b.v - a.v; })
    .slice(0, n)
    .map(function (x) { return x.k + ':' + x.v; })
    .join('; ');
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
