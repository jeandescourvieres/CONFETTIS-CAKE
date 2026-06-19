/**
 * Page publique de contribution au livre d'or — accessible sans authentification.
 * URL : confetticake://guestbook/[token]
 *
 * Permet à n'importe qui (ayant reçu le lien) de laisser un message.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../src/services/supabase';

const PURPLE = '#7B1FA2';

export default function GuestbookContributeScreen() {
  const { t } = useTranslation();
  const { token } = useLocalSearchParams<{ token: string }>();

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim() || !token) return;
    setIsPending(true);
    setError(null);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke('guestbook-contribute', {
        body: {
          token,
          contributor_name: name.trim(),
          message: message.trim(),
        },
      });
      if (fnErr) {
        let detail = (fnErr as Error).message ?? t('common.error');
        try {
          const ctx = (fnErr as unknown as { context?: unknown }).context;
          if (ctx && typeof (ctx as Response).json === 'function') {
            const body = await (ctx as Response).json();
            if (body?.error) detail = body.error;
          }
        } catch { /* ignore */ }
        throw new Error(detail);
      }
      if (data?.error) throw new Error(data.error);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.generic'));
    } finally {
      setIsPending(false);
    }
  };

  // ── Succès ───────────────────────────────────────────────────────────────────

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>{t('guestbook.contribute.successTitle', { name })}</Text>
          <Text style={styles.successDesc}>{t('guestbook.contribute.successDesc')}</Text>
          <View style={styles.footerBrand}>
            <Text style={styles.footerBrandText}>🎂 Confettis & Cake</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── Formulaire ───────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.appName}>🎂 Confettis & Cake</Text>
          </View>

          {/* Carte principale */}
          <View style={styles.card}>
            <Text style={styles.cardEmoji}>📒</Text>
            <Text style={styles.cardTitle}>{t('guestbook.contribute.cardTitle')}</Text>
            <Text style={styles.cardSub}>{t('guestbook.contribute.cardSub')}</Text>
          </View>

          {/* Formulaire */}
          <Text style={styles.label}>{t('guestbook.contribute.nameLabel')}</Text>
          <TextInput
            style={styles.input}
            placeholder="Marie"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
            maxLength={100}
            autoFocus
            returnKeyType="next"
          />

          <Text style={styles.label}>{t('guestbook.contribute.messageLabel')}</Text>
          <TextInput
            style={[styles.input, styles.inputMulti]}
            placeholder={t('guestbook.contribute.messagePlaceholder')}
            placeholderTextColor="#aaa"
            value={message}
            onChangeText={setMessage}
            maxLength={1000}
            multiline
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{message.length} / 1000</Text>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitBtn, (!name.trim() || !message.trim()) && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!name.trim() || !message.trim() || isPending}
            activeOpacity={0.85}
          >
            {isPending
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={styles.submitBtnText}>{t('guestbook.contribute.submitBtn')}</Text>
            }
          </TouchableOpacity>

          <Text style={styles.disclaimer}>{t('guestbook.contribute.disclaimer')}</Text>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f5ff' },
  content:   { padding: 24 },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },

  header: { alignItems: 'center', marginBottom: 24 },
  appName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 18,
    color: PURPLE,
    letterSpacing: 0.3,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    gap: 6,
  },
  cardEmoji: { fontSize: 36 },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 4,
  },
  cardSub: {
    fontSize: 15,
    fontFamily: 'BeVietnamPro_400Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },

  label: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0d4f0',
    padding: 14,
    fontSize: 16,
    fontFamily: 'BeVietnamPro_400Regular',
    color: '#333',
    marginBottom: 20,
  },
  inputMulti: { height: 120, textAlignVertical: 'top', marginBottom: 4 },
  charCount: {
    fontSize: 12,
    fontFamily: 'BeVietnamPro_400Regular',
    color: '#bbb',
    textAlign: 'right',
    marginBottom: 20,
  },

  errorBox: {
    backgroundColor: '#fff0f0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#e53935',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'BeVietnamPro_400Regular',
    color: '#c62828',
  },

  submitBtn: {
    backgroundColor: PURPLE,
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitBtnDisabled: { backgroundColor: '#ccc' },
  submitBtnText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },

  disclaimer: {
    fontSize: 12,
    fontFamily: 'BeVietnamPro_400Regular',
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 18,
  },

  successEmoji: { fontSize: 56, textAlign: 'center' },
  successTitle: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#333',
    textAlign: 'center',
  },
  successDesc: {
    fontSize: 16,
    fontFamily: 'BeVietnamPro_400Regular',
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
  },
  footerBrand: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#f0eaff',
    borderRadius: 20,
  },
  footerBrandText: {
    fontSize: 14,
    fontFamily: 'BeVietnamPro_400Regular',
    color: PURPLE,
  },
});
