import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SectionList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  useContacts,
  useContactsGrouped,
  useUpcomingEvents,
} from '../../../src/hooks/useContacts';
import { ContactRow } from '../../../src/components/ContactRow';
import { Colors, Typography, Spacing, Radii } from '../../../src/constants/theme';
import { useAuthStore } from '../../../src/stores/authStore';

type FilterKey = 'all' | 'urgent' | 'friend' | 'family' | 'colleague';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'urgent', label: '🔥 Urgent' },
  { key: 'friend', label: '👫 Amis' },
  { key: 'family', label: '👨‍👩‍👧 Famille' },
  { key: 'colleague', label: '💼 Collègues' },
];

export default function ContactsScreen() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const { data: contacts = [], isLoading } = useContacts();
  const upcomingEvents = useUpcomingEvents(7);
  const { sections } = useContactsGrouped();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');

  const urgentMap = useMemo(() => {
    const map = new Map<string, (typeof upcomingEvents)[0]>();
    for (const ev of upcomingEvents) {
      if (!map.has(ev.contact.id)) map.set(ev.contact.id, ev);
    }
    return map;
  }, [upcomingEvents]);

  const filteredSections = useMemo(() => {
    return sections
      .map(({ letter, data }) => ({
        letter,
        data: data.filter((c) => {
          const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
          const matchFilter =
            filter === 'all' ||
            (filter === 'urgent' && urgentMap.has(c.id)) ||
            (filter === 'friend' && (c.relation === 'friend' || c.relation === 'best_friend')) ||
            (filter === 'family' && c.relation === 'family') ||
            (filter === 'colleague' && c.relation === 'colleague');
          return matchSearch && matchFilter;
        }),
      }))
      .filter((s) => s.data.length > 0);
  }, [sections, search, filter, urgentMap]);

  const urgentContacts = useMemo(
    () => contacts.filter((c) => urgentMap.has(c.id)),
    [contacts, urgentMap],
  );

  const totalEventsThisMonth = useMemo(() => {
    const m = new Date().getMonth() + 1;
    return contacts.filter((c) => {
      if (!c.birthday) return false;
      return parseInt(c.birthday.split('-')[1]) === m;
    }).length;
  }, [contacts]);

  const handleImportPhone = useCallback(() => {
    router.push('/(app)/contacts/import' as never);
  }, [router]);

  const allSections = useMemo(() => {
    const showUrgent = urgentContacts.length > 0 && filter === 'all' && !search;
    // Exclure les contacts urgents des sections alpha pour éviter les doublons
    const urgentIds = showUrgent ? new Set(urgentContacts.map((c) => c.id)) : null;
    const dedupedSections = urgentIds
      ? filteredSections
          .map((s) => ({ ...s, data: s.data.filter((c) => !urgentIds.has(c.id)) }))
          .filter((s) => s.data.length > 0)
      : filteredSections;
    return [
      ...(showUrgent ? [{ letter: '__urgent__', data: urgentContacts }] : []),
      ...dedupedSections,
    ];
  }, [urgentContacts, filteredSections, filter, search]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mes contacts</Text>
          <Text style={styles.subtitle}>
            {contacts.length} personne{contacts.length !== 1 ? 's' : ''}
            {totalEventsThisMonth > 0
              ? ` · ${totalEventsThisMonth} occasion${totalEventsThisMonth > 1 ? 's' : ''} ce mois`
              : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addIconBtn}
          onPress={() => router.push('/(app)/contacts/new' as never)}
        >
          <Text style={styles.addIconText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIconText}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher un contact..."
          placeholderTextColor={Colors.outlineVariant}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.clearBtn}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filtres */}
      <FlatList
        data={FILTERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(f) => f.key}
        contentContainerStyle={styles.filtersList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, filter === item.key && styles.filterChipActive]}
            onPress={() => setFilter(item.key)}
          >
            <Text style={[styles.filterText, filter === item.key && styles.filterTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Liste principale */}
      <SectionList
        sections={allSections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { letter } }) =>
          letter === '__urgent__' ? (
            <View style={styles.urgentHeader}>
              <Text style={styles.urgentLabel}>🔥 Urgent — cette semaine</Text>
            </View>
          ) : (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLetter}>{letter}</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <ContactRow
            contact={item}
            upcomingEvent={urgentMap.get(item.id)}
            onPress={() => router.push(`/(app)/contact/${item.id}` as never)}
            onCreateMessage={() =>
              router.push({ pathname: '/(app)/create/index', params: { contactId: item.id } } as never)
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>👥</Text>
            <Text style={styles.emptyTitle}>Aucun contact</Text>
            <Text style={styles.emptySub}>
              Ajoutez vos proches pour ne plus manquer leurs anniversaires.
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.importBtn}
              onPress={handleImportPhone}
            >
              <Text style={styles.importBtnText}>📱 Importer depuis le téléphone</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => router.push('/(app)/contacts/new' as never)}
            >
              <Text style={styles.addBtnText}>+ Ajouter un contact</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[3],
  },
  title: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 26,
    color: Colors.onSurface,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
  },
  addIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIconText: { fontSize: 26, color: Colors.white, lineHeight: 30, marginTop: -3 },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: Colors.primaryContainer,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing[3],
    marginHorizontal: Spacing[5],
    marginBottom: Spacing[3],
  },
  searchIconText: { fontSize: 13, marginRight: 6 },
  searchInput: {
    flex: 1,
    paddingVertical: 11,
    fontSize: Typography.base,
    fontFamily: 'BeVietnamPro_400Regular',
    color: Colors.onSurface,
  },
  clearBtn: { fontSize: 20, color: Colors.outlineVariant, paddingHorizontal: 4 },

  filtersList: { paddingHorizontal: Spacing[5], paddingBottom: Spacing[3], gap: 6 },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 0.5,
    borderColor: Colors.primaryContainer,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.onTertiaryContainer,
  },
  filterTextActive: { color: Colors.white },

  listContent: { paddingBottom: 100 },

  urgentHeader: {
    paddingVertical: 6,
    paddingHorizontal: Spacing[4],
    marginTop: Spacing[2],
  },
  urgentLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: Colors.onSurfaceVariant,
  },
  sectionHeader: {
    paddingVertical: 6,
    paddingHorizontal: Spacing[4],
    backgroundColor: Colors.surfaceContainerLow,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: Colors.surfaceContainer,
  },
  sectionLetter: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    color: Colors.primary,
  },

  emptyWrap: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 48, marginBottom: Spacing[3] },
  emptyTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
    marginBottom: Spacing[2],
  },
  emptySub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },

  footer: { padding: Spacing[5], gap: Spacing[3] },
  importBtn: {
    paddingVertical: 12,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.primaryContainer,
    alignItems: 'center',
  },
  importBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.primary,
  },
  addBtn: {
    paddingVertical: 13,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  addBtnText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.md,
    color: Colors.white,
  },
});
