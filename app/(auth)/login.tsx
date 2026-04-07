import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@stores/authStore';
import { useUIStore } from '@stores/uiStore';
import { Button } from '@components/ui';
import { Colors, Typography, Spacing, Radii } from '@constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const { signInWithEmail, signInWithGoogle, signInWithApple, isLoading } = useAuthStore();
  const showToast = useUIStore((s) => s.showToast);
  const router = useRouter();

  const handleEmailLogin = async () => {
    if (!email.trim() || !email.includes('@')) {
      showToast('Adresse email invalide', 'error');
      return;
    }
    try {
      await signInWithEmail(email.trim());
      setEmailSent(true);
    } catch {
      showToast('Erreur lors de l\'envoi du lien', 'error');
    }
  };

  if (emailSent) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.emoji}>📬</Text>
        <Text style={styles.title}>Vérifiez vos emails</Text>
        <Text style={styles.subtitle}>
          Un lien de connexion a été envoyé à{'\n'}
          <Text style={{ color: Colors.primary, fontFamily: 'BeVietnamPro_700Bold' }}>{email}</Text>
        </Text>
        <TouchableOpacity onPress={() => setEmailSent(false)} style={styles.backLink}>
          <Text style={styles.backLinkText}>← Utiliser un autre email</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.brand}>Confettis & Cake</Text>
          <Text style={styles.title}>On commence ! 🎉</Text>
          <Text style={styles.subtitle}>Créez votre compte gratuitement — aucune carte requise</Text>
        </View>

        {/* Google */}
        <TouchableOpacity style={styles.socialBtn} onPress={signInWithGoogle} disabled={isLoading}>
          <Text style={styles.socialIcon}>G</Text>
          <Text style={styles.socialLabel}>Continuer avec Google</Text>
        </TouchableOpacity>

        {/* Apple */}
        <TouchableOpacity style={[styles.socialBtn, styles.applBtn]} onPress={signInWithApple} disabled={isLoading}>
          <Text style={[styles.socialIcon, { color: Colors.white }]}>🍎</Text>
          <Text style={[styles.socialLabel, { color: Colors.white }]}>Continuer avec Apple</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou par email</Text>
          <View style={styles.dividerLine} />
        </View>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Votre adresse email"
          placeholderTextColor={Colors.outlineVariant}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          returnKeyType="done"
          onSubmitEditing={handleEmailLogin}
        />

        <Button
          label="Créer mon compte gratuitement"
          onPress={handleEmailLogin}
          loading={isLoading}
          disabled={!email.trim()}
          size="lg"
        />

        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: Spacing[4] }}>
          <Text style={styles.backLinkText}>
            Déjà un compte ?{' '}
            <Text style={{ color: Colors.primary, fontFamily: 'BeVietnamPro_700Bold' }}>
              Se connecter
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: Spacing[6],
    paddingTop: Spacing[10],
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[6],
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing[7],
  },
  brand: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['4xl'],
    color: Colors.primary,
    fontStyle: 'italic',
    marginBottom: Spacing[1],
  },
  title: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['3xl'],
    color: Colors.onSurface,
    marginBottom: Spacing[2],
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  emoji: {
    fontSize: 64,
    marginBottom: Spacing[4],
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[3],
    paddingVertical: 13,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.primaryContainer,
    backgroundColor: Colors.white,
    marginBottom: Spacing[3],
  },
  applBtn: {
    backgroundColor: Colors.onSurface,
    borderColor: Colors.onSurface,
    marginBottom: Spacing[4],
  },
  socialIcon: {
    fontSize: 18,
    fontFamily: 'BeVietnamPro_700Bold',
    color: Colors.onSurface,
  },
  socialLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[4],
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
  input: {
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 0.5,
    borderColor: Colors.primaryContainer,
    borderRadius: Radii.md,
    padding: 12,
    fontSize: Typography.md,
    fontFamily: 'BeVietnamPro_400Regular',
    color: Colors.onSurface,
    marginBottom: Spacing[3],
  },
  backLink: {
    marginTop: Spacing[5],
  },
  backLinkText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
