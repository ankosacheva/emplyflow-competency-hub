# EmplyFlow Competency Hub

Библиотека компетенций и кейсов EmplyFlow.

- GitHub: https://github.com/ankosacheva/emplyflow-competency-hub
- Прод: **https://emplyflow.ru/hub/**
- Старый хост `hub.emplyflow.ru` → 301 / hash-redirect на `/hub/`
- VPS: Timeweb `212.113.123.95`

## Локально

```bash
node scripts/prerender-hub.mjs
cd dist/hub && python3 -m http.server 8080
```

Откройте http://localhost:8080/ (пути вида `/competencies/...` в превью без префикса `/hub` — на проде префикс добавляет nginx).

Для проверки с префиксом:

```bash
node scripts/prerender-hub.mjs
python3 -m http.server 8080 --directory dist
# https://localhost:8080/hub/
```

Контент править в `hub-data.js`. После правок UI — `index.html`, затем снова `node scripts/prerender-hub.mjs`.

## Деплой на сервер

```bash
node scripts/prerender-hub.mjs

rsync -avz --delete \
  dist/hub/ root@212.113.123.95:/var/www/emplyflow.ru/hub/

# hash-redirect для закладок на старом поддомене
scp hash-redirect.html root@212.113.123.95:/var/www/hub.emplyflow.ru/index.html
```

Nginx: `location ^~ /hub/` в vhost `emplyflow.ru`; vhost `hub.emplyflow.ru` — 301 + `/` отдаёт `hash-redirect.html`.

Не трогать `/var/www/emplyflow.ru/` вне `hub/` (Tilda) и `/var/www/3demplyflow/`.

## Форма заявки / аналитика

Endpoint’ы задаются в `index.html`:

- `window.HUB_LEAD_ENDPOINT`
- `window.HUB_ANALYTICS_ENDPOINT`

См. `docs/google-apps-script-leads.js`, `docs/analytics-setup.md`.
