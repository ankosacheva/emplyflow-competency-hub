# Runbook: Tilda → Timeweb + Hub на `/hub/`

**Не менять A-запись в reg.ru**, пока в конце этого runbook не будет явного «DNS можно переключать».

Сервер: `212.113.123.95` (Timeweb)  
SSH: `~/.ssh/id_ed25519_timeweb` → `root@212.113.123.95`  
Hub git: `/opt/emplyflow-competency-hub`  
Старый Hub web-root: `/var/www/hub.emplyflow.ru/`  
Целевой основной сайт: `/var/www/emplyflow.ru/`  
Целевой Hub: `/var/www/emplyflow.ru/hub/` (или alias на текущий hub root)

---

## 0. Получить архив

1. Найти ZIP в uploads / workspace.
2. Распаковать в `/tmp/emplyflow-tilda-export/`.
3. Проверить структуру: есть ли `index.html`, папки `css/`, `js/`, `images/` / `files/`.
4. Выписать все HTML-страницы и пути (особенно `/privacy`).
5. Найти формы, Метрику, внешние скрипты Tilda — что может сломаться после экспорта.

---

## 1. Код Hub под префикс `/hub/`

Ветка: `cursor/hub-subpath-fedc` от `main`.

1. Перевести роутинг с hash `#/...` на path `/hub/...` (History API + fallback).
2. Base path для ассетов: `/hub/hub-analytics.js` и т.п.
3. Canonical / ссылки / lead `page` → `https://emplyflow.ru/hub/...`.
4. Prerender или минимум: nginx отдаёт `index.html` для `/hub/*` + later SSG.
5. Добавить `robots.txt`, заготовку `sitemap.xml` под `https://emplyflow.ru/hub/`.
6. 301-логика со старых hash-URL по возможности (`/#/competencies/x` → `/hub/competencies/x`).
7. Commit + push + merge в `main` когда готово к деплою.

---

## 2. Выкладка статики Tilda на VPS

```bash
# на сервере
mkdir -p /var/www/emplyflow.ru /var/www/emplyflow.ru/hub
# залить распакованный экспорт в /var/www/emplyflow.ru/
# НЕ затирать /hub/
```

Права: `www-data` или как принято на сервере.  
Проверить локально на сервере через `curl -H 'Host: emplyflow.ru' http://127.0.0.1/`.

---

## 3. Nginx

Один server для `emplyflow.ru` (+ www):

- `/` → root `/var/www/emplyflow.ru`
- `/hub/` → Hub (root или alias на файлы Hub)
- SPA fallback для `/hub/` → `index.html`
- Отдельный server `hub.emplyflow.ru` → `return 301 https://emplyflow.ru/hub$request_uri;` (после переключения; до DNS — можно подготовить конфиг)

Не ломать `3demplyflow.tw1.ru` и другие vhost’ы.

`nginx -t && systemctl reload nginx`

---

## 4. SSL для emplyflow.ru

- Выпустить certbot для `emplyflow.ru` и `www.emplyflow.ru`.
- Если HTTP-01 недоступен снаружи до смены DNS — использовать DNS-01 в reg.ru (TXT) **или** сначала выложить сайт, потом короткое окно на A-запись + сразу certbot.
- Предпочтительный порядок: конфиг готов → краткая смена A → certbot → проверка.

---

## 5. Деплой Hub в `/hub/`

```bash
git -C /opt/emplyflow-competency-hub fetch origin main
git -C /opt/emplyflow-competency-hub reset --hard origin/main
rsync -a --delete \
  --exclude '.git' --exclude 'README.md' --exclude 'docs' --exclude '.gitignore' \
  /opt/emplyflow-competency-hub/ /var/www/emplyflow.ru/hub/
```

Проверки до смены DNS (по IP / Host header):

```bash
curl -sI -H 'Host: emplyflow.ru' http://127.0.0.1/
curl -sI -H 'Host: emplyflow.ru' http://127.0.0.1/privacy
curl -sI -H 'Host: emplyflow.ru' http://127.0.0.1/hub/
curl -sI -H 'Host: emplyflow.ru' http://127.0.0.1/hub/hub-analytics.js
```

---

## 6. Сообщить пользователю: когда менять DNS

Только после зелёных проверок выше написать явно:

> **DNS можно переключать в reg.ru:**
> ```
> emplyflow.ru  A  212.113.123.95
> www           A  212.113.123.95
> ```
> `hub` A не удалять. NS не менять.

После смены DNS:

1. Дождаться распространения (минуты–часы).
2. Проверить `https://emplyflow.ru/`, `/privacy`, `/hub/`.
3. Включить/проверить 301 `https://hub.emplyflow.ru/...` → `/hub/...`.
4. SSL, если ещё не был на публичном имени.

---

## 7. После переезда (добить)

- [ ] Формы с Tilda работают или заменены
- [ ] Метрика на основном сайте
- [ ] Ссылки Tilda→hub обновлены на `/hub/`
- [ ] Яндекс Вебмастер / GSC на `emplyflow.ru`
- [ ] Sitemap Hub отправить
- [ ] Обновить README: прод = `https://emplyflow.ru/hub/`

---

## Стоп-условия

- Нет экспорта / битый ZIP → стоп, запросить архив заново.
- SSH reset с облака → дать пользователю команды rsync/nginx для выполнения с её машины.
- Не трогать контейнеры 3D-симулятора.
- Не удалять DNS `hub` до рабочего 301.
