import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SectionList,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  useContacts,
  useContactsGrouped,
  useUpcomingEvents,
} from '../../../src/hooks/useContacts';
import { ContactRow } from '../../../src/components/ContactRow';
import { Colors, Typography, Spacing, Radii } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { useAuthStore } from '../../../src/stores/authStore';
import { usePartnerContacts } from '../../../src/hooks/useCouple';
import { daysUntilBirthday, humanDaysUntil } from '../../../src/utils/dateHelpers';

type FilterKey = 'all' | 'urgent' | 'best_friend' | 'friend' | 'family' | 'partner' | 'colleague' | 'other' | 'pets';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',         label: 'Tous' },
  { key: 'urgent',      label: '🎉 À fêter bientôt' },
  { key: 'best_friend', label: '💛 Meilleur·e ami·e' },
  { key: 'friend',      label: '👫 Amis' },
  { key: 'family',      label: '👨‍👩‍👧 Famille' },
  { key: 'partner',     label: '❤️ Partenaire' },
  { key: 'colleague',   label: '💼 Collègues' },
  { key: 'other',       label: '🙂 Autre' },
  { key: 'pets',        label: 'Animal de compagnie 🐾' },
];

const PET_EMOJI: Record<string, string> = {
  chien: '🐶', chat: '🐱', lapin: '🐰', perroquet: '🦜',
  hamster: '🐹', poisson: '🐠', cheval: '🐴',
  oiseau: '🐦', // rétrocompatibilité
};

