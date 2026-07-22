#!/usr/bin/env python3
"""One-shot transform: hash SPA → /hub/ History API + external hub-data.js."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
path = ROOT / "index.html"
html = path.read_text()

html = html.replace(
    """<!DOCTYPE html>
<!-- ============================================================================
  EmplyFlow Competency Hub — SPA (hash-routing, vanilla HTML/CSS/JS)
  ----------------------------------------------------------------------------
  КАК ВСТАВИТЬ В TILDA (финальная версия — один файл):
    Блок «HTML-код» (T123), на всю ширину контейнера. Весь код (CSS+JS+данные)
    будет встроен в один файл — без внешних зависимостей, кроме шрифта Manrope
    (Google Fonts). Роутинг — через hash (#/…), сервер настраивать не нужно.
  ГДЕ ПРАВИТЬ КОНТЕНТ: объект window.HUB_DATA (в финале — в <script> в начале).
  SEO / вынос на отдельные страницы Tilda: см. комментарии [SEO] и [REUSE] ниже.
  ============================================================================ -->""",
    """<!DOCTYPE html>
<!-- ============================================================================
  EmplyFlow Competency Hub — path routing under /hub/ (History API)
  ----------------------------------------------------------------------------
  Контент: hub-data.js (window.HUB_DATA). Публичный URL: https://emplyflow.ru/hub/
  Prerender: node scripts/prerender-hub.mjs
  ============================================================================ -->""",
)

if 'rel="canonical"' not in html:
    html = html.replace(
        '<meta name="description" content="Готовые модели компетенций, поведенческие индикаторы и рабочие ситуации для оценки сотрудников и руководителей.">',
        """<meta name="description" content="Готовые модели компетенций, поведенческие индикаторы и рабочие ситуации для оценки сотрудников и руководителей.">
<link rel="canonical" href="https://emplyflow.ru/hub/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="EmplyFlow Hub">
<meta property="og:url" content="https://emplyflow.ru/hub/">
<meta property="og:title" content="Библиотека компетенций и кейсов EmplyFlow">
<meta property="og:description" content="Готовые модели компетенций, поведенческие индикаторы и рабочие ситуации для оценки сотрудников и руководителей.">
<meta name="twitter:card" content="summary_large_image">""",
    )

# --- Router / helpers BEFORE generic #/ replacements ---
old_router = """  /* ======================= ROUTER ======================= */
  function setMeta(title, desc){
    document.title=title;
    var m=document.querySelector('meta[name="description"]'); if(m&&desc)m.setAttribute('content',desc);
  }
  function parseHash(){
    var h=location.hash.replace(/^#/,'')||'/competencies';
    var qi=h.indexOf('?'); var path=qi<0?h:h.slice(0,qi); var query=qi<0?'':h.slice(qi+1);
    return {parts:path.split('/').filter(Boolean), query:query};
  }
  var suppressRoute=false;
  function route(){
    if(suppressRoute){suppressRoute=false;return;}
    var r=parseHash(); var p=r.parts;
    // highlight nav
    document.querySelectorAll('#navLinks a, #mnavLinks a').forEach(function(a){a.classList.remove('on');});
    if(p[0]==='competencies'&&!p[1]) setNav('competencies');
    else if(p[0]==='cases') setNav('cases');
    else if(p[1]==='methodology') setNav('methodology');

    if(p[0]==='competencies'&&!p[1]) renderHome();
    else if(p[0]==='competencies'&&p[1]==='methodology') renderMethodology();
    else if(p[0]==='competencies'&&p[1]==='request') { renderHome(); openLead({source:'route_request'}); }
    else if(p[0]==='competencies'&&p[1]) renderCompetency(p[1]);
    else if(p[0]==='cases'&&p[1]) renderCase(p[1]);
    else if(p[0]==='cases') renderCases(r.query);
    else renderHome();

    if(HA && HA.pageView){
      var extra={};
      if(p[0]==='cases'&&p[1]&&CASE[p[1]]){
        extra.case_id=p[1];
        extra.competency_id=CASE[p[1]].comp||'';
        extra.role=CASE[p[1]].role||'';
        extra.difficulty=CASE[p[1]].difficulty||'';
        extra.duration=CASE[p[1]].duration||'';
      }
      HA.pageView(extra);
    }

    window.scrollTo(0,0);
  }
  function setNav(n){
    document.querySelectorAll('#navLinks a[data-nav="'+n+'"], #mnavLinks a[data-nav="'+n+'"]').forEach(function(a){a.classList.add('on');});
  }

  /* in-page anchor scroll (e.g. #compCatalog) without breaking router */
  function go(hash){
    if(hash.charAt(0)==='#'&&hash.charAt(1)!=='/'){ // in-page anchor
      var el=document.getElementById(hash.slice(1)); if(el){window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-70,behavior:'smooth'});} return;
    }
    if(location.hash===hash) route(); else location.hash=hash;
  }"""

new_router = """  /* ======================= ROUTER (path under /hub) ======================= */
  var BASE='/hub';
  var ORIGIN='https://emplyflow.ru';
  var suppressRoute=false;

  function setMeta(title, desc){
    document.title=title;
    var m=document.querySelector('meta[name="description"]'); if(m&&desc)m.setAttribute('content',desc);
    var clean=(location.pathname||BASE+'/').split('?')[0];
    if(clean.indexOf(BASE)!==0) clean=BASE+'/';
    if(clean!==BASE+'/' && clean.slice(-1)==='/') clean=clean.slice(0,-1);
    if(clean===BASE) clean=BASE+'/';
    var url=ORIGIN+clean;
    var link=document.querySelector('link[rel="canonical"]');
    if(!link){link=document.createElement('link');link.rel='canonical';document.head.appendChild(link);}
    link.href=url;
    var ogu=document.querySelector('meta[property="og:url"]'); if(ogu)ogu.setAttribute('content',url);
    var ogt=document.querySelector('meta[property="og:title"]'); if(ogt)ogt.setAttribute('content',title);
    var ogd=document.querySelector('meta[property="og:description"]'); if(ogd&&desc)ogd.setAttribute('content',desc);
  }

  function hashToPath(h){
    h=(h||'').replace(/^#/, '');
    if(!h || h.charAt(0)!=='/') h='/'+h;
    if(h.indexOf('/competencies/methodology')===0) return BASE+'/methodology'+h.slice('/competencies/methodology'.length);
    if(h==='/competencies' || h==='/competencies/') return BASE+'/';
    return BASE+h;
  }

  function parsePath(){
    var path=location.pathname || '/';
    if(path.indexOf(BASE)===0) path=path.slice(BASE.length) || '/';
    else path='/';
    if(path.length>1 && path.slice(-1)==='/') path=path.slice(0,-1);
    var query=(location.search||'').replace(/^\\?/, '');
    var parts=path.split('/').filter(Boolean);
    if(parts[0]==='competencies' && parts[1]==='methodology') parts=['methodology'];
    return {parts:parts, query:query, path:path};
  }

  function route(){
    if(suppressRoute){suppressRoute=false;return;}
    var r=parsePath(); var p=r.parts;
    document.querySelectorAll('#navLinks a, #mnavLinks a').forEach(function(a){a.classList.remove('on');});
    if(!p.length || (p[0]==='competencies'&&!p[1])) setNav('competencies');
    else if(p[0]==='cases') setNav('cases');
    else if(p[0]==='methodology') setNav('methodology');

    if(!p.length || (p[0]==='competencies'&&!p[1])) renderHome();
    else if(p[0]==='methodology') renderMethodology();
    else if(p[0]==='competencies'&&p[1]==='request'){ renderHome(); openLead({source:'route_request'}); }
    else if(p[0]==='competencies'&&p[1]) renderCompetency(p[1]);
    else if(p[0]==='cases'&&p[1]) renderCase(p[1]);
    else if(p[0]==='cases') renderCases(r.query);
    else renderHome();

    if(HA && HA.pageView){
      var extra={};
      if(p[0]==='cases'&&p[1]&&CASE[p[1]]){
        extra.case_id=p[1];
        extra.competency_id=CASE[p[1]].comp||'';
        extra.role=CASE[p[1]].role||'';
        extra.difficulty=CASE[p[1]].difficulty||'';
        extra.duration=CASE[p[1]].duration||'';
      }
      HA.pageView(extra);
    }
    window.scrollTo(0,0);
  }
  function setNav(n){
    document.querySelectorAll('#navLinks a[data-nav="'+n+'"], #mnavLinks a[data-nav="'+n+'"]').forEach(function(a){a.classList.add('on');});
  }

  function go(to){
    if(!to) return;
    if(to.charAt(0)==='#' && to.charAt(1)!=='/'){
      var el=document.getElementById(to.slice(1));
      if(el){window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-70,behavior:'smooth'});}
      return;
    }
    if(to.charAt(0)==='#') to=hashToPath(to);
    if(to.indexOf('http')===0){ location.href=to; return; }
    if(to.charAt(0)!=='/') to=BASE+'/'+to;
    var cur=location.pathname+(location.search||'');
    var next=to;
    if(cur===next || cur.replace(/\\/$/,'')===next.replace(/\\/$/,'')){ route(); return; }
    history.pushState(null, '', next);
    route();
  }"""

if old_router not in html:
    sys.exit("old router block not found")
html = html.replace(old_router, new_router)

old_wch = """  function writeCatHash(){
    var parts=[]; CAT_KEYS.forEach(function(k){if(catState[k].length)parts.push(k+'='+catState[k].join(','));});
    if(catSort!=='popular')parts.push('sort='+catSort);
    var h='#/cases'+(parts.length?'?'+parts.join('&'):'');
    if(location.hash!==h){suppressRoute=true;location.hash=h;}
  }"""
new_wch = """  function writeCatHash(){
    var parts=[]; CAT_KEYS.forEach(function(k){if(catState[k].length)parts.push(k+'='+catState[k].join(','));});
    if(catSort!=='popular')parts.push('sort='+catSort);
    var next=BASE+'/cases'+(parts.length?'?'+parts.join('&'):'');
    var cur=location.pathname+(location.search||'');
    if(cur!==next){suppressRoute=true; history.replaceState(null, '', next);}
  }"""
if old_wch not in html:
    sys.exit("writeCatHash not found")
html = html.replace(old_wch, new_wch)

old_click = """    var anchor=e.target.closest('a[href^="#"]'); if(anchor){
      var hh=anchor.getAttribute('href');
      if(hh && hh.indexOf('#/')===0){
        haTrack('nav_click',{href:hh,nav:anchor.getAttribute('data-nav')||''});
      }
      if(hh.charAt(1)!=='/'){e.preventDefault();go(hh);}return;
    }"""
new_click = """    var anchor=e.target.closest('a[href]'); if(anchor){
      var hh=anchor.getAttribute('href')||'';
      if(hh.indexOf(BASE)===0 || hh.indexOf('#/')===0){
        e.preventDefault();
        haTrack('nav_click',{href:hh,nav:anchor.getAttribute('data-nav')||''});
        go(hh);
        return;
      }
      if(hh.charAt(0)==='#' && hh.charAt(1)!=='/'){ e.preventDefault(); go(hh); return; }
    }"""
if old_click not in html:
    sys.exit("anchor click not found")
html = html.replace(old_click, new_click)

old_boot = """  window.addEventListener('hashchange',route);
  if(HA && HA.init) HA.init({endpoint: window.HUB_ANALYTICS_ENDPOINT || ''});
  route();
})();"""
new_boot = """  if(location.hash && location.hash.indexOf('#/')===0){
    history.replaceState(null, '', hashToPath(location.hash));
  }
  window.addEventListener('popstate', route);
  if(HA && HA.init) HA.init({endpoint: window.HUB_ANALYTICS_ENDPOINT || ''});
  route();
})();"""
if old_boot not in html:
    sys.exit("boot not found")
html = html.replace(old_boot, new_boot)

# Remove embedded HUB_DATA
m = re.search(r"<script>\n/\* ====== ВСТРОЕННЫЕ ДАННЫЕ.*?</script>\n", html, re.S)
if not m:
    sys.exit("HUB_DATA script block not found")
html = html[: m.start()] + '<script src="/hub/hub-data.js"></script>\n' + html[m.end() :]
html = html.replace(
    '<script src="hub-analytics.js"></script>',
    '<script src="/hub/hub-analytics.js"></script>',
)

# HTML + JS path rewrites (order matters)
html = html.replace("#/competencies/methodology", "/hub/methodology")
html = html.replace("#/competencies/", "/hub/competencies/")
html = html.replace("#/cases/", "/hub/cases/")
html = html.replace("#/cases?", "/hub/cases?")
html = html.replace("'#/cases'", "'/hub/cases'")
html = html.replace('"#/cases"', '"/hub/cases"')
html = html.replace("'#/competencies'", "'/hub/'")
html = html.replace('"#/competencies"', '"/hub/"')
html = html.replace("#/competencies", "/hub/")
html = html.replace('href="#/cases"', 'href="/hub/cases"')
html = html.replace("href='#/cases'", "href='/hub/cases'")

leftover = re.findall(r"#/[a-zA-Z]", html)
if leftover:
    print("WARN leftover hash routes:", leftover[:30], "count", len(leftover))

path.write_text(html)
(ROOT / "EmplyFlow-Competency-Hub.html").write_text(html)
print("OK", path, "bytes", len(html))
