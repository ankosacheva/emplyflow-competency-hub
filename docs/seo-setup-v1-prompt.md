# SEO v1 для EmplyFlow Competency Hub — техническое задание

Роль: **Senior Technical SEO Engineer**.

Проект: **`https://emplyflow.ru/hub/`** (целевой канонический адрес; сейчас сайт открывается на `hub.emplyflow.ru`, миграция запланирована).

Аудитория: HR, T&D, специалисты по оценке и обучению персонала в РФ.

Приоритеты по каналам: **Яндекс P0**, **Google P0**, **AI-поисковики P1** (Яндекс Нейро, ChatGPT Search, Gemini/AI Overviews, Perplexity), + расшаривания через Telegram и VK.

---

## Цель

Подготовить сайт к корректной индексации в Яндексе, Google и AI-поисковиках. Никакого продвижения, нового контента, изменения дизайна, UX, функциональности, структуры или URL сверх описанных ниже технических правок.

---

## Обязательный технический pre-requisite

Сайт сейчас — **hash-SPA**: контент рисуется JS в `<main>` по адресам вида `#/competencies/<slug>`, `#/cases/<slug>`. Пока это так, все дальнейшие меры физически бесполезны: у Яндекса, Google и особенно AI-краулеров (GPTBot, PerplexityBot, ClaudeBot JS не исполняют) на сайте один URL и пустое тело.

Поэтому в рамках SEO v1 **обязательно**:

1. Перевести Hub с hash-routing на **path URL**:
   - `/hub/`
   - `/hub/competencies`
   - `/hub/competencies/<slug>`
   - `/hub/cases`
   - `/hub/cases?<single-filter>=<value>`
   - `/hub/cases/<slug>`
   - `/hub/methodology`
2. Отдавать **prerendered HTML** для всех этих URL: `<title>`, `<meta>`, `<link rel="canonical">`, JSON-LD и основной контент — в исходном HTML, а не после JS.
3. Сохранить текущее поведение SPA как progressive enhancement (History API, клиентский роутинг остаётся, но не обязателен для рендера контента).
4. Тест приёмки: `curl -A "YandexBot" https://emplyflow.ru/hub/competencies/ai-readiness` возвращает 200 и полное тело страницы; в HTML видны заголовок, описание, тексты индикаторов, JSON-LD.

Без этого пункта задачу не принимать.

---

## Требования по разделам

### 1. `<title>`
- Уникальный на каждой странице, до ~60 символов.
- Ключ ближе к началу, бренд в конце.
- Шаблоны:
  - Главная: `Библиотека компетенций и кейсов для оценки персонала — EmplyFlow`
  - Каталог кейсов: `Кейсы для оценки сотрудников: 40 рабочих ситуаций — EmplyFlow`
  - Компетенция: `<Название> — модель компетенции, индикаторы и уровни | EmplyFlow`
  - Кейс: `Кейс «<Название>» — оценка компетенции «<Название>» | EmplyFlow`
  - Методика: `Методика оценки по компетенциям и кейсам — EmplyFlow`

### 2. `<meta name="description">`
- Уникальный, 140–160 символов, естественный текст, без переспама.
- Отвечает на интент, а не пересказывает `<title>`.

### 3. Заголовки
- Один `<h1>` на страницу, отличается от `<title>`.
- H2 сформулированы под вопросы аудитории («Что проверяет кейс», «Как оценивать поведение по индикаторам»).
- H3 — подпункты, без пропусков уровней.

### 4. Open Graph (Telegram, VK, LinkedIn)
- `og:site_name = EmplyFlow`
- `og:locale = ru_RU`
- `og:type = website` — главная, каталоги, методика
- `og:type = article` — компетенции и кейсы
- `og:image` — фирменное превью 1200×630, одно шаблонное на тип страницы (можно с подстановкой заголовка при билде)
- `og:url` — абсолютный canonical URL на `emplyflow.ru/hub/...`
- `og:title`, `og:description` — согласованы с `<title>` и `<meta description>`

### 5. Twitter Card
- `twitter:card = summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image` — зеркалят OG. Приоритет низкий.

