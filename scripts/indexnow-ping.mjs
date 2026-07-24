#!/usr/bin/env node
/**
 * Ping IndexNow (Yandex + Bing) after deploy.
 * Usage: node scripts/indexnow-ping.mjs [url1 url2 ...]
 * Without args — reads dist/hub/sitemap.xml
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INDEXNOW_KEY, ORIGIN, BASE } from './seo-config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const HOST = 'emplyflow.ru';

async function pingEndpoint(endpoint, urlList) {
  const body = JSON.stringify({
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${ORIGIN}${BASE}/indexnow-${INDEXNOW_KEY}.txt`,
    urlList,
  });
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body,
  });
  console.log(endpoint, res.status, await res.text().catch(() => ''));
}

function urlsFromSitemap() {
  const xml = fs.readFileSync(path.join(ROOT, 'dist', 'hub', 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function main() {
  const urls = process.argv.slice(2);
  const urlList = urls.length ? urls : urlsFromSitemap();
  if (!urlList.length) {
    console.error('No URLs. Run prerender first or pass URLs as args.');
    process.exit(1);
  }
  await pingEndpoint('https://yandex.com/indexnow', urlList.slice(0, 100));
  await pingEndpoint('https://api.indexnow.org/indexnow', urlList.slice(0, 100));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
