import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  Modal,
  BackHandler,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  YOUTH_MESSAGE_LIBRARY,
  YOUTH_GRADUATION_LIBRARY,
  YOUTH_FIRSTJOB_LIBRARY,
  type YouthSubCategory,
  type YouthMessage,
  type YouthAgeGroup,
} from '../../src/constants/youthMessages';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { useColors } from '../../src/hooks/useColors';

type ViewMode = 'age_groups' | 'subcategories' | 'messages';

const ACCENT = '#7C3AED';
const ACCENT_LIGHT = '#F3EFFF';

export default function YouthMessageLibraryScreen() {
  const C = useColors();
  const router = useRouter();

  const { contactId, contactName, occasion, contactAge } = useLocalSearchParams<{
    contactId: string;
    contactName: string;
    occasion: 'birthday' | 'nameday' | 'graduation' | 'first_job';
    contactAge?: string;
  }>();

  const age = contactAge ? parseInt(contactAge, 10) : null;
  const library = occasion === 'graduation'
    ? YOUTH_GRADUATION_LIBRARY
    : occasion === 'first_job'
      ? YOUTH_FIRSTJOB_LIBRARY
      : YOUTH_MESSAGE_LIBRARY[occasion ?? 'birthday'];

  const autoGroup = age !== null
    ? (age >= 13 && age <= 17 ? 'ado' : age >= 18 && age <= 25 ? 'young_adult' : null)
    : null;

  const [view, setView] = useState<ViewMode>(autoGroup ? 'subcategories' : 'age_groups');
  const [selectedGroup, setSelectedGroup] = useState<YouthAgeGroup | null>(
    autoGroup ? (library.find((g) => g.id === autoGroup) ?? null) : null,
  );
  const [selectedSubCat, setSelectedSubCat] = useState<YouthSubCategory | null>(null);
  const [previewMsg, setPreviewMsg] = useState<YouthMessage | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (previewMsg) { setPreviewMsg(null); return true; }
      if (view === 'messages') { setView('subcategories'); setSelectedSubCat(null); return true; }
      if (view === 'subcategories') {
        if (autoGroup) { router.back(); } else { setView('age_groups'); setSelectedGroup(null); }
        return true;
      }
      return false;
    });
    return () => handler.remove();
  }, [view, previewMsg, autoGroup]);

  const firstName = (() => { const p = (contactName ?? '').trim().split(/\s+/); const f = p.filter((w) => !(w === w.toUpperCase() && /[A-Z]/.test(w))); return f.join(' ') || p[0] || contactName || ''; })();
  const fillMessage = (body: string): string =>
    body
      .replace(/^\d{1,3}\.\s*/, '')
      .replace(/\[Prénom\]/g, firstName);

  const handleBack = () => {
    if (previewMsg) { setPreviewMsg(null); return; }
    if (view === 'messages') { setView('subcategories'); setSelectedSubCat(null); return; }
    if (view === 'subcategories') {
      if (autoGroup) { router.back(); } else { setView('age_groups'); setSelectedGroup(null); return; }
      return;
    }
    router.back();
  };

  const useMessage = (msg: YouthMessage) => {
    router.push({
      pathname: '/(app)/create/preview',
      params: {
        contactId: contactId ?? '',
        prefillMessage: fillMessage(msg.body),
        fromTemplate: '1',
      },
    } as never);
  };

  const headerTitle = (() => {
    if (view === 'age_groups') return '😎 Mode Jeune';
    if (view === 'subcategories') return selectedGroup ? `${selectedGroup.label}` : '😎 Mode Jeune';
    return selectedSubCat?.label ?? '😎 Mode Jeune';
  })();

  const occasionLabel = occasion === 'nameday' ? 'Bonne fête' : 'Anniversaire';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={handleBack} style={styles.backLink}>
          <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>😎 {headerTitle}</Text>
        <View style={{ minWidth: 70 }} />
      </View>

      {/* ── VIEW A : AGE GROUPS ─────────────────────────────────────────── */}
      {view === 'age_groups' && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.heroBanner}>
            <Text style={styles.heroEmoji}>😎</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.heroTitle, { color: ACCENT }]}>Mode Jeune — {occasionLabel}</Text>
              <Text style={[styles.heroSub, { color: C.onSurfaceVariant }]}>
                {`Messages écrits par un ado/jeune à un(e) ami(e) — 120 messages par groupe d'âge`}
              </Text>
            </View>
          </View>
          {library.map((group) => {
            const isRecommended = age !== null && age >= group.minAge && age <= group.maxAge;
            return (
              <TouchableOpacity
                key={group.id}
                style={[styles.groupCard, { backgroundColor: C.surface }, isRecommended && styles.groupCardRecommended]}
                onPress={() => { setSelectedGroup(group); setView('subcategories'); }}
                activeOpacity={0.85}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={[styles.groupLabel, { color: isRecommended ? ACCENT : C.onSurface }]}>
                      {group.label}
                    </Text>
                    {isRecommended && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>✨ Recommandé pour {contactName}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.groupSub, { color: C.onSurfaceVariant }]}>
                    120 messages · 6 ambiances
                  </Text>
                </View>
                <Text style={[styles.arrow, { color: isRecommended ? ACCENT : C.outlineVariant }]}>›</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* ── VIEW B : SUB-CATEGORIES ─────────────────────────────────────── */}
      {view === 'subcategories' && selectedGroup && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.heroBanner, { backgroundColor: ACCENT_LIGHT }]}>
            <Text style={styles.heroEmoji}>😎</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.heroTitle, { color: ACCENT }]}>
                {occasionLabel} · {selectedGroup.label}
              </Text>
              <Text style={[styles.heroSub, { color: ACCENT + 'AA' }]}>
                Choisis l'ambiance du message
              </Text>
            </View>
          </View>
          {selectedGroup.subCategories.map((sc) => (
            <TouchableOpacity
              key={sc.id}
              style={[styles.subcatCard, { backgroundColor: C.surface }]}
              onPress={() => { setSelectedSubCat(sc); setView('messages'); }}
              activeOpacity={0.85}
            >
              <Text style={styles.subcatEmoji}>{sc.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.subcatLabel, { color: C.onSurface }]}>{sc.label}</Text>
                <Text style={[styles.subcatCount, { color: C.onSurfaceVariant }]}>
                  {sc.messages.length} messages
                </Text>
              </View>
              <Text style={[styles.arrow, { color: C.outlineVariant }]}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* ── VIEW C : MESSAGES ───────────────────────────────────────────── */}
      {view === 'messages' && selectedSubCat && (
        <FlatList
          contentContainerStyle={styles.content}
          data={selectedSubCat.messages}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={[styles.heroBanner, { backgroundColor: ACCENT_LIGHT }]}>
              <Text style={styles.heroEmoji}>{selectedSubCat.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.heroTitle, { color: ACCENT }]}>{selectedSubCat.label}</Text>
                <Text style={[styles.heroSub, { color: ACCENT + 'AA' }]}>
                  {selectedSubCat.messages.length} messages
                </Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.msgCard, { backgroundColor: C.surface }]}>
              <Text style={[styles.msgAngle, { color: C.onSurface }]} numberOfLines={2}>
                {item.angle.replace(/\[Prénom\]/g, firstName || '[Prénom]')}
              </Text>
              <Text style={[styles.msgPreview, { color: C.onSurfaceVariant }]} numberOfLines={2}>
                {fillMessage(item.body).split('\n').slice(1).join(' ').slice(0, 180)}
              </Text>
              <View style={styles.msgBtnRow}>
                <TouchableOpacity onPress={() => setPreviewMsg(item)} activeOpacity={0.75}>
                  <Text style={[styles.seeMoreBtn, { color: ACCENT }]}>👁️ Voir en entier</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.useBtn, { backgroundColor: ACCENT }]}
                  onPress={() => useMessage(item)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.useBtnText}>✉️ Utiliser ›</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Modal aperçu message complet */}
      <Modal
        visible={!!previewMsg}
        transparent
        animationType="slide"
        onRequestClose={() => setPreviewMsg(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPreviewMsg(null)}
        >
          <TouchableOpacity activeOpacity={1} style={[styles.modalCard, { backgroundColor: C.surface }]}>
            <Text style={[styles.modalTitle, { color: C.onSurface }]}>📄 Message complet</Text>
            <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalText, { color: C.onSurface }]}>
                {previewMsg ? fillMessage(previewMsg.body) : ''}
              </Text>
            </ScrollView>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity
                style={[styles.modalBtn, { borderColor: C.outline, flex: 1 }]}
                onPress={() => setPreviewMsg(null)}
              >
                <Text style={[styles.modalBtnText, { color: C.onSurface }]}>Fermer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: ACCENT, flex: 1 }]}
                onPress={() => { const m = previewMsg; setPreviewMsg(null); if (m) useMessage(m); }}
              >
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>✉️ Utiliser ›</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: 10,
    gap: 8,
  },
  backLink: { justifyContent: 'center', minWidth: 70 },
  backLinkText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
  topbarTitle: {
    flex: 1,
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    textAlign: 'center',
    color: Colors.onSurface,
  },
  content: {
    padding: Spacing[4],
    gap: 10,
    paddingBottom: 80,
  },
  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: Radii.lg,
    marginBottom: 4,
    backgroundColor: '#F3EFFF',
  },
  heroEmoji: { fontSize: 32 },
  heroTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    marginBottom: 2,
  },
  heroSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    lineHeight: 16,
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: Radii.xl,
    padding: 16,
    ...Shadows.sm,
  },
  groupCardRecommended: {
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  groupLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
  },
  groupSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#7C3AED20',
    borderRadius: Radii.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 10,
    color: '#7C3AED',
  },
  arrow: { fontSize: 24 },
  subcatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: Radii.lg,
    padding: 14,
    ...Shadows.sm,
  },
  subcatEmoji: { fontSize: 28 },
  subcatLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    marginBottom: 2,
  },
  subcatCount: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
  },
  msgCard: {
    borderRadius: Radii.xl,
    padding: 14,
    gap: 8,
    ...Shadows.sm,
  },
  msgAngle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    lineHeight: 20,
  },
  msgPreview: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    lineHeight: 18,
  },
  msgBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  seeMoreBtn: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
  },
  useBtn: {
    borderRadius: Radii.full,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  useBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  modalTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.lg,
    marginBottom: 12,
  },
  modalText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    lineHeight: 22,
  },
  modalBtn: {
    borderRadius: Radii.full,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  modalBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
  },
});
