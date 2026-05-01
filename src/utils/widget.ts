/**
 * Met à jour le widget natif (Android + iOS) avec les prochains événements.
 * - Android : NativeModule WidgetDataModule → SharedPreferences
 * - iOS     : NativeModule WidgetDataBridge → App Groups UserDefaults → WidgetKit reload
 * Ne fait rien si le module natif n'est pas disponible (ex. Expo Go).
 */
import { NativeModules, Platform } from 'react-native';

export interface WidgetEvent {
  type: 'birthday' | 'nameday';
  name: string;
  days: number;
}

export async function updateWidget(events: WidgetEvent[]): Promise<void> {
  try {
    if (Platform.OS === 'android') {
      const mod = NativeModules.WidgetDataModule;
      if (mod?.setUpcomingEvents) await mod.setUpcomingEvents(events);
    } else if (Platform.OS === 'ios') {
      const mod = NativeModules.WidgetDataBridge;
      if (mod?.setUpcomingEvents) await mod.setUpcomingEvents(events);
    }
  } catch {
    // Silencieux — le widget se rafraîchira au prochain accès
  }
}

/** @deprecated Utilise updateWidget() */
export const updateAndroidWidget = updateWidget;
