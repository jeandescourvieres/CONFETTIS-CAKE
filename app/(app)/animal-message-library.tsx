import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  Modal,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  PET_MESSAGE_LIBRARY,
  getLibraryKey,
  type LibraryTheme,
  type LibrarySubGroup,
  type LibraryMessage,
} from '../../src/constants/petMessagesLibrary';
import { getPetImageUrl } from '../../src/utils/petImageUrl';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { useColors } from '../../src/hooks/useColors';
import { useAuthStore } from '../../src/stores/authStore';
import { useContacts } from '../../src/hooks/useContacts';

const PET_EMOJI: Record<string, string> = {
  chien: '🐶',
  chat: '🐱',
};

type ViewMode = 'themes' | 'subgroups' | 'messages';

export default function AnimalMessageLibraryScreen() {
  const C = useColors();
  const router = useRouter();
  const myProfile = useAuthStore((s) => s.profile);

  const {
    petId,
    petName,
    petType,
    petGender,
    breed,
    targetName,
    targetId,
    occasion,
    ownerName,
    ownerId,
  } = useLocalSearchParams<{
    petId: string;
    petName: string;
    petType: string;
    petGender?: string;
    breed?: string;
    targetName: string;
    targetId: string;
    occasion: 'birthday' | 'nameday';
    ownerName?: string;
    ownerId?: string;
  }>();

  const libraryKey = getLibraryKey(petType ?? '', occasion ?? '');
  const library = libraryKey ? PET_MESSAGE_LIBRARY[libraryKey] : null;
  const petEmoji = PET_EMOJI[petType ?? ''] ?? '🐾';

  const { data: allContacts = [] } = useContacts();
  const ownerContact = ownerId
    ? allContacts.find((c) => c.id === ownerId)
    : ownerName
      ? allContacts.find((c) => c.name === ownerName)
      : null;
  const ownerIsMale = ownerContact
    ? ownerContact.civilite === 'M.'
    : myProfile?.civilite === 'M.';
  const maitre = ownerIsMale ? 'mon maître' : 'ma maîtresse';

  const fillMessage = (body: string): string =>
    body
      .replace(/^\d+\.\s*/, '')
      .replace(/\[mon maître\/ma maîtresse\]/g, maitre)
      .replace(/\[Prénom animal\]/g, petName ?? '')
      .replace(/\[e\]/g, ownerIsMale ? '' : 'e');

  const [view, setView] = useState<ViewMode>('themes');
  const [selectedTheme, setSelectedTheme] = useState<LibraryTheme | null>(null);
  const [selectedSubGroup, setSelectedSubGroup] = useState<LibrarySubGroup | null>(null);
  const [previewMsg, setPreviewMsg] = useState<LibraryMessage | null>(null);

  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (previewMsg) { setPreviewMsg(null); return true; }
      if (view === 'messages') { setView('subgroups'); return true; }
      if (view === 'subgroups') { setView('themes'); setSelectedSubGroup(null); return true; }
      handleBack(); return true;
    });
    return () => handler.remove();
  }, [view, previewMsg]);

  const headerTitle = useMemo(() => {
    const animalNameStr = petName ?? '';
    const targetStr = targetName ?? '';
    return `${animalNameStr} écrit à ${targetStr}`;
  }, [petName, targetName]);

  const subtitle = view === 'themes'
    ? 'Choisis une humeur'
    : view === 'subgroups'
      ? selectedTheme?.label ?? ''
      : selectedSubGroup?.label ?? '';

  const handleThemeSelect = (theme: LibraryTheme) => {
    setSelectedTheme(theme);
    if (theme.subGroups.length === 1) {
      setSelectedSubGroup(theme.subGroups[0]);
      setView('messages');
    } else {
      setView('subgroups');
    }
  };

  const handleSubGroupSelect = (subGroup: LibrarySubGroup) => {
    setSelectedSubGroup(subGroup);
    setView('messages');
  };

  const handleBack = () => {
    if (view === 'messages') {
      if (selectedTheme && selectedTheme.subGroups.length === 1) {
        setSelectedSubGroup(null);
        setSelectedTheme(null);
        setView('themes');
      } else {
        setSelectedSubGroup(null);
        setView('subgroups');
      }
    } else if (view === 'subgroups') {
      setSelectedTheme(null);
      setView('themes');
    } else {
      router.back();
    }
  };

  const useMessage = (msg: LibraryMessage) => {
    const canHaveImage = (petType === 'chat' || petType === 'chien') && !!breed;
    const imageUrl = canHaveImage && occasion ? getPetImageUrl(petType, breed ?? null, occasion) : null;
    router.push({
      pathname: '/(app)/create/preview',
      params: {
        contactId: targetId ?? ownerId ?? petId ?? '',
        prefillMessage: fillMessage(msg.body),
        petDirection: 'from',
        petName: petName ?? '',
        petType: petType ?? 'autre',
        petBreed: breed ?? '',
        petGender: petGender ?? '',
        petOwnerName: ownerName ?? '',
        petId: petId ?? '',
        petOwnerId: ownerId ?? '',
        petThirdId: '',
        petThirdName: '',
        petPersonalityTags: '[]',
        ...(imageUrl ? { petImageUrl: imageUrl } : {}),
      },
    } as never);
  };

  if (!library) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: C.background }]} edges={['top']}>
        <View style={styles.topbar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
            <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
          </TouchableOpacity>
          <Text style={styles.topbarTitle}>Librairie indisponible</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={{ padding: Spacing[4] }}>
          <Text style={{ color: C.onSurface, fontFamily: 'BeVietnamPro_400Regular' }}>
            Cette librairie n'est disponible que pour le chien et le chat, sur anniversaire ou fête du prénom.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalMessages = library.themes.reduce((acc, t) => acc + t.count, 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={handleBack} style={styles.backLink}>
          <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>{petEmoji} {headerTitle}</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleBox}>
        <Text style={[styles.subtitleText, { color: C.onSurfaceVariant }]}>
          {subtitle}
        </Text>
        {view === 'themes' && (
          <Text style={[styles.subtitleHint, { color: C.outlineVariant }]}>
            {totalMessages} messages — répartis par thème
          </Text>
        )}
      </View>

      {/* ── VIEW A : THEMES ───────────────────────────────────────────── */}
      {view === 'themes' && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {library.themes.map((theme) => (
            <TouchableOpacity
              key={theme.id}
              style={[styles.themeCard, { backgroundColor: C.surface }]}
              onPress={() => handleThemeSelect(theme)}
              activeOpacity={0.85}
            >
              <Text style={styles.themeEmoji}>{theme.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.themeLabel, { color: C.onSurface }]}>{theme.label}</Text>
                <Text style={[styles.themeCount, { color: C.onSurfaceVariant }]}>
                  {theme.count} message{theme.count > 1 ? 's' : ''}
                </Text>
              </View>
              <Text style={[styles.themeArrow, { color: C.outlineVariant }]}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* ── VIEW B : SUB-GROUPS ────────────────────────────────────────── */}
      {view === 'subgroups' && selectedTheme && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.themeHero, { backgroundColor: C.primaryContainer }]}>
            <Text style={styles.themeHeroEmoji}>{selectedTheme.emoji}</Text>
            <Text style={[styles.themeHeroLabel, { color: C.primary }]}>{selectedTheme.label}</Text>
          </View>
          {selectedTheme.subGroups.map((sg) => (
            <TouchableOpacity
              key={sg.id}
              style={[styles.subGroupCard, { backgroundColor: C.surface }]}
              onPress={() => handleSubGroupSelect(sg)}
              activeOpacity={0.85}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.subGroupLabel, { color: C.onSurface }]}>{sg.label}</Text>
                <Text style={[styles.subGroupCount, { color: C.onSurfaceVariant }]}>
                  {sg.messages.length} message{sg.messages.length > 1 ? 's' : ''}
                </Text>
              </View>
              <Text style={[styles.themeArrow, { color: C.outlineVariant }]}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* ── VIEW C : MESSAGES ──────────────────────────────────────────── */}
      {view === 'messages' && selectedSubGroup && (
        <FlatList
          contentContainerStyle={styles.content}
          data={selectedSubGroup.messages}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View style={[styles.themeHero, { backgroundColor: C.primaryContainer }]}>
              <Text style={styles.themeHeroEmoji}>{selectedTheme?.emoji ?? '📚'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.themeHeroLabel, { color: C.primary }]}>
                  {selectedSubGroup.label}
                </Text>
                <Text style={[styles.themeHeroSub, { color: C.onSurfaceVariant }]}>
                  {selectedSubGroup.messages.length} message{selectedSubGroup.messages.length > 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.msgCard, { backgroundColor: C.surface }]}>
              <Text style={[styles.msgAngle, { color: C.onSurface }]} numberOfLines={2}>
                {item.angle}
              </Text>
              <Text style={[styles.msgPreview, { color: C.onSurfaceVariant }]} numberOfLines={2}>
                {item.body.split('\n').slice(1).join(' ').slice(0, 180)}
              </Text>
              <View style={styles.msgBtnRow}>
                <TouchableOpacity onPress={() => setPreviewMsg(item)} activeOpacity={0.75}>
                  <Text style={[styles.seeMoreBtn, { color: C.primary }]}>👁️ Voir en entier</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.useBtn, { backgroundColor: C.primary }]}
                  onPress={() => useMessage(item)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.useBtnText}>✉️ Utiliser ›</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modale aperçu message complet */}
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
              <Text style={[styles.modalText, { color: C.onSurface }]}>{previewMsg ? fillMessage(previewMsg.body) : ''}</Text>
            </ScrollView>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity
                style={[styles.modalBtn, { borderColor: C.outline, flex: 1 }]}
                onPress={() => setPreviewMsg(null)}
              >
                <Text style={[styles.modalBtnText, { color: C.onSurface }]}>Fermer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: C.primary, flex: 1 }]}
                onPress={() => {
                  const m = previewMsg;
                  setPreviewMsg(null);
                  if (m) useMessage(m);
                }}
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
  backLink: {
    minWidth: 60,
    justifyContent: 'center',
  },
  backLinkText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
  },
  topbarTitle: {
    flex: 1,
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    textAlign: 'center',
    color: Colors.onSurface,
  },

  subtitleBox: {
    paddingHorizontal: Spacing[4],
    paddingBottom: 8,
    gap: 2,
  },
  subtitleText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  subtitleHint: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    textAlign: 'center',
  },

  content: {
    padding: Spacing[4],
    gap: 10,
    paddingBottom: 80,
  },

  // Theme tile (Vue A)
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: Radii.xl,
    padding: 16,
    ...Shadows.sm,
  },
  themeEmoji: { fontSize: 28 },
  themeLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    marginBottom: 2,
  },
  themeCount: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
  },
  themeArrow: { fontSize: 24 },

  // Theme hero banner (Vue B/C)
  themeHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: Radii.lg,
    marginBottom: 8,
  },
  themeHeroEmoji: { fontSize: 32 },
  themeHeroLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
  },
  themeHeroSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    marginTop: 2,
  },

  // Sub-group tile (Vue B)
  subGroupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: Radii.lg,
    padding: 14,
    ...Shadows.sm,
  },
  subGroupLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    marginBottom: 2,
  },
  subGroupCount: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
  },

  // Message card (Vue C)
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

  // Modal
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
  },
  modalBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
  },
});
