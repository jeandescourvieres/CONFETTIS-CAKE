import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from '../../src/utils/storage';
import { useAuthStore } from '@stores/authStore';
import { useUIStore } from '@stores/uiStore';
import { Colors, Typography, Spacing, Radii } from '@constants/theme';
import { useThemeStore } from '../../src/stores/themeStore';

// ── Clés de stockage local ───────────────────────────────────────────────────
const KEY_EMAIL     = 'cc_last_email';
const KEY_FIRSTNAME = 'cc_last_firstname';

// ── Formules d'accueil alternées ─────────────────────────────────────────────
const GREETINGS = ['Bon retour', 'Heureux de te revoir'];

export default function LoginScreen() {
  const router    = useRouter();
  const appTheme  = useThemeStore((s) => s.theme);
  const { signInWithPassword, signInWithGoogle, resetPassword, isLoading } = useAuthStore();
  const showToast = useUIStore((s) => s.showToast);

  // ── State ──────────────────────────────────────────────────────────────────
  const [email,          setEmail]          = useState('');
  const [password,       setPassword]       = useState('');
  const [showPassword,   setShowPassword]   = useState(false);
  const [firstName,      setFirstName]      = useState<string | null>(null);
  const [greeting,       setGreeting]       = useState('');
  const [forgotMode,     setForgotMode]     = useState(false);
  const [forgotEmail,    setForgotEmail]    = useState('');
  const [forgotSent,     setForgotSent]     = useState(false);

  // ── Fade-in au montage ─────────────────────────────────────────────────────
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, delay: 100, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, delay: 100, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // ── Chargement des données stockées ───────────────────────────────────────
  useEffect(() => {
    (async () => {
      const [savedEmail, savedName] = await Promise.all([
        SecureStore.getItemAsync(KEY_EMAIL),
        SecureStore.getItemAsync(KEY_FIRSTNAME),
      ]);
      if (savedEmail) { setEmail(savedEmail); setForgotEmail(savedEmail); }
      if (savedName)  setFirstName(savedName);
      // Formule aléatoire
      setGreeting(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
    })();
  }, []);

  // ── Connexion ──────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!email.trim() || !password) {
      showToast('Remplis les deux champs', 'error');
      return;
    }
    try {
      await signInWithPassword(email.trim().toLowerCase(), password);
      // Sauvegarder email + prénom (extrait du full_name si dispo)
      await SecureStore.setItemAsync(KEY_EMAIL, email.trim().toLowerCase());
      const profile = useAuthStore.getState().profile;
      if (profile?.full_name) {
        const fn = profile.full_name.trim().split(' ')[0];
        if (fn) await SecureStore.setItemAsync(KEY_FIRSTNAME, fn);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Identifiants incorrects';
      showToast(msg, 'error');
    }
  };

  // ── Mot de passe oublié ────────────────────────────────────────────────────
  const handleForgot = async () => {
    const target = forgotEmail.trim().toLowerCase();
    if (!target || !target.includes('@')) {
      showToast('Saisis une adresse email valide', 'error');
      return;
    }
    try {
      await resetPassword(target);
      setForgotSent(true);
    } catch {
      showToast('Impossible d\'envoyer l\'email de réinitialisation', 'error');
    }
  };

  // ── Écran "mot de passe oublié" ────────────────────────────────────────────
  if (forgotMode) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

            <TouchableOpacity onPress={() => { setForgotMode(false); setForgotSent(false); }} style={styles.backRow}>
              <Text style={styles.backArrow}>‹</Text>
              <Text style={styles.backText}>Retour</Text>
            </TouchableOpacity>

            <Animated.View style={[styles.brandBlock, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <Text style={[styles.appName, { color: Colors.primary }]}>ConfettiCake</Text>
              <Text style={styles.appSub}>by Confettis & Cake</Text>
            </Animated.View>

            {forgotSent ? (
              <View style={styles.sentBox}>
                <Text style={styles.sentEmoji}>📬</Text>
                <Text style={styles.sentTitle}>Email envoyé !</Text>
                <Text style={styles.sentSub}>
                  Un lien de réinitialisation a été envoyé à{'\n'}
                  <Text style={{ color: Colors.primary, fontFamily: 'BeVietnamPro_700Bold' }}>{forgotEmail}</Text>
                </Text>
                <TouchableOpacity onPress={() => { setForgotMode(false); setForgotSent(false); }} style={styles.returnBtn}>
                  <Text style={[styles.returnBtnText, { color: Colors.primary }]}>Retour à la connexion</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.forgotTitle}>Mot de passe oublié ?</Text>
                <Text style={styles.forgotSub}>Saisis ton email — on t'envoie un lien pour en créer un nouveau.</Text>

                <TextInput
                  style={styles.input}
                  value={forgotEmail}
                  onChangeText={setForgotEmail}
                  placeholder="Ton adresse email"
                  placeholderTextColor={Colors.outlineVariant}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />

                <TouchableOpacity
                  style={[styles.mainBtn, { backgroundColor: Colors.primary }]}
                  onPress={handleForgot}
                  activeOpacity={0.85}
                >
                  <Text style={styles.mainBtnText}>Envoyer le lien</Text>
                </TouchableOpacity>
              </>
            )}

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ── Écran principal de connexion ──────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* ── Branding ──────────────────────────────── */}
          <Animated.View style={[styles.brandBlock, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <LinearGradient
              colors={appTheme.gradient}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.brandGradient}
            >
              <Text style={styles.appNameWhite}>ConfettiCake</Text>
              <Text style={styles.appSubWhite}>by Confettis & Cake</Text>
            </LinearGradient>
          </Animated.View>

          {/* ── Accueil personnalisé ───────────────────── */}
          <Animated.View style={[styles.greetingBlock, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.greetingTitle}>
              {greeting}{firstName ? ` ${firstName}` : ''} 👋
            </Text>
            <Text style={styles.greetingSub}>Connecte-toi à ton compte</Text>
          </Animated.View>

          {/* ── Google ────────────────────────────────── */}
          <TouchableOpacity style={styles.googleBtn} onPress={signInWithGoogle} activeOpacity={0.85} disabled={isLoading}>
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.googleLabel}>Continuer avec Google</Text>
          </TouchableOpacity>

          {/* ── Séparateur ────────────────────────────── */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou par email</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* ── Email ─────────────────────────────────── */}
          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="ton@email.com"
            placeholderTextColor={Colors.outlineVariant}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
          />

          {/* ── Mot de passe ───────────────────────────── */}
          <Text style={styles.fieldLabel}>Mot de passe</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={Colors.outlineVariant}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="current-password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          {/* ── Bouton principal ───────────────────────── */}
          <TouchableOpacity
            style={[styles.mainBtn, { backgroundColor: Colors.primary }, isLoading && { opacity: 0.6 }]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            <Text style={styles.mainBtnText}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Text>
          </TouchableOpacity>

          {/* ── Mot de passe oublié ────────────────────── */}
          <TouchableOpacity onPress={() => setForgotMode(true)} style={styles.forgotLink}>
            <Text style={styles.forgotLinkText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          {/* ── Pas encore de compte ──────────────────── */}
          <TouchableOpacity onPress={() => router.replace('/(auth)/onboarding' as never)} style={styles.signupLink}>
            <Text style={styles.signupText}>
              Pas encore de compte ?{'  '}
              <Text style={[styles.signupTextLink, { color: Colors.primary }]}>Je crée un compte</Text>
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing[6],
    paddingBottom: Spacing[8],
  },

  // ── Branding ──────────────────────────────────────────────────────────────
  brandBlock: {
    marginTop: Spacing[4],
    marginBottom: Spacing[5],
    borderRadius: Radii['2xl'],
    overflow: 'hidden',
  },
  brandGradient: {
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 4,
  },
  appNameWhite: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 36,
    color: '#fff',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  appSubWhite: {
    fontFamily: 'BeVietnamPro_300Light',
    fontStyle: 'italic',
    fontSize: Typography.md,
    color: 'rgba(255,255,255,0.88)',
    letterSpacing: 1.5,
  },
  appName: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 32,
    letterSpacing: -0.5,
  },
  appSub: {
    fontFamily: 'BeVietnamPro_300Light',
    fontStyle: 'italic',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.5,
    marginTop: 2,
  },

  // ── Accueil ───────────────────────────────────────────────────────────────
  greetingBlock: {
    marginBottom: Spacing[6],
  },
  greetingTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['3xl'],
    color: Colors.onSurface,
    marginBottom: 4,
  },
  greetingSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
  },

  // ── Google ────────────────────────────────────────────────────────────────
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[3],
    paddingVertical: 14,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.primaryContainer,
    backgroundColor: Colors.white,
    marginBottom: Spacing[5],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  googleG: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.xl,
    color: '#4285F4',
  },
  googleLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },

  // ── Séparateur ────────────────────────────────────────────────────────────
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[5],
  },
  dividerLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: Colors.primaryContainer,
  },
  dividerText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.outlineVariant,
  },

  // ── Champs ────────────────────────────────────────────────────────────────
  fieldLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 0.5,
    borderColor: Colors.primaryContainer,
    borderRadius: Radii.md,
    paddingVertical: 13,
    paddingHorizontal: 14,
    fontSize: Typography.md,
    fontFamily: 'BeVietnamPro_400Regular',
    color: Colors.onSurface,
    marginBottom: Spacing[4],
  },
  passwordRow: {
    position: 'relative',
    marginBottom: 0,
  },
  passwordInput: {
    paddingRight: 48,
    marginBottom: Spacing[4],
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  eyeIcon: {
    fontSize: 18,
  },

  // ── Bouton principal ──────────────────────────────────────────────────────
  mainBtn: {
    borderRadius: Radii.full,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: Spacing[4],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  mainBtnText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.lg,
    color: Colors.white,
    letterSpacing: 0.3,
  },

  // ── Liens bas de page ─────────────────────────────────────────────────────
  forgotLink: {
    alignItems: 'center',
    paddingVertical: Spacing[2],
    marginBottom: Spacing[3],
  },
  forgotLinkText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
    textDecorationLine: 'underline',
  },
  signupLink: {
    alignItems: 'center',
    paddingVertical: Spacing[2],
  },
  signupText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  signupTextLink: {
    fontFamily: 'BeVietnamPro_700Bold',
    textDecorationLine: 'underline',
  },

  // ── Écran mot de passe oublié ─────────────────────────────────────────────
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: Spacing[3],
    paddingBottom: Spacing[2],
  },
  backArrow: {
    fontSize: 28,
    color: Colors.primary,
    lineHeight: 30,
  },
  backText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.primary,
  },
  forgotTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    marginBottom: Spacing[2],
  },
  forgotSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: Spacing[5],
  },

  // ── Email envoyé ──────────────────────────────────────────────────────────
  sentBox: {
    alignItems: 'center',
    paddingTop: Spacing[8],
    gap: Spacing[3],
  },
  sentEmoji: { fontSize: 56 },
  sentTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
  },
  sentSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
  },
  returnBtn: { marginTop: Spacing[4] },
  returnBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    textDecorationLine: 'underline',
  },
});
