import React, { useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTabScrollToTop } from '../../src/hooks/useTabScrollToTop';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../src/stores/authStore';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { useColors } from '../../src/hooks/useColors';
import { BackHeader } from '../../src/components/ui/BackHeader';

// ── Navigation grid ────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { emoji: '✨', label: 'Créer un\nmessage',   route: '/(app)/create'          },
  { emoji: '📅', label: 'Calendrier',         route: '/(app)/calendar'        },
  { emoji: '✉️', label: 'Messages',            route: '/(app)/creations'       },
  { emoji: '👥', label: 'Contacts',            route: '/(app)/contacts'        },
  { emoji: '🎴', label: 'Cartes animées',      route: '/(app)/cards'           },
  { emoji: '🔍', label: 'Recherche',           route: '/(app)/search'          },
  { emoji: '🎉', label: 'Réactions reçues',   route: '/(app)/reactions'       },
  { emoji: '🔤', label: 'Explorer prénoms',    route: '/(app)/explore/prenoms' },
  { emoji: '🌍', label: 'Explorer noms',       route: '/(app)/explore/noms'    },
  { emoji: '🎁', label: 'Cagnotte',            route: '/(app)/pot'             },
  { emoji: '🎟️', label: 'Parrainage',          route: '/(app)/referral'        },
  { emoji: '🔔', label: 'Notifications',       route: '/(app)/notifications'   },
  { emoji: '💑', label: 'Compatibilité',       route: '/(app)/compat'          },
  { emoji: '🔢', label: 'Numérologie',         route: '/(app)/numerologie'     },
  { emoji: '⭐', label: 'Zodiaque',            route: '/(app)/zodiac-season'   },
  { emoji: '💑', label: 'Mode couple',         route: '/(app)/couple'          },
  { emoji: '🐾', label: 'Animaux',             route: '/(app)/animaux'         },
  { emoji: '🗓️', label: 'Agenda',              route: '/(app)/agenda'          },
  { emoji: '📖', label: 'Aide',                route: '/(app)/help'            },
  { emoji: '⚙️', label: 'Paramètres',          route: '/(app)/settings'        },
  { emoji: '👤', label: 'Mon profil',          route: '/(app)/profile'         },
];

// ── Steps ──────────────────────────────────────────────────────────────────────
type SubStep = { emoji: string; title: string; desc: string };
type Step =
  | { n: string; emoji: string; title: string; desc: string; subSteps?: never }
  | { n: string; emoji: string; title: string; desc?: never; subSteps: SubStep[] };

