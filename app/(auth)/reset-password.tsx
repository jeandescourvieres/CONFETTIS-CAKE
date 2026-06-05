import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '../../src/services/supabase';
import { Colors, Typography, Spacing, Radii } from '../../src/constants/theme';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const establishSession = async (url: string) => {
      const hashIndex = url.indexOf('#');
      if (hashIndex !== -1) {
        const hash = url.substring(hashIndex + 1);
        const params = Object.fromEntries(new URLSearchParams(hash));
        if (params['access_token'] && params['refresh_token']) {
          await supabase.auth.setSession({
            access_token: params['access_token'],
            refresh_token: params['refresh_token'],
          });
        }
      }
      setSessionReady(true);
    };

    Linking.getInitialURL().then((url) => {
      if (url) establishSession(url);
      else setSessionReady(true);
    });

    const sub = Linking.addEventListener('url', ({ url }) => establishSession(url));
    return () => sub.remove();
  }, []);

  const handleSubmit = async () => {
    if (!sessionReady) {
      Alert.alert('Chargement', 'Session en cours d\'initialisation, réessaie dans un instant.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Mot de passe trop court', 'Minimum 8 caractères.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      Alert.alert('Succès !', 'Ton mot de passe a été mis à jour.', [
        { text: 'OK', onPress: () => router.replace('/(app)' as never) },
      ]);
    } catch (err) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Impossible de mettre à jour le mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.content}>
          <Text style={styles.emoji}>🔐</Text>
          <Text style={styles.title}>Nouveau mot de passe</Text>
          <Text style={styles.sub}>Choisis un mot de passe d'au moins 8 caractères.</Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputFlex}
              placeholder="Nouveau mot de passe"
              placeholderTextColor={Colors.outlineVariant}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn}>
              <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputFlex}
              placeholder="Confirmer le mot de passe"
              placeholderTextColor={Colors.outlineVariant}
              secureTextEntry={!showConfirm}
              value={confirm}
              onChangeText={setConfirm}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowConfirm(v => !v)} style={styles.eyeBtn}>
              <Text style={styles.eyeIcon}>{showConfirm ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>{loading ? 'Mise à jour...' : 'Valider'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, justifyContent: 'center', padding: Spacing[6], gap: 14 },
  emoji: { fontSize: 48, textAlign: 'center' },
  title: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography['2xl'], color: Colors.onSurface, textAlign: 'center' },
  sub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, textAlign: 'center', marginBottom: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.outline, borderRadius: Radii.md,
  },
  inputFlex: {
    flex: 1, padding: Spacing[3],
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurface,
  },
  eyeBtn: { paddingHorizontal: Spacing[3] },
  eyeIcon: { fontSize: 18 },
  btn: {
    backgroundColor: Colors.primary, borderRadius: Radii.md,
    padding: Spacing[4], alignItems: 'center', marginTop: 8,
  },
  btnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: '#fff' },
});
