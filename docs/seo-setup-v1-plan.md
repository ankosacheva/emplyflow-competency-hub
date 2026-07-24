# План реализации SEO v1 (EmplyFlow Competency Hub)

ТЗ: [`docs/seo-setup-v1-prompt.md`](seo-setup-v1-prompt.md).  
Runbook по миграции: [`docs/migrate-emplyflow-tilda-to-timeweb.md`](migrate-emplyflow-tilda-to-timeweb.md).

Цель плана — сделать `emplyflow.ru/hub/` индексируемым в Яндекс, Google и AI-поисковиках без изменения контента и функциональности.

## Текущее состояние (после коммита `7ffcacf`)

Часть плана уже реализована. Что закрыто:

- **Фаза A (path routing).** Hub переведён с hash на History API под `/hub/`, есть [`hash-redirect.html`](../hash-redirect.html) и [`scripts/migrate-to-hub-paths.py`](../scripts/migrate-to-hub-paths.py).
- **Фаза B (prerender).** Данные вынесены в [`hub-data.js`](../hub-data.js), билд-скрипт [`scripts/prerender-hub.mjs`](../scripts/prerender-hub.mjs) генерирует статику для главной, `/competencies/<slug>`, `/cases`, `/cases/<slug>`, `/methodology`, а также `sitemap.xml` и `robots.txt` (с Яндекс `Clean-param` и Allow для AI-краулеров).
- **Фаза C (базово).** В prerender подставляются `<title>`, `<meta description>`, `<link rel="canonical">`, `og:url`, `og:title`, `og:description`.

Что остаётся сделать по этому плану (см. фазы ниже):

- Расширение head-шаблона: `og:type`, `og:image`, `og:site_name`, `og:locale`, `twitter:*`, полный favicon-набор, `manifest.webmanifest`, `theme-color` (Фаза C, добить).
- **JSON-LD** для Organization / WebSite / CollectionPage / DefinedTerm / LearningResource / BreadcrumbList (Фаза D — не начата).
- **llms.txt** и **IndexNow** endpoint (Фаза E, дополнить).
- **Одиночные фильтр-страницы** в prerender и sitemap + `noindex, follow` на комбинации 2+ фильтров (Фаза F — не начата).
- **Метрика** и placeholders для `google-site-verification` / `yandex-verification` (Фаза G — не начата).
- **nginx-конфиг**: `/hub/` под `try_files`, 301 с `hub.emplyflow.ru`, gzip/brotli, HSTS (Фаза H — не начата).
- Уточнить `og:image` (один фирменный на тип страницы) и добавить его в prerender.
- Расширить sitemap `lastmod` (сейчас берётся время билда — приемлемо, но можно уточнить по данным).

---

## 0. Исходные данные

- Репозиторий: `emplyflow-competency-hub`, ветка `main`.
- Основной артефакт: `index.html` — статический hash-SPA с встроенными данными `window.HUB_DATA`.
- Зеркало: `EmplyFlow-Competency-Hub.html` (Tilda-embed).
- Текущий прод: `https://hub.emplyflow.ru`.
- Целевой прод: `https://emplyflow.ru/hub/` (VPS `212.113.123.95`, nginx, после переезда основного сайта с Tilda).
- Аналитика: `hub-analytics.js` + Google Apps Script Sheets (сохраняем).
- Форма заявки: `HUB_LEAD_ENDPOINT` (сохраняем).

---

## 1. Стратегия prerender

Выбор: **Node build script**, вручную мигрируем render-функции в изоморфные шаблоны.

Причины:
- Данных мало: 5 компетенций + ~40 кейсов + главная + каталог + одиночные фильтр-страницы + методика ≈ 60–80 HTML-файлов.
- Puppeteer/Playwright тяжелее в поддержке и требует headless-браузера в CI.
- Логика рендера в `index.html` детерминирована, легко переносится в чистый JS без DOM.

### Что делаем в билде
1. Выносим `HUB_DATA` в отдельный модуль (`src/data/hub-data.js`), доступный и в браузере, и в Node.
2. Пишем `scripts/build-seo.mjs`:
   - читает `HUB_DATA`;
   - генерирует HTML на основе общего шаблона `<head>` (title, description, canonical, OG, Twitter, favicon, JSON-LD) + пререндеренного `<main>` для каждого URL;
   - вклеивает существующие стили и клиентский JS Hub без изменений (progressive enhancement);
   - пишет файлы в `dist/hub/**/index.html`, `dist/hub/sitemap.xml`, `dist/hub/robots.txt`, `dist/hub/llms.txt`, `dist/hub/manifest.webmanifest`, иконки.
