import React, { useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Dimensions, ActivityIndicator, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useCardTemplate } from '../../src/hooks/useCards';
import { CardComposer } from '../../src/components/cards/CardComposer';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';

const { width: W } = Dimensions.get('window');

const APP_STORE_URL = 'https://apps.apple.com/app/confettis-cake';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.confettiscake.app';

export default function PublicCardScreen() {
  const { id, name = '' } = useLocalSearchParams<{ id: string; name?: string }>();
  const recipientName = Array.isArray(name) ? name[0] : name;

  const { data: template, isLoading, isError } = useCardTemplate(id);

  const handleDownload = () => {
    // Ouvre le bon store selon la plateforme
    const url = PLAY_STORE_URL;
    Linking.openURL(url).catch(() => {});
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.primary ?? '#9b6bb5'} size="large" />
        <Text style={styles.loadingText}>Chargement de ta carte…</Text>
      </View>
    );
  }

  if (isError || !template) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorTitle}>Carte introuvable</Text>
        <Text style={styles.errorSub}>Le lien est peut-être expiré ou invalide.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Carte plein écran */}
      <View style={styles.cardContainer}>
        <CardComposer
          template={template}
          recipientName={recipientName}
          style={styles.card}
        />
      </View>

      {/* Panneau bas */}
      <SafeAreaView style={styles.panel} edges={['bottom']}>
        <Text style={styles.panelTitle}>
          🎉 Une carte pour <Text style={styles.panelName}>{recipientName || 'toi'}</Text>
        </Text>
        <Text style={styles.panelSub}>Créée avec Confettis & Cake</Text>

        <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload} activeOpacity={0.85}>
          <Text style={styles.downloadBtnText}>📲 Télécharger l'appli gratuitement</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          Crée tes propres cartes animées, messages IA et cagnottes pour tes proches.
        </Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  cardContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  card: {
    ...StyleSheet.absoluteFillObject,
  },
  panel: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radii['2xl'],
    borderTopRightRadius: Radii['2xl'],
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[5],
    gap: 8,
    alignItems: 'center',
    ...Shadows.lg,
  },
  panelTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    textAlign: 'center',
  },
  panelName: {
    color: '#9b6bb5',
  },
  panelSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
    marginBottom: 4,
  },
  downloadBtn: {
    width: '100%',
    backgroundColor: '#9b6bb5',
    borderRadius: Radii.full,
    paddingVertical: 14,
    alignItems: 'center',
    ...Shadows.md,
  },
  downloadBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.lg,
    color: Colors.white,
  },
  hint: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: Spacing[3],
  },
  centered: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: Spacing[5],
  },
  loadingText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
  },
  errorEmoji: { fontSize: 48 },
  errorTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
  },
  errorSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
