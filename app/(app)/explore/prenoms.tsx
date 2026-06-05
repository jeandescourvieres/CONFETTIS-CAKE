// ═══════════════════════════════════════════════════════════════════
//  Confettis & Cake — Explorer les prénoms (Phase 5)
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Share,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import Svg, { Polyline, Circle, Line, Text as SvgText } from 'react-native-svg';
import { supabase } from '../../../src/services/supabase';
import { Colors, Typography, Spacing, Radii } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { NAME_MEANINGS } from '../../../src/utils/nameMeanings';
import { calcNumerology, getNumerologyProfile } from '../../../src/utils/numerology';
import { FeatureIntroCard } from '../../../src/components/ui/FeatureIntroCard';

const SCREEN_W = Dimensions.get('window').width;

const SUGGESTIONS = ['Emma', 'Lucas', 'Jade', 'Léo', 'Anaïs', 'Théo', 'Chloé', 'Noah'];

function withTimeout<T>(promise: Promise<T>, ms = 12000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms)
    ),
  ]);
}

export default function ExplorePrenoms() {
  const router = useRouter();
  const { initialPrenom } = useLocalSearchParams<{ initialPrenom?: string }>();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [meaning, setMeaning] = useState<string | null>(null);
  const [currentName, setCurrentName] = useState<string | null>(null);
  const [helpVisible, setHelpVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // INSEE popularité
  type InseePoint = { year: number; count: number };
  const [inseeData, setInseeData] = useState<InseePoint[] | null>(null);
  const [isLoadingInsee, setIsLoadingInsee] = useState(false);
  const [inseeNotFound, setInseeNotFound] = useState(false);
  const [inseeHelpVisible, setInseeHelpVisible] = useState(false);
  const [numHelpVisible, setNumHelpVisible] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<InseePoint | null>(null);
  const [inseePeakYear, setInseePeakYear] = useState<number | null>(null);
  const [inseePeakCount, setInseePeakCount] = useState<number | null>(null);

  const handleLoadInsee = async (name: string) => {
    if (isLoadingInsee) return;
    setInseeData(null);
    setInseeNotFound(false);
    setSelectedPoint(null);
    setIsLoadingInsee(true);
    try {
      const { data } = await withTimeout(supabase.functions.invoke('insee-prenoms', { body: { name } }));
      if (data?.not_found || !data?.data?.length) {
        setInseeNotFound(true);
      } else {
        setInseeData(data.data);
        setInseePeakYear(data.peak_year ?? null);
        setInseePeakCount(data.peak_count ?? null);
      }
    } catch {
      setInseeNotFound(true);
    } finally {
      setIsLoadingInsee(false);
    }
  };

  const handleSearch = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setCurrentName(trimmed);
    setMeaning(null);
    setError(null);
    setInseeData(null);
    setInseeNotFound(false);
    setSelectedPoint(null);
    setIsLoading(true);

    // Lancer la courbe INSEE en parallèle (non-bloquant)
    handleLoadInsee(trimmed);

    // Lookup statique en priorité
    const staticMeaning = NAME_MEANINGS[trimmed] ?? NAME_MEANINGS[trimmed.toLowerCase()] ?? NAME_MEANINGS[trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()];
    if (staticMeaning) {
      setMeaning(staticMeaning);
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await withTimeout(supabase.functions.invoke('name-meaning', { body: { name: trimmed, type: 'prénom' } }));
      setMeaning(data?.meaning ?? 'Signification introuvable pour ce prénom.');
    } catch (e: any) {
      if (e?.message === 'timeout') {
        setError('Service temporairement indisponible — réessaie dans quelques secondes 🔄');
      } else {
        setError('Impossible de charger la signification pour le moment.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialPrenom) handleSearch(initialPrenom);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrenom]);

  const handleShare = async () => {
    if (!currentName || !meaning) return;
    const numProfile = getNumerologyProfile(calcNumerology(currentName));
    const text = `✨ Le prénom ${currentName}\n\n${meaning}\n\n🔢 Numérologie : ${numProfile.number} — ${numProfile.name}\n${numProfile.keywords.join(' · ')}\n\nVia ConfettiCake 🎂`;
    await Share.share({ message: text });
  };

  // Numérologie du prénom recherché
  const numProfile = currentName ? getNumerologyProfile(calcNumerology(currentName)) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {/* Topbar */}
        <View style={styles.topbar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
            <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
          </TouchableOpacity>
          <Text style={styles.topbarTitle}>Explorer les prénoms</Text>
          <TouchableOpacity onPress={() => setHelpVisible(true)} style={styles.helpBtn}>
            <Text style={styles.helpBtnText}>ℹ️</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Intro */}
          <FeatureIntroCard
            introText={"Derrière chaque prénom se cache un monde 🌟 Origine, histoire, signification, traits de caractère, personnalités célèbres... mais aussi une vibration numérologique unique qui révèle une facette cachée de la personnalité 🔢 Tape n'importe quel prénom et laisse-toi surprendre par la richesse de ce qui se cache derrière un prénom qui accompagne une personne toute sa vie ✨"}
            modeEmploiLines={[
              "🔍 Saisis n'importe quel prénom et appuie sur Découvrir",
              "📖 Consulte la fiche complète : origine, langue, genre, date de fête, signification, traits, célébrités",
              "📊 Fais défiler pour voir la courbe de popularité depuis 1900 (données INSEE)",
              "🔢 Découvre la signification numérologique du prénom",
              "💫 Partage la fiche via le bouton Partager",
              "🌸 Suggestions : Emma, Lucas, Jade, Léo, Anaïs, Théo",
            ]}
          />

          {/* Barre de recherche */}
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Saisir un prénom..."
              placeholderTextColor={Colors.outlineVariant}
              autoCapitalize="words"
              returnKeyType="search"
              onSubmitEditing={() => handleSearch(query)}
            />
            <TouchableOpacity
              style={[styles.searchBtn, { backgroundColor: C.primary }]}
              onPress={() => handleSearch(query)}
              disabled={isLoading || !query.trim()}
              activeOpacity={0.85}
            >
              {isLoading
                ? <ActivityIndicator size="small" color={Colors.white} />
                : <Text style={styles.searchBtnText}>Découvrir</Text>}
            </TouchableOpacity>
          </View>

          {/* Suggestions */}
          {!currentName && (
            <>
              <Text style={styles.suggestionsLabel}>Suggestions</Text>
              <View style={styles.suggestionsRow}>
                {SUGGESTIONS.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.suggestionChip, { borderColor: C.primaryContainer }]}
                    onPress={() => handleSearch(s)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.suggestionText, { color: C.primary }]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Erreur */}
          {error && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

          {/* Résultat */}
          {currentName && !isLoading && meaning && (
            <>
              {/* En-tête du prénom */}
              <View style={[styles.nameHeader, { backgroundColor: C.primaryContainer }]}>
                <Text style={[styles.nameHeaderText, { color: C.primary }]}>{currentName}</Text>
                <TouchableOpacity onPress={handleShare} style={[styles.shareBtn, { borderColor: C.primary }]}>
                  <Text style={[styles.shareBtnText, { color: C.primary }]}>Partager 💫</Text>
                </TouchableOpacity>
              </View>

              {/* Signification */}
              <View style={styles.meaningCard}>
                <Text style={styles.meaningTitle}>📖 Origine & Signification</Text>
                <Text style={styles.meaningText}>{meaning}</Text>
              </View>

              {/* Numérologie — intro */}
              {numProfile && (
                <FeatureIntroCard
                  introText={"Et si les lettres de ce prénom en disaient plus long que tu ne le crois ? 🤔 La numérologie attribue une valeur numérique à chaque lettre et révèle à travers un chiffre unique la personnalité profonde et l'énergie vibratoire de celui qui porte ce prénom 🔢✨"}
                  modeEmploiLines={[
                    "🔢 Le chiffre vibratoire est calculé automatiquement",
                    "✨ Le chiffre s'affiche avec son nom et sa couleur associée (ex : 5 — Le Libre)",
                    "💫 Consulte les traits de caractère et la description détaillée de la personnalité",
                    "🎯 Ajoute le nom de famille pour découvrir aussi le chiffre d'expression 🌟",
                  ]}
                  accentColor={numProfile.color}
                />
              )}

              {/* Numérologie */}
              {numProfile && (
                <View style={[styles.numCard, { borderLeftColor: numProfile.color }]}>
                  <View style={styles.numTitleRow}>
                    <Text style={styles.numTitle}>🔢 Numérologie du prénom</Text>
                    <TouchableOpacity onPress={() => setNumHelpVisible(true)} style={styles.inseeHelpBtn}>
                      <Text style={styles.inseeHelpBtnText}>ℹ️</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.numHeader}>
                    <View style={[styles.numCircle, { backgroundColor: numProfile.color }]}>
                      <Text style={styles.numCircleText}>{numProfile.number}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.numName, { color: numProfile.color }]}>{numProfile.name}</Text>
                      <View style={[styles.numColorPill, { backgroundColor: numProfile.color + '20', borderColor: numProfile.color + '60' }]}>
                        <Text style={[styles.numColorPillText, { color: numProfile.color }]}>{numProfile.colorName}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.numKeywords}>
                    {numProfile.keywords.map((k) => (
                      <View key={k} style={[styles.numKwPill, { borderColor: numProfile.color + '60' }]}>
                        <Text style={[styles.numKwText, { color: numProfile.color }]}>{k}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.numDesc}>{numProfile.description}</Text>
                  <Text style={styles.numNote}>
                    💡 {`J=${1}, E=${5}, A=${1}, N=${5} → 1+5+1+5 = 12 → 1+2 = 3 pour l'exemple JEAN`}
                  </Text>
                </View>
              )}

              {/* ── Courbe de popularité INSEE ────────────────── */}
              <View style={styles.inseeSection}>
                <View style={styles.inseeSectionHeader}>
                  <Text style={styles.inseeSectionTitle}>📊 Popularité depuis 1900</Text>
                  <TouchableOpacity onPress={() => setInseeHelpVisible(true)} style={styles.inseeHelpBtn}>
                    <Text style={styles.inseeHelpBtnText}>ℹ️</Text>
                  </TouchableOpacity>
                </View>

                <FeatureIntroCard
                  introText={"Chaque prénom a son moment de gloire 🌟 Certains ont traversé les siècles, d'autres ont explosé en quelques années avant de disparaître... Découvre l'histoire de popularité de ce prénom en France depuis 1900 grâce aux données officielles de l'INSEE 📊"}
                  modeEmploiLines={[
                    "📊 La courbe s'affiche automatiquement après la fiche du prénom",
                    "📈 Chaque point représente le nombre de naissances par année depuis 1900",
                    "👆 Appuie sur un point pour voir le nombre exact de naissances",
                    "🌟 L'année la plus populaire est automatiquement mise en évidence",
                  ]}
                />

                {isLoadingInsee && (
                  <View style={styles.inseeLoading}>
                    <ActivityIndicator size="small" color={C.primary} />
                    <Text style={[styles.inseeLoadingText, { color: C.primary }]}>Chargement des données INSEE...</Text>
                  </View>
                )}

                {inseeNotFound && !isLoadingInsee && (
                  <View style={styles.inseeEmpty}>
                    <Text style={styles.inseeEmptyText}>
                      {"Ce prénom n'apparaît pas dans les données INSEE. Il peut être très rare, récent, ou avoir une orthographe non répertoriée."}
                    </Text>
                  </View>
                )}

                {inseeData && inseeData.length > 0 && !isLoadingInsee && (() => {
                  const W = SCREEN_W - 32 - 32; // marges
                  const H = 140;
                  const PAD_L = 40;
                  const PAD_R = 10;
                  const PAD_T = 12;
                  const PAD_B = 28;
                  const chartW = W - PAD_L - PAD_R;
                  const chartH = H - PAD_T - PAD_B;

                  const minYear = inseeData[0].year;
                  const maxYear = inseeData[inseeData.length - 1].year;
                  const maxCount = Math.max(...inseeData.map((d) => d.count));

                  const toX = (year: number) => PAD_L + ((year - minYear) / (maxYear - minYear || 1)) * chartW;
                  const toY = (count: number) => PAD_T + chartH - (count / (maxCount || 1)) * chartH;

                  const points = inseeData.map((d) => `${toX(d.year).toFixed(1)},${toY(d.count).toFixed(1)}`).join(' ');

                  // Years to show on X axis (every ~20 years)
                  const xLabels: number[] = [];
                  for (let y = Math.ceil(minYear / 20) * 20; y <= maxYear; y += 20) xLabels.push(y);

                  // Y axis labels
                  const yLabels = [0, Math.round(maxCount / 2), maxCount];

                  return (
                    <View>
                      {inseePeakYear && (
                        <View style={styles.inseePeakBadge}>
                          <Text style={[styles.inseePeakText, { color: C.primary }]}>
                            🏆 Année record : <Text style={{ fontFamily: 'BeVietnamPro_700Bold' }}>{inseePeakYear}</Text>
                            {' '}({inseePeakCount?.toLocaleString('fr-FR')} naissances)
                          </Text>
                        </View>
                      )}
                      <View style={[styles.inseeChart, { width: W, height: H }]}>
                        <Svg width={W} height={H}>
                          {/* Grid lines */}
                          {yLabels.map((v) => (
                            <Line
                              key={v}
                              x1={PAD_L} y1={toY(v)}
                              x2={W - PAD_R} y2={toY(v)}
                              stroke={Colors.surfaceContainerHighest}
                              strokeWidth={1}
                            />
                          ))}
                          {/* Y axis labels */}
                          {yLabels.map((v) => (
                            <SvgText
                              key={`yl-${v}`}
                              x={PAD_L - 4}
                              y={toY(v) + 3}
                              fontSize={8}
                              textAnchor="end"
                              fill={Colors.outlineVariant}
                            >
                              {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                            </SvgText>
                          ))}
                          {/* Line */}
                          <Polyline
                            points={points}
                            fill="none"
                            stroke={C.primary}
                            strokeWidth={2}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                          />
                          {/* Peak dot */}
                          {inseePeakYear && (() => {
                            const p = inseeData.find((d) => d.year === inseePeakYear);
                            if (!p) return null;
                            return (
                              <Circle
                                cx={toX(p.year)}
                                cy={toY(p.count)}
                                r={5}
                                fill={C.primary}
                              />
                            );
                          })()}
                          {/* Selected point */}
                          {selectedPoint && (() => (
                            <Circle
                              cx={toX(selectedPoint.year)}
                              cy={toY(selectedPoint.count)}
                              r={6}
                              fill={Colors.white}
                              stroke={C.primary}
                              strokeWidth={2.5}
                            />
                          ))()}
                          {/* X axis labels */}
                          {xLabels.map((y) => (
                            <SvgText
                              key={`xl-${y}`}
                              x={toX(y)}
                              y={H - 4}
                              fontSize={9}
                              textAnchor="middle"
                              fill={Colors.outlineVariant}
                            >
                              {y}
                            </SvgText>
                          ))}
                        </Svg>
                      </View>

                      {/* Tap points pour sélection */}
                      <View style={[styles.inseeTapOverlay, { width: W, height: H - PAD_B }]}>
                        {inseeData.map((d, i) => {
                          const x = toX(d.year);
                          const y = toY(d.count);
                          return (
                            <TouchableOpacity
                              key={i}
                              style={{ position: 'absolute', left: x - 10, top: y - 10, width: 20, height: 20 }}
                              onPress={() => setSelectedPoint(selectedPoint?.year === d.year ? null : d)}
                              activeOpacity={1}
                            />
                          );
                        })}
                      </View>

                      {selectedPoint && (
                        <View style={[styles.inseeTooltip, { borderColor: C.primary }]}>
                          <Text style={[styles.inseeTooltipText, { color: C.primary }]}>
                            {selectedPoint.year} — <Text style={{ fontFamily: 'BeVietnamPro_700Bold' }}>{selectedPoint.count.toLocaleString('fr-FR')}</Text> naissances
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })()}
              </View>

              {/* ── Partage de carte — intro ──────────────────── */}
              <FeatureIntroCard
                introText={"Tu viens de découvrir quelque chose de beau sur ce prénom ? Ne le garde pas pour toi ! 😊 Transforme la signification d'un prénom en une attention unique et surprends ceux qui le portent 💛✨"}
                modeEmploiLines={[
                  "💫 Appuie sur le bouton Partager ci-dessous",
                  "🎴 Le prénom, sa signification et sa numérologie sont inclus",
                  "📲 Choisis ton appli et envoie !",
                ]}
              />

              {/* Nouveau prénom */}
              <TouchableOpacity
                style={[styles.newSearchBtn, { borderColor: C.primary }]}
                onPress={() => { setCurrentName(null); setMeaning(null); setQuery(''); setError(null); setInseeData(null); setInseeNotFound(false); setSelectedPoint(null); }}
              >
                <Text style={[styles.newSearchText, { color: C.primary }]}>🔍 Rechercher un autre prénom</Text>
              </TouchableOpacity>
            </>
          )}

          {isLoading && (
            <View style={styles.loadingCard}>
              <ActivityIndicator color={C.primary} size="large" />
              <Text style={styles.loadingText}>Exploration en cours...</Text>
            </View>
          )}

          {/* Voir aussi — Explorer les noms */}
          <TouchableOpacity
            style={[styles.seeAlsoBtn, { borderColor: C.primaryContainer, backgroundColor: C.primaryContainer }]}
            activeOpacity={0.8}
            onPress={() => router.push('/(app)/explore/noms' as never)}
          >
            <Text style={[styles.seeAlsoText, { color: C.primary }]}>🌍 Voir aussi : Explorer les noms de famille →</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal aide — Numérologie */}
      <Modal visible={numHelpVisible} transparent animationType="fade" onRequestClose={() => setNumHelpVisible(false)}>
        <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setNumHelpVisible(false)}>
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne la numérologie d'un prénom ? 🔢</Text>
              <TouchableOpacity onPress={() => setNumHelpVisible(false)}><Text style={styles.helpModalClose}>Fermer ✕</Text></TouchableOpacity>
            </View>
            {[
              { title: 'Le calcul', body: "Chaque lettre est convertie en chiffre. Les chiffres sont additionnés jusqu'à obtenir 1-9, sauf 11 et 22 (nombres maîtres)." },
              { title: 'Exemple JEAN', body: "J=1, E=5, A=1, N=5 → 1+5+1+5 = 12 → 1+2 = 3 — Le Créatif" },
              { title: 'Le chiffre vibratoire', body: "Révèle la personnalité profonde. Chaque chiffre a un nom et une couleur associés." },
              { title: 'Le chiffre d\'expression', body: "Ajoute le nom de famille pour calculer le chiffre d'expression — révèle la mission de vie et le potentiel global." },
              { title: 'Bon à savoir 💡', body: "Les accents sont ignorés (José = JOSE). Les prénoms composés sont calculés comme un seul prénom en ignorant le trait d'union !" },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal aide — INSEE */}
      <Modal visible={inseeHelpVisible} transparent animationType="fade" onRequestClose={() => setInseeHelpVisible(false)}>
        <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setInseeHelpVisible(false)}>
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne la courbe de popularité ? 📊</Text>
              <TouchableOpacity onPress={() => setInseeHelpVisible(false)}><Text style={styles.helpModalClose}>Fermer ✕</Text></TouchableOpacity>
            </View>
            {[
              { title: 'Les données INSEE', body: "La courbe est générée à partir des données officielles de l'INSEE qui recensent tous les prénoms donnés en France depuis 1900. C'est la source la plus fiable et la plus complète disponible !" },
              { title: 'Lire la courbe', body: "Chaque point représente le nombre de naissances pour ce prénom cette année-là en France. Plus la courbe est haute, plus le prénom était populaire." },
              { title: 'Explorer les données', body: "Appuie sur n'importe quel point de la courbe pour voir le nombre exact de naissances cette année-là." },
              { title: 'L\'année pic', body: "L'année où le prénom a été le plus donné est automatiquement mise en évidence sur la courbe 🌟" },
              { title: 'Bon à savoir 💡', body: "Si le prénom n'apparaît pas dans les données INSEE, un message t'en informe. Cela peut arriver pour les prénoms très rares ou très récents !" },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal aide */}
      <Modal visible={helpVisible} transparent animationType="fade" onRequestClose={() => setHelpVisible(false)}>
        <TouchableOpacity
          style={styles.helpModalOverlay}
          activeOpacity={1}
          onPress={() => setHelpVisible(false)}
        >
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne Explorer les prénoms ? 🌟</Text>
              <TouchableOpacity onPress={() => setHelpVisible(false)}>
                <Text style={styles.helpModalClose}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            {[
              { title: 'Rechercher un prénom', body: "Saisis n'importe quel prénom dans le champ de recherche et appuie sur Découvrir. Tu peux aussi appuyer sur l'une des suggestions pour démarrer rapidement." },
              { title: 'La fiche complète', body: "Pour chaque prénom tu découvres son origine, sa langue, son genre, sa date de fête, sa signification poétique, ses traits de caractère, ses personnalités célèbres et une anecdote." },
              { title: 'La courbe de popularité', body: "Fais défiler vers le bas pour voir comment le prénom a évolué en France depuis 1900 grâce aux données officielles de l'INSEE 📊" },
              { title: 'La numérologie', body: "Découvre la vibration numérologique du prénom — son chiffre, sa couleur et ce qu'il révèle de la personnalité 🔢" },
              { title: 'Partager', body: "Appuie sur le bouton Partager pour générer une jolie carte avec le prénom et sa signification et l'envoyer à tes proches 💛" },
              { title: 'Bon à savoir 💡', body: "Tu peux rechercher n'importe quel prénom — français, étranger, composé... Confetticake gère tous les prénoms en alphabet latin !" },
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

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

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
  topbarTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: Colors.onSurface },
  helpBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: C.primaryContainer },
  helpBtnText: { fontSize: 18 },

  content: { padding: Spacing[4], gap: Spacing[3] },

  introCard: {
    borderLeftWidth: 3,
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.md,
    padding: 12,
  },
  introText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 20,
  },

  searchBar: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    paddingHorizontal: 14,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurface,
  },
  searchBtn: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },

  suggestionsLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    backgroundColor: Colors.white,
  },
  suggestionText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
  },

  errorCard: {
    backgroundColor: '#FFF3F3',
    borderRadius: Radii.md,
    padding: 12,
    borderWidth: 0.5,
    borderColor: '#FFCDD2',
  },
  errorText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: '#C62828',
  },

  nameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Radii.xl,
    paddingVertical: 16,
    paddingHorizontal: Spacing[4],
  },
  nameHeaderText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 28,
  },
  shareBtn: {
    borderWidth: 1.5,
    borderRadius: Radii.full,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  shareBtnText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
  },

  meaningCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    borderWidth: 0.5,
    borderColor: Colors.surfaceContainerHighest,
    padding: 14,
    gap: 8,
  },
  meaningTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  meaningText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurface,
    lineHeight: 24,
  },

  // Numérologie
  numCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    borderLeftWidth: 4,
    borderWidth: 0.5,
    borderColor: Colors.surfaceContainerHighest,
    padding: 14,
    gap: 10,
  },
  numTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  numTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  numHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  numCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  numCircleText: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 22, color: Colors.white },
  numName: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.md, marginBottom: 4 },
  numColorPill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: Radii.full,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  numColorPillText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs },
  numKeywords: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  numKwPill: {
    borderWidth: 1,
    borderRadius: Radii.full,
    paddingVertical: 3,
    paddingHorizontal: 10,
    backgroundColor: Colors.surfaceContainerLow,
  },
  numKwText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs },
  numDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 22,
  },
  numNote: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
  },

  newSearchBtn: {
    borderWidth: 1.5,
    borderRadius: Radii.lg,
    padding: 12,
    alignItems: 'center',
  },
  newSearchText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
  },

  seeAlsoBtn: {
    borderRadius: Radii.md,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
  },
  seeAlsoText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
  },

  loadingCard: {
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  loadingText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },

  // Modal
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

  // ── INSEE Chart ────────────────��───────────────────────────────────────────
  inseeSection: { gap: 10 },
  inseeSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inseeSectionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  inseeHelpBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  inseeHelpBtnText: { fontSize: 15, lineHeight: 18 },
  inseeIntroCard: {
    borderLeftWidth: 3,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.md,
    padding: 10,
  },
  inseeIntroText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  inseeLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
  },
  inseeLoadingText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
  },
  inseeEmpty: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radii.md,
    padding: 12,
  },
  inseeEmptyText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
  },
  inseePeakBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radii.full,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  inseePeakText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
  },
  inseeChart: {
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.surfaceContainerHighest,
  },
  inseeTapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  inseeTooltip: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  inseeTooltipText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
  },

  // ── Partage de carte ────────���───────────────────────────────────────────────
  shareIntroCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: 12,
    gap: 4,
  },
  shareIntroText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  });
}
