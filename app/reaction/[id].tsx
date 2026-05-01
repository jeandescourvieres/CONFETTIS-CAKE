// ════════════════════════════════════════════════════════
//  Page publique — Laisser une réaction à un message
//  URL : https://confetticake.fr/reaction/{message_id}
//  Aucune authentification requise
// ════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Linking,
  Platform,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { createClient } from '@supabase/supabase-js';
import { Config } from '../../src/constants/config';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';

const supabase = createClient(Config.supabaseUrl, Config.supabaseAnonKey);

// ── Style & fond animé ─────────────────────────────────────────────────────────
const FONT_MAP: Record<string, string> = {
  standard:      'BeVietnamPro_400Regular',
  caveat_bold:   'Caveat_700Bold',
  dancing:       'DancingScript_400Regular',
  satisfy:       'Satisfy_400Regular',
  patrick:       'PatrickHand_400Regular',
  pacifico:      'Pacifico_400Regular',
  special_elite: 'SpecialElite_400Regular',
  bangers:       'Bangers_400Regular',
};

const SIZE_MAP: Record<string, number> = { sm: 15, md: 18, lg: 23 };

const BG_PARTICLES: Record<string, { color: string; emojis: string[] }> = {
  auto:      { color: '#F8E8FF', emojis: ['🎉','✨','🎊','⭐'] },
  birthday:  { color: '#FFF3E0', emojis: ['🎉','🎊','🥳','🎈'] },
  petales:   { color: '#FCE4EC', emojis: ['🌸','🌺','🌼','💐'] },
  flocons:   { color: '#E3F2FD', emojis: ['❄️','⛄','🌨','✨'] },
  coeurs:    { color: '#FCE4EC', emojis: ['💝','💖','❤️','💕'] },
  etoiles:   { color: '#F3E5F5', emojis: ['⭐','🌟','✨','💫'] },
};

function FloatingParticle({ emoji, delay, x }: { emoji: string; delay: number; x: number }) {
  const y       = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(y,       { toValue: -200, duration: 3200, useNativeDriver: false }),
          Animated.sequence([
            Animated.timing(opacity, { toValue: 0.8,  duration: 400,  useNativeDriver: false }),
            Animated.timing(opacity, { toValue: 0,    duration: 1200, delay: 1600, useNativeDriver: false }),
          ]),
        ]),
        Animated.parallel([
          Animated.timing(y,       { toValue: 0, duration: 0, useNativeDriver: false }),
          Animated.timing(opacity, { toValue: 0, duration: 0, useNativeDriver: false }),
        ]),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.Text style={{
      position: 'absolute', bottom: 0, left: x,
      fontSize: 18, opacity, transform: [{ translateY: y }],
      pointerEvents: 'none',
    }}>
      {emoji}
    </Animated.Text>
  );
}

const VALID_EMOJIS = ['❤️', '😂', '😍', '🙏', '😭', '🎉'];
const EMOJI_LABELS: Record<string, string> = {
  '❤️': 'Amour',
  '😂': 'Rires',
  '😍': 'Adoration',
  '🙏': 'Merci',
  '😭': 'Touché',
  '🎉': 'Bravo !',
};

const APP_STORE_URL   = 'https://apps.apple.com/app/confettis-cake';
const PLAY_STORE_URL  = 'https://play.google.com/store/apps/details?id=com.confettiscake.app';

type Step = 'loading' | 'error' | 'pick' | 'note' | 'done';

interface MessagePreview {
  id: string;
  contact_name: string;
  content: string;
  format: string;
  bg_theme:   string;
  font_style: string;
  font_size:  string;
  is_italic:  boolean;
}

