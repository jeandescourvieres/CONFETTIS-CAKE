import React, { useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useMyPots } from '../../../src/hooks/usePot';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import type { Pot } from '../../../src/types/models';

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ current, target }: { current: number; target: number }) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const pct = Math.min((current / target) * 100, 100);
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.round(pct)}%` as `${number}%` }]} />
    </View>
  );
}

// ── Pot card ──────────────────────────────────────────────────────────────────
function PotCard({ pot, onPress }: { pot: Pot; onPress: () => void }) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const pct = Math.min(Math.round((pot.current_amount / pot.target_amount) * 100), 100);
  const isCompleted = pot.status === 'completed';
  const isClosed = pot.status === 'closed';
  const statusColor = isCompleted ? '#4CAF50' : isClosed ? Colors.outlineVariant : C.primary;
  const statusLabel = isCompleted ? '✓ Objectif atteint' : isClosed ? 'Clôturée' : 'En cours';
  const contact = pot.contact as { name?: string } | undefined;
  const deadline = pot.deadline
    ? new Date(pot.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>

      {/* ── Titre + statut ─────────────────────────── */}
      <View style={styles.cardTop}>
        <Text style={styles.cardTitle} numberOfLines={2}>{pot.title}</Text>
        <View style={[styles.statusPill, { backgroundColor: statusColor + '22' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      {/* ── Barre de progression ───────────────────── */}
      <ProgressBar current={pot.current_amount} target={pot.target_amount} />
      <View style={styles.amountRow}>
        <Text style={styles.amountCurrent}>{pot.current_amount.toFixed(2)} €</Text>
        <Text style={styles.amountPct}>{pct} %</Text>
        <Text style={styles.amountTarget}>sur {pot.target_amount.toFixed(2)} €</Text>
      </View>

      {/* ── Bloc infos ─────────────────────────────── */}
      <View style={styles.infoGrid}>
        <View style={styles.infoRow}>
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>👤 Bénéficiaire</Text>
            <Text style={styles.infoValue}>{contact?.name ?? '—'}</Text>
          </View>
          <View style={[styles.infoCell, styles.infoCellRight]}>
            <Text style={styles.infoLabel}>🎯 Objectif</Text>
            <Text style={styles.infoValue}>{pot.target_amount.toFixed(2)} €</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>🎁 Description du cadeau</Text>
            <Text style={styles.infoValue} numberOfLines={2}>
              {pot.gift_description?.trim() || '—'}
            </Text>
          </View>
          <View style={[styles.infoCell, styles.infoCellRight]}>
            <Text style={styles.infoLabel}>📅 Date limite</Text>
            <Text style={styles.infoValue}>
              {deadline ?? 'Pas de date limite'}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Voir le détail ─────────────────────────── */}
      <View style={styles.cardFooter}>
        <Text style={styles.footerSeeMore}>Voir le détail</Text>
        <Text style={styles.footerChevron}>›</Text>
      </View>

    </TouchableOpacity>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ onCreate }: { onCreate: () => void }) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyEmoji}>🎁</Text>
      <Text style={styles.emptyTitle}>Aucune cagnotte</Text>
      <Text style={styles.emptySub}>
        Créez une cagnotte collective pour offrir un cadeau groupé à un proche
      </Text>
      <TouchableOpacity style={styles.emptyBtn} onPress={onCreate} activeOpacity={0.85}>
        <Text style={styles.emptyBtnText}>+ Créer une cagnotte</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function PotListScreen() {
  const C = useColors();
  const router = useRouter();
  const { data: pots = [], isLoading } = useMyPots();
  const activePots = pots.filter((p) => p.status !== 'closed');
  const closedPots = pots.filter((p) => p.status === 'closed');

  const styles = useMemo(() => makeStyles(C), [C]);
  const scrollRef = useRef<FlatList>(null);
  useFocusEffect(useCallback(() => { scrollRef.current?.scrollToOffset({ offset: 0, animated: false }); }, []));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#9b6bb5', '#7a4d99']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Text style={{ fontSize: 28, color: '#fff', lineHeight: 32 }}>‹</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Cagnottes 🎁</Text>
          <Text style={styles.headerSub}>
            {activePots.length} active{activePots.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => router.push('/(app)/pot/new' as never)}
          activeOpacity={0.85}
        >
          <Text style={styles.createBtnText}>+ Nouvelle</Text>
        </TouchableOpacity>
      </LinearGradient>

      <FlatList
        ref={scrollRef}
        data={pots}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PotCard
            pot={item}
            onPress={() => router.push(`/(app)/pot/${item.id}` as never)}
          />
        )}
        contentContainerStyle={pots.length === 0 ? styles.listEmpty : styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!isLoading ? <EmptyState onCreate={() => router.push('/(app)/pot/new' as never)} /> : null}
        ListFooterComponent={
          closedPots.length > 0 ? (
            <View style={styles.sectionFooter}>
              <Text style={styles.sectionFooterText}>
                + {closedPots.length} cagnotte{closedPots.length > 1 ? 's' : ''} clôturée{closedPots.length > 1 ? 's' : ''}
              </Text>
            </View>
          ) : null
        }
      />
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
    paddingVertical: Spacing[5],
  },
  headerTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: Colors.white },
  headerSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  createBtn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: Radii.full, backgroundColor: Colors.white },
  createBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: C.primary },

  list: { paddingHorizontal: Spacing[4], paddingTop: Spacing[4], paddingBottom: 80, gap: 14 },
  listEmpty: { flex: 1 },

  card: { backgroundColor: Colors.white, borderRadius: Radii['2xl'], padding: Spacing[4], gap: 12, ...Shadows.md },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  cardTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.xl, color: Colors.onSurface, flex: 1 },
  statusPill: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: Radii.full, flexShrink: 0 },
  statusText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs },

  progressTrack: { height: 8, borderRadius: 4, backgroundColor: Colors.surfaceContainer, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: C.primary },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -4 },
  amountCurrent: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.lg, color: C.primary },
  amountPct: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.base, color: Colors.onSurfaceVariant },
  amountTarget: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, alignSelf: 'flex-end', marginBottom: 2 },

  infoGrid: {
    borderTopWidth: 0.5,
    borderTopColor: Colors.surfaceContainer,
    paddingTop: 12,
    gap: 10,
  },
  infoRow: { flexDirection: 'row' },
  infoCell: { flex: 1, gap: 3 },
  infoCellRight: { paddingLeft: 12, borderLeftWidth: 0.5, borderLeftColor: Colors.surfaceContainer },
  infoLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  infoValue: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: Colors.onSurface,
    lineHeight: 20,
  },

  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', borderTopWidth: 0.5, borderTopColor: Colors.surfaceContainer, paddingTop: 10, gap: 4 },
  footerSeeMore: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: C.primary },
  footerChevron: { fontSize: 18, color: C.primary, lineHeight: 22 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing[6], gap: 12, marginTop: 80 },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography['2xl'], color: Colors.onSurface },
  emptySub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 22 },
  emptyBtn: { marginTop: 8, paddingVertical: 14, paddingHorizontal: 32, borderRadius: Radii.full, backgroundColor: C.primary, ...Shadows.md },
  emptyBtnText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.lg, color: Colors.white },

  sectionFooter: { alignItems: 'center', paddingVertical: 12 },
  sectionFooterText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: Colors.outlineVariant },
  });
}
