import React, { useState, useMemo } from 'react';
import { useColors } from '../../src/hooks/useColors';
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
import { deleteMessage, deleteMessages } from '../../src/services/messages.service';
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
  selectionMode,
  selected,
  onToggleSelect,
}: {
  message: Message;
  onPress: () => void;
  onDelete: () => void;
  selectionMode: boolean;
  selected: boolean;
  onToggleSelect: () => void;
}) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const isDraft = message.status === 'draft';
  const date = new Date(message.created_at);
  const dateLabel = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={selectionMode ? onToggleSelect : onPress}
      activeOpacity={0.8}
    >
      {/* Checkbox (mode sélection) ou icône format */}
      {selectionMode ? (
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected && <Text style={styles.checkboxTick}>✓</Text>}
        </View>
      ) : (
        <View style={[styles.cardIcon, isDraft && styles.cardIconDraft]}>
          <Text style={styles.cardIconEmoji}>{FORMAT_EMOJI[message.format] ?? '💬'}</Text>
        </View>
      )}

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

      {/* Bouton supprimer (mode normal uniquement) */}
      {!selectionMode && (
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={onDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.deleteBtnText}>🗑</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ filter, onCreate }: { filter: Filter; onCreate: () => void }) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
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
        Utilise le générateur pour créer ton premier message IA
      </Text>
      <TouchableOpacity style={styles.emptyBtn} onPress={onCreate} activeOpacity={0.85}>
        <Text style={styles.emptyBtnText}>✨ Créer un message</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function CreationsScreen() {
  const C = useColors();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: messages = [], isLoading } = useMessages();
  const [filter, setFilter] = useState<Filter>('all');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
  });

  const deleteManyMutation = useMutation({
    mutationFn: deleteMessages,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setSelectionMode(false);
      setSelectedIds(new Set());
    },
  });

  const filtered = messages.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const drafts = messages.filter((m) => m.status === 'draft');

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

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(filtered.map((m) => m.id)));
  };

  const cancelSelection = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    Alert.alert(
      'Supprimer',
      `Supprimer ${selectedIds.size} message${selectedIds.size > 1 ? 's' : ''} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteManyMutation.mutate(Array.from(selectedIds)),
        },
      ],
    );
  };

  const handleDeleteAllDrafts = () => {
    if (drafts.length === 0) return;
    Alert.alert(
      'Supprimer tous les brouillons',
      `Supprimer les ${drafts.length} brouillon${drafts.length > 1 ? 's' : ''} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Tout supprimer',
          style: 'destructive',
          onPress: () => deleteManyMutation.mutate(drafts.map((m) => m.id)),
        },
      ],
    );
  };

  const styles = useMemo(() => makeStyles(C), [C]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        {selectionMode ? (
          <>
            <TouchableOpacity onPress={cancelSelection}>
              <Text style={styles.headerAction}>Annuler</Text>
            </TouchableOpacity>
            <Text style={styles.headerCount}>
              {selectedIds.size} sélectionné{selectedIds.size > 1 ? 's' : ''}
            </Text>
            <TouchableOpacity onPress={selectAll}>
              <Text style={styles.headerAction}>Tout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.headerTitle}>Mes Créations</Text>
            <View style={styles.headerRight}>
              {messages.length > 0 && (
                <TouchableOpacity onPress={() => setSelectionMode(true)} style={styles.selectBtn}>
                  <Text style={styles.selectBtnText}>Sélectionner</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>

      {/* Bouton rapide "Supprimer tous les brouillons" */}
      {!selectionMode && drafts.length > 0 && (
        <TouchableOpacity style={styles.draftsDeleteBar} onPress={handleDeleteAllDrafts} activeOpacity={0.8}>
          <Text style={styles.draftsDeleteText}>
            🗑 Supprimer tous les brouillons ({drafts.length})
          </Text>
        </TouchableOpacity>
      )}

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
            selectionMode={selectionMode}
            selected={selectedIds.has(item.id)}
            onToggleSelect={() => toggleSelect(item.id)}
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

      {/* Barre de suppression (mode sélection) */}
      {selectionMode && (
        <View style={styles.selectionBar}>
          <TouchableOpacity
            style={[styles.deleteSelectedBtn, selectedIds.size === 0 && { opacity: 0.4 }]}
            onPress={handleDeleteSelected}
            disabled={selectedIds.size === 0 || deleteManyMutation.isPending}
            activeOpacity={0.85}
          >
            <Text style={styles.deleteSelectedText}>
              {deleteManyMutation.isPending
                ? 'Suppression...'
                : `🗑 Supprimer${selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}`}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: Colors.onSurface,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerAction: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: C.primary,
  },
  selectBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: C.primary,
  },
  selectBtnText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: C.primary,
  },

  // Barre rapide brouillons
  draftsDeleteBar: {
    marginHorizontal: Spacing[4],
    marginBottom: 4,
    paddingVertical: 10,
    paddingHorizontal: Spacing[4],
    backgroundColor: '#FEF2F2',
    borderRadius: Radii.lg,
    borderWidth: 0.5,
    borderColor: '#FECACA',
    alignItems: 'center',
  },
  draftsDeleteText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.error,
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
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  filterLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
  },
  filterLabelActive: { color: Colors.white },

  // List
  list: { paddingHorizontal: Spacing[4], paddingBottom: 100, gap: 12 },
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
  cardSelected: {
    borderWidth: 1.5,
    borderColor: C.primary,
    backgroundColor: C.primaryContainer + '30',
  },

  // Checkbox
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 10,
  },
  checkboxSelected: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  checkboxTick: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'BeVietnamPro_700Bold',
  },

  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: Radii.lg,
    backgroundColor: C.primaryContainer,
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
  statusSent: { backgroundColor: C.primaryContainer },
  statusText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
  },
  statusTextDraft: { color: Colors.onSurfaceVariant },
  statusTextSent: { color: C.primary },
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
  musicBadgeReady: { backgroundColor: C.primaryContainer },
  musicBadgePending: { backgroundColor: Colors.surfaceContainer },
  musicBadgeFailed: { backgroundColor: '#FECACA' },
  musicBadgeText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 10,
    color: C.primary,
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

  // Barre de sélection en bas
  selectionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing[4],
    paddingVertical: 12,
    paddingBottom: 28,
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.surfaceContainerHighest,
    ...Shadows.lg,
  },
  deleteSelectedBtn: {
    backgroundColor: Colors.error,
    borderRadius: Radii.full,
    paddingVertical: 15,
    alignItems: 'center',
  },
  deleteSelectedText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.lg,
    color: Colors.white,
  },

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
    backgroundColor: C.primary,
    ...Shadows.md,
  },
  emptyBtnText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.lg,
    color: Colors.white,
  },
  });
}
