import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Config } from '@constants/config';
import type { Database } from '../types/database.types';

// Adaptateur SecureStore pour que Supabase persiste la session
// de manière sécurisée sur l'appareil.
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient<Database>(
  Config.supabaseUrl,
  Config.supabaseAnonKey,
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
