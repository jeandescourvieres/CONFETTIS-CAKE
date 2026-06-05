import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  FlatList, Modal, BackHandler, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { DEPART_GROUPS, type DepartSubGroup } from '../../src/constants/departMessages';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { useColors } from '../../src/hooks/useColors';

const ACCENT = '#0EA5E9';
const ACCENT_LIGHT = '#E0F2FE';

type ViewMode = 'groups' | 'messages';

export default function DepartLibraryScreen() {
  const C = useColors();
  const router = useRouter();
  const { contactId, contactName } = useLocalSearchParams<{ contactId: string; contactName: string }>();

  const [view, setView] = useState<ViewMode>('groups');
  const [selectedGroup, setSelectedGroup] = useState<DepartSubGroup | null>(null);
  const [previewText, setPreviewText] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (previewText) { setPreviewText(null); return true; }
      if (view === 'messages') { setView('groups'); setSelectedGroup(null); return true; }
      return false;
    });
    return () => handler.remove();
  }, [view, previewText]);

  const firstName = (() => { const p = (contactName ?? '').trim().split(/\s+/); const f = p.filter((w) => !(w === w.toUpperCase() && /[A-Z]/.test(w))); return f.join(' ') || p[0] || contactName || '[Prénom]'; })();
  const fillMessage = (text: string) => text.replace(/\[Prénom\]/gi, firstName);

  const handleBack = () => {
    if (previewText) { setPreviewText(null); return; }
    if (view === 'messages') { setView('groups'); setSelectedGroup(null); return; }
    router.back();
  };

  const useMessage = (text: string) => {
    router.push({
      pathname: '/(app)/create/preview',
      params: { contactId: contactId ?? '', prefillMessage: fillMessage(text) },
    } as never);
  };

  const totalMessages = DEPART_GROUPS.reduce((a, g) => a + g.messages.length, 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]} edges={['top']}>
      <View style={styles.topbar}>
        <TouchableOpacity onPress={handleBack} style={styles.backLink}>
          <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>✈️ Départ à l'étranger</Text>
        <View style={{ minWidth: 70 }} />
      </View>

      {view === 'groups' && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.heroBanner, { backgroundColor: ACCENT_LIGHT, borderWidth: 1.5, borderColor: ACCENT + '40' }]}>
            <Text style={{ fontSize: 32 }}>✈️</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.heroTitle, { color: ACCENT }]}>L'ami qui part</Text>
              <Text style={[styles.heroSub, { color: C.onSurfaceVariant }]}>
                Pour {firstName} · {totalMessages} messages · 5 ambiances
              </Text>
            </View>
          </View>
          {DEPART_GROUPS.map((group) => (
            <TouchableOpacity
              key={group.id}
              style={[styles.groupCard, { backgroundColor: C.surface }]}
              onPress={() => { setSelectedGroup(group); setView('messages'); }}
              activeOpacity={0.85}
            >
              <Text style={styles.groupEmoji}>{group.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.groupLabel, { color: C.onSurface }]}>{group.title}</Text>
                <Text style={[styles.groupCount, { color: C.onSurfaceVariant }]}>{group.messages.length} messages</Text>
              </View>
              <Text style={[styles.arrow, { color: ACCENT }]}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {view === 'messages' && selectedGroup && (
        <FlatList
          contentContainerStyle={styles.content}
          data={selectedGroup.messages}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={[styles.heroBanner, { backgroundColor: ACCENT_LIGHT, borderWidth: 1.5, borderColor: ACCENT + '40' }]}>
              <Text style={{ fontSize: 28 }}>{selectedGroup.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.heroTitle, { color: ACCENT }]}>{selectedGroup.title}</Text>
                <Text style={[styles.heroSub, { color: C.onSurfaceVariant }]}>
                  {selectedGroup.messages.length} messages · bon voyage {firstName}
                </Text>
              </View>
            </View>
          }
          renderItem={({ item }) => {
            const filled = fillMessage(item.text);
            const lines = filled.split('\n');
            return (
              <View style={[styles.msgCard, { backgroundColor: C.surface }]}>
                <Text style={[styles.msgAngle, { color: C.onSurface }]} numberOfLines={2}>{lines[0]}</Text>
                <Text style={[styles.msgPreview, { color: C.onSurfaceVariant }]} numberOfLines={2}>
                  {lines.slice(1, 3).join(' ').slice(0, 180)}
                </Text>
                <View style={styles.msgBtnRow}>
                  <TouchableOpacity onPress={() => setPreviewText(item.text)} activeOpacity={0.75}>
                    <Text style={[styles.seeMoreBtn, { color: ACCENT }]}>👁️ Voir en entier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.useBtn, { backgroundColor: ACCENT }]} onPress={() => useMessage(item.text)} activeOpacity={0.85}>
                    <Text style={styles.useBtnText}>✉️ Utiliser ›</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}

      <Modal visible={!!previewText} transparent animationType="slide" onRequestClose={() => setPreviewText(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setPreviewText(null)}>
          <TouchableOpacity activeOpacity={1} style={[styles.modalCard, { backgroundColor: C.surface }]}>
            <Text style={[styles.modalTitle, { color: C.onSurface }]}>📄 Message complet</Text>
            <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalText, { color: C.onSurface }]}>{previewText ? fillMessage(previewText) : ''}</Text>
            </ScrollView>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity style={[styles.modalBtn, { borderColor: C.outline, flex: 1 }]} onPress={() => setPreviewText(null)}>
                <Text style={[styles.modalBtnText, { color: C.onSurface }]}>Fermer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: ACCENT, flex: 1 }]}
                onPress={() => { const t = previewText; setPreviewText(null); if (t) useMessage(t); }}
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
  topbar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing[4], paddingVertical: 10, gap: 8 },
  backLink: { justifyContent: 'center', minWidth: 70 },
  backLinkText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
  topbarTitle: { flex: 1, fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, textAlign: 'center', color: Colors.onSurface },
  content: { padding: Spacing[4], gap: 10, paddingBottom: 80 },
  heroBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: Radii.lg, marginBottom: 4 },
  heroTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, marginBottom: 2 },
  heroSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs },
  groupCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: Radii.xl, padding: 16, ...Shadows.sm },
  groupEmoji: { fontSize: 22, width: 28 },
  groupLabel: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, marginBottom: 2 },
  groupCount: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm },
  arrow: { fontSize: 24 },
  msgCard: { borderRadius: Radii.xl, padding: 14, gap: 8, ...Shadows.sm },
  msgAngle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, lineHeight: 20 },
  msgPreview: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, lineHeight: 18 },
  msgBtnRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  seeMoreBtn: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
  useBtn: { borderRadius: Radii.full, paddingVertical: 8, paddingHorizontal: 14 },
  useBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: Colors.white },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36 },
  modalTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.lg, marginBottom: 12 },
  modalText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, lineHeight: 22 },
  modalBtn: { borderRadius: Radii.full, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  modalBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm },
});
