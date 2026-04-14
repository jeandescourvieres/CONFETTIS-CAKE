import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { DEFAULT_THEME_ID, getThemeById, type AppTheme } from '../constants/appThemes';

const STORAGE_KEY = 'app_theme_id';

interface ThemeState {
  theme: AppTheme;
  setTheme: (id: string) => Promise<void>;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getThemeById(DEFAULT_THEME_ID),

  setTheme: async (id: string) => {
    const theme = getThemeById(id);
    set({ theme });
    try {
      await SecureStore.setItemAsync(STORAGE_KEY, id);
    } catch { /* silent */ }
  },

  loadTheme: async () => {
    try {
      const saved = await SecureStore.getItemAsync(STORAGE_KEY);
      if (saved) set({ theme: getThemeById(saved) });
    } catch { /* silent */ }
  },
}));
