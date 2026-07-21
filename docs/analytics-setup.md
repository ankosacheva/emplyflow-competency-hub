# Аналитика EmplyFlow Hub

Продуктовая аналитика сайта: путь каждого посетителя + сводки в Google Sheets / Looker Studio.

## Архитектура

```
Посетитель → hub.emplyflow.ru → hub-analytics.js
                                      ↓
                         Google Apps Script Web App
                                      ↓
              raw_events · sessions · visitors · daily_summary
                                      ↓
                              Looker Studio (опционально)
```

Заявки по-прежнему идут в отдельный Sheet `Leads` и связываются через `visitor_id` / `session_id`.

## 1. Подключение Google Sheet для аналитики

1. Создайте **новый** Google Sheet, например `EmplyFlow Hub Analytics`.
2. Расширения → Apps Script → вставьте код из [`google-apps-script-analytics.js`](google-apps-script-analytics.js).
3. Deploy → New deployment → Web app:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Скопируйте URL вида `https://script.google.com/macros/s/.../exec`.
5. В [`index.html`](../index.html) (и зеркале `EmplyFlow-Competency-Hub.html`) задайте:

```html
<script>window.HUB_ANALYTICS_ENDPOINT='https://script.google.com/macros/s/ВАШ_ID/exec';</script>
```

6. Триггеры → Add Trigger:
   - Function: `rollupDaily`
   - Event source: Time-driven
   - Type: Day timer
   - Time: 1am–2am

Листы создадутся автоматически при первом событии:
`raw_events`, `sessions`, `visitors`, `daily_summary`.

## 2. Обновить скрипт заявок

В Apps Script листа **Leads** замените код на актуальный [`google-apps-script-leads.js`](google-apps-script-leads.js) и сделайте **New version** деплоя.

Новые колонки: `visitor_id`, `session_id`.

## 3. Consent banner

На сайте появляется баннер:

- **Принять** → `localStorage.efhub_consent=granted`, события отправляются
- **Только необходимые** → `denied`, аналитика не пишется

До согласия события не уходят. `visitor_id` всё равно создаётся локально, чтобы после согласия и в заявке путь можно было связать.

Рекомендуется дописать в https://emplyflow.ru/privacy раздел про cookies / аналитику / примерную геолокацию.

## 4. Какие события пишутся

| Событие | Когда |
|---|---|
| `consent_granted` | Пользователь принял cookies |
| `session_start` | Новая сессия (30 мин неактивности) |
| `page_view` | Каждый hash-route |
| `competency_view` / `case_view` | Страница компетенции / кейса |
| `page_exit` | Уход со страницы + `time_on_page_ms`, `scroll_depth_percent` |
| `scroll_depth` | 25 / 50 / 75 / 90% |
| `heartbeat` | Каждые 15 сек на активной вкладке |
| `cta_click` | Клик по `data-lead` |
| `lead_modal_open` / `lead_step_1_complete` / `lead_submit_*` | Воронка формы |
| `search_open` / `search_query` / `search_zero_results` / `search_result_click` | Поиск |
| `filter_apply` / `filters_clear` / `sort_change` | Каталог кейсов |
| `nav_click` / `card_click` | Навигация и карточки |

## 5. Индивидуальный путь пользователя

1. Откройте лист `Leads`, найдите заявку, скопируйте `visitor_id`.
2. В `raw_events` отфильтруйте по `visitor_id` — увидите timeline.
3. В `sessions` — длительность, landing, exit, device, city.

## 6. Сводные метрики (`daily_summary`)

Ежедневный rollup пишет:

- users / new_users / sessions / pageviews
- avg_session_duration_sec
- cta_clicks / lead_submits / lead_conversion_rate
- search_queries / search_zero
- top_competencies / top_cases / top_searches / top_filters

## 7. Looker Studio (рекомендуется)

1. [Looker Studio](https://lookerstudio.google.com/) → Create → Data source → Google Sheets → ваш Analytics Sheet.
2. Подключите `daily_summary` и `raw_events`.
3. Полезные виджеты:
   - Линия: users / leads по дням
   - Таблица: top competencies / cases
   - Таблица: search zero results (спрос на новый контент)
   - Pie: device_type, country
   - Funnel через фильтры `event_name`: page_view → cta_click → lead_modal_open → lead_submit_success

## 8. Геолокация

После согласия трекер один раз запрашивает мягкую геолокацию через `geojs.io` (страна / регион / город). GPS браузера не запрашивается.

Если нужна более точная IP-гео на масштабе — позже добавьте Cloudflare Worker как прокси.

## 9. Проверка

1. Откройте сайт, нажмите «Принять» в баннере.
2. Пройдите: главная → компетенция → кейс → поиск → фильтр → CTA → форма.
3. Через 1–2 минуты в Sheet `raw_events` появятся строки.
4. В консоли браузера можно включить демо-лог: `window.HUB_ANALYTICS_DEBUG=true` (если endpoint пустой — события только в console).

## 10. Лимиты

Google Apps Script / Sheets подходят для старта (тысячи событий в день). При росте трафика перенесите raw events в BigQuery или PostHog, сохранив ту же схему имён событий.
