import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMessages } from '../../src/hooks/useAIGenerate';
import { deleteMessage } from '../../src/services/messages.service';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import type { Message } from '../../src/types/models';

// ── Filter tabs ───────────────────────────────────────────────────────────────
type Filter = 'all' | 'draft' | 'sent';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'draft', label: 'Brouillons' },
  { value: 'sent', label: 'Envoyés' },
];

const FORMAT_EMOJI: Record<string, string> = {
  song: '🎵',
  poem: '✍️',
  message: '💬',
  joke: '✨',
};

const FORMAT_LABEL: Record<string, string> = {
  song: 'Chanson',
  poem: 'Poème',
  message: 'Message',
  joke: 'Humour',
};

const TONE_LABEL: Record<string, string> = {
  humorous: 'Humoristique',
  touching: 'Touchant',
  poetic: 'Poétique',
  playful: 'Chaleureux',
  professional: 'Professionnel',
};

// ── Message card ──────────────────────────────────────────────────────────────
function MessageCard({
  message,
  onPress,
  onDelete,
}: {
  message: Message;
  onPress: () => void;
  onDelete: () => void;
}) {
  const isDraft = message.status === 'draft';
  const date = new Date(message.created_at);
  const dateLabel = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Left: format icon */}
      <View style={[styles.cardIcon, isDraft && styles.cardIconDraft]}>
        <Text style={styles.cardIconEmoji}>{FORMAT_EMOJI[message.format] ?? '💬'}</Text>
      </View>

      {/* Middle: info */}
      <View style={styles.cardInfo}>
        <View style={styles.cardRow}>
          <Text style={styles.cardName} numberOfLines={1}>
            {message.contact_name}
          </Text>
          <View style={[styles.statusBadge, isDraft ? styles.statusDraft : styles.statusSent]}>
            <Text style={[styles.statusText, isDraft ? styles.statusTextDraft : styles.statusTextSent]}>
              {isDraft ? 'Brouillon' : 'Envoyé'}
            </Text>
          </View>
        </View>
        <View style={styles.cardMetaRow}>
          <Text style={styles.cardMeta}>
            {FORMAT_LABEL[message.format] ?? 'Message'} · {TONE_LABEL[message.tone] ?? ''} · {dateLabel}
          </Text>
          {message.format === 'song' && message.music_status !== 'none' && (
            <View style={[
              styles.musicBadge,
              message.music_status === 'ready' ? styles.musicBadgeReady
              : message.music_status === 'failed' ? styles.musicBadgeFailed
              : styles.musicBadgePending,
            ]}>
              <Text style={styles.musicBadgeText}>
                {message.music_status === 'ready' ? '🎵 Audio'
                : message.music_status === 'generating' ? '⏳ ...'
                : message.music_status === 'queued' ? '⏳ File'
                : '⚠️'}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.cardPreview} numberOfLines={2}>
          {message.content}
        </Text>
      </View>

      {/* Right: delete */}
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={onDelete}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.deleteBtnText}>🗑</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ filter, onCreate }: { filter: Filter; onCreate: () => void }) {
  const messages: Record<Filter, string> = {
    all: 'Aucune création pour l\'instant',
    draft: 'Aucun brouillon',
    sent: 'Aucun message envoyé',
  };
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyEmoji}>✉️</Text>
      <Text style={styles.emptyTitle}>{messages[filter]}</Text>
      <Text style={styles.emptySubtitle}>
        Utilisez le générateur pour créer votre premier message IA
      </Text>
      <TouchableOpacity style={styles.emptyBtn} onPress={onCreate} activeOpacity={0.85}>
        <Text style={styles.emptyBtnText}>✨ Créer un message</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function CreationsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: messages = [], isLoading } = useMessages();
  const [filter, setFilter] = useState<Filter>('all');

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
  });

  const filtered = messages.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const handleDelete = (msg: Message) => {
    Alert.alert(
      'Supprimer',
      `Supprimer le message pour ${msg.contact_name} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(msg.id),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Créations</Text>
        <Text style={styles.headerCount}>
          {messages.length} message{messages.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.value}
            style={[styles.filterChip, filter === f.value && styles.filterChipActive]}
            onPress={() => setFilter(f.value)}
          >
            <Text style={[styles.filterLabel, filter === f.value && styles.filterLabelActive]}>
              {f.label}
              {f.value === 'draft' && messages.filter((m) => m.status === 'draft').length > 0
                ? ` (${messages.filter((m) => m.status === 'draft').length})`
                : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageCard
            message={item}
            onPress={() => router.push(`/(app)/message/${item.id}` as never)}
            onDelete={() => handleDelete(item)}
          />
        )}
        contentContainerStyle={filtered.length === 0 ? styles.listEmpty : styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              filter={filter}
              onCreate={() => router.push('/(app)/create/' as never)}
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[2],
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['4xl'],
    color: Colors.onSurface,
  },
  headerCount: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
  },

  // Filters
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  filterChip: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.white,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
  },
  filterLabelActive: { color: Colors.white },

  // List
  list: { paddingHorizontal: Spacing[4], paddingBottom: 80, gap: 12 },
  listEmpty: { flex: 1 },

  // Card
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    gap: 12,
    ...Shadows.sm,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: Radii.lg,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardIconDraft: { backgroundColor: Colors.surfaceContainer },
  cardIconEmoji: { fontSize: 22 },
  cardInfo: { flex: 1, gap: 4 },
  cardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  cardName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.lg,
    color: Colors.onSurface,
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: Radii.full,
  },
  statusDraft: { backgroundColor: Colors.surfaceContainer },
  statusSent: { backgroundColor: Colors.primaryContainer },
  statusText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
  },
  statusTextDraft: { color: Colors.onSurfaceVariant },
  statusTextSent: { color: Colors.primary },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  cardMeta: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    flex: 1,
  },
  musicBadge: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: Radii.full,
  },
  musicBadgeReady: { backgroundColor: Colors.primaryContainer },
  musicBadgePending: { backgroundColor: Colors.surfaceContainer },
  musicBadgeFailed: { backgroundColor: '#FECACA' },
  musicBadgeText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 10,
    color: Colors.primary,
  },
  cardPreview: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
    marginTop: 2,
  },
  deleteBtn: {
    paddingTop: 2,
    flexShrink: 0,
  },
  deleteBtnText: { fontSize: 18 },

  // Empty
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[6],
    gap: 12,
    marginTop: 80,
  },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyBtn: {
    marginTop: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
    ...Shadows.md,
  },
  emptyBtnText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.lg,
    color: Colors.white,
  },
});
