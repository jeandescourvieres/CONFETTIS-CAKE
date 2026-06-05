// ═══════════════════════════════════════════════════════════════════
//  Confettis & Cake — Sélection du mode à la première connexion
// ═══════════════════════════════════════════════════════════════════

import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const HOME_MODE_KEY       = 'cc_home_mode';
const FEATURES_INTRO_KEY  = 'cc_features_intro_v1_seen';

const APPRENTISSAGE_COLOR = '#7C3AED';
const COMPLET_COLOR       = '#F97316';

function CheckItem({ text, color }: { text: string; color: string }) {
  return (
    <View style={styles.checkRow}>
      <View style={[styles.checkCircle, { backgroundColor: color + '20', borderColor: color }]}>
        <Text style={[styles.checkIcon, { color }]}>✓</Text>
      </View>
      <Text style={styles.checkText}>{text}</Text>
    </View>
  );
}

export default function FeaturesIntroScreen() {
  const router = useRouter();

  useEffect(() => {
    // Si le mode est déjà choisi, passe directement à l'app
    SecureStore.getItemAsync(HOME_MODE_KEY).then(async (val) => {
      if (val === 'simple' || val === 'advanced') {
        await SecureStore.setItemAsync(FEATURES_INTRO_KEY, 'seen');
        router.replace('/(app)' as never);
      }
    });
  }, []);

  const choose = async (mode: 'simple' | 'advanced') => {
    await Promise.all([
      SecureStore.setItemAsync(HOME_MODE_KEY, mode),
      SecureStore.setItemAsync(FEATURES_INTRO_KEY, 'seen'),
    ]);
    router.replace('/(app)' as never);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* En-tête */}
        <Text style={styles.title}>Bienvenue dans ConfettiCake ! 👋</Text>
        <Text style={styles.subtitle}>Choisis ton expérience{'\n'}pour commencer</Text>

        {/* ── Carte Mode Apprentissage ── */}
        <View style={[styles.card, styles.cardAppr]}>
          <Text style={styles.cardEmoji}>🍬</Text>
          <Text style={styles.cardMode}>Mode</Text>
          <Text style={[styles.cardTitle, { color: APPRENTISSAGE_COLOR }]}>Apprentissage</Text>
          <Text style={[styles.cardTagline, { color: APPRENTISSAGE_COLOR + 'BB' }]}>Simplifié et guidé</Text>
          <Text style={styles.cardDesc}>
            {"L'essentiel pour découvrir l'application pas à pas et avancer à ton rythme."}
          </Text>
          <View style={styles.checks}>
            <CheckItem text="Interface épurée"  color={APPRENTISSAGE_COLOR} />
            <CheckItem text="Fonctions clés"    color={APPRENTISSAGE_COLOR} />
            <CheckItem text="Parcours guidé"    color={APPRENTISSAGE_COLOR} />
          </View>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: APPRENTISSAGE_COLOR }]}
            onPress={() => choose('simple')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Choisir ce mode</Text>
          </TouchableOpacity>
        </View>

        {/* ── Carte Mode Complet ── */}
        <View style={[styles.card, styles.cardComplet]}>
          <Text style={styles.cardEmoji}>🎉</Text>
          <Text style={styles.cardMode}>Mode</Text>
          <Text style={[styles.cardTitle, { color: COMPLET_COLOR }]}>Complet</Text>
          <Text style={[styles.cardTagline, { color: COMPLET_COLOR + 'BB' }]}>Pour aller plus loin</Text>
          <Text style={styles.cardDesc}>
            {"Accède à toutes les fonctionnalités et crée sans limites."}
          </Text>
          <View style={styles.checks}>
            <CheckItem text="Toutes les fonctionnalités"  color={COMPLET_COLOR} />
            <CheckItem text="Personnalisation avancée"    color={COMPLET_COLOR} />
            <CheckItem text="Plus de possibilités"        color={COMPLET_COLOR} />
          </View>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: COMPLET_COLOR }]}
            onPress={() => choose('advanced')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Choisir ce mode</Text>
          </TouchableOpacity>
        </View>

        {/* Note de bas de page */}
        <View style={styles.footer}>
          <Text style={styles.footerIcon}>🔄</Text>
          <Text style={styles.footerText}>
            Tu pourras changer de mode à tout moment dans les paramètres.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F6FF' },
  scroll: { paddingHorizontal: 20, paddingBottom: 32, paddingTop: 16 },

  title: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 26,
    color: '#1A0A3C',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },

  card: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardAppr:    { backgroundColor: '#F3EFFF' },
  cardComplet: { backgroundColor: '#FFF7ED' },

  cardEmoji: { fontSize: 38, marginBottom: 6 },
  cardMode: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 12,
    color: '#9CA3AF',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  cardTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 24,
    marginBottom: 3,
  },
  cardTagline: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 13,
    marginBottom: 8,
  },
  cardDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 10,
  },
  checks: { width: '100%', gap: 7, marginBottom: 14 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkCircle: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  checkIcon: { fontSize: 11, fontFamily: 'BeVietnamPro_700Bold' },
  checkText: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },

  btn: {
    width: '100%',
    paddingVertical: 11,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  btnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    color: '#fff',
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#EDE9FE',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  footerIcon: { fontSize: 16 },
  footerText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    color: '#6B21A8',
    lineHeight: 19,
    flex: 1,
  },
});
