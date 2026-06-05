import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTabScrollToTop } from '../../src/hooks/useTabScrollToTop';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../src/stores/authStore';
import { useUpcomingEvents } from '../../src/hooks/useContacts';
import { useMessages } from '../../src/hooks/useAIGenerate';
import { usePartnerUpcomingEvents, usePartnerName } from '../../src/hooks/useCouple';
import { useUpcomingCustomEvents } from '../../src/hooks/useCustomEvents';
import { useCreateStore } from '../../src/hooks/../stores/createStore';
import { humanDaysUntil, isUrgent, formatDate } from '../../src/utils/dateHelpers';
import { getUpcomingHolidays } from '../../src/utils/generalHolidays';
import { getCurrentZodiacSign, getContactsInZodiacSeason } from '../../src/utils/zodiac';
import { getNamesForDate } from '../../src/utils/namedays';
import { updateWidget } from '../../src/utils/widget';
import { useContacts } from '../../src/hooks/useContacts';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { useThemeStore } from '../../src/stores/themeStore';
import { useColors } from '../../src/hooks/useColors';
import { useWeather } from '../../src/hooks/useWeather';
import type { UpcomingEvent } from '../../src/types/models';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DICTONS = [
  "Après la pluie, le beau temps.",
  "Mieux vaut tard que jamais.",
  "Les absents ont toujours tort.",
  "Quand le chat n'est pas là, les souris dansent.",
  "L'habit ne fait pas le moine.",
  "Il ne faut pas vendre la peau de l'ours avant de l'avoir tué.",
  "Qui sème le vent récolte la tempête.",
  "Les chiens aboient, la caravane passe.",
  "Pierre qui roule n'amasse pas mousse.",
  "Mieux vaut prévenir que guérir.",
  "Qui va à la chasse perd sa place.",
  "Les bons comptes font les bons amis.",
  "On ne fait pas d'omelette sans casser des œufs.",
  "Il ne faut pas mettre tous ses œufs dans le même panier.",
  "La nuit porte conseil.",
  "Qui trop embrasse mal étreint.",
  "Vouloir, c'est pouvoir.",
  "À chaque jour suffit sa peine.",
  "Le temps, c'est de l'argent.",
  "Loin des yeux, loin du cœur.",
  "Il n'y a pas de fumée sans feu.",
  "Chat échaudé craint l'eau froide.",
  "Les petits ruisseaux font les grandes rivières.",
  "On a souvent besoin d'un plus petit que soi.",
  "L'union fait la force.",
  "Rien ne sert de courir, il faut partir à point.",
  "Aide-toi, le ciel t'aidera.",
  "Tel est pris qui croyait prendre.",
  "Une hirondelle ne fait pas le printemps.",
  "À bon entendeur, salut.",
  "Qui vivra verra.",
  "Rome ne s'est pas faite en un jour.",
  "Tous les chemins mènent à Rome.",
  "La fortune sourit aux audacieux.",
  "Là où il y a une volonté, il y a un chemin.",
];

function getDictonDuJour(): string {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date().getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  return DICTONS[dayOfYear % DICTONS.length];
}

const INTRO_DISMISSED_KEY = 'cc_home_intro_dismissed';
const HOME_MODE_KEY       = 'cc_home_mode';
const WELCOME_SIMPLE_KEY  = 'cc_welcome_simple';

const INTRO_ACCORDION: { emoji: string; title: string; body: string }[] = [
  { emoji: '💌', title: 'Des messages pour toutes les occasions', body: 'Anniversaires, fêtes de prénoms, naissances, mariages, diplômes, retraites, Noël, Saint-Valentin… Des centaines de modèles prêts à l\'emploi, classés par style et par ambiance.' },
  { emoji: '✨', title: 'L\'IA qui écrit pour toi', body: 'Message unique, poème rimé, chanson, humour… en quelques secondes. Choisis le ton — touchant, décalé, poétique — et la langue (français, anglais, espagnol, et plus). Tu régénères autant de fois que tu veux.' },
  { emoji: '📅', title: 'Agenda & rappels automatiques', body: 'L\'appli surveille toutes les dates de tes contacts et t\'alerte, à ta convenance, avant chaque anniversaire et fête. Tu peux aussi créer tes propres rappels : ponctuel, hebdo, mensuel ou annuel.' },
  { emoji: '🐾', title: 'Messages du monde animal', body: 'Ton contact a un animal ? L\'IA rédige un message de sa part — avec sa jalousie, sa tendresse et ses réclamations de croquettes. Et si c\'est toi qui as un animal, laisse-le signer tes messages : rien de tel qu\'un "Bisous, Moustache 🐱" pour faire fondre quelqu\'un.' },
  { emoji: '🎁', title: 'Cagnottes & messages festifs', body: 'Organise une cagnotte collective pour un cadeau commun. Et pour aller plus loin, envoie un message festif animé — ton proche reçoit un lien qui s\'ouvre sur une animation avec son prénom, ton message et une musique de fond 🎉' },
  { emoji: '⚙️', title: 'Et encore bien d\'autres fonctions…', body: 'Lecture vocale du message avec musique de fond, mode couple pour partager l\'agenda, messages "de la part de l\'enfant", livre d\'or partageable, envois automatiques… Tu découvriras tout ça au fil du temps.' },
];

const INTRO_FEATURES: { emoji: string; text?: string; rich?: 'no-fautes' }[] = [
  { emoji: '🎁', text: 'Alertes 7 jours avant chaque anniversaire & fête' },
  { emoji: '✨', text: 'Messages IA uniques : poème, chanson, humour…' },
  { emoji: '✅', rich: 'no-fautes' },
  { emoji: '🎁', text: 'Cagnotte collective pour un cadeau commun' },
  { emoji: '🎴', text: 'Cartes animées pour un envoi encore plus festif' },
  { emoji: '🤖', text: 'Envois automatiques : programme un SMS ou email d\'anniversaire, une fois pour toutes' },
  { emoji: '⏰', text: 'Rappels personnalisés : hebdo, mensuel, annuel ou ponctuel — juste au bon moment' },
  { emoji: '💑', text: 'Mode couple : partage l\'agenda de contacts avec ton/ta partenaire' },
  { emoji: '🌟', text: 'Parrainage : gagne des crédits en invitant tes proches' },
];

// ── Confetti décoratif ────────────────────────────────────────────────────────
const CONFETTI = ['💜', '🎉', '✨', '🎁', '💛', '🌸', '⭐', '🎁'];

function ConfettiBar() {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return (
    <View style={styles.confettiBar} pointerEvents="none">
      {CONFETTI.map((c, i) => (
        <Text
          key={i}
          style={[
            styles.confettiItem,
            { top: Math.sin(i * 1.3) * 18 + 10, left: (i / CONFETTI.length) * (SCREEN_WIDTH - 40) },
          ]}
        >
          {c}
        </Text>
      ))}
    </View>
  );
}

// ── Ligne événement (liste verticale) ─────────────────────────────────────────
function EventRow({ event, onPress, onCreate }: {
  event: UpcomingEvent;
  onPress: () => void;
  onCreate?: () => void;
}) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const urgent = isUrgent(event.daysUntil);
  const initials = event.contact.name
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? '')
    .join('');
  const isBirthday = event.eventType === 'birthday';

  return (
    <TouchableOpacity
      style={[styles.eventRow, urgent && styles.eventRowUrgent]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.eventAvatar, urgent && styles.eventAvatarUrgent]}>
        <Text style={styles.eventAvatarText}>{initials}</Text>
        {urgent && (
          <View style={styles.eventBadge}>
            <Text style={styles.eventBadgeText}>🔥</Text>
          </View>
        )}
      </View>

      <View style={styles.eventInfo}>
        <Text style={styles.eventName} numberOfLines={1}>{event.contact.name}</Text>
        <Text style={[styles.eventDays, urgent && styles.eventDaysUrgent]}>
          {isBirthday && event.contact.birthday
            ? `Né·e le ${formatDate(event.contact.birthday, 'd MMMM yyyy')} · ${humanDaysUntil(event.daysUntil)}`
            : humanDaysUntil(event.daysUntil)}
        </Text>
      </View>

      {urgent && onCreate ? (
        <TouchableOpacity
          style={styles.createBtn}
          onPress={(e) => { e.stopPropagation(); onCreate(); }}
          activeOpacity={0.85}
        >
          <Text style={styles.createBtnText}>✦ Créer un message avec l'IA</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.eventChevron}>›</Text>
      )}
    </TouchableOpacity>
  );
}

