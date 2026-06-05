// ════════════════════════════════════════════════════════
//  Réactions reçues — liste de toutes les réactions
//  sur les messages de l'utilisateur connecté
// ════════════════════════════════════════════════════════

import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import { Config } from '../../../src/constants/config';
import { useAuthStore } from '../../../src/stores/authStore';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { FeatureIntroCard } from '../../../src/components/ui/FeatureIntroCard';

const supabase = createClient(Config.supabaseUrl, Config.supabaseAnonKey);

interface Reaction {
  id: string;
  emoji: string;
  note: string | null;
  created_at: string;
  message_id: string;
  messages: {
    contact_name: string;
    format: string;
    content: string;
  } | null;
}

async function fetchMyReactions(userId: string): Promise<Reaction[]> {
  const { data, error } = await supabase
    .from('message_reactions')
    .select(`
      id, emoji, note, created_at, message_id,
      messages!inner(contact_name, format, content, user_id)
    `)
    .eq('messages.user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw error;
  return (data ?? []) as unknown as Reaction[];
}

const FORMAT_EMOJI: Record<string, string> = { song: '🎵', poem: '✍️', message: '💬', joke: '✨' };

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  <  1) return 'à l\'instant';
  if (mins  < 60) return `il y a ${mins} min`;
  if (hours < 24) return `il y a ${hours}h`;
  if (days  <  7) return `il y a ${days}j`;
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function ReactionsScreen() {
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const user = useAuthStore((s) => s.user);

  const { data: reactions, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['reactions', user?.id],
    queryFn: () => fetchMyReactions(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2,
  });

  // Grouper par message_id pour avoir les stats
  const grouped = useMemo(() => {
    if (!reactions) return [];
    const map = new Map<string, { message: Reaction['messages']; items: Reaction[] }>();
    for (const r of reactions) {
      const existing = map.get(r.message_id);
      if (existing) {
        existing.items.push(r);
      } else {
        map.set(r.message_id, { message: r.messages, items: [r] });
      }
    }
    return Array.from(map.values());
  }, [reactions]);

  const totalCount = reactions?.length ?? 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>Réactions reçues</Text>
        <View style={{ minWidth: 70 }} />
      </View>

      {isLoading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator color={C.primary} size="large" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={C.primary} />
          }
        >
          {/* Hero stats */}
          <View style={[styles.heroCard, { backgroundColor: C.primary }]}>
            <Text style={styles.heroEmoji}>🎉</Text>
            <Text style={styles.heroCount}>{totalCount}</Text>
            <Text style={styles.heroLabel}>
              {totalCount === 0 ? 'Aucune réaction pour l\'instant' : totalCount === 1 ? 'réaction reçue' : 'réactions reçues'}
            </Text>
            {totalCount > 0 && (
              <Text style={styles.heroSub}>
                Tes proches ont réagi à tes messages ! 💛
              </Text>
            )}
          </View>

          {/* Intro feature */}
          <FeatureIntroCard
            introText={"Envoyer un beau message c'est bien... savoir qu'il a fait sourire c'est encore mieux ! 😊 Un message envoyé avec le cœur mérite une réponse avec le cœur 💛 Avec les Réactions, tes proches peuvent te faire savoir en quelques secondes que ton message les a touchés — un emoji, quelques mots — et toi tu es notifié instantanément 🌟✨"}
            modeEmploiLines={[
              "💌 Un lien de réaction unique est inclus automatiquement dans chaque message envoyé",
              "😊 Ton proche appuie sur le lien et choisit sa réaction — ❤️ 😂 😍 🙏 😭 🎉 + message optionnel",
              "🔔 Tu es notifié instantanément dès qu'il réagit",
              "🌟 Chaque réaction est sauvegardée ici comme un souvenir précieux 💛✨",
            ]}
            containerStyle={{ marginHorizontal: Spacing[4] }}
          />

          {/* Intro si vide */}
          {totalCount === 0 && (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Pas encore de réactions</Text>
              <Text style={styles.emptySub}>
                Quand tu envoies un message via WhatsApp, SMS ou email, un lien de réaction est inclus.{'\n\n'}
                Tes proches peuvent cliquer dessus pour t'envoyer un emoji + un mot — tu seras notifié en temps réel !
              </Text>
            </View>
          )}

          {/* Liste groupée par message */}
          {grouped.map(({ message, items }) => {
            if (!message) return null;
            const preview = message.content.slice(0, 80) + (message.content.length > 80 ? '…' : '');
            // Compte des emojis
            const emojiCounts: Record<string, number> = {};
            for (const r of items) {
              emojiCounts[r.emoji] = (emojiCounts[r.emoji] ?? 0) + 1;
            }
            return (
              <View key={items[0].message_id} style={styles.messageGroup}>
                {/* En-tête message */}
                <View style={styles.messageGroupHeader}>
                  <Text style={styles.messageGroupName}>
                    {FORMAT_EMOJI[message.format] ?? '💬'} Pour {message.contact_name}
                  </Text>
                  <View style={styles.emojiCountsRow}>
                    {Object.entries(emojiCounts).map(([e, c]) => (
                      <View key={e} style={styles.emojiCountBadge}>
                        <Text style={styles.emojiCountEmoji}>{e}</Text>
                        {c > 1 && <Text style={styles.emojiCountNum}>×{c}</Text>}
                      </View>
                    ))}
                  </View>
                </View>

                <Text style={styles.messageGroupPreview} numberOfLines={2}>{preview}</Text>

                {/* Réactions individuelles */}
                <View style={styles.reactionsList}>
                  {items.map((r) => (
                    <View key={r.id} style={styles.reactionRow}>
                      <View style={styles.reactionEmojiWrap}>
                        <Text style={styles.reactionEmoji}>{r.emoji}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        {r.note ? (
                          <Text style={styles.reactionNote}>"{r.note}"</Text>
                        ) : (
                          <Text style={styles.reactionNoNote}>Réaction sans message</Text>
                        )}
                        <Text style={styles.reactionTime}>{timeAgo(r.created_at)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}

          {/* Info utilisation */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>💡 Comment ça marche ?</Text>
            <Text style={styles.infoText}>
              Chaque message envoyé via ConfettiCake inclut automatiquement un lien de réaction.{'\n\n'}
              Ton proche clique sur le lien, choisit un emoji, ajoute un mot s'il le souhaite — et tu reçois une notification push instantanément !
            </Text>
          </View>

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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing[4],
      paddingVertical: 12,
      borderBottomWidth: 0.5,
      borderBottomColor: C.primaryContainer,
      backgroundColor: Colors.surfaceContainerLow,
    },
    backLink: { justifyContent: 'center', minWidth: 70 },
    backLinkText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
    topbarTitle: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography['2xl'],
      color: Colors.onSurface,
    },

    loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    loadingText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.md,
      color: Colors.onSurfaceVariant,
    },

    content: { paddingBottom: 40, gap: 16 },

    heroCard: {
      margin: Spacing[4],
      borderRadius: Radii['2xl'],
      padding: Spacing[5],
      alignItems: 'center',
      gap: 4,
      ...Shadows.lg,
    },
    heroEmoji: { fontSize: 40, marginBottom: 4 },
    heroCount: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: 48,
      color: Colors.white,
      lineHeight: 56,
    },
    heroLabel: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.lg,
      color: 'rgba(255,255,255,0.9)',
    },
    heroSub: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: 'rgba(255,255,255,0.75)',
      marginTop: 4,
      textAlign: 'center',
    },

    featureIntroCard: {
      marginHorizontal: Spacing[4],
      borderLeftWidth: 3,
      backgroundColor: C.primaryContainer,
      borderRadius: Radii.md,
      padding: 12,
    },
    featureIntroText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurface,
      lineHeight: 20,
    },

    emptyCard: {
      marginHorizontal: Spacing[4],
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      padding: Spacing[4],
      gap: 10,
      ...Shadows.sm,
    },
    emptyTitle: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.lg,
      color: Colors.onSurface,
      textAlign: 'center',
    },
    emptySub: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 20,
    },

    messageGroup: {
      marginHorizontal: Spacing[4],
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      overflow: 'hidden',
      ...Shadows.sm,
    },
    messageGroupHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: C.primaryContainer,
      paddingHorizontal: Spacing[3],
      paddingVertical: 10,
    },
    messageGroupName: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.sm,
      color: C.primary,
      flex: 1,
    },
    emojiCountsRow: {
      flexDirection: 'row',
      gap: 6,
    },
    emojiCountBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      backgroundColor: Colors.white,
      borderRadius: Radii.full,
      paddingVertical: 2,
      paddingHorizontal: 6,
    },
    emojiCountEmoji: { fontSize: 14 },
    emojiCountNum: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.xs,
      color: C.primary,
    },

    messageGroupPreview: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
      paddingHorizontal: Spacing[3],
      paddingVertical: 8,
      fontStyle: 'italic',
      borderBottomWidth: 0.5,
      borderBottomColor: Colors.surfaceContainerHighest,
    },

    reactionsList: { gap: 0 },
    reactionRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      paddingHorizontal: Spacing[3],
      paddingVertical: 10,
      borderTopWidth: 0.5,
      borderTopColor: Colors.surfaceContainerHighest,
    },
    reactionEmojiWrap: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: C.primaryContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    reactionEmoji: { fontSize: 20 },
    reactionNote: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurface,
      lineHeight: 20,
      fontStyle: 'italic',
    },
    reactionNoNote: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.outlineVariant,
      fontStyle: 'italic',
    },
    reactionTime: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.xs,
      color: Colors.outlineVariant,
      marginTop: 2,
    },

    infoCard: {
      marginHorizontal: Spacing[4],
      backgroundColor: C.primaryContainer,
      borderRadius: Radii.lg,
      padding: Spacing[3],
      gap: 8,
    },
    infoTitle: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.sm,
      color: C.primary,
    },
    infoText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurface,
      lineHeight: 20,
    },
  });
}
