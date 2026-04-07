// ═══════════════════════════════════════════════
//  Confettis & Cake — Configuration
// ═══════════════════════════════════════════════

export const Config = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
  posthogKey: process.env.EXPO_PUBLIC_POSTHOG_KEY ?? '',

  // Rappels anniversaires (jours avant)
  defaultReminderDaysBefore: 7,

  // Heure des rappels quotidiens (0-23)
  reminderHour: 9,

  // Pagination
  pageSize: 20,

  // Deep links
  appScheme: 'confettiscake',
  webBaseUrl: 'https://confettis-cake.app',
} as const;
