import { useMemo } from 'react';
import { Colors } from '../constants/theme';
import { useThemeStore } from '../stores/themeStore';

/** Retourne true si la couleur hex est perceptuellement claire (luminance > 0.5) */
function isLight(hex: string): boolean {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  // Luminance perceptuelle (formule WCAG)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.45;
}

export function useColors() {
  const primary = useThemeStore((s) => s.theme.primary);
  const primaryContainer = useThemeStore((s) => s.theme.primaryContainer);
  const gradient = useThemeStore((s) => s.theme.gradient);
  return useMemo(() => ({
    ...Colors,
    primary,
    primaryContainer,
    primaryDim: primary,
    surfaceTint: primary,
    gradient: gradient as [string, string, ...string[]],
    // Texte lisible sur fond primary (noir si couleur claire, blanc sinon)
    onPrimary: isLight(primary) ? '#1A1A1A' : '#FFFFFF',
  }), [primary, primaryContainer, gradient]);
}
