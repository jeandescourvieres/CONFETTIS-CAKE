import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContact } from '../../../src/hooks/useContacts';
import { useContactMessages } from '../../../src/hooks/useAIGenerate';
import { BackHeader } from '../../../src/components/ui/BackHeader';
import { Colors, Typography, Spacing, Radii } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import type { Message, MessageFormat, MessageTone } from '../../../src/types/models';

// ── Labels ────────────────────────────────────────────────────────────────────

const FORMAT_EMOJI: Record<string, string> = {
  song: '🎵', poem: '✍️', message: '💬', joke: '✨',
};
const FORMAT_LABEL: Record<string, string> = {
  song: 'Chanson', poem: 'Poème', message: 'Message', joke: 'Humour',
};
const TONE_LABEL: Record<string, string> = {
  humorous: 'Humoristique', touching: 'Touchant', poetic: 'Poétique',
  playful: 'Ludique', professional: 'Professionnel',
};
const VIA_LABEL: Record<string, string> = {
  sms: '📱 SMS', email: '📧 Email', whatsapp: '💬 WhatsApp', copy: '📋 Copié',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateLong(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function getYear(iso: string): string {
  try { return String(new Date(iso).getFullYear()); } catch { return '—'; }
}

function groupByYear(messages: Message[]): Record<string, Message[]> {
  const groups: Record<string, Message[]> = {};
  for (const m of messages) {
    const y = getYear(m.created_at);
    if (!groups[y]) groups[y] = [];
    groups[y].push(m);
  }
  return groups;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ContactTimelineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const C       = useColors();
  const styles  = useMemo(() => makeStyles(C), [C]);

  const { data: contact } = useContact(id);
  const { data: messages = [], isLoading } = useContactMessages(id ?? null);

  // Groupés par année, années décroissantes
  const grouped = useMemo(() => groupByYear(messages), [messages]);
  const years   = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  const sentCount  = messages.filter((m) => m.status === 'sent').length;
  const draftCount = messages.filter((m) => m.status === 'draft').length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>📜</Text>
          <Text style={styles.heroTitle}>
            Historique{contact ? ` — ${contact.name.split(' ')[0]}` : ''}
          </Text>
          {messages.length > 0 && (
            <Text style={styles.heroSub}>
              {messages.length} message{messages.length > 1 ? 's' : ''}
              {sentCount > 0 ? ` · ${sentCount} envoyé${sentCount > 1 ? 's' : ''}` : ''}
              {draftCount > 0 ? ` · ${draftCount} brouillon${draftCount > 1 ? 's' : ''}` : ''}
            </Text>
          )}
        </View>

        {/* Loading */}
        {isLoading && (
          <Text style={styles.emptyText}>Chargement...</Text>
        )}

        {/* Empty */}
        {!isLoading && messages.length === 0 && (
          <View style={styles.emptyBlock}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyTitle}>Aucun message pour l'instant</Text>
            <Text style={styles.emptyDesc}>
              Les messages que tu crées pour {contact?.name.split(' ')[0] ?? 'ce contact'} apparaîtront ici, année par année.
            </Text>
            <TouchableOpacity
              style={[styles.ctaBtn, { backgroundColor: C.primary }]}
              onPress={() => router.push({
                pathname: '/(app)/create/',
                params: { contactId: id },
              } as never)}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaBtnText}>✨ Créer un premier message</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Timeline par année */}
        {years.map((year) => (
          <View key={year}>
            {/* Séparateur année */}
            <View style={styles.yearRow}>
              <View style={[styles.yearLine, { backgroundColor: C.primaryContainer }]} />
              <View style={[styles.yearPill, { backgroundColor: C.primaryContainer }]}>
                <Text style={[styles.yearLabel, { color: C.primary }]}>{year}</Text>
              </View>
              <View style={[styles.yearLine, { backgroundColor: C.primaryContainer }]} />
            </View>

            {grouped[year].map((msg) => (
              <TouchableOpacity
                key={msg.id}
                style={styles.card}
                activeOpacity={0.75}
                onPress={() => router.push(`/(app)/message/${msg.id}` as never)}
              >
                {/* Ligne du haut : emoji format + label + badge status */}
                <View style={styles.cardTop}>
                  <Text style={styles.cardEmoji}>
                    {FORMAT_EMOJI[msg.format] ?? '💬'}
                  </Text>
                  <View style={styles.cardMeta}>
                    <Text style={styles.cardFormat}>
                      {FORMAT_LABEL[msg.format] ?? msg.format}
                      {msg.tone ? ` · ${TONE_LABEL[msg.tone] ?? msg.tone}` : ''}
                    </Text>
                    <Text style={styles.cardDate}>{formatDateLong(msg.created_at)}</Text>
                  </View>
                  <View style={[
                    styles.statusPill,
                    msg.status === 'sent'
                      ? { backgroundColor: '#E8F5E9' }
                      : { backgroundColor: Colors.surfaceContainer },
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: msg.status === 'sent' ? '#388E3C' : Colors.onSurfaceVariant },
                    ]}>
                      {msg.status === 'sent' ? '✅ Envoyé' : '✏️ Brouillon'}
                    </Text>
                  </View>
                </View>

                {/* Aperçu du contenu */}
                <Text style={styles.cardContent} numberOfLines={2}>
                  {msg.content}
                </Text>

                {/* Pied de carte : via + musique */}
                {(msg.sent_via || msg.audio_url) && (
                  <View style={styles.cardFooter}>
                    {msg.sent_via && (
                      <Text style={styles.cardVia}>{VIA_LABEL[msg.sent_via] ?? msg.sent_via}</Text>
                    )}
                    {msg.audio_url && (
                      <Text style={styles.cardAudio}>🎵 Chanson générée</Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* CTA bas de page si des messages existent */}
        {messages.length > 0 && (
          <TouchableOpacity
            style={[styles.newMsgBtn, { borderColor: C.primary }]}
            onPress={() => router.push({
              pathname: '/(app)/create/',
              params: { contactId: id },
            } as never)}
            activeOpacity={0.85}
          >
            <Text style={[styles.newMsgBtnText, { color: C.primary }]}>
              ✨ Créer un nouveau message
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content:   { paddingHorizontal: Spacing[4], paddingBottom: 24 },

    hero: {
      alignItems: 'center',
      paddingVertical: 20,
      gap: 4,
    },
    heroEmoji: { fontSize: 36, marginBottom: 4 },
    heroTitle: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography['2xl'],
      color: Colors.onSurface,
      textAlign: 'center',
    },
    heroSub: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
      marginTop: 2,
    },

    emptyText: {
      textAlign: 'center',
      color: Colors.onSurfaceVariant,
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.md,
      marginTop: 40,
    },
    emptyBlock: {
      alignItems: 'center',
      paddingTop: 32,
      gap: 8,
    },
    emptyEmoji: { fontSize: 48 },
    emptyTitle: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.lg,
      color: Colors.onSurface,
      textAlign: 'center',
      marginTop: 8,
    },
    emptyDesc: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 20,
      paddingHorizontal: 8,
    },
    ctaBtn: {
      marginTop: 16,
      borderRadius: Radii.full,
      paddingVertical: 12,
      paddingHorizontal: 28,
    },
    ctaBtnText: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.md,
      color: '#fff',
    },

    // Séparateur d'année
    yearRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 12,
      gap: 8,
    },
    yearLine: {
      flex: 1,
      height: 1,
    },
    yearPill: {
      borderRadius: Radii.full,
      paddingHorizontal: 14,
      paddingVertical: 3,
    },
    yearLabel: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.sm,
    },

    // Carte message
    card: {
      backgroundColor: Colors.surfaceContainer,
      borderRadius: Radii.lg,
      padding: Spacing[3],
      marginBottom: 10,
      gap: 8,
    },
    cardTop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    cardEmoji: { fontSize: 22, lineHeight: 28 },
    cardMeta:  { flex: 1 },
    cardFormat: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.sm,
      color: Colors.onSurface,
    },
    cardDate: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
      marginTop: 1,
    },
    statusPill: {
      borderRadius: Radii.full,
      paddingHorizontal: 8,
      paddingVertical: 2,
      alignSelf: 'flex-start',
      flexShrink: 0,
    },
    statusText: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.xs,
    },
    cardContent: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
      lineHeight: 20,
      fontStyle: 'italic',
    },
    cardFooter: {
      flexDirection: 'row',
      gap: 12,
      flexWrap: 'wrap',
    },
    cardVia: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
    },
    cardAudio: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
    },

    // CTA bas
    newMsgBtn: {
      marginTop: 20,
      borderRadius: Radii.full,
      borderWidth: 1.5,
      paddingVertical: 12,
      alignItems: 'center',
    },
    newMsgBtnText: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.md,
    },
  });
}
