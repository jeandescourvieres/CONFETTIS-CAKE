// ═══════════════════════════════════════════════════════════════
//  Confettis & Cake — Recherche globale (Phase 3)
// ═══════════════════════════════════════════════════════════════

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useContacts } from '../../../src/hooks/useContacts';
import type { Contact } from '../../../src/types/models';
import { daysUntilBirthday, daysUntilNextOccurrence } from '../../../src/utils/dateHelpers';
import { getNameDayForName } from '../../../src/utils/namedays';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { FeatureIntroCard } from '../../../src/components/ui/FeatureIntroCard';

// ── Résultat de recherche ─────────────────────────────────────
type ResultKind = 'contact' | 'birthday' | 'nameday' | 'explorer';

interface SearchResult {
  id: string;
  kind: ResultKind;
  emoji: string;
  title: string;
  subtitle: string;
  contactId?: string;
  route?: string;
}

const KIND_LABEL: Record<ResultKind, string> = {
  contact:  'Contact',
  birthday: 'Anniversaire',
  nameday:  'Fête du prénom',
  explorer: 'Explorer',
};

const KIND_COLOR: Record<ResultKind, string> = {
  contact:  '#9C27B0',
  birthday: '#E91E63',
  nameday:  '#FF9800',
  explorer: '#00BCD4',
};

// ── Utilitaires ───────────────────────────────────────────────
function urgencyColor(days: number): string {
  if (days <= 2) return '#F44336';
  if (days <= 7) return '#FF9800';
  return '#4CAF50';
}

function humanDays(days: number): string {
  if (days === 0) return "Aujourd'hui !";
  if (days === 1) return 'Demain';
  return `Dans ${days} j`;
}

function buildResults(query: string, contacts: Contact[]): SearchResult[] {
  const q = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  if (!q) return results;

  // ── Contacts correspondants ───────────────────────────────
  const matchedContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.relation.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.email?.toLowerCase().includes(q),
  );

  for (const c of matchedContacts) {
    results.push({
      id: `contact_${c.id}`,
      kind: 'contact',
      emoji: c.relation === 'pet' ? '🐾' : '👤',
      title: c.name,
      subtitle: c.relation,
      contactId: c.id,
    });
  }

  // ── Anniversaires à venir pour les contacts trouvés ───────
  for (const c of contacts.filter((c) => c.birthday && c.name.toLowerCase().includes(q))) {
    const days = daysUntilBirthday(c.birthday!);
    if (days <= 60) {
      results.push({
        id: `bday_${c.id}`,
        kind: 'birthday',
        emoji: '🎂',
        title: `Anniversaire de ${c.name.split(' ').slice(1).join(' ') || c.name}`,
        subtitle: humanDays(days),
        contactId: c.id,
      });
    }
  }

  // ── Fêtes des prénoms pour les contacts trouvés ───────────
  for (const c of contacts.filter((c) => c.name.toLowerCase().includes(q))) {
    const firstName = c.name.split(' ').slice(1).join(' ') || c.name.split(' ')[0];
    const mmdd = c.name_day ?? getNameDayForName(firstName);
    if (mmdd) {
      const days = daysUntilNextOccurrence(mmdd);
      if (days <= 60) {
        results.push({
          id: `nameday_${c.id}`,
          kind: 'nameday',
          emoji: '🌸',
          title: `Fête de ${firstName}`,
          subtitle: humanDays(days),
          contactId: c.id,
        });
      }
    }
  }

  // ── Suggestions explorer prénoms / noms ──────────────────
  if (q.length >= 2) {
    results.push({
      id: `prenoms_${q}`,
      kind: 'explorer',
      emoji: '🔤',
      title: `Explorer le prénom "${query}"`,
      subtitle: 'Origine, signification, numérologie…',
      route: '/(app)/explore/prenoms',
    });
    results.push({
      id: `noms_${q}`,
      kind: 'explorer',
      emoji: '🌍',
      title: `Explorer le nom "${query}"`,
      subtitle: 'Étymologie, histoire, numérologie…',
      route: '/(app)/explore/noms',
    });
  }

  // Dédoublonner contacts/birthday si même contact
  const seen = new Set<string>();
  return results.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });
}

