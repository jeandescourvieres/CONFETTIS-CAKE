import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../src/stores/authStore';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { useColors } from '../../src/hooks/useColors';

// ── Navigation grid ────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { emoji: '📅', label: 'Calendrier',       route: '/(app)/calendar'       },
  { emoji: '✉️', label: 'Créations',         route: '/(app)/creations'      },
  { emoji: '👥', label: 'Contacts',          route: '/(app)/contacts'       },
  { emoji: '🎴', label: 'Cartes animées',    route: '/(app)/cards'          },
  { emoji: '🎁', label: 'Cagnotte',          route: '/(app)/pot'            },
  { emoji: '🎟️', label: 'Parrainage',        route: '/(app)/referral'       },
  { emoji: '🔔', label: 'Notifications',     route: '/(app)/notifications'  },
  { emoji: '👤', label: 'Mon profil',        route: '/(app)/profile'        },
];

// ── Steps ──────────────────────────────────────────────────────────────────────
const STEPS = [
  { n: '1', emoji: '👥', title: 'La gestion des contacts',   desc: 'Tu peux les créer manuellement ou les importer directement (après sélection) depuis les contacts de ton téléphone. Dans les 2 cas, leur date de naissance et leur prénom devront être bien renseignés pour activer la détection automatique des anniversaires et des fêtes.' },
  { n: '2', emoji: '🔔', title: 'Les alertes',               desc: 'L\'appli va t\'envoyer une notification 7 jours avant chaque anniversaire ou fête. Plus de surprise de dernière minute !' },
  { n: '3', emoji: '✦',  title: 'Envoyer un message IA',    desc: 'Pour générer ton message IA, choisis un contact, l\'occasion, le format (chanson, poème, message, humour) et la tonalité. L\'IA compose un texte unique en quelques secondes.' },
  { n: '4', emoji: '↺',  title: 'Régénère gratuitement ton message IA',   desc: 'Le premier message coûte 1 crédit. Les suivants pour la même création sont GRATUITS — parce que l\'IA peut parfois proposer un texte maladroit ou qui ne te correspond pas. Tu peux relancer autant de fois que nécessaire jusqu\'à trouver le message parfait, qui ne te coûtera donc, en final, qu\'un crédit !' },
  { n: '5', emoji: '✏️', title: 'Tu préfères écrire toi-même ?', desc: 'Pas de problème ! En bas du générateur, le bouton "✏️ Écrire moi-même" te permet de saisir ton propre texte. Et tu bénéficies quand même de toutes les options de partage (QR code, copie...) sans utiliser de crédit IA.' },
  { n: '6', emoji: '🎁', title: 'La cagnotte collective',    desc: 'Organise un cadeau commun : donne un nom à ta cagnotte, choisis le bénéficiaire, fixe un objectif et éventuellement une date limite.\n\n🔗 Un lien de partage unique est généré automatiquement. Tu pourras l\'envoyer par SMS, WhatsApp ou email. Tes proches n\'auront pas besoin de télécharger l\'app — ils accèderont directement à une page de paiement sécurisée.\n\n⏳ La page de contribution en ligne et le suivi en temps réel seront disponibles lors du lancement officiel de l\'app.' },
  { n: '7', emoji: '🎉', title: 'Partage & célèbre',        desc: 'Copie le texte, génère un QR code, ou combine message IA + cagnotte pour une célébration complète !' },
  { n: '8', emoji: '🎨', title: 'Personnalise les couleurs', desc: 'L\'appli s\'adapte à ton style ! Dans Mon profil → "Couleur de l\'appli", choisis parmi 6 ambiances : Rose, Corail, Soleil, Océan, Nature ou Prune. Le changement est immédiat sur toute l\'appli.' },
];

export default function DashboardScreen() {
  const C = useColors();
  const router = useRouter();
  const { profile } = useAuthStore();

  const isPremium = profile?.plan === 'premium';
  const credits = profile?.credits ?? 0;

  const styles = useMemo(() => makeStyles(C), [C]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Header ───────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mon tableau de bord</Text>
          <Text style={styles.headerSub}>Mode d'emploi & navigation</Text>
        </View>

        {/* ── Credits card ─────────────────────────── */}
        <LinearGradient
          colors={isPremium ? ['#fdd34d', '#c97d10'] : [C.primary, C.primaryContainer]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.creditsCard}
        >
          <View style={styles.creditsRow}>
            <View>
              <Text style={styles.creditsLabel}>
                {isPremium ? 'Plan Premium ⭐' : 'Tes crédits IA'}
              </Text>
              <Text style={styles.creditsValue}>
                {isPremium ? 'Créations illimitées' : `${credits} crédit${credits !== 1 ? 's' : ''} restant${credits !== 1 ? 's' : ''}`}
              </Text>
            </View>
            {!isPremium && (
              <TouchableOpacity
                style={styles.upgradeBtn}
                onPress={() => router.push('/(app)/profile/premium' as never)}
                activeOpacity={0.85}
              >
                <Text style={styles.upgradeBtnText}>Passer Premium</Text>
              </TouchableOpacity>
            )}
          </View>

          {!isPremium && (
            <View style={styles.creditsInfo}>
              <Text style={styles.creditsInfoText}>💡 1 crédit = 1 nouvelle création</Text>
              <Text style={styles.creditsInfoText}>↺ Régénérer est toujours gratuit</Text>
            </View>
          )}
        </LinearGradient>

        {/* ── Navigation grid ──────────────────────── */}
        <Text style={styles.sectionTitle}>Navigation rapide</Text>
        <View style={styles.grid}>
          {NAV_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.gridItem}
              onPress={() => router.push(item.route as never)}
              activeOpacity={0.8}
            >
              <Text style={styles.gridEmoji}>{item.emoji}</Text>
              <Text style={styles.gridLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Mode d'emploi ────────────────────────── */}
        <Text style={styles.sectionTitle}>Comment ça marche ?</Text>
        <View style={styles.stepsCard}>
          {STEPS.map((step, i) => (
            <View key={step.n}>
              <View style={styles.stepRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>{step.n}</Text>
                </View>
                <View style={styles.stepBody}>
                  <Text style={styles.stepTitle}>{step.emoji}  {step.title}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
              {i < STEPS.length - 1 && <View style={styles.stepDivider} />}
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 80 },

  header: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[2],
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['4xl'],
    color: Colors.onSurface,
  },
  headerSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },

  // Credits
  creditsCard: {
    margin: Spacing[4],
    borderRadius: Radii['2xl'],
    padding: Spacing[5],
    gap: 12,
    ...Shadows.lg,
  },
  creditsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  creditsLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  creditsValue: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.white,
  },
  upgradeBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  upgradeBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },
  creditsInfo: {
    gap: 4,
  },
  creditsInfoText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.85)',
  },

  // Section title
  sectionTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: Colors.onSurfaceVariant,
    marginTop: Spacing[2],
    marginBottom: Spacing[3],
    paddingHorizontal: Spacing[4],
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing[4],
    gap: 12,
  },
  gridItem: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    ...Shadows.sm,
  },
  gridEmoji: { fontSize: 26 },
  gridLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },

  // Steps
  stepsCard: {
    marginHorizontal: Spacing[4],
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  stepRow: {
    flexDirection: 'row',
    padding: Spacing[4],
    gap: 14,
    alignItems: 'flex-start',
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  stepBadgeText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.sm,
    color: Colors.white,
  },
  stepBody: { flex: 1, gap: 4 },
  stepTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  stepDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },
  stepDivider: {
    height: 0.5,
    backgroundColor: Colors.surfaceContainer,
    marginLeft: Spacing[4],
  },
  });
}
