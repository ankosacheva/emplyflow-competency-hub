import zlib from 'zlib';
import { ORIGIN, BASE, SITE_NAME, OG_IMAGES } from './seo-config.mjs';

export function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function clipDesc(text, min = 140, max = 160) {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  if (!t) return '';
  if (t.length <= max) return t.length >= min ? t : t;
  const cut = t.slice(0, max - 1);
  const sp = cut.lastIndexOf(' ');
  return (sp > min ? cut.slice(0, sp) : cut.slice(0, max - 1)) + '…';
}

export function pageUrl(path = '', query = '') {
  let p = path || '/';
  if (!p.startsWith('/')) p = '/' + p;
  if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1);
  const q = query ? (query.startsWith('?') ? query : '?' + query) : '';
  return `${ORIGIN}${BASE}${p === '/' ? '/' : p}${q}`;
}

export function titleHome() {
  return 'Библиотека компетенций и кейсов для оценки персонала — EmplyFlow';
}

export function titleCases(count) {
  return `Кейсы для оценки сотрудников: ${count} рабочих ситуаций — EmplyFlow`;
}

export function titleCompetency(name) {
  return `${name} — модель компетенции, индикаторы и уровни | EmplyFlow`;
}

export function titleCase(caseTitle, compTitle) {
  return `Кейс «${caseTitle}» — оценка компетенции «${compTitle}» | EmplyFlow`;
}

export function titleMethodology() {
  return 'Методика оценки по компетенциям и кейсам — EmplyFlow';
}

export function titleFilter(label, valueLabel) {
  return `Кейсы: ${valueLabel} — ${label.toLowerCase()} | EmplyFlow`;
}

export function descHome() {
  return clipDesc(
    'Готовые модели компетенций, поведенческие индикаторы и рабочие ситуации для оценки сотрудников и руководителей в HR и T&D.'
  );
}

export function descCases(count) {
  return clipDesc(
    `${count} рабочих ситуаций по компетенциям для оценки сотрудников и руководителей. Фильтры по роли, отрасли, сложности и формату задачи.`
  );
}

export function descCompetency(c) {
  return clipDesc(c.subtitle || c.short || c.title);
}

export function descCase(c, comp) {
  return clipDesc(c.sd || `${c.title}. Компетенция: ${comp.title}.`);
}

export function descMethodology() {
  return clipDesc(
    'Компетенция → поведенческие индикаторы → рабочая ситуация. Что открыто в библиотеке EmplyFlow и что остаётся на платформе оценки.'
  );
}

export function descFilter(label, valueLabel, count) {
  return clipDesc(
    `${count} кейсов для оценки сотрудников: фильтр «${valueLabel}» (${label.toLowerCase()}). Рабочие ситуации по компетенциям EmplyFlow.`
  );
}

/** Minimal solid-color PNG (no dependencies). */
export function createSolidPng(width, height, r, g, b) {
  const row = Buffer.alloc(1 + width * 3);
  row[0] = 0;
  for (let x = 0; x < width; x++) {
    row[1 + x * 3] = r;
    row[1 + x * 3 + 1] = g;
    row[1 + x * 3 + 2] = b;
  }
  const raw = Buffer.alloc((1 + width * 3) * height);
  for (let y = 0; y < height; y++) row.copy(raw, y * row.length);
  const compressed = zlib.deflateSync(raw, { level: 9 });

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const t = Buffer.from(type);
    const crcBuf = Buffer.concat([t, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(crcBuf) >>> 0);
    return Buffer.concat([len, t, data, crc]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
  }
  return ~c;
}

export function faviconSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="EmplyFlow">
  <rect width="32" height="32" rx="8" fill="#4a3bff"/>
  <path fill="#fff" d="M16 4l1.5 6.5L24 12l-6.5 1.5L16 20l-1.5-6.5L8 12l6.5-1.5z"/>
</svg>`;
}

export function buildJsonLd(blocks) {
  const flat = blocks.flat().filter(Boolean);
  if (!flat.length) return '';
  const payload = flat.length === 1 ? flat[0] : flat;
  return `<script type="application/ld+json">${JSON.stringify(payload)}</script>`;
}

export function orgJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${ORIGIN}/#organization`,
    name: SITE_NAME,
    url: ORIGIN,
    logo: `${ORIGIN}${BASE}/assets/apple-touch-icon.png`,
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${ORIGIN}${BASE}/#website`,
    name: `${SITE_NAME} Competency Hub`,
    url: `${ORIGIN}${BASE}/`,
    inLanguage: 'ru-RU',
    publisher: { '@id': `${ORIGIN}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${ORIGIN}${BASE}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbsJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function collectionJsonLd(name, url, items) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${url}#webpage`,
      name,
      url,
      inLanguage: 'ru-RU',
      isPartOf: { '@id': `${ORIGIN}${BASE}/#website` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: it.url,
        name: it.name,
      })),
    },
  ];
}

