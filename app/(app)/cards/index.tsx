import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCardTemplates } from '../../../src/hooks/useCards';
import { CardThumbnail } from '../../../src/components/cards/CardThumbnail';
import { useAuthStore } from '../../../src/stores/authStore';
import { Colors, Typography, Spacing, Radii } from '../../../src/constants/theme';

const { width: W } = Dimensions.get('window');
const CARD_W = (W - Spacing[5] * 2 - 8) / 2; // 2 colonnes avec gap

const OCCASIONS = [
  { key: 'all',        label: 'Toutes',       emoji: '✨' },
  { key: 'birthday',   label: 'Anniversaire', emoji: '🎂' },
  { key: 'wedding',    label: 'Mariage',      emoji: '💍' },
  { key: 'newyear',    label: 'Nouvel An',    emoji: '🎆' },
  { key: 'birth',      label: 'Naissance',    emoji: '👶' },
  { key: 'graduation', label: 'Diplôme',      emoji: '🎓' },
  { key: 'thanks',     label: 'Merci',        emoji: '🙏' },
  { key: 'universal',  label: 'Universel',    emoji: '🌟' },
];

export default function CardsGalleryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ occasion?: string; contactName?: string; contactId?: string }>();
  const profile = useAuthStore((s) => s.profile);
  const isPremium = !!(profile as Record<string, unknown> | null)?.is_premium;

  const [selectedOccasion, setSelectedOccasion] = useState(params.occasion ?? 'all');
  const { data: templates = [], isLoading } = useCardTemplates(selectedOccasion);

  const handleSelect = useCallback((templateId: string) => {
    router.push({
      pathname: '/(app)/cards/[id]',
      params: {
        id: templateId,
        contactName: params.contactName ?? '',
        contactId:   params.contactId   ?? '',
      },
    } as never);
  }, [router, params.contactName, params.contactId]);

  const handlePressLocked = useCallback(() => {
    router.push('/(app)/profile/premium' as never);
  }, [router]);

  const renderCard = useCallback(({ item, index }: { item: typeof templates[0]; index: number }) => (
    <View style={[styles.cardCell, index % 2 === 0 ? styles.cardLeft : styles.cardRight]}>
      <CardThumbnail
        template={item}
        isPremium={isPremium}
        onPress={() => handleSelect(item.id)}
        onPressLocked={handlePressLocked}
      />
    </View>
  ), [isPremium, handleSelect, handlePressLocked]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Cartes Animées</Text>
          <Text style={styles.subtitle}>
            {isLoading ? '…' : `${templates.length} carte${templates.length > 1 ? 's' : ''}`}
          </Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* Filtres occasion */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        style={styles.filtersScroll}
      >
        {OCCASIONS.map((o) => {
          const active = selectedOccasion === o.key;
          return (
            <TouchableOpacity
              key={o.key}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setSelectedOccasion(o.key)}
              activeOpacity={0.75}
            >
              <Text style={styles.filterEmoji}>{o.emoji}</Text>
              <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>
                {o.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Grille */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
          <Text style={styles.loadingText}>Chargement des cartes…</Text>
        </View>
      ) : templates.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>🃏</Text>
          <Text style={styles.emptyTitle}>Aucune carte pour cette occasion</Text>
          <Text style={styles.emptySub}>D'autres cartes arrivent bientôt ✨</Text>
        </View>
      ) : (
        <FlatList
          data={templates}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Bandeau Pro (si non premium) */}
      {!isPremium && (
        <TouchableOpacity
          style={styles.proBanner}
          onPress={() => router.push('/(app)/profile/premium' as never)}
          activeOpacity={0.9}
        >
          <Text style={styles.proBannerText}>⭐ Débloquer toutes les cartes Pro</Text>
          <Text style={styles.proBannerArrow}>›</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.surfaceContainerHighest,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 28, color: Colors.primary, lineHeight: 32 },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
  },
  subtitle: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },

  filtersScroll: { flexGrow: 0 },
  filtersRow: {
    paddingHorizontal: Spacing[5],
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.white,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterEmoji: { fontSize: 13 },
  filterLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  filterLabelActive: { color: Colors.white },

  grid: {
    paddingHorizontal: Spacing[5] - 4,
    paddingTop: 4,
    paddingBottom: 100,
  },
  cardCell: { flex: 1 },
  cardLeft:  { paddingRight: 2 },
  cardRight: { paddingLeft: 2 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
  },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  emptySub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
  },

  proBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    paddingVertical: 13,
    paddingHorizontal: Spacing[5],
  },
  proBannerText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.white,
  },
  proBannerArrow: {
    fontSize: 22,
    color: Colors.white,
    lineHeight: 26,
  },
});
