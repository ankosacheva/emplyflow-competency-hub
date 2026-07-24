#!/usr/bin/env node
/**
 * Prerender EmplyFlow Hub pages under dist/hub/ for SEO (HTML without JS).
 * Usage: node scripts/prerender-hub.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import {
  ORIGIN,
  BASE,
  SITE_NAME,
  THEME_COLOR,
  INDEXNOW_KEY,
  FILTER_KEYS,
  FILTER_LABELS,
} from './seo-config.mjs';
import {
  esc,
  pageUrl,
  createSolidPng,
  faviconSvg,
  titleHome,
  titleCases,
  titleCompetency,
  titleCase,
  titleMethodology,
  titleFilter,
  descHome,
  descCases,
  descCompetency,
  descCase,
  descMethodology,
  descFilter,
  applyHead,
  orgJsonLd,
  websiteJsonLd,
  collectionJsonLd,
  competencyJsonLd,
  caseJsonLd,
  breadcrumbsJsonLd,
} from './seo-helpers.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'dist', 'hub');
const BUILD_TIME = new Date().toISOString();

function loadHubData() {
  const code = fs.readFileSync(path.join(ROOT, 'hub-data.js'), 'utf8');
  const ctx = { window: {}, console };
  vm.runInNewContext(code, ctx, { filename: 'hub-data.js' });
  if (!ctx.window.HUB_DATA) throw new Error('HUB_DATA missing');
  return ctx.window.HUB_DATA;
}

function readShell() {
  return fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
}

function writePage(relPath, html) {
  const full = path.join(OUT, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
  console.log('write', path.relative(ROOT, full));
}

function injectMain(html, bodyHtml) {
  return html.replace(
    /<main id="view"><!-- routed content --><\/main>/,
    `<main id="view">${bodyHtml}</main>`
  );
}

function filterCases(D, key, val) {
  return D.cases.filter((c) => {
    if (key === 'competency') return c.comp === val;
    if (key === 'industry') return (c.industry || []).indexOf(val) >= 0;
    if (key === 'duration') return String(c.duration) === String(val);
    return String(c[key]) === String(val);
  });
}

function valLabel(D, key, val) {
  if (key === 'competency') {
    const c = D.competencies.find((x) => x.id === val);
    return c ? c.title : val;
  }
  const o = (D.filters[key] || []).find((x) => String(x[0]) === String(val));
  return o ? o[1] : val;
}

function homeBody(D) {
  const comps = D.competencies
    .map(
      (c) => `<article>
      <h2><a href="${BASE}/competencies/${esc(c.id)}">${esc(c.title)}</a></h2>
      <p>${esc(c.short || c.subtitle)}</p>
    </article>`
    )
    .join('\n');
  return `<div class="wrap">
    <h1>Библиотека компетенций и кейсов EmplyFlow</h1>
    <p>Готовые модели компетенций, поведенческие индикаторы и рабочие ситуации для оценки сотрудников и руководителей.</p>
    <p><a href="${BASE}/cases">Каталог кейсов</a> · <a href="${BASE}/methodology">Методика</a></p>
    <section><h2>Компетенции</h2>${comps}</section>
  </div>`;
}

function competencyBody(c) {
  const inds = (c.indicators || [])
    .map((i) => `<li><strong>${esc(i.n)}. ${esc(i.title)}</strong> — ${esc(i.short || i.desc || '')}</li>`)
    .join('');
  const why = (c.why || []).map((w) => `<li>${esc(w)}</li>`).join('');
  return `<div class="wrap">
    <nav><a href="${BASE}/">Библиотека</a> → ${esc(c.title)}</nav>
    <h1>${esc(c.title)}</h1>
    <p>${esc(c.subtitle || c.short || '')}</p>
    ${c.full ? `<p>${esc(c.full)}</p>` : ''}
    ${why ? `<h2>Зачем оценивать</h2><ul>${why}</ul>` : ''}
    ${inds ? `<h2>Как оценивать поведение по индикаторам</h2><ul>${inds}</ul>` : ''}
    <p><a href="${BASE}/cases?competency=${esc(c.id)}">Кейсы по компетенции</a></p>
  </div>`;
}

function casesIndexBody(D, cases, heading, intro) {
  const list = cases
    .map((c) => `<li><a href="${BASE}/cases/${esc(c.id)}">${esc(c.title)}</a> — ${esc(c.sd)}</li>`)
    .join('\n');
  return `<div class="wrap">
    <nav><a href="${BASE}/">Библиотека</a> → Кейсы</nav>
    <h1>${esc(heading)}</h1>
    <p>${esc(intro)}</p>
    <ul>${list}</ul>
  </div>`;
}

function caseBody(c, comp) {
  const inds = (c.indicators || [])
    .map((iN) => {
      const ind = (comp.indicators || []).find((x) => x.n === iN);
      return `<li>${esc(iN)}. ${esc(ind ? ind.title : 'Индикатор')}</li>`;
    })
    .join('');
  return `<div class="wrap">
    <nav><a href="${BASE}/">Библиотека</a> → <a href="${BASE}/competencies/${esc(comp.id)}">${esc(comp.title)}</a> → ${esc(c.title)}</nav>
    <h1>${esc(c.title)}</h1>
    <p>${esc(c.sd)}</p>
    <p>Компетенция: <a href="${BASE}/competencies/${esc(comp.id)}">${esc(comp.title)}</a>. Код: ${esc(c.code || '')}.</p>
    ${inds ? `<h2>Что проверяет кейс</h2><ul>${inds}</ul>` : ''}
    <p><a href="${BASE}/cases">Все кейсы</a></p>
  </div>`;
}

function methodologyBody() {
  return `<div class="wrap">
    <nav><a href="${BASE}/">Библиотека</a> → Методика</nav>
    <h1>Методика EmplyFlow — как устроена оценка компетенций</h1>
    <p>Компетенция → поведенческие индикаторы → рабочая ситуация. Библиотека открывает модели и кейсы; расчёт баллов и эталоны остаются на платформе.</p>
    <h2>Цепочка оценки</h2>
    <ol>
      <li>Компетенция описывает наблюдаемое поведение в работе.</li>
      <li>Индикаторы детализируют, что именно видно в кейсе.</li>
      <li>Рабочая ситуация даёт материал для оценки без знания «правильного ответа» из интернета.</li>
    </ol>
    <p><a href="${BASE}/">К компетенциям</a> · <a href="${BASE}/cases">К кейсам</a></p>
  </div>`;
}

function buildSitemap(urls) {
  const body = urls
    .map(
      (u) => `  <url>
    <loc>${esc(u.loc)}</loc>
    <lastmod>${esc(u.lastmod || BUILD_TIME.slice(0, 10))}</lastmod>
  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function buildRobots() {
  return `User-agent: *
Allow: /hub/

User-agent: Yandex
Allow: /hub/
Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&ysclid&gclid&from&ref /hub/

User-agent: GPTBot
Allow: /hub/

User-agent: ChatGPT-User
Allow: /hub/

User-agent: OAI-SearchBot
Allow: /hub/

User-agent: PerplexityBot
Allow: /hub/

User-agent: ClaudeBot
Allow: /hub/

User-agent: Claude-SearchBot
Allow: /hub/

User-agent: Google-Extended
Allow: /hub/

User-agent: Applebot-Extended
Allow: /hub/

User-agent: YandexGPT
Allow: /hub/

Disallow: /hub/SEO_SETUP_REPORT.md

Sitemap: ${ORIGIN}${BASE}/sitemap.xml
`;
}

function buildLlmsTxt(D) {
  const lines = [
    '# EmplyFlow Competency Hub',
    'Библиотека компетенций и кейсов для оценки персонала EmplyFlow (Россия, HR / T&D).',
    '',
    '## Разделы',
    `- Главная: ${pageUrl('/')}`,
    `- Каталог кейсов (${D.cases.length}): ${pageUrl('/cases')}`,
    `- Методика: ${pageUrl('/methodology')}`,
    '',
    '## Компетенции',
  ];
  D.competencies.forEach((c) => {
    lines.push(`- ${c.title}: ${pageUrl(`/competencies/${c.id}`)}`);
  });
  lines.push('', '## Контакты', `- ${ORIGIN}`, '- hello@emplyflow.ru', '');
  return lines.join('\n');
}

function buildManifest() {
  return JSON.stringify(
    {
      name: `${SITE_NAME} Competency Hub`,
      short_name: 'EmplyFlow Hub',
      description: 'Библиотека компетенций и кейсов для оценки персонала',
      start_url: `${BASE}/`,
      scope: `${BASE}/`,
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: THEME_COLOR,
      lang: 'ru',
      icons: [
        { src: `${BASE}/assets/favicon-192.png`, sizes: '192x192', type: 'image/png' },
        { src: `${BASE}/assets/apple-touch-icon.png`, sizes: '180x180', type: 'image/png' },
      ],
    },
    null,
    2
  );
}

function writeAssets() {
  const assets = path.join(OUT, 'assets');
  const srcAssets = path.join(ROOT, 'assets', 'seo');
  fs.mkdirSync(assets, { recursive: true });
  fs.writeFileSync(path.join(assets, 'favicon.svg'), faviconSvg());
  const brand = [74, 59, 255];
  fs.writeFileSync(path.join(assets, 'favicon-16.png'), createSolidPng(16, 16, ...brand));
  fs.writeFileSync(path.join(assets, 'favicon-32.png'), createSolidPng(32, 32, ...brand));
  fs.writeFileSync(path.join(assets, 'apple-touch-icon.png'), createSolidPng(180, 180, ...brand));
  fs.writeFileSync(path.join(assets, 'favicon-192.png'), createSolidPng(192, 192, ...brand));
  fs.copyFileSync(path.join(assets, 'favicon-32.png'), path.join(assets, 'favicon.ico'));

  for (const name of ['og-default.png']) {
    const src = path.join(srcAssets, name);
    const dest = path.join(assets, name);
    if (fs.existsSync(src)) fs.copyFileSync(src, dest);
    else fs.writeFileSync(dest, createSolidPng(1200, 630, ...brand));
  }
  fs.copyFileSync(path.join(assets, 'og-default.png'), path.join(assets, 'og-article.png'));
}

function filterPrerenderPath(key, val) {
  return `cases/_pf/${key}/${val}/index.html`;
}

function buildReport(metaPages, sitemapUrls, noindexPatterns) {
  return `# SEO Setup Report — EmplyFlow Competency Hub

Generated: ${BUILD_TIME}
Canonical origin: ${ORIGIN}${BASE}/

## Pre-requisite: path routing + prerender

- History API routing under \`${BASE}/\` in \`index.html\`
- Prerender build: \`node scripts/prerender-hub.mjs\` → \`dist/hub/\`
- Hash URLs redirect via \`hash-redirect.html\`

## Pages (${metaPages.length})

| URL | Title |
|-----|-------|
${metaPages.map((p) => `| ${p.url} | ${p.title.replace(/\|/g, '\\|')} |`).join('\n')}

## robots.txt

Подключён: \`${ORIGIN}${BASE}/robots.txt\` (генерируется при билде).

## sitemap.xml

Подключён: \`${ORIGIN}${BASE}/sitemap.xml\`, URL: ${sitemapUrls.length}.

## Head tags

- \`<html lang="ru">\` — да
- Уникальные \`<title>\` и \`<meta description>\` — да (prerender + client \`setMeta\`)
- Canonical на \`${ORIGIN}${BASE}/...\` — да
- Open Graph (site_name, locale, type, image) — да
- Twitter Card summary_large_image — да
- Favicon + manifest + theme-color — \`${BASE}/assets/\`, \`${BASE}/manifest.webmanifest\`

## noindex, follow

Применяется в SPA при ≥2 активных фильтрах каталога (\`?role=head&industry=it\` и т.п.).

Prerender для комбинаций не генерируется. Паттерны:

${noindexPatterns.map((p) => `- \`${p}\``).join('\n')}

## JSON-LD

- Organization + WebSite — главная
- CollectionPage + ItemList — каталоги
- DefinedTerm + DefinedTermSet — компетенции
- LearningResource — кейсы
- BreadcrumbList — внутренние страницы

Валидация: Google Rich Results Test, Schema.org Validator, Яндекс Валидатор — выполнить после деплоя.

## Google Search Console

- DNS TXT для Domain property — подготовить у reg.ru
- Meta \`google-site-verification\` — placeholder \`__GSC_TOKEN__\` в \`<head>\`

## Яндекс Вебмастер

- Meta \`yandex-verification\` — placeholder \`__YV_TOKEN__\`
- robots.txt + sitemap — готовы
- IndexNow key file: \`${ORIGIN}${BASE}/indexnow-${INDEXNOW_KEY}.txt\`

## Яндекс.Метрика

- Placeholder \`__YM_ID__\` в \`index.html\`
- Цели (настроить в интерфейсе): \`click_to_emplyflow\`, \`lead_modal_open\`, \`lead_submit_success\`, \`template_download\`

## llms.txt

\`${ORIGIN}${BASE}/llms.txt\`

## После миграции

1. Деплой \`dist/hub/\` на VPS, nginx по \`docs/nginx-emplyflow-hub.conf\`
2. 301 с \`hub.emplyflow.ru\` → \`${ORIGIN}${BASE}/\`
3. Подставить токены GSC / Вебмастер / Метрика
4. Submit sitemap, первый IndexNow: \`node scripts/indexnow-ping.mjs\`
5. curl-проверки под YandexBot, Googlebot, GPTBot
`;
}

function main() {
  const D = loadHubData();
  const shell = readShell();
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  for (const f of ['hub-data.js', 'hub-analytics.js']) {
    fs.copyFileSync(path.join(ROOT, f), path.join(OUT, f));
  }
  writeAssets();

  const sitemapUrls = [];
  const metaPages = [];
  const caseCount = D.cases.length;
  const byId = Object.fromEntries(D.competencies.map((c) => [c.id, c]));

  function addPage(url, title, description, bodyHtml, headMeta) {
    let page = applyHead(shell, {
      title,
      description,
      canonical: url,
      ...headMeta,
    });
    page = injectMain(page, bodyHtml);
    return page;
  }

  // home
  const homeUrl = pageUrl('/');
  const homeTitle = titleHome();
  const homeDesc = descHome();
  let page = addPage(homeUrl, homeTitle, homeDesc, homeBody(D), {
    ogType: 'website',
    jsonLd: [orgJsonLd(), websiteJsonLd()],
  });
  writePage('index.html', page);
  writePage('competencies/index.html', page);
  sitemapUrls.push({ loc: homeUrl });
  sitemapUrls.push({ loc: pageUrl('/competencies') });
  metaPages.push({ url: homeUrl, title: homeTitle, description: homeDesc });

  // methodology
  const methUrl = pageUrl('/methodology');
  const methTitle = titleMethodology();
  const methDesc = descMethodology();
  page = addPage(methUrl, methTitle, methDesc, methodologyBody(), {
    ogType: 'website',
    jsonLd: [
      breadcrumbsJsonLd([
        { name: 'Библиотека', url: homeUrl },
        { name: 'Методика', url: methUrl },
      ]),
    ],
  });
  writePage('methodology/index.html', page);
  sitemapUrls.push({ loc: methUrl });
  metaPages.push({ url: methUrl, title: methTitle, description: methDesc });

  // competencies
  for (const c of D.competencies) {
    const url = pageUrl(`/competencies/${c.id}`);
    const t = titleCompetency(c.title);
    const d = descCompetency(c);
    page = addPage(url, t, d, competencyBody(c), {
      ogType: 'article',
      ogImage: `${ORIGIN}${BASE}/assets/og-default.png`,
      jsonLd: competencyJsonLd(c),
    });
    writePage(`competencies/${c.id}/index.html`, page);
    sitemapUrls.push({ loc: url });
    metaPages.push({ url, title: t, description: d });
  }

  // cases index
  const casesUrl = pageUrl('/cases');
  const casesTitle = titleCases(caseCount);
  const casesDesc = descCases(caseCount);
  const caseItems = D.cases.map((c) => ({
    url: pageUrl(`/cases/${c.id}`),
    name: c.title,
  }));
  page = addPage(casesUrl, casesTitle, casesDesc, casesIndexBody(D, D.cases, 'Каталог кейсов EmplyFlow', `${caseCount} рабочих ситуаций по компетенциям для оценки сотрудников и руководителей.`), {
    ogType: 'website',
    jsonLd: collectionJsonLd('Каталог кейсов EmplyFlow', casesUrl, caseItems),
  });
  writePage('cases/index.html', page);
  sitemapUrls.push({ loc: casesUrl });
  metaPages.push({ url: casesUrl, title: casesTitle, description: casesDesc });

  // single-filter landing pages (prerender at cases/_pf/; canonical = ?key=val)
  for (const key of FILTER_KEYS) {
    const opts =
      key === 'competency'
        ? D.competencies.map((c) => [c.id, c.title])
        : D.filters[key] || [];
    for (const [val, label] of opts) {
      const matched = filterCases(D, key, val);
      if (!matched.length) continue;
      const q = `${key}=${encodeURIComponent(val)}`;
      const url = pageUrl('/cases', q);
      const t = titleFilter(FILTER_LABELS[key], label);
      const d = descFilter(FILTER_LABELS[key], label, matched.length);
      const heading = `Кейсы: ${label}`;
      const intro = `${matched.length} рабочих ситуаций по фильтру «${label}».`;
      page = addPage(url, t, d, casesIndexBody(D, matched, heading, intro), {
        ogType: 'website',
        jsonLd: collectionJsonLd(heading, url, matched.map((c) => ({ url: pageUrl(`/cases/${c.id}`), name: c.title }))),
      });
      writePage(filterPrerenderPath(key, val), page);
      sitemapUrls.push({ loc: url });
      metaPages.push({ url, title: t, description: d });
    }
  }

  // cases
  for (const c of D.cases) {
    const comp = byId[c.comp] || { id: c.comp, title: c.comp, indicators: [] };
    const url = pageUrl(`/cases/${c.id}`);
    const t = titleCase(c.title, comp.title);
    const d = descCase(c, comp);
    page = addPage(url, t, d, caseBody(c, comp), {
      ogType: 'article',
      ogImage: `${ORIGIN}${BASE}/assets/og-default.png`,
      jsonLd: caseJsonLd(c, comp),
    });
    writePage(`cases/${c.id}/index.html`, page);
    sitemapUrls.push({ loc: url });
    metaPages.push({ url, title: t, description: d });
  }

  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), buildSitemap(sitemapUrls));
  fs.writeFileSync(path.join(OUT, 'robots.txt'), buildRobots());
  fs.writeFileSync(path.join(OUT, 'llms.txt'), buildLlmsTxt(D));
  fs.writeFileSync(path.join(OUT, 'manifest.webmanifest'), buildManifest());
  fs.writeFileSync(path.join(OUT, `indexnow-${INDEXNOW_KEY}.txt`), INDEXNOW_KEY);

  const report = buildReport(metaPages, sitemapUrls, [
    `${ORIGIN}${BASE}/cases?role=head&industry=it`,
    `${ORIGIN}${BASE}/cases?competency=ai-readiness&role=spec`,
    'Любой URL с ≥2 активными значениями фильтров в SPA',
  ]);
  fs.writeFileSync(path.join(ROOT, 'SEO_SETUP_REPORT.md'), report);
  fs.writeFileSync(path.join(OUT, 'SEO_SETUP_REPORT.md'), report);

  console.log('sitemap urls', sitemapUrls.length);
  console.log('pages meta', metaPages.length);
  console.log('done →', OUT);
}

main();
