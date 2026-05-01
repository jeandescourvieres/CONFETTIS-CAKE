import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
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
import { updateWidget } from '../../src/utils/widget';
import { useContacts } from '../../src/hooks/useContacts';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { useThemeStore } from '../../src/stores/themeStore';
import { useColors } from '../../src/hooks/useColors';
import { useWeather } from '../../src/hooks/useWeather';
import type { UpcomingEvent } from '../../src/types/models';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const INTRO_DISMISSED_KEY = 'cc_home_intro_dismissed';

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
  useFocusEffect(useCallback(() => { scrollRef.current?.scrollTo({ y: 0, animated: false }); }, []));

  const [introVisible, setIntroVisible] = useState(true);
  useEffect(() => {
    SecureStore.getItemAsync(INTRO_DISMISSED_KEY).then((val) => {
      if (val === 'true') setIntroVisible(false);
    });
  }, []);
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

        {/* ── Hero ──────────────────────────────────────── */}
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
  });
}
