// ═══════════════════════════════════════════════════════════════════
//  Confettis & Cake — Numérologie d'un contact + compatibilité
// ═══════════════════════════════════════════════════════════════════

import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useContact } from '../../../../src/hooks/useContacts';
import { useAuthStore } from '../../../../src/stores/authStore';
import { Colors, Typography, Spacing, Radii, Shadows, Gradients } from '../../../../src/constants/theme';
import { useColors } from '../../../../src/hooks/useColors';
import { extractFirstName, extractLastName } from '../../../../src/utils/nameHelpers';
import {
  calcNumerology,
  calcLifePath,
  getNumerologyProfile,
  getNumerologyCompatibility,
  type NumerologyProfile,
} from '../../../../src/utils/numerology';
import { FeatureIntroCard } from '../../../../src/components/ui/FeatureIntroCard';

export default function ContactNumerologieScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  const { data: contact, isLoading } = useContact(id);
  const profile = useAuthStore((s) => s.profile);

  if (isLoading || !contact) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.center}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  const contactFirstName = extractFirstName(contact.name);
  const contactLastName = extractLastName(contact.name);
  const numPrenom = contactFirstName ? getNumerologyProfile(calcNumerology(contactFirstName)) : null;
  const numExpression = (contactFirstName && contactLastName && contactLastName !== contactFirstName)
    ? getNumerologyProfile(calcNumerology(contactFirstName + contactLastName))
    : null;
  const lifePathNum = contact.birthday ? calcLifePath(contact.birthday) : null;
  const lifePathProfile = lifePathNum !== null ? getNumerologyProfile(lifePathNum) : null;

  // ── Compatibilité avec l'utilisateur ──────────────────────────────────────
  const myFirstName = profile?.full_name ? extractFirstName(profile.full_name) : '';
  const myNumProfile = myFirstName ? getNumerologyProfile(calcNumerology(myFirstName)) : null;
  const compat = myNumProfile && numPrenom ? getNumerologyCompatibility(myNumProfile.number, numPrenom.number) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topbar}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(app)/contacts/index' as never)}
          style={styles.backLink}
        >
          <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle} numberOfLines={1}>La numérologie de {contactFirstName} :</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <FeatureIntroCard
          introText={`Et si le prénom de ${contactFirstName} en disait plus long que tu ne le crois ? 🤔 Découvre son profil numérologique et votre compatibilité 🔢✨`}
          modeEmploiLines={[
            `🔢 Le chiffre vibratoire de ${contactFirstName} est calculé automatiquement`,
            "💞 Découvre votre compatibilité numérologique en bas de page",
            lifePathProfile
              ? "🌟 Sa date de naissance permet aussi de découvrir son chemin de vie !"
              : "🎯 Ajoute sa date de naissance pour découvrir aussi son chemin de vie",
          ]}
          backgroundColor={Colors.white}
          borderWidth={4}
          containerStyle={{ marginBottom: 10 }}
        />

        {numPrenom && (
          <NumCard title={`Chiffre du prénom ${contactFirstName}`} profile={numPrenom} styles={styles} />
        )}
        {numExpression && (
          <NumCard title="Chiffre d'expression (prénom + nom)" profile={numExpression} styles={styles} />
        )}
        {lifePathProfile && (
          <NumCard
            title="🌟 Chemin de vie"
            profile={lifePathProfile}
            styles={styles}
            note="Le chiffre numérologique le plus important — révèle la mission de vie"
          />
        )}

        {/* Compatibilité */}
        {compat && myNumProfile && numPrenom ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>💞 Votre compatibilité numérologique en bref :</Text>
            <LinearGradient colors={[...Gradients.onboarding]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.compatCard}>
              <View style={styles.compatNumbersRow}>
                <View style={styles.compatNumberPillFlashy}>
                  <Text style={styles.compatNumberValueFlashy}>{myNumProfile.number}</Text>
                  <Text style={styles.compatNumberLabelFlashy}>Toi</Text>
                </View>
                <Text style={styles.compatHeart}>{compat.emoji}</Text>
                <View style={styles.compatNumberPillFlashy}>
                  <Text style={styles.compatNumberValueFlashy}>{numPrenom.number}</Text>
                  <Text style={styles.compatNumberLabelFlashy}>{contactFirstName}</Text>
                </View>
              </View>
              <Text style={styles.compatLabelFlashy}>{compat.label}</Text>
              <Text style={styles.compatDescriptionFlashy}>{compat.description}</Text>
            </LinearGradient>
            <TouchableOpacity
              style={[styles.fullCompatBtn, { borderColor: C.primary }]}
              onPress={() => router.push(`/(app)/contact/compat/${id}` as never)}
              activeOpacity={0.85}
            >
              <Text style={[styles.fullCompatBtnText, { color: C.primary }]}>Voir votre compatibilité complète →</Text>
              <Text style={styles.fullCompatBtnSub}>Numérologie · Astrologie · Zodiaque chinois</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.emptyNote}>Renseigne ton prénom dans ton profil pour découvrir ta compatibilité avec {contactFirstName} 💞</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function NumCard({ title, profile, styles, note }: { title: string; profile: NumerologyProfile; styles: ReturnType<typeof makeStyles>; note?: string }) {
  return (
    <View style={[styles.numCard, { borderLeftColor: profile.color }]}>
      <View style={styles.numCardHeader}>
        <View style={[styles.numColorDot, { backgroundColor: profile.color }]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.numCardLabel}>{title}</Text>
          <View style={styles.numCardTitleRow}>
            <Text style={[styles.numCardNumber, { color: profile.color }]}>{profile.number}</Text>
            <Text style={styles.numCardName}>{profile.name}</Text>
            <View style={[styles.numColorPill, { backgroundColor: profile.color + '20', borderColor: profile.color + '60' }]}>
              <Text style={[styles.numColorPillText, { color: profile.color }]}>{profile.colorName}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.numKeywords}>
        {profile.keywords.map((k) => (
          <View key={k} style={styles.numKeywordPill}><Text style={styles.numKeywordText}>{k}</Text></View>
        ))}
      </View>
      <Text style={styles.numDescription}>{profile.description}</Text>
      {note && <Text style={styles.numNote}>{note}</Text>}
    </View>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.surface },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing[4], paddingVertical: Spacing[3] },
    backLink: { paddingVertical: 4, paddingRight: 8, width: 60 },
    backLinkText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.base },
    topbarTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.lg, color: Colors.onSurface, flex: 1, textAlign: 'center' },
    scrollContent: { paddingHorizontal: Spacing[4], paddingBottom: 140 },
    section: { marginTop: Spacing[4] },
    sectionLabel: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.lg, color: Colors.onSurface, marginBottom: Spacing[2] },
    numCard: {
      backgroundColor: Colors.white, borderRadius: Radii.lg, borderLeftWidth: 4,
      padding: Spacing[4], marginBottom: Spacing[3], ...Shadows.sm,
    },
    numCardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
    numColorDot: { width: 14, height: 14, borderRadius: 7, marginTop: 4 },
    numCardLabel: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: Colors.onSurfaceVariant, marginBottom: 2 },
    numCardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    numCardNumber: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['3xl'] },
    numCardName: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: Colors.onSurface },
    numColorPill: { borderRadius: Radii.full, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2 },
    numColorPillText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs },
    numKeywords: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
    numKeywordPill: { backgroundColor: Colors.surfaceContainerHighest, borderRadius: Radii.full, paddingHorizontal: 10, paddingVertical: 4 },
    numKeywordText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: Colors.onSurfaceVariant },
    numDescription: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, lineHeight: 20 },
    numNote: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: Colors.onSurfaceVariant, marginTop: 8, fontStyle: 'italic' },
    compatCard: {
      borderRadius: Radii.xl, borderWidth: 3, borderColor: '#fff',
      padding: Spacing[4], gap: 8, ...Shadows.md,
    },
    compatNumbersRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 },
    compatNumberPill: { alignItems: 'center', gap: 2 },
    compatNumberValue: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['4xl'] },
    compatNumberLabel: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: Colors.onSurfaceVariant },
    compatNumberPillFlashy: {
      alignItems: 'center', gap: 2, backgroundColor: 'rgba(255,255,255,0.25)',
      borderRadius: Radii.lg, paddingVertical: 8, paddingHorizontal: 18,
    },
    compatNumberValueFlashy: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['4xl'], color: '#fff' },
    compatNumberLabelFlashy: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs, color: '#fff' },
    compatHeart: { fontSize: 28 },
    compatLabel: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: Colors.onSurface, textAlign: 'center' },
    compatDescription: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, lineHeight: 20 },
    compatLabelFlashy: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.lg, color: '#fff', textAlign: 'center' },
    compatDescriptionFlashy: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: 'rgba(255,255,255,0.92)', lineHeight: 20 },
    fullCompatBtn: { borderRadius: Radii.lg, borderWidth: 1.5, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center', marginTop: Spacing[3] },
    fullCompatBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base },
    fullCompatBtnSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant, marginTop: 2 },
    emptyNote: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 20 },
  });
}
