#!/usr/bin/env node
/**
 * Prerender EmplyFlow Hub pages under dist/hub/ for SEO (HTML without JS).
 * Usage: node scripts/prerender-hub.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import vm from 'vm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'dist', 'hub');
const ORIGIN = 'https://emplyflow.ru';
const BASE = '/hub';

function loadHubData() {
  const code = fs.readFileSync(path.join(ROOT, 'hub-data.js'), 'utf8');
  const ctx = { window: {}, console };
  vm.runInNewContext(code, ctx, { filename: 'hub-data.js' });
  if (!ctx.window.HUB_DATA) throw new Error('HUB_DATA missing');
  return ctx.window.HUB_DATA;
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function readShell() {
  return fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
}

function setHead(html, { title, description, canonical }) {
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${esc(description)}">`
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${esc(canonical)}">`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*">/,
    `<meta property="og:url" content="${esc(canonical)}">`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${esc(title)}">`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${esc(description)}">`
  );
  return html;
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
    ${inds ? `<h2>Поведенческие индикаторы</h2><ul>${inds}</ul>` : ''}
    <p><a href="${BASE}/cases?competency=${esc(c.id)}">Кейсы по компетенции</a></p>
  </div>`;
}

function casesIndexBody(D) {
  const list = D.cases
    .map(
      (c) => `<li><a href="${BASE}/cases/${esc(c.id)}">${esc(c.title)}</a> — ${esc(c.sd)}</li>`
    )
    .join('\n');
  return `<div class="wrap">
    <nav><a href="${BASE}/">Библиотека</a> → Кейсы</nav>
    <h1>Каталог кейсов EmplyFlow</h1>
    <p>40 рабочих ситуаций по компетенциям для оценки сотрудников и руководителей.</p>
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
    <loc>${esc(u)}</loc>
    <changefreq>weekly</changefreq>
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

# AI crawlers
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

User-agent: Yandex
Allow: /hub/
Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&ysclid&gclid&from&ref /hub/

Sitemap: ${ORIGIN}${BASE}/sitemap.xml
`;
}

function main() {
  const D = loadHubData();
  const shell = readShell();
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  // copy static assets
  for (const f of ['hub-data.js', 'hub-analytics.js']) {
    fs.copyFileSync(path.join(ROOT, f), path.join(OUT, f));
  }

  const urls = [`${ORIGIN}${BASE}/`];

  // home
  let page = setHead(shell, {
    title: 'Библиотека компетенций и кейсов EmplyFlow',
    description:
      'Готовые модели компетенций, поведенческие индикаторы и рабочие ситуации для оценки сотрудников и руководителей.',
    canonical: `${ORIGIN}${BASE}/`,
  });
  page = injectMain(page, homeBody(D));
  writePage('index.html', page);

  // also /competencies/ as alias home for try_files
  writePage('competencies/index.html', page);
  urls.push(`${ORIGIN}${BASE}/competencies`);

  // methodology
  page = setHead(shell, {
    title: 'Методика EmplyFlow — как устроена оценка компетенций',
    description:
      'Компетенция → поведенческие индикаторы → рабочая ситуация. Что открыто в библиотеке и что остаётся на платформе.',
    canonical: `${ORIGIN}${BASE}/methodology`,
  });
  page = injectMain(page, methodologyBody());
  writePage('methodology/index.html', page);
  urls.push(`${ORIGIN}${BASE}/methodology`);

  // competencies
  for (const c of D.competencies) {
    const title = `${c.title} — компетенция · EmplyFlow`;
    const description = c.subtitle || c.short || c.title;
    page = setHead(shell, {
      title,
      description,
      canonical: `${ORIGIN}${BASE}/competencies/${c.id}`,
    });
    page = injectMain(page, competencyBody(c));
    writePage(`competencies/${c.id}/index.html`, page);
    urls.push(`${ORIGIN}${BASE}/competencies/${c.id}`);
  }

  // cases index
  page = setHead(shell, {
    title: 'Каталог кейсов — EmplyFlow',
    description: '40 рабочих ситуаций по компетенциям для оценки сотрудников.',
    canonical: `${ORIGIN}${BASE}/cases`,
  });
  page = injectMain(page, casesIndexBody(D));
  writePage('cases/index.html', page);
  urls.push(`${ORIGIN}${BASE}/cases`);

  const byId = Object.fromEntries(D.competencies.map((c) => [c.id, c]));
  for (const c of D.cases) {
    const comp = byId[c.comp] || { id: c.comp, title: c.comp, indicators: [] };
    const title = `${c.title} — кейс · EmplyFlow`;
    page = setHead(shell, {
      title,
      description: c.sd || title,
      canonical: `${ORIGIN}${BASE}/cases/${c.id}`,
    });
    page = injectMain(page, caseBody(c, comp));
    writePage(`cases/${c.id}/index.html`, page);
    urls.push(`${ORIGIN}${BASE}/cases/${c.id}`);
  }

  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), buildSitemap(urls));
  fs.writeFileSync(path.join(OUT, 'robots.txt'), buildRobots());
  console.log('sitemap urls', urls.length);
  console.log('done →', OUT);
}

main();
