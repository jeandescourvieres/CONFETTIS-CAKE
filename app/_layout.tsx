import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../src/i18n'; // initialise i18next (doit être importé tôt)
import i18n from '../src/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useFonts,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  BeVietnamPro_300Light,
  BeVietnamPro_400Regular,
  BeVietnamPro_500Medium,
  BeVietnamPro_600SemiBold,
  BeVietnamPro_700Bold,
} from '@expo-google-fonts/be-vietnam-pro';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useAuthStore } from '@stores/authStore';
import { Colors } from '@constants/theme';
import { useThemeStore } from '../src/stores/themeStore';
import { savePushToken } from '../src/services/pot.service';
import { ToastRenderer } from '../src/components/ui/Toast';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      retry: 1,
    },
  },
});

// Synchronise la langue i18n depuis le profil Supabase
function LanguageSync() {
  const profile = useAuthStore((s) => s.profile);
  useEffect(() => {
    if (profile?.language && profile.language !== i18n.language) {
      i18n.changeLanguage(profile.language);
    }
  }, [profile?.language]);
  return null;
}

// Variable module-level : survit aux re-renders et hot-reloads, reset au redémarrage complet
let _welcomeShown = false;

function AuthGate({ onReady }: { onReady: () => void }) {
  const { session, isInitialized, user } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // Register push token once the user is authenticated
  useEffect(() => {
    if (!user) return;
    (async () => {
      if (Platform.OS === 'web') return;
      // expo-notifications push tokens require a native build — skip in Expo Go
      if (Constants.appOwnership === 'expo') return;
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') return;
        const tokenData = await Notifications.getExpoPushTokenAsync().catch(() => null);
        if (tokenData?.data) {
          await savePushToken(user.id, tokenData.data).catch(() => {/* silent */});
        }
      } catch {
        // Silently ignore — notifications not critical in dev
      }
    })();
  }, [user]);

  useEffect(() => {
    if (!isInitialized) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!session && !inAuthGroup) {
      router.replace('/(auth)/onboarding');
      onReady();
    } else if (session && inAuthGroup) {
      if (!_welcomeShown) {
        _welcomeShown = true;
        router.replace('/welcome');
      } else {
        router.replace('/(app)');
      }
      onReady();
    } else if (session && !inAuthGroup) {
      // Déjà sur la bonne route — on peut afficher
      onReady();
    }
  }, [session, isInitialized, segments, router]);

  return null;
}

export default function RootLayout() {
  const initialize = useAuthStore((s) => s.initialize);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const loadTheme = useThemeStore((s) => s.loadTheme);
  const [navigationReady, setNavigationReady] = useState(false);

  useEffect(() => { loadTheme(); }, [loadTheme]);

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    BeVietnamPro_300Light,
    BeVietnamPro_400Regular,
    BeVietnamPro_500Medium,
    BeVietnamPro_600SemiBold,
    BeVietnamPro_700Bold,
  });

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Cacher le splash uniquement quand navigation + fonts + auth sont prêts
  useEffect(() => {
    if (fontsLoaded && isInitialized && navigationReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isInitialized, navigationReady]);

  if (!fontsLoaded || !isInitialized) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate onReady={() => setNavigationReady(true)} />
      <LanguageSync />
      <StatusBar style="auto" backgroundColor={Colors.background} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="welcome" />
      </Stack>
      <ToastRenderer />
    </QueryClientProvider>
  );
}
