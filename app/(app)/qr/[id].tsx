import React, { useRef, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { useMessage } from '../../../src/hooks/useAIGenerate';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';

const FORMAT_EMOJI: Record<string, string> = { song: '🎵', poem: '✍️', message: '💬', joke: '✨' };

export default function QRScreen() {
  const C = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const svgRef = useRef<{ toDataURL: (cb: (data: string) => void) => void } | null>(null);

  const { data: message, isLoading } = useMessage(id ?? null);

  // The QR code encodes a short text version of the message
  const qrValue = message
    ? `${FORMAT_EMOJI[message.format] ?? '💬'} Pour ${message.contact_name}\n\n${message.content.slice(0, 500)}`
    : 'Chargement...';

  const handleShareText = async () => {
    if (!message) return;
    await Share.share({
      message: qrValue,
      title: `Message pour ${message.contact_name}`,
    });
  };

  const styles = useMemo(() => makeStyles(C), [C]);

  if (isLoading || !message) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>QR Code</Text>
        <View style={{ minWidth: 70 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Info card ─────────────────────────────── */}
        <View style={styles.infoCard}>
          <Text style={styles.infoEmoji}>{FORMAT_EMOJI[message.format] ?? '💬'}</Text>
          <View style={styles.infoText}>
            <Text style={styles.infoName}>Pour {message.contact_name}</Text>
            <Text style={styles.infoSub}>Scannez pour lire le message</Text>
          </View>
        </View>

        {/* ── QR code ───────────────────────────────── */}
        <View style={styles.qrWrapper}>
          <View style={styles.qrContainer}>
            <QRCode
              value={qrValue}
              size={240}
              color={Colors.onSurface}
              backgroundColor={Colors.white}
              getRef={(ref) => {
                svgRef.current = ref as typeof svgRef.current;
              }}
              logo={undefined}
              quietZone={16}
            />
          </View>
          {/* Corner decorations */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>

        {/* ── Hint ──────────────────────────────────── */}
        <Text style={styles.hint}>
          Faites scanner ce QR code par le destinataire pour qu'il puisse lire le message
        </Text>

        {/* ── Preview du contenu ────────────────────── */}
        <View style={styles.previewCard}>
          <Text style={styles.previewLabel}>Aperçu du contenu</Text>
          <Text style={styles.previewText} numberOfLines={6}>
            {message.content}
          </Text>
        </View>

        {/* ── Actions ──────────────────────────────── */}
        <TouchableOpacity style={styles.shareBtn} onPress={handleShareText} activeOpacity={0.85}>
          <Text style={styles.shareBtnText}>📤 Partager le texte</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backToMsgBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.backToMsgBtnText}>← Retour au message</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
  },

  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: C.primaryContainer,
    backgroundColor: Colors.surfaceContainerLow,
  },
  backLink: { justifyContent: 'center', minWidth: 70 },
  backLinkText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
  topbarTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
  },

  content: { paddingBottom: 80, paddingHorizontal: Spacing[4] },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    marginTop: Spacing[4],
    ...Shadows.sm,
  },
  infoEmoji: { fontSize: 36 },
  infoText: { flex: 1 },
  infoName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
  },
  infoSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },

  qrWrapper: {
    alignItems: 'center',
    marginTop: Spacing[6],
    position: 'relative',
  },
  qrContainer: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing[5],
    ...Shadows.md,
  },

  // Corner decorations
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: C.primary,
    borderWidth: 3,
  },
  cornerTL: { top: -4, left: '50%', marginLeft: -124, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 6 },
  cornerTR: { top: -4, right: '50%', marginRight: -124, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 6 },
  cornerBL: { bottom: -4, left: '50%', marginLeft: -124, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 6 },
  cornerBR: { bottom: -4, right: '50%', marginRight: -124, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 6 },

  hint: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: Spacing[4],
    paddingHorizontal: Spacing[4],
  },

  previewCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.lg,
    padding: Spacing[4],
    marginTop: Spacing[5],
    gap: 8,
    borderWidth: 0.5,
    borderColor: C.primaryContainer,
  },
  previewLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: Colors.onSurfaceVariant,
  },
  previewText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurface,
    lineHeight: 22,
  },

  shareBtn: {
    marginTop: Spacing[5],
    paddingVertical: 16,
    borderRadius: Radii.full,
    backgroundColor: C.primary,
    alignItems: 'center',
    ...Shadows.md,
  },
  shareBtnText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.xl,
    color: Colors.white,
  },

  backToMsgBtn: {
    marginTop: Spacing[3],
    paddingVertical: 14,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: C.primary,
    alignItems: 'center',
  },
  backToMsgBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: C.primary,
  },
  });
}