3. Билд-скрипт запускается локально/CI, результат — статика для nginx.

### Роутинг в клиенте
- Заменяем хэш-роутинг на History API (`pushState`), URLs становятся path-based.
- На каждом клике по внутренней ссылке — `preventDefault` + `pushState` + рендер существующей SPA-логикой.
- На прямой заход по URL — сервер отдаёт prerendered HTML, клиентский JS его «оживляет» (hydrate-like: слушатели навешиваются на существующий DOM).

---

## 2. Ветки и порядок PR

Небольшие PR, каждый деплоится независимо. Все — с базой `main`, префикс `cursor/`, суффикс `-fedc`.

| # | Ветка | Содержимое |
|---|---|---|
| A | `cursor/seo-path-routing-fedc` | История переходов на path URL, hash-редиректы, единая функция роутинга |
| B | `cursor/seo-prerender-fedc` | Вынос `HUB_DATA`, `scripts/build-seo.mjs`, prerender шаблоны |
| C | `cursor/seo-head-tags-fedc` | Уникальные `<title>`, `<meta description>`, canonical, OG, Twitter, favicon в `<head>` шаблона |
| D | `cursor/seo-jsonld-fedc` | JSON-LD: Organization, WebSite, CollectionPage, DefinedTerm, LearningResource, BreadcrumbList |
| E | `cursor/seo-robots-sitemap-fedc` | robots.txt, sitemap.xml (генератор), llms.txt, IndexNow endpoint |
| F | `cursor/seo-noindex-filters-fedc` | `noindex, follow` на комбинации 2+ фильтров |
| G | `cursor/seo-metrika-verify-fedc` | Метрика + цели, verification meta (GSC, Яндекс Вебмастер) |
| H | `cursor/seo-nginx-fedc` | nginx конфиг: `/hub/`, path fallback, gzip/brotli, `X-Robots-Tag`, 301 с `hub.emplyflow.ru` |

Ветки A и B делаются последовательно (B зависит от A). C–F можно параллелить. G–H в конце, вместе с миграцией.

---

## 3. Пофазовый план

### Фаза A. Path routing (ветка A)

Файлы: `index.html` (клиентская логика).

- Ввести константу `BASE = '/hub'`.
- Заменить `location.hash` → `location.pathname`. `parseHash()` → `parseRoute()`.
- Все внутренние переходы через `history.pushState` + `route()`.
- Обработчик `popstate` вместо `hashchange`.
- Все `<a href="#/...">` → `<a href="/hub/...">`.
- В `hub-analytics.js` — переход с hash на path в page view.
- Fallback: если приходит старый hash — редирект через `history.replaceState`.
- Приёмка: локально `python3 -m http.server` + nginx-эмуляция; клики по каталогу меняют URL на `/hub/cases/<slug>`.

### Фаза B. Prerender (ветка B)

Новые файлы:
- `src/data/hub-data.js` — вынос `window.HUB_DATA` в модуль ESM с `export default`.
- `src/templates/head.mjs` — генерация `<head>` (title, meta, canonical, OG, Twitter, JSON-LD placeholders, favicon links).
- `src/templates/pages/*.mjs` — рендер `<main>` для home, catalog, competency, case, methodology, filter-landing.
- `scripts/build-seo.mjs` — оркестратор: читает данные, для каждого URL собирает HTML, пишет в `dist/hub/`.
- `package.json` (root) — минимальный, с `"type": "module"` и скриптом `build:seo`.

`index.html` продолжает жить как shell для fallback; но prerender-версия — источник истины для роботов.

Приёмка: `node scripts/build-seo.mjs && curl file://.../dist/hub/competencies/ai-readiness/index.html | grep '<h1'`.

### Фаза C. Head-теги (ветка C)

