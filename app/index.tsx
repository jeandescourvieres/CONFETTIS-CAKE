// ═══════════════════════════════════════════════════════════════════
//  ConfettiCake — Landing page publique (confetticake.fr)
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Image, Linking, Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect } from 'expo-router';
import Animated, {
  FadeInUp, FadeInDown, FadeIn,
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay, Easing,
} from 'react-native-reanimated';

const APP_STORE_URL = 'https://apps.apple.com/app/confettis-cake';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.confettiscake.app';

const VIOLET = '#9b6bb5';
const VIOLET_DARK = '#5e2d80';
const VIOLET_LIGHT = '#c084fc';

const FEATURES = [
  {
    emoji: '🎂',
    color: '#9b6bb5',
    title: 'Anniversaires sans oubli :',
    text: "Reçois une alerte avant chaque date importante : anniversaires, fêtes, anniversaires de couple… plus jamais d'oubli.",
  },
  {
    emoji: '✨',
    color: '#F97316',
    title: 'Messages générés par IA :',
    text: "Une IA rédige pour toi un message personnalisé selon la personne, l'occasion et ton style — à envoyer en un tap.",
  },
  {
    emoji: '🎬',
    color: '#7C3AED',
    title: 'Cartes animées personnalisées :',
    text: "Compose une carte animée avec musique, photo et message pour marquer le coup, à partager où tu veux.",
  },
  {
    emoji: '🎁',
    color: '#EC4899',
    title: 'Cagnottes collectives :',
    text: "Organise une cagnotte à plusieurs pour un cadeau commun, avec suivi des contributions en temps réel.",
  },
];

const STEPS = [
  { num: '1', title: 'Ajoute tes proches', text: "Renseigne les dates importantes de ta famille, tes amis, tes collègues." },
  { num: '2', title: 'Reçois une alerte', text: "Tu es prévenu à temps, avec une suggestion de message déjà prête." },
  { num: '3', title: 'Envoie en un geste', text: "Personnalise si besoin et envoie par SMS, WhatsApp, e-mail ou carte animée." },
];

const AI_EXAMPLES = [
  {
    to: 'Pour Marie · 28 ans',
    text: "Joyeux anniversaire Marie ! 🎉 28 bougies déjà... que cette nouvelle année t'apporte autant de fous rires que celles qu'on a partagés. Plein de bisous 💜",
  },
  {
    to: 'Pour Papa · Fête des Pères',
    text: "Bonne fête Papa 🌻 Merci pour absolument tout, ton soutien et ta bonne humeur. On se voit dimanche pour fêter ça comme il faut !",
  },
  {
    to: 'Pour Léo · Nouveau travail',
    text: "Félicitations pour ton nouveau poste Léo 🚀 Tu l'as tellement mérité. Hâte de fêter ça autour d'un bon repas !",
  },
];

const CARD_GALLERY = [
  { emoji: '🎈', colors: ['#9b6bb5', '#c084fc'] as const, label: 'Anniversaire festif' },
  { emoji: '💍', colors: ['#EC4899', '#F472B6'] as const, label: 'Anniversaire de couple' },
  { emoji: '🎓', colors: ['#F97316', '#FBBF24'] as const, label: 'Réussite & diplôme' },
  { emoji: '🌸', colors: ['#7C3AED', '#A78BFA'] as const, label: 'Fête des mères' },
  { emoji: '❄️', colors: ['#2563EB', '#60A5FA'] as const, label: 'Noël' },
  { emoji: '💌', colors: ['#DB2777', '#FB7185'] as const, label: 'Saint-Valentin' },
];

const VALUES = [
  { emoji: '🔒', title: 'Données protégées', text: "Tes informations restent totalement confidentielles et sécurisées." },
  { emoji: '🇫🇷', title: 'Conçu en France', text: "Une application pensée et développée en France, multilingue, pour célébrer tes proches partout dans le monde." },
  { emoji: '💜', title: 'Pensé pour vous', text: "Chaque fonctionnalité est pensée pour rendre tes attentions plus simples à organiser." },
];

