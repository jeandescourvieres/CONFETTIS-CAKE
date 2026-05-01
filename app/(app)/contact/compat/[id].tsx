// ═══════════════════════════════════════════════════════════════════
//  Confettis & Cake — Compatibilité enrichie
//  3 onglets : Numérologie · Astrologie occidentale · Zodiaque chinois
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useContact } from '../../../../src/hooks/useContacts';
import { useAuthStore } from '../../../../src/stores/authStore';
import { Colors, Typography, Spacing, Radii } from '../../../../src/constants/theme';
import { useColors } from '../../../../src/hooks/useColors';
import { FeatureIntroCard } from '../../../../src/components/ui/FeatureIntroCard';
import {
  getZodiacSign,
  getZodiacCompatibility,
  getChineseZodiac,
  getChineseZodiacCompatibility,
} from '../../../../src/utils/zodiac';
import {
  calcNumerology,
  calcLifePath,
  getNumerologyProfile,
  getNumerologyCompatibility,
} from '../../../../src/utils/numerology';

type Tab = 'numerologie' | 'occidental' | 'chinois';

export default function CompatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  const { data: contact, isLoading } = useContact(id);
  const profile = useAuthStore((s) => s.profile);

  const [activeTab, setActiveTab] = useState<Tab>('numerologie');
  const [helpVisible, setHelpVisible] = useState(false);

  // ── Données de l'utilisateur ──────────────────────────────────────────────
  const myName = profile?.full_name ?? '';
  const myBirthday = profile?.birthday ?? null;
  // Profil utilisateur stocké en "Prénom Nom" (ordre normal, pas "NOM Prénom" comme les contacts)
  const myNameParts = myName.trim().split(' ');
  const myFirstName = myNameParts[0] ?? '';
  const myLastName  = myNameParts.slice(1).join(' ');

  // ── Données du contact ────────────────────────────────────────────────────
  const contactName = contact?.name ?? '';
  const contactBirthday = contact?.birthday ?? null;
  const contactParts = contactName.trim().split(' ');
  const contactLastName = contactParts[0] ?? '';
  const contactFirstName = contactParts.slice(1).join(' ') || contactLastName;

  // ── Numérologie ───────────────────────────────────────────────────────────
  const myNumProfile   = myFirstName    ? getNumerologyProfile(calcNumerology(myFirstName))      : null;
  const cntNumProfile  = contactFirstName ? getNumerologyProfile(calcNumerology(contactFirstName)) : null;
  const myLifePath     = myBirthday && !myBirthday.startsWith('0000-')
    ? getNumerologyProfile(calcLifePath(myBirthday) ?? 1) : null;
  const cntLifePath    = contactBirthday && !contactBirthday.startsWith('0000-')
    ? getNumerologyProfile(calcLifePath(contactBirthday) ?? 1) : null;
  const numCompat = myNumProfile && cntNumProfile
    ? getNumerologyCompatibility(myNumProfile.number, cntNumProfile.number) : null;

  // ── Astrologie occidentale ────────────────────────────────────────────────
  const myZodiac  = myBirthday ? getZodiacSign(myBirthday) : null;
  const cntZodiac = contactBirthday ? getZodiacSign(contactBirthday) : null;
  const zodiacCompat = myZodiac && cntZodiac ? getZodiacCompatibility(myZodiac, cntZodiac) : null;

  // ── Zodiaque chinois ──────────────────────────────────────────────────────
  const myChinese  = myBirthday ? getChineseZodiac(myBirthday) : null;
  const cntChinese = contactBirthday ? getChineseZodiac(contactBirthday) : null;
  const chineseCompat = myChinese && cntChinese ? getChineseZodiacCompatibility(myChinese, cntChinese) : null;

  // ── Score global ──────────────────────────────────────────────────────────
  const scores = [numCompat?.score, zodiacCompat?.score, chineseCompat?.score].filter((s): s is number => s !== undefined);
  const globalScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
  const globalPct   = globalScore ? Math.round((globalScore / 5) * 100) : null;
  const globalInfo  = globalPct !== null
    ? globalPct >= 80 ? { emoji: '💫', label: 'Une connexion exceptionnelle !' }
    : globalPct >= 60 ? { emoji: '✨', label: 'Une belle complicité !' }
    : globalPct >= 40 ? { emoji: '🌟', label: 'Une relation complémentaire !' }
    :                   { emoji: '🌱', label: 'Une relation qui grandit !' }
    : null;

  const TABS: { id: Tab; label: string; emoji: string }[] = [
    { id: 'numerologie', label: 'Numérologie',  emoji: '🔢' },
    { id: 'occidental',  label: 'Astrologie',   emoji: '⭐' },
    { id: 'chinois',     label: 'Zodiaque 🐉',  emoji: '🐉' },
  ];

  if (isLoading || !contact) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.center}>
          <Text style={{ color: C.primary, fontSize: 32 }}>✦</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>Compatibilité 💫</Text>
        <TouchableOpacity onPress={() => setHelpVisible(true)} style={styles.helpBtn}>
          <Text style={styles.helpBtnText}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Intro ──────────────────────────────────────── */}
        <LinearGradient colors={C.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroBanner}>
          <Text style={styles.heroEmoji}>💫</Text>
          <Text style={styles.heroTitle}>{myFirstName} & {contactFirstName}</Text>
          <Text style={styles.heroSub}>Certaines rencontres ne sont pas dues au hasard</Text>
        </LinearGradient>

        <FeatureIntroCard
          introText={"Certaines rencontres ne sont pas dues au hasard 💫 Chaque relation est unique et mystérieuse — et trois clés complémentaires peuvent nous aider à mieux la comprendre. La numérologie, l'astrologie occidentale et l'astrologie chinoise dévoilent chacune à leur façon les forces, les défis et ce qui vous unit vraiment 🌟 Explore les trois et laisse l'univers te surprendre ✨💛"}
          modeEmploiLines={[
            '💫 La page Compatibilité est organisée en trois onglets :',
            '🔢 Numérologie — basée sur les vibrations de vos prénoms',
            '⭐ Astrologie occidentale — basée sur vos signes du zodiaque',
            '🐉 Astrologie chinoise — basée sur vos animaux du zodiaque chinois',
            '🌟 Un score global en bas de page combine les trois analyses',
            '👆 Appuie sur chaque onglet pour explorer une approche différente',
            "💛 Plus tu renseignes d'informations dans les fiches contacts, plus les analyses seront précises ✨",
          ]}
          containerStyle={{ marginHorizontal: Spacing[4], marginBottom: Spacing[3] }}
        />

        {/* ── Onglets ─────────────────────────────────────── */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.tabEmoji}>{tab.emoji}</Text>
              <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ══════════════════════════════════════════════════
            ONGLET NUMÉROLOGIE
        ══════════════════════════════════════════════════ */}
        {activeTab === 'numerologie' && (
          <View style={styles.tabContent}>
            <Text style={styles.tabIntro}>
              {"Vos prénoms ne se sont peut-être pas rencontrés par hasard 🌟 En numérologie, chaque prénom vibre à une fréquence unique 🔢 Découvrez comment les vibrations cachées derrière chaque lettre s'harmonisent, se complètent ou se confrontent et ce qu'elles révèlent sur la nature profonde de votre relation 💛✨"}
            </Text>

            {myNumProfile && cntNumProfile ? (
              <>
                {/* Profils côte à côte */}
                <View style={styles.profilesRow}>
                  <NumProfileCard name={myFirstName} profile={myNumProfile} C={C} styles={styles} />
                  <View style={styles.vsColumn}>
                    <Text style={styles.vsText}>VS</Text>
                  </View>
                  <NumProfileCard name={contactFirstName} profile={cntNumProfile} C={C} styles={styles} />
                </View>

                {/* Chemins de vie si dispo */}
                {(myLifePath || cntLifePath) && (
                  <View style={styles.lifePathRow}>
                    {myLifePath && (
                      <View style={[styles.lifePathCard, { borderColor: myLifePath.color + '80' }]}>
                        <Text style={styles.lifePathMini}>🌟 Chemin de vie de {myFirstName}</Text>
                        <Text style={[styles.lifePathNumber, { color: myLifePath.color }]}>{myLifePath.number}</Text>
                        <Text style={styles.lifePathName}>{myLifePath.name}</Text>
                      </View>
                    )}
                    {cntLifePath && (
                      <View style={[styles.lifePathCard, { borderColor: cntLifePath.color + '80' }]}>
                        <Text style={styles.lifePathMini}>🌟 Chemin de vie de {contactFirstName}</Text>
                        <Text style={[styles.lifePathNumber, { color: cntLifePath.color }]}>{cntLifePath.number}</Text>
                        <Text style={styles.lifePathName}>{cntLifePath.name}</Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Score compatibilité */}
                {numCompat && (
                  <CompatScoreCard compat={numCompat} C={C} styles={styles} />
                )}
              </>
            ) : (
              <MissingDataCard
                message="Pour voir la compatibilité numérologique, assure-toi que ton prénom est renseigné dans Mon Profil et que la fiche contact est complète."
                C={C} styles={styles}
              />
            )}
          </View>
        )}

        {/* ══════════════════════════════════════════════════
            ONGLET ASTROLOGIE OCCIDENTALE
        ══════════════════════════════════════════════════ */}
        {activeTab === 'occidental' && (
          <View style={styles.tabContent}>
            <Text style={styles.tabIntro}>
              {"Depuis des millénaires, les astres guident les relations humaines ⭐ Bélier et Lion, Vierge et Poissons... certaines associations font vibrer l'univers ! Découvrez ce que vos deux signes du zodiaque disent de votre compatibilité et explorez à travers le prisme fascinant de l'astrologie occidentale les forces, les défis et ce que les astres ont peut-être prévu pour votre relation 🌟💛✨"}
            </Text>

            {myZodiac && cntZodiac ? (
              <>
                <View style={styles.profilesRow}>
                  <ZodiacProfileCard name={myFirstName} sign={myZodiac} C={C} styles={styles} />
                  <View style={styles.vsColumn}>
                    <Text style={styles.vsText}>VS</Text>
                  </View>
                  <ZodiacProfileCard name={contactFirstName} sign={cntZodiac} C={C} styles={styles} />
                </View>
                {zodiacCompat && <CompatScoreCard compat={zodiacCompat} C={C} styles={styles} />}
              </>
            ) : (
              <MissingDataCard
                message={
                  !myBirthday
                    ? "Pour voir la compatibilité astrologique, renseigne ta date de naissance dans Mon Profil."
                    : "Pour voir la compatibilité astrologique, renseigne la date de naissance complète de ton contact."
                }
                C={C} styles={styles}
              />
            )}
          </View>
        )}

        {/* ══════════════════════════════════════════════════
            ONGLET ZODIAQUE CHINOIS
        ══════════════════════════════════════════════════ */}
        {activeTab === 'chinois' && (
          <View style={styles.tabContent}>
            <Text style={styles.tabIntro}>
              {"Depuis plus de 2000 ans, le zodiaque chinois guide les destinées et les relations 🐉 Dans la tradition chinoise, l'année de votre naissance vous associe à un animal aux vertus et aux énergies uniques — Dragon et Tigre, Lapin et Cheval... certaines associations traversent les millénaires ! Découvrez vos deux animaux et explorez ce que la sagesse ancestrale chinoise révèle sur la nature profonde de votre compatibilité 🌟💛✨"}
            </Text>

            {myChinese && cntChinese ? (
              <>
                <View style={styles.profilesRow}>
                  <ChineseProfileCard name={myFirstName} sign={myChinese} C={C} styles={styles} />
                  <View style={styles.vsColumn}>
                    <Text style={styles.vsText}>VS</Text>
                  </View>
                  <ChineseProfileCard name={contactFirstName} sign={cntChinese} C={C} styles={styles} />
                </View>
                {chineseCompat && <CompatScoreCard compat={chineseCompat} C={C} styles={styles} />}
              </>
            ) : (
              <MissingDataCard
                message={
                  !myBirthday
                    ? "Pour voir la compatibilité chinoise, renseigne ta date de naissance dans Mon Profil."
                    : "Pour voir la compatibilité chinoise, renseigne l'année de naissance de ton contact."
                }
                C={C} styles={styles}
              />
            )}
          </View>
        )}

        {/* ── Score global ─────────────────────────────────── */}
        {globalInfo && globalPct !== null && scores.length >= 2 && (
          <View style={[styles.globalCard, { borderColor: C.primary }]}>
            <Text style={styles.globalLabel}>Score global de compatibilité</Text>
            <Text style={styles.globalEmoji}>{globalInfo.emoji}</Text>
            <View style={styles.globalPctRow}>
              <Text style={[styles.globalPct, { color: C.primary }]}>{globalPct}%</Text>
              <Text style={styles.globalPctLabel}>{globalInfo.label}</Text>
            </View>
            <Text style={styles.globalIntro}>
              {"La numérologie, les astres occidentaux et la sagesse chinoise ont parlé ✨ Trois regards différents sur une même relation — et maintenant place à la synthèse ! Le score global combine ces trois approches complémentaires pour vous donner en un seul chiffre une vision complète et unique de la force de votre connexion 🌟💛"}
            </Text>
            {/* Barres des scores individuels */}
            <View style={styles.scoreBreakdown}>
              {[
                { label: '🔢 Numérologie',        score: numCompat?.score },
                { label: '⭐ Astrologie',          score: zodiacCompat?.score },
                { label: '🐉 Zodiaque chinois',    score: chineseCompat?.score },
              ].filter((r) => r.score !== undefined).map((row) => (
                <View key={row.label} style={styles.scoreRow}>
                  <Text style={styles.scoreRowLabel}>{row.label}</Text>
                  <View style={styles.scoreBar}>
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <View
                        key={dot}
                        style={[
                          styles.scoreDot,
                          { backgroundColor: (row.score ?? 0) >= dot ? C.primary : Colors.surfaceContainerHighest },
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.scoreRowValue, { color: C.primary }]}>{row.score}/5</Text>
                </View>
              ))}
            </View>
            <Text style={styles.globalNote}>
              💡 La compatibilité est donnée à titre indicatif et ludique — une relation qui demande du travail n'est pas une mauvaise relation, c'est une relation qui grandit !
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal aide */}
      <Modal visible={helpVisible} transparent animationType="fade" onRequestClose={() => setHelpVisible(false)}>
        <TouchableOpacity
          style={styles.helpModalOverlay}
          activeOpacity={1}
          onPress={() => setHelpVisible(false)}
        >
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne la page Compatibilité ? 💫</Text>
              <TouchableOpacity onPress={() => setHelpVisible(false)}>
                <Text style={styles.helpModalClose}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            {[
              { title: 'Trois approches complémentaires', body: 'Numérologie, astrologie occidentale et astrologie chinoise. Chaque approche révèle une facette unique de votre connexion.' },
              { title: 'Les trois onglets', body: 'Chaque onglet affiche les profils des deux personnes et un score de compatibilité avec un commentaire personnalisé.' },
              { title: 'Le score global', body: 'En bas de page, combine les trois approches pour une vision complète — avec un emoji et un message selon le résultat global.' },
              { title: 'Les données utilisées', body: 'Basées sur prénom, nom, date de naissance des fiches contacts. Plus les fiches sont complètes, plus les analyses sont précises.' },
              { title: 'Bon à savoir 💡', body: 'La compatibilité est donnée à titre indicatif et ludique — elle ne prédit pas l\'avenir mais peut aider à mieux se comprendre et à valoriser vos différences !' },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// ── Sous-composants ─────────────────────────────────────────────────────────

function NumProfileCard({ name, profile, C, styles }: {
  name: string;
  profile: ReturnType<typeof getNumerologyProfile>;
  C: ReturnType<typeof useColors>;
  styles: ReturnType<typeof makeStyles>;
}) {
  return (
    <View style={[styles.profileCard, { borderTopColor: profile.color }]}>
      <View style={[styles.profileColorCircle, { backgroundColor: profile.color }]}>
        <Text style={styles.profileCircleNumber}>{profile.number}</Text>
      </View>
      <Text style={styles.profileCardName}>{name}</Text>
      <Text style={[styles.profileCardMain, { color: profile.color }]}>{profile.name}</Text>
      <View style={styles.profileKeywords}>
        {profile.keywords.slice(0, 2).map((k) => (
          <View key={k} style={[styles.profileKw, { borderColor: profile.color + '60' }]}>
            <Text style={[styles.profileKwText, { color: profile.color }]}>{k}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ZodiacProfileCard({ name, sign, C, styles }: {
  name: string;
  sign: { name: string; emoji: string; element: string; elementEmoji: string; keywords: string[] };
  C: ReturnType<typeof useColors>;
  styles: ReturnType<typeof makeStyles>;
}) {
  return (
    <View style={[styles.profileCard, { borderTopColor: C.primary }]}>
      <Text style={styles.profileCardEmoji}>{sign.emoji}</Text>
      <Text style={styles.profileCardName}>{name}</Text>
      <Text style={[styles.profileCardMain, { color: C.primary }]}>{sign.name}</Text>
      <View style={[styles.profileKw, { borderColor: C.primary + '60', alignSelf: 'center' }]}>
        <Text style={[styles.profileKwText, { color: C.primary }]}>{sign.elementEmoji} {sign.element}</Text>
      </View>
    </View>
  );
}

function ChineseProfileCard({ name, sign, C, styles }: {
  name: string;
  sign: { name: string; emoji: string; element: string; elementEmoji: string; virtues: string };
  C: ReturnType<typeof useColors>;
  styles: ReturnType<typeof makeStyles>;
}) {
  return (
    <View style={[styles.profileCard, { borderTopColor: C.primary }]}>
      <Text style={styles.profileCardEmoji}>{sign.emoji}</Text>
      <Text style={styles.profileCardName}>{name}</Text>
      <Text style={[styles.profileCardMain, { color: C.primary }]}>{sign.name}</Text>
      <View style={[styles.profileKw, { borderColor: C.primary + '60', alignSelf: 'center' }]}>
        <Text style={[styles.profileKwText, { color: C.primary }]}>{sign.elementEmoji} {sign.element}</Text>
      </View>
    </View>
  );
}

function CompatScoreCard({ compat, C, styles }: {
  compat: { score: number; label: string; emoji: string; description: string };
  C: ReturnType<typeof useColors>;
  styles: ReturnType<typeof makeStyles>;
}) {
  return (
    <View style={[styles.compatCard, { borderLeftColor: C.primary }]}>
      <View style={styles.compatCardHeader}>
        <Text style={styles.compatCardEmoji}>{compat.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.compatCardLabel, { color: C.primary }]}>{compat.label}</Text>
          <View style={styles.compatStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Text key={star} style={{ fontSize: 16, color: compat.score >= star ? '#F9A825' : Colors.surfaceContainerHighest }}>★</Text>
            ))}
          </View>
        </View>
      </View>
      <Text style={styles.compatCardDesc}>{compat.description}</Text>
    </View>
  );
}

function MissingDataCard({ message, C, styles }: {
  message: string;
  C: ReturnType<typeof useColors>;
  styles: ReturnType<typeof makeStyles>;
}) {
  return (
    <View style={styles.missingCard}>
      <Text style={styles.missingEmoji}>🔒</Text>
      <Text style={styles.missingText}>{message}</Text>
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center' },

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
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primaryContainer,
  },
  backBtnText: { fontSize: 34, color: C.primary, lineHeight: 38 },
  topbarTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
  },
  helpBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.primaryContainer,
  },
  helpBtnText: { fontSize: 18 },

  content: { paddingBottom: 80 },

  heroBanner: {
    margin: Spacing[4],
    borderRadius: Radii.xl,
    paddingVertical: Spacing[5],
    paddingHorizontal: Spacing[4],
    alignItems: 'center',
    gap: 6,
  },
  heroEmoji: { fontSize: 36 },
  heroTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.white,
    textAlign: 'center',
  },
  heroSub: {
    fontFamily: 'BeVietnamPro_300Light_Italic',
    fontSize: Typography.base,
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
  },

  introCard: {
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[3],
    backgroundColor: C.primaryContainer,
    borderLeftWidth: 3,
    borderLeftColor: C.primary,
    borderRadius: Radii.md,
    padding: 12,
    gap: 8,
  },
  introText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  modeEmploi: { gap: 3 },
  modeEmploiLine: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 20,
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[3],
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.lg,
    padding: 4,
    gap: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: Radii.md,
    gap: 2,
  },
  tabActive: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabEmoji: { fontSize: 14 },
  tabLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  tabLabelActive: { color: C.primary },

  // Tab content area
  tabContent: {
    marginHorizontal: Spacing[4],
    gap: Spacing[3],
    marginBottom: Spacing[4],
  },
  tabIntro: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 21,
  },

  // Profiles row (côte à côte)
  profilesRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
  },
  profileCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    borderTopWidth: 3,
    borderWidth: 0.5,
    borderColor: Colors.surfaceContainerHighest,
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  profileColorCircle: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  profileCircleNumber: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 20,
    color: Colors.white,
  },
  profileCardEmoji: { fontSize: 32 },
  profileCardName: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },
  profileCardMain: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.sm,
    textAlign: 'center',
  },
  profileKeywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  profileKw: {
    borderWidth: 1,
    borderRadius: Radii.full,
    paddingVertical: 2,
    paddingHorizontal: 7,
  },
  profileKwText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 10,
  },

  vsColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  vsText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },

  // Chemins de vie
  lifePathRow: {
    flexDirection: 'row',
    gap: 8,
  },
  lifePathCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radii.md,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    gap: 3,
  },
  lifePathMini: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  lifePathNumber: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
  },
  lifePathName: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: Colors.onSurface,
    textAlign: 'center',
  },

  // Compat score card
  compatCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    borderLeftWidth: 4,
    borderWidth: 0.5,
    borderColor: Colors.surfaceContainerHighest,
    padding: 14,
    gap: 8,
  },
  compatCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  compatCardEmoji: { fontSize: 28 },
  compatCardLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    marginBottom: 2,
  },
  compatStars: { flexDirection: 'row', gap: 2 },
  compatCardDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 22,
  },

  // Missing data
  missingCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.lg,
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  missingEmoji: { fontSize: 28 },
  missingText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 21,
  },

  // Score global
  globalCard: {
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[3],
    backgroundColor: Colors.white,
    borderRadius: Radii['2xl'],
    borderWidth: 1.5,
    padding: Spacing[4],
    gap: 12,
    alignItems: 'center',
  },
  globalLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  globalEmoji: { fontSize: 36 },
  globalPctRow: { alignItems: 'center', gap: 4 },
  globalPct: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 40,
    lineHeight: 44,
  },
  globalPctLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  globalIntro: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 21,
    textAlign: 'center',
  },
  scoreBreakdown: {
    width: '100%',
    gap: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scoreRowLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    width: 130,
  },
  scoreBar: { flexDirection: 'row', gap: 4, flex: 1 },
  scoreDot: { width: 10, height: 10, borderRadius: 5 },
  scoreRowValue: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    width: 28,
    textAlign: 'right',
  },
  globalNote: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Help modal
  helpModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: Spacing[4],
  },
  helpModalCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii['2xl'],
    overflow: 'hidden',
    maxHeight: '85%',
  },
  helpModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.primary,
    paddingHorizontal: Spacing[4],
    paddingVertical: 12,
  },
  helpModalTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.white,
    flex: 1,
    marginRight: 8,
  },
  helpModalClose: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },
  helpModalSection: {
    paddingHorizontal: Spacing[4],
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.surfaceContainerLow,
  },
  helpModalSectionTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  helpModalSectionBody: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },
  });
}
