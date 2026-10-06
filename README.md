# FORMA³ — студия трёхмерных объектов (клиент)

Многостраничный сайт-лендинг студии 3D-моделей: продажа готовых моделей, заказ кастомного 3D, просмотр 3D-файлов в браузере. Референсы: showcase.noomoagency.com (лендинг) + dreiraum.studio (продажа).

## Стек

React 19 · Vite · TypeScript (strict) · Zustand · SCSS Modules · i18next (RU/EN) · React Router · Three.js (@react-three/fiber + drei) · motion · lenis

## Запуск

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # прод-сборка (+type-check)
npm run type-check # проверка типов
npm run lint       # eslint
```

## Страницы

| Путь | Что это |
|------|---------|
| `/` | Лендинг: полноэкранная 3D-сцена, объект меняется по скроллу |
| `/works` | Каталог 3D-моделей с живыми превью (один WebGL-контекст) |
| `/works/:id` | Страница продукта: 3D-вьювер, конфигуратор цвета/окружения, корзина |
| `/order` | Заказ кастомного 3D: калькулятор цены + форма с 3D-превью файла |
| `/lab` | 3D-лаборатория: просмотр своих GLB/GLTF/FBX/OBJ/STL локально |

## Архитектура

- `src/app` — платформо-независимое ядро: модели, сервисы, сторы, i18n, конфиги (готово к React Native и Go-бэкенду)
- `src/shared` — атомарные UI-компоненты, 3D-ядро (`shared/three`), хуки, лейауты
- `src/modules` — страницы
- `src/styles` — токены, миксины, плейсхолдеры вёрстки

Мок-3D: 10 процедурных моделей (`shared/three/models`). Когда появятся реальные работы (GLB-файлы) — они подключаются через тот же `ProductModel`/`ModelViewer` без переделки страниц. Бэкенд на Go подключается заменой `products.service` / `order.service` на HTTP-вызовы (`app/config/api-routes.config.ts` уже готов).

Правила кода — см. `CLIENT_RULES.md`.