export default function ContactsScreen() {
  const router = useRouter();
  const C = useColors();
  const userId = useAuthStore((s) => s.user?.id);
  const { data: contacts = [], isLoading } = useContacts();
  const upcomingEvents = useUpcomingEvents(15);
  const { sections } = useContactsGrouped();

  const { data: partnerContacts = [] } = usePartnerContacts();
  const partnerContactIds = useMemo(() => new Set(partnerContacts.map((c) => c.id)), [partnerContacts]);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [petHelpVisible, setPetHelpVisible] = useState(false);
  const scrollRef = useRef<SectionList>(null);

  const petContacts = useMemo(
    () => contacts.filter((c) => c.relation === 'pet'),
    [contacts],
  );
  useFocusEffect(useCallback(() => { scrollRef.current?.getScrollResponder()?.scrollTo({ y: 0, animated: false }); }, []));

  const urgentMap = useMemo(() => {
    const map = new Map<string, (typeof upcomingEvents)[0]>();
    for (const ev of upcomingEvents) {
      if (!map.has(ev.contact.id)) map.set(ev.contact.id, ev);
    }
    return map;
  }, [upcomingEvents]);

  const filteredSections = useMemo(() => {
    if (filter === 'pets') return []; // shown in ListHeaderComponent
    return sections
      .map(({ letter, data }) => ({
        letter,
        data: data.filter((c) => {
          if (c.relation === 'pet') return false; // exclure les animaux du listing normal
          const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
          const matchFilter =
            filter === 'all' ||
            (filter === 'urgent'      && urgentMap.has(c.id)) ||
            (filter === 'best_friend' && c.relation === 'best_friend') ||
            (filter === 'friend'      && c.relation === 'friend') ||
            (filter === 'family'      && c.relation === 'family') ||
            (filter === 'partner'     && c.relation === 'partner') ||
            (filter === 'colleague'   && c.relation === 'colleague') ||
            (filter === 'other'       && c.relation === 'other');
          return matchSearch && matchFilter;
        }),
      }))
      .filter((s) => s.data.length > 0);
  }, [sections, search, filter, urgentMap]);

  const urgentContacts = useMemo(
    () => contacts.filter((c) => c.relation !== 'pet' && urgentMap.has(c.id)),
    [contacts, urgentMap],
  );

  const urgentBirthdays = useMemo(
    () => urgentContacts.filter((c) => urgentMap.get(c.id)?.eventType === 'birthday'),
    [urgentContacts, urgentMap],
  );

  const urgentNameDays = useMemo(
    () => urgentContacts.filter((c) => urgentMap.get(c.id)?.eventType === 'name_day'),
    [urgentContacts, urgentMap],
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
    if (filter === 'pets') return [];
    const showUrgent = urgentContacts.length > 0 && filter === 'all' && !search;
    return [
      ...(showUrgent && urgentBirthdays.length > 0 ? [{ letter: '__urgent_birthday__', data: urgentBirthdays }] : []),
      ...(showUrgent && urgentNameDays.length > 0 ? [{ letter: '__urgent_nameday__', data: urgentNameDays }] : []),
      ...(filteredSections.length > 0 ? [{ letter: '__all_contacts__', data: [] }, ...filteredSections] : filteredSections),
    ];
  }, [urgentContacts, filteredSections, filter, search]);

  const styles = useMemo(() => makeStyles(C), [C]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.center}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Mes contacts</Text>
          <Text style={styles.subtitle}>
            {contacts.length} personne{contacts.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addIconBtn}
          onPress={() => router.push({ pathname: '/(app)/contacts/new', params: { resetKey: Date.now().toString() } } as never)}
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

      {/* Liste principale */}
      <SectionList
        ref={scrollRef}
        sections={allSections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        style={styles.list}
        ListHeaderComponent={
          <>
            {/* Intro boutons */}
            <Text style={styles.actionIntro}>
              Pour profiter pleinement de l'application, commence par ajouter tes contacts. Tu peux les importer automatiquement depuis ton téléphone ou les créer manuellement.
            </Text>

            {/* Boutons d'action */}
            <View style={styles.actionCol}>
              <TouchableOpacity style={styles.importBtn} onPress={handleImportPhone}>
                <Text style={styles.importBtnText}>📱 J'importe mes contacts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={() => router.push({ pathname: '/(app)/contacts/new', params: { resetKey: Date.now().toString() } } as never)}>
                <Text style={styles.addBtnText}>Je crée un contact</Text>
              </TouchableOpacity>
            </View>

            {/* Intro filtres */}
            <Text style={styles.filtersIntro}>Grâce aux filtres, retrouve rapidement tes contacts et ceux à fêter prochainement 🎉</Text>

            {/* Filtres */}
            <View style={styles.filtersList}>
              {FILTERS.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.filterChip, filter === item.key && styles.filterChipActive]}
                  onPress={() => setFilter(item.key)}
                >
                  <Text style={[styles.filterText, filter === item.key && styles.filterTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Vue animaux de compagnie */}
            {filter === 'pets' && (
              <View>
                <View style={styles.petFilterIntroRow}>
                  <Text style={styles.petFilterIntro}>
                    Ils font partie de la famille eux aussi ! 🐾 Rex, Minou, Coco... ils ont tous leur place dans Confetticake ! Retrouve en un coup d'œil tous les animaux de compagnie de tes contacts — avec leurs infos, leurs anniversaires et les boutons pour leur envoyer un message ou écrire de leur part — et crée des attentions uniques et mémorables qui surprendront à coup sûr 💛✨
                  </Text>
                  <TouchableOpacity style={styles.petFilterHelpBtn} onPress={() => setPetHelpVisible(true)}>
                    <Text style={styles.petFilterHelpBtnText}>ℹ️</Text>
                  </TouchableOpacity>
                </View>
                {petContacts.length === 0 ? (
                  <View style={styles.petFilterEmpty}>
                    <Text style={styles.petFilterEmptyText}>🐾 Aucun animal renseigné</Text>
                    <Text style={styles.petFilterEmptySub}>
                      Pour ajouter un animal, ouvre la fiche d'un contact, section Animal de compagnie.
                    </Text>
                  </View>
                ) : (
                  petContacts.map((pet) => {
                    const petEmoji = PET_EMOJI[pet.pet_type ?? ''] ?? '🐾';
                    const ownerContact = contacts.find((c) => c.name === pet.pet_owner_name && c.relation !== 'pet');
                    const bDays = pet.birthday ? daysUntilBirthday(pet.birthday) : null;
                    return (
                      <View key={pet.id} style={styles.petFilterCard}>
                        <View style={styles.petFilterCardHeader}>
                          <Text style={{ fontSize: 30 }}>{petEmoji}</Text>
                          <View style={{ flex: 1, gap: 3 }}>
                            <Text style={styles.petFilterCardName}>{pet.name}</Text>
                            {ownerContact && (
                              <TouchableOpacity onPress={() => router.push(`/(app)/contact/${ownerContact.id}` as never)}>
                                <Text style={styles.petFilterCardOwner}>📎 {ownerContact.name.split(' ').slice(1).join(' ') || ownerContact.name}</Text>
                              </TouchableOpacity>
                            )}
                            {pet.birthday && !pet.birthday.startsWith('0000-00') && (() => {
                              const p = pet.birthday.split('-');
                              const day = parseInt(p[2], 10);
                              const month = parseInt(p[1], 10);
                              const hasYear = p[0] !== '0000';
                              const dateStr = hasYear
                                ? `${day}/${month}/${p[0]}`
                                : `${day}/${month}`;
                              return (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                  <Text style={styles.petFilterCardBirthday}>🎂 {dateStr}</Text>
                                  {bDays !== null && bDays <= 30 && (
                                    <View style={[styles.petBirthdayBadge, { backgroundColor: bDays <= 3 ? Colors.error : bDays <= 7 ? '#FF6D00' : Colors.primary }]}>
                                      <Text style={styles.petBirthdayBadgeText}>
                                        {bDays === 0 ? "C'est aujourd'hui !" : `J-${bDays}`}
                                      </Text>
                                    </View>
                                  )}
                                </View>
                              );
                            })()}
                          </View>
                        </View>
                        <View style={styles.petFilterCardBtns}>
                          <TouchableOpacity
                            style={styles.petFilterBtn}
                            onPress={() => router.push({ pathname: '/(app)/create/index', params: { contactId: pet.id } } as never)}
                            activeOpacity={0.85}
                          >
                            <Text style={styles.petFilterBtnText}>Message à {pet.name} 🐾</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.petFilterBtn, styles.petFilterBtnSecondary]}
                            onPress={() => ownerContact && router.push(`/(app)/contact/${ownerContact.id}` as never)}
                            activeOpacity={0.85}
                          >
                            <Text style={[styles.petFilterBtnText, { color: Colors.primary }]}>Message de la part de {pet.name} 🐾</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
            )}
          </>
        }
        renderSectionHeader={({ section: { letter } }) =>
          letter === '__urgent_birthday__' ? (
            <View style={styles.urgentHeader}>
              <Text style={styles.urgentLabel}>🎁 Les anniversaires à venir</Text>
            </View>
          ) : letter === '__urgent_nameday__' ? (
            <View style={styles.urgentHeader}>
              <Text style={styles.urgentLabel}>🌸 Les fêtes à venir</Text>
            </View>
          ) : letter === '__all_contacts__' ? (
            <View style={styles.allContactsHeader}>
              <Text style={styles.allContactsLabel}>👥 Ma liste de contacts</Text>
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
            isPartnerContact={partnerContactIds.has(item.id)}
          />
        )}
        ListEmptyComponent={
          filter !== 'pets' ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyEmoji}>👥</Text>
              <Text style={styles.emptyTitle}>Aucun contact</Text>
              <Text style={styles.emptySub}>
                Ajoute tes proches pour ne plus manquer leurs anniversaires.
              </Text>
            </View>
          ) : null
        }
      />
      {/* Modal aide — filtre animaux */}
      <Modal visible={petHelpVisible} transparent animationType="fade" onRequestClose={() => setPetHelpVisible(false)}>
        <TouchableOpacity style={styles.petHelpOverlay} activeOpacity={1} onPress={() => setPetHelpVisible(false)}>
          <View style={styles.petHelpCard}>
            <View style={styles.petHelpHeader}>
              <Text style={styles.petHelpTitle}>Comment fonctionne le filtre Animal de compagnie ? 🐾</Text>
              <TouchableOpacity onPress={() => setPetHelpVisible(false)}>
                <Text style={styles.petHelpClose}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {[
                { title: "Ta liste d'animaux", body: "Tous les animaux de compagnie renseignés dans tes fiches contacts apparaissent automatiquement ici — avec leur nom, leur type, le contact auquel ils sont affiliés et leur date de naissance si renseignée." },
                { title: "Les anniversaires", body: "Un compte à rebours s'affiche automatiquement si l'anniversaire d'un animal approche 🎂" },
                { title: "Envoyer un message", body: "Deux boutons sont disponibles pour chaque animal :\n📬 Message à [nom de l'animal] — pour lui envoyer directement une attention\n🐾 De la part de [nom de l'animal] — pour écrire comme si c'était lui qui parlait" },
                { title: "Accéder à la fiche contact", body: "Un tap sur le nom du contact affilié ouvre directement sa fiche contact." },
                { title: "Bon à savoir 💡", body: "Pour ajouter un animal, rends-toi dans la fiche d'un contact, section Nature de ta relation puis Animal de compagnie !" },
              ].map((s) => (
                <View key={s.title} style={styles.petHelpSection}>
                  <Text style={styles.petHelpSectionTitle}>{s.title}</Text>
                  <Text style={styles.petHelpSectionBody}>{s.body}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[3],
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 34, color: C.primary, lineHeight: 38 },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    marginBottom: 2,
    textAlign: 'center',
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
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIconText: { fontSize: 26, color: Colors.white, lineHeight: 30, marginTop: -3 },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: C.primaryContainer,
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

  filtersIntro: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.lg,
    color: C.primary,
    textAlign: 'center',
    marginHorizontal: Spacing[5],
    marginBottom: Spacing[3],
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.lg,
  },
  filtersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[3],
    gap: 8,
  },
  filterChip: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: Radii.full,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: C.primaryContainer,
  },
  filterChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  filterText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.base,
    color: Colors.onSurface,
  },
  filterTextActive: { color: Colors.white },

  list: { flex: 1 },
  listContent: { paddingBottom: 100 },

  urgentHeader: {
    paddingVertical: 6,
    paddingHorizontal: Spacing[4],
    marginTop: Spacing[2],
  },
  urgentLabel: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.xl,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: Spacing[5],
    marginBottom: Spacing[3],
    marginLeft: Spacing[4],
    borderLeftWidth: 3,
    borderLeftColor: C.primary,
    paddingLeft: Spacing[3],
    color: Colors.onSurface,
  },
  allContactsHeader: {
    paddingVertical: 8,
    paddingHorizontal: Spacing[4],
    marginTop: Spacing[3],
  },
  allContactsLabel: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.xl,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: Spacing[5],
    marginBottom: Spacing[3],
    marginLeft: Spacing[4],
    borderLeftWidth: 3,
    borderLeftColor: C.primary,
    paddingLeft: Spacing[3],
    color: Colors.onSurface,
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
    color: C.primary,
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

  actionIntro: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.lg,
    color: C.primary,
    textAlign: 'center',
    marginHorizontal: Spacing[5],
    marginBottom: Spacing[3],
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.lg,
  },
  actionCol: {
    flexDirection: 'row',
    gap: Spacing[2],
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[3],
  },
  importBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  importBtnText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  addBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurface,
    textAlign: 'center',
  },


  // ── Animaux de compagnie filter ───────────────
  petFilterIntroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: Spacing[5],
    marginBottom: 12,
    marginTop: 4,
  },
  petFilterIntro: {
    flex: 1,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },
  petFilterHelpBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: C.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, marginTop: 2,
  },
  petFilterHelpBtnText: { fontSize: 15, lineHeight: 18 },
  petFilterCard: {
    marginHorizontal: Spacing[5],
    marginBottom: 10,
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: C.primaryContainer,
    padding: 14,
    gap: 12,
  },
  petFilterCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  petFilterCardName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  petFilterCardOwner: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: C.primary,
    marginTop: 2,
  },
  petFilterCardBirthday: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  petBirthdayBadge: {
    borderRadius: Radii.full,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  petBirthdayBadgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: Colors.white,
  },
  petFilterCardBtns: { gap: 8 },
  petFilterBtn: {
    backgroundColor: C.primary,
    borderRadius: Radii.full,
    paddingVertical: 10,
    alignItems: 'center',
  },
  petFilterBtnSecondary: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: C.primaryContainer,
  },
  petFilterBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },
  petFilterEmpty: {
    marginHorizontal: Spacing[5],
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  petFilterEmptyText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  petFilterEmptySub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
  },

  // ── Modal aide animaux ────────────────────────
  petHelpOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', padding: Spacing[4],
  },
  petHelpCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii['2xl'],
    overflow: 'hidden',
    maxHeight: '85%',
  },
  petHelpHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.primary,
    paddingHorizontal: Spacing[4], paddingVertical: 12,
  },
  petHelpTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md, color: Colors.white,
    flex: 1, marginRight: 8,
  },
  petHelpClose: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm, color: Colors.white,
  },
  petHelpSection: {
    paddingHorizontal: Spacing[4], paddingTop: 12, paddingBottom: 4,
    borderBottomWidth: 0.5, borderBottomColor: Colors.surfaceContainerLow,
  },
  petHelpSectionTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm, color: Colors.onSurface, marginBottom: 4,
  },
  petHelpSectionBody: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm, color: Colors.onSurfaceVariant, lineHeight: 20, marginBottom: 8,
  },
  });
}