В `src/templates/head.mjs`:
- Уникальный `<title>` по правилам из ТЗ.
- Уникальный `<meta name="description">` 140–160 символов (сгенерировать из `subtitle` / `short` / `sd` данных, без дублирования).
- Абсолютный `<link rel="canonical" href="https://emplyflow.ru/hub/...">`.
- OG: `og:site_name`, `og:locale=ru_RU`, `og:type`, `og:title`, `og:description`, `og:url`, `og:image`.
- Twitter Card: `summary_large_image`, зеркалит OG.
- `<html lang="ru">`.
- Favicon: `.ico`, `.svg`, `-32.png`, `-16.png`, `apple-touch-icon.png` 180×180, `manifest.webmanifest`, `<meta name="theme-color">`.

Ассеты иконок — базовый набор из фирменной звёздочки EmplyFlow, генерируются один раз, кладутся в `dist/hub/`.

Приёмка: DevTools → Elements → `<head>` на всех типах страниц.

### Фаза D. JSON-LD (ветка D)

В `src/templates/head.mjs` дополняем JSON-LD:

- Главная: `Organization` + `WebSite` c `potentialAction: SearchAction`.
- Каталог кейсов и компетенций: `CollectionPage` + `ItemList` со ссылками через `@id`.
- Компетенция: `DefinedTerm` в `DefinedTermSet` (общий на все компетенции, `@id=https://emplyflow.ru/hub/competencies/#set`), `termCode = slug`.
- Кейс: `LearningResource` со `teaches` → `@id` компетенции.
- BreadcrumbList на всех глубоких страницах.

Все `@id` — абсолютные, чтобы связка работала между страницами.

Валидация: Google Rich Results Test + Schema.org Validator + Яндекс Валидатор — сохранить скриншоты в отчёт.

### Фаза E. robots, sitemap, llms, IndexNow (ветка E)

- `dist/hub/robots.txt`:
  ```
  User-agent: *
  Allow: /

  User-agent: Yandex
  Allow: /
  Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&ysclid&gclid&from&ref /

  User-agent: GPTBot
  Allow: /

  User-agent: ChatGPT-User
  Allow: /

  User-agent: OAI-SearchBot
  Allow: /

  User-agent: PerplexityBot
  Allow: /

  User-agent: ClaudeBot
  Allow: /

  User-agent: Claude-SearchBot
  Allow: /

  User-agent: Google-Extended
  Allow: /

  User-agent: Applebot-Extended
  Allow: /

  User-agent: YandexGPT
  Allow: /

  Sitemap: https://emplyflow.ru/hub/sitemap.xml
  ```

- `dist/hub/sitemap.xml` — генерируется в `build-seo.mjs` из `HUB_DATA` и списка маршрутов, `lastmod` = git commit date файла-источника или дата билда.

- `dist/hub/llms.txt` — короткая карта:
  ```
  # EmplyFlow Competency Hub
  Библиотека компетенций и кейсов для оценки персонала EmplyFlow.
  ...
  ```

- IndexNow: сгенерировать ключ (32 hex), положить в `dist/hub/indexnow-<key>.txt` с содержимым = сам ключ. Скрипт `scripts/indexnow-ping.mjs` — пингует Яндекс/Bing на обновлённые URL при деплое (запуск вручную или из CI).

### Фаза F. noindex на комбинированные фильтры (ветка F)

В prerender-шаблоне каталога:
- Для одиночного фильтра первого уровня генерируется отдельный HTML-файл (например `/hub/cases/role-head/index.html`), попадает в sitemap.
- Все прочие комбинации в URL (`?role=head&industry=it`) — динамические, обслуживаются клиентским SPA, но prerender для них шлёт `<meta name="robots" content="noindex, follow">` и canonical на «одиночную» версию.

### Фаза G. Метрика и верификация (ветка G)

- Вставить единый счётчик Яндекс.Метрики в `<head>` шаблона.
- Настроить цели в Метрике (не в коде): `click_to_emplyflow`, `lead_modal_open`, `lead_submit_success`, `template_download` (заглушка на будущее).
- Оставить плейсхолдеры (переменные) для верификации:
  - `<meta name="google-site-verification" content="__GSC_TOKEN__">`
  - `<meta name="yandex-verification" content="__YV_TOKEN__">`
- Реальные значения владелец подставит в `build-seo.mjs` config, или через переменные окружения при билде.

### Фаза H. nginx и деплой (ветка H)

