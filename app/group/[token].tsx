/**
 * Page publique de co-signature — accessible sans authentification.
 * URL : confettiscake://group/[token]
 *
 * Permet à n'importe qui (ayant reçu le lien) d'ajouter son prénom
 * comme co-signataire du message.
 */
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  useGroupMessageByToken,
  useAddSignature,
  formatSigners,
} from '../../src/hooks/useGroupMessages';
import { Colors, Typography, Spacing, Radii } from '../../src/constants/theme';

export default function GroupSignScreen() {
  const { t } = useTranslation();
  const { token } = useLocalSearchParams<{ token: string }>();
  const { data: group, isLoading, isError } = useGroupMessageByToken(token ?? null);
  const { mutateAsync: addSignature, isPending } = useAddSignature();

  const [name,    setName]    = useState('');
  const [note,    setNote]    = useState('');
  const [success, setSuccess] = useState(false);

  const signers = group?.signatures ?? [];
  const signersLabel = formatSigners(signers);

  const handleSign = async () => {
    if (!name.trim() || !group) return;
    await addSignature({
      groupMessageId: group.id,
      signerName:     name.trim(),
      signerNote:     note.trim() || undefined,
    });
    setSuccess(true);
  };

  // ── Chargement ───────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#9b6bb5" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !group) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorEmoji}>😕</Text>
          <Text style={styles.errorTitle}>{t('group.sign.errorTitle')}</Text>
          <Text style={styles.errorDesc}>{t('group.sign.errorDesc')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Succès ───────────────────────────────────────────────────────────────────

  if (success) {
    const [successBefore, successAfter] = t('group.sign.successDesc', { contactName: '{{contactName}}' }).split('{{contactName}}');
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>{t('group.sign.successTitle', { name })}</Text>
          <Text style={styles.successDesc}>
            {successBefore}
            <Text style={styles.bold}>{group.contact_name}</Text>
            {successAfter}
          </Text>
          {signers.length > 0 && (
            <View style={styles.signersPill}>
              <Text style={styles.signersText}>
                ✍️ {formatSigners([...signers, { signer_name: name } as any])}
              </Text>
            </View>
          )}
          <Text style={styles.footerNote}>{t('group.sign.footerNote')}</Text>
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
            <Text style={styles.appName}>🎂 ConfettiCake</Text>
          </View>

          {/* Carte principale */}
          <View style={styles.card}>
            <Text style={styles.cardEmoji}>✍️</Text>
            <Text style={styles.cardTitle}>{group.label}</Text>
            <Text style={styles.cardSub}>
              {t('group.sign.forContact')} <Text style={styles.bold}>{group.contact_name}</Text>
            </Text>

            {signers.length > 0 && (
              <View style={styles.alreadySigned}>
                <Text style={styles.alreadySignedText}>
                  {t('group.sign.alreadySigned', { count: signers.length })} — {signersLabel}
                </Text>
              </View>
            )}
          </View>

          {/* Formulaire */}
          <Text style={styles.label}>{t('group.sign.nameLabel')}</Text>
          <TextInput
            style={styles.input}
            placeholder="Marie"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
            maxLength={40}
            autoFocus
            returnKeyType="next"
          />

          <Text style={styles.label}>
            {t('group.sign.noteLabel')} <Text style={styles.optional}>({t('common.optional')})</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.inputMulti]}
            placeholder={t('group.sign.notePlaceholder')}
            placeholderTextColor="#aaa"
            value={note}
            onChangeText={setNote}
            maxLength={100}
            multiline
            returnKeyType="done"
          />

          <TouchableOpacity
            style={[styles.signBtn, !name.trim() && styles.signBtnDisabled]}
            onPress={handleSign}
            disabled={!name.trim() || isPending}
            activeOpacity={0.85}
          >
            {isPending
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={styles.signBtnText}>{t('group.sign.signBtn')}</Text>
            }
          </TouchableOpacity>

          <Text style={styles.disclaimer}>{t('group.sign.disclaimer')}</Text>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const PURPLE = '#9b6bb5';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f5ff' },
  content:   { padding: 24 },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },

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
  },
  bold: { fontFamily: 'PlusJakartaSans_700Bold', color: '#333' },

  alreadySigned: {
    marginTop: 8,
    backgroundColor: '#f0eaff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  alreadySignedText: {
    fontSize: 13,
    fontFamily: 'BeVietnamPro_400Regular',
    color: PURPLE,
  },

  label: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#333',
    marginBottom: 8,
  },
  optional: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    color: '#999',
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
  inputMulti: { height: 80, textAlignVertical: 'top' },

  signBtn: {
    backgroundColor: PURPLE,
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  signBtnDisabled: { backgroundColor: '#ccc' },
  signBtnText: {
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

  // Success
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
  signersPill: {
    backgroundColor: '#f0eaff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 8,
  },
  signersText: {
    fontSize: 14,
    fontFamily: 'BeVietnamPro_400Regular',
    color: PURPLE,
    textAlign: 'center',
  },
  footerNote: {
    fontSize: 13,
    fontFamily: 'BeVietnamPro_400Regular',
    color: '#aaa',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },

  // Error
  errorEmoji: { fontSize: 48, textAlign: 'center' },
  errorTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#333',
    textAlign: 'center',
  },
  errorDesc: {
    fontSize: 15,
    fontFamily: 'BeVietnamPro_400Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});
