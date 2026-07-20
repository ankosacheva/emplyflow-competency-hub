# EmplyFlow Competency Hub

Статический сайт библиотеки компетенций и кейсов EmplyFlow.

- GitHub: https://github.com/ankosacheva/emplyflow-competency-hub
- Прод: https://hub.emplyflow.ru
- VPS: Timeweb `212.113.123.95` (рядом с 3D-симулятором на `3demplyflow.tw1.ru`)

## Локально

```bash
python3 -m http.server 8080
```

## Деплой на сервер

```bash
rsync -avz --delete --exclude .git --exclude .gitignore --exclude README.md \
  ./ root@212.113.123.95:/var/www/hub.emplyflow.ru/
```

DNS (в зоне **reg.ru**, NS не менять на Timeweb):

```
hub.emplyflow.ru  A  212.113.123.95
```

После появления DNS:

```bash
certbot --nginx -d hub.emplyflow.ru --non-interactive --agree-tos -m kosacheva.company@gmail.com
```
