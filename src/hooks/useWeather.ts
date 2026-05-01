// ═══════════════════════════════════════════════════════════════
//  useWeather — météo locale via expo-location + Open-Meteo
//  Open-Meteo : gratuit, sans clé API, RGPD-friendly
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export type WeatherData = {
  temp: number;          // °C arrondi
  description: string;  // ex: "Ensoleillé"
  emoji: string;
  city: string | null;
};

// Codes météo WMO → description + emoji
function interpretWMO(code: number, isDay: boolean): { description: string; emoji: string } {
  if (code === 0)  return { description: 'Ciel dégagé',    emoji: isDay ? '☀️' : '🌙' };
  if (code <= 2)   return { description: 'Peu nuageux',    emoji: isDay ? '🌤️' : '🌙' };
  if (code === 3)  return { description: 'Nuageux',        emoji: '☁️' };
  if (code <= 49)  return { description: 'Brumeux',        emoji: '🌫️' };
  if (code <= 57)  return { description: 'Bruine',         emoji: '🌧️' };
  if (code <= 65)  return { description: 'Pluie',          emoji: '🌧️' };
  if (code <= 77)  return { description: 'Neige',          emoji: '❄️' };
  if (code <= 82)  return { description: 'Averses',        emoji: '🌦️' };
  if (code <= 86)  return { description: 'Averses de neige', emoji: '🌨️' };
  if (code <= 99)  return { description: 'Orage',          emoji: '⛈️' };
  return { description: 'Variable', emoji: '🌡️' };
}

export function useWeather() {
  const [weather, setWeather]   = useState<WeatherData | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // 1. Permission localisation
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted' || cancelled) { setLoading(false); return; }

        // 2. Position (basse précision suffit, plus rapide)
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        });
        if (cancelled) return;

        const { latitude, longitude } = loc.coords;

        // 3. Géocodage inverse pour la ville
        let city: string | null = null;
        try {
          const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
          city = place?.city ?? place?.subregion ?? place?.region ?? null;
        } catch { /* ville optionnelle */ }

        // 4. Open-Meteo (aucune clé, HTTPS)
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude.toFixed(4)}&longitude=${longitude.toFixed(4)}&current=temperature_2m,weather_code,is_day&timezone=auto&forecast_days=1`;
        const res  = await fetch(url);
        if (!res.ok || cancelled) { setLoading(false); return; }
        const json = await res.json();

        const temp    = Math.round(json.current?.temperature_2m ?? 0);
        const code    = json.current?.weather_code ?? 0;
        const isDay   = (json.current?.is_day ?? 1) === 1;
        const { description, emoji } = interpretWMO(code, isDay);

        if (!cancelled) setWeather({ temp, description, emoji, city });
      } catch {
        /* silencieux — météo est optionnelle */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { weather, loading };
}
