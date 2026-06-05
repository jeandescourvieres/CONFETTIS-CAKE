import React, { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Modal, TextInput, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useContacts } from '../../src/hooks/useContacts';
import { getAge } from '../../src/utils/dateHelpers';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { useColors } from '../../src/hooks/useColors';
import type { Contact } from '../../src/types/models';

// ── Catégories disponibles ────────────────────────────────────────────────────

type CategoryConfig = {
  id: string;
  emoji: string;
  title: string;
  sub: string;
  count: number;
  color: string;
  bgColor: string;
  section: string;
  route: string;
  getParams: (c: Contact) => Record<string, string>;
};

const CATEGORIES: CategoryConfig[] = [
  // Anniversaire
  {
    id: 'b_ado', emoji: '🎂', title: 'Anniversaire 13-17 ans',
    sub: '6 ambiances · fête entre amis ados', count: 120,
    color: '#7C3AED', bgColor: '#F3EFFF', section: '🎂 Son anniv — les textes qui font vraiment la différence',
    route: '/(app)/youth-message-library',
    getParams: (c) => ({ contactId: c.id, contactName: firstName(c), occasion: 'birthday', contactAge: '15' }),
  },
  {
    id: 'b_young', emoji: '🎂', title: 'Anniversaire 18-25 ans',
    sub: '6 ambiances · jeunes adultes', count: 120,
    color: '#6D28D9', bgColor: '#EDE9FE', section: '🎂 Son anniv — les textes qui font vraiment la différence',
    route: '/(app)/youth-message-library',
    getParams: (c) => ({ contactId: c.id, contactName: firstName(c), occasion: 'birthday', contactAge: '20' }),
  },
  // Fête du prénom
  {
    id: 'n_ado', emoji: '🌸', title: 'Bonne fête 13-17 ans',
    sub: '6 ambiances · fête du prénom ado', count: 120,
    color: '#DB2777', bgColor: '#FDF2F8', section: '🌸 Bonne fête — deux mots qui changent une journée',
    route: '/(app)/youth-message-library',
    getParams: (c) => ({ contactId: c.id, contactName: firstName(c), occasion: 'nameday', contactAge: '15' }),
  },
  {
    id: 'n_young', emoji: '🌸', title: 'Bonne fête 18-25 ans',
    sub: '6 ambiances · jeunes adultes', count: 120,
    color: '#BE185D', bgColor: '#FCE7F3', section: '🌸 Bonne fête — deux mots qui changent une journée',
    route: '/(app)/youth-message-library',
    getParams: (c) => ({ contactId: c.id, contactName: firstName(c), occasion: 'nameday', contactAge: '20' }),
  },
  // Occasions
  {
    id: 'grad', emoji: '🎓', title: 'Diplôme · Bac · Brevet',
    sub: '5 angles · ados 13-17 ans', count: 100,
    color: '#059669', bgColor: '#ECFDF5', section: '🎓 Les grandes étapes de la vie',
    route: '/(app)/youth-message-library',
    getParams: (c) => ({ contactId: c.id, contactName: firstName(c), occasion: 'graduation', contactAge: '15' }),
  },
  {
    id: 'job', emoji: '💼', title: 'Premier job · Stage',
    sub: '5 angles · 18-25 ans', count: 100,
    color: '#0284C7', bgColor: '#EFF6FF', section: '🎓 Les grandes étapes de la vie',
    route: '/(app)/youth-message-library',
    getParams: (c) => ({ contactId: c.id, contactName: firstName(c), occasion: 'first_job', contactAge: '22' }),
  },
  {
    id: 'parent', emoji: '🫂', title: 'Ado → Parent · Anniversaire',
    sub: '5 ambiances · un ado écrit à son parent', count: 100,
    color: '#D97706', bgColor: '#FFFBEB', section: '🎓 Les grandes étapes de la vie',
    route: '/(app)/ado-parent-library',
    getParams: (c) => ({ contactId: c.id, contactName: firstName(c), contactCivilite: c.civilite ?? '' }),
  },
  // Nouvelles occasions
  {
    id: 'cremaillere', emoji: '🏠', title: 'Crémaillère · Premier appart',
    sub: '5 ambiances · bienvenue chez toi', count: 100,
    color: '#7C3AED', bgColor: '#EDE9FE', section: '🏠 Les tournants qu\'on n\'oublie pas',
    route: '/(app)/cremaillere-library',
    getParams: (c) => ({ contactId: c.id, contactName: firstName(c) }),
  },
  {
    id: 'depart', emoji: '✈️', title: 'Départ à l\'étranger · Erasmus',
    sub: '5 ambiances · l\'ami qui part', count: 100,
    color: '#0EA5E9', bgColor: '#E0F2FE', section: '🏠 Les tournants qu\'on n\'oublie pas',
    route: '/(app)/depart-library',
    getParams: (c) => ({ contactId: c.id, contactName: firstName(c) }),
  },
  {
    id: '18ans', emoji: '🔞', title: '18 ans · La majorité',
    sub: '5 ambiances · occasion à part entière', count: 100,
    color: '#F59E0B', bgColor: '#FFFBEB', section: '🏠 Les tournants qu\'on n\'oublie pas',
    route: '/(app)/dix-huit-ans-library',
    getParams: (c) => ({ contactId: c.id, contactName: firstName(c) }),
  },
];

