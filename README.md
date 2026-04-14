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

## Swagger (документация)

Swagger UI доступен по пути:

- локально: `http://localhost:3000/api-docs`
- на Render: `https://<your-service>.onrender.com/api-docs`

## Эндпоинты

- **Информация**
  - `GET /api/health`

- **Каталог**
  - `GET /api/catalog/flowers`
  - `POST /api/catalog/flowers`
  - `PATCH /api/catalog/flowers/:id/stock`
  - `DELETE /api/catalog/flowers/:id`
  - `GET /api/catalog/packaging`
  - `POST /api/catalog/packaging`
  - `DELETE /api/catalog/packaging/:id`

- **Заказы**
  - `GET /api/orders`
  - `POST /api/orders`

- **Одногруппник (прокси)**
  - `GET /api/classmate/health`
  - `GET /api/classmate/products`
  - `POST /api/classmate/products`

- **Интеграция**
  - `GET /api/integration/status`
  - `POST /api/integration/bouquet-estimate`