const FUNCTION_CATEGORIES: { emoji: string; title: string; items: { name: string; text: string }[] }[] = [
  {
    emoji: '🎯',
    title: 'Prise en main',
    items: [
      { name: 'Onboarding personnalisé', text: "Un parcours guidé en quelques étapes : profil, préférences de signature, notifications et premier contact ajouté." },
    ],
  },
  {
    emoji: '👥',
    title: 'Contacts enrichis',
    items: [
      { name: 'Fiche contact complète', text: "Centralise toutes les informations qui comptent sur chaque proche, organisées et faciles à consulter." },
      { name: 'Centres d’intérêt', text: "Sport, musique, voyage, cuisine… pour des suggestions de messages et de cadeaux toujours pertinentes." },
      { name: 'Couleur préférée', text: "Personnalise messages et cartes selon les goûts de chacun, comparée à sa couleur numérologique." },
      { name: 'Signe chinois', text: "Calculé automatiquement à partir de l’année de naissance — parmi les 12 animaux du zodiaque." },
      { name: 'Avatar généré par IA', text: "Une illustration unique créée à partir du profil complet du contact (signe, couleur, centres d’intérêt)." },
      { name: 'Liste de souhaits partagée', text: "Chacun renseigne ses envies sans voir qui a déjà coché quoi — fini les cadeaux ratés et les doublons." },
    ],
  },
  {
    emoji: '📅',
    title: 'Agenda complet',
    items: [
      { name: 'Anniversaires à venir', text: "Tous tes contacts avec leur date apparaissent automatiquement, avec des alertes 7 jours, 3 jours et le jour J." },
      { name: 'Fêtes des prénoms', text: "Rappels la veille et le jour J pour ne manquer aucune fête de prénom du calendrier français." },
      { name: 'Fêtes spéciales', text: "Fête des secrétaires, fête du travail, journée des amis… tous les rendez-vous qui jalonnent l’année." },
      { name: 'Autres événements', text: "Ton bloc-notes personnel pour tout ce qui ne rentre pas dans les autres catégories." },
      { name: 'Compte à rebours', text: "Un code couleur (vert, orange, rouge) qui t’indique en un coup d’œil le temps restant avant chaque date." },
      { name: 'Recherche globale', text: "Retrouve un contact, une date ou un prénom même avec une faute de frappe ou un nom partiel." },
    ],
  },
  {
    emoji: '🔍',
    title: 'Explorer prénoms & noms',
    items: [
      { name: 'Fiche prénom détaillée', text: "Origine, signification, traits de caractère, célébrités, courbe de popularité INSEE et numérologie." },
      { name: 'Fiche nom de famille', text: "Origine géographique, étymologie, variantes et anecdotes historiques sur un nom de famille." },
      { name: 'Courbe de popularité INSEE', text: "Données officielles sur l’évolution d’un prénom à travers les décennies en France." },
      { name: 'Partage en carte', text: "Génère une jolie carte à partager avec le prénom, sa signification, son origine et les couleurs de l’app." },
    ],
  },
  {
    emoji: '🔢',
    title: 'Numérologie',
    items: [
      { name: 'Calcul des chiffres clés', text: "Chiffre du prénom, du nom et d’expression — pour mieux cerner une personnalité au quotidien." },
      { name: 'Chemin de vie', text: "Calculé à partir de la date de naissance, avec sa signification détaillée (Le Leader, Le Créatif, Le Visionnaire…)." },
      { name: 'Couleurs et profils associés', text: "Chaque chiffre — y compris les nombres maîtres 11 et 22 — a sa couleur et son profil dédié." },
    ],
  },
  {
    emoji: '💞',
    title: 'Compatibilité',
    items: [
      { name: 'Score de compatibilité global', text: "Combine astrologie occidentale, signe chinois et numérologie pour une vision d’ensemble ludique." },
      { name: 'Analyse multi-dimensionnelle', text: "Plusieurs angles croisés pour explorer une relation sous toutes ses facettes." },
      { name: 'Lecture toujours bienveillante', text: "Présentée à titre indicatif et ludique — pour mieux se comprendre, jamais pour juger." },
    ],
  },
  {
    emoji: '🎂',
    title: 'Anniversaires en détail',
    items: [
      { name: 'Âge en chiffres fun', text: "Nombre de battements de cœur, de repas, d’heures de sommeil… depuis sa naissance." },
      { name: 'Le jour de sa naissance', text: "Événements historiques, chanson et film n°1, actualités de l’époque générés pour cette date précise." },
      { name: 'Personnalités nées le même jour', text: "Acteurs, sportifs, musiciens… qui partagent sa date d’anniversaire." },
      { name: 'L’année de sa naissance', text: "Contexte de l’époque, prix d’alors, anecdotes insolites de l’année où il ou elle est né·e." },
    ],
  },
  {
    emoji: '✉️',
    title: 'Messages personnalisés',
    items: [
      { name: 'Génération par IA', text: "Un message unique selon la personne, l’occasion et ton style, rédigé en quelques secondes." },
      { name: 'Signature automatique', text: "Le bon lien de parenté (ton fils, ta nièce, ton petit-fils…) appliqué selon votre relation." },
      { name: 'Fonds animés à thème', text: "Confettis, pétales, flocons, cœurs, fleurs, étoiles… selon l’occasion célébrée." },
      { name: 'Musique d’ambiance', text: "Une bibliothèque de mélodies à associer selon le ton recherché — joyeux, doux, drôle, majestueux…" },
      { name: 'Message vocal généré par IA', text: "Une voix au choix lit ton message à voix haute, grâce à la technologie ElevenLabs." },
      { name: 'Réactions', text: "Ton proche peut réagir à ta carte avec un emoji et un petit mot, via un lien unique et privé." },
      { name: 'Envoi automatique', text: "Programme l’envoi à une date précise, ou active l’envoi annuel automatique pour ne plus jamais y penser." },
    ],
  },
  {
    emoji: '🤝',
    title: 'Fonctions sociales',
    items: [
      { name: 'Livre d’or numérique', text: "Rassemble les messages de plusieurs proches autour d’une même personne, pour une surprise collective." },
      { name: 'Rappel partagé', text: "Préviens tes proches d’une date importante — fonctionne même s’ils n’ont pas l’application, par SMS ou WhatsApp." },
    ],
  },
  {
    emoji: '🌍',
    title: 'Cas particuliers, gérés avec soin',
    items: [
      { name: 'Prénoms composés', text: "Choisis quelle fête célébrer — la première, la seconde, ou les deux — quand un prénom en regroupe plusieurs." },
      { name: 'Prénoms étrangers ou rares', text: "Gestion intelligente des accents et des cas où aucune fête n’existe dans le calendrier français." },
    ],
  },
];