const DETESTE_ITEMS = [
  { id: 'dt_b', emoji: '🎂', label: 'Anniversaire', occasion: 'birthday' },
  { id: 'dt_n', emoji: '🌸', label: 'Fête du prénom', occasion: 'nameday' },
  { id: 'dt_g', emoji: '🎓', label: 'Diplôme', occasion: 'graduation' },
  { id: 'dt_j', emoji: '💼', label: 'Premier job', occasion: 'first_job' },
  { id: 'dt_p', emoji: '🫂', label: 'Ado → Parent', occasion: 'ado_parent' },
];

const TIMIDE_ITEMS = [
  { id: 'tm_b', emoji: '🎂', label: 'Anniversaire', occasion: 'birthday' },
  { id: 'tm_n', emoji: '🌸', label: 'Fête du prénom', occasion: 'nameday' },
  { id: 'tm_g', emoji: '🎓', label: 'Diplôme', occasion: 'graduation' },
  { id: 'tm_d', emoji: '✈️', label: 'Départ', occasion: 'departure' },
  { id: 'tm_c', emoji: '🏠', label: 'Crémaillère', occasion: 'cremaillere' },
];

function firstName(c: Contact) {
  const parts = c.name.trim().split(/\s+/);
  const first = parts.filter((w) => !(w === w.toUpperCase() && /[A-Z]/.test(w)));
  return first.join(' ') || parts[0] || c.name;
}

// ── Contact Picker Modal ──────────────────────────────────────────────────────