const STEPS: Step[] = [
  { n: '1',  emoji: '👥', title: 'La gestion des contacts',        desc: 'Tu peux les créer manuellement ou les importer directement (après sélection) depuis les contacts de ton téléphone. Dans les 2 cas, leur date de naissance et leur prénom devront être bien renseignés pour activer la détection automatique des anniversaires et des fêtes.\n\n🔗 Tu peux partager tes contacts avec n\'importe qui (ami, famille…) via un lien valable 24h. Dans ta liste de contacts → bouton "🔗 Partager". Tu choisis quels contacts partager, l\'autre personne choisit lesquels importer. Aucun message n\'est partagé — seulement les noms, dates et relations.\n\n⚠️ Pense à renseigner la civilité (M. ou Mme) de chaque contact — l\'IA en a besoin pour accorder correctement les adjectifs dans le message (ex : "entouré" vs "entourée"). Sans civilité, l\'IA utilisera des formulations neutres.\n\n👨‍👩‍👧 Tu peux rattacher un enfant à son parent : dans la fiche de l\'enfant, choisis la relation "Enfant de…" puis sélectionne le contact parent. L\'IA adaptera alors le ton du message en conséquence.\n\n🐾 Tu peux aussi ajouter l\'animal de compagnie d\'un proche comme contact ! Choisis la relation "Animal de compagnie" et renseigne le champ "Animal de qui ?" avec le prénom du propriétaire. Dans ta liste, tu verras alors "🐾 Animal de Michel" sous le nom de l\'animal — impossible de les confondre !' },
  { n: '2',  emoji: '🔔', title: 'Les alertes',                    desc: 'L\'appli va t\'envoyer une notification 7 jours avant chaque anniversaire ou fête des contacts que tu as créés. Plus de surprise de dernière minute !' },
  { n: '3',  emoji: '✦',  title: 'Envoyer un message IA',          desc: 'Pour générer ton message IA, choisis un contact, l\'occasion, le format (chanson, poème, message, humour) et la tonalité. L\'IA compose un texte unique en quelques secondes.\n\n🌍 Ton contact est étranger ? Sélectionne sa langue dans le sélecteur "Langue du message" — l\'IA rédigera directement dans cette langue. Tu peux aussi enregistrer la langue préférée de chaque contact dans sa fiche pour qu\'elle soit pré-sélectionnée automatiquement.' },
  { n: '4',  emoji: '↺',  title: 'Régénère gratuitement ton message IA', desc: 'Le premier message IA coûte 1 crédit. Les suivants pour la même création sont GRATUITS — parce que l\'IA peut parfois proposer un texte maladroit ou qui ne te correspond pas. Tu peux relancer autant de fois que nécessaire jusqu\'à trouver le message parfait, qui ne te coûtera donc, en final, qu\'un crédit !' },
  { n: '5',  emoji: '✏️', title: 'Tu préfères écrire toi-même ?',  desc: 'Pas de problème ! Et c\'est gratuit en plus et autant de fois que tu veux ! En bas du générateur, le bouton "✏️ Écrire moi-même" te permet de saisir ton propre texte. Et tu bénéficies quand même de toutes les options de partage (QR code, copie...) sans utiliser de crédit IA.' },
  { n: '6',  emoji: '📊', title: 'Les 3 plans d\'utilisation de l\'appli', subSteps: [
    { emoji: '💜', title: 'Le plan Gratuit',             desc: 'Tu démarres avec des crédits offerts. En version gratuite : 5 créations IA par mois, 2 occasions (Anniversaire & Fête), 2 formats (Message & Humour). Des publicités apparaissent dans l\'app. Tu peux écrire tes messages manuellement, gratuitement et sans limite.' },
    { emoji: '✦',  title: 'Le plan Essentiel — 2,49 €/mois', desc: 'Le juste milieu ! 10 créations IA par mois, toutes les occasions (8), tous les formats (Chanson, Poème, Message, Humour), toutes les tonalités, 3 cagnottes actives, historique illimité — et zéro publicité.' },
    { emoji: '⭐', title: 'Le plan Premium — 4,99 €/mois',  desc: 'Le plan tout illimité ! Créations IA sans limite, studio d\'édition, QR code de partage, cagnottes illimitées, priorité serveur IA, support prioritaire — et bien sûr zéro publicité. Disponible aussi en annuel : 34,99 €/an (−42 %).' },
  ]},
  { n: '7',  emoji: '🎁', title: 'La cagnotte collective',          desc: 'Organise une cagnotte pour un cadeau commun. Donne un nom à ta cagnotte, choisis le/la bénéficiaire, fixe un objectif et éventuellement une date limite.\n\n🔗 Un lien de partage unique est généré automatiquement. Tu pourras l\'envoyer par SMS, WhatsApp ou email. Tes proches n\'auront pas besoin de télécharger l\'app — ils accèderont directement à une page de paiement sécurisée.\n\n🧾 Chaque contributeur reçoit automatiquement un justificatif comptable par email dès que son paiement est validé.\n\n⏳ La page de contribution en ligne et le suivi en temps réel seront disponibles lors du lancement officiel de l\'app.' },
  { n: '8',  emoji: '🎉', title: 'Envoie ton message',              desc: 'Choisis comment l\'envoyer : via WhatsApp, par SMS, par Email, ou en copiant le texte pour le coller où tu veux. Si tu as renseigné le numéro ou l\'email du contact, l\'app le pré-remplit automatiquement.\n\n🕐 Tu peux aussi choisir le moment idéal pour envoyer ton message. Si tu as renseigné la préférence d\'horaire de ton contact (matin, après-midi, soir) dans sa fiche, l\'app te l\'indique pour que tu envoies au bon moment !' },
  { n: '9',  emoji: '🎟️', title: 'Le parrainage',                  desc: 'Tu peux parrainer tes proches ET être parrainé·e :\n\n👉 Tu invites quelqu\'un : partage ton code depuis la page "Parrainage" ou "Mon profil". Dès que ton filleul s\'inscrit avec ton code, vous recevez chacun 5 crédits IA offerts. Plus tu parraines, plus tu envoies de messages gratuitement !\n\n👈 Quelqu\'un t\'a invité : lors de ton inscription, saisis le code que ton parrain t\'a communiqué dans le champ "Code parrainage (optionnel)". Vous recevrez chacun 5 crédits offerts automatiquement.' },
  { n: '10', emoji: '🎨', title: 'Personnalise les couleurs',       desc: 'L\'appli s\'adapte à ton style ! Dans Mon profil → "Couleur de l\'appli", choisis parmi 6 ambiances : Rose, Corail, Soleil, Océan, Nature ou Prune. Le changement est immédiat sur toute l\'appli.' },
  { n: '11', emoji: '🗓', title: 'Fêtes & Journées généralistes',  desc: 'En plus des anniversaires et fêtes de tes contacts, l\'appli te rappelle les grandes fêtes de l\'année :\n\n🎆 Jour de l\'An · ❤️ Saint-Valentin · 👵 Fête des grand-mères · 💜 Journée de la femme · 🐟 Poisson d\'avril · 🌹 Fête des secrétaires · 🌹 Fête du travail · 💐 Fête des mères · 🏘️ Fête des voisins · 🎵 Fête de la musique · 🔥 Saint-Jean · 👨 Fête des pères · 🤝 Journée de l\'amitié · 🐱 Journée du chat · 🐶 Journée du chien · 🎃 Halloween · 👒 Sainte-Catherine · 🎄 Noël\n\n📍 Où les trouver ?\n• Sur l\'accueil : un bloc "Fêtes & Journées à venir" apparaît automatiquement quand une fête approche dans les 14 prochains jours.\n• Dans le calendrier : une section dédiée liste toutes les fêtes du mois en cours.\n\n🔔 Tu reçois aussi une notification quelques jours avant chaque fête (7 jours pour les grandes occasions, 3 jours pour les autres).\n\n✨ Pour les fêtes liées à des proches (Saint-Valentin, Fête des mères, Fête des pères, Halloween, Noël…), un bouton "Créer un message" t\'amène directement dans le générateur avec l\'occasion déjà pré-sélectionnée.' },
];