### 6. Canonical
- На каждой странице абсолютный self-referencing `<link rel="canonical">`.
- Все canonical — на `https://emplyflow.ru/hub/...`, даже если фактическая раскатка временно на `hub.emplyflow.ru`.
- На страницах каталога с одним фильтром — canonical на саму страницу (`/hub/cases?role=head`).
- На комбинациях 2+ фильтров — `<meta name="robots" content="noindex, follow">`.

### 7. `robots.txt` (в корне `/hub/` + корневой)
Правила:
- Полное разрешение индексации prod.
- Явные `Allow` для AI-краулеров: `GPTBot`, `ChatGPT-User`, `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot`, `Claude-SearchBot`, `Google-Extended`, `Applebot-Extended`, `YandexGPT`.
- Отдельный блок `User-agent: Yandex` с директивой `Clean-param`:  
  `utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&ysclid&gclid&from&ref /`
- `Sitemap: https://emplyflow.ru/hub/sitemap.xml`
- Deny для preview/staging/утилитарных путей, если появятся.

### 8. `sitemap.xml`
- Только реальные path URL со статусом 200 и без `noindex`.
- Разделы: главная, методика, каталог, одиночные фильтр-страницы 1 уровня, все компетенции, все кейсы.
- Честный `lastmod` в ISO 8601.
- Без выдуманного `priority`.
- Генерация автоматически при билде, из данных `HUB_DATA`.
- При росте — sitemap index.

### 9. Favicon и PWA-иконки
- `favicon.ico`, `favicon.svg` (для тёмной темы), `favicon-32.png`, `favicon-16.png`, `apple-touch-icon.png` 180×180.
- `manifest.webmanifest` со стандартными размерами и `theme_color`.
- `<meta name="theme-color">`.

### 10. Language / locale
- `<html lang="ru">`.
- `og:locale = ru_RU`.
- `hreflang` не задаём — только РФ на этом этапе.

### 11. Индексация
- Ни на одной публичной странице нет `noindex`.
- Все публичные URL отдают 200, без авторизации.
- Комбинации фильтров ≥ 2 → `noindex, follow`.
- Дубли по параметрам утилизированы `canonical` + `Clean-param`.
- Проверка: `curl` под UA `YandexBot`, `Googlebot`, `GPTBot`, `PerplexityBot`, `ClaudeBot` — везде 200 и полный HTML.
- WAF / Cloudflare / Timeweb не режут ботов (проверить логи).

### 12. Structured Data (JSON-LD)
Минимально необходимый связный граф. Никаких `Review`, `AggregateRating`, `FAQPage` без реального FAQ на странице.

- Главная: `Organization` + `WebSite` c `potentialAction: SearchAction`.
- Каталог кейсов и компетенций: `CollectionPage` + `ItemList`.
- Компетенция: `DefinedTerm` внутри `DefinedTermSet`, поля `inDefinedTermSet` и `termCode` (= slug).
- Кейс: `LearningResource` со свойством `teaches` — ссылкой на соответствующий `DefinedTerm` через `@id`.
- Внутренние страницы (компетенция, кейс, методика): `BreadcrumbList`.
- Валидация: Google Rich Results Test + Schema.org Validator + Яндекс Валидатор микроразметки.

### 13. Google Search Console
Подготовить (не подключать):
- DNS TXT-запись для Domain property на `emplyflow.ru` (значение указывает пользователь).
- Дополнительно verification `<meta>` в `<head>` `/hub/` (URL-prefix property).
- `sitemap.xml`.
- Готовность к URL Inspection.

### 14. Яндекс Вебмастер
Подготовить (не подключать):
- Verification через DNS TXT или HTML-файл (значение указывает пользователь).
- `robots.txt`, `sitemap.xml`.
- Готовность к обходу по счётчику Яндекс.Метрики.
- IndexNow-ключ + endpoint `/hub/indexnow-<key>.txt`.