export default function ReactionPage() {
  const { id: messageId } = useLocalSearchParams<{ id: string }>();

  const [step, setStep]         = useState<Step>('loading');
  const [message, setMessage]   = useState<MessagePreview | null>(null);
  const [emoji, setEmoji]       = useState<string>('');
  const [note, setNote]         = useState('');
  const [sending, setSending]   = useState(false);
  const [error, setError]       = useState('');

  // Charger le message (preview uniquement)
  useEffect(() => {
    if (!messageId) { setStep('error'); return; }
    supabase
      .from('messages')
      .select('id, contact_name, content, format, bg_theme, font_style, font_size, is_italic')
      .eq('id', messageId)
      .single()
      .then(({ data, error: err }) => {
        if (err || !data) { setStep('error'); return; }
        setMessage(data as MessagePreview);
        setStep('pick');
      });
  }, [messageId]);

  const handlePickEmoji = (e: string) => {
    setEmoji(e);
    setStep('note');
  };

  const handleSend = async () => {
    if (!emoji || !messageId) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch(`${Config.supabaseUrl}/functions/v1/handle-reaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Config.supabaseAnonKey}`,
        },
        body: JSON.stringify({ message_id: messageId, emoji, note: note.trim() || undefined }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? 'Une erreur est survenue.');
        setSending(false);
        return;
      }
      setStep('done');
    } catch {
      setError('Impossible d\'envoyer la réaction. Vérifie ta connexion.');
    } finally {
      setSending(false);
    }
  };

  const FORMAT_EMOJI: Record<string, string> = { song: '🎵', poem: '✍️', message: '💬', joke: '✨' };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (step === 'loading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#9b6bb5" size="large" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (step === 'error' || !message) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorTitle}>Message introuvable</Text>
        <Text style={styles.errorSub}>Ce lien est peut-être expiré ou invalide.</Text>
      </View>
    );
  }

  // ── Done ─────────────────────────────────────────────────────────────────────
  if (step === 'done') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.doneScroll}>
          <View style={styles.doneBadge}>
            <Text style={styles.doneBigEmoji}>{emoji}</Text>
          </View>
          <Text style={styles.doneTitle}>Réaction envoyée ! 🎉</Text>
          <Text style={styles.doneSub}>
            L'auteur du message a été notifié de ta réaction.{note.trim() ? `\n\n"${note.trim()}"` : ''}
          </Text>

          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Crée tes propres messages ✨</Text>
            <Text style={styles.ctaSub}>
              Anniversaires, fêtes, remerciements — génère en 30 secondes un message unique avec l'IA.
            </Text>
            <TouchableOpacity
              style={styles.ctaBtn}
              onPress={() => {
                const url = Platform.OS === 'ios' ? APP_STORE_URL : PLAY_STORE_URL;
                Linking.openURL(url).catch(() => {});
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaBtnText}>Télécharger l'app — gratuit 🎂</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Pick emoji ───────────────────────────────────────────────────────────────
  if (step === 'pick') {
    const preview = message.content.slice(0, 120) + (message.content.length > 120 ? '…' : '');
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>🎊</Text>
            <Text style={styles.headerTitle}>ConfettiCake</Text>
            <Text style={styles.headerSub}>Tu as reçu un message !</Text>
          </View>

          {/* Aperçu du message — fond animé + style police */}
          {(() => {
            const bg     = BG_PARTICLES[message.bg_theme] ?? null;
            const mFont  = FONT_MAP[message.font_style]  ?? 'BeVietnamPro_400Regular';
            const mSize  = SIZE_MAP[message.font_size]   ?? 18;
            const italic = message.is_italic ? 'italic' : 'normal';
            return (
              <View style={[styles.messagePreview, bg && { backgroundColor: bg.color, overflow: 'hidden' }]}>
                {bg && bg.emojis.map((e, i) => (
                  <FloatingParticle key={i} emoji={e} delay={i * 750} x={16 + i * 60} />
                ))}
                <Text style={styles.messagePreviewLabel}>
                  {FORMAT_EMOJI[message.format] ?? '💬'} Pour {message.contact_name}
                </Text>
                <Text style={[styles.messagePreviewText, {
                  fontFamily: mFont,
                  fontSize:   mSize,
                  lineHeight: mSize * 1.6,
                  fontStyle:  italic as 'normal' | 'italic',
                }]}>
                  {preview}
                </Text>
              </View>
            );
          })()}

          {/* Invite à réagir */}
          <Text style={styles.pickTitle}>Comment tu l'as trouvé ? 🥹</Text>
          <Text style={styles.pickSub}>Choisis une réaction — l'auteur sera notifié !</Text>

          <View style={styles.emojiGrid}>
            {VALID_EMOJIS.map((e) => (
              <TouchableOpacity
                key={e}
                style={styles.emojiBtn}
                onPress={() => handlePickEmoji(e)}
                activeOpacity={0.7}
              >
                <Text style={styles.emojiBig}>{e}</Text>
                <Text style={styles.emojiLabel}>{EMOJI_LABELS[e]}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* CTA téléchargement */}
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Envoie toi aussi des messages uniques ✨</Text>
            <Text style={styles.ctaSub}>Anniversaires, poèmes, chansons — générés par IA en 30 secondes.</Text>
            <TouchableOpacity
              style={styles.ctaBtn}
              onPress={() => {
                const url = Platform.OS === 'ios' ? APP_STORE_URL : PLAY_STORE_URL;
                Linking.openURL(url).catch(() => {});
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaBtnText}>Télécharger l'app — gratuit 🎂</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Note optionnelle ─────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>{emoji}</Text>
            <Text style={styles.headerTitle}>Super choix !</Text>
            <Text style={styles.headerSub}>Ajoute un mot si tu veux 💛</Text>
          </View>

          <View style={styles.noteCard}>
            <Text style={styles.noteCardTitle}>Un petit mot ? (optionnel)</Text>
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={(v) => setNote(v.slice(0, 200))}
              placeholder="Ex: Trop beau ce message ! Merci..."
              placeholderTextColor={Colors.outlineVariant}
              multiline
              maxLength={200}
              textAlignVertical="top"
              autoFocus
            />
            <Text style={styles.noteCount}>{note.length}/200</Text>
          </View>

          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>⚠️ {error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.sendBtn, sending && { opacity: 0.6 }]}
            onPress={handleSend}
            disabled={sending}
            activeOpacity={0.85}
          >
            {sending
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={styles.sendBtnText}>{emoji} Envoyer ma réaction</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipBtn}
            onPress={handleSend}
            disabled={sending}
          >
            <Text style={styles.skipBtnText}>Envoyer sans message →</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[6],
    gap: 16,
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
  },
  errorEmoji: { fontSize: 52 },
  errorTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    textAlign: 'center',
  },
  errorSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },

  scroll: {
    paddingBottom: 40,
    gap: 20,
  },

  header: {
    alignItems: 'center',
    paddingTop: Spacing[6],
    paddingBottom: Spacing[4],
    paddingHorizontal: Spacing[4],
    gap: 6,
    backgroundColor: '#9b6bb5',
  },
  headerEmoji: { fontSize: 52 },
  headerTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['3xl'],
    color: Colors.white,
    textAlign: 'center',
  },
  headerSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },

  messagePreview: {
    marginHorizontal: Spacing[4],
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    paddingBottom: Spacing[6],
    gap: 8,
    minHeight: 120,
    position: 'relative',
    ...Shadows.sm,
  },
  messagePreviewLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    color: '#9b6bb5',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  messagePreviewText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 24,
  },

  pickTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    textAlign: 'center',
    marginTop: Spacing[2],
    paddingHorizontal: Spacing[4],
  },
  pickSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    paddingHorizontal: Spacing[4],
    marginBottom: Spacing[2],
  },

  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: Spacing[4],
  },
  emojiBtn: {
    width: 90,
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    paddingVertical: 14,
    paddingHorizontal: 10,
    ...Shadows.sm,
  },
  emojiBig: { fontSize: 36 },
  emojiLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },

  ctaCard: {
    marginHorizontal: Spacing[4],
    backgroundColor: '#F3E5F5',
    borderRadius: Radii.xl,
    padding: Spacing[4],
    gap: 10,
  },
  ctaTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: '#6A1B9A',
    textAlign: 'center',
  },
  ctaSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  ctaBtn: {
    backgroundColor: '#9b6bb5',
    borderRadius: Radii.full,
    paddingVertical: 13,
    alignItems: 'center',
    ...Shadows.md,
  },
  ctaBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.white,
  },

  // ── Note ─────────────────────────────────────────────────────────────────────
  noteCard: {
    marginHorizontal: Spacing[4],
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    gap: 10,
    ...Shadows.sm,
  },
  noteCardTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  noteInput: {
    borderWidth: 1.5,
    borderColor: '#D1C4E9',
    borderRadius: Radii.lg,
    padding: Spacing[3],
    minHeight: 100,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 24,
  },
  noteCount: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.outlineVariant,
    textAlign: 'right',
  },

  errorBanner: {
    marginHorizontal: Spacing[4],
    backgroundColor: '#FFF3F3',
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
    borderRadius: Radii.md,
    padding: 12,
  },
  errorBannerText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.error,
  },

  sendBtn: {
    marginHorizontal: Spacing[4],
    backgroundColor: '#9b6bb5',
    borderRadius: Radii.full,
    paddingVertical: 16,
    alignItems: 'center',
    ...Shadows.md,
  },
  sendBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.lg,
    color: Colors.white,
  },
  skipBtn: {
    alignSelf: 'center',
    paddingVertical: 10,
  },
  skipBtnText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    textDecorationLine: 'underline',
  },

  // ── Done ─────────────────────────────────────────────────────────────────────
  doneScroll: {
    paddingBottom: 40,
    gap: 24,
    alignItems: 'center',
    paddingTop: Spacing[8],
    paddingHorizontal: Spacing[4],
  },
  doneBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F3E5F5',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  doneBigEmoji: { fontSize: 52 },
  doneTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['3xl'],
    color: Colors.onSurface,
    textAlign: 'center',
  },
  doneSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
});
