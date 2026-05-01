import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Config } from '@constants/config';
import type { Database } from '../types/database.types';

// SecureStore est limité à 2048 bytes par entrée.
// Les tokens Supabase dépassent cette limite → on découpe en chunks.
const CHUNK_SIZE = 1900;

const ChunkedSecureStore = {
  getItem: async (key: string): Promise<string | null> => {
    // Essai simple d'abord (valeur courte)
    const simple = await SecureStore.getItemAsync(key);
    if (simple !== null) return simple;
    // Reconstitution depuis les chunks
    const countStr = await SecureStore.getItemAsync(`${key}__n`);
    if (!countStr) return null;
    const count = parseInt(countStr, 10);
    const parts: string[] = [];
    for (let i = 0; i < count; i++) {
      const chunk = await SecureStore.getItemAsync(`${key}__${i}`);
      if (chunk === null) return null;
      parts.push(chunk);
    }
    return parts.join('');
  },

  setItem: async (key: string, value: string): Promise<void> => {
    if (value.length <= CHUNK_SIZE) {
      await SecureStore.setItemAsync(key, value);
      return;
    }
    // Supprime l'entrée simple si elle existait
    await SecureStore.deleteItemAsync(key);
    // Découpe et stocke les chunks
    const chunks: string[] = [];
    for (let i = 0; i < value.length; i += CHUNK_SIZE) {
      chunks.push(value.slice(i, i + CHUNK_SIZE));
    }
    for (let i = 0; i < chunks.length; i++) {
      await SecureStore.setItemAsync(`${key}__${i}`, chunks[i]);
    }
    await SecureStore.setItemAsync(`${key}__n`, String(chunks.length));
  },

  removeItem: async (key: string): Promise<void> => {
    await SecureStore.deleteItemAsync(key);
    const countStr = await SecureStore.getItemAsync(`${key}__n`);
    if (countStr) {
      const count = parseInt(countStr, 10);
      for (let i = 0; i < count; i++) {
        await SecureStore.deleteItemAsync(`${key}__${i}`);
      }
      await SecureStore.deleteItemAsync(`${key}__n`);
    }
  },
};

export const supabase = createClient<Database>(
  Config.supabaseUrl,
  Config.supabaseAnonKey,
  {
    auth: {
      storage: ChunkedSecureStore,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
