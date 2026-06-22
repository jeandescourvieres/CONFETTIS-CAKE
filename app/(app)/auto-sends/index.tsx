import React, { useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Switch, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { useScheduledSends, useToggleScheduledSend, useDeleteScheduledSend } from '../../../src/hooks/useAutoSends';
import { renderTemplate } from '../../../src/services/autoSends.service';
import { FeatureIntroCard } from '../../../src/components/ui/FeatureIntroCard';

const TRIGGER_LABEL: Record<string, string> = {
  birthday: '🎁 Anniversaire',
  nameday: '🌸 Fête du prénom',
};
const CHANNEL_LABEL: Record<string, string> = {
  sms: '📱 SMS',
  email: '📧 Email',
};

export default function AutoSendsScreen() {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const router = useRouter();
  const { data: sends = [], isLoading } = useScheduledSends();
  const { mutate: toggle } = useToggleScheduledSend();
  const { mutate: remove } = useDeleteScheduledSend();

  const handleDelete = (id: string, contactName: string) => {
    Alert.alert(
      'Supprimer cet envoi automatique ?',
      `Le message ne sera plus envoyé automatiquement à ${contactName}.`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => remove(id) },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>Envois automatiques 🤖</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/(app)/auto-sends/new' as never)}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnText}>＋</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Explication */}
          <FeatureIntroCard
            introText={"Et si tu ne pouvais plus jamais rater un anniversaire ? 🎉 Configure un envoi automatique une seule fois, et l'application s'occupe de tout chaque année, sans que tu aies à y penser — un message qui part pile le jour J, même si tu oublies de regarder ton calendrier 💛"}
            modeEmploiLines={[
              "🤖 Appuie sur « ＋ » pour programmer ton premier envoi automatique",
              "📝 Choisis un modèle classé par occasion, tu/vous, longueur et style — ou écris ton propre message « à ma façon »",
              "👥 Sélectionne un ou plusieurs contacts qui recevront ce message",
              "📱 Choisis le canal : SMS (via Twilio) ou Email (via Resend)",
              "📅 Le message part automatiquement le jour J exact de l'anniversaire ou de la fête du prénom de chaque contact, avec son prénom inséré automatiquement",
              "✉️ Pour un email, le sujet est généré automatiquement (« Joyeux anniversaire » ou « Bonne fête »)",
              "⚠️ C'est un simple message texte : pas de WhatsApp, de carte animée, de musique, de photo ni de message vocal — pour ça, utilise le mode création classique",
              "✅ Active, désactive ou supprime chaque envoi à tout moment depuis cette liste",
              "🔔 Tu reçois une notification à chaque envoi effectué",
            ]}
            containerStyle={{ marginBottom: Spacing[4] }}
          />

          {sends.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyTitle}>Aucun envoi programmé</Text>
              <Text style={styles.emptySub}>
                Appuie sur ＋ pour programmer ton premier envoi automatique.
              </Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => router.push('/(app)/auto-sends/new' as never)}
                activeOpacity={0.85}
              >
                <Text style={styles.emptyBtnText}>Programmer un envoi</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.sectionTitle}>{sends.length} envoi{sends.length > 1 ? 's' : ''} programmé{sends.length > 1 ? 's' : ''}</Text>
              <View style={styles.list}>
                {sends.map((send) => {
                  const preview = send.template
                    ? renderTemplate(send.template.content, send.contact?.name ?? 'Prénom')
                    : '';
                  return (
                    <View key={send.id} style={[styles.card, !send.is_active && styles.cardInactive]}>
                      {/* En-tête contact */}
                      <View style={styles.cardHeader}>
                        <View style={[styles.avatar, { backgroundColor: send.is_active ? C.primary : Colors.outlineVariant }]}>
                          <Text style={styles.avatarText}>
                            {(send.contact?.name ?? '?')[0].toUpperCase()}
                          </Text>
                        </View>
                        <View style={styles.cardInfo}>
                          <Text style={styles.cardName}>{send.contact?.name ?? '—'}</Text>
                          <View style={styles.cardMeta}>
                            <Text style={styles.cardMetaText}>{TRIGGER_LABEL[send.trigger_event]}</Text>
                            <Text style={styles.cardMetaDot}>·</Text>
                            <Text style={styles.cardMetaText}>{CHANNEL_LABEL[send.channel]}</Text>
                          </View>
                        </View>
                        <Switch
                          value={send.is_active}
                          onValueChange={(v) => toggle({ id: send.id, is_active: v })}
                          trackColor={{ false: Colors.surfaceContainerHighest, true: C.primaryContainer }}
                          thumbColor={send.is_active ? C.primary : Colors.outlineVariant}
                        />
                      </View>

                      {/* Aperçu message */}
                      <View style={styles.previewBox}>
                        <Text style={styles.previewLabel}>{send.template?.title ?? 'Modèle'}</Text>
                        <Text style={styles.previewText} numberOfLines={2}>{preview}</Text>
                      </View>

                      {/* Actions */}
                      <View style={styles.cardActions}>
                        {send.last_sent_at && (
                          <Text style={styles.lastSent}>
                            ✅ Dernier envoi : {new Date(send.last_sent_at).toLocaleDateString('fr-FR')}
                          </Text>
                        )}
                        <TouchableOpacity
                          onPress={() => handleDelete(send.id, send.contact?.name ?? '')}
                          style={styles.deleteBtn}
                        >
                          <Text style={styles.deleteBtnText}>🗑 Supprimer</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    topbar: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: Spacing[4], paddingVertical: 12,
      borderBottomWidth: 0.5, borderBottomColor: C.primaryContainer,
      backgroundColor: Colors.surfaceContainerLow,
    },
    backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: C.primaryContainer },
    backBtnText: { fontSize: 34, color: C.primary, lineHeight: 38 },
    topbarTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: Colors.onSurface },
    addBtn: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center',
    },
    addBtnText: { fontSize: 22, color: Colors.white, lineHeight: 28 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    content: { padding: Spacing[4], paddingBottom: 80 },

    sectionTitle: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.xl,
      color: Colors.onSurface,
      marginBottom: Spacing[3],
      borderLeftWidth: 3,
      borderLeftColor: C.primary,
      paddingLeft: Spacing[3],
    },
    list: { gap: Spacing[3] },

    card: {
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      overflow: 'hidden',
      ...Shadows.sm,
    },
    cardInactive: { opacity: 0.55 },
    cardHeader: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      padding: Spacing[4],
      borderBottomWidth: 0.5, borderBottomColor: Colors.surfaceContainerHighest,
    },
    avatar: {
      width: 44, height: 44, borderRadius: 22,
      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    avatarText: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.md, color: Colors.white },
    cardInfo: { flex: 1 },
    cardName: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: Colors.onSurface },
    cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
    cardMetaText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant },
    cardMetaDot: { fontSize: Typography.xs, color: Colors.outlineVariant },

    previewBox: {
      paddingHorizontal: Spacing[4],
      paddingVertical: Spacing[3],
      backgroundColor: Colors.surfaceContainerLow,
    },
    previewLabel: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.xs,
      color: C.primary,
      marginBottom: 4,
    },
    previewText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
      lineHeight: 18,
      fontStyle: 'italic',
    },

    cardActions: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: Spacing[4], paddingVertical: 10,
    },
    lastSent: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
    },
    deleteBtn: { paddingVertical: 4, paddingHorizontal: 8 },
    deleteBtnText: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.xs,
      color: Colors.error,
    },

    emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 12 },
    emptyEmoji: { fontSize: 56 },
    emptyTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.xl, color: Colors.onSurface },
    emptySub: {
      fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md,
      color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 22,
      paddingHorizontal: Spacing[6],
    },
    emptyBtn: {
      marginTop: Spacing[2], backgroundColor: C.primary,
      borderRadius: Radii.full, paddingVertical: 13, paddingHorizontal: 28,
    },
    emptyBtnText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.md, color: Colors.white },
  });
}