export function competencyJsonLd(c) {
  const url = pageUrl(`/competencies/${c.id}`);
  const termId = `${url}#term`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      '@id': `${ORIGIN}${BASE}/competencies/#set`,
      name: 'Компетенции EmplyFlow',
      inLanguage: 'ru-RU',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      '@id': termId,
      name: c.title,
      description: c.subtitle || c.short || '',
      url,
      termCode: c.id,
      inDefinedTermSet: { '@id': `${ORIGIN}${BASE}/competencies/#set` },
    },
    breadcrumbsJsonLd([
      { name: 'Библиотека', url: pageUrl('/') },
      { name: c.title, url },
    ]),
  ];
}

export function caseJsonLd(c, comp) {
  const url = pageUrl(`/cases/${c.id}`);
  const termUrl = pageUrl(`/competencies/${comp.id}`);
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      '@id': `${url}#resource`,
      name: c.title,
      description: c.sd || '',
      url,
      inLanguage: 'ru-RU',
      learningResourceType: 'Case study',
      teaches: { '@id': `${termUrl}#term` },
    },
    breadcrumbsJsonLd([
      { name: 'Библиотека', url: pageUrl('/') },
      { name: comp.title, url: termUrl },
      { name: c.title, url },
    ]),
  ];
}

export function buildHeadExtra({
  ogType = 'website',
  ogImage = OG_IMAGES.default,
  robots = null,
  jsonLd = [],
  verification = true,
}) {
  const lines = [];
  lines.push(`<meta property="og:locale" content="ru_RU">`);
  lines.push(`<meta property="og:type" content="${esc(ogType)}">`);
  lines.push(`<meta property="og:site_name" content="${esc(SITE_NAME)}">`);
  lines.push(`<meta property="og:image" content="${esc(ogImage)}">`);
  lines.push(`<meta name="twitter:title" content="" data-seo-twitter-title>`);
  lines.push(`<meta name="twitter:description" content="" data-seo-twitter-desc>`);
  lines.push(`<meta name="twitter:image" content="${esc(ogImage)}">`);
  if (robots) lines.push(`<meta name="robots" content="${esc(robots)}">`);
  if (verification) {
    lines.push(`<meta name="google-site-verification" content="__GSC_TOKEN__">`);
    lines.push(`<meta name="yandex-verification" content="__YV_TOKEN__">`);
  }
  if (jsonLd.length) lines.push(buildJsonLd(jsonLd));
  return lines.join('\n');
}

export function applyHead(html, meta) {
  const {
    title,
    description,
    canonical,
    ogType = 'website',
    ogImage = OG_IMAGES.default,
    robots = null,
    jsonLd = [],
  } = meta;

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
  html = html.replace(
    /<meta property="og:type" content="[^"]*">/,
    `<meta property="og:type" content="${esc(ogType)}">`
  );
  html = html.replace(
    /<meta property="og:site_name" content="[^"]*">/,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}">`
  );
  html = html.replace(
    /<meta property="og:image" content="[^"]*">/,
    `<meta property="og:image" content="${esc(ogImage)}">`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*">/,
    `<meta name="twitter:title" content="${esc(title)}">`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*">/,
    `<meta name="twitter:description" content="${esc(description)}">`
  );
  html = html.replace(
    /<meta name="twitter:image" content="[^"]*">/,
    `<meta name="twitter:image" content="${esc(ogImage)}">`
  );

  // robots: remove existing dynamic, add if needed
  html = html.replace(/\n<meta name="robots" content="[^"]*">/g, '');
  if (robots) {
    html = html.replace(
      /<link rel="canonical"/,
      `<meta name="robots" content="${esc(robots)}">\n<link rel="canonical"`
    );
  }

  // JSON-LD: replace existing ld+json blocks from prerender marker
  html = html.replace(/\n<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  if (jsonLd.length) {
    html = html.replace('</head>', `${buildJsonLd(jsonLd)}\n</head>`);
  }

  return html;
}