// ── Composant principal ───────────────────────────────────────
export default function SearchScreen() {
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const { data: contacts = [] } = useContacts();
  const [query, setQuery] = useState('');
  const [helpVisible, setHelpVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(timer);
  }, []);

  const results = useMemo(() => buildResults(query, contacts), [query, contacts]);

  // Grouper par catégorie
  const grouped = useMemo(() => {
    const groups: Partial<Record<ResultKind, SearchResult[]>> = {};
    for (const r of results) {
      if (!groups[r.kind]) groups[r.kind] = [];
      groups[r.kind]!.push(r);
    }
    return groups;
  }, [results]);

  const handleResultPress = (result: SearchResult) => {
    if (result.contactId) {
      router.push(`/(app)/contact/${result.contactId}` as never);
    } else if (result.route) {
      router.push({ pathname: result.route, params: { q: query } } as never);
    }
  };

  const categoryOrder: ResultKind[] = ['contact', 'birthday', 'nameday', 'explorer'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.searchBarWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher…"
            placeholderTextColor={Colors.outlineVariant}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => setHelpVisible(true)} style={styles.helpBtn}>
          <Text style={styles.helpBtnText}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Intro (quand vide) */}
        {!query && (
          <>
            <FeatureIntroCard
              introText={"Tout ce dont tu as besoin, en un seul endroit 🔍 Retrouve en quelques secondes un contact, un anniversaire, une fête ou un événement sans naviguer d'écran en écran ✨"}
              modeEmploiLines={[
                "🔍 Saisis quelques lettres — résultats instantanés",
                "👤 Contacts, 🎂 anniversaires, 🌸 fêtes de prénoms",
                "🔤 Accès rapide à Explorer prénoms et Explorer noms",
                "✨ Un tap sur un résultat ouvre directement la fiche",
              ]}
            />

            {/* Raccourcis rapides */}
            <Text style={styles.suggestLabel}>Accès rapide</Text>
            <View style={styles.shortcutsRow}>
              {[
                { emoji: '👥', label: 'Contacts',      route: '/(app)/contacts' },
                { emoji: '📅', label: 'Calendrier',    route: '/(app)/calendar' },
                { emoji: '🔤', label: 'Prénoms',       route: '/(app)/explore/prenoms' },
                { emoji: '🌍', label: 'Noms',          route: '/(app)/explore/noms' },
              ].map((s) => (
                <TouchableOpacity
                  key={s.label}
                  style={[styles.shortcutBtn, { borderColor: C.primaryContainer }]}
                  onPress={() => router.push(s.route as never)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.shortcutEmoji}>{s.emoji}</Text>
                  <Text style={[styles.shortcutLabel, { color: C.primary }]}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Résultats */}
        {query.length > 0 && results.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>Aucun résultat</Text>
            <Text style={styles.emptySub}>Essaie d'autres termes — prénom, relation, numéro…</Text>
          </View>
        )}

        {query.length > 0 && results.length > 0 && categoryOrder.map((kind) => {
          const group = grouped[kind];
          if (!group?.length) return null;
          return (
            <View key={kind} style={styles.group}>
              <View style={[styles.groupHeader, { borderLeftColor: KIND_COLOR[kind] }]}>
                <Text style={[styles.groupLabel, { color: KIND_COLOR[kind] }]}>
                  {KIND_LABEL[kind]}
                </Text>
                <Text style={styles.groupCount}>{group.length}</Text>
              </View>
              {group.map((result) => (
                <TouchableOpacity
                  key={result.id}
                  style={styles.resultRow}
                  onPress={() => handleResultPress(result)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.resultIconWrap, { backgroundColor: KIND_COLOR[result.kind] + '18' }]}>
                    <Text style={styles.resultEmoji}>{result.emoji}</Text>
                  </View>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultTitle} numberOfLines={1}>{result.title}</Text>
                    <Text
                      style={[
                        styles.resultSub,
                        (result.kind === 'birthday' || result.kind === 'nameday') && result.subtitle !== 'Demain' && result.subtitle !== "Aujourd'hui !"
                          ? { color: urgencyColor(parseInt(result.subtitle.replace('Dans ', '').replace(' j', '')) || 99) }
                          : {},
                      ]}
                      numberOfLines={1}
                    >
                      {result.subtitle}
                    </Text>
                  </View>
                  <Text style={[styles.resultArrow, { color: C.primary }]}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal aide */}
      <Modal visible={helpVisible} transparent animationType="fade" onRequestClose={() => setHelpVisible(false)}>
        <TouchableOpacity
          style={styles.helpModalOverlay}
          activeOpacity={1}
          onPress={() => setHelpVisible(false)}
        >
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne la recherche ? 🔍</Text>
              <TouchableOpacity onPress={() => setHelpVisible(false)}>
                <Text style={styles.helpModalClose}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            {[
              { title: 'Une recherche pour tout trouver', body: "Parcourt instantanément toute l'appli — contacts, anniversaires, fêtes, prénoms et noms de famille." },
              { title: 'Les résultats en temps réel', body: "Apparaissent au fur et à mesure de la saisie. Chaque résultat est classé par catégorie avec une icône distincte." },
              { title: 'Accéder directement', body: "Un tap sur un résultat ouvre directement la fiche contact, section anniversaire ou fête correspondante." },
              { title: 'Les catégories', body: "👤 Contacts · 🎂 Anniversaires · 🌸 Fêtes de prénoms · 🔤 Explorer prénoms & noms" },
              { title: 'Bon à savoir 💡', body: "Tape les premières lettres du prénom, du nom, d'un numéro de téléphone ou d'un email — la recherche couvre tout !" },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────
function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },

    topbar: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      paddingHorizontal: Spacing[3], paddingVertical: 10,
      borderBottomWidth: 0.5, borderBottomColor: C.primaryContainer,
      backgroundColor: Colors.surfaceContainerLow,
    },
    backBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primaryContainer },
    backBtnText: { fontSize: 30, color: C.primary, lineHeight: 34 },
    searchBarWrap: {
      flex: 1, flexDirection: 'row', alignItems: 'center',
      backgroundColor: Colors.white, borderRadius: Radii.full,
      borderWidth: 1.5, borderColor: C.primaryContainer,
      paddingHorizontal: 12, height: 44,
    },
    searchIcon: { fontSize: 16, marginRight: 6 },
    searchInput: {
      flex: 1, fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.md, color: Colors.onSurface,
    },
    clearBtn: { padding: 4 },
    clearBtnText: { fontSize: 14, color: Colors.outlineVariant },
    helpBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: C.primaryContainer },
    helpBtnText: { fontSize: 18 },

    content: { padding: Spacing[4], gap: Spacing[3] },

    introCard: {
      borderLeftWidth: 3, backgroundColor: C.primaryContainer,
      borderRadius: Radii.md, padding: 12,
    },
    introText: {
      fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm,
      color: Colors.onSurface, lineHeight: 20,
    },

    suggestLabel: {
      fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs,
      textTransform: 'uppercase', letterSpacing: 1, color: Colors.onSurfaceVariant,
    },
    shortcutsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    shortcutBtn: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      paddingVertical: 8, paddingHorizontal: 14,
      borderRadius: Radii.full, borderWidth: 1.5, backgroundColor: Colors.white,
    },
    shortcutEmoji: { fontSize: 16 },
    shortcutLabel: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },

    emptyCard: {
      alignItems: 'center', paddingVertical: Spacing[10], gap: 12,
    },
    emptyEmoji: { fontSize: 48 },
    emptyTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: Colors.onSurface },
    emptySub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurfaceVariant, textAlign: 'center' },

    group: { gap: 6 },
    groupHeader: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      borderLeftWidth: 3, paddingLeft: 8,
    },
    groupLabel: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs, textTransform: 'uppercase', letterSpacing: 1 },
    groupCount: {
      fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
      backgroundColor: Colors.surfaceContainer,
      paddingHorizontal: 7, paddingVertical: 2, borderRadius: Radii.full,
    },

    resultRow: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      backgroundColor: Colors.white, borderRadius: Radii.lg,
      padding: 12, borderWidth: 0.5, borderColor: Colors.surfaceContainer,
      ...Shadows.sm,
    },
    resultIconWrap: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
    resultEmoji: { fontSize: 20 },
    resultInfo: { flex: 1 },
    resultTitle: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.md, color: Colors.onSurface },
    resultSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant, marginTop: 2 },
    resultArrow: { fontSize: 22, lineHeight: 26 },

    helpModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
    helpModalCard: { width: '100%', maxHeight: '80%', backgroundColor: Colors.white, borderRadius: Radii.xl, padding: 20, gap: 16 },
    helpModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    helpModalTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: Colors.onSurface, flex: 1, marginRight: 8 },
    helpModalClose: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: C.primary },
    helpModalSection: { gap: 4 },
    helpModalSectionTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: C.primary },
    helpModalSectionBody: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, lineHeight: 20 },
  });
}