function ContactPicker({
  visible, onSelect, onClose,
}: {
  visible: boolean;
  onSelect: (c: Contact) => void;
  onClose: () => void;
}) {
  const C = useColors();
  const { data: contacts = [] } = useContacts();
  const [search, setSearch] = useState('');
  const filtered = useMemo(
    () => contacts.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [contacts, search],
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={pickerStyles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={[pickerStyles.sheet, { backgroundColor: C.background }]}>
          <View style={pickerStyles.handle} />
          <Text style={[pickerStyles.title, { color: C.onSurface }]}>Pour qui est ce message ?</Text>
          <TextInput
            style={[pickerStyles.input, { backgroundColor: C.surface, color: C.onSurface }]}
            value={search}
            onChangeText={setSearch}
            placeholder="Rechercher un contact..."
            placeholderTextColor={Colors.outlineVariant}
            autoFocus
          />
          <FlatList
            data={filtered}
            keyExtractor={(c) => c.id}
            style={{ maxHeight: 360 }}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item: c }) => (
              <TouchableOpacity
                style={[pickerStyles.row, { borderBottomColor: C.surfaceContainerHighest }]}
                onPress={() => { setSearch(''); onSelect(c); }}
                activeOpacity={0.75}
              >
                <View style={[pickerStyles.avatar, { backgroundColor: '#7C3AED' }]}>
                  <Text style={{ color: '#fff', fontFamily: 'BeVietnamPro_700Bold', fontSize: 14 }}>
                    {(firstName(c))[0]?.toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[pickerStyles.rowName, { color: C.onSurface }]}>{firstName(c)}</Text>
                  {c.birthday && (
                    <Text style={[pickerStyles.rowSub, { color: C.onSurfaceVariant }]}>
                      {(() => { const a = getAge(c.birthday!, false); return a !== null ? `${a} ans` : ''; })()}
                    </Text>
                  )}
                </View>
                <Text style={{ color: C.outlineVariant, fontSize: 20 }}>›</Text>
              </TouchableOpacity>
            )}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function ModeJeuneScreen() {
  const C = useColors();
  const router = useRouter();
  const { preselectedContactId } = useLocalSearchParams<{ preselectedContactId?: string }>();
  const { data: contacts = [] } = useContacts();

  const [pickerVisible, setPickerVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<null | ((c: Contact) => void)>(null);

  const preselected = preselectedContactId ? contacts.find((c) => c.id === preselectedContactId) : null;

  const navigate = (cat: CategoryConfig, c: Contact) => {
    router.push({ pathname: cat.route as never, params: cat.getParams(c) } as never);
  };

  const navigateDeteste = (occasion: string, c: Contact) => {
    router.push({
      pathname: '/(app)/deteste-message-library',
      params: { contactId: c.id, contactName: firstName(c), occasion, contactCivilite: c.civilite ?? '' },
    } as never);
  };

  const handleCategoryPress = (cat: CategoryConfig) => {
    if (preselected) {
      navigate(cat, preselected);
      return;
    }
    setPendingAction(() => (c: Contact) => navigate(cat, c));
    setPickerVisible(true);
  };

  const handleDestestePress = (occasion: string) => {
    if (preselected) {
      navigateDeteste(occasion, preselected);
      return;
    }
    setPendingAction(() => (c: Contact) => navigateDeteste(occasion, c));
    setPickerVisible(true);
  };

  const navigateTimide = (occasion: string, c: Contact) => {
    router.push({
      pathname: '/(app)/timide-library',
      params: { contactId: c.id, contactName: firstName(c), occasion },
    } as never);
  };

  const handleTimidePress = (occasion: string) => {
    if (preselected) {
      navigateTimide(occasion, preselected);
      return;
    }
    setPendingAction(() => (c: Contact) => navigateTimide(occasion, c));
    setPickerVisible(true);
  };

  const handleContactSelect = (c: Contact) => {
    setPickerVisible(false);
    if (pendingAction) {
      pendingAction(c);
      setPendingAction(null);
    }
  };

  // Grouper les catégories par section
  const sections = useMemo(() => {
    const map = new Map<string, CategoryConfig[]>();
    for (const cat of CATEGORIES) {
      if (!map.has(cat.section)) map.set(cat.section, []);
      map.get(cat.section)!.push(cat);
    }
    return Array.from(map.entries());
  }, []);

  const totalMessages = CATEGORIES.reduce((a, c) => a + c.count, 0) + 100;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>😎 Mode Jeune</Text>
        <View style={{ minWidth: 70 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient
          colors={['#4C1D95', '#7C3AED', '#A855F7']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroEmoji}>😎</Text>
          <Text style={styles.heroTitle}>Mode Jeune</Text>
          <Text style={styles.heroSub}>
            {totalMessages} messages dans le vrai style ado et jeune adulte
          </Text>
        </LinearGradient>

        {/* Sections catégories */}
        {sections.map(([sectionTitle, cats]) => (
          <View key={sectionTitle} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: C.onSurface }]}>{sectionTitle}</Text>
            {cats.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catCard, { backgroundColor: cat.bgColor, borderColor: cat.color + '40', borderWidth: 2 }]}
                onPress={() => handleCategoryPress(cat)}
                activeOpacity={0.85}
              >
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.catTitle, { color: cat.color }]}>{cat.title}</Text>
                  <Text style={[styles.catSub, { color: C.onSurfaceVariant }]}>{cat.sub}</Text>
                </View>
                <View style={[styles.catBadge, { backgroundColor: cat.color }]}>
                  <Text style={styles.catBadgeText}>{cat.count}</Text>
                </View>
                <Text style={[styles.arrow, { color: cat.color }]}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Section Je déteste les messages */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: C.onSurface }]}>🙄 Je déteste les messages</Text>
          <View style={[styles.destesteHero, { backgroundColor: '#F9FAFB', borderColor: '#D1D5DB', borderWidth: 1.5 }]}>
            <Text style={[styles.destesteDesc, { color: C.onSurfaceVariant }]}>
              {"Pour ceux qui écrivent rarement — mais quand ils écrivent, ça compte. 20 messages par occasion, sincères et sans fioriture."}
            </Text>
          </View>
          <View style={styles.destesteGrid}>
            {DETESTE_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.destesteCard, { backgroundColor: C.surface, borderColor: '#E5E7EB', borderWidth: 1.5 }]}
                onPress={() => handleDestestePress(item.occasion)}
                activeOpacity={0.82}
              >
                <Text style={styles.destesteEmoji}>{item.emoji}</Text>
                <Text style={[styles.destesteLabel, { color: C.onSurface }]} numberOfLines={2}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section Timide qui ose */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: C.onSurface }]}>🫣 Le timide qui ose</Text>
          <View style={[styles.destesteHero, { backgroundColor: '#F9FAFB', borderColor: '#D1D5DB', borderWidth: 1.5 }]}>
            <Text style={[styles.destesteDesc, { color: C.onSurfaceVariant }]}>
              {"Je dis pas souvent des trucs — mais là je le fais. 20 messages par occasion, sincères et un peu maladroits, comme la vraie vie."}
            </Text>
          </View>
          <View style={styles.destesteGrid}>
            {TIMIDE_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.destesteCard, { backgroundColor: C.surface, borderColor: '#E5E7EB', borderWidth: 1.5 }]}
                onPress={() => handleTimidePress(item.occasion)}
                activeOpacity={0.82}
              >
                <Text style={styles.destesteEmoji}>{item.emoji}</Text>
                <Text style={[styles.destesteLabel, { color: C.onSurface }]} numberOfLines={2}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: C.onSurfaceVariant }]}>
            {totalMessages} messages · mis à jour régulièrement
          </Text>
        </View>
      </ScrollView>

      {/* Contact Picker */}
      <ContactPicker
        visible={pickerVisible}
        onSelect={handleContactSelect}
        onClose={() => { setPickerVisible(false); setPendingAction(null); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topbar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing[4], paddingVertical: 10, gap: 8 },
  backLink: { justifyContent: 'center', minWidth: 70 },
  backLinkText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
  topbarTitle: { flex: 1, fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, textAlign: 'center', color: Colors.onSurface },
  content: { padding: Spacing[4], paddingBottom: 80, gap: 20 },

  hero: { borderRadius: 20, padding: 16, alignItems: 'center', gap: 6 },
  heroEmoji: { fontSize: 32 },
  heroTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 22, color: '#fff', textAlign: 'center' },
  heroSub: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: '#E9D5FF', textAlign: 'center' },
  heroTagline: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: '#EDE9FE', textAlign: 'center', lineHeight: 20 },

  section: { gap: 10 },
  sectionTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 17, marginBottom: 2 },

  catCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, padding: 16, ...Shadows.sm },
  catEmoji: { fontSize: 28 },
  catTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, marginBottom: 2 },
  catSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm },
  catBadge: { borderRadius: Radii.full, paddingHorizontal: 8, paddingVertical: 3, minWidth: 36, alignItems: 'center' },
  catBadgeText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 11, color: '#fff' },
  arrow: { fontSize: 22 },

  destesteHero: { borderRadius: 12, padding: 14 },
  destesteDesc: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, lineHeight: 20, fontStyle: 'italic' },
  destesteGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  destesteCard: { borderRadius: 12, padding: 12, alignItems: 'center', gap: 6, width: '18%', minWidth: 60, flexGrow: 1, ...Shadows.sm },
  destesteEmoji: { fontSize: 22 },
  destesteLabel: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 11, textAlign: 'center', lineHeight: 14 },

  footer: { alignItems: 'center', paddingTop: 8 },
  footerText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs },
});

const pickerStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36, maxHeight: '80%' },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', alignSelf: 'center', marginBottom: 16 },
  title: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.lg, marginBottom: 12, textAlign: 'center' },
  input: { borderRadius: 12, padding: 12, fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 0.5 },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  rowName: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
  rowSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, marginTop: 1 },
});