export default function DashboardScreen() {
  const C = useColors();
  const router = useRouter();
  const { profile } = useAuthStore();

  const isPremium = profile?.plan === 'premium';
  const credits = profile?.credits ?? 0;

  const styles = useMemo(() => makeStyles(C), [C]);
  const scrollRef = useRef<ScrollView>(null);
  useTabScrollToTop('dashboard', () => scrollRef.current?.scrollTo({ y: 0, animated: false }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="Mon tableau de bord" />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

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

        {/* ── Intro navigation ─────────────────────── */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>🗺️ Toute l'appli d'un seul endroit</Text>
          <Text style={styles.introText}>
            {'Ce tableau de bord est ton raccourci universel. Chaque tuile ci-dessous t\'amène directement à une section de l\'appli — sans passer par les menus.\n\nUtile quand tu sais exactement où tu veux aller.'}
          </Text>
        </View>

        {/* ── Guide A-Z ────────────────────────────── */}
        <TouchableOpacity
          onPress={() => router.push('/(app)/glossaire' as never)}
          activeOpacity={0.85}
          style={{ marginBottom: 16, backgroundColor: C.primaryContainer, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.primary + '40' }}
        >
          <Text style={{ fontSize: 28 }}>📚</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 14, color: C.primary }}>Guide A-Z de l'appli</Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: '#666', marginTop: 2, lineHeight: 17 }}>Toutes les fonctions par ordre alphabétique, avec recherche. Parfait pour débuter !</Text>
          </View>
          <Text style={{ color: C.primary, fontSize: 20 }}>›</Text>
        </TouchableOpacity>

        {/* ── Navigation grid ──────────────────────── */}
        <Text style={styles.sectionTitle}>Navigation rapide</Text>
        <View style={styles.grid}>
          {NAV_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.gridItem}
              onPress={() => router.push({ pathname: item.route as never, params: { backTo: '/(app)/dashboard' } } as never)}
              activeOpacity={0.8}
            >
              <Text style={styles.gridEmoji}>{item.emoji}</Text>
              <Text style={styles.gridLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Mode d'emploi ────────────────────────── */}
        <Text style={styles.sectionTitle}>Mode d'emploi : comment ça marche ?</Text>
        <View style={styles.stepsCard}>
          {STEPS.map((step, i) => (
            <View key={step.n}>
              <View style={styles.stepRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>{step.n}</Text>
                </View>
                <View style={styles.stepBody}>
                  <Text style={styles.stepTitle}>{step.emoji}  {step.title}</Text>
                  {step.desc ? (
                    <Text style={styles.stepDesc}>{step.desc}</Text>
                  ) : step.subSteps ? (
                    <View style={styles.subStepsList}>
                      {step.subSteps.map((sub, j) => (
                        <View key={j} style={styles.subStepItem}>
                          <Text style={styles.subStepTitle}>{sub.emoji}  {sub.title}</Text>
                          <Text style={styles.stepDesc}>{sub.desc}</Text>
                        </View>
                      ))}
                    </View>
                  ) : null}
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
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    textAlign: 'center',
  },
  headerSub: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.lg,
    letterSpacing: 0.4,
    color: C.primary,
    marginTop: 2,
    textAlign: 'center',
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

  // Intro
  introCard: {
    marginHorizontal: Spacing[4],
    marginTop: Spacing[4],
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
    gap: 8,
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

  // Section title
  sectionTitle: {
    borderLeftWidth: 3,
    borderLeftColor: C.primary,
    paddingLeft: 8,
    paddingVertical: 4,    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: C.primary,
    marginTop: Spacing[4],
    marginBottom: Spacing[2],
    marginHorizontal: Spacing[4],
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
  subStepsList: { gap: 12, marginTop: 6 },
  subStepItem: { gap: 3, paddingLeft: 4, borderLeftWidth: 2, borderLeftColor: Colors.surfaceContainerHighest },
  subStepTitle: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurface,
  },
  stepTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  stepDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 22,
  },
  stepDivider: {
    height: 0.5,
    backgroundColor: Colors.surfaceContainer,
    marginLeft: Spacing[4],
  },
  });
}
