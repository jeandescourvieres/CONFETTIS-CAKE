// ═══════════════════════════════════════════════════════════════
//  Confettis & Cake — Explorer les noms de famille (Phase 4)
// ═══════════════════════════════════════════════════════════════

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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../../../src/services/supabase';
import { Colors, Typography, Spacing, Radii } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { calcNumerology, getNumerologyProfile } from '../../../src/utils/numerology';
import { FeatureIntroCard } from '../../../src/components/ui/FeatureIntroCard';

const SUGGESTIONS = ['Martin', 'Dupont', 'Bernard', 'Moreau', 'Petit', 'Durand', 'Leroy', 'Simon'];

export default function ExploreNoms() {
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [meaning, setMeaning] = useState<string | null>(null);
  const [currentName, setCurrentName] = useState<string | null>(null);
  const [helpVisible, setHelpVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setCurrentName(trimmed);
    setMeaning(null);
    setError(null);
    setIsLoading(true);

    try {
      const { data } = await supabase.functions.invoke('name-meaning', {
        body: { name: trimmed, type: 'nom de famille' },
      });
      setMeaning(data?.meaning ?? 'Signification introuvable pour ce nom de famille.');
    } catch {
      setError('Impossible de charger la signification pour le moment.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!currentName || !meaning) return;
    const numProfile = getNumerologyProfile(calcNumerology(currentName));
    const text = `🌍 Le nom ${currentName}\n\n${meaning}\n\n🔢 Numérologie : ${numProfile.number} — ${numProfile.name}\n${numProfile.keywords.join(' · ')}\n\nVia ConfettiCake 🎂`;
    await Share.share({ message: text });
  };

  const numProfile = currentName ? getNumerologyProfile(calcNumerology(currentName)) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>

        {/* Topbar */}
        <View style={styles.topbar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.topbarTitle}>Explorer les noms</Text>
          <TouchableOpacity onPress={() => setHelpVisible(true)} style={styles.helpBtn}>
            <Text style={styles.helpBtnText}>ℹ️</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Intro */}
          <FeatureIntroCard
            introText={"Ton nom de famille t'accompagne depuis ta naissance et pourtant... sais-tu vraiment d'où il vient ? 🤔 Un nom de famille c'est bien plus qu'une simple étiquette 💛 C'est un héritage transmis de génération en génération, un morceau d'histoire familiale qui traverse les siècles. Chaque nom est une pièce unique du puzzle de l'histoire 🌍 Certains viennent d'un lieu, d'autres d'un métier, d'une caractéristique physique... Explore et découvre l'histoire fascinante qui se cache derrière le tien ✨"}
            modeEmploiLines={[
              "🔍 Saisis n'importe quel nom de famille et appuie sur Découvrir",
              "📖 Découvre : origine géographique, étymologie, signification, variantes, anecdote historique",
              "🔢 Consulte aussi la signification numérologique du nom",
              "💫 Partage la fiche avec tes proches en un tap",
              "🌍 Suggestions : Martin, Dupont, Bernard, Moreau, Petit, Durand",
            ]}
          />

          {/* Barre de recherche */}
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Saisir un nom de famille..."
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
              {/* En-tête */}
              <View style={[styles.nameHeader, { backgroundColor: C.primaryContainer }]}>
                <Text style={[styles.nameHeaderText, { color: C.primary }]}>{currentName}</Text>
                <TouchableOpacity onPress={handleShare} style={[styles.shareBtn, { borderColor: C.primary }]}>
                  <Text style={[styles.shareBtnText, { color: C.primary }]}>Partager 💫</Text>
                </TouchableOpacity>
              </View>

              {/* Étymologie & histoire */}
              <View style={styles.meaningCard}>
                <Text style={styles.meaningTitle}>🌍 Origine & Étymologie</Text>
                <Text style={styles.meaningText}>{meaning}</Text>
              </View>

              {/* Numérologie — intro */}
              {numProfile && (
                <FeatureIntroCard
                  introText={"Et si les lettres de ce nom de famille en disaient plus long que tu ne le crois ? 🤔 La numérologie révèle à travers un chiffre unique l'héritage familial et les influences inconscientes transmises de génération en génération 🔢✨"}
                  modeEmploiLines={[
                    "🔢 Le chiffre vibratoire du nom est calculé automatiquement",
                    "✨ Le chiffre s'affiche avec son nom et sa couleur associée",
                    "💫 Consulte les traits de caractère et l'héritage familial associé",
                    "🎯 Ajoute le prénom pour découvrir aussi le chiffre d'expression 🌟",
                  ]}
                  accentColor={numProfile.color}
                />
              )}

              {/* Numérologie */}
              {numProfile && (
                <View style={[styles.numCard, { borderLeftColor: numProfile.color }]}>
                  <Text style={styles.numTitle}>🔢 Numérologie du nom</Text>
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
                    {`💡 Révèle l'héritage familial et les influences inconscientes transmises de génération en génération`}
                  </Text>
                </View>
              )}

              {/* Partage de carte — intro */}
              <FeatureIntroCard
                introText={"Tu viens de découvrir quelque chose de fascinant sur ce nom de famille ? Ne le garde pas pour toi ! 😊 Partage cette fiche avec tes proches en un tap — un cadeau unique qui célèbre leur héritage familial 💛✨"}
                modeEmploiLines={[
                  "💫 Appuie sur le bouton Partager ci-dessus",
                  "🌍 Le nom, son origine, son étymologie et sa numérologie sont inclus",
                  "📲 Choisis ton appli et envoie !",
                ]}
              />

              {/* Nouveau nom */}
              <TouchableOpacity
                style={[styles.newSearchBtn, { borderColor: C.primary }]}
                onPress={() => { setCurrentName(null); setMeaning(null); setQuery(''); setError(null); }}
              >
                <Text style={[styles.newSearchText, { color: C.primary }]}>🔍 Rechercher un autre nom</Text>
              </TouchableOpacity>
            </>
          )}

          {isLoading && (
            <View style={styles.loadingCard}>
              <ActivityIndicator color={C.primary} size="large" />
              <Text style={styles.loadingText}>Exploration en cours...</Text>
            </View>
          )}

          {/* Voir aussi — Explorer les prénoms */}
          <TouchableOpacity
            style={[styles.seeAlsoBtn, { borderColor: C.primaryContainer, backgroundColor: C.primaryContainer }]}
            activeOpacity={0.8}
            onPress={() => router.push('/(app)/explore/prenoms' as never)}
          >
            <Text style={[styles.seeAlsoText, { color: C.primary }]}>🌟 Voir aussi : Explorer les prénoms →</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal aide */}
      <Modal visible={helpVisible} transparent animationType="fade" onRequestClose={() => setHelpVisible(false)}>
        <TouchableOpacity
          style={styles.helpModalOverlay}
          activeOpacity={1}
          onPress={() => setHelpVisible(false)}
        >
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne Explorer les noms ? 🌍</Text>
              <TouchableOpacity onPress={() => setHelpVisible(false)}>
                <Text style={styles.helpModalClose}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            {[
              { title: 'Rechercher un nom', body: "Saisis n'importe quel nom de famille dans le champ de recherche et appuie sur Découvrir. Tu peux aussi appuyer sur l'une des suggestions pour démarrer rapidement." },
              { title: 'La fiche complète', body: "Pour chaque nom tu découvres son origine géographique, son étymologie, sa signification, ses variantes orthographiques et une anecdote historique fascinante." },
              { title: 'La numérologie', body: "Découvre la vibration numérologique du nom — son chiffre, sa couleur et ce qu'il révèle de l'héritage familial 🔢" },
              { title: 'Partager', body: "Appuie sur le bouton Partager pour envoyer la fiche du nom à tes proches en un tap 💛" },
              { title: 'Bon à savoir 💡', body: "Tu peux rechercher n'importe quel nom de famille — français, étranger... Confetticake gère tous les noms en alphabet latin !" },
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
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing[4], paddingVertical: 12,
    borderBottomWidth: 0.5, borderBottomColor: C.primaryContainer,
    backgroundColor: Colors.surfaceContainerLow,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primaryContainer },
  backBtnText: { fontSize: 34, color: C.primary, lineHeight: 38 },
  topbarTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: Colors.onSurface },
  helpBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: C.primaryContainer },
  helpBtnText: { fontSize: 18 },

  content: { padding: Spacing[4], gap: Spacing[3] },

  introCard: {
    borderLeftWidth: 3, backgroundColor: C.primaryContainer,
    borderRadius: Radii.md, padding: 12,
  },
  introText: {
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm,
    color: Colors.onSurface, lineHeight: 20,
  },

  searchBar: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  searchInput: {
    flex: 1, height: 48, backgroundColor: Colors.white,
    borderRadius: Radii.lg, borderWidth: 1.5, borderColor: Colors.outlineVariant,
    paddingHorizontal: 14, fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base, color: Colors.onSurface,
  },
  searchBtn: {
    height: 48, paddingHorizontal: 16, borderRadius: Radii.lg,
    alignItems: 'center', justifyContent: 'center',
  },
  searchBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: Colors.white },

  suggestionsLabel: {
    fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs,
    textTransform: 'uppercase', letterSpacing: 1, color: Colors.onSurfaceVariant,
  },
  suggestionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  suggestionChip: {
    paddingVertical: 6, paddingHorizontal: 14,
    borderRadius: Radii.full, borderWidth: 1,
    backgroundColor: Colors.white,
  },
  suggestionText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },

  errorCard: {
    backgroundColor: '#FFE4E4', borderRadius: Radii.md, padding: 14,
    borderWidth: 0.5, borderColor: Colors.error,
  },
  errorText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.error },

  nameHeader: {
    borderRadius: Radii.xl, padding: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  nameHeaderText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 32 },
  shareBtn: {
    paddingVertical: 7, paddingHorizontal: 14,
    borderRadius: Radii.full, borderWidth: 1.5,
  },
  shareBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm },

  meaningCard: {
    backgroundColor: Colors.white, borderRadius: Radii.lg,
    padding: Spacing[4], borderWidth: 0.5, borderColor: C.primaryContainer,
  },
  meaningTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl,
    color: Colors.onSurface, marginBottom: 10,
  },
  meaningText: {
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md,
    color: Colors.onSurface, lineHeight: 24,
  },

  numCard: {
    backgroundColor: Colors.white, borderRadius: Radii.lg,
    padding: Spacing[4], borderLeftWidth: 4,
    borderWidth: 0.5, borderColor: C.primaryContainer,
    gap: 12,
  },
  numTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: Colors.onSurface },
  numHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  numCircle: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
  },
  numCircleText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 24, color: '#fff' },
  numName: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl },
  numColorPill: {
    paddingVertical: 3, paddingHorizontal: 10,
    borderRadius: Radii.full, borderWidth: 1,
    alignSelf: 'flex-start', marginTop: 4,
  },
  numColorPillText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs },
  numKeywords: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  numKwPill: {
    paddingVertical: 4, paddingHorizontal: 10,
    borderRadius: Radii.full, borderWidth: 1,
    backgroundColor: Colors.white,
  },
  numKwText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs },
  numDesc: {
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md,
    color: Colors.onSurface, lineHeight: 22,
  },
  numNote: {
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs,
    color: Colors.onSurfaceVariant, fontStyle: 'italic', lineHeight: 18,
  },

  newSearchBtn: {
    paddingVertical: 13, borderRadius: Radii.full,
    borderWidth: 1.5, alignItems: 'center',
  },
  newSearchText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md },

  seeAlsoBtn: {
    borderRadius: Radii.md, borderWidth: 1, padding: 12, alignItems: 'center',
  },
  seeAlsoText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },

  loadingCard: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: Spacing[8], gap: 16,
  },
  loadingText: {
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
  },

  helpModalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center', padding: 20,
  },
  helpModalCard: {
    width: '100%', maxHeight: '80%',
    backgroundColor: Colors.white, borderRadius: Radii.xl,
    padding: 20, gap: 16,
  },
  helpModalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  helpModalTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'],
    color: Colors.onSurface, flex: 1, marginRight: 8,
  },
  helpModalClose: {
    fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: C.primary,
  },
  helpModalSection: { gap: 4 },
  helpModalSectionTitle: {
    fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: C.primary,
  },
  helpModalSectionBody: {
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm,
    color: Colors.onSurfaceVariant, lineHeight: 20,
  },
  shareIntroCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: 12,
  },
  shareIntroText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  });
}
