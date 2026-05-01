// ═══════════════════════════════════════════════════════════════
//  Confettis & Cake — Numérologie (Phase 5)
// ═══════════════════════════════════════════════════════════════

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { useColors } from '../../src/hooks/useColors';
import { calcNumerology, calcLifePath, getNumerologyProfile } from '../../src/utils/numerology';
import { FeatureIntroCard } from '../../src/components/ui/FeatureIntroCard';

// ── Suggestions ──────────────────────────────────────────────────────────────

const SUGGESTIONS_PRENOM = ['Emma', 'Lucas', 'Jade', 'Léo', 'Anaïs', 'Jean', 'Sophie', 'Thomas'];
const SUGGESTIONS_NOM    = ['Martin', 'Dupont', 'Bernard', 'Moreau', 'Petit'];

// ── Composant ────────────────────────────────────────────────────────────────

export default function NumerologieScreen() {
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  const [prenom, setPrenom] = useState('');
  const [nom, setNom]       = useState('');
  const [birthday, setBirthday] = useState('');

  const handleBirthdayChange = (text: string) => {
    // Garde uniquement les chiffres, max 8
    const digits = text.replace(/\D/g, '').slice(0, 8);
    // Insère les / automatiquement : JJ/MM/AAAA
    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    setBirthday(formatted);
  };
  const [helpVisible, setHelpVisible] = useState(false);
  const [showCalcDetail, setShowCalcDetail] = useState(false);

  // ── Calculs ────────────────────────────────────────────────────────────────

  const chiffrePrenom = useMemo(
    () => prenom.trim() ? calcNumerology(prenom.trim()) : null,
    [prenom],
  );

  const chiffreNom = useMemo(
    () => nom.trim() ? calcNumerology(nom.trim()) : null,
    [nom],
  );

  const chiffreExpression = useMemo(
    () => prenom.trim() && nom.trim()
      ? calcNumerology(`${prenom.trim()} ${nom.trim()}`)
      : null,
    [prenom, nom],
  );

  const cheminDeVie = useMemo(() => {
    if (!birthday.trim()) return null;
    const parts = birthday.includes('/') ? birthday.split('/') : null;
    if (parts && parts.length === 3) {
      const iso = `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
      return calcLifePath(iso);
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(birthday)) return calcLifePath(birthday);
    return null;
  }, [birthday]);

  // Somme brute des chiffres de la date (pour affichage du détail chemin de vie)
  const lifePathDigitsSum = useMemo(() => {
    if (!birthday.trim()) return null;
    const parts = birthday.includes('/') ? birthday.split('/') : null;
    let iso = birthday;
    if (parts && parts.length === 3) {
      iso = `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso) || iso.startsWith('0000-')) return null;
    const digits = iso.replace(/-/g, '').split('').map(Number);
    return { digits, sum: digits.reduce((a, d) => a + d, 0) };
  }, [birthday]);

  const profilePrenom     = chiffrePrenom     ? getNumerologyProfile(chiffrePrenom)     : null;
  const profileNom        = chiffreNom        ? getNumerologyProfile(chiffreNom)        : null;
  const profileExpression = chiffreExpression ? getNumerologyProfile(chiffreExpression) : null;
  const profileCdv        = cheminDeVie       ? getNumerologyProfile(cheminDeVie)       : null;

  // ── Helpers UI ─────────────────────────────────────────────────────────────

  const numberBadge = useCallback(
    (n: number, color: string, label: string) => (
      <View style={[styles.numberBadge, { backgroundColor: color + '22', borderColor: color }]}>
        <Text style={[styles.numberBadgeNum, { color }]}>{n}</Text>
        <Text style={[styles.numberBadgeLabel, { color }]}>{label}</Text>
      </View>
    ),
    [styles],
  );

  const profileCard = useCallback(
    (title: string, n: number, color: string, name: string, keywords: string[], description: string) => (
      <View style={[styles.profileCard, { borderLeftColor: color }]}>
        <View style={styles.profileCardHeader}>
          <View style={[styles.profileBigBadge, { backgroundColor: color + '22', borderColor: color }]}>
            <Text style={[styles.profileBigNum, { color }]}>{n}</Text>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.profileCardTitle}>{title}</Text>
            <Text style={[styles.profileCardName, { color }]}>{name}</Text>
          </View>
        </View>
        <View style={styles.keywordsRow}>
          {keywords.map((kw) => (
            <View key={kw} style={[styles.keywordChip, { backgroundColor: color + '18' }]}>
              <Text style={[styles.keywordText, { color }]}>{kw}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.profileDesc}>{description}</Text>
      </View>
    ),
    [styles],
  );

  const hasResult = chiffrePrenom !== null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🔢 Numérologie</Text>
        <TouchableOpacity onPress={() => setHelpVisible(true)} style={styles.helpBtn}>
          <Text style={styles.helpBtnText}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Intro ── */}
          <FeatureIntroCard
            introText={"Et si les lettres d'un prénom en disaient plus long que tu ne le crois ? 🤔 La numérologie attribue une valeur numérique à chaque lettre et révèle à travers un chiffre unique la personnalité profonde et l'énergie vibratoire de celui qui porte ce prénom 🔢✨"}
            modeEmploiLines={[
              "🔍 Saisis n'importe quel prénom et découvre son chiffre vibratoire",
              "✨ Ajoute le nom de famille pour le chiffre d'expression",
              "🌟 Ajoute la date de naissance pour le chemin de vie",
              "💫 Chaque chiffre révèle une personnalité et une énergie unique",
            ]}
          />

          {/* ── Formulaire ── */}
          <View style={styles.formCard}>
            <Text style={styles.formLabel}>Prénom</Text>
            <TextInput
              style={styles.input}
              value={prenom}
              onChangeText={setPrenom}
              placeholder="ex: Emma, Lucas, Jean..."
              placeholderTextColor={Colors.onSurfaceVariant + '88'}
              autoCapitalize="words"
              returnKeyType="next"
            />

            {/* Suggestions prénom */}
            {!prenom && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsRow}>
                {SUGGESTIONS_PRENOM.map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setPrenom(s)}
                    style={[styles.suggestionChip, { borderColor: C.primary }]}
                  >
                    <Text style={[styles.suggestionText, { color: C.primary }]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <Text style={[styles.formLabel, { marginTop: 12 }]}>Nom de famille <Text style={styles.optionalLabel}>(optionnel)</Text></Text>
            <TextInput
              style={styles.input}
              value={nom}
              onChangeText={setNom}
              placeholder="ex: Martin, Dupont..."
              placeholderTextColor={Colors.onSurfaceVariant + '88'}
              autoCapitalize="words"
              returnKeyType="next"
            />

            {!nom && prenom && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsRow}>
                {SUGGESTIONS_NOM.map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setNom(s)}
                    style={[styles.suggestionChip, { borderColor: C.primary }]}
                  >
                    <Text style={[styles.suggestionText, { color: C.primary }]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <Text style={[styles.formLabel, { marginTop: 12 }]}>Date de naissance <Text style={styles.optionalLabel}>(optionnel — pour le chemin de vie)</Text></Text>
            <TextInput
              style={styles.input}
              value={birthday}
              onChangeText={handleBirthdayChange}
              placeholder="JJ/MM/AAAA"
              placeholderTextColor={Colors.onSurfaceVariant + '88'}
              keyboardType="numeric"
              returnKeyType="done"
              maxLength={10}
            />
          </View>

          {/* ── Résultats ── */}
          {hasResult && (
            <>
              {/* Résumé des chiffres */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>
                  {prenom.trim()}{nom.trim() ? ` ${nom.trim()}` : ''}
                </Text>
                <View style={styles.summaryBadges}>
                  {profilePrenom && numberBadge(chiffrePrenom!, profilePrenom.color, 'Prénom')}
                  {profileNom && numberBadge(chiffreNom!, profileNom.color, 'Nom')}
                  {profileExpression && numberBadge(chiffreExpression!, profileExpression.color, 'Expression')}
                  {profileCdv && numberBadge(cheminDeVie!, profileCdv.color, 'Chemin de vie')}
                </View>

                <TouchableOpacity
                  onPress={() => setShowCalcDetail(!showCalcDetail)}
                  style={styles.calcDetailBtn}
                >
                  <Text style={[styles.calcDetailBtnText, { color: C.primary }]}>
                    {showCalcDetail ? 'Masquer le calcul ▲' : 'Voir le calcul détaillé ▼'}
                  </Text>
                </TouchableOpacity>

                {showCalcDetail && (
                  <View style={styles.calcDetail}>
                    <CalcDetail label={`Prénom "${prenom.trim()}"`} text={prenom.trim()} />
                    {nom.trim() && <CalcDetail label={`Nom "${nom.trim()}"`} text={nom.trim()} />}
                    {nom.trim() && (
                      <CalcDetail label={`Expression "${prenom.trim()} ${nom.trim()}"`} text={`${prenom.trim()} ${nom.trim()}`} />
                    )}
                    {birthday.trim() && cheminDeVie !== null && lifePathDigitsSum && (
                      <View style={{ gap: 3 }}>
                        <Text style={styles.calcRowLabel}>Chemin de vie ({birthday.trim()})</Text>
                        {/* Somme brute des chiffres */}
                        <Text style={styles.calcRowValue}>
                          {lifePathDigitsSum.digits.join('+')} = {lifePathDigitsSum.sum}
                        </Text>
                        {/* Étapes de réduction */}
                        {reductionSteps(lifePathDigitsSum.sum).map((step, i, arr) => (
                          <Text key={i} style={[styles.calcRowValue, { paddingLeft: 8 }]}>
                            {'→ '}
                            {i < arr.length - 1
                              ? step
                              : <Text>{step.split(' = ')[0]}{' = '}<Text style={{ fontFamily: 'BeVietnamPro_700Bold', color: Colors.onSurface }}>{step.split(' = ')[1]}</Text></Text>
                            }
                          </Text>
                        ))}
                        {/* Cas où la somme est déjà un chiffre unique ou nombre maître */}
                        {reductionSteps(lifePathDigitsSum.sum).length === 0 && (
                          <Text style={styles.calcRowValue}>
                            {'→ '}
                            <Text style={{ fontFamily: 'BeVietnamPro_700Bold', color: Colors.onSurface }}>{cheminDeVie}</Text>
                            {(cheminDeVie === 11 || cheminDeVie === 22) ? ' ✨ (nombre maître)' : ''}
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* Profil chiffre du prénom */}
              {profilePrenom && profileCard(
                `Chiffre du prénom · ${profilePrenom.colorName}`,
                chiffrePrenom!,
                profilePrenom.color,
                profilePrenom.name,
                profilePrenom.keywords,
                profilePrenom.description,
              )}

              {/* Profil chiffre du nom */}
              {profileNom && profileNom.number !== profilePrenom?.number && profileCard(
                `Chiffre du nom · ${profileNom.colorName}`,
                chiffreNom!,
                profileNom.color,
                profileNom.name,
                profileNom.keywords,
                profileNom.description,
              )}

              {/* Profil chiffre d'expression */}
              {profileExpression && profileExpression.number !== profilePrenom?.number && profileExpression.number !== profileNom?.number && profileCard(
                `Chiffre d'expression · ${profileExpression.colorName}`,
                chiffreExpression!,
                profileExpression.color,
                profileExpression.name,
                profileExpression.keywords,
                profileExpression.description,
              )}

              {/* Encadré explicatif — Chemin de vie */}
              {cheminDeVie !== null && (
                <View style={[styles.lifePathExplainCard, profileCdv ? { borderLeftColor: profileCdv.color } : {}]}>
                  <Text style={[styles.lifePathExplainTitle, { color: profileCdv?.color ?? C.primary }]}>✦ Le Chemin de Vie — le chiffre le plus important</Text>
                  <View style={styles.lifePathExplainRows}>
                    <View style={styles.lifePathExplainRow}>
                      <Text style={styles.lifePathExplainIcon}>📐</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.lifePathExplainLabel}>Comment il est calculé</Text>
                        <Text style={styles.lifePathExplainBody}>
                          On additionne tous les chiffres de la date de naissance (jour + mois + année), puis on réduit jusqu'à obtenir un chiffre entre 1 et 9.{'\n'}
                          Exception : 11 et 22 sont des <Text style={{ fontFamily: 'BeVietnamPro_700Bold' }}>nombres maîtres</Text> — on ne les réduit pas.
                        </Text>
                      </View>
                    </View>
                    <View style={styles.lifePathExplainRow}>
                      <Text style={styles.lifePathExplainIcon}>🌟</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.lifePathExplainLabel}>Ce qu'il révèle</Text>
                        <Text style={styles.lifePathExplainBody}>
                          Il indique la <Text style={{ fontFamily: 'BeVietnamPro_700Bold' }}>mission de vie profonde</Text>, les talents naturels qu'on porte dès la naissance, et les défis à traverser pour s'accomplir. Contrairement au chiffre du prénom (énergie du quotidien), le chemin de vie est immuable — il parle de ce qu'on est venu faire ici.
                        </Text>
                      </View>
                    </View>
                    <View style={styles.lifePathExplainRow}>
                      <Text style={styles.lifePathExplainIcon}>💡</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.lifePathExplainLabel}>Ce qu'on en tire</Text>
                        <Text style={styles.lifePathExplainBody}>
                          Une boussole intérieure : mieux se comprendre, comprendre ses proches, et reconnaître pourquoi certains chemins nous attirent naturellement plus que d'autres.
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* Profil chemin de vie */}
              {profileCdv && profileCard(
                `Chemin de vie · ${profileCdv.colorName}`,
                cheminDeVie!,
                profileCdv.color,
                profileCdv.name,
                profileCdv.keywords,
                profileCdv.description,
              )}

              {/* Comprendre les 3 chiffres */}
              <View style={[styles.explainCard, { backgroundColor: C.primaryContainer }]}>
                <Text style={[styles.explainTitle, { color: C.primary }]}>Comprendre les 3 chiffres 🔢</Text>
                <View style={styles.explainRows}>
                  <View style={styles.explainRow}>
                    <Text style={styles.explainNum}>1.</Text>
                    <Text style={styles.explainText}><Text style={{ fontFamily: 'BeVietnamPro_700Bold' }}>Chiffre du prénom</Text> — la personnalité au quotidien, l'énergie visible</Text>
                  </View>
                  <View style={styles.explainRow}>
                    <Text style={styles.explainNum}>2.</Text>
                    <Text style={styles.explainText}><Text style={{ fontFamily: 'BeVietnamPro_700Bold' }}>Chiffre du nom</Text> — l'héritage familial, les influences inconscientes</Text>
                  </View>
                  <View style={styles.explainRow}>
                    <Text style={styles.explainNum}>3.</Text>
                    <Text style={styles.explainText}><Text style={{ fontFamily: 'BeVietnamPro_700Bold' }}>Chiffre d'expression</Text> — la mission de vie, le potentiel global</Text>
                  </View>
                  {cheminDeVie !== null && (
                    <View style={styles.explainRow}>
                      <Text style={styles.explainNum}>✦</Text>
                      <Text style={styles.explainText}><Text style={{ fontFamily: 'BeVietnamPro_700Bold' }}>Chemin de vie</Text> — le plus important. Mission profonde, talents naturels, défis à surmonter</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Bouton reset */}
              <TouchableOpacity
                onPress={() => { setPrenom(''); setNom(''); setBirthday(''); setShowCalcDetail(false); }}
                style={[styles.resetBtn, { borderColor: C.primary }]}
              >
                <Text style={[styles.resetBtnText, { color: C.primary }]}>Effacer et recommencer</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ── CTA contacts ── */}
          {!hasResult && (
            <TouchableOpacity
              style={[styles.contactsBtn, { backgroundColor: C.primary }]}
              onPress={() => router.push('/(app)/contacts/' as never)}
              activeOpacity={0.85}
            >
              <Text style={styles.contactsBtnText}>👤 Voir la numérologie de mes contacts</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Modal Aide ── */}
      <Modal visible={helpVisible} transparent animationType="fade" onRequestClose={() => setHelpVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setHelpVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comment fonctionne la numérologie ? 🔢</Text>
              <TouchableOpacity onPress={() => setHelpVisible(false)}>
                <Text style={[styles.modalClose, { color: C.primary }]}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {[
                {
                  t: 'Le calcul',
                  b: "Chaque lettre est convertie en chiffre (A=1, B=2... I=9 puis on recommence). Les chiffres sont additionnés jusqu'à obtenir 1-9, sauf 11 et 22 (nombres maîtres).",
                },
                {
                  t: 'Exemple JEAN',
                  b: "J=1, E=5, A=1, N=5 → 1+5+1+5 = 12 → 1+2 = 3 — Le Créatif",
                },
                {
                  t: 'Le chiffre vibratoire',
                  b: "Révèle la personnalité profonde et l'énergie vibratoire. Chaque chiffre a un nom et une couleur associés.",
                },
                {
                  t: 'Le chiffre d\'expression',
                  b: "Calculé à partir du prénom ET du nom de famille — révèle la mission de vie et le potentiel global.",
                },
                {
                  t: 'Le chemin de vie',
                  b: "Calculé depuis la date de naissance complète en additionnant tous ses chiffres. Le plus important — révèle la mission profonde, les talents naturels et les défis à surmonter.",
                },
                {
                  t: 'Bon à savoir 💡',
                  b: "Les accents sont ignorés (José = JOSE). Les prénoms composés sont calculés comme un seul prénom en ignorant le trait d'union !",
                },
              ].map(({ t, b }) => (
                <View key={t} style={styles.modalSection}>
                  <Text style={[styles.modalSectionTitle, { color: C.primary }]}>{t}</Text>
                  <Text style={styles.modalSectionBody}>{b}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// ── Composant détail calcul ───────────────────────────────────────────────────

const LETTER_VALUES: Record<string, number> = {
  A:1,J:1,S:1, B:2,K:2,T:2, C:3,L:3,U:3, D:4,M:4,V:4, E:5,N:5,W:5,
  F:6,O:6,X:6, G:7,P:7,Y:7, H:8,Q:8,Z:8, I:9,R:9,
};

function normalize(c: string): string {
  return c.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
}

/**
 * Retourne les étapes de réduction d'un nombre.
 * Ex: 12  → ["1+2 = 3"]
 *     28  → ["2+8 = 10", "1+0 = 1"]
 *     11  → []  (nombre maître — pas de réduction)
 *     4   → []  (déjà chiffre unique)
 */
function reductionSteps(n: number): string[] {
  if (n < 10 || n === 11 || n === 22) return [];
  const steps: string[] = [];
  let current = n;
  while (current >= 10 && current !== 11 && current !== 22) {
    const digits = String(current).split('');
    const next = digits.reduce((acc, d) => acc + parseInt(d, 10), 0);
    steps.push(`${digits.join('+')} = ${next}`);
    current = next;
  }
  return steps;
}

function CalcDetail({ label, text }: { label: string; text: string }) {
  const letters = text.split('').map(normalize).filter((c) => LETTER_VALUES[c] !== undefined);
  const sum = letters.reduce((acc, c) => acc + LETTER_VALUES[c], 0);
  const steps = reductionSteps(sum);

  return (
    <View style={{ gap: 3 }}>
      <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 12, color: Colors.onSurface }}>{label}</Text>
      {/* Ligne 1 : somme des lettres */}
      <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18 }}>
        {letters.map((l) => `${l}=${LETTER_VALUES[l]}`).join(' + ')}{' '}={' '}{sum}
      </Text>
      {/* Lignes de réduction */}
      {steps.map((step, i) => (
        <Text
          key={i}
          style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18, paddingLeft: 8 }}
        >
          {'→ '}{i < steps.length - 1
            ? step
            : <Text>{steps[i].split(' = ')[0]}{' = '}<Text style={{ fontFamily: 'BeVietnamPro_700Bold', color: Colors.onSurface }}>{steps[i].split(' = ')[1]}</Text></Text>
          }
        </Text>
      ))}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container:    { flex: 1, backgroundColor: Colors.background },
    header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing[4], paddingVertical: Spacing[3], gap: 8 },
    backBtn:      { padding: 4 },
    backBtnText:  { fontSize: 28, color: C.primary, fontFamily: 'BeVietnamPro_700Bold', lineHeight: 32 },
    headerTitle:  { flex: 1, fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xl, color: Colors.onSurface, textAlign: 'center' },
    helpBtn:      { padding: 4 },
    helpBtnText:  { fontSize: 20 },
    content:      { paddingHorizontal: Spacing[4], gap: 16, paddingTop: Spacing[2], paddingBottom: 40 },

    formCard: {
      backgroundColor: Colors.white, borderRadius: Radii.xl,
      padding: Spacing[4], gap: 6, ...Shadows.sm,
    },
    formLabel:    { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: Colors.onSurface },
    optionalLabel:{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant },
    input: {
      borderWidth: 1.5, borderColor: Colors.outline,
      borderRadius: Radii.lg, paddingHorizontal: 14, paddingVertical: 10,
      fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: Colors.onSurface,
    },
    suggestionsRow: { marginTop: 6 },
    suggestionChip: {
      borderWidth: 1.5, borderRadius: Radii.full,
      paddingHorizontal: 12, paddingVertical: 5, marginRight: 8,
    },
    suggestionText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },

    summaryCard: {
      backgroundColor: Colors.white, borderRadius: Radii.xl,
      padding: Spacing[4], gap: 12, alignItems: 'center', ...Shadows.sm,
    },
    summaryTitle: { fontFamily: 'BeVietnamPro_800ExtraBold', fontSize: Typography['2xl'], color: Colors.onSurface },
    summaryBadges:{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },

    numberBadge: {
      borderWidth: 2, borderRadius: Radii.xl,
      paddingHorizontal: 16, paddingVertical: 8,
      alignItems: 'center', minWidth: 72,
    },
    numberBadgeNum:   { fontFamily: 'BeVietnamPro_800ExtraBold', fontSize: 28 },
    numberBadgeLabel: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, marginTop: 2 },

    calcDetailBtn:     { marginTop: 4 },
    calcDetailBtnText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
    calcDetail:        { width: '100%', gap: 6, backgroundColor: Colors.background, borderRadius: Radii.lg, padding: 12 },
    calcRow:           { gap: 2 },
    calcRowLabel:      { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs, color: Colors.onSurface },
    calcRowValue:      { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant, lineHeight: 18 },

    profileCard: {
      backgroundColor: Colors.white, borderRadius: Radii.xl,
      padding: Spacing[4], gap: 12, borderLeftWidth: 4, ...Shadows.sm,
    },
    profileCardHeader:{ flexDirection: 'row', gap: 12, alignItems: 'center' },
    profileBigBadge:  { borderWidth: 2, borderRadius: 16, width: 60, height: 60, alignItems: 'center', justifyContent: 'center' },
    profileBigNum:    { fontFamily: 'BeVietnamPro_800ExtraBold', fontSize: 26 },
    profileCardTitle: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant },
    profileCardName:  { fontFamily: 'BeVietnamPro_800ExtraBold', fontSize: Typography.xl },
    keywordsRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    keywordChip:      { borderRadius: Radii.full, paddingHorizontal: 10, paddingVertical: 4 },
    keywordText:      { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs },
    profileDesc:      { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurface, lineHeight: 22 },

    lifePathExplainCard: {
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      padding: Spacing[4],
      gap: 14,
      borderLeftWidth: 4,
      borderLeftColor: '#9b6bb5',
      ...Shadows.sm,
    },
    lifePathExplainTitle: {
      fontFamily: 'BeVietnamPro_800ExtraBold',
      fontSize: Typography.base,
      marginBottom: 2,
    },
    lifePathExplainRows:  { gap: 12 },
    lifePathExplainRow:   { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
    lifePathExplainIcon:  { fontSize: 17, marginTop: 2 },
    lifePathExplainLabel: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.sm,
      color: Colors.onSurface,
      marginBottom: 3,
    },
    lifePathExplainBody: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurface,
      lineHeight: 20,
    },

    explainCard:   { borderRadius: Radii.xl, padding: Spacing[4], gap: 10 },
    explainTitle:  { fontFamily: 'BeVietnamPro_800ExtraBold', fontSize: Typography.base },
    explainRows:   { gap: 8 },
    explainRow:    { flexDirection: 'row', gap: 8 },
    explainNum:    { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.onSurface, width: 20 },
    explainText:   { flex: 1, fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurface, lineHeight: 20 },

    resetBtn: {
      borderWidth: 1.5, borderRadius: Radii.full,
      paddingVertical: 12, alignItems: 'center',
    },
    resetBtnText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },

    contactsBtn: {
      borderRadius: Radii.full, paddingVertical: 14,
      alignItems: 'center', ...Shadows.sm,
    },
    contactsBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.white },

    // Modal aide
    modalOverlay:  { flex: 1, backgroundColor: '#0006', justifyContent: 'flex-end' },
    modalContent:  { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing[5], maxHeight: '80%' },
    modalHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    modalTitle:    { fontFamily: 'BeVietnamPro_800ExtraBold', fontSize: Typography.lg, color: Colors.onSurface, flex: 1, marginRight: 8 },
    modalClose:    { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
    modalSection:  { marginBottom: 14 },
    modalSectionTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, marginBottom: 4 },
    modalSectionBody:  { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurface, lineHeight: 20 },
  });
}
