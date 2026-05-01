import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useCardTemplates } from '../../../src/hooks/useCards';
import { CardThumbnail } from '../../../src/components/cards/CardThumbnail';
import { useAuthStore } from '../../../src/stores/authStore';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { HelpModal } from '../../../src/components/ui/HelpModal';

const { width: W } = Dimensions.get('window');
const CARD_W = (W - Spacing[5] * 2 - 8) / 2;

const OCCASIONS = [
  { key: 'all',        label: 'Toutes',       emoji: '✨' },
  { key: 'birthday',   label: 'Anniversaire', emoji: '🎁' },
  { key: 'wedding',    label: 'Mariage',      emoji: '💍' },
  { key: 'newyear',    label: 'Nouvel An',    emoji: '🎆' },
  { key: 'birth',      label: 'Naissance',    emoji: '👶' },
  { key: 'graduation', label: 'Diplôme',      emoji: '🎓' },
  { key: 'thanks',     label: 'Merci',        emoji: '🙏' },
  { key: 'universal',  label: 'Universel',    emoji: '🌟' },
];

type CardMode = 'browse' | 'ai';

export default function CardsGalleryScreen() {
  const C = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ occasion?: string; contactName?: string; contactId?: string }>();
  const profile = useAuthStore((s) => s.profile);
  const isPremium = !!(profile as Record<string, unknown> | null)?.is_premium;

  const [mode, setMode] = useState<CardMode | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState(params.occasion ?? 'all');
  const { data: templates = [], isLoading, error } = useCardTemplates(selectedOccasion);
  const scrollRef = useRef<FlatList>(null);
  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, []));

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

  const styles = useMemo(() => makeStyles(C), [C]);

  const renderCard = useCallback(({ item, index }: { item: typeof templates[0]; index: number }) => (
    <View style={[styles.cardCell, index % 2 === 0 ? styles.cardLeft : styles.cardRight]}>
      <CardThumbnail
        template={item}
        isPremium={isPremium}
        onPress={() => handleSelect(item.id)}
        onPressLocked={handlePressLocked}
      />
    </View>
  ), [isPremium, handleSelect, handlePressLocked, styles]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => mode ? setMode(null) : router.back()}
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Cartes Animées</Text>
          {mode === 'browse' && (
            <Text style={styles.subtitle}>
              {isLoading ? '…' : `${templates.length} carte${templates.length > 1 ? 's' : ''}`}
            </Text>
          )}
        </View>
        <HelpModal
          title="Cartes Animées"
          content={"Deux façons de créer ta carte :\n\n🃏 Parcourir la galerie — choisis une carte existante parmi nos modèles animés (confettis, ballons, feux d'artifice…). Elle s'anime avec le prénom de ton proche. Partage le lien, pas besoin d'app pour la voir.\n\n✨ Carte IA personnalisée — décris ce que tu veux, l'IA crée une carte unique rien que pour toi et ton proche.\n\n⭐ Les cartes Pro sont accessibles avec l'abonnement premium."}
        />
      </View>

      {/* ── Choix du mode ──────────────────────────────── */}
      {mode === null && (
        <View style={styles.modePickerContent}>
          <Text style={styles.modePickerTitle}>Comment veux-tu créer ta carte ?</Text>

          {/* Option 1 — Galerie existante */}
          <TouchableOpacity
            style={[styles.modeCard, { borderColor: C.primary }]}
            onPress={() => setMode('browse')}
            activeOpacity={0.85}
          >
            <View style={[styles.modeCardIcon, { backgroundColor: C.primaryContainer }]}>
              <Text style={styles.modeCardEmoji}>🃏</Text>
            </View>
            <View style={styles.modeCardBody}>
              <Text style={[styles.modeCardTitle, { color: C.primary }]}>
                Je sélectionne une carte existante
              </Text>
              <Text style={styles.modeCardSub}>
                Parcours notre galerie de cartes animées — confettis, ballons, feux d'artifice… Elle s'anime avec le prénom de ton proche.
              </Text>
            </View>
            <Text style={[styles.modeCardArrow, { color: C.primary }]}>›</Text>
          </TouchableOpacity>

          {/* Option 2 — Carte IA */}
          <TouchableOpacity
            style={[styles.modeCard, { borderColor: '#7C4DFF' }]}
            onPress={() => router.push('/(app)/cards/ai-create' as never)}
            activeOpacity={0.85}
          >
            <View style={[styles.modeCardIcon, { backgroundColor: '#EDE7F6' }]}>
              <Text style={styles.modeCardEmoji}>✨</Text>
            </View>
            <View style={styles.modeCardBody}>
              <Text style={[styles.modeCardTitle, { color: '#7C4DFF' }]}>
                Je crée une carte IA personnalisée
              </Text>
              <Text style={styles.modeCardSub}>
                Décris ce que tu veux, l'IA génère une carte unique rien que pour toi et ton proche. 100% original.
              </Text>
            </View>
            <Text style={[styles.modeCardArrow, { color: '#7C4DFF' }]}>›</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Mode 1 : Galerie ───────────────────────────── */}
      {mode === 'browse' && (
        <>
          {/* Filtres occasion */}
          <View style={styles.filtersRow}>
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
          </View>

          {/* Grille */}
          {isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator color={C.primary} size="large" />
              <Text style={styles.loadingText}>Chargement des cartes…</Text>
            </View>
          ) : error ? (
            <View style={styles.center}>
              <Text style={styles.emptyEmoji}>⚠️</Text>
              <Text style={styles.emptyTitle}>Erreur de chargement</Text>
              <Text style={styles.emptySub}>{String((error as Error)?.message ?? error)}</Text>
            </View>
          ) : templates.length === 0 ? (
            <View style={styles.center}>
              <Text style={styles.emptyEmoji}>🃏</Text>
              <Text style={styles.emptyTitle}>Aucune carte pour cette occasion</Text>
              <Text style={styles.emptySub}>D'autres cartes arrivent bientôt ✨</Text>
            </View>
          ) : (
            <FlatList
              ref={scrollRef}
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
        </>
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
    paddingHorizontal: Spacing[4],
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.surfaceContainerHighest,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 34, color: C.primary, lineHeight: 38 },
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

  // ── Choix du mode ──────────────────────────────────────────────────────────
  modePickerContent: {
    flex: 1,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[6],
    gap: 16,
  },
  modePickerTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    borderWidth: 2,
    padding: Spacing[4],
    gap: 14,
    ...Shadows.md,
  },
  modeCardIcon: {
    width: 56,
    height: 56,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeCardEmoji: { fontSize: 28 },
  modeCardBody: { flex: 1, gap: 4 },
  modeCardTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
  },
  modeCardSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },
  modeCardArrow: {
    fontSize: 26,
    lineHeight: 30,
    fontFamily: 'BeVietnamPro_700Bold',
  },

  // ── Galerie ────────────────────────────────────────────────────────────────
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing[4],
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.white,
  },
  filterChipActive: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  filterEmoji: { fontSize: 14 },
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
    backgroundColor: C.primary,
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

  // ── Carte IA placeholder ──────────────────────────────────────────────────
  aiPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: Spacing[6],
  },
  aiPlaceholderEmoji: { fontSize: 64 },
  aiPlaceholderTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: '#7C4DFF',
    textAlign: 'center',
  },
  aiPlaceholderSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
  },
  });
}
