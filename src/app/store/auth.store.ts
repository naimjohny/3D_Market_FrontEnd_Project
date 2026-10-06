/** Zustand-стор авторизации админа: флаг из наличия токена, синхронизация со StorageService. */

import { create } from 'zustand';
import type { AuthStoreInterface } from '@app/models/admin/admin.interface';
import { StorageService } from '@app/services/storage.service';

export const useAuthStore = create<AuthStoreInterface>()((set) => ({
  isAuthed: StorageService.getAdminToken() !== null,

  login: (token) => {
    StorageService.setAdminToken(token);
    set({ isAuthed: true });
  },

  logout: () => {
    StorageService.clearAdminToken();
    set({ isAuthed: false });
  },
}));