function CategoryAccordion({ emoji, title, items }: { emoji: string; title: string; items: { name: string; text: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity style={styles.catItem} onPress={() => setOpen((o) => !o)} activeOpacity={0.8}>
      <View style={styles.catHeader}>
        <View style={styles.catHeaderLeft}>
          <Text style={styles.catEmoji}>{emoji}</Text>
          <View>
            <Text style={styles.catTitle}>{title}</Text>
            <Text style={styles.catCount}>{items.length} fonction{items.length > 1 ? 's' : ''}</Text>
          </View>
        </View>
        <Text style={styles.faqArrow}>{open ? '−' : '+'}</Text>
      </View>
      {open && (
        <View style={styles.catList}>
          {items.map((it) => (
            <View key={it.name} style={styles.catRow}>
              <Text style={styles.catBullet}>•</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.catItemName}>{it.name}</Text>
                <Text style={styles.catItemText}>{it.text}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const FAQ = [
  { q: "L'application est-elle gratuite ?", a: "Oui ! ConfettiCake propose un mode gratuit avec l'essentiel pour ne plus rater une date importante. Un abonnement Premium débloque les fonctionnalités avancées (messages IA illimités, cartes animées, envois automatiques…)." },
  { q: "Comment l'IA génère-t-elle les messages ?", a: "Tu donnes quelques infos sur la personne et l'occasion, et l'IA rédige un message personnalisé dans le ton de ton choix — à modifier ou envoyer tel quel." },
  { q: "Puis-je inviter ma famille à participer à une cagnotte ?", a: "Oui, tu peux créer une cagnotte collective et inviter qui tu veux par lien — chacun peut suivre les contributions en temps réel." },
  { q: "Sur quels supports l'application est-elle disponible ?", a: "ConfettiCake est disponible sur iOS et Android, et certaines pages (cartes, cagnottes) sont aussi consultables depuis un navigateur web." },
];

function openStore() {
  const url = Platform.select({ ios: APP_STORE_URL, default: PLAY_STORE_URL }) ?? PLAY_STORE_URL;
  Linking.openURL(url).catch(() => {});
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity style={styles.faqItem} onPress={() => setOpen((o) => !o)} activeOpacity={0.8}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{q}</Text>
        <Text style={styles.faqArrow}>{open ? '−' : '+'}</Text>
      </View>
      {open && <Text style={styles.faqAnswer}>{a}</Text>}
    </TouchableOpacity>
  );
}

// ── Confettis animés en fond du hero ──
const CONFETTI_COLORS = ['#FBBF24', '#F472B6', '#60A5FA', '#34D399', '#C084FC', '#FB7185', '#FDE047'];

function ConfettiPiece({ left, color, size, duration, delay, spin }: {
  left: number; color: string; size: number; duration: number; delay: number; spin: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => {
    const translateY = -40 + progress.value * 540;
    const translateX = Math.sin(progress.value * Math.PI * 2) * 18;
    const rotate = `${progress.value * 360 * spin}deg`;
    const opacity = progress.value > 0.82 ? Math.max(0, (1 - progress.value) / 0.18) : 1;
    return { transform: [{ translateY }, { translateX }, { rotate }], opacity };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.confettiPiece,
        { left: `${left}%`, width: size, height: size * 0.42, backgroundColor: color, borderRadius: size * 0.18 },
        animStyle,
      ]}
    />
  );
}

function ConfettiBackground() {
  const pieces = useMemo(
    () => Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 8 + Math.random() * 9,
      duration: 7000 + Math.random() * 6000,
      delay: Math.random() * 7000,
      spin: Math.random() > 0.5 ? 1 : -1,
    })),
    [],
  );

  return (
    <View style={styles.confettiLayer} pointerEvents="none">
      {pieces.map((p) => <ConfettiPiece key={p.id} {...p} />)}
    </View>
  );
}

// ── Feu d'artifice en fond du hero ──
function FireworkParticle({ progress, angle, color, burstFraction }: {
  progress: ReturnType<typeof useSharedValue<number>>; angle: number; color: string; burstFraction: number;
}) {
  const animStyle = useAnimatedStyle(() => {
    const raw = progress.value;
    const b = Math.min(raw / burstFraction, 1);
    // Expansion rapide de l'éclat (0 → 38% du cycle visible), puis longue retombée par gravité
    const expansion = Math.min(b / 0.38, 1);
    const radius = expansion * 110;
    const translateX = Math.cos(angle) * radius;
    const fall = b * b * 130;
    const translateY = Math.sin(angle) * radius + fall;
    const opacity = b < 0.06 ? b / 0.06 : Math.max(0, (1 - b) / 0.94);
    const scale = 1 - b * 0.35;
    return { transform: [{ translateX }, { translateY }, { scale }], opacity };
  });

  return <Animated.View style={[styles.fireworkParticle, { backgroundColor: color }, animStyle]} />;
}

function FireworkBurst({ left, top, color, delay, cycleDuration }: {
  left: number; top: number; color: string; delay: number; cycleDuration: number;
}) {
  const progress = useSharedValue(0);
  const burstFraction = 0.62;

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: cycleDuration, easing: Easing.linear }), -1, false),
    );
  }, []);

  const particles = useMemo(
    () => Array.from({ length: 20 }).map((_, i) => (i / 20) * Math.PI * 2 + Math.random() * 0.15),
    [],
  );

  return (
    <View style={[styles.fireworkBurst, { left: `${left}%`, top }]} pointerEvents="none">
      {particles.map((angle, i) => (
        <FireworkParticle key={i} progress={progress} angle={angle} color={color} burstFraction={burstFraction} />
      ))}
    </View>
  );
}

