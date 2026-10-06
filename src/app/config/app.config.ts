/** Глобальная конфигурация приложения: базовый URL API (Go-бэкенд), контакты, лимиты. */

const envApiUrl: string | undefined = import.meta.env.VITE_API_URL;
const envUseMocks: string | undefined = import.meta.env.VITE_USE_MOCKS;

export const AppConfig = {
  apiBaseUrl: envApiUrl ?? 'http://localhost:8090/api/v1',
  siteUrl: 'https://forma3d-studio.netlify.app',
  useMocks: envUseMocks === 'true',
  email: 'hello@forma3d.studio',
  telegram: 'https://t.me/forma3d',
  socials: {
    behance: 'https://behance.net/forma3d',
    instagram: 'https://instagram.com/forma3d',
    artstation: 'https://artstation.com/forma3d',
  },
  maxUploadBytes: 52_428_800,
} as const;