// ── Section header ─────────────────────────────────────────────────────────────
function SectionHeader({ title, action, onAction }: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && onAction && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.seeAll}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Quick action button ────────────────────────────────────────────────────────
function QuickAction({ emoji, label, onPress, accent }: {
  emoji: string;
  label: string;
  onPress: () => void;
  accent?: boolean;
}) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return (
    <TouchableOpacity
      style={[styles.quickAction, accent && styles.quickActionAccent]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.quickActionEmoji}>{emoji}</Text>
      <Text style={[styles.quickActionLabel, accent && styles.quickActionLabelAccent]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── Carte message récent ───────────────────────────────────────────────────────
function RecentMessageCard({ contactName, format, status, date, onPress }: {
  contactName: string;
  format: string;
  status: string;
  date: string;
  onPress: () => void;
}) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const formatEmoji: Record<string, string> = { song: '🎵', poem: '✍️', message: '💬', joke: '✨' };
  const d = new Date(date);
  const dateLabel = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    + ' · '
    + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return (
    <TouchableOpacity style={styles.recentCard} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.recentEmoji}>{formatEmoji[format] ?? '💬'}</Text>
      <View style={styles.recentInfo}>
        <Text style={styles.recentName}>{contactName}</Text>
        <Text style={styles.recentDate}>{dateLabel}</Text>
      </View>
      <Text style={styles.recentArrow}>›</Text>
    </TouchableOpacity>
  );
}