const FIREWORK_BURSTS = [
  { left: 16, top: 50, color: '#FBBF24', delay: 300, cycleDuration: 6200 },
  { left: 82, top: 36, color: '#60A5FA', delay: 2400, cycleDuration: 7000 },
  { left: 50, top: 70, color: '#F472B6', delay: 4400, cycleDuration: 6600 },
];

function FireworksBackground() {
  return (
    <View style={styles.confettiLayer} pointerEvents="none">
      {FIREWORK_BURSTS.map((b, i) => <FireworkBurst key={i} {...b} />)}
    </View>
  );
}

// ── Étoiles filantes en fond du hero ──
function ShootingStar({ startLeft, startTop, angle, length, delay, cycleDuration }: {
  startLeft: number; startTop: number; angle: number; length: number; delay: number; cycleDuration: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: cycleDuration, easing: Easing.linear }), -1, false),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => {
    const raw = progress.value;
    // Traversée rapide (18% du cycle), puis longue pause invisible avant la prochaine étoile
    const travelFraction = 0.18;
    const t = Math.min(raw / travelFraction, 1);
    const distance = t * 260;
    const translateX = Math.cos(angle) * distance;
    const translateY = Math.sin(angle) * distance;
    const opacity = raw > travelFraction ? 0 : (t < 0.12 ? t / 0.12 : Math.max(0, (1 - t) / 0.88));
    return { transform: [{ translateX }, { translateY }], opacity };
  });

  const angleDeg = (angle * 180) / Math.PI;

  return (
    <Animated.View pointerEvents="none" style={[styles.shootingStarWrap, { left: `${startLeft}%`, top: startTop }, animStyle]}>
      <View style={[styles.shootingStarRow, { width: length, transform: [{ rotate: `${angleDeg}deg` }] }]}>
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.95)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.shootingStarTrail}
        />
        <View style={styles.shootingStarHead} />
      </View>
    </Animated.View>
  );
}

const SHOOTING_STARS = [
  { startLeft: 72, startTop: 18, angle: 2.6, length: 70, delay: 1200, cycleDuration: 9000 },
  { startLeft: 28, startTop: 64, angle: 2.45, length: 58, delay: 5200, cycleDuration: 11000 },
  { startLeft: 90, startTop: 78, angle: 2.7, length: 54, delay: 8400, cycleDuration: 10000 },
  { startLeft: 12, startTop: 24, angle: 2.5, length: 64, delay: 2600, cycleDuration: 9600 },
  { startLeft: 55, startTop: 10, angle: 2.65, length: 50, delay: 6600, cycleDuration: 10400 },
  { startLeft: 96, startTop: 40, angle: 2.55, length: 60, delay: 3800, cycleDuration: 11600 },
  { startLeft: 40, startTop: 86, angle: 2.4, length: 52, delay: 9600, cycleDuration: 9200 },
];

