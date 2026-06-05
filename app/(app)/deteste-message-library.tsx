import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  FlatList, Modal, BackHandler, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { DETESTE_MESSAGES, type DestesteMessage } from '../../src/constants/destesteMessages';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { useColors } from '../../src/hooks/useColors';
import { useContacts } from '../../src/hooks/useContacts';

const ACCENT = '#374151';
const ACCENT_LIGHT = '#F9FAFB';

export default function DestesteMessageLibraryScreen() {
  const C = useColors();
  const router = useRouter();
  const { data: contacts = [] } = useContacts();

  const { contactId, contactName, occasion, contactCivilite } = useLocalSearchParams<{
    contactId: string;
    contactName: string;
    occasion: 'birthday' | 'nameday' | 'graduation' | 'first_job' | 'ado_parent';
    contactCivilite?: string;
  }>();

  const messages = DETESTE_MESSAGES[occasion ?? 'birthday'] ?? [];
  const isAdoParent = occasion === 'ado_parent';

  const firstName = (() => { const p = (contactName ?? '').trim().split(/\s+/); const f = p.filter((w) => !(w === w.toUpperCase() && /[A-Z]/.test(w))); return f.join(' ') || p[0] || contactName || ''; })();

  const parentRole = isAdoParent
    ? (contactCivilite === 'M.' ? 'Papa' : contactCivilite === 'Mme' ? 'Maman' : firstName)
    : null;

  const [previewMsg, setPreviewMsg] = useState<DestesteMessage | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (previewMsg) { setPreviewMsg(null); return true; }
      return false;
    });
    return () => handler.remove();
  }, [previewMsg]);

  const fillMessage = (body: string): string => {
    let filled = body.replace(/^\d{1,3}\.\s*/, '');
    if (isAdoParent && parentRole) {
      filled = filled.replace(/\[Prénom\]/g, parentRole);
    } else {
      filled = filled.replace(/\[Prénom\]/g, firstName);
    }
    return filled;
  };

  const occasionLabel = {
    birthday: '🎂 Anniversaire',
    nameday: '🌸 Fête du prénom',
    graduation: '🎓 Diplôme',
    first_job: '💼 Premier job',
    ado_parent: '🫂 Ado → Parent',
  }[occasion ?? 'birthday'];

  const useMessage = (msg: DestesteMessage) => {
    router.push({
      pathname: '/(app)/create/preview',
      params: { contactId: contactId ?? '', prefillMessage: fillMessage(msg.body) },
    } as never);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]} edges={['top']}>
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>🙄 Je déteste les messages</Text>
        <View style={{ minWidth: 70 }} />
      </View>

      <FlatList
        contentContainerStyle={styles.content}
        data={messages}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={[styles.heroBanner, { backgroundColor: ACCENT_LIGHT, borderWidth: 1.5, borderColor: '#E5E7EB' }]}>
            <Text style={{ fontSize: 28 }}>🙄</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.heroTitle, { color: ACCENT }]}>Je déteste les messages</Text>
              <Text style={[styles.heroSub, { color: C.onSurfaceVariant }]}>
                {occasionLabel} · {messages.length} messages
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.msgCard, { backgroundColor: C.surface }]}>
            <Text style={[styles.msgAngle, { color: C.onSurface }]} numberOfLines={2}>
              {item.angle.replace(/\[Prénom\]/g, isAdoParent && parentRole ? parentRole : firstName)}
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

      <Modal visible={!!previewMsg} transparent animationType="slide" onRequestClose={() => setPreviewMsg(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setPreviewMsg(null)}>
          <TouchableOpacity activeOpacity={1} style={[styles.modalCard, { backgroundColor: C.surface }]}>
            <Text style={[styles.modalTitle, { color: C.onSurface }]}>📄 Message complet</Text>
            <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalText, { color: C.onSurface }]}>
                {previewMsg ? fillMessage(previewMsg.body) : ''}
              </Text>
            </ScrollView>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity style={[styles.modalBtn, { borderColor: C.outline, flex: 1 }]} onPress={() => setPreviewMsg(null)}>
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
  topbar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing[4], paddingVertical: 10, gap: 8 },
  backLink: { justifyContent: 'center', minWidth: 70 },
  backLinkText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
  topbarTitle: { flex: 1, fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, textAlign: 'center', color: Colors.onSurface },
  content: { padding: Spacing[4], gap: 10, paddingBottom: 80 },
  heroBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: Radii.lg, marginBottom: 4 },
  heroTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, marginBottom: 2 },
  heroSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs },
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
