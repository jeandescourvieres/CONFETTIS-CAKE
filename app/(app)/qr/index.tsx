// ═══════════════════════════════════════════════════════════
//  Confettis & Cake — QR Code Index
//  Liste des messages pouvant être partagés via QR
// ═══════════════════════════════════════════════════════════

import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { BackHeader } from '../../../src/components/ui/BackHeader';
import { useMessages } from '../../../src/hooks/useAIGenerate';
import type { Message } from '../../../src/types/models';

const FORMAT_EMOJI: Record<string, string> = {
  song: '🎵', poem: '✍️', message: '💬', joke: '😄',
};

export default function QrIndexScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  const { data: messages = [], isLoading } = useMessages();

  // Ne garder que les messages envoyés ou ceux ayant du contenu
  const eligible = useMemo(
    () => messages.filter((m: Message) => m.content?.trim()),
    [messages],
  );

  const renderItem = ({ item }: { item: Message }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(app)/qr/${item.id}` as never)}
      activeOpacity={0.8}
    >
      <View style={styles.cardLeft}>
        <Text style={styles.cardEmoji}>{FORMAT_EMOJI[item.format] ?? '💬'}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardName}>{item.contact_name}</Text>
          <Text style={styles.cardFormat}>{t(`create.formats.${item.format}`, { defaultValue: item.format })}</Text>
          <Text style={styles.cardPreview} numberOfLines={2}>
            {item.content}
          </Text>
        </View>
      </View>
      <View style={[styles.qrBadge, { backgroundColor: C.primaryContainer }]}>
        <Text style={styles.qrBadgeText}>QR</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title={t('qr.index.title')} />

      {/* Intro */}
      <View style={[styles.intro, { backgroundColor: C.primaryContainer }]}>
        <Text style={styles.introText}>{t('qr.index.introText')}</Text>
      </View>

      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      )}

      {!isLoading && eligible.length === 0 && (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyTitle}>{t('qr.index.emptyTitle')}</Text>
          <Text style={styles.emptySub}>{t('qr.index.emptySub')}</Text>
          <TouchableOpacity
            style={[styles.createBtn, { backgroundColor: C.primary }]}
            onPress={() => router.push('/(app)/create' as never)}
          >
            <Text style={styles.createBtnText}>{t('creations.createFirst')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isLoading && eligible.length > 0 && (
        <FlatList
          data={eligible}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.listHeader}>{t('qr.index.availableCount', { count: eligible.length })}</Text>
          }
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container:  { flex: 1, backgroundColor: Colors.background },
    center:     { flex: 1, alignItems: 'center', justifyContent: 'center' },

    intro: {
      marginHorizontal: Spacing[4],
      marginTop: Spacing[3],
      borderRadius: Radii.xl,
      padding: Spacing[4],
    },
    introText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurface,
      lineHeight: 20,
    },

    list:     { padding: Spacing[4], paddingBottom: 40 },
    listHeader: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.xs,
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: Colors.onSurfaceVariant,
      marginBottom: 12,
    },

    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      padding: Spacing[4],
      ...Shadows.sm,
      borderWidth: 0.5,
      borderColor: Colors.surfaceContainerHighest,
      gap: 12,
    },
    cardLeft:   { flex: 1, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
    cardEmoji:  { fontSize: 28, lineHeight: 34 },
    cardName: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.base,
      color: Colors.onSurface,
    },
    cardFormat: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
      marginTop: 1,
      marginBottom: 4,
    },
    cardPreview: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurface,
      lineHeight: 18,
      opacity: 0.8,
    },
    qrBadge: {
      width: 40, height: 40, borderRadius: Radii.md,
      alignItems: 'center', justifyContent: 'center',
    },
    qrBadgeText: {
      fontFamily: 'BeVietnamPro_800ExtraBold',
      fontSize: Typography.sm,
      color: C.primary,
    },

    emptyWrap:  { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
    emptyEmoji: { fontSize: 52 },
    emptyTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xl, color: Colors.onSurface },
    emptySub: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.base,
      color: Colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 22,
    },
    createBtn: {
      borderRadius: Radii.full,
      paddingVertical: 12,
      paddingHorizontal: 24,
      marginTop: 8,
    },
    createBtnText: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.base,
      color: Colors.white,
    },
  });
}