// ── Empty section placeholder ──────────────────────────────────────────────────
function EmptySection({ emoji, text, btnLabel, onPress }: {
  emoji: string;
  text: string;
  btnLabel?: string;
  onPress?: () => void;
}) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return (
    <View style={styles.emptySection}>
      <Text style={styles.emptySectionEmoji}>{emoji}</Text>
      <Text style={styles.emptySectionText}>{text}</Text>
      {btnLabel && onPress && (
        <TouchableOpacity style={styles.emptySectionBtn} onPress={onPress}>
          <Text style={styles.emptySectionBtnText}>{btnLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Carte d'intro (masquable) ─────────────────────────────────────────────────
function IntroCard({ onHelp, onDismiss }: { onHelp: () => void; onDismiss: () => void }) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return (
    <View style={styles.introCard}>
      <View style={styles.introHeader}>
        <Text style={styles.introTitle}>✨ Tout ce que tu peux faire ici</Text>
        <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.introDismissBtn}>✕</Text>
        </TouchableOpacity>
      </View>
      {INTRO_FEATURES.map((f, i) => (
        <View key={i} style={styles.introRow}>
          <Text style={styles.introEmoji}>{f.emoji}</Text>
          {f.rich === 'no-fautes' ? (
            <Text style={styles.introText}>
              {'Messages envoyés sans '}
              <Text style={{ textDecorationLine: 'line-through', color: '#e53935', fontFamily: 'BeVietnamPro_700Bold' }}>fôte</Text>
              {'  '}
              <Text style={{ color: '#2E7D32', fontFamily: 'BeVietnamPro_700Bold' }}>faute ✓</Text>
              {' — l\'IA soigne chaque mot !'}
            </Text>
          ) : (
            <Text style={styles.introText}>{f.text}</Text>
          )}
        </View>
      ))}
      <TouchableOpacity style={styles.introHelpBtn} onPress={onHelp} activeOpacity={0.8}>
        <Text style={[styles.introHelpBtnText, { color: C.primary }]}>📖 Mode d'emploi complet</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Bouton de rappel (quand IntroCard masquée) ────────────────────────────────
function IntroCardHint({ onShow }: { onShow: () => void }) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return (
    <TouchableOpacity style={styles.introHint} onPress={onShow} activeOpacity={0.75}>
      <Text style={[styles.introHintText, { color: C.primary }]}>✨ Tout ce que tu peux faire ici</Text>
      <Text style={[styles.introHintChevron, { color: C.primary }]}>›</Text>
    </TouchableOpacity>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const router = useRouter();
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);
  const appTheme = useThemeStore((s) => s.theme);
  const events = useUpcomingEvents(30);
  const partnerEvents = usePartnerUpcomingEvents(30);
  const partnerName = usePartnerName();
  const { data: contacts = [] } = useContacts();
  const { data: messages = [] } = useMessages();
  const customEvents = useUpcomingCustomEvents(365);
  const upcomingHolidaysCount = useMemo(() => getUpcomingHolidays(365).length, []);
  const { reset, setContact, setOccasion } = useCreateStore();
  const scrollRef = useRef<ScrollView>(null);
  useTabScrollToTop('index', () => scrollRef.current?.scrollTo({ y: 0, animated: false }));
  useFocusEffect(useCallback(() => { scrollRef.current?.scrollTo({ y: 0, animated: false }); }, []));

  const [introVisible, setIntroVisible] = useState(true);
  const [homeMode, setHomeMode] = useState<'simple' | 'advanced'>('simple');
  const [showSimpleWelcome, setShowSimpleWelcome] = useState(true);
  const [featAccordionOpen, setFeatAccordionOpen] = useState<number | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync(INTRO_DISMISSED_KEY).then((val) => {
      if (val === 'true') setIntroVisible(false);
    });
    SecureStore.getItemAsync(HOME_MODE_KEY).then((val) => {
      if (val === 'advanced') setHomeMode('advanced');
    });
    SecureStore.getItemAsync(WELCOME_SIMPLE_KEY).then((val) => {
      if (val === 'closed') setShowSimpleWelcome(false);
    });
  }, []);

  const toggleHomeMode = useCallback(async () => {
    const next = homeMode === 'simple' ? 'advanced' : 'simple';
    setHomeMode(next);
    await SecureStore.setItemAsync(HOME_MODE_KEY, next);
  }, [homeMode]);

  const [briefsOpen, setBriefsOpen] = useState(false);
  const [weatherOpen, setWeatherOpen] = useState(false);
  useEffect(() => {
    SecureStore.getItemAsync('cc_briefs_open').then((val) => {
      if (val === 'open') setBriefsOpen(true);
    });
  }, []);

  // Fête du jour
  const todayMmdd = useMemo(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${mm}-${dd}`;
  }, []);
  const todayNames = useMemo(() => getNamesForDate(todayMmdd), [todayMmdd]);
  const handleDismissIntro = useCallback(async () => {
    setIntroVisible(false);
    await SecureStore.setItemAsync(INTRO_DISMISSED_KEY, 'true');
  }, []);
  const handleShowIntro = useCallback(async () => {
    setIntroVisible(true);
    await SecureStore.deleteItemAsync(INTRO_DISMISSED_KEY);
  }, []);

  // Mise à jour du widget Android à chaque chargement des événements
  useEffect(() => {
    if (!events.length) return;
    const widgetEvents = events
      .filter((e) => e.daysUntil >= 0 && e.daysUntil <= 60)
      .slice(0, 10)
      .map((e) => ({
        type: e.eventType === 'birthday' ? 'birthday' as const : 'nameday' as const,
        name: e.contact.name.split(' ')[0],
        days: e.daysUntil,
      }));
    updateWidget(widgetEvents);
  }, [events]);

  // Tous les événements — pour le tagline hero (résumé global)
  const allBirthdayEvents = events.filter((e) => e.eventType === 'birthday');
  const allNameDayEvents  = events.filter((e) => e.eventType === 'name_day');
  const urgentBirthdays = allBirthdayEvents.filter((e) => isUrgent(e.daysUntil)).length;
  const urgentNameDays  = allNameDayEvents.filter((e) => isUrgent(e.daysUntil)).length;
  // Événements à partir de J+2 — pour le bloc résumé "Dans les jours qui viennent"
  const birthdayEvents = events.filter((e) => e.eventType === 'birthday' && e.daysUntil > 1);
  const nameDayEvents  = events.filter((e) => e.eventType === 'name_day'  && e.daysUntil > 1);
  const recentSent   = messages.filter((m) => m.status === 'sent').slice(0, 3);
  const recentDrafts = messages.filter((m) => m.status === 'draft').slice(0, 3);

  // Événements aujourd'hui ou demain
  const imminentEvents = events.filter((e) => e.daysUntil <= 1);

  // Événements custom urgents (dans les 15 prochains jours)
  const urgentCustomEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return customEvents.filter((e) => {
      const [y, mo, d] = e.event_date.split('-').map(Number);
      const diff = Math.round((new Date(y, mo - 1, d).getTime() - today.getTime()) / 86400000);
      return diff >= 0 && diff <= 15;
    });
  }, [customEvents]);

  const { weather } = useWeather();

  const firstName = profile?.full_name?.split(' ')[0] ?? 'toi';
  const greeting = getGreeting(firstName, t);
  const greetingEmojis = getGreetingEmojis();

  const tagline = buildTagline(urgentBirthdays, urgentNameDays, urgentCustomEvents.length);

  const handleEventPress = useCallback(
    (event: UpcomingEvent) => router.push(`/(app)/contact/${event.contact.id}` as never),
    [router],
  );

  const handleCreate = useCallback(
    (event: UpcomingEvent) => {
      router.push({
        pathname: '/(app)/create/index',
        params: { contactId: event.contact.id },
      } as never);
    },
    [router],
  );

  // Contacts en saison zodiacale
  const zodiacSeasonContacts = useMemo(() => getContactsInZodiacSeason(contacts), [contacts]);
  const currentZodiacSign = useMemo(() => getCurrentZodiacSign(), []);

  // Lance le générateur depuis l'accueil (choix du mode sur create/index)
  const handleQuickSend = useCallback(
    (event: UpcomingEvent) => {
      reset();
      setContact(event.contact.id, event.contact.name, event.contact.relation);
      setOccasion(event.eventType === 'birthday' ? 'birthday' : 'nameday');
      router.push({
        pathname: '/(app)/create/index',
        params: { contactId: event.contact.id },
      } as never);
    },
    [reset, setContact, setOccasion, router],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ══════════════════════ MODE SIMPLE ═════════════════════════ */}
        {homeMode === 'simple' && (
          <>
            {/* Bienvenue Jean */}
            <View style={{ marginHorizontal: Spacing[4], marginTop: Spacing[3], gap: 2 }}>
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant }}>{greetingEmojis}</Text>
              <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 26, color: Colors.onSurface, lineHeight: 32 }}>{greeting} 👋</Text>
            </View>

            {/* Brèves du jour */}
            <TouchableOpacity
              style={{ marginHorizontal: Spacing[4], marginTop: Spacing[3], backgroundColor: '#F3EFFF', borderRadius: Radii.xl, borderWidth: 1.5, borderColor: '#C4B5FD', padding: 14 }}
              onPress={() => { const next = !briefsOpen; setBriefsOpen(next); SecureStore.setItemAsync('cc_briefs_open', next ? 'open' : 'closed'); }}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: '#7C3AED' }}>
                  ☀️ Les brèves du jour
                </Text>
                <Text style={{ color: '#7C3AED', fontSize: 14 }}>{briefsOpen ? '▲' : '▼'}</Text>
              </View>
              {!briefsOpen && (
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: '#9333EA', marginTop: 4 }}>Météo · fête & dicton · zodiaque…</Text>
              )}
              {briefsOpen && (
                <View style={{ marginTop: 12, gap: 10 }}>
                  {/* Météo widget */}
                  {weather && (() => {
                    const bgColor = weather.emoji.includes('☀') ? '#FEF9C3' : weather.emoji.includes('🌧') || weather.emoji.includes('⛈') ? '#DBEAFE' : weather.emoji.includes('❄') ? '#EFF6FF' : '#F0FDF4';
                    const txtColor = weather.emoji.includes('☀') ? '#92400E' : weather.emoji.includes('🌧') || weather.emoji.includes('⛈') ? '#1E3A5F' : '#166534';
                    return (
                      <TouchableOpacity
                        style={{ backgroundColor: bgColor, borderRadius: Radii.lg, padding: 12, gap: 8 }}
                        onPress={() => setWeatherOpen(v => !v)}
                        activeOpacity={0.85}
                      >
                        {/* Ligne principale */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <Text style={{ fontSize: 28 }}>{weather.emoji}</Text>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: txtColor }}>{weather.temp}°C · {weather.description}</Text>
                            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: txtColor, opacity: 0.75 }}>Ressenti {weather.apparentTemp}°C{weather.city ? ` · 📍 ${weather.city}` : ''}</Text>
                            <Text style={{ fontFamily: 'BeVietnamPro_500Medium', fontSize: Typography.xs, color: txtColor, marginTop: 2 }}>
                              {weather.emoji.includes('☀') ? '😎 Parfait pour sortir !' : weather.emoji.includes('🌧') ? '☂️ Prévois un parapluie !' : weather.emoji.includes('⛈') ? '⚡ Reste à l\'abri !' : weather.emoji.includes('❄') || weather.emoji.includes('🌨') ? '🧤 Couvre-toi bien !' : weather.emoji.includes('🌦') ? '🌈 Variable — garde un œil !' : weather.emoji.includes('🌫') ? '👀 Visibilité réduite.' : weather.emoji.includes('🌤') ? '🙂 Agréable, profites-en !' : '🌡️ Temps variable.'}
                            </Text>
                          </View>
                          <Text style={{ color: txtColor, opacity: 0.6 }}>{weatherOpen ? '▲' : '▼'}</Text>
                        </View>
                        {/* Horaires */}
                        {weatherOpen && weather.hourly.length > 0 && (
                          <View style={{ gap: 4 }}>
                            <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: txtColor, opacity: 0.7 }}>Aujourd'hui</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled>
                              <View style={{ flexDirection: 'row', gap: 8 }}>
                                {weather.hourly.map((h, i) => (
                                  <View key={i} style={{ alignItems: 'center', gap: 2, minWidth: 44, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: Radii.md, padding: 6 }}>
                                    <Text style={{ fontSize: 16 }}>{h.emoji}</Text>
                                    <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 11, color: txtColor }}>{h.temp}°</Text>
                                    <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 10, color: txtColor, opacity: 0.7 }}>{h.label}</Text>
                                  </View>
                                ))}
                              </View>
                            </ScrollView>
                          </View>
                        )}
                        {/* Semaine */}
                        {weatherOpen && weather.daily.length > 0 && (
                          <View style={{ gap: 4 }}>
                            <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: txtColor, opacity: 0.7 }}>Cette semaine</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled>
                              <View style={{ flexDirection: 'row', gap: 8 }}>
                                {weather.daily.map((d, i) => (
                                  <View key={i} style={{ alignItems: 'center', gap: 2, minWidth: 48, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: Radii.md, padding: 6 }}>
                                    <Text style={{ fontSize: 16 }}>{d.emoji}</Text>
                                    <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 11, color: txtColor }}>{d.max}°</Text>
                                    <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 10, color: txtColor, opacity: 0.7 }}>{d.min}°</Text>
                                    <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 10, color: txtColor, opacity: 0.6 }}>{d.label}</Text>
                                  </View>
                                ))}
                              </View>
                            </ScrollView>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })()}
                  {/* Fête du jour */}
                  {todayNames.length > 0 && (
                    <TouchableOpacity
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FDF4FF', borderRadius: Radii.lg, padding: 10 }}
                      onPress={() => router.push('/(app)/calendar' as never)}
                      activeOpacity={0.8}
                    >
                      <Text style={{ fontSize: 24 }}>🌸</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: '#7C3AED' }}>
                          {todayNames.join(' · ')}
                        </Text>
                        <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: '#9333EA' }}>
                          Fête du jour · appuie pour voir l'agenda
                        </Text>
                      </View>
                      <Text style={{ color: '#C084FC' }}>›</Text>
                    </TouchableOpacity>
                  )}

                  {/* Dicton du jour */}
                  <View style={{ backgroundColor: '#FFFBEB', borderRadius: Radii.lg, padding: 10, borderLeftWidth: 3, borderLeftColor: '#F59E0B' }}>
                    <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: '#92400E', marginBottom: 3 }}>📜 Dicton du jour</Text>
                    <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: '#78350F', lineHeight: 20, fontStyle: 'italic' }}>
                      "{getDictonDuJour()}"
                    </Text>
                  </View>
                  {/* Zodiaque */}
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }} onPress={() => router.push('/(app)/zodiac-season' as never)} activeOpacity={0.8}>
                    <Text style={{ fontSize: 24 }}>{currentZodiacSign.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: Colors.onSurface }}>{currentZodiacSign.name}</Text>
                      <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant, fontStyle: 'italic' }}>{currentZodiacSign.trait}</Text>
                    </View>
                    <Text style={{ color: Colors.outlineVariant }}>›</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>

            {/* Carte Bienvenue */}
            <LinearGradient colors={['#7C3AED', '#9b6bb5', '#c084fc']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.welcomeCard}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: showSimpleWelcome ? 10 : 0 }} onPress={() => { const next = !showSimpleWelcome; setShowSimpleWelcome(next); SecureStore.setItemAsync(WELCOME_SIMPLE_KEY, next ? 'open' : 'closed'); }} activeOpacity={0.75}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 11, color: 'rgba(255,255,255,0.75)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4 }}>🎂 Confettis & Cake</Text>
                  <Text style={styles.welcomeCardTitle}>Bienvenue ! 🎉</Text>
                </View>
                <Text style={{ fontSize: 20, color: 'rgba(255,255,255,0.9)' }}>{showSimpleWelcome ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {!showSimpleWelcome && (
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 18 }}>L'appli qui t'aide à ne jamais oublier une occasion 💌 — appuie pour en savoir plus</Text>
              )}
              {showSimpleWelcome && (
                <>
                  <Text style={styles.welcomeTagline}>L'appli qui t'aide à ne jamais oublier une occasion — et à envoyer des messages qui touchent vraiment. 💌</Text>
                  {INTRO_ACCORDION.map((item, i) => (
                    <TouchableOpacity key={i} style={styles.introAccItem} onPress={() => setFeatAccordionOpen(featAccordionOpen === i ? null : i)} activeOpacity={0.85}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Text style={styles.introAccEmoji}>{item.emoji}</Text>
                        <Text style={[styles.introAccTitle, { flex: 1 }]}>{item.title}</Text>
                        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{featAccordionOpen === i ? '▲' : '▼'}</Text>
                      </View>
                      {featAccordionOpen === i && <Text style={styles.introAccBodyText}>{item.body}</Text>}
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </LinearGradient>

            {/* Note onboarding */}
            <View style={styles.onboardingNote}>
              <Text style={styles.onboardingNoteText}>{'Pour démarrer en douceur, tu es en '}<Text style={styles.onboardingNoteBold}>mode apprentissage</Text>{" — l'essentiel à portée de main. Passe en "}<Text style={styles.onboardingNoteBold}>mode complet</Text>{' à tout moment pour tout débloquer.'}</Text>
              <Text style={styles.onboardingNoteFooter}>Bonne découverte… et régale-toi 🍰</Text>
            </View>
            <TouchableOpacity style={styles.modeSmallBtn} onPress={toggleHomeMode} activeOpacity={0.85}>
              <Text style={styles.modeSmallBtnText}>🍭 Passer en mode complet</Text>
            </TouchableOpacity>

            {/* Étapes */}
            <Text style={[styles.pageTitle, { textAlign: 'center' }]}>Par où commencer ? 👋</Text>
            <Text style={styles.pageSubtitle}>{'Commence par créer ton profil. Puis ajoute tes contacts. Tu pourras ensuite leur envoyer des messages.'}</Text>

            {/* Étape 1 — Profil */}
            <TouchableOpacity style={styles.profileIntroCard} onPress={() => router.push('/(app)/profile' as never)} activeOpacity={0.85}>
              <View style={styles.profileIntroBadge}><Text style={styles.profileIntroBadgeText}>👆 Étape 1</Text></View>
              <View style={styles.profileIntroBody}>
                <Text style={styles.profileIntroEmoji}>📋</Text>
                <View style={styles.profileIntroCenter}>
                  <Text style={styles.profileIntroTitle}>Crée ton profil</Text>
                  <Text style={styles.profileIntroDesc}>{"Renseigne ta civilité, ton prénom, ton nom et ta date de naissance -- l'IA s'en sert pour personnaliser chaque message et signature. Et n'oublie pas de personnaliser l'application avec l'une des 9 couleurs disponibles pour créer ton ambiance préférée."}</Text>
                  <TouchableOpacity style={styles.profileIntroBtn} onPress={() => router.push('/(app)/profile' as never)} activeOpacity={0.85}>
                    <Text style={styles.profileIntroBtnText}>Créer mon profil 🎉</Text>
                    <View style={styles.profileIntroBtnArrow}><Text style={styles.profileIntroBtnArrowText}>›</Text></View>
                  </TouchableOpacity>
                </View>
                <Text style={styles.profileIntroRightEmoji}>✨</Text>
              </View>
            </TouchableOpacity>

            {/* Étape 2 — Contacts */}
            <View style={styles.featuredCard}>
              <View style={styles.contactBadge}><Text style={styles.contactBadgeText}>👆 Étape 2</Text></View>
              <View style={styles.featuredBody}>
                <Text style={styles.featuredLeftEmoji}>👥</Text>
                <View style={styles.featuredCenter}>
                  <Text style={styles.featuredTitle}>Ajoute tes contacts</Text>
                  <Text style={styles.featuredSub}>{'Commence par exemple par tes proches.'}</Text>
                  <TouchableOpacity style={styles.featuredBtn} onPress={() => router.push('/(app)/contacts' as never)} activeOpacity={0.85}>
                    <Text style={styles.featuredBtnText}>Ajouter 🎉</Text>
                    <View style={styles.featuredBtnArrow}><Text style={styles.featuredBtnArrowText}>›</Text></View>
                  </TouchableOpacity>
                </View>
                <Text style={styles.featuredRightEmoji}>🎂</Text>
              </View>
            </View>

            {/* Étape 3 — Message */}
            <View style={[styles.featuredCard, styles.messageCard]}>
              <View style={styles.messageBadge}><Text style={styles.messageBadgeText}>👆 Étape 3</Text></View>
              <View style={styles.featuredBody}>
                <Text style={styles.featuredLeftEmoji}>💬</Text>
                <View style={styles.featuredCenter}>
                  <Text style={styles.featuredTitle}>Crée un message</Text>
                  <Text style={styles.featuredSub}>{'Avec ConfettiCake, tu as plusieurs façons de créer un message pour tes proches.\nChoisis celle qui te convient le mieux !\n\nTu peux même envoyer un message à un animal… ou un message de la part d\'un animal 🐾 (lol)'}</Text>
                  <TouchableOpacity style={[styles.featuredBtn, styles.messageBtnColor]} onPress={() => router.push({ pathname: '/(app)/create', params: { fromGuide: '1' } } as never)} activeOpacity={0.85}>
                    <Text style={styles.featuredBtnText}>Créer 🎉</Text>
                    <View style={styles.featuredBtnArrow}><Text style={styles.featuredBtnArrowText}>›</Text></View>
                  </TouchableOpacity>
                </View>
                <Text style={styles.featuredRightEmoji}>✨</Text>
              </View>
            </View>

            {/* Carte animaux */}
            <View style={{ borderRadius: Radii.xl, backgroundColor: '#064E3B', padding: Spacing[4], gap: 12, marginTop: 32, marginHorizontal: 16 }}>
              <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 17, color: '#6EE7B7', lineHeight: 24 }}>{'🐾 C\'est la grande nouveauté de ConfettiCake : vos animaux de compagnie peuvent désormais… écrire des messages !'}</Text>
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: 'rgba(255,255,255,0.88)', lineHeight: 22 }}>{'Bon, c\'est l\'IA qui tient la plume — mais le résultat est bluffant 😄\nTon chien qui écrit à ta mère pour lui souhaiter sa fête. Le chat de ta sœur qui lui souhaite sa fête — avec toute l\'indifférence dont il est capable.\nEt ça marche dans les deux sens : tu peux aussi écrire directement à l\'animal d\'un contact pour son anniversaire ou sa fête.'}</Text>
              <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: '#6EE7B7' }}>{'👉 Explore cette fonction depuis la fiche d\'un contact — ou depuis le générateur de messages (bouton "Créer un message" ci-dessus et dans le menu de bas de page).'}</Text>
            </View>

            {/* Carte morse */}
            <View style={{ borderRadius: Radii.xl, backgroundColor: '#1E1B4B', padding: Spacing[4], gap: 10, marginTop: 16, marginHorizontal: 16 }}>
              <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 15, color: '#A5B4FC', lineHeight: 22 }}>🤫 Psst… tes messages festifs cachent un secret</Text>
              <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 18, color: '#E0E7FF', letterSpacing: 4, textAlign: 'center' }}>{'... . -.-. .-. . -'}</Text>
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: 'rgba(165,180,252,0.7)', textAlign: 'center', fontStyle: 'italic' }}>(ça veut dire "SECRET" en morse)</Text>
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: 'rgba(255,255,255,0.75)', lineHeight: 20 }}>{'Chaque message festif animé que tu envoies contient ton texte codé en morse. Ton proche peut l\'écouter en bips, le décoder… ou juste trouver ça complètement barré. 😄\n\nC\'est accessible dans le lien de la carte — cherche le panneau 📡'}</Text>
            </View>

            {/* Grille accès rapide */}
            <Text style={styles.quickSectionLabel}>🗺️ Accès rapide — toutes les fonctions</Text>
            <Text style={styles.quickSectionSub}>{"Ces boutons te donnent accès en un clic à toutes les fonctions de l'appli : agenda, contacts, cartes, cagnotte, numérologie et bien plus."}</Text>
            <View style={styles.quickGrid}>
              <QuickAction emoji="😎"  label="Mode Jeune"          onPress={() => router.push('/(app)/mode-jeune' as never)} />
              <QuickAction emoji="📅"  label="Ton agenda"          onPress={() => router.push('/(app)/calendar' as never)} />
              <QuickAction emoji="🗓️" label="Créer un événement"  onPress={() => router.push('/(app)/calendar/new-event' as never)} />
              <QuickAction emoji="🎊"  label="Festif animé"        onPress={() => router.push('/(app)/cards/' as never)} />
              <QuickAction emoji="👥"  label="Mes contacts"        onPress={() => router.push('/(app)/contacts' as never)} />
              <QuickAction emoji="🐷"  label="Cagnotte"            onPress={() => router.push('/(app)/cagnotte-guide' as never)} />
              <QuickAction emoji="📊"  label="Tableau de bord"     onPress={() => router.push('/(app)/dashboard' as never)} />
              <QuickAction emoji="🔢"  label="Numérologie"         onPress={() => router.push('/(app)/numerologie' as never)} />
              <QuickAction emoji="⭐"  label="Zodiaque"             onPress={() => router.push('/(app)/zodiac-season' as never)} />
              <QuickAction emoji="💫"  label="Compatibilité"       onPress={() => router.push('/(app)/compat' as never)} />
            </View>

            {/* Info strip */}
            <View style={styles.infoStrip}>
              <TouchableOpacity style={[styles.infoChip, { flex: 1 }]} onPress={() => router.push('/(app)/help' as never)} activeOpacity={0.75}>
                <Text style={styles.infoChipEmoji}>❓</Text>
                <Text style={styles.infoChipText}>Aide & mode d'emploi</Text>
              </TouchableOpacity>
            </View>

            {/* Bannière bas */}
            <TouchableOpacity style={styles.bottomBanner} onPress={toggleHomeMode} activeOpacity={0.9}>
              <View style={{ flex: 1 }}>
                <Text style={styles.bottomBannerTitle}>Envie de tout découvrir ? 🪄</Text>
                <View style={styles.bottomBannerBtn}><Text style={styles.bottomBannerBtnText}>Passer en mode complet 🍭</Text><Text style={styles.bottomBannerArrow}> ›</Text></View>
                <Text style={styles.bottomBannerSub}>Accède à toutes les fonctionnalités</Text>
              </View>
              <Text style={styles.bottomBannerEmoji}>🎉</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ══════════════════════ MODE COMPLET ════════════════════════ */}
        {homeMode === 'advanced' && (
          <>
            {/* Grille navigation rapide */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: Spacing[4], marginTop: Spacing[5], marginBottom: Spacing[2] }}>
              <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.lg, color: Colors.onSurface }}>Navigation rapide · l'essentiel</Text>
              <TouchableOpacity onPress={toggleHomeMode} activeOpacity={0.75} style={{ backgroundColor: '#F3EFFF', borderRadius: Radii.full, paddingVertical: 6, paddingHorizontal: 12 }}>
                <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: '#7C3AED' }}>← Mode apprentissage</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.quickGrid}>
              <QuickAction emoji="💬✨" label="Créer un message"    onPress={() => router.push('/(app)/create' as never)} accent />
              <QuickAction emoji="😎"   label="Mode Jeune"           onPress={() => router.push('/(app)/mode-jeune' as never)} />
              <QuickAction emoji="👥"   label="Mes contacts"         onPress={() => router.push('/(app)/contacts' as never)} />
              <QuickAction emoji="🎊"   label="Festif animé"         onPress={() => router.push('/(app)/cards/' as never)} />
              <QuickAction emoji="🎁"   label="Créer une cagnotte"   onPress={() => router.push('/(app)/pot/new' as never)} />
              <QuickAction emoji="📋"   label="Mes cagnottes"        onPress={() => router.push('/(app)/pot' as never)} />
              <QuickAction emoji="🌟"   label="Parrainage"           onPress={() => router.push('/(app)/referral/' as never)} />
              <QuickAction emoji="🤖"   label="Envois automatiques"  onPress={() => router.push('/(app)/auto-sends/' as never)} />
              <QuickAction emoji="⏰"   label="Rappels personnalisés" onPress={() => router.push('/(app)/reminders/' as never)} />
              <QuickAction emoji="🔢"   label="Numérologie"          onPress={() => router.push('/(app)/numerologie' as never)} />
              <QuickAction emoji="⭐"   label="Zodiaque"              onPress={() => router.push('/(app)/zodiac-season' as never)} />
              <QuickAction emoji="💞"   label="Compatibilité"        onPress={() => router.push('/(app)/compat' as never)} />
              <QuickAction emoji="🗓️"  label="Créer un événement"   onPress={() => router.push('/(app)/calendar/new-event' as never)} />
            </View>

            {/* Derniers messages */}
            {recentSent.length > 0 && (
              <>
                <Text style={[styles.quickSectionLabel, { marginTop: Spacing[4] }]}>Derniers messages envoyés</Text>
                <View style={styles.recentList}>
                  {recentSent.map((msg) => (
                    <RecentMessageCard key={msg.id} contactName={msg.contact_name} format={msg.format} status={msg.status} date={msg.created_at} onPress={() => router.push(`/(app)/message/${msg.id}` as never)} />
                  ))}
                  <TouchableOpacity onPress={() => router.push({ pathname: '/(app)/creations', params: { filter: 'sent' } } as never)} style={{ alignSelf: 'center', marginTop: 4 }}>
                    <Text style={styles.collapseSeeAll}>Voir tout →</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Carte morse */}
            <View style={{ borderRadius: Radii.xl, backgroundColor: '#1E1B4B', padding: Spacing[4], gap: 10, marginTop: 16, marginHorizontal: 16 }}>
              <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 15, color: '#A5B4FC', lineHeight: 22 }}>🤫 Psst… tes messages festifs cachent un secret</Text>
              <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 18, color: '#E0E7FF', letterSpacing: 4, textAlign: 'center' }}>{'... . -.-. .-. . -'}</Text>
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: 'rgba(165,180,252,0.7)', textAlign: 'center', fontStyle: 'italic' }}>(ça veut dire "SECRET" en morse)</Text>
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: 'rgba(255,255,255,0.75)', lineHeight: 20 }}>{'Chaque message festif animé que tu envoies contient ton texte codé en morse. Ton proche peut l\'écouter en bips, le décoder… ou juste trouver ça complètement barré. 😄\n\nC\'est accessible dans le lien de la carte — cherche le panneau 📡'}</Text>
            </View>

            {/* Info strip */}
            <View style={styles.infoStrip}>
              <TouchableOpacity style={[styles.infoChip, { flex: 1 }]} onPress={() => router.push('/(app)/help' as never)} activeOpacity={0.75}>
                <Text style={styles.infoChipEmoji}>❓</Text>
                <Text style={styles.infoChipText}>Aide & mode d'emploi</Text>
              </TouchableOpacity>
            </View>

            {/* Retour en mode simple */}
            <TouchableOpacity style={{ alignSelf: 'center', padding: 12, marginBottom: 8 }} onPress={toggleHomeMode} activeOpacity={0.75}>
              <Text style={{ fontFamily: 'BeVietnamPro_500Medium', fontSize: Typography.sm, color: Colors.onSurfaceVariant }}>← Revenir en mode apprentissage</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ══ Ancien contenu v1 (masqué) ══ */}
        {false && (<>
        <LinearGradient
          colors={appTheme.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <ConfettiBar />
          <View style={styles.heroBtnRow}>
            <TouchableOpacity
              style={styles.cakeBtn}
              onPress={() => router.push('/welcome' as never)}
              activeOpacity={0.75}
            >
              <Text style={styles.cakeBtnText}>Accueil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={() => router.push('/(app)/search' as never)}
              activeOpacity={0.75}
            >
              <Text style={styles.searchBtnText}>🔍</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroContent}>
            <Text style={styles.heroEmojis}>{greetingEmojis}</Text>
            <Text style={styles.heroGreeting}>{greeting}</Text>
            <TouchableOpacity
              onPress={() => router.push('/(app)/upcoming-events' as never)}
              activeOpacity={0.75}
            >
              <Text style={styles.heroTagline} numberOfLines={2} adjustsFontSizeToFit>{tagline}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* ── Météo locale ─────────────────────────────── */}
        {weather && (
          <View style={styles.weatherCard}>
            <Text style={styles.weatherEmoji}>{weather.emoji}</Text>
            <View style={styles.weatherInfo}>
              <Text style={styles.weatherTemp}>{weather.temp}°C · {weather.description}</Text>
              {weather.city && (
                <Text style={styles.weatherCity}>📍 {weather.city}</Text>
              )}
            </View>
          </View>
        )}

        {/* ── Signe du moment ──────────────────────────── */}
        <TouchableOpacity
          style={styles.zodiacSignBlock}
          onPress={() => router.push('/(app)/zodiac-season' as never)}
          activeOpacity={0.8}
        >
          <Text style={styles.zodiacSignEmoji}>{currentZodiacSign.emoji}</Text>
          <View style={styles.zodiacSignInfo}>
            <Text style={styles.zodiacSignTitle}>Signe du moment · {currentZodiacSign.name}</Text>
            <Text style={styles.zodiacSignTrait} numberOfLines={1}>{currentZodiacSign.trait}</Text>
            <Text style={styles.zodiacSignSub}>
              {zodiacSeasonContacts.length > 0
                ? `${zodiacSeasonContacts.length} contact${zodiacSeasonContacts.length > 1 ? 's' : ''} concerné${zodiacSeasonContacts.length > 1 ? 's' : ''}`
                : 'Aucun contact pour ce signe'}
            </Text>
          </View>
          <Text style={styles.zodiacSignChevron}>›</Text>
        </TouchableOpacity>

        {/* ── Carte intro masquable ────────────────────── */}
        {introVisible
          ? <IntroCard
              onHelp={() => router.push('/(app)/help' as never)}
              onDismiss={handleDismissIntro}
            />
          : <IntroCardHint onShow={handleShowIntro} />
        }

        {/* ── Aujourd'hui & Demain ──────────────────────── */}
        <View style={styles.imminentSection}>
          <Text style={styles.imminentTitle}>Aujourd'hui et demain dans ton agenda :</Text>
          {imminentEvents.length > 0 ? imminentEvents.map((event) => {
            const dayLabel = event.daysUntil === 0 ? "Aujourd'hui" : 'Demain';
            const eventEmoji = event.eventType === 'birthday' ? '🎁' : '🌸';
            return (
              <View key={`${event.contact.id}-${event.eventType}`} style={styles.imminentCard}>
                <View style={styles.imminentLeft}>
                  <Text style={styles.imminentEmoji}>{eventEmoji}</Text>
                  <View>
                    <Text style={styles.imminentName}>{event.contact.name}</Text>
                    <Text style={styles.imminentDay}>{dayLabel} · {event.eventType === 'birthday' ? 'Anniversaire' : 'Fête'}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.imminentBtn}
                  activeOpacity={0.8}
                  onPress={() => handleQuickSend(event)}
                >
                  <Text style={styles.imminentBtnText}>✨ Envoyer</Text>
                </TouchableOpacity>
              </View>
            );
          }) : (
            <View style={styles.imminentEmpty}>
              <Text style={styles.imminentEmptyText}>😌 Rien en vue, tout est calme ✨</Text>
            </View>
          )}
        </View>

        {/* ── Événements à venir (résumé cliquable) ─────── */}
        <Text style={[styles.imminentTitle, { marginLeft: Spacing[4], marginTop: Spacing[5] }]}>Dans les jours qui suivent :</Text>
        <View style={styles.eventSummaryList}>
          <TouchableOpacity
            style={styles.eventSummaryRow}
            activeOpacity={0.75}
            onPress={() => router.push('/(app)/calendar' as never)}
          >
            <Text style={styles.eventSummaryEmoji}>🎁</Text>
            <Text style={styles.eventSummaryLabel}>{t('home.birthdays')}</Text>
            {birthdayEvents.length > 0 && (
              <View style={styles.eventSummaryBadge}>
                <Text style={styles.eventSummaryBadgeText}>{birthdayEvents.length}</Text>
              </View>
            )}
            <Text style={styles.eventSummaryChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.eventSummaryRow}
            activeOpacity={0.75}
            onPress={() => router.push({ pathname: '/(app)/calendar', params: { type: 'name_day' } } as never)}
          >
            <Text style={styles.eventSummaryEmoji}>🌸</Text>
            <Text style={styles.eventSummaryLabel}>Les fêtes des prénoms à venir</Text>
            {nameDayEvents.length > 0 && (
              <View style={styles.eventSummaryBadge}>
                <Text style={styles.eventSummaryBadgeText}>{nameDayEvents.length}</Text>
              </View>
            )}
            <Text style={styles.eventSummaryChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.eventSummaryRow}
            activeOpacity={0.75}
            onPress={() => router.push({ pathname: '/(app)/calendar', params: { type: 'custom' } } as never)}
          >
            <Text style={styles.eventSummaryEmoji}>📅</Text>
            <Text style={styles.eventSummaryLabel}>{t('home.otherEvents')}</Text>
            {customEvents.length > 0 && (
              <View style={styles.eventSummaryBadge}>
                <Text style={styles.eventSummaryBadgeText}>{customEvents.length}</Text>
              </View>
            )}
            <Text style={styles.eventSummaryChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.eventSummaryRow}
            activeOpacity={0.75}
            onPress={() => router.push({ pathname: '/(app)/calendar', params: { type: 'holidays' } } as never)}
          >
            <Text style={styles.eventSummaryEmoji}>🗓</Text>
            <Text style={styles.eventSummaryLabel}>Les fêtes spéciales à venir</Text>
            {upcomingHolidaysCount > 0 && (
              <View style={styles.eventSummaryBadge}>
                <Text style={styles.eventSummaryBadgeText}>{upcomingHolidaysCount}</Text>
              </View>
            )}
            <Text style={styles.eventSummaryChevron}>›</Text>
          </TouchableOpacity>

          {partnerName && (
            <TouchableOpacity
              style={[styles.eventSummaryRow, { borderLeftWidth: 3, borderLeftColor: '#FF6B9D' }]}
              activeOpacity={0.75}
              onPress={() => router.push('/(app)/couple/' as never)}
            >
              <Text style={styles.eventSummaryEmoji}>💑</Text>
              <Text style={styles.eventSummaryLabel}>Agenda de {partnerName}</Text>
              {partnerEvents.length > 0 && (
                <View style={styles.eventSummaryBadge}>
                  <Text style={styles.eventSummaryBadgeText}>{partnerEvents.length}</Text>
                </View>
              )}
              <Text style={styles.eventSummaryChevron}>›</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Accès rapide ──────────────────────────────── */}
        <SectionHeader title={t('home.quickAccess')} />
        <View style={styles.quickGrid}>
          <QuickAction
            emoji="💬✨"
            label={t('home.quickNewMessage')}
            onPress={() => router.push('/(app)/create/' as never)}
            accent
          />
          <QuickAction
            emoji="🎴"
            label="Je découvre mes cartes animées"
            onPress={() => router.push('/(app)/cards/' as never)}
          />
          <QuickAction
            emoji="👥"
            label={t('home.quickContacts')}
            onPress={() => router.push('/(app)/contacts/index' as never)}
          />
          <QuickAction
            emoji="🎁"
            label={t('home.quickPot')}
            onPress={() => router.push('/(app)/pot/new' as never)}
          />
          <QuickAction
            emoji="📋"
            label="Mes cagnottes en cours"
            onPress={() => router.push('/(app)/pot' as never)}
          />
          <QuickAction
            emoji="🌟"
            label={t('home.quickReferral')}
            onPress={() => router.push('/(app)/referral/' as never)}
          />
          <QuickAction
            emoji="🤖"
            label="Envois automatiques"
            onPress={() => router.push('/(app)/auto-sends/' as never)}
          />
          <QuickAction
            emoji="⏰"
            label="Rappels personnalisés"
            onPress={() => router.push('/(app)/reminders/' as never)}
          />
          <QuickAction
            emoji="💑"
            label="Mode couple"
            onPress={() => router.push('/(app)/couple/' as never)}
          />
        </View>

        {/* ── Mes messages envoyés récemment ───────────── */}
        {recentSent.length > 0 && (
          <>
            <SectionHeader
              title="Mes derniers messages envoyés"
              action={t('common.seeAll')}
              onAction={() => router.push({ pathname: '/(app)/creations', params: { filter: 'sent' } } as never)}
            />
            <View style={styles.recentList}>
              {recentSent.map((msg) => (
                <RecentMessageCard
                  key={msg.id}
                  contactName={msg.contact_name}
                  format={msg.format}
                  status={msg.status}
                  date={msg.created_at}
                  onPress={() => router.push(`/(app)/message/${msg.id}` as never)}
                />
              ))}
            </View>
          </>
        )}

        {/* ── Mes brouillons ────────────────────────────── */}
        {recentDrafts.length > 0 && (
          <>
            <SectionHeader
              title="Mes brouillons"
              action={t('common.seeAll')}
              onAction={() => router.push({ pathname: '/(app)/creations', params: { filter: 'draft' } } as never)}
            />
            <Text style={styles.draftsSubtitle}>En attente d'envoi</Text>
            <View style={styles.recentList}>
              {recentDrafts.map((msg) => (
                <RecentMessageCard
                  key={msg.id}
                  contactName={msg.contact_name}
                  format={msg.format}
                  status={msg.status}
                  date={msg.created_at}
                  onPress={() => router.push(`/(app)/message/${msg.id}` as never)}
                />
              ))}
            </View>
          </>
        )}

        <View style={{ height: 32 }} />
        </>)} {/* fin {false && ( */}

      </ScrollView>
    </SafeAreaView>
  );
}

function buildTagline(birthdays: number, nameDays: number, others: number): string {
  if (birthdays === 0 && nameDays === 0 && others === 0) return "Tout est calme pour l'instant ✨";
  const parts: string[] = [];
  if (birthdays > 0) parts.push(`${birthdays} anniversaire${birthdays > 1 ? 's' : ''} 🎁`);
  if (nameDays > 0)  parts.push(`${nameDays} fête${nameDays > 1 ? 's' : ''} 🌸`);
  if (others > 0)    parts.push(`et ${others} autre${others > 1 ? 's' : ''} événement${others > 1 ? 's' : ''} 📅`);
  const joined = parts.length === 1
    ? parts[0]
    : parts.slice(0, -1).join(', ') + (others > 0 ? ' ' : ', ') + parts[parts.length - 1];
  return `${joined}\nà venir bientôt`;
}

function getGreeting(name: string, t: (key: string, opts?: Record<string, unknown>) => string): string {
  const hour = new Date().getHours();
  if (hour >= 21) return t('greeting.night',     { name });
  if (hour >= 18) return t('greeting.evening',   { name });
  if (hour >= 13) return t('greeting.afternoon', { name });
  if (hour >= 6)  return t('greeting.morning',   { name });
  return                 t('greeting.night',     { name });
}

function getGreetingEmojis(): string {
  const hour = new Date().getHours();
  if (hour >= 21) return '🌙  ⭐  💫';
  if (hour >= 18) return '🌆  ✨  🌟';
  if (hour >= 13) return '🌤  🎉  ✨';
  if (hour >= 6)  return '☀️  🌸  ✨';
  return                 '🌙  ⭐  💫';
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 80 },

  // Hero
  hero: {
    marginHorizontal: Spacing[4],
    marginTop: Spacing[3],
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[6],
    paddingBottom: Spacing[8],
    overflow: 'hidden',
    borderRadius: 24,
    minHeight: 180,
  },
  confettiBar: { position: 'absolute', top: 0, left: 20, right: 20, height: 50 },
  confettiItem: { position: 'absolute', fontSize: 16, opacity: 0.5 },
  heroBtnRow: {
    position: 'absolute',
    top: Spacing[3],
    right: Spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cakeBtn: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  searchBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  searchBtnText: { fontSize: 16 },
  cakeBtnText: {
    fontSize: 13,
    fontFamily: 'BeVietnamPro_700Bold',
    color: '#FF6B9D',
  },
  heroContent: { marginTop: Spacing[6], alignItems: 'center' },
  heroEmojis: {
    fontSize: 20,
    letterSpacing: 6,
    marginBottom: 6,
    color: Colors.white,
  },
  heroGreeting: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['5xl'],
    color: Colors.white,
    marginBottom: 6,
    textAlign: 'center',
  },
  heroTagline: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography['2xl'],
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    lineHeight: 22,
    textDecorationLine: 'none',
  },

  // Section headers
  // Aujourd'hui & Demain
  imminentSection: {
    marginHorizontal: Spacing[4],
    marginTop: Spacing[5],
    gap: 10,
  },
  imminentTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
    marginTop: Spacing[5],
    marginBottom: Spacing[3],
    borderLeftWidth: 3,
    borderLeftColor: C.primary,
    paddingLeft: Spacing[3],
  },
  imminentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.xl,
    paddingVertical: 12,
    paddingHorizontal: Spacing[4],
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
  },
  imminentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  imminentEmoji: { fontSize: 26 },
  imminentName: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  imminentDay: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  imminentEmpty: {
    paddingVertical: 18,
    paddingHorizontal: Spacing[4],
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.xl,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
  },
  imminentEmptyText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xl,
    color: C.primary,
  },
  imminentBtn: {
    backgroundColor: C.primary,
    borderRadius: Radii.full,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  imminentBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingLeft: Spacing[3],
    marginLeft: Spacing[4],
    marginRight: Spacing[4],
    marginTop: Spacing[5],
    marginBottom: Spacing[3],
    borderLeftWidth: 3,
    borderLeftColor: C.primary,
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
  },
  seeAll: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: C.primary,
  },

  // Events list (vertical)
  eventsList: {
    marginHorizontal: Spacing[4],
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerHighest,
  },
  eventRowUrgent: {
    backgroundColor: C.primaryContainer,
  },
  eventAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  eventAvatarUrgent: { backgroundColor: C.primary },
  eventAvatarText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.white,
  },
  eventBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventBadgeText: { fontSize: 10 },
  eventInfo: { flex: 1 },
  eventName: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  eventDays: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  eventDaysUrgent: { color: C.primary, fontFamily: 'BeVietnamPro_600SemiBold' },
  eventChevron: { fontSize: 20, color: Colors.outlineVariant },
  createBtn: {
    backgroundColor: C.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
  },
  createBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    color: Colors.white,
  },

  // Empty section
  emptySection: {
    marginHorizontal: Spacing[4],
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: C.primaryContainer,
    borderStyle: 'dashed',
    padding: Spacing[5],
    alignItems: 'center',
    gap: 8,
  },
  emptySectionEmoji: { fontSize: 32 },
  emptySectionText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  emptySectionBtn: {
    marginTop: 4,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: Radii.full,
    backgroundColor: C.primary,
  },
  emptySectionBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },

  // Intro card
  introCard: {
    marginHorizontal: Spacing[4],
    marginTop: Spacing[4],
    backgroundColor: Colors.white,
    borderRadius: Radii['2xl'],
    padding: Spacing[5],
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
    gap: 10,
    ...Shadows.sm,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  introTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
    flex: 1,
  },
  introSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
    marginBottom: 2,
    fontStyle: 'italic',
  },
  introRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  introEmoji: { fontSize: 18, lineHeight: 24 },
  introText: {
    flex: 1,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 22,
  },
  introActions: {
    marginTop: Spacing[2],
    gap: 10,
  },
  introHelpBtn: {
    paddingVertical: 10,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: C.primaryContainer,
    alignItems: 'center',
    backgroundColor: C.primaryContainer + '40',
  },
  introHelpBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
  },
  introDismissBtn: {
    fontSize: 16,
    color: Colors.outlineVariant,
    lineHeight: 22,
    paddingLeft: 8,
  },
  introHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Spacing[4],
    marginTop: Spacing[4],
    paddingVertical: 12,
    paddingHorizontal: Spacing[4],
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    ...Shadows.sm,
  },
  introHintText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
  },
  introHintChevron: {
    fontSize: 22,
    lineHeight: 26,
  },

  // Event summary rows
  eventSummaryList: {
    marginHorizontal: Spacing[4],
    marginTop: Spacing[5],
    gap: 10,
  },
  eventSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing[4],
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    ...Shadows.sm,
  },
  eventSummaryEmoji: { fontSize: 22 },
  eventSummaryLabel: {
    flex: 1,
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  eventSummaryBadge: {
    backgroundColor: C.primary,
    borderRadius: Radii.full,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventSummaryBadgeText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    color: Colors.white,
  },
  eventSummaryChevron: { fontSize: 20, color: Colors.outlineVariant },

  // Quick actions
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing[4],
    gap: 12,
  },
  quickAction: {
    width: (SCREEN_WIDTH - Spacing[4] * 2 - 12) / 2,
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[4],
    alignItems: 'flex-start',
    gap: 8,
    ...Shadows.sm,
  },
  quickActionAccent: { backgroundColor: C.primary },
  quickActionEmoji: { fontSize: 28 },
  quickActionLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  quickActionLabelAccent: { color: Colors.white },

  // Recent messages
  recentList: { marginHorizontal: Spacing[4], gap: 10 },
  draftsSubtitle: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: Colors.onSurface,
    fontStyle: 'italic',
    marginHorizontal: Spacing[4],
    marginTop: -6,
    marginBottom: 6,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    padding: Spacing[3],
    gap: 12,
    ...Shadows.sm,
  },
  recentEmoji: { fontSize: 28 },
  recentInfo: { flex: 1 },
  recentName: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  recentDate: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  recentStatus: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  recentArrow: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 22,
    color: Colors.outlineVariant,
  },

  // Zodiac season bloc
  zodiacSection: {
    marginHorizontal: Spacing[4],
    marginTop: Spacing[5],
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    paddingVertical: 12,
    paddingHorizontal: Spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
    ...Shadows.sm,
  },
  zodiacLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  zodiacEmoji: { fontSize: 26 },
  zodiacInfo: { flex: 1 },
  zodiacTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  zodiacSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: C.primary,
    marginTop: 1,
  },
  zodiacAvatars: {
    flexDirection: 'row',
    gap: -8,
  },
  zodiacAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  zodiacAvatarMore: {
    backgroundColor: Colors.surfaceContainerHighest,
  },
  zodiacAvatarText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: Colors.white,
  },
  zodiacChevron: { fontSize: 22, color: Colors.outlineVariant },

  weatherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing[4],
    marginTop: Spacing[3],
    paddingVertical: 10,
    paddingHorizontal: Spacing[4],
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    gap: 10,
    borderWidth: 1,
    borderColor: C.primaryContainer,
    ...Shadows.sm,
  },
  weatherEmoji:  { fontSize: 26 },
  weatherInfo:   { flex: 1, gap: 1 },
  weatherTemp:   { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.onSurface },
  weatherCity:   { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant },

  zodiacSignBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing[4],
    marginTop: Spacing[3],
    marginBottom: Spacing[1],
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    gap: 12,
    ...Shadows.sm,
  },
  zodiacSignEmoji: { fontSize: 28 },
  zodiacSignInfo: { flex: 1 },
  zodiacSignTitle: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  zodiacSignTrait: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
    marginTop: 1,
  },
  zodiacSignSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  zodiacSignChevron: { fontSize: 22, color: Colors.outlineVariant },

  // ── Mode simple — nouveaux styles ───────────────────────────────────────
  welcomeCard: { marginHorizontal: Spacing[4], marginTop: Spacing[3], borderRadius: Radii.xl, padding: Spacing[4], gap: 8 },
  welcomeCardTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 26, color: '#fff', lineHeight: 32 },
  welcomeTagline: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.88)', lineHeight: 21 },
  introAccItem: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: Radii.lg, padding: 12, gap: 6 },
  introAccEmoji: { fontSize: 20 },
  introAccTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: '#fff' },
  introAccBodyText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: 'rgba(255,255,255,0.8)', lineHeight: 18, marginTop: 4 },
  onboardingNote: { marginHorizontal: Spacing[4], marginTop: Spacing[4], backgroundColor: '#F3EFFF', borderRadius: Radii.lg, padding: Spacing[3], gap: 4 },
  onboardingNoteText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: '#4C1D95', lineHeight: 20 },
  onboardingNoteBold: { fontFamily: 'BeVietnamPro_700Bold' },
  onboardingNoteFooter: { fontFamily: 'BeVietnamPro_500Medium', fontSize: Typography.xs, color: '#7C3AED' },
  modeSmallBtn: { alignSelf: 'center', marginTop: Spacing[3], backgroundColor: '#7C3AED', borderRadius: Radii.full, paddingVertical: 10, paddingHorizontal: 24 },
  modeSmallBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: '#fff' },
  pageTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: Colors.onSurface, marginHorizontal: Spacing[4], marginTop: Spacing[5] },
  pageSubtitle: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, marginHorizontal: Spacing[4], marginTop: 4, lineHeight: 20 },

  profileIntroCard: { marginHorizontal: Spacing[4], marginTop: Spacing[4], backgroundColor: '#F3EFFF', borderRadius: Radii.xl, padding: Spacing[4], borderWidth: 1.5, borderColor: '#C4B5FD' },
  profileIntroBadge: { alignSelf: 'flex-start', backgroundColor: '#7C3AED', borderRadius: Radii.full, paddingVertical: 4, paddingHorizontal: 12, marginBottom: 10 },
  profileIntroBadgeText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs, color: '#fff' },
  profileIntroBody: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  profileIntroEmoji: { fontSize: 32 },
  profileIntroCenter: { flex: 1, gap: 8 },
  profileIntroTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: Colors.onSurface },
  profileIntroDesc: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, lineHeight: 20 },
  profileIntroBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#7C3AED', borderRadius: Radii.full, paddingVertical: 10, paddingHorizontal: 16, alignSelf: 'flex-start', gap: 6 },
  profileIntroBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: '#fff' },
  profileIntroBtnArrow: { width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  profileIntroBtnArrowText: { fontSize: 14, color: '#fff' },
  profileIntroRightEmoji: { fontSize: 32 },

  featuredCard: { marginHorizontal: Spacing[4], marginTop: Spacing[3], backgroundColor: '#FFF5F7', borderRadius: Radii.xl, padding: Spacing[4], borderWidth: 1.5, borderColor: '#FBCFE8' },
  contactBadge: { alignSelf: 'flex-start', backgroundColor: C.primary, borderRadius: Radii.full, paddingVertical: 4, paddingHorizontal: 12, marginBottom: 10 },
  contactBadgeText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs, color: '#fff' },
  messageBadge: { alignSelf: 'flex-start', backgroundColor: '#9333EA', borderRadius: Radii.full, paddingVertical: 4, paddingHorizontal: 12, marginBottom: 10 },
  messageBadgeText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs, color: '#fff' },
  messageCard: { backgroundColor: '#F5F3FF', borderColor: '#C4B5FD' },
  messageBtnColor: { backgroundColor: '#9333EA' },
  featuredBody: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featuredLeftEmoji: { fontSize: 36 },
  featuredCenter: { flex: 1, gap: 8 },
  featuredTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: Colors.onSurface },
  featuredSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, lineHeight: 20 },
  featuredBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primary, borderRadius: Radii.full, paddingVertical: 10, paddingHorizontal: 16, alignSelf: 'flex-start', gap: 6 },
  featuredBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: '#fff' },
  featuredBtnArrow: { width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  featuredBtnArrowText: { fontSize: 14, color: '#fff' },
  featuredRightEmoji: { fontSize: 36 },

  quickSectionLabel: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.lg, color: Colors.onSurface, marginHorizontal: Spacing[4], marginTop: Spacing[5], marginBottom: Spacing[2] },
  quickSectionSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant, marginHorizontal: Spacing[4], marginBottom: Spacing[2], lineHeight: 18 },
  infoStrip: { flexDirection: 'row', marginHorizontal: Spacing[4], marginTop: Spacing[4], gap: 8 },
  infoChip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.surfaceContainerHighest, borderRadius: Radii.lg, paddingVertical: 12, paddingHorizontal: 14 },
  infoChipEmoji: { fontSize: 18 },
  infoChipText: { fontFamily: 'BeVietnamPro_500Medium', fontSize: Typography.sm, color: Colors.onSurface },
  bottomBanner: { marginHorizontal: Spacing[4], marginTop: Spacing[4], backgroundColor: '#1E1B4B', borderRadius: Radii.xl, padding: Spacing[4], flexDirection: 'row', alignItems: 'center', gap: 12 },
  bottomBannerTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.lg, color: '#fff', marginBottom: 4 },
  bottomBannerBtn: { flexDirection: 'row', alignItems: 'center' },
  bottomBannerBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: '#A5B4FC' },
  bottomBannerArrow: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: '#A5B4FC' },
  bottomBannerSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  bottomBannerEmoji: { fontSize: 36 },
  collapseSeeAll: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: C.primary },
  });
}
