# FlowerShopApi (NestJS)

## Локальный запуск

```bash
npm install
npm run start:dev
```

Базовый URL: `http://localhost:3000/api`.

## Деплой на Render

В репозитории есть `render.yaml` (blueprint). На Render:

1) New → **Blueprint** → выбрать репозиторий  
2) Создать сервис **web**  

Команды:
- Build: `npm ci && npm run build`
- Start: `npm run start:prod`

Переменные окружения:
- `NODE_ENV=production`
- `PORT` выставляет Render автоматически (в коде используется `process.env.PORT ?? 3000`).

## Эндпоинты

- `GET /api/catalog/flowers`
- `GET /api/catalog/packaging`
- `GET /api/orders`
- `POST /api/orders`