На VPS `212.113.123.95`:
- Vhost `emplyflow.ru`:
  - `location /` → корень Tilda-выгрузки.
  - `location /hub/` → alias на `dist/hub/` из репозитория (или из web-root).
  - `try_files $uri $uri/ /hub/index.html;` — SPA fallback только внутри `/hub/`.
- Vhost `hub.emplyflow.ru`:
  - `return 301 https://emplyflow.ru/hub$request_uri;` (включается после проверки).
- gzip/brotli, кэш статики, `X-Robots-Tag`, HSTS.
- Обновить `docs/migrate-emplyflow-tilda-to-timeweb.md`, если формат путей изменится.

Деплой Hub теперь = `git pull` + `node scripts/build-seo.mjs` + `rsync dist/hub/` в `/var/www/emplyflow.ru/hub/`.

---

## 4. Приёмка и QA

Автоматика (в отчёте):
- `curl -sI -A "YandexBot" https://emplyflow.ru/hub/` → 200.
- `curl -sI -A "GPTBot" .../hub/competencies/ai-readiness` → 200.
- `curl .../hub/competencies/ai-readiness | grep -E "<title>|canonical|og:title|DefinedTerm"` → все нашлись.
- `curl .../hub/sitemap.xml` — валиден, содержит все ожидаемые URL.
- `curl .../hub/robots.txt` — есть `Sitemap:`, `Clean-param`, все AI Allow.

Валидаторы:
- Google Rich Results Test — главная, каталог, компетенция, кейс.
- Schema.org Validator — те же.
- Яндекс Валидатор микроразметки — те же.
- PageSpeed Insights (mobile) — LCP < 2.5s, INP < 200ms, CLS < 0.1.

Ручной smoke:
- Прямой заход по 5 случайным URL, hard refresh, DevTools → Network → доктайп страницы = HTML со всем контентом до JS.
- Все внутренние ссылки — path URL, hash-URL редиректятся на path.
- 301 с `hub.emplyflow.ru/...` → `emplyflow.ru/hub/...` работает (после этапа H).

---

## 5. Deliverable — `SEO_SETUP_REPORT.md`

Автогенерируется в конце `scripts/build-seo.mjs` + дозаполняется вручную по результатам валидаторов. Формат — как в ТЗ.

Кладём в корень репозитория и в `dist/hub/SEO_SETUP_REPORT.md` (закрыть от индексации через `robots.txt`).

---

## 6. Что делать после мержа всех веток

1. Раскатить в `hub.emplyflow.ru` для приёмки на текущем домене (canonical всё равно на `emplyflow.ru/hub/`; предупредить в отчёте).
2. Дождаться миграции основного сайта с Tilda (см. runbook переезда).
3. После смены A-записи в reg.ru — включить 301 с `hub.emplyflow.ru`.
4. Владелец: подставить реальные токены GSC / Яндекс Вебмастер / Метрика, submit sitemap, добавить сайт в Яндекс Вебмастер с регионом «Россия», DNS TXT для Domain property в GSC, DNS TXT / HTML-файл для Вебмастера.
5. Первый прогон IndexNow.
6. Мониторинг: логи AI-краулеров в nginx, страницы в поиске Вебмастера, покрытие в GSC.

---

## 7. Оценка объёма

Основные точки инвазивности:
- Клиентский роутинг на path — 1 файл, средняя правка.
- Prerender-подсистема — новый билд-скрипт + шаблоны, изолирован, не ломает существующий Hub.
- nginx — конфиг на VPS, не в репозитории.
- JSON-LD и meta — целиком в шаблоне.

Риски:
- Расхождение prerender ↔ клиентский рендер после изменения `HUB_DATA` → закрывается тем, что оба источника используют один и тот же `src/data/hub-data.js`.
- Правки контента после билда без пересборки → фиксируется в CI/деплой-скрипт: `git pull` → `build:seo` → `rsync`.

---

## 8. Что этот план сознательно не делает

По ТЗ SEO v1 и SEO-стратегии — вне scope:
- глоссарий, руководства, исследование;
- Реестр ПО, TAdviser, CNews, Habr;
- brand-defensive страницы на `emplyflow.ru`;
- новые страницы, новый контент, изменение текстов.

Эти пункты — отдельными плановыми задачами после SEO v1.
