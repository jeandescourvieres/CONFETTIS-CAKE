import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// expo-secure-store n'a pas d'implémentation web (getValueWithKeyAsync n'existe pas
// dans le shim navigateur) → on bascule sur localStorage côté web, et sur
// SecureStore côté natif (iOS/Android). Mêmes signatures que expo-secure-store.
export const getItemAsync = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    try { return globalThis.localStorage?.getItem(key) ?? null; } catch { return null; }
  }
  return SecureStore.getItemAsync(key);
};

export const setItemAsync = async (key: string, value: string): Promise<void> => {
  if (Platform.OS === 'web') {
    try { globalThis.localStorage?.setItem(key, value); } catch { /* silent */ }
    return;
  }
  await SecureStore.setItemAsync(key, value);
};

export const deleteItemAsync = async (key: string): Promise<void> => {
  if (Platform.OS === 'web') {
    try { globalThis.localStorage?.removeItem(key); } catch { /* silent */ }
    return;
  }
  await SecureStore.deleteItemAsync(key);
};
