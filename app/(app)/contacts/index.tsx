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
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTabScrollToTop } from '../../../src/hooks/useTabScrollToTop';
import {
  useContacts,
  useContactsGrouped,
  useContactsSortedByAffinity,
  useUpcomingEvents,
} from '../../../src/hooks/useContacts';
import { ContactRow } from '../../../src/components/ContactRow';
import { Colors, Typography, Spacing, Radii } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { useTablet } from '../../../src/hooks/useTablet';
import { useAuthStore } from '../../../src/stores/authStore';
import { usePartnerContacts } from '../../../src/hooks/useCouple';
import { useRelationBarometer } from '../../../src/hooks/useRelationBarometer';
import { daysUntilBirthday, humanDaysUntil } from '../../../src/utils/dateHelpers';

type FilterKey = 'all' | 'urgent' | 'best_friend' | 'friend' | 'family' | 'partner' | 'colleague' | 'other' | 'pets';

const PET_EMOJI: Record<string, string> = {
  chien: '🐶', chat: '🐱', lapin: '🐰', perroquet: '🦜',
  hamster: '🐹', poisson: '🐠', cheval: '🐴',
  oiseau: '🐦', // rétrocompatibilité
};

export default function ContactsScreen() {
  const { t } = useTranslation();
  const { isTablet } = useTablet();
  const router = useRouter();

  const FILTERS: { key: FilterKey; label: string }[] = [
    { key: 'all',         label: t('contacts.filters.all') },
    { key: 'urgent',      label: t('contacts.filters.urgent') },
    { key: 'best_friend', label: t('contacts.relations.best_friend') },
    { key: 'friend',      label: t('contacts.relations.friend') },
    { key: 'family',      label: t('contacts.relations.family') },
    { key: 'partner',     label: t('contacts.relations.partner') },
    { key: 'colleague',   label: t('contacts.relations.colleague') },
    { key: 'other',       label: t('contacts.relations.other') },
    { key: 'pets',        label: t('contacts.filterPets') },
  ];
  const { redirectTo } = useLocalSearchParams<{ redirectTo?: string }>();
  const goToContact = (contactId: string) => {
    if (redirectTo === 'numerologie') {
      router.push(`/(app)/contact/numerologie/${contactId}` as never);
    } else {
      router.push(`/(app)/contact/${contactId}` as never);
    }
  };
  const C = useColors();
  const userId = useAuthStore((s) => s.user?.id);
  const { data: contacts = [], isLoading } = useContacts();
  const upcomingEvents = useUpcomingEvents(15);
  const { sections } = useContactsGrouped();

  const { data: partnerContacts = [] } = usePartnerContacts();
  const barometerContacts = useRelationBarometer();
  const partnerContactIds = useMemo(() => new Set(partnerContacts.map((c) => c.id)), [partnerContacts]);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [sortMode, setSortMode] = useState<'alpha' | 'affinite'>('alpha');

  const switchSortMode = (mode: 'alpha' | 'affinite') => {
    setSortMode(mode);
    setTimeout(() => {
      try {
        scrollRef.current?.scrollToLocation({ sectionIndex: 0, itemIndex: 0, viewPosition: 0, animated: false });
      } catch { /* silent si liste vide */ }
    }, 50);
  };

  const toggleAccordion = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(v => !v);
    setTimeout(() => {
      try {
        (scrollRef.current as any)?.scrollToOffset({ offset: 0, animated: false });
      } catch { /* silent */ }
    }, 30);
  };
  const [petHelpVisible, setPetHelpVisible] = useState(false);
  const [affiniteHelpVisible, setAffiniteHelpVisible] = useState(false);
  const [urgentBirthdaysOpen, setUrgentBirthdaysOpen] = useState(true);
  const [urgentNameDaysOpen, setUrgentNameDaysOpen] = useState(true);
  const [addContactsOpen, setAddContactsOpen] = useState(false);
  const [shareContactsOpen, setShareContactsOpen] = useState(false);
  const [findContactsOpen, setFindContactsOpen] = useState(false);
  const [barometerOpen, setBarometerOpen] = useState(false);

  const { data: affiniteContacts = [] } = useContactsSortedByAffinity();
  const scrollRef = useRef<SectionList>(null);

  const petContacts = useMemo(
    () => contacts.filter((c) => c.relation === 'pet'),
    [contacts],
  );
  useTabScrollToTop('contacts/index', () => scrollRef.current?.getScrollResponder()?.scrollTo({ y: 0, animated: false }));

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

  const affiniteFiltered = useMemo(() => {
    if (!search) return affiniteContacts;
    const q = search.toLowerCase();
    return affiniteContacts.filter((c) => c.name.toLowerCase().includes(q));
  }, [affiniteContacts, search]);

  const allSections = useMemo(() => {
    if (filter === 'pets') return [];
    if (sortMode === 'affinite') {
      const showUrgent = urgentContacts.length > 0 && filter === 'all' && !search;
      return [
        ...(showUrgent && urgentBirthdays.length > 0 ? [{ letter: '__urgent_birthday__', data: urgentBirthdaysOpen ? urgentBirthdays : [] }] : []),
        ...(showUrgent && urgentNameDays.length > 0 ? [{ letter: '__urgent_nameday__', data: urgentNameDaysOpen ? urgentNameDays : [] }] : []),
        ...(affiniteFiltered.length > 0 ? [{ letter: '__affinite__', data: affiniteFiltered }] : []),
      ];
    }
    const showUrgent = urgentContacts.length > 0 && filter === 'all' && !search;
    return [
      ...(showUrgent && urgentBirthdays.length > 0 ? [{ letter: '__urgent_birthday__', data: urgentBirthdaysOpen ? urgentBirthdays : [] }] : []),
      ...(showUrgent && urgentNameDays.length > 0 ? [{ letter: '__urgent_nameday__', data: urgentNameDaysOpen ? urgentNameDays : [] }] : []),
      ...(filteredSections.length > 0 ? [{ letter: '__all_contacts__', data: [] }, ...filteredSections] : filteredSections),
    ];
  }, [urgentContacts, filteredSections, filter, search, sortMode, affiniteFiltered, urgentBirthdaysOpen, urgentNameDaysOpen, urgentBirthdays, urgentNameDays]);

  const scrollToContactsList = useCallback(() => {
    const idx = allSections.findIndex((s: any) => s.letter === '__all_contacts__');
    if (idx >= 0) {
      scrollRef.current?.scrollToLocation({ sectionIndex: idx, itemIndex: 0, animated: false, viewOffset: 0 });
    } else {
      scrollRef.current?.getScrollResponder()?.scrollTo({ y: 0, animated: false });
    }
  }, [allSections]);

  useFocusEffect(useCallback(() => {
    const t = setTimeout(scrollToContactsList, 200);
    return () => clearTimeout(t);
  }, [scrollToContactsList]));

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
          <Text style={styles.title}>{t('contacts.title')}</Text>
          <Text style={styles.subtitle}>
            {t('contacts.personCount', { count: contacts.length })}
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
          placeholder={t('contacts.search')}
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
        contentContainerStyle={[styles.listContent, isTablet && styles.listContentTablet]}
        stickySectionHeadersEnabled={false}
        style={styles.list}
        ListHeaderComponent={
          <>
            {/* Accordéon : Comment ajouter des contacts */}
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => toggleAccordion(setAddContactsOpen)}
              activeOpacity={0.8}
            >
              <Text style={styles.accordionTitle}>📱 Comment ajouter des contacts :</Text>
              <Text style={styles.accordionChevron}>{addContactsOpen ? '▾' : '▸'}</Text>
            </TouchableOpacity>
            {addContactsOpen && (
              <View style={styles.accordionContent}>
                <Text style={styles.accordionDesc}>
                  Pour profiter pleinement de l'application, commence par ajouter tes contacts. Tu peux les importer automatiquement depuis ton téléphone ou les créer manuellement.
                </Text>
                <View style={[styles.actionCol, { paddingHorizontal: 0, marginTop: Spacing[3] }]}>
                  <TouchableOpacity style={styles.importBtn} onPress={handleImportPhone}>
                    <Text style={styles.importBtnText}>{t('contacts.import')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.addBtn} onPress={() => router.push({ pathname: '/(app)/contacts/new', params: { resetKey: Date.now().toString() } } as never)}>
                    <Text style={styles.addBtnText}>{t('contacts.addContact')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Accordéon : Comment partager mes contacts */}
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => toggleAccordion(setShareContactsOpen)}
              activeOpacity={0.8}
            >
              <Text style={styles.accordionTitle}>{t('contacts.shareAccordionTitle')}</Text>
              <Text style={styles.accordionChevron}>{shareContactsOpen ? '▾' : '▸'}</Text>
            </TouchableOpacity>
            {shareContactsOpen && (
              <TouchableOpacity
                style={styles.shareCard}
                onPress={() => router.push('/(app)/contacts/share' as never)}
                activeOpacity={0.85}
              >
                <View style={styles.shareCardLeft}>
                  <Text style={styles.shareCardIcon}>🔗</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.shareCardTitle}>{t('contacts.shareCardTitle')}</Text>
                    <Text style={styles.accordionDesc}>
                      {t('contacts.shareCardDesc')}
                    </Text>
                  </View>
                </View>
                <Text style={styles.shareCardArrow}>›</Text>
              </TouchableOpacity>
            )}

            {/* Accordéon : Comment retrouver rapidement des contacts */}
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => toggleAccordion(setFindContactsOpen)}
              activeOpacity={0.8}
            >
              <Text style={styles.accordionTitle}>{t('contacts.findAccordionTitle')}</Text>
              <Text style={styles.accordionChevron}>{findContactsOpen ? '▾' : '▸'}</Text>
            </TouchableOpacity>
            {findContactsOpen && (
              <View style={styles.accordionContent}>
                <Text style={styles.accordionDesc}>{t('contacts.findAccordionDesc')}</Text>
                <View style={[styles.filtersList, { paddingHorizontal: 0, marginTop: Spacing[3] }]}>
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
              </View>
            )}

            <TouchableOpacity style={[styles.accordionHeader, { borderWidth: 2, borderColor: '#F43F5E' }]} onPress={() => toggleAccordion(setBarometerOpen)} activeOpacity={0.8}>
              <Text style={styles.accordionTitle}>{t('contacts.barometerAccordionTitle')}</Text>
              <Text style={styles.accordionChevron}>{barometerOpen ? '▾' : '▸'}</Text>
            </TouchableOpacity>
            {barometerOpen && (
              <View style={styles.accordionContent}>
                {barometerContacts.length > 0 ? (
                  <View style={{ gap: 10 }}>
                    {barometerContacts.map((c) => {
                      const firstName = c.name.trim().split(/\s+/).find((w: string) => w !== w.toUpperCase()) ?? c.name.split(' ')[0];
                      const msg = c.daysSinceLastMessage === null
                        ? t('contacts.barometerNeverWritten', { name: firstName })
                        : t('contacts.barometerDaysSince', { count: c.daysSinceLastMessage, name: firstName });
                      return (
                        <TouchableOpacity
                          key={c.id}
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF1F7', borderRadius: Radii.lg, padding: 12, borderWidth: 1.5, borderColor: '#FBCFE8' }}
                          onPress={() => router.push({ pathname: '/(app)/create', params: { contactId: c.id } } as never)}
                          activeOpacity={0.85}
                        >
                          <Text style={{ fontSize: 28 }}>💌</Text>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: C.onSurface }}>{firstName}</Text>
                            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: C.onSurfaceVariant, lineHeight: 16 }}>{msg}</Text>
                          </View>
                          <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: C.primary }}>{t('contacts.writeLink')}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <Text style={styles.accordionDesc}>{t('contacts.barometerEmpty')}</Text>
                )}
              </View>
            )}

            {/* Titre section liste + toggle tri */}
            {filter !== 'pets' && (
              <>
                <Text style={styles.listSectionTitle}>{t('contacts.title')}</Text>
                <View style={styles.sortToggleRow}>
                  <TouchableOpacity
                    style={[styles.sortToggleBtn, sortMode === 'alpha' && styles.sortToggleBtnActive]}
                    onPress={() => switchSortMode('alpha')}
                  >
                    <Text style={[styles.sortToggleText, sortMode === 'alpha' && styles.sortToggleTextActive]}>{t('contacts.sortAlpha')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.sortToggleBtn, sortMode === 'affinite' && styles.sortToggleBtnActive]}
                    onPress={() => switchSortMode('affinite')}
                  >
                    <Text style={[styles.sortToggleText, sortMode === 'affinite' && styles.sortToggleTextActive]}>{t('contacts.sortAffinity')}</Text>
                  </TouchableOpacity>
                </View>
                {sortMode === 'affinite' && (
                  <View style={styles.affiniteIntroRow}>
                    <Text style={styles.affiniteIntroText}>
                      Tes contacts les plus proches et les plus actifs apparaissent en premier ⭐ Le classement évolue automatiquement selon la fréquence de vos échanges et les événements à venir 💛
                    </Text>
                    <TouchableOpacity style={styles.affiniteHelpBtn} onPress={() => setAffiniteHelpVisible(true)}>
                      <Text style={styles.affiniteHelpBtnText}>ℹ️</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}

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
                            <TouchableOpacity onPress={() => router.push(`/(app)/contact/${pet.id}` as never)}>
                              <Text style={styles.petFilterCardName}>
                                {pet.name}{(pet as any).breed ? ` · ${(pet as any).breed}` : ''} ›
                              </Text>
                            </TouchableOpacity>
                            {ownerContact && (
                              <TouchableOpacity onPress={() => router.push(`/(app)/contact/${ownerContact.id}` as never)}>
                                <Text style={styles.petFilterCardOwner}>📎 {ownerContact.name}</Text>
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
                            onPress={() => router.push({ pathname: '/(app)/create', params: { contactId: pet.id } } as never)}
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
          letter === '__affinite__' ? (
            <View style={styles.allContactsHeader}>
              <Text style={styles.allContactsLabel}>{t('contacts.allContactsAffinity')}</Text>
            </View>
          ) : letter === '__urgent_birthday__' ? (
            <TouchableOpacity
              style={[styles.urgentHeader, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
              onPress={() => setUrgentBirthdaysOpen((o) => !o)}
              activeOpacity={0.7}
            >
              <Text style={styles.urgentLabel}>{t('contacts.urgentBirthdays')}{!urgentBirthdaysOpen ? ` (${urgentBirthdays.length})` : ''} :</Text>
              <Text style={styles.urgentLabel}>{urgentBirthdaysOpen ? '−' : '+'}</Text>
            </TouchableOpacity>
          ) : letter === '__urgent_nameday__' ? (
            <TouchableOpacity
              style={[styles.urgentHeader, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
              onPress={() => setUrgentNameDaysOpen((o) => !o)}
              activeOpacity={0.7}
            >
              <Text style={styles.urgentLabel}>{t('contacts.urgentNameDays')}{!urgentNameDaysOpen ? ` (${urgentNameDays.length})` : ''} :</Text>
              <Text style={styles.urgentLabel}>{urgentNameDaysOpen ? '−' : '+'}</Text>
            </TouchableOpacity>
          ) : letter === '__all_contacts__' ? (
            <View style={styles.allContactsHeader}>
              <Text style={styles.allContactsLabel}>{t('contacts.allContactsAlpha')}{'  '}<Text style={{ fontSize: Typography.xl, fontFamily: 'PlusJakartaSans_800ExtraBold', color: Colors.onSurface }}>({t('contacts.sortAlpha')})</Text></Text>
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
            onPress={() => goToContact(item.id)}
            onCreateMessage={() =>
              router.push({ pathname: '/(app)/create', params: { contactId: item.id } } as never)
            }
            isPartnerContact={partnerContactIds.has(item.id)}
            allContacts={contacts}
          />
        )}
        ListEmptyComponent={
          filter !== 'pets' ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyEmoji}>👥</Text>
              <Text style={styles.emptyTitle}>{t('contacts.emptyTitle')}</Text>
              <Text style={styles.emptySub}>{t('contacts.addFirst')}</Text>
            </View>
          ) : null
        }
      />
      {/* Modal aide — filtre animaux */}
      <Modal visible={petHelpVisible} transparent animationType="fade" onRequestClose={() => setPetHelpVisible(false)}>
        <TouchableOpacity style={styles.petHelpOverlay} activeOpacity={1} onPress={() => setPetHelpVisible(false)}>
          <View style={styles.petHelpCard}>
            <View style={styles.petHelpHeader}>
              <Text style={styles.petHelpTitle}>{t('contacts.petHelpTitle')}</Text>
              <TouchableOpacity onPress={() => setPetHelpVisible(false)}>
                <Text style={styles.petHelpClose}>{t('contacts.close')}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {[
                { title: t('contacts.petHelp1Title'), body: t('contacts.petHelp1Body') },
                { title: t('contacts.petHelp2Title'), body: t('contacts.petHelp2Body') },
                { title: t('contacts.petHelp3Title'), body: t('contacts.petHelp3Body') },
                { title: t('contacts.petHelp4Title'), body: t('contacts.petHelp4Body') },
                { title: t('contacts.petHelp5Title'), body: t('contacts.petHelp5Body') },
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

      {/* Modal aide — classement par affinité */}
      <Modal visible={affiniteHelpVisible} transparent animationType="fade" onRequestClose={() => setAffiniteHelpVisible(false)}>
        <TouchableOpacity style={styles.petHelpOverlay} activeOpacity={1} onPress={() => setAffiniteHelpVisible(false)}>
          <View style={styles.petHelpCard}>
            <View style={styles.petHelpHeader}>
              <Text style={styles.petHelpTitle}>{t('contacts.affiniteHelpTitle')}</Text>
              <TouchableOpacity onPress={() => setAffiniteHelpVisible(false)}>
                <Text style={styles.petHelpClose}>{t('contacts.close')}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {[
                { title: t('contacts.affiniteHelp1Title'), body: t('contacts.affiniteHelp1Body') },
                { title: t('contacts.affiniteHelp2Title'), body: t('contacts.affiniteHelp2Body') },
                { title: t('contacts.affiniteHelp3Title'), body: t('contacts.affiniteHelp3Body') },
                { title: t('contacts.affiniteHelp4Title'), body: t('contacts.affiniteHelp4Body') },
                { title: t('contacts.affiniteHelp5Title'), body: t('contacts.affiniteHelp5Body') },
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
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: C.primaryContainer },
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

  accordionContent: {
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[4],
    backgroundColor: '#F3EEFE',
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderColor: '#7C3AED30',
    padding: Spacing[4],
    flexDirection: 'column',
  },

  shareCard: {
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[4],
    backgroundColor: '#F3EEFE',
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderColor: '#7C3AED30',
    padding: Spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  shareCardLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing[3], flex: 1 },
  shareCardIcon: { fontSize: 26, marginTop: 2 },
  shareCardTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: '#5B21B6', marginBottom: 4 },
  shareCardDesc: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: '#6D28D9', lineHeight: 18 },
  accordionDesc: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: '#6D28D9', lineHeight: 22 },
  shareCardArrow: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 22, color: '#7C3AED' },

  affiniteIntroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginHorizontal: Spacing[5],
    marginTop: -Spacing[1],
    marginBottom: Spacing[3],
    backgroundColor: '#FFF9E6',
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: '#FCD34D50',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  affiniteIntroText: {
    flex: 1,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: '#92400E',
    lineHeight: 19,
  },
  affiniteHelpBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#FDE68A',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, marginTop: 1,
  },
  affiniteHelpBtnText: { fontSize: 14, lineHeight: 17 },

  listSectionTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    textAlign: 'center',
    marginHorizontal: Spacing[5],
    marginTop: Spacing[4],
    marginBottom: Spacing[2],
  },
  sortToggleRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing[5],
    marginTop: Spacing[2],
    marginBottom: Spacing[3],
    gap: 8,
  },
  sortToggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radii.full,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    backgroundColor: 'transparent',
  },
  sortToggleBtnActive: {
    borderColor: C.primary,
    backgroundColor: C.primaryContainer,
  },
  sortToggleText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.lg,
    color: Colors.onSurfaceVariant,
  },
  sortToggleTextActive: {
    color: C.primary,
  },

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
  listContentTablet: { maxWidth: 720, width: '100%', alignSelf: 'center' },

  urgentHeader: {
    paddingVertical: 6,
    paddingHorizontal: Spacing[4],
    marginTop: Spacing[2],
  },
  urgentLabel: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.xl,
    letterSpacing: 0.3,
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
    letterSpacing: 0.3,
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

  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[2],
    marginTop: Spacing[2],
  },
  accordionTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: C.primary,
    flex: 1,
  },
  accordionChevron: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 18,
    color: C.primary,
    marginLeft: Spacing[2],
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
