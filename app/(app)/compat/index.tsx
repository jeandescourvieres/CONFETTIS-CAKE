// ═══════════════════════════════════════════════════════════════════
//  Confettis & Cake — Compatibilité libre prénoms & noms
//  Saisie libre de deux identités → score numérologique
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import {
  calcNumerology,
  getNumerologyProfile,
  getNumerologyCompatibility,
} from '../../../src/utils/numerology';

// ── Helpers ───────────────────────────────────────────────────────────────────
function scoreToStars(score: number): string {
  return '★'.repeat(score) + '☆'.repeat(5 - score);
}

function scoreToColor(score: number): string {
  if (score >= 5) return '#4CAF50';
  if (score >= 4) return '#8BC34A';
  if (score >= 3) return '#FFC107';
  if (score >= 2) return '#FF9800';
  return '#F44336';
}

interface CompatResult {
  numA: number;
  numB: number;
  profileA: ReturnType<typeof getNumerologyProfile>;
  profileB: ReturnType<typeof getNumerologyProfile>;
  compat: ReturnType<typeof getNumerologyCompatibility>;
  // Expression (prénom + nom ensemble)
  exprA: number;
  exprB: number;
  exprCompat: ReturnType<typeof getNumerologyCompatibility>;
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function CompatIndexScreen() {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  // Pré-remplissage depuis les paramètres URL (ex: depuis la fiche contact)
  const { preA = '', nomA = '' } = useLocalSearchParams<{ preA?: string; nomA?: string }>();

  const [firstNameA, setFirstNameA] = useState(preA);
  const [lastNameA,  setLastNameA]  = useState(nomA);
  const [firstNameB, setFirstNameB] = useState('');
  const [lastNameB,  setLastNameB]  = useState('');

  const result = useMemo<CompatResult | null>(() => {
    const fa = firstNameA.trim();
    const fb = firstNameB.trim();
    if (!fa || !fb) return null;

    const la = lastNameA.trim();
    const lb = lastNameB.trim();

    const numA = calcNumerology(fa);
    const numB = calcNumerology(fb);

    const exprA = la ? calcNumerology(fa + la) : numA;
    const exprB = lb ? calcNumerology(fb + lb) : numB;

    return {
      numA, numB,
      profileA: getNumerologyProfile(numA),
      profileB: getNumerologyProfile(numB),
      compat:   getNumerologyCompatibility(numA, numB),
      exprA, exprB,
      exprCompat: getNumerologyCompatibility(exprA, exprB),
    };
  }, [firstNameA, lastNameA, firstNameB, lastNameB]);

  const canCompute = firstNameA.trim().length > 0 && firstNameB.trim().length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {/* ── Header ──────────────────────────────────── */}
          <Text style={styles.title}>💑 Compatibilité</Text>
          <Text style={styles.subtitle}>
            Saisis deux prénoms (et noms facultatifs) pour découvrir votre compatibilité numérologique ✨
          </Text>

          {/* ── Intro ───────────────────────────────────── */}
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>💡 Comment ça marche ?</Text>
            <Text style={styles.introText}>
              {'La compatibilité est calculée par numérologie : chaque lettre de vos prénoms (et noms) est converti en chiffre selon la méthode de Pythagore. La somme des valeurs donne un score unique entre 0 et 100.\n\nPlus le score est élevé, plus l\'harmonie vibratoire entre les deux personnes est forte — que ce soit en amour, en amitié ou en travail.'}
            </Text>
          </View>

          {/* ── Formulaire ──────────────────────────────── */}
          <View style={styles.form}>
            {/* Personne A */}
            <View style={[styles.personCard, { borderColor: C.primary }]}>
              <Text style={[styles.personLabel, { color: C.primary }]}>✦ Personne 1</Text>
              <TextInput
                style={styles.input}
                value={firstNameA}
                onChangeText={setFirstNameA}
                placeholder="Prénom *"
                placeholderTextColor={Colors.outlineVariant}
                autoCapitalize="words"
                autoCorrect={false}
              />
              <TextInput
                style={[styles.input, { marginTop: 8 }]}
                value={lastNameA}
                onChangeText={setLastNameA}
                placeholder="Nom (facultatif)"
                placeholderTextColor={Colors.outlineVariant}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <Text style={styles.andSign}>💛</Text>

            {/* Personne B */}
            <View style={[styles.personCard, { borderColor: C.primary }]}>
              <Text style={[styles.personLabel, { color: C.primary }]}>✦ Personne 2</Text>
              <TextInput
                style={styles.input}
                value={firstNameB}
                onChangeText={setFirstNameB}
                placeholder="Prénom *"
                placeholderTextColor={Colors.outlineVariant}
                autoCapitalize="words"
                autoCorrect={false}
              />
              <TextInput
                style={[styles.input, { marginTop: 8 }]}
                value={lastNameB}
                onChangeText={setLastNameB}
                placeholder="Nom (facultatif)"
                placeholderTextColor={Colors.outlineVariant}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* ── Résultats ───────────────────────────────── */}
          {result && (
            <>
              {/* Score global prénoms */}
              <LinearGradient
                colors={[C.primary + 'CC', C.primary]}
                style={styles.scoreCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.scoreEmoji}>{result.compat.emoji}</Text>
                <Text style={styles.scoreStars}>
                  {scoreToStars(result.compat.score)}
                </Text>
                <Text style={styles.scoreLabel}>{result.compat.label}</Text>
                <Text style={styles.scoreDesc}>{result.compat.description}</Text>
              </LinearGradient>

              {/* Chiffres des prénoms */}
              <View style={styles.numRow}>
                <View style={[styles.numCard, { borderColor: result.profileA.color }]}>
                  <Text style={styles.numName}>{firstNameA.trim()}</Text>
                  <Text style={[styles.numNumber, { color: result.profileA.color }]}>
                    {result.numA}
                  </Text>
                  <Text style={styles.numTitle}>{result.profileA.name}</Text>
                  <View style={styles.numKeywords}>
                    {result.profileA.keywords.slice(0, 2).map((k) => (
                      <View key={k} style={[styles.keyword, { backgroundColor: result.profileA.color + '20' }]}>
                        <Text style={[styles.keywordText, { color: result.profileA.color }]}>{k}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <Text style={styles.vsSign}>VS</Text>

                <View style={[styles.numCard, { borderColor: result.profileB.color }]}>
                  <Text style={styles.numName}>{firstNameB.trim()}</Text>
                  <Text style={[styles.numNumber, { color: result.profileB.color }]}>
                    {result.numB}
                  </Text>
                  <Text style={styles.numTitle}>{result.profileB.name}</Text>
                  <View style={styles.numKeywords}>
                    {result.profileB.keywords.slice(0, 2).map((k) => (
                      <View key={k} style={[styles.keyword, { backgroundColor: result.profileB.color + '20' }]}>
                        <Text style={[styles.keywordText, { color: result.profileB.color }]}>{k}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* Score expression (si noms renseignés) */}
              {(lastNameA.trim() || lastNameB.trim()) && result.exprA !== result.numA || result.exprB !== result.numB ? (
                <View style={styles.exprCard}>
                  <Text style={styles.exprTitle}>🔡 Compatibilité d'expression (prénom + nom)</Text>
                  <View style={styles.exprRow}>
                    <View style={styles.exprChip}>
                      <Text style={styles.exprChipName}>
                        {firstNameA.trim()}{lastNameA.trim() ? ` ${lastNameA.trim()}` : ''}
                      </Text>
                      <Text style={[styles.exprChipNum, { color: C.primary }]}>{result.exprA}</Text>
                    </View>
                    <Text style={[styles.exprCompat, { color: scoreToColor(result.exprCompat.score) }]}>
                      {result.exprCompat.emoji} {result.exprCompat.label}
                    </Text>
                    <View style={styles.exprChip}>
                      <Text style={styles.exprChipName}>
                        {firstNameB.trim()}{lastNameB.trim() ? ` ${lastNameB.trim()}` : ''}
                      </Text>
                      <Text style={[styles.exprChipNum, { color: C.primary }]}>{result.exprB}</Text>
                    </View>
                  </View>
                  <Text style={styles.exprDesc}>{result.exprCompat.description}</Text>
                </View>
              ) : null}

              {/* Profils détaillés */}
              <View style={styles.profilesSection}>
                <Text style={styles.profilesTitle}>Profils numériques</Text>
                {[
                  { name: firstNameA.trim(), profile: result.profileA },
                  { name: firstNameB.trim(), profile: result.profileB },
                ].map(({ name, profile }) => (
                  <View key={name} style={[styles.profileCard, { borderLeftColor: profile.color }]}>
                    <View style={styles.profileHeader}>
                      <View style={[styles.profileBadge, { backgroundColor: profile.color }]}>
                        <Text style={styles.profileBadgeText}>{profile.number}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.profileName}>{name}</Text>
                        <Text style={[styles.profileTitle, { color: profile.color }]}>
                          {profile.name} · {profile.colorName}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.profileDesc}>{profile.description}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {!canCompute && (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderEmoji}>💑</Text>
              <Text style={styles.placeholderText}>
                Saisis au moins deux prénoms pour découvrir votre compatibilité
              </Text>
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    scroll: { paddingHorizontal: Spacing[4], paddingTop: Spacing[4], gap: 20 },

    title: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography['2xl'],
      color: Colors.onSurface,
      textAlign: 'center',
    },
    subtitle: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.base,
      color: Colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 22,
    },

    introCard: {
      backgroundColor: C.primaryContainer,
      borderRadius: Radii.xl,
      padding: Spacing[4],
      borderLeftWidth: 4,
      borderLeftColor: C.primary,
      gap: 8,
      marginBottom: Spacing[2],
    },
    introTitle: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography.xl,
      color: C.primary,
    },
    introText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.md,
      color: Colors.onSurface,
      lineHeight: 22,
    },

    // Form
    form: { gap: 0, alignItems: 'center' },
    personCard: {
      width: '100%',
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      borderWidth: 2,
      padding: Spacing[4],
      gap: 4,
      ...Shadows.sm,
    },
    personLabel: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.sm,
      marginBottom: 4,
    },
    input: {
      borderWidth: 1.5,
      borderColor: Colors.surfaceContainerHighest,
      borderRadius: Radii.lg,
      paddingHorizontal: Spacing[3],
      paddingVertical: 11,
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.base,
      color: Colors.onSurface,
      backgroundColor: Colors.surfaceContainerLow,
    },
    andSign: {
      fontSize: 28,
      textAlign: 'center',
      marginVertical: 8,
    },

    // Score card
    scoreCard: {
      borderRadius: Radii.xl,
      padding: Spacing[5],
      alignItems: 'center',
      gap: 8,
      ...Shadows.md,
    },
    scoreEmoji: { fontSize: 40 },
    scoreStars: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography.xl,
      color: Colors.white,
      letterSpacing: 4,
    },
    scoreLabel: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.lg,
      color: Colors.white,
    },
    scoreDesc: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.white,
      textAlign: 'center',
      lineHeight: 20,
      opacity: 0.92,
    },

    // Num row
    numRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    numCard: {
      flex: 1,
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      borderWidth: 2,
      padding: Spacing[4],
      alignItems: 'center',
      gap: 4,
      ...Shadows.sm,
    },
    numName: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
    },
    numNumber: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: 36,
    },
    numTitle: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.xs,
      color: Colors.onSurface,
      textAlign: 'center',
    },
    numKeywords: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, justifyContent: 'center' },
    keyword: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radii.full },
    keywordText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 10 },
    vsSign: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography.sm,
      color: Colors.outlineVariant,
    },

    // Expression
    exprCard: {
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      padding: Spacing[4],
      gap: 10,
      ...Shadows.sm,
    },
    exprTitle: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.sm,
      color: Colors.onSurface,
    },
    exprRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    exprChip: { alignItems: 'center', gap: 2 },
    exprChipName: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
      textAlign: 'center',
    },
    exprChipNum: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography.xl,
    },
    exprCompat: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.xs,
      textAlign: 'center',
      flex: 1,
    },
    exprDesc: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
      lineHeight: 18,
    },

    // Profiles
    profilesSection: { gap: 12 },
    profilesTitle: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.base,
      color: Colors.onSurface,
    },
    profileCard: {
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      borderLeftWidth: 4,
      padding: Spacing[4],
      gap: 8,
      ...Shadows.sm,
    },
    profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    profileBadge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileBadgeText: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography.lg,
      color: Colors.white,
    },
    profileName: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.base,
      color: Colors.onSurface,
    },
    profileTitle: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.xs,
      marginTop: 2,
    },
    profileDesc: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
      lineHeight: 20,
    },

    // Placeholder
    placeholder: {
      alignItems: 'center',
      gap: 12,
      paddingVertical: Spacing[8],
    },
    placeholderEmoji: { fontSize: 56 },
    placeholderText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.base,
      color: Colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 22,
    },
  });
}
