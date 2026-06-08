import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StripeProviderGate } from '../src/components/StripeProviderGate';
import { StatusBar } from 'expo-status-bar';
import '../src/i18n'; // initialise i18next (doit être importé tôt)
import i18n from '../src/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useFonts,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Pacifico_400Regular } from '@expo-google-fonts/pacifico';
import { Caveat_400Regular, Caveat_700Bold } from '@expo-google-fonts/caveat';
import { DancingScript_400Regular, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import { Satisfy_400Regular } from '@expo-google-fonts/satisfy';
import { PatrickHand_400Regular } from '@expo-google-fonts/patrick-hand';
import { SpecialElite_400Regular } from '@expo-google-fonts/special-elite';
import { Bangers_400Regular } from '@expo-google-fonts/bangers';
import { Merriweather_400Regular } from '@expo-google-fonts/merriweather';
import { loadAsync as loadFontAsync } from 'expo-font';
import { Oswald_400Regular } from '@expo-google-fonts/oswald';
import { RobotoSlab_400Regular } from '@expo-google-fonts/roboto-slab';
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';
import { PlayfairDisplay_400Regular } from '@expo-google-fonts/playfair-display';
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
import { useNavigationLogger } from '../src/hooks/useNavigationLogger';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      retry: 1,
    },
  },
});

function NavigationLogger() {
  useNavigationLogger();
  return null;
}

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

  // Gère le tap sur une notification push → deep link vers le bon écran
  useEffect(() => {
    if (!user) return;
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, unknown>;
      if (!data) return;
      // Notif J-1 avant envoi automatique → écran auto-sends pour annuler si besoin
      if (data.type === 'auto_send_preview' || data.type === 'auto_send') {
        router.push('/(app)/auto-sends/' as never);
      } else if (data.type === 'reaction') {
        router.push('/(app)/reactions' as never);
      }
    });
    return () => sub.remove();
  }, [user, router]);

  useEffect(() => {
    if (!isInitialized) return;
    const inAuthGroup = segments[0] === '(auth)';
    const inCardGroup     = segments[0] === 'card';
    const inGroupPage     = (segments[0] as string) === 'group';
    const inReactionPage  = (segments[0] as string) === 'reaction';
    const inGuestbookPage = (segments[0] as string) === 'guestbook';
    // Landing page publique sur le web — pas de redirection vers le login
    const inLandingPage   = Platform.OS === 'web' && (segments as readonly string[]).length === 0;
    if (!session && !inAuthGroup && !inCardGroup && !inGroupPage && !inReactionPage && !inGuestbookPage && !inLandingPage) {
      router.replace('/(auth)/login');
      onReady();
    } else if (session && inAuthGroup) {
      // Connexion depuis l'écran auth → toujours montrer le welcome
      _welcomeShown = true;
      router.replace('/welcome');
      onReady();
    } else if (session && !_welcomeShown && !inCardGroup && !inGroupPage && !inReactionPage && !inGuestbookPage) {
      // Démarrage à froid avec session déjà active → montrer le welcome
      _welcomeShown = true;
      router.replace('/welcome');
      onReady();
    } else {
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

  // Fonts custom (Windows TTF) — chargement non-bloquant
  useEffect(() => {
    loadFontAsync({
      TimesNewRoman:          require('../assets/fonts/TimesNewRoman.ttf'),
      ComicSansMS:            require('../assets/fonts/ComicSansMS.ttf'),
      Verdana:                require('../assets/fonts/Verdana.ttf'),
      BookAntiqua:            require('../assets/fonts/BookAntiqua.ttf'),
      Merriweather_400Regular: require('@expo-google-fonts/merriweather/400Regular/Merriweather_400Regular.ttf'),
      Oswald_400Regular:       require('@expo-google-fonts/oswald/400Regular/Oswald_400Regular.ttf'),
      RobotoSlab_400Regular:   require('@expo-google-fonts/roboto-slab/400Regular/RobotoSlab_400Regular.ttf'),
      SpaceMono_400Regular:    require('@expo-google-fonts/space-mono/400Regular/SpaceMono_400Regular.ttf'),
      PlayfairDisplay_400Regular: require('@expo-google-fonts/playfair-display/400Regular/PlayfairDisplay_400Regular.ttf'),
    }).catch(() => { /* silent — fonts non critiques */ });
  }, []);


  const [fontsLoaded] = useFonts({
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    Pacifico_400Regular,
    Caveat_400Regular,
    Caveat_700Bold,
    BeVietnamPro_300Light,
    BeVietnamPro_400Regular,
    BeVietnamPro_500Medium,
    BeVietnamPro_600SemiBold,
    BeVietnamPro_700Bold,
    DancingScript_400Regular,
    DancingScript_700Bold,
    Satisfy_400Regular,
    PatrickHand_400Regular,
    SpecialElite_400Regular,
    Bangers_400Regular,
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
    <StripeProviderGate>
      <QueryClientProvider client={queryClient}>
        <AuthGate onReady={() => setNavigationReady(true)} />
        <NavigationLogger />
        <LanguageSync />
        <StatusBar style="auto" backgroundColor={Colors.background} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="card/[id]" />
          <Stack.Screen name="reaction/[id]" />
          <Stack.Screen name="guestbook/[token]" />
        </Stack>
        <ToastRenderer />
      </QueryClientProvider>
    </StripeProviderGate>
  );
}
