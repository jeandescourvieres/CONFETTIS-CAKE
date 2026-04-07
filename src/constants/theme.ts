// ═══════════════════════════════════════════════
//  Confettis & Cake — Design System Tokens
// ═══════════════════════════════════════════════

export const Colors = {
  // ── Primary (Rose Corail)
  primary: '#FF6B9D',
  primaryDim: '#e84f7d',
  primaryContainer: '#FFD6E8',
  primaryFixed: '#FFD6E8',
  primaryFixedDim: '#FFB3CE',
  onPrimary: '#fff5f8',
  onPrimaryContainer: '#6B0030',
  onPrimaryFixed: '#4A001F',
  onPrimaryFixedVariant: '#8C003A',

  // ── Secondary (Jaune)
  secondary: '#705900',
  secondaryDim: '#624d00',
  secondaryContainer: '#fdd34d',
  secondaryFixed: '#fdd34d',
  secondaryFixedDim: '#eec540',
  onSecondary: '#fff2d4',
  onSecondaryContainer: '#5c4900',
  onSecondaryFixed: '#463600',
  onSecondaryFixedVariant: '#675200',

  // ── Tertiary (Rose)
  tertiary: '#a7295a',
  tertiaryDim: '#971b4e',
  tertiaryContainer: '#ff8eaf',
  tertiaryFixed: '#ff8eaf',
  tertiaryFixedDim: '#ff75a2',
  onTertiary: '#ffeff1',
  onTertiaryContainer: '#552878',
  onTertiaryFixed: '#380017',
  onTertiaryFixedVariant: '#760038',

  // ── Error
  error: '#b41340',
  errorDim: '#a70138',
  errorContainer: '#f74b6d',
  onError: '#ffefef',
  onErrorContainer: '#510017',

  // ── Surface & Background
  background: '#faf4fc',
  surface: '#faf4fc',
  surfaceBright: '#faf4fc',
  surfaceDim: '#d8d2dd',
  surfaceVariant: '#e1dbe5',
  surfaceTint: '#FF6B9D',
  surfaceContainer: '#ece6ef',
  surfaceContainerLow: '#f5eff7',
  surfaceContainerHigh: '#e6e0ea',
  surfaceContainerHighest: '#e1dbe5',
  surfaceContainerLowest: '#ffffff',

  // ── On Surface
  onSurface: '#302e34',
  onSurfaceVariant: '#5d5a61',
  onBackground: '#302e34',

  // ── Outline
  outline: '#79757c',
  outlineVariant: '#b0abb3',

  // ── Inverse
  inverseSurface: '#0f0d13',
  inverseOnSurface: '#a09ba3',
  inversePrimary: '#FFD6E8',

  // ── Raccourcis utiles
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const Typography = {
  // Familles
  fontHeadline: 'PlusJakartaSans_800ExtraBold',
  fontHeadlineBold: 'PlusJakartaSans_700Bold',
  fontBody: 'BeVietnamPro_400Regular',
  fontBodyMedium: 'BeVietnamPro_500Medium',
  fontBodySemiBold: 'BeVietnamPro_600SemiBold',
  fontBodyBold: 'BeVietnamPro_700Bold',

  // Tailles
  xs: 10,
  sm: 11,
  base: 13,
  md: 14,
  lg: 15,
  xl: 17,
  '2xl': 20,
  '3xl': 22,
  '4xl': 26,
  '5xl': 28,
  '6xl': 32,
} as const;

export const Spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
} as const;

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#302e34',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

export const Gradients = {
  primary: ['#FF6B9D', '#FF8C42'] as const,
  primaryLight: ['#FF6B9D', '#FFD6E8'] as const,
  hero: ['#FF6B9D', '#FF8C42', '#FF6B9D'] as const,
  onboarding: ['#FF6B9D', '#e84f7d', '#FF8C42'] as const,
  secondary: ['#fdd34d', '#c97d10'] as const,
  surface: ['#FFE8F2', '#FFF5F8'] as const,
  success: ['#EAF3DE', '#f5eff7'] as const,
} as const;
