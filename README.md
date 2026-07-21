# EmplyFlow Competency Hub

Статический сайт библиотеки компетенций и кейсов EmplyFlow.

- GitHub: https://github.com/ankosacheva/emplyflow-competency-hub
- Прод: https://hub.emplyflow.ru
- VPS: Timeweb `212.113.123.95` (рядом с 3D-симулятором на `3demplyflow.tw1.ru`)

## Локально

```bash
python3 -m http.server 8080
```

Откройте http://localhost:8080/

## Форма заявки → CRM (простые варианты)

Форма уже умеет слать JSON на внешний endpoint. В `index.html` (или до загрузки скрипта) задайте:

```html
<script>window.HUB_LEAD_ENDPOINT = 'https://ВАШ_ENDPOINT';</script>
```

Если endpoint пустой — заявки только в console (демо-режим), UI всё равно показывает успех.

### 1) Google Таблица + письмо (рекомендую)

1. Создайте Google Sheet, лист `Leads`.
2. Расширения → Apps Script, вставьте код из `docs/google-apps-script-leads.js`.
3. В скрипте укажите `NOTIFY_EMAIL` (куда слать письмо).
4. Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone.
5. Скопируйте URL в `HUB_LEAD_ENDPOINT`.

Плюсы: бесплатно, видно в таблице, письмо на почту, без бэкенда.

### 2) Formspree / Getform

Зарегистрируйте форму, возьмите endpoint вида `https://formspree.io/f/xxxxx` и положите в `HUB_LEAD_ENDPOINT`. Письма приходят на почту, дальше можно Zapier → CRM.

### 3) Bitrix24 / amoCRM webhook

Создайте входящий webhook в CRM и укажите его URL в `HUB_LEAD_ENDPOINT`. При необходимости добавьте тонкий Apps Script / Make.com как «переводчик» JSON → поля сделки.

## Деплой на сервер

```bash
rsync -avz --delete \
  --exclude .git --exclude .gitignore --exclude README.md --exclude docs \
  ./ root@212.113.123.95:/var/www/hub.emplyflow.ru/
```

DNS (в зоне **reg.ru**, NS не менять на Timeweb):

```
hub.emplyflow.ru  A  212.113.123.95
```

## Аналитика

Продуктовая аналитика (пути пользователей, поиск, фильтры, CTA, заявки) описана в [`docs/analytics-setup.md`](docs/analytics-setup.md).

1. Задеплойте Apps Script из `docs/google-apps-script-analytics.js` → Web App.
2. В `index.html` задайте `window.HUB_ANALYTICS_ENDPOINT`.
3. Обновите скрипт заявок из `docs/google-apps-script-leads.js` (поля `visitor_id` / `session_id`).
4. На сайте примите баннер согласия и проверьте лист `raw_events`.