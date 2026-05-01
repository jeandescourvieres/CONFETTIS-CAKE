import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '../../src/services/supabase';
import { Colors, Typography } from '../../src/constants/theme';

// Cet écran intercepte le deep link confettiscake://auth/callback?access_token=...
// envoyé par Supabase après clic sur le magic link email

export default function AuthCallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    const handleUrl = async (url: string) => {
      // Supabase peut envoyer les tokens dans le fragment (#) ou les query params
      // On parse les deux sources
      const parsed = Linking.parse(url);
      const queryParams = parsed.queryParams ?? {};

      // Extraire le fragment manuellement (expo-linking ne le parse pas)
      const hashIndex = url.indexOf('#');
      const fragmentParams: Record<string, string> = {};
      if (hashIndex !== -1) {
        const fragment = url.slice(hashIndex + 1);
        fragment.split('&').forEach((pair) => {
          const [k, v] = pair.split('=');
          if (k && v) fragmentParams[decodeURIComponent(k)] = decodeURIComponent(v);
        });
      }

      const params = { ...fragmentParams, ...queryParams };
      const accessToken  = Array.isArray(params['access_token'])  ? params['access_token'][0]  : params['access_token'];
      const refreshToken = Array.isArray(params['refresh_token']) ? params['refresh_token'][0] : params['refresh_token'];

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!error) {
          router.replace('/(app)');
          return;
        }
      }

      // Fallback : Supabase onAuthStateChange peut gérer automatiquement
      setTimeout(() => router.replace('/(auth)/login'), 2000);
    };

    // URL d'ouverture initiale (app lancée via le lien)
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    // Écoute si l'app était déjà ouverte en arrière-plan
    const sub = Linking.addEventListener('url', ({ url }) => handleUrl(url));
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.text}>Connexion en cours...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  text: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
  },
});
