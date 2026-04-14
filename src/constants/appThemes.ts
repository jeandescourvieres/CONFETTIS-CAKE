// ─────────────────────────────────────────────────────────────────────────────
//  Confettis & Cake — Thèmes couleur utilisateur
// ─────────────────────────────────────────────────────────────────────────────

export interface AppTheme {
  id: string;
  name: string;
  emoji: string;
  gradient: [string, string, string];   // hero + welcome
  primary: string;                       // boutons, badges, onglet actif
  primaryContainer: string;             // fonds clairs
}

export const APP_THEMES: AppTheme[] = [
  {
    id: 'rose',
    name: 'Rose',
    emoji: '🌸',
    gradient: ['#FF6B9D', '#E91E63', '#C2185B'],
    primary: '#E91E63',
    primaryContainer: '#FFD6E8',
  },
  {
    id: 'corail',
    name: 'Corail',
    emoji: '🧡',
    gradient: ['#FF6B6B', '#FF5722', '#E64A19'],
    primary: '#FF5722',
    primaryContainer: '#FFE0CC',
  },
  {
    id: 'soleil',
    name: 'Soleil',
    emoji: '🌅',
    gradient: ['#FFB300', '#F57C00', '#E65100'],
    primary: '#F57C00',
    primaryContainer: '#FFF3E0',
  },
  {
    id: 'ocean',
    name: 'Océan',
    emoji: '🔵',
    gradient: ['#1E88E5', '#1565C0', '#0D47A1'],
    primary: '#1E88E5',
    primaryContainer: '#BBDEFB',
  },
  {
    id: 'nature',
    name: 'Nature',
    emoji: '🌿',
    gradient: ['#43A047', '#2E7D32', '#1B5E20'],
    primary: '#43A047',
    primaryContainer: '#C8E6C9',
  },
  {
    id: 'prune',
    name: 'Prune',
    emoji: '🍇',
    gradient: ['#8E24AA', '#6A1B9A', '#4A148C'],
    primary: '#8E24AA',
    primaryContainer: '#E1BEE7',
  },
  {
    id: 'or',
    name: 'Or',
    emoji: '💛',
    gradient: ['#FFD740', '#FFC107', '#F9A825'],
    primary: '#F9A825',
    primaryContainer: '#FFF8E1',
  },
  {
    id: 'gris',
    name: 'Gris',
    emoji: '🩶',
    gradient: ['#78909C', '#607D8B', '#455A64'],
    primary: '#607D8B',
    primaryContainer: '#CFD8DC',
  },
  {
    id: 'noir',
    name: 'Noir',
    emoji: '🖤',
    gradient: ['#424242', '#212121', '#111111'],
    primary: '#212121',
    primaryContainer: '#E0E0E0',
  },
];

export const DEFAULT_THEME_ID = 'or';

export function getThemeById(id: string): AppTheme {
  return APP_THEMES.find((t) => t.id === id) ?? APP_THEMES[0];
}
