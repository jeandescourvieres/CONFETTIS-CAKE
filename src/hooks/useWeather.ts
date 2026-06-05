// ═══════════════════════════════════════════════════════════════
//  useWeather — météo complète via expo-location + Open-Meteo
//  Open-Meteo : gratuit, sans clé API, RGPD-friendly
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export type HourlyWeather = { label: string; temp: number; emoji: string };
export type DailyWeather  = { label: string; min: number; max: number; emoji: string };

export type WeatherData = {
  temp:         number;
  apparentTemp: number;
  description:  string;
  emoji:        string;
  city:         string | null;
  hourly:       HourlyWeather[];
  daily:        DailyWeather[];
};

const DAY_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

function interpretWMO(code: number, isDay: boolean): { description: string; emoji: string } {
  if (code === 0)  return { description: 'Ciel dégagé',      emoji: isDay ? '☀️' : '🌙' };
  if (code <= 2)   return { description: 'Peu nuageux',      emoji: isDay ? '🌤️' : '🌙' };
  if (code === 3)  return { description: 'Nuageux',          emoji: '☁️' };
  if (code <= 49)  return { description: 'Brumeux',          emoji: '🌫️' };
  if (code <= 57)  return { description: 'Bruine',           emoji: '🌧️' };
  if (code <= 65)  return { description: 'Pluie',            emoji: '🌧️' };
  if (code <= 77)  return { description: 'Neige',            emoji: '❄️' };
  if (code <= 82)  return { description: 'Averses',          emoji: '🌦️' };
  if (code <= 86)  return { description: 'Averses de neige', emoji: '🌨️' };
  if (code <= 99)  return { description: 'Orage',            emoji: '⛈️' };
  return { description: 'Variable', emoji: '🌡️' };
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted' || cancelled) { setLoading(false); return; }

        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
        if (cancelled) return;

        const { latitude, longitude } = loc.coords;

        let city: string | null = null;
        try {
          const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
          city = place?.city ?? place?.subregion ?? place?.region ?? null;
        } catch { /* ville optionnelle */ }

        const url = [
          `https://api.open-meteo.com/v1/forecast`,
          `?latitude=${latitude.toFixed(4)}&longitude=${longitude.toFixed(4)}`,
          `&current=temperature_2m,apparent_temperature,weather_code,is_day`,
          `&hourly=temperature_2m,weather_code,is_day`,
          `&daily=temperature_2m_max,temperature_2m_min,weather_code`,
          `&timezone=auto&forecast_days=14`,
        ].join('');

        const res  = await fetch(url);
        if (!res.ok || cancelled) { setLoading(false); return; }
        const json = await res.json();

        // ── Météo actuelle ────────────────────────────────────────
        const temp         = Math.round(json.current?.temperature_2m ?? 0);
        const apparentTemp = Math.round(json.current?.apparent_temperature ?? temp);
        const code         = json.current?.weather_code ?? 0;
        const isDay        = (json.current?.is_day ?? 1) === 1;
        const { description, emoji } = interpretWMO(code, isDay);

        // ── Prévisions horaires (7 prochaines heures) ─────────────
        const hourlyTimes: string[] = json.hourly?.time ?? [];
        const hourlyTemps: number[] = json.hourly?.temperature_2m ?? [];
        const hourlyCodes: number[] = json.hourly?.weather_code ?? [];
        const hourlyIsDay: number[] = json.hourly?.is_day ?? [];

        const nowISO = new Date().toISOString().slice(0, 13);
        const startIdx = Math.max(0, hourlyTimes.findIndex((t: string) => t.startsWith(nowISO)));

        const hourly: HourlyWeather[] = Array.from({ length: 48 }, (_, i) => {
          const idx   = startIdx + i;
          const time  = hourlyTimes[idx] ?? '';
          const h     = time ? new Date(time).getHours() : 0;
          const label = i === 0 ? 'Maint.' : `${String(h).padStart(2, '0')}.00`;
          const t2    = Math.round(hourlyTemps[idx] ?? 0);
          const { emoji: e } = interpretWMO(hourlyCodes[idx] ?? 0, (hourlyIsDay[idx] ?? 1) === 1);
          return { label, temp: t2, emoji: e };
        });

        // ── Prévisions 7 jours ────────────────────────────────────
        const dailyTimes: string[] = json.daily?.time ?? [];
        const dailyMax:   number[] = json.daily?.temperature_2m_max ?? [];
        const dailyMin:   number[] = json.daily?.temperature_2m_min ?? [];
        const dailyCodes: number[] = json.daily?.weather_code ?? [];

        const daily: DailyWeather[] = dailyTimes.slice(0, 14).map((t: string, i: number) => {
          const dayOfWeek = new Date(t).getDay();
          const label = i === 0 ? 'Auj.' : i === 1 ? 'Dem.' : DAY_FR[dayOfWeek];
          return {
            label,
            max: Math.round(dailyMax[i] ?? 0),
            min: Math.round(dailyMin[i] ?? 0),
            emoji: interpretWMO(dailyCodes[i] ?? 0, true).emoji,
          };
        });

        if (!cancelled) setWeather({ temp, apparentTemp, description, emoji, city, hourly, daily });
      } catch {
        /* silencieux — météo optionnelle */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { weather, loading };
}
