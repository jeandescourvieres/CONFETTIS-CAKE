// ═══════════════════════════════════════════════════════════════════
//  Confettis & Cake — Guide cagnottes (mode apprentissage)
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';

const STEPS = [
  { emoji: '1️⃣', text: 'Crée une cagnotte pour un cadeau groupé (anniversaire, mariage, départ...)' },
  { emoji: '2️⃣', text: 'Partage le lien avec tes proches — ils contribuent directement en ligne' },
  { emoji: '3️⃣', text: 'Suis les participations en temps réel et remercie chaque contributeur' },
];

export default function CagnotteGuideScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={[styles.backLinkText, { color: Colors.primary }]}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Les cagnottes 🐷</Text>
        <View style={{ minWidth: 70 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Carte intro */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>🐷 Offrir ensemble, c'est tellement plus simple</Text>
          <Text style={styles.introText}>
            {'Tu organises une collecte en ligne pour offrir un cadeau groupé à un proche. Chacun contribue à son rythme, depuis son téléphone.\nToi tu gères tout d\'ici : tu suis les participations en temps réel et tu ne rates plus jamais un départ, un mariage ou un anniversaire de collègue.'}
          </Text>
        </View>

        {/* Comment ça marche */}
        <Text style={styles.sectionTitle}>Comment ça marche ?</Text>
        <View style={styles.stepsCard}>
          {STEPS.map((s, i) => (
            <View key={i} style={[styles.stepRow, i < STEPS.length - 1 && styles.stepBorder]}>
              <Text style={styles.stepEmoji}>{s.emoji}</Text>
              <Text style={styles.stepText}>{s.text}</Text>
            </View>
          ))}
        </View>

        {/* Boutons */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push('/(app)/pot/new' as never)}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>🐷 Créer ma première cagnotte</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push('/(app)/pot' as never)}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryBtnText}>Voir mes cagnottes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing[4], paddingVertical: 12,
    borderBottomWidth: 0.5, borderBottomColor: Colors.surfaceContainerHighest,
  },
  backLink: { justifyContent: 'center', minWidth: 70 },
  backLinkText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
  headerTitle: { flex: 1, fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: Colors.onSurface, textAlign: 'center' },

  scroll: { padding: Spacing[4], gap: 16, paddingBottom: 40 },

  introCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing[5],
    borderLeftWidth: 4,
    borderLeftColor: '#F97316',
    ...Shadows.sm,
    gap: 10,
  },
  introTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.xl,
    color: '#C2410C',
  },
  introText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 22,
  },

  sectionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.lg,
    color: Colors.onSurface,
    marginBottom: -4,
  },
  stepsCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    ...Shadows.sm,
    overflow: 'hidden',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: Spacing[4],
  },
  stepBorder: { borderBottomWidth: 0.5, borderBottomColor: Colors.surfaceContainerHighest },
  stepEmoji: { fontSize: 22 },
  stepText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurface, flex: 1, lineHeight: 22 },

  primaryBtn: {
    backgroundColor: '#F97316',
    borderRadius: Radii.full,
    paddingVertical: 15,
    alignItems: 'center',
    ...Shadows.sm,
  },
  primaryBtnText: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.md, color: Colors.white },

  secondaryBtn: {
    borderRadius: Radii.full,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.white,
  },
  secondaryBtnText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.md, color: Colors.onSurface },
});