### 15. Яндекс.Метрика (нужна одновременно, не позже)
- Единый счётчик Метрики на всех страницах `emplyflow.ru` и `/hub/`.
- Цели: `click_to_emplyflow`, `lead_modal_open`, `lead_submit_success`, `template_download` (при появлении).
- Сегменты: рефералы из `chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `ya.ru`, `copilot.microsoft.com`.
- Не заменяет текущий product analytics; работает параллельно.

### 16. GEO-минимум для LLM
- `llms.txt` в корне `/hub/` — короткая машиночитаемая карта: что за проект, ссылки на ключевые разделы.
- (Опционально в v1, обязательно в v2) markdown-зеркала страниц по `/hub/competencies/<slug>.md` и `/hub/cases/<slug>.md`.

### 17. HTTP / nginx
- gzip/brotli для HTML, CSS, JS, SVG, JSON.
- `Cache-Control` для статики.
- `X-Robots-Tag: index, follow` (по умолчанию), `noindex` для не-публичных путей.
- HTTPS-редирект, HSTS.
- `try_files` для path-роутинга, отдача prerendered HTML.
- 301 с `https://hub.emplyflow.ru/*` (в т.ч. с любыми hash) на `https://emplyflow.ru/hub/*` — включается на этапе миграции.

---

## Что запрещено

- Создавать статьи и новые страницы.
- Писать новый контент, менять существующие тексты.
- Добавлять SEO-блоки/подвалы «для роботов».
- Менять дизайн, UX, функциональность.
- Менять URL сверх перехода `#/` → path.
- Публиковать промпты AI-оценки, веса индикаторов, эталонные ответы, красные флаги, шкалы и правила расчёта баллов, лимиты уточняющих вопросов.
- Публиковать клиентов под NDA. Ростелеком — можно (публично реферируемый).
- Придумывать авторов, рейтинги, отзывы.

---

## Приёмка

### Автоматические проверки
- `curl -A "YandexBot/..." https://emplyflow.ru/hub/competencies/ai-readiness` → 200, полный HTML, есть `<title>`, `<meta description>`, `<link rel="canonical">`, JSON-LD `DefinedTerm`.
- То же под `Googlebot`, `GPTBot`, `PerplexityBot`, `ClaudeBot`, `YandexGPT`.
- `curl https://emplyflow.ru/hub/sitemap.xml` → 200, валидный XML, реальные URL.
- `curl https://emplyflow.ru/hub/robots.txt` → 200, есть `Sitemap:`, `Clean-param`, AI Allow.

### Внешние валидаторы
- Google Rich Results Test — для главной, каталога, компетенции, кейса.
- Schema.org Validator — тот же набор.
- Яндекс Валидатор микроразметки — тот же набор.
- PageSpeed Insights (моб): LCP < 2.5 s, INP < 200 ms, CLS < 0.1.

### Ручной smoke
- Главная, каталог, 3 случайных компетенции, 5 случайных кейсов, методика — все имеют уникальный `<title>`, `<meta description>`, `<h1>`, canonical, OG.
- 301 с `hub.emplyflow.ru/...` работает после миграции.

---

## Deliverable: `SEO_SETUP_REPORT.md`

Разделы отчёта:
- Итог по pre-requisite (path routing + prerender).
- Список изменённых страниц с новыми `<title>` и `<meta description>`.
- Подключён ли `robots.txt` — с итоговым содержимым.
- Подключён ли `sitemap.xml` — со списком URL.
- Добавлен ли canonical, OG, Twitter Card, favicon, `<html lang>`.
- Список URL с `noindex, follow` и причина (комбинированные фильтры).
- Результаты curl под UA (Яндекс/Google/AI): коды ответов, наличие ключевых тегов.
- Результаты валидации JSON-LD (Google/Yandex/Schema.org).
- Готовность к подключению Google Search Console (DNS TXT / meta).
- Готовность к подключению Яндекс Вебмастера (DNS TXT / HTML-файл / meta).
- Готовность к подключению Яндекс.Метрики + список целей.
- Готовность к IndexNow (ключ + endpoint).
- Открытые вопросы, задачи «после миграции» (финальный 301, submit sitemap).
