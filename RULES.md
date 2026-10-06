# DIRAM — Coding Rules & Architecture

> **Проект:** Diram Marketplace + Seller Dashboard + Admin Panel
> **Стек:** React 19, Vite, TypeScript (strict), Zustand, SCSS Modules, i18next
> **Мобильное приложение:** Capacitor (WebView → APK/IPA)
> **Последнее обновление:** 2026-04-07

---

## СОДЕРЖАНИЕ

1. [Tech Stack](#1-tech-stack)
2. [Project Structure](#2-project-structure)
3. [Naming Convention](#3-naming-convention)
4. [Core Rules](#4-core-rules)
5. [TypeScript](#5-typescript)
6. [React Components](#6-react-components)
7. [State Management (Zustand)](#7-state-management-zustand)
8. [HTTP & API](#8-http--api)
9. [SCSS Architecture](#9-scss-architecture)
10. [i18n](#10-i18n)
11. [Performance](#11-performance)
12. [Anti-Patterns](#12-анти-паттерны)
13. [ESLint & Prettier](#13-eslint--prettier)
14. [Code Review Checklist](#14-code-review-checklist)

---

## 1. TECH STACK

| Категория | Технология |
|-----------|-----------|
| UI | React 19 (functional only) |
| Сборка | Vite 8 |
| Язык | TypeScript 5.9+ (strict) |
| State | Zustand 5 |
| Стили | SCSS Modules (без UI-библиотек) |
| i18n | i18next + react-i18next |
| HTTP | ky (fetch-based, 2KB) |
| Cookies | js-cookie |
| Routing | React Router v7 |
| WebSockets | Нативный WebSocket |
| Графики | Recharts (admin) |
| Шрифты | Plus Jakarta Sans |
| Мобильное | Capacitor |

| Иконки | lucide-react (только иконки, не UI-библиотека) |

**ЗАПРЕЩЕНО:** `any`, localStorage, OOP/классы, UI-библиотеки (MUI, Ant, Chakra — только чистый SCSS), `enum` (используем `as const`), комментарии в коде, дублирование кода, inline styles, хардкод строк, `window.alert/confirm/prompt`

---

## 2. PROJECT STRUCTURE

```
src/
  app/                                  ← ядро (логика, без UI)
    config/
      app.config.ts                     ← общие настройки (baseUrl, useMocks, etc.)
      api-routes.config.ts              ← ВСЕ API-эндпоинты
      router.config.ts                  ← конфиг роутов

    models/                             ← ВСЕ интерфейсы, типы централизованно
      auth/
        auth.interface.ts
      users/
        user.interface.ts
        user.type.ts
      listings/
        listing.interface.ts
        listing.type.ts
      shops/
        shop.interface.ts
        shop.type.ts
      orders/
        order.interface.ts
      categories/
        category.interface.ts
      ...

    services/                           ← бизнес-логика, API-вызовы
      auth.service.ts
      user.service.ts
      listing.service.ts
      shop.service.ts
      order.service.ts
      category.service.ts
      cookie.service.ts
      ...

    store/                              ← Zustand stores
      auth.store.ts
      ui.store.ts
      ...

    interceptors/
      http.interceptor.ts               ← base URL + token из CookieService

    guards/
      auth.guard.tsx
      shop-access.guard.tsx

    hooks/                              ← бизнес-хуки
      useAuth.ts
      useListings.ts
      ...

    utils/
      date.util.ts
      format.util.ts
      validation.util.ts
      ...

    websockets/
      chat.websocket.ts
      notification.websocket.ts

    i18n/
      i18n.config.ts
      locales/
        ru.json
        en.json

  modules/                              ← UI (страницы, модалки)
    auth/
      LoginPage.tsx
      LoginPage.module.scss
    home/
      HomePage.tsx
      HomePage.module.scss
    listings/
      ListingDetailPage.tsx
      CreateListingPage.tsx
      ...
    profile/
      ...
    seller/
      ...

  shared/                               ← переиспользуемые UI-компоненты
    components/
      Title/                            ← заголовки h1-h6
      Text/                             ← параграфы, подписи
      Button/                           ← все кнопки
      IconButton/                       ← кнопка-иконка
      Input/                            ← текстовые поля
      Select/                           ← выпадающий список
      Textarea/                         ← многострочное поле
      Checkbox/                         ← чекбокс
      Toggle/                           ← переключатель
      RadioGroup/                       ← группа radio
      Badge/                            ← статусы, теги
      Avatar/                           ← аватарки
      Divider/                          ← разделитель
      Card/                             ← карточка-обёртка
      Skeleton/                         ← загрузочный placeholder
      Spinner/                          ← индикатор загрузки
      EmptyState/                       ← пустое состояние
      Pagination/                       ← пагинация
      Tabs/                             ← табы
      SearchInput/                      ← поиск с debounce
      Table/                            ← базовая таблица
      Toaster/                          ← уведомления
      BaseModal/                        ← основа модалок
      ConfirmModal/                     ← подтверждение действий
      InfoModal/                        ← показ информации
      FormModal/                        ← формы в модалке
    hooks/
      useDebounce.ts
      useClickOutside.ts
      usePagination.ts
      useMediaQuery.ts
      ...
    layouts/
      PublicLayout/
      AuthLayout/
      SellerLayout/

  styles/                               ← глобальные SCSS
    _variables.scss
    _mixins.scss
    _reset.scss
    _typography.scss
    _animations.scss
    _global.scss
    index.scss                          ← точка входа

  App.tsx
  main.tsx
```

**Path Aliases:**
```ts
// vite.config.ts / tsconfig.json
'@app'     → 'src/app'
'@modules' → 'src/modules'
'@shared'  → 'src/shared'
'@styles'  → 'src/styles'
```

---

## 3. NAMING CONVENTION

### Файлы

| Тип | Шаблон | Пример |
|-----|--------|--------|
| Interface | `имя.interface.ts` | `user.interface.ts` |
| Type | `имя.type.ts` | `listing.type.ts` |
| Service | `имя.service.ts` | `auth.service.ts` |
| Store | `имя.store.ts` | `ui.store.ts` |
| Config | `имя.config.ts` | `api-routes.config.ts` |
| Util | `имя.util.ts` | `date.util.ts` |
| Guard | `имя.guard.tsx` | `auth.guard.tsx` |
| WebSocket | `имя.websocket.ts` | `chat.websocket.ts` |
| Hook | `useИмя.ts` | `useDebounce.ts` |
| Component | `ИмяComponent.tsx` | `Button.tsx`, `HomePage.tsx` |
| Styles | `Имя.module.scss` | `Button.module.scss` |

### Экспорт

```ts
// Интерфейсы — с суффиксом Interface
export interface UserInterface { ... }
export interface ListingInterface { ... }

// Типы — с суффиксом Type
export type ListingStatusType = 'active' | 'pending' | 'rejected';

// Константы вместо enum — as const
export const ListingStatus = {
  Active: 'active',
  Pending: 'pending',
  Rejected: 'rejected',
} as const;
type ListingStatus = typeof ListingStatus[keyof typeof ListingStatus];

// Сервисы — объект с методами
export const UserService = { getUsers, getUser, updateUser };

// Stores — хук useИмяStore
export const useAuthStore = create<AuthState>()(...);
```

### Импорт — .js расширения

```ts
// ПРАВИЛЬНО — всегда .js в импортах (ESM)
import { UserInterface } from '@app/models/users/user.interface.js';
import { useAuthStore } from '@app/store/auth.store.js';
```

---

## 4. CORE RULES

### 4.1. Centralized Models

Все интерфейсы, типы — **ТОЛЬКО** в `src/app/models/`. Никаких интерфейсов внутри компонентов, сервисов, сторов.

```ts
// ХОРОШО — модель в models/
// src/app/models/users/user.interface.ts
export interface UserInterface {
  id: string;
  name: string;
  phone: string;
  status: UserStatusType;
}

// ПЛОХО — интерфейс внутри компонента
const UserCard = ({ user }: { id: string; name: string }) => { ... }
```

### 4.2. No `any` — НИКОГДА

`any` запрещён **везде**. Используй `unknown` + type guard если тип неизвестен.

```ts
// ХОРОШО
function parseResponse(data: unknown): UserInterface {
  if (isUser(data)) return data;
  throw new Error('Invalid user data');
}

// ПЛОХО
function parseResponse(data: any): any { return data; }
```

### 4.3. No OOP — Functional Only

Никаких классов. Функциональные компоненты, хуки, объекты-сервисы.

```ts
// ХОРОШО — объект-сервис
export const AuthService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => { ... },
  logout: async (): Promise<void> => { ... },
};

// ПЛОХО — класс
class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> { ... }
}
```

### 4.4. No localStorage

Всё через **CookieService**: токены, язык, настройки.

```ts
// cookie.service.ts
import Cookies from 'js-cookie';

const COOKIE_KEYS = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
  language: 'lang',
} as const;

export const CookieService = {
  getToken: () => Cookies.get(COOKIE_KEYS.accessToken),
  setToken: (token: string) =>
    Cookies.set(COOKIE_KEYS.accessToken, token, { secure: true, sameSite: 'Strict' }),
  removeToken: () => Cookies.remove(COOKIE_KEYS.accessToken),
  getLanguage: () => Cookies.get(COOKIE_KEYS.language) || 'ru',
  setLanguage: (lang: string) => Cookies.set(COOKIE_KEYS.language, lang),
  clearAll: () => {
    Object.values(COOKIE_KEYS).forEach((key) => Cookies.remove(key));
  },
};
```

### 4.5. DRY — No Duplicates

Повторяющийся код выносим:
- `src/shared/components/` — переиспользуемый UI
- `src/shared/hooks/` — переиспользуемый хук
- `src/app/utils/` — утилитарная функция
- `src/app/services/` — бизнес-логика

### 4.6. as const вместо enum

```ts
// ХОРОШО
export const UserRole = {
  Admin: 'admin',
  Moderator: 'moderator',
  User: 'user',
} as const;
type UserRole = typeof UserRole[keyof typeof UserRole];

// ПЛОХО — enum не tree-shakable, проблемы с isolatedModules
enum UserRole { Admin = 'admin', Moderator = 'moderator' }
```

### 4.7. No Comments — Код говорит сам за себя

Никаких комментариев в коде. Код должен быть самодокументируемым через правильные имена переменных, функций, типов.

```ts
// ПЛОХО
// Получаем список пользователей
const data = await http.get('/users');
// Фильтруем активных
const filtered = data.filter(u => u.status === 'active');

// ХОРОШО — имена говорят сами
const users = await UserService.getUsers();
const activeUsers = users.filter(u => u.status === UserStatus.Active);
```

Исключений нет. Ни `//`, ни `/* */`, ни `/** */` (JSDoc) — ничего. Нет TODO, нет FIXME, нет HACK. Если что-то неочевидно — переименуй переменную/функцию.

### 4.8. Atomic Component System — ВСЁ переиспользуемое

Каждый UI-элемент — отдельный компонент. Если завтра меняем дизайн заголовков — меняем в одном месте, обновляется везде.

**Обязательные базовые компоненты** (`src/shared/components/`):

| Компонент | Что делает |
|-----------|-----------|
| `Title` | Заголовки h1-h6, единый стиль, размеры через prop |
| `Text` | Параграфы, подписи, любой текст |
| `Button` | Все кнопки (variant: primary/secondary/ghost/danger, size: sm/md/lg) |
| `IconButton` | Кнопка-иконка |
| `Input` | Текстовые поля (с label, error, icon) |
| `Select` | Выпадающий список |
| `Textarea` | Многострочное поле |
| `Checkbox` | Чекбокс |
| `Toggle` | Переключатель |
| `RadioGroup` | Группа radio-кнопок |
| `Badge` | Статусы, теги, счётчики |
| `Avatar` | Аватарки (размеры, fallback на инициалы) |
| `Divider` | Горизонтальный/вертикальный разделитель |
| `Card` | Карточка-обёртка |
| `Skeleton` | Загрузочный placeholder |
| `Spinner` | Индикатор загрузки |
| `EmptyState` | Пустое состояние (иконка + текст + action) |
| `Pagination` | Пагинация |
| `Tabs` | Табы |
| `SearchInput` | Поиск с debounce и иконкой |
| `Table` | Базовая таблица (сортировка, loading state) |
| `Toaster` | Уведомления (success/error/warning/info) |

```tsx
<Title level={2} size="lg">Пользователи</Title>
<Text variant="secondary" size="sm">Всего: 1,234</Text>
<Badge variant="success">Активный</Badge>
<Button variant="primary" size="md" icon={<Plus />}>Добавить</Button>
```

**Принцип:** НИКОГДА не пишем `<h2 className={styles.title}>` напрямую в странице. Всегда `<Title>`. НИКОГДА не пишем `<span className={styles.badge}>` — всегда `<Badge>`. Если элемент появляется 2+ раз — это компонент.

### 4.9. Modal System — Три типа модалок

Все модалки строятся на `BaseModal`. Три готовых варианта:

**BaseModal** — основа, не используется напрямую на страницах:
```tsx
interface BaseModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title?: string;
  readonly size?: 'sm' | 'md' | 'lg' | 'xl';
  readonly children: ReactNode;
  readonly footer?: ReactNode;
}
```

**ConfirmModal** — подтверждение действий (замена `window.confirm` и `alert`):
```tsx
<ConfirmModal
  isOpen={open}
  onClose={close}
  onConfirm={handleDelete}
  title="Удалить пользователя?"
  description="Это действие нельзя отменить"
  confirmText="Удалить"
  confirmVariant="danger"
/>
```

**InfoModal** — показ информации, детали, большие блоки:
```tsx
<InfoModal
  isOpen={open}
  onClose={close}
  title="Детали заказа"
  size="lg"
>
  <OrderDetails order={order} />
</InfoModal>
```

**FormModal** — формы внутри модалки:
```tsx
<FormModal
  isOpen={open}
  onClose={close}
  onSubmit={handleSubmit}
  title="Создать категорию"
  submitText="Создать"
  isLoading={loading}
>
  <Input label="Название" value={name} onChange={setName} />
</FormModal>
```

**ЗАПРЕЩЕНО:** `window.alert()`, `window.confirm()`, `window.prompt()`. Только компоненты-модалки.

---

## 5. TYPESCRIPT

### 5.1. Strict Mode — всегда

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### 5.2. Explicit Types для public API

```ts
// ХОРОШО — explicit return types на экспортируемых функциях
export const getUser = async (id: string): Promise<UserInterface> => {
  return httpClient.get(`users/${id}`).json();
};

// ХОРОШО — type inference для локальных переменных
const count = 0;               // number
const items = ['a', 'b'];      // string[]
const isActive = true;          // boolean
```

### 5.3. Union Types и Type Guards

```ts
type LoadingState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: UserInterface[] }
  | { status: 'error'; error: string };

function renderState(state: LoadingState) {
  switch (state.status) {
    case 'success': return <UserList users={state.data} />;
    case 'error': return <Error message={state.error} />;
    case 'loading': return <Spinner />;
    default: return null;
  }
}
```

### 5.4. No Type Assertions без необходимости

```ts
// ПЛОХО
const user = data as any;
const el = document.getElementById('x') as HTMLInputElement;

// ХОРОШО — type guard
if (data && typeof data === 'object' && 'name' in data) { ... }

// ДОПУСТИМО — если точно знаешь тип (событие, ref)
const target = e.target as HTMLInputElement;
```

### 5.5. Readonly где возможно

```ts
// ХОРОШО
interface Props {
  readonly items: readonly UserInterface[];
  readonly onSelect: (id: string) => void;
}
```

---

## 6. REACT COMPONENTS

### 6.1. Functional Only + Named Export

```tsx
// ХОРОШО
export function UserCard({ user, onSelect }: UserCardProps) {
  return <div onClick={() => onSelect(user.id)}>{user.name}</div>;
}

// ПЛОХО — default export
export default function UserCard() { ... }

// ПЛОХО — class component
class UserCard extends React.Component { ... }
```

### 6.2. Props Interface — отдельно

```tsx
// ХОРОШО — интерфейс в models/ или рядом с компонентом (если локальный)
interface UserCardProps {
  readonly user: UserInterface;
  readonly onSelect: (id: string) => void;
  readonly variant?: 'compact' | 'full';
}

export function UserCard({ user, onSelect, variant = 'full' }: UserCardProps) { ... }
```

### 6.3. useMemo для производных значений

```tsx
// ХОРОШО — мемоизация тяжёлых вычислений
const total = useMemo(
  () => items.reduce((sum, item) => sum + item.price, 0),
  [items]
);

const filteredUsers = useMemo(
  () => users.filter(u => u.status === 'active'),
  [users]
);

// ПЛОХО — пересчитывается каждый рендер
const total = items.reduce((sum, item) => sum + item.price, 0);
```

### 6.4. useCallback для обработчиков

```tsx
// ХОРОШО — стабильная ссылка
const handleDelete = useCallback((id: string) => {
  UserService.deleteUser(id);
}, []);

// ПЛОХО — новая функция каждый рендер (проблема если передаётся в мемоизированный child)
const handleDelete = (id: string) => UserService.deleteUser(id);
```

### 6.5. Cleanup в useEffect

```tsx
// ХОРОШО — cleanup
useEffect(() => {
  const controller = new AbortController();
  fetchUsers(controller.signal);
  return () => controller.abort();
}, []);

// ХОРОШО — cleanup таймера
useEffect(() => {
  const timer = setInterval(tick, 1000);
  return () => clearInterval(timer);
}, []);
```

### 6.6. Single Responsibility

Компонент — максимум 300 строк. Если больше — разбивай:
- Логика → custom hook
- UI-части → sub-компоненты
- Данные → store/service

### 6.7. Lazy Loading страниц

```tsx
// router.config.ts
const HomePage = lazy(() => import('@modules/home/HomePage.js'));
const ProfilePage = lazy(() => import('@modules/profile/ProfilePage.js'));

// В роутере
<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/profile" element={<ProfilePage />} />
  </Routes>
</Suspense>
```

---

## 7. STATE MANAGEMENT (ZUSTAND)

### 7.1. Store Structure

```ts
// auth.store.ts
import { create } from 'zustand';
import type { AuthStoreInterface } from '@app/models/auth/auth.interface.js';

export const useAuthStore = create<AuthStoreInterface>()((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: false,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => {
    CookieService.clearAll();
    set({ user: null, isAuthenticated: false });
  },

  // Async actions
  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await AuthService.login(credentials);
      CookieService.setToken(response.accessToken);
      set({ user: response.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
```

### 7.2. Immutable Updates — ВСЕГДА

```ts
// ХОРОШО — иммутабельно
set((state) => ({
  users: [...state.users, newUser],
}));

set((state) => ({
  users: state.users.map(u => u.id === id ? { ...u, name: newName } : u),
}));

set((state) => ({
  users: state.users.filter(u => u.id !== id),
}));

// ПЛОХО — мутация
set((state) => {
  state.users.push(newUser);  // Zustand не увидит изменение!
  return state;
});
```

### 7.3. Selectors — выбирай только нужное

```tsx
// ХОРОШО — компонент ре-рендерится только при изменении user
const user = useAuthStore((state) => state.user);

// ХОРОШО — несколько значений через shallow
import { useShallow } from 'zustand/shallow';
const { user, isLoading } = useAuthStore(useShallow((s) => ({
  user: s.user,
  isLoading: s.isLoading,
})));

// ПЛОХО — весь store (ре-рендер при ЛЮБОМ изменении)
const store = useAuthStore();
```

### 7.4. Derived State — через selectors или useMemo

```ts
// В store — если используется в нескольких компонентах
export const useAuthStore = create<AuthState>()((set, get) => ({
  users: [],
  // Derived
  get activeUsers() {
    return get().users.filter(u => u.status === 'active');
  },
}));

// В компоненте — если используется в одном месте
const activeUsers = useMemo(
  () => users.filter(u => u.status === 'active'),
  [users]
);
```

---

## 8. HTTP & API

### 8.1. API Routes — Centralized

```ts
// api-routes.config.ts
export const ApiRoutes = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh-token',
  },
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
    ban: (id: string) => `/users/${id}/ban`,
  },
  listings: {
    list: '/listings',
    detail: (id: string) => `/listings/${id}`,
    approve: (id: string) => `/listings/${id}/approve`,
    reject: (id: string) => `/listings/${id}/reject`,
  },
  shops: {
    list: '/shops',
    detail: (id: string) => `/shops/${id}`,
  },
  categories: {
    list: '/categories',
    tree: '/categories/tree',
    detail: (id: string) => `/categories/${id}`,
  },
} as const;
```

### 8.2. HTTP Interceptor

Interceptor автоматически:
- Подставляет **base URL** ко всем запросам
- Добавляет **токен** из CookieService в заголовки
- Обрабатывает 401 → refresh token
- В сервисах пишем только путь из `ApiRoutes`

```ts
// http.interceptor.ts
import ky from 'ky';
import { CookieService } from '@app/services/cookie.service.js';
import { AppConfig } from '@app/config/app.config.js';

export const httpClient = ky.create({
  prefixUrl: AppConfig.apiBaseUrl,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = CookieService.getToken();
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          // refresh token logic
        }
      },
    ],
  },
});
```

### 8.3. Service Pattern

```ts
// user.service.ts
import { httpClient } from '@app/interceptors/http.interceptor.js';
import { ApiRoutes } from '@app/config/api-routes.config.js';
import type { UserInterface } from '@app/models/users/user.interface.js';
import type { PaginatedResponse } from '@app/models/common/pagination.interface.js';

export const UserService = {
  getUsers: async (params?: Record<string, string>): Promise<PaginatedResponse<UserInterface>> => {
    return httpClient.get(ApiRoutes.users.list, { searchParams: params }).json();
  },

  getUser: async (id: string): Promise<UserInterface> => {
    return httpClient.get(ApiRoutes.users.detail(id)).json();
  },

  banUser: async (id: string, reason: string): Promise<void> => {
    return httpClient.post(ApiRoutes.users.ban(id), { json: { reason } }).json();
  },
};
```

### 8.4. Error Handling

```ts
// В компоненте/хуке
try {
  const users = await UserService.getUsers();
  setUsers(users.data);
} catch (error) {
  if (error instanceof HTTPError) {
    const body = await error.response.json();
    toast.error(body.message || t('GENERAL.ERRORS.UNKNOWN'));
  }
}
```

---

## 9. SCSS ARCHITECTURE

### 9.1. Файлы

```
src/styles/
  _variables.scss    ← цвета, шрифты, breakpoints, тени, z-index
  _mixins.scss       ← flex-center, responsive, typography, hover, truncate
  _reset.scss        ← сброс стилей (*, body, a, ul, button)
  _typography.scss   ← шрифтовые стили
  _animations.scss   ← @keyframes
  _global.scss       ← body, scrollbar, selection, ::placeholder
  index.scss         ← @use всех файлов выше
```

### 9.2. Импорт в модулях

```scss
// ComponentName.module.scss
@use '@styles/variables' as *;
@use '@styles/mixins' as *;

.card {
  background: $surface;
  border-radius: $radius-md;
  @include flex-center;
}
```

### 9.3. Правила

- **CSS Modules** — каждый компонент имеет свой `.module.scss`
- **Никакого глобального CSS** кроме `src/styles/`
- **BEM не нужен** — CSS Modules изолируют стили
- **Переменные** — все цвета, размеры, тени в `_variables.scss`
- **Миксины** — повторяющиеся паттерны в `_mixins.scss`
- **Никаких `!important`** — кроме крайних случаев с третьесторонним CSS
- **Тема** — CSS custom properties (`--text`, `--bg`, `--border`), toggle через `data-theme` атрибут

---

## 10. I18N

### 10.1. Конфигурация

- 2 языка: `ru.json` (основной), `en.json`
- Один файл на язык, структурирован по модулям
- **Ключи — КАПСОМ**
- Язык хранится в **куках** (`CookieService.getLanguage()`)
- Никаких хардкод-строк — всё через `t()`

### 10.2. Структура ключей

```json
{
  "GENERAL": {
    "ACTIONS": {
      "SAVE": "Сохранить",
      "CANCEL": "Отмена",
      "DELETE": "Удалить",
      "SEARCH": "Поиск"
    },
    "STATUSES": {
      "ACTIVE": "Активный",
      "BLOCKED": "Заблокирован"
    }
  },
  "AUTH": {
    "LOGIN": "Войти",
    "TOASTER": {
      "LOGIN_SUCCESS": "Вы успешно вошли",
      "LOGIN_ERROR": "Неверный логин или пароль"
    }
  },
  "USERS": {
    "TITLE": "Пользователи",
    "FILTERS": { "BY_CITY": "По городу" },
    "TOASTER": { "BAN_SUCCESS": "Пользователь заблокирован" }
  }
}
```

### 10.3. Использование

```tsx
import { useTranslation } from 'react-i18next';

export function UsersPage() {
  const { t } = useTranslation();
  return <h1>{t('USERS.TITLE')}</h1>;
}
```

---

## 11. PERFORMANCE

### 11.1. Мемоизация

| Что | Когда |
|-----|-------|
| `useMemo` | Тяжёлые вычисления, фильтрация/сортировка массивов |
| `useCallback` | Обработчики, передаваемые в мемоизированные children |
| `React.memo` | Компоненты, которые ре-рендерятся часто с теми же props |

**Не мемоизируй всё подряд** — только когда есть измеримая проблема.

### 11.2. Lazy Loading

- Все страницы — через `React.lazy()` + `Suspense`
- Тяжёлые компоненты (графики, карты) — dynamic import
- Изображения — `loading="lazy"`

### 11.3. Virtual Scrolling

Для списков 100+ элементов — `react-window` или `react-virtuoso`.

### 11.4. Images

- WebP формат где возможно
- `loading="lazy"` на всех изображениях
- Placeholder/skeleton пока грузится
- Минимальное разрешение для товаров: 800×600

### 11.5. Zustand Selectors

Всегда выбирай только нужные поля из store — избегай лишних ре-рендеров.

---

## 12. АНТИ-ПАТТЕРНЫ

### 1. God Components (300+ строк)
```tsx
// ПЛОХО — всё в одном
function UserManagement() {
  // 500 строк: API, validation, state, UI
}
```
**Решение:** разбивай на компоненты + custom hooks

### 2. Prop Drilling (3+ уровней)
```tsx
// ПЛОХО
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <UserInfo user={user} />
```
**Решение:** Zustand store или React Context

### 3. Мутация состояния
```ts
// ПЛОХО
users.push(newUser);
user.name = 'new';

// ХОРОШО
setUsers([...users, newUser]);
setUser({ ...user, name: 'new' });
```

### 4. Magic Numbers/Strings
```ts
// ПЛОХО
if (user.role === 'admin') { }
setTimeout(fn, 5000);

// ХОРОШО
const UserRole = { Admin: 'admin' } as const;
const DEBOUNCE_MS = 5000;

if (user.role === UserRole.Admin) { }
setTimeout(fn, DEBOUNCE_MS);
```

### 5. console.log в production
```ts
// ПЛОХО
console.log('User data:', user);

// ХОРОШО — убирай или используй logger
if (import.meta.env.DEV) console.log('debug:', data);
```

### 6. useEffect как watcher
```tsx
// ПЛОХО — effect для синхронизации state
useEffect(() => {
  setFilteredUsers(users.filter(u => u.status === filter));
}, [users, filter]);

// ХОРОШО — useMemo
const filteredUsers = useMemo(
  () => users.filter(u => u.status === filter),
  [users, filter]
);
```

### 7. Fetch в рендере (без cleanup)
```tsx
// ПЛОХО — race condition, no cleanup
useEffect(() => {
  fetch('/api/users').then(r => r.json()).then(setUsers);
}, [id]);

// ХОРОШО — с AbortController
useEffect(() => {
  const controller = new AbortController();
  UserService.getUsers({ signal: controller.signal }).then(setUsers);
  return () => controller.abort();
}, [id]);
```

### 8. Inline styles
```tsx
// ПЛОХО
<div style={{ marginTop: 20, color: 'red' }}>

// ХОРОШО — CSS Module
<div className={styles.card}>
```

### 9. Хардкод API URL
```ts
// ПЛОХО
fetch('http://5.42.107.103:8081/api/v1/users');

// ХОРОШО — через interceptor + ApiRoutes
UserService.getUsers();
```

### 10. localStorage
```ts
// ПЛОХО
localStorage.setItem('token', token);

// ХОРОШО
CookieService.setToken(token);
```

### 11. Комментарии в коде
```ts
// ПЛОХО
// Получаем пользователя по ID
const user = await UserService.getUser(id);
/* TODO: добавить валидацию */

// ХОРОШО — код читается без комментариев
const user = await UserService.getUser(id);
```

---

## 13. ESLINT & PRETTIER

### 13.1. ESLint — строгая настройка

```js
// eslint.config.js (flat config — ESLint 9+)
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'import': importPlugin,
    },
    rules: {
      // TypeScript strict
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': ['error', {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      // No comments
      'no-warning-comments': ['error', { terms: ['todo', 'fixme', 'hack', 'xxx'] }],
      'capitalized-comments': 'off',
      'multiline-comment-style': 'off',

      // React
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-array-index-key': 'error',
      'react/jsx-no-target-blank': 'error',
      'react/self-closing-comp': 'error',
      'react/jsx-curly-brace-presence': ['error', 'never'],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Import
      'import/no-default-export': 'error',
      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
        'newlines-between': 'never',
      }],
      'import/no-duplicates': 'error',

      // General strict
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-nested-ternary': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'multi-line'],
      'no-else-return': 'error',
      'no-param-reassign': 'error',
      'no-magic-numbers': ['warn', {
        ignore: [0, 1, -1, 2],
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
      }],
    },
  },
];
```

**Ключевые правила:**

| Правило | Что делает |
|---------|-----------|
| `no-explicit-any` | Запрет `any` |
| `explicit-function-return-type` | Обязательный return type на экспортируемых функциях |
| `no-console` | Запрет console.log (warn/error разрешены) |
| `import/no-default-export` | Только named exports |
| `no-magic-numbers` | Запрет магических чисел |
| `consistent-type-imports` | `import type` для типов |
| `no-floating-promises` | Обязательный await или .catch() |
| `prefer-as-const` | Предпочитать `as const` |
| `no-param-reassign` | Запрет мутации аргументов |
| `react/no-array-index-key` | Запрет `key={index}` |

### 13.2. Prettier — единый стиль

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "all",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "printWidth": 100,
  "endOfLine": "lf",
  "jsxSingleQuote": false
}
```

### 13.3. Скрипты

```json
// package.json
{
  "scripts": {
    "lint": "eslint src/ --max-warnings 0",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write 'src/**/*.{ts,tsx,scss,json}'",
    "format:check": "prettier --check 'src/**/*.{ts,tsx,scss,json}'",
    "type-check": "tsc --noEmit",
    "check-all": "npm run type-check && npm run lint && npm run format:check"
  }
}
```

`--max-warnings 0` — ни одного warning не допускается.

### 13.4. .prettierignore

```
node_modules
dist
build
coverage
*.min.js
```

---

## 14. CODE REVIEW CHECKLIST

### Component Level
- [ ] Functional component (no classes)
- [ ] Named export (no default)
- [ ] Props interface отдельно
- [ ] useMemo для derived state
- [ ] useCallback для обработчиков (если передаётся в children)
- [ ] useEffect с cleanup
- [ ] Single responsibility (< 300 строк)
- [ ] Lazy-loaded если страница

### TypeScript Level
- [ ] Нет `any`
- [ ] Нет `@ts-ignore`
- [ ] Explicit return types на экспортируемых функциях
- [ ] `as const` вместо `enum`
- [ ] Readonly где возможно

### Store Level
- [ ] Immutable updates
- [ ] Selectors — выбирай только нужное
- [ ] Actions — имена описывают действие
- [ ] Нет бизнес-логики в компонентах — в store/service

### Service Level
- [ ] URL из `ApiRoutes` (не хардкод)
- [ ] Через `httpClient` (не голый fetch/ky)
- [ ] Типизированные request/response
- [ ] Error handling

### Style Level
- [ ] CSS Module (не inline, не global)
- [ ] Переменные из `_variables.scss`
- [ ] Нет `!important`
- [ ] Нет хардкод цветов — через CSS custom properties

### i18n Level
- [ ] Нет хардкод-строк
- [ ] Ключи КАПСОМ
- [ ] Перевод есть в ru.json и en.json

### General
- [ ] Нет комментариев в коде (ни `//`, ни `/* */`, ни JSDoc)
- [ ] Нет console.log (или только в DEV)
- [ ] Нет localStorage — только CookieService
- [ ] Нет дублирования кода
- [ ] Модели централизованы в `src/app/models/`
- [ ] Файл назван по конвенции (`имя.тип.ts`)
- [ ] Импорты с .js расширением
- [ ] `npm run lint` — 0 errors, 0 warnings
- [ ] `npm run format:check` — passes
- [ ] `npm run type-check` — passes

---

## WEBSOCKETS

Сервисы в `src/app/websockets/`:
- `chat.websocket.ts` — чат покупатель ↔ продавец
- `notification.websocket.ts` — уведомления в реальном времени

Требования:
- Авторизация по токену при подключении
- Auto-reconnect с exponential backoff
- Типизированные события (send/receive)
- Cleanup при unmount компонента

```ts
// Пример использования
const ws = new ChatWebSocket(CookieService.getToken());
ws.onMessage((msg: ChatMessageInterface) => { ... });
ws.send({ type: 'message', text: 'Привет' });

// В useEffect
useEffect(() => {
  const ws = new ChatWebSocket(token);
  ws.connect();
  return () => ws.disconnect();
}, [token]);
```

---

## GUARDS

### AuthGuard
Проверяет наличие токена. Нет токена → `/login`.

### ShopAccessGuard
Проверяет роль юзера в магазине: `owner`, `manager`, `employee`.

```tsx
// auth.guard.tsx
export function AuthGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

---

## CAPACITOR (Mobile)

React-приложение оборачивается в Capacitor для создания нативного APK/IPA:
- WebView-based — один код для web + mobile
- Нативные API: камера (загрузка фото товаров), push-notifications, геолокация
- Responsive design обязателен (320px+)

---

**Версия:** 1.0.0
**Дата:** 2026-04-07