function ShootingStarsBackground() {
  return (
    <View style={styles.confettiLayer} pointerEvents="none">
      {SHOOTING_STARS.map((s, i) => <ShootingStar key={i} {...s} />)}
    </View>
  );
}

export default function LandingPage() {
  const { width } = useWindowDimensions();
  const isWide = width >= 860;

  // Sur mobile natif, la racine "/" doit rester gérée par AuthGate (login / app)
  if (Platform.OS !== 'web') {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      {/* ── Hero ── */}
      <LinearGradient colors={[VIOLET, VIOLET_DARK]} style={styles.hero}>
        <ConfettiBackground />
        <FireworksBackground />
        <ShootingStarsBackground />
        <SafeAreaView edges={['top']}>
          <View style={[styles.heroInner, isWide && styles.heroInnerWide]}>
            <Animated.View entering={FadeInUp.duration(500)} style={styles.heroText}>
              <View style={styles.brandCard}>
                <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
              </View>
              <Text style={styles.brandSub}>by Confettis & Cake</Text>
              <Text style={styles.heroTitle}>Ne rate plus jamais{'\n'}un anniversaire ou une fête !</Text>
              <Text style={styles.heroSubtitle}>
                ConfettiCake te rappelle les dates qui comptent et t'aide à célébrer
                tes proches avec des messages personnalisés, des cartes animées et des cagnottes collectives.
              </Text>
              <View style={styles.storeRow}>
                <TouchableOpacity style={styles.storeBtn} onPress={() => Linking.openURL(APP_STORE_URL).catch(() => {})} activeOpacity={0.85}>
                  <Text style={styles.storeBtnIcon}>🍎</Text>
                  <Text style={styles.storeBtnText}>App Store</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.storeBtn} onPress={() => Linking.openURL(PLAY_STORE_URL).catch(() => {})} activeOpacity={0.85}>
                  <Text style={styles.storeBtnIcon}>▶️</Text>
                  <Text style={styles.storeBtnText}>Google Play</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.trustRow}>
                <Text style={styles.trustItem}>✓ Gratuit pour commencer</Text>
                <Text style={styles.trustItem}>✓ Sans engagement</Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(600).delay(150)} style={styles.heroMockup}>
              <View style={styles.phoneFrame}>
                <View style={styles.phoneNotch} />
                <Text style={styles.phoneGreeting}>Aujourd'hui</Text>
                <View style={styles.phoneCard}>
                  <Text style={styles.phoneCardEmoji}>🎂</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.phoneCardTitle}>Anniversaire de Marie</Text>
                    <Text style={styles.phoneCardSub}>Message prêt à envoyer ✨</Text>
                  </View>
                </View>
                <View style={styles.phoneCard}>
                  <Text style={styles.phoneCardEmoji}>🎁</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.phoneCardTitle}>Cagnotte « Cadeau Léo »</Text>
                    <Text style={styles.phoneCardSub}>140 € collectés sur 200 €</Text>
                  </View>
                </View>
                <View style={[styles.phoneCard, styles.phoneCardGhost]}>
                  <Text style={styles.phoneCardEmoji}>💌</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.phoneCardTitle}>Carte animée envoyée</Text>
                    <Text style={styles.phoneCardSub}>à Papa, pour la fête des pères</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* ── Fonctionnalités ── */}
      <View style={styles.section}>
        <Animated.View entering={FadeInUp.duration(450)}>
          <Text style={styles.sectionTitle}>Tout pour célébrer tes proches !</Text>
          <Text style={[styles.sectionSubtitle, { maxWidth: 640 }]}>Une application pensée pour ne plus jamais passer à côté d'un moment important.</Text>
        </Animated.View>
        <View style={[styles.cardsGrid, isWide && styles.cardsGridWide]}>
          {FEATURES.map((f, i) => (
            <Animated.View key={f.title} entering={FadeInUp.duration(450).delay(i * 90)} style={[styles.featureCard, isWide && styles.featureCardWide]}>
              <View style={[styles.featureIconBadge, { backgroundColor: f.color + '1A' }]}>
                <Text style={styles.featureEmoji}>{f.emoji}</Text>
              </View>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* ── Toutes les fonctionnalités, en détail ── */}
      <View style={[styles.section, styles.sectionAlt]}>
        <Animated.View entering={FadeInUp.duration(450)}>
          <Text style={styles.sectionTitle}>Toutes les fonctionnalités, en détail :</Text>
          <Text style={styles.sectionSubtitle}>
            ConfettiCake regroupe plus de 40 fonctionnalités organisées en 10 thèmes. Explore chaque catégorie pour avoir tous les détails.
          </Text>
        </Animated.View>
        <View style={styles.catList2}>
          {FUNCTION_CATEGORIES.map((cat, i) => (
            <Animated.View key={cat.title} entering={FadeInUp.duration(400).delay(Math.min(i, 6) * 60)}>
              <CategoryAccordion emoji={cat.emoji} title={cat.title} items={cat.items} />
            </Animated.View>
          ))}
        </View>
      </View>

      {/* ── Exemples de messages IA ── */}
      <View style={styles.section}>
        <Animated.View entering={FadeInUp.duration(450)}>
          <Text style={styles.sectionTitle}>Des messages qui sonnent juste</Text>
          <Text style={styles.sectionSubtitle}>Notre IA s'adapte à la personne, à l'occasion et à ton style.{'\n'}Voici quelques exemples :</Text>
        </Animated.View>
        <View style={[styles.aiGrid, isWide && styles.aiGridWide]}>
          {AI_EXAMPLES.map((m, i) => (
            <Animated.View key={m.to} entering={FadeInUp.duration(450).delay(i * 100)} style={styles.aiCard}>
              <View style={styles.aiCardHeader}>
                <Text style={styles.aiSparkle}>✨</Text>
                <Text style={styles.aiCardLabel}>{m.to}</Text>
              </View>
              <Text style={styles.aiCardText}>{m.text}</Text>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* ── Galerie de cartes animées ── */}
      <View style={[styles.section, styles.sectionAlt]}>
        <Animated.View entering={FadeInUp.duration(450)}>
          <Text style={styles.sectionTitle}>Des cartes animées à personnaliser</Text>
          <Text style={styles.sectionSubtitle}>Choisis un thème, ajoute une photo, une musique et ton message.{'\n'}Ta carte prend vie grâce à l'IA !</Text>
        </Animated.View>
        <View style={[styles.galleryRow, isWide && styles.galleryRowWide]}>
          {CARD_GALLERY.map((c, i) => (
            <Animated.View key={c.label} entering={FadeInUp.duration(450).delay(i * 90)}>
              <LinearGradient colors={c.colors} style={styles.galleryCard}>
                <Text style={styles.galleryEmoji}>{c.emoji}</Text>
                <Text style={styles.galleryLabel}>{c.label}</Text>
              </LinearGradient>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* ── Comment ça marche ── */}
      <View style={styles.section}>
        <Animated.View entering={FadeInUp.duration(450)}>
          <Text style={styles.sectionTitle}>Comment ça marche ?</Text>
          <Text style={styles.sectionSubtitle}>Trois étapes, et c'est parti</Text>
        </Animated.View>
        <View style={[styles.stepsRow, isWide && styles.stepsRowWide]}>
          {STEPS.map((s, i) => (
            <Animated.View key={s.num} entering={FadeInUp.duration(450).delay(i * 100)} style={styles.stepCard}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{s.num}</Text>
              </View>
              <Text style={styles.stepTitle}>{s.title}</Text>
              <Text style={styles.stepText}>{s.text}</Text>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* ── Nos valeurs ── */}
      <View style={[styles.section, styles.sectionAlt]}>
        <Animated.View entering={FadeInUp.duration(450)}>
          <Text style={styles.sectionTitle}>Pourquoi ConfettiCake ?</Text>
        </Animated.View>
        <View style={[styles.valuesRow, isWide && styles.valuesRowWide]}>
          {VALUES.map((v, i) => (
            <Animated.View key={v.title} entering={FadeInUp.duration(450).delay(i * 90)} style={styles.valueCard}>
              <Text style={styles.valueEmoji}>{v.emoji}</Text>
              <Text style={styles.valueTitle}>{v.title}</Text>
              <Text style={styles.valueText}>{v.text}</Text>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* ── Cagnotte / co-signature ── */}
      <View style={[styles.section, styles.sectionAlt]}>
        <Animated.View entering={FadeInUp.duration(450)} style={[styles.potBanner, isWide && styles.potBannerWide]}>
          <View style={styles.potBannerText}>
            <Text style={styles.potEmoji}>🎁</Text>
            <Text style={styles.potTitle}>Un cadeau à plusieurs ? Lancez une cagnotte</Text>
            <Text style={styles.potText}>
              Crée une cagnotte collective, invite la famille ou les collègues, et suivez ensemble
              les contributions jusqu'au jour J — directement depuis l'application.
            </Text>
          </View>
          <TouchableOpacity style={styles.potBtn} onPress={openStore} activeOpacity={0.85}>
            <Text style={styles.potBtnText}>Découvrir l'application</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* ── FAQ ── */}
      <View style={styles.section}>
        <Animated.View entering={FadeInUp.duration(450)}>
          <Text style={styles.sectionTitle}>Questions fréquentes</Text>
        </Animated.View>
        <View style={styles.faqList}>
          {FAQ.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </View>
      </View>

      {/* ── CTA final ── */}
      <LinearGradient colors={[VIOLET_DARK, VIOLET]} style={styles.ctaSection}>
        <Animated.View entering={FadeIn.duration(500)} style={{ alignItems: 'center', gap: 14 }}>
          <Text style={styles.ctaTitle}>Prêt·e à ne plus rien oublier ?</Text>
          <Text style={styles.ctaSubtitle}>Télécharge ConfettiCake gratuitement et célèbre tes proches comme il se doit.</Text>
          <View style={styles.storeRow}>
            <TouchableOpacity style={styles.storeBtnLight} onPress={() => Linking.openURL(APP_STORE_URL).catch(() => {})} activeOpacity={0.85}>
              <Text style={styles.storeBtnIcon}>🍎</Text>
              <Text style={styles.storeBtnTextLight}>App Store</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.storeBtnLight} onPress={() => Linking.openURL(PLAY_STORE_URL).catch(() => {})} activeOpacity={0.85}>
              <Text style={styles.storeBtnIcon}>▶️</Text>
              <Text style={styles.storeBtnTextLight}>Google Play</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <Text style={styles.footerBrand}>🍰 ConfettiCake</Text>
        <View style={styles.footerLinks}>
          <Text style={styles.footerLink} onPress={() => Linking.openURL('https://confetticake.fr/cgu').catch(() => {})}>CGU</Text>
          <Text style={styles.footerDot}>·</Text>
          <Text style={styles.footerLink} onPress={() => Linking.openURL('https://confetticake.fr/confidentialite').catch(() => {})}>Confidentialité</Text>
          <Text style={styles.footerDot}>·</Text>
          <Text style={styles.footerLink} onPress={() => Linking.openURL('mailto:contact@confetticake.fr').catch(() => {})}>Contact</Text>
        </View>
        <Text style={styles.footerCopyright}>© {new Date().getFullYear()} Confettis & Cake — Tous droits réservés</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#FFFFFF' },
  pageContent: { flexGrow: 1 },

  // Hero
  hero: { paddingBottom: 48, overflow: 'hidden', position: 'relative' },
  confettiLayer: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  confettiPiece: { position: 'absolute', top: -40 },
  fireworkBurst: { position: 'absolute', width: 0, height: 0 },
  fireworkParticle: { position: 'absolute', width: 8, height: 8, borderRadius: 4, left: -4, top: -4 },
  shootingStarWrap: { position: 'absolute' },
  shootingStarRow: { flexDirection: 'row', alignItems: 'center' },
  shootingStarTrail: { flex: 1, height: 2, borderRadius: 1 },
  shootingStarHead: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#fff', marginLeft: -1 },
  heroInner: { paddingHorizontal: 24, paddingTop: 24, gap: 32 },
  heroInnerWide: { flexDirection: 'row', alignItems: 'center', maxWidth: 1100, alignSelf: 'center', width: '100%', paddingTop: 56 },
  heroText: { flex: 1.35, gap: 16 },
  brandCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  logo: { width: 230, height: 101 },
  brandSub: { fontFamily: 'PlusJakartaSans_500Medium', fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 12 },
  heroTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 38, lineHeight: 46, color: '#fff' },
  heroSubtitle: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 16, lineHeight: 24, color: '#F1E9F8', maxWidth: 480 },
  storeRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  storeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.16)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 50, paddingHorizontal: 18, paddingVertical: 12,
  },
  storeBtnIcon: { fontSize: 16 },
  storeBtnText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 14, color: '#fff' },
  storeBtnLight: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: 50, paddingHorizontal: 18, paddingVertical: 12,
  },
  storeBtnTextLight: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 14, color: VIOLET_DARK },
  trustRow: { flexDirection: 'row', gap: 18, marginTop: 4, flexWrap: 'wrap' },
  trustItem: { fontFamily: 'BeVietnamPro_500Medium', fontSize: 13, color: '#F1E9F8' },

  heroMockup: { flex: 0.85, alignItems: 'flex-end', justifyContent: 'center' },
  phoneFrame: {
    width: 300, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
    paddingVertical: 28, paddingHorizontal: 18, gap: 12,
  },
  phoneNotch: { width: 56, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.35)', alignSelf: 'center', marginBottom: 4 },
  phoneGreeting: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 15, color: '#fff', marginBottom: 2 },
  phoneCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 16, padding: 12,
  },
  phoneCardGhost: { backgroundColor: 'rgba(255,255,255,0.07)' },
  phoneCardEmoji: { fontSize: 22 },
  phoneCardTitle: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 13, color: '#fff' },
  phoneCardSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 11, color: '#E9DEF5', marginTop: 1 },

  // Sections génériques
  section: { paddingHorizontal: 24, paddingVertical: 56, maxWidth: 1100, alignSelf: 'center', width: '100%' },
  sectionAlt: { backgroundColor: '#F8F5FB' },
  sectionTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 26, color: '#302e34', textAlign: 'center' },
  sectionSubtitle: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 15, color: '#5d5a61', textAlign: 'center', marginTop: 8, marginBottom: 32, maxWidth: 560, alignSelf: 'center' },

  // Features
  cardsGrid: { gap: 16 },
  cardsGridWide: { flexDirection: 'row', flexWrap: 'wrap' },
  featureCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 22, gap: 8,
    borderWidth: 1, borderColor: '#ECE6EF',
    shadowColor: VIOLET, shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 2,
  },
  featureCardWide: { flexBasis: '47%', flexGrow: 1 },
  featureIconBadge: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  featureEmoji: { fontSize: 26 },
  featureTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 17, color: '#302e34' },
  featureText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, lineHeight: 21, color: '#5d5a61' },

  // Exemples IA
  aiGrid: { gap: 16 },
  aiGridWide: { flexDirection: 'row' },
  aiCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 20, gap: 10,
    borderWidth: 1, borderColor: '#ECE6EF',
  },
  aiCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiSparkle: { fontSize: 16 },
  aiCardLabel: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 12, color: VIOLET_DARK, textTransform: 'uppercase', letterSpacing: 0.5 },
  aiCardText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, lineHeight: 21, color: '#374151', fontStyle: 'italic' },

  // Galerie cartes
  galleryRow: { gap: 16 },
  galleryRowWide: { flexDirection: 'row', flexWrap: 'wrap' },
  galleryCard: {
    flexGrow: 1, flexBasis: '30%', minWidth: 150, height: 180, borderRadius: 22, padding: 18,
    justifyContent: 'flex-end', overflow: 'hidden',
  },
  galleryEmoji: { fontSize: 34, marginBottom: 6 },
  galleryLabel: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 14, color: '#fff' },

  // Steps
  stepsRow: { gap: 16 },
  stepsRowWide: { flexDirection: 'row' },
  stepCard: { flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 22, gap: 8, alignItems: 'flex-start' },
  stepBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: VIOLET, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  stepBadgeText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 15, color: '#fff' },
  stepTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 16, color: '#302e34' },
  stepText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, lineHeight: 20, color: '#5d5a61' },

  // Valeurs
  valuesRow: { gap: 16, marginTop: 8 },
  valuesRowWide: { flexDirection: 'row' },
  valueCard: { flex: 1, alignItems: 'center', gap: 6, padding: 16 },
  valueEmoji: { fontSize: 32, marginBottom: 4 },
  valueTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 16, color: '#302e34', textAlign: 'center' },
  valueText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, lineHeight: 19, color: '#5d5a61', textAlign: 'center', maxWidth: 260 },

  // Cagnotte banner
  potBanner: { backgroundColor: VIOLET, borderRadius: 24, padding: 32, gap: 20 },
  potBannerWide: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  potBannerText: { flex: 1, gap: 8 },
  potEmoji: { fontSize: 30 },
  potTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 20, color: '#fff' },
  potText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, lineHeight: 21, color: '#F1E9F8', maxWidth: 480 },
  potBtn: { backgroundColor: '#fff', borderRadius: 50, paddingHorizontal: 22, paddingVertical: 14, alignSelf: 'flex-start' },
  potBtnText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 14, color: VIOLET_DARK },

  // Catégories de fonctionnalités
  catList2: { gap: 10, marginTop: 8 },
  catItem: { backgroundColor: '#fff', borderRadius: 16, padding: 18, gap: 14, borderWidth: 1, borderColor: '#ECE6EF' },
  catHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  catHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  catEmoji: { fontSize: 26 },
  catTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 16, color: '#302e34' },
  catCount: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: '#9CA3AF', marginTop: 1 },
  catList: { gap: 12, paddingTop: 4 },
  catRow: { flexDirection: 'row', gap: 8 },
  catBullet: { fontSize: 14, color: VIOLET, lineHeight: 20 },
  catItemName: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 14, color: '#302e34' },
  catItemText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, lineHeight: 19, color: '#5d5a61', marginTop: 2 },

  // FAQ
  faqList: { gap: 10, marginTop: 8 },
  faqItem: { backgroundColor: '#F8F5FB', borderRadius: 16, padding: 18, gap: 10 },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  faqQuestion: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 15, color: '#302e34', flex: 1 },
  faqArrow: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 18, color: VIOLET },
  faqAnswer: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, lineHeight: 21, color: '#5d5a61' },

  // CTA final
  ctaSection: { paddingHorizontal: 24, paddingVertical: 56, alignItems: 'center', gap: 14 },
  ctaTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 24, color: '#fff', textAlign: 'center' },
  ctaSubtitle: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 15, color: '#F1E9F8', textAlign: 'center', maxWidth: 460 },

  // Footer
  footer: { paddingHorizontal: 24, paddingVertical: 32, alignItems: 'center', gap: 10, backgroundColor: '#302e34' },
  footerBrand: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 16, color: '#fff' },
  footerLinks: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  footerLink: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: '#D8D2DD' },
  footerDot: { color: '#79757c' },
  footerCopyright: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: '#79757c', marginTop: 4 },
});
