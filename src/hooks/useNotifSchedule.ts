import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export type NotifPreset = 'max' | 'moderate' | 'minimal' | 'custom';

const KEY_PRESET = 'cc_notif_schedule_preset';
const KEY_CUSTOM = 'cc_notif_schedule_custom';

export const NOTIF_PRESETS: Record<NotifPreset, { label: string; sub: string; days: number[] }> = {
  max:      { label: 'Maximum',      sub: 'J-7, J-3, J-1 et Jour J', days: [7, 3, 1, 0] },
  moderate: { label: 'Modéré',       sub: 'J-7 et Jour J',           days: [7, 0] },
  minimal:  { label: 'Minimal',      sub: 'Jour J uniquement',        days: [0] },
  custom:   { label: 'Personnalisé', sub: 'Tes jours choisis',        days: [] },
};

export const CUSTOM_DAY_OPTIONS = [30, 14, 7, 3, 1, 0];

export function getActiveDays(preset: NotifPreset, customDays: number[]): number[] {
  if (preset === 'custom') return [...customDays].sort((a, b) => b - a);
  return NOTIF_PRESETS[preset].days;
}

export async function loadNotifSchedule(): Promise<{ preset: NotifPreset; customDays: number[] }> {
  try {
    const preset = (await SecureStore.getItemAsync(KEY_PRESET) ?? 'max') as NotifPreset;
    const raw = await SecureStore.getItemAsync(KEY_CUSTOM);
    const customDays: number[] = raw ? JSON.parse(raw) : [7, 0];
    return { preset, customDays };
  } catch {
    return { preset: 'max', customDays: [7, 0] };
  }
}

export async function saveNotifSchedule(preset: NotifPreset, customDays: number[]): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEY_PRESET, preset);
    await SecureStore.setItemAsync(KEY_CUSTOM, JSON.stringify(customDays));
  } catch { /* silent */ }
}

export function useNotifSchedule() {
  const [preset, setPreset]         = useState<NotifPreset>('max');
  const [customDays, setCustomDays] = useState<number[]>([7, 0]);
  const [loaded, setLoaded]         = useState(false);

  useEffect(() => {
    loadNotifSchedule().then(({ preset: p, customDays: cd }) => {
      setPreset(p);
      setCustomDays(cd);
      setLoaded(true);
    });
  }, []);

  const save = async (newPreset: NotifPreset, newCustomDays: number[]) => {
    setPreset(newPreset);
    setCustomDays(newCustomDays);
    await saveNotifSchedule(newPreset, newCustomDays);
  };

  return {
    preset,
    customDays,
    activeDays: getActiveDays(preset, customDays),
    loaded,
    save,
  };
}
