import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { format, addMonths, subMonths, getDaysInMonth, startOfMonth, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useContacts, useUpcomingEvents } from '../../src/hooks/useContacts';
import { scheduleAllReminders } from '../../src/services/notifications.service';
import { useUpcomingCustomEvents, useDeleteCustomEvent } from '../../src/hooks/useCustomEvents';
import { Avatar } from '../../src/components/ui/Avatar';
import { supabase } from '../../src/services/supabase';
import { Colors, Typography, Spacing, Radii } from '../../src/constants/theme';
import { useColors } from '../../src/hooks/useColors';
import { humanDaysUntil, isUrgent, formatDate } from '../../src/utils/dateHelpers';
import { getZodiacSign } from '../../src/utils/zodiac';
import { getNameDayForName } from '../../src/utils/namedays';
import { getUpcomingHolidays } from '../../src/utils/generalHolidays';
import { useCreateStore } from '../../src/stores/createStore';
import type { Occasion } from '../../src/stores/createStore';
import type { UpcomingEvent } from '../../src/types/models';
import { FeatureIntroCard } from '../../src/components/ui/FeatureIntroCard';

export default function CalendarScreen() {
  const router = useRouter();
  const C = useColors();
  const { type } = useLocalSearchParams<{ type?: string }>();
  const isCustom = type === 'custom';
  const isHolidays = type === 'holidays';
  const eventType = type === 'name_day' ? 'name_day' : 'birthday';
  const { isLoading } = useContacts();
  const allEvents = useUpcomingEvents(365);
  const customEvents = useUpcomingCustomEvents(365);
  const { mutateAsync: deleteEvent } = useDeleteCustomEvent();
  const [viewDate, setViewDate] = useState(new Date());
  const scrollRef = useRef<ScrollView>(null);
  const { reset, setOccasion } = useCreateStore();

  const handleHolidayCta = useCallback((occasion: Occasion) => {
    reset();
    setOccasion(occasion);
    router.push('/(app)/create/' as never);
  }, [reset, setOccasion, router]);

  // Choix prénom composé par contact (contactId → 'first' | 'second' | 'both')
  const [compoundChoices, setCompoundChoices] = useState<Record<string, 'first' | 'second' | 'both'>>({});

  const [nameDayHelpVisible, setNameDayHelpVisible] = useState(false);
  const [birthdayHelpVisible, setBirthdayHelpVisible] = useState(false);
  const [holidaysHelpVisible, setHolidaysHelpVisible] = useState(false);
  const [customHelpVisible, setCustomHelpVisible] = useState(false);

  const [nameMeaningModal, setNameMeaningModal] = useState<{
    visible: boolean;
    name: string;
    contactId: string;
    birthday: string | null;
    meaning: string | null;
    loading: boolean;
  }>({ visible: false, name: '', contactId: '', birthday: null, meaning: null, loading: false });

  const openNameMeaning = useCallback(async (firstName: string, contactId: string, birthday: string | null) => {
    setNameMeaningModal({ visible: true, name: firstName, contactId, birthday, meaning: null, loading: true });
    try {
      const { data, error } = await supabase.functions.invoke('name-meaning', { body: { name: firstName } });
      if (error) throw error;
      setNameMeaningModal((s) => ({ ...s, meaning: data?.meaning ?? null, loading: false }));
    } catch {
      setNameMeaningModal((s) => ({ ...s, meaning: 'Impossible de charger la signification pour le moment.', loading: false }));
    }
  }, []);
  useFocusEffect(useCallback(() => { scrollRef.current?.scrollTo({ y: 0, animated: false }); }, []));

  // Filtrer les événements par type (anniversaires OU fêtes, jamais mélangés)
  const filteredEvents = useMemo(
    () => allEvents.filter((e) => e.eventType === eventType),
    [allEvents, eventType],
  );

  // Planifier les rappels dès que les contacts sont chargés
  useEffect(() => {
    if (allEvents.length > 0) {
      scheduleAllReminders(allEvents).catch(() => {});
    }
  }, [allEvents.length]);

  // Événements du mois affiché (type filtré)
  const eventsThisMonth = useMemo(() => {
    const m = viewDate.getMonth();
    const y = viewDate.getFullYear();
    return filteredEvents.filter((e) => {
      const d = e.date;
      return d.getMonth() === m && d.getFullYear() === y;
    });
  }, [filteredEvents, viewDate]);

  // Jours du calendrier avec événements
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewDate);
    const firstDay = startOfMonth(viewDate);
    // lundi=0, dimanche=6 (format FR)
    let startOffset = getDay(firstDay) - 1;
    if (startOffset < 0) startOffset = 6;

    const days: Array<{ day: number | null; events: UpcomingEvent[] }> = [];
    for (let i = 0; i < startOffset; i++) days.push({ day: null, events: [] });
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEvents = eventsThisMonth.filter((e) => e.date.getDate() === d);
      days.push({ day: d, events: dayEvents });
    }
    return days;
  }, [viewDate, eventsThisMonth]);

  const monthLabel = format(viewDate, 'MMMM yyyy', { locale: fr });
  const monthLabelCapitalized = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  // Signe zodiacal dominant du mois affiché (milieu du mois = jour 15)
  const zodiacBanner = useMemo(() => {
    const m = String(viewDate.getMonth() + 1).padStart(2, '0');
    return getZodiacSign(`2000-${m}-15`);
  }, [viewDate]);

  const styles = useMemo(() => makeStyles(C), [C]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.center}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  // ── Vue événements personnalisés ──────────────────────────────────────────────
  if (isCustom) {
    // Événements du mois affiché
    const customThisMonth = customEvents.filter((e) => {
      const [y, mo] = e.event_date.split('-').map(Number);
      return mo - 1 === viewDate.getMonth() && y === viewDate.getFullYear();
    });
    // Événements des autres mois
    const customOtherMonths = customEvents.filter((e) => {
      const [y, mo] = e.event_date.split('-').map(Number);
      return !(mo - 1 === viewDate.getMonth() && y === viewDate.getFullYear());
    });

    // Grille calendrier pour les événements custom
    const daysInMonth = getDaysInMonth(viewDate);
    const firstDay = startOfMonth(viewDate);
    let startOffset = getDay(firstDay) - 1;
    if (startOffset < 0) startOffset = 6;
    const customCalDays: Array<{ day: number | null; hasEvent: boolean; isUrgent: boolean }> = [];
    for (let i = 0; i < startOffset; i++) customCalDays.push({ day: null, hasEvent: false, isUrgent: false });
    for (let d = 1; d <= daysInMonth; d++) {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const dayEvents = customThisMonth.filter((e) => {
        const [, , ed] = e.event_date.split('-').map(Number);
        return ed === d;
      });
      const isUrg = dayEvents.some((e) => {
        const [ey, emo, ed] = e.event_date.split('-').map(Number);
        const diff = Math.ceil((new Date(ey, emo - 1, ed).getTime() - today.getTime()) / 86400000);
        return diff >= 0 && diff <= 3;
      });
      customCalDays.push({ day: d, hasEvent: dayEvents.length > 0, isUrgent: isUrg });
    }

    const renderCustomEvent = (event: typeof customEvents[0]) => {
      const [y, mo, d] = event.event_date.split('-').map(Number);
      const eventDate = new Date(y, mo - 1, d);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / 86400000);
      const daysLabel = daysUntil === 0 ? "Aujourd'hui" : daysUntil === 1 ? 'Demain' : `Dans ${daysUntil} jours`;
      const dateLabel = format(eventDate, 'd MMMM yyyy', { locale: fr });
      const handleTap = () => {
        Alert.alert(event.title, daysLabel, [
          {
            text: '✏️ Modifier',
            onPress: () => router.push({
              pathname: '/(app)/calendar/new-event',
              params: {
                editId: event.id,
                editTitle: event.title,
                editDate: event.event_date,
                editDescription: event.description ?? '',
                editRemind: String(event.remind_before),
              },
            } as never),
          },
          {
            text: '🗑 Supprimer',
            style: 'destructive',
            onPress: () => Alert.alert(
              'Supprimer ?',
              `"${event.title}" sera supprimé définitivement.`,
              [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Supprimer', style: 'destructive', onPress: () => deleteEvent(event.id) },
              ]
            ),
          },
          { text: 'Annuler', style: 'cancel' },
        ]);
      };
      return (
        <TouchableOpacity key={event.id} onPress={handleTap} activeOpacity={0.8} style={[styles.eventCard, daysUntil <= 3 && styles.eventCardUrgent]}>
          <View style={styles.customEventIcon}>
            <Text style={{ fontSize: 22 }}>📅</Text>
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventName}>{event.title}</Text>
            <Text style={styles.eventSub}>{dateLabel}</Text>
            {event.description ? <Text style={[styles.eventSub, { marginTop: 2 }]}>{event.description}</Text> : null}
          </View>
          <View style={styles.eventRight}>
            <Text style={[styles.eventDays, daysUntil <= 3 && { color: C.primary }]}>{daysLabel}</Text>
            <Text style={{ fontSize: 18, color: Colors.outlineVariant }}>›</Text>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

          {/* Header mois */}
          <View style={styles.monthHeader}>
            <View style={styles.monthInfo}>
              <Text style={styles.monthTitle}>{monthLabelCapitalized}</Text>
              <Text style={styles.monthSub}>
                {customThisMonth.length > 0
                  ? `${customThisMonth.length} événement${customThisMonth.length > 1 ? 's' : ''} ce mois`
                  : 'Aucun événement ce mois'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity
              onPress={() => setCustomHelpVisible(true)}
              style={styles.helpInfoBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.helpInfoBtnText}>ℹ️</Text>
            </TouchableOpacity>
            <View style={styles.monthNavBtns}>
              <TouchableOpacity onPress={() => setViewDate((d) => subMonths(d, 1))} style={styles.navBtn}>
                <Text style={styles.navBtnText}>‹</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setViewDate(new Date())} style={styles.todayBtn}>
                <Text style={styles.todayBtnText}>Auj.</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setViewDate((d) => addMonths(d, 1))} style={styles.navBtn}>
                <Text style={styles.navBtnText}>›</Text>
              </TouchableOpacity>
            </View>
            </View>
          </View>

          {/* Intro autres événements */}
          <FeatureIntroCard
            introText={"La tête, c'est fait pour penser... pas pour tout retenir ! 😄 Entre les rendez-vous, les courses, les billets à réserver et les mille choses du quotidien, il est si facile d'oublier... Note ici tout ce qui compte et laisse l'appli te souffler les bonnes choses au bon moment — pour ne plus jamais passer à côté de ce qui t'attend 📋✨"}
            modeEmploiLines={[
              '📋 Appuie sur le bouton + pour ajouter un nouvel événement',
              '✨ Renseigne le titre, la date et une description optionnelle',
              '📅 Les événements sont classés par ordre chronologique — les plus proches en premier',
              '🔔 Tu reçois une notification au moment choisi pour ne rien oublier',
              '🗑️ Supprime un événement passé en le faisant glisser vers la gauche 💛✨',
            ]}
          />

          {/* Bannière signe zodiacal */}
          {zodiacBanner && (
            <View style={styles.zodiacBanner}>
              <Text style={styles.zodiacBannerText}>
                {zodiacBanner.emoji} Saison {zodiacBanner.name} · {zodiacBanner.dateRange}
              </Text>
            </View>
          )}

          {/* Grille calendrier */}
          <View style={styles.calCard}>
            <View style={styles.dayHeaders}>
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                <View key={i} style={styles.dayHeaderCell}>
                  <Text style={styles.dayHeaderText}>{d}</Text>
                </View>
              ))}
            </View>
            <View style={styles.calGrid}>
              {customCalDays.map((cell, i) => {
                const isToday =
                  cell.day !== null &&
                  cell.day === new Date().getDate() &&
                  viewDate.getMonth() === new Date().getMonth() &&
                  viewDate.getFullYear() === new Date().getFullYear();
                return (
                  <View key={i} style={styles.calCell}>
                    {cell.day !== null && (
                      <View style={[styles.calDayWrap, isToday && styles.calDayToday]}>
                        <Text style={[styles.calDayText, isToday && styles.calDayTextToday, cell.isUrgent && styles.calDayTextUrgent]}>
                          {cell.day}
                        </Text>
                        {cell.hasEvent && <Text style={styles.calEventEmoji}>📅</Text>}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Liste événements ce mois */}
          {customThisMonth.length > 0 && (
            <View style={styles.eventsList}>
              {customThisMonth.sort((a, b) => a.event_date.localeCompare(b.event_date)).map(renderCustomEvent)}
            </View>
          )}

          {/* Événements des autres mois */}
          {customOtherMonths.length > 0 && (
            <>
              <Text style={[styles.listTitle, { marginTop: Spacing[5] }]}>Événements des autres mois :</Text>
              <View style={styles.eventsList}>
                {customOtherMonths.sort((a, b) => a.event_date.localeCompare(b.event_date)).map(renderCustomEvent)}
              </View>
            </>
          )}

          {customEvents.length === 0 && (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyEmoji}>📅</Text>
              <Text style={styles.emptyTitle}>Aucun événement</Text>
              <Text style={styles.emptySub}>
                Créez des événements personnalisés (réunion, voyage, fête...) pour les retrouver ici.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.addEventBtn}
            onPress={() => router.push('/(app)/calendar/new-event' as never)}
            activeOpacity={0.85}
          >
            <Text style={styles.addEventIcon}>＋</Text>
            <Text style={styles.addEventText}>Ajouter un événement</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Modal aide — Autres événements */}
        <Modal visible={customHelpVisible} transparent animationType="fade" onRequestClose={() => setCustomHelpVisible(false)}>
          <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setCustomHelpVisible(false)}>
            <View style={styles.helpModalCard}>
              <View style={styles.helpModalHeader}>
                <Text style={styles.helpModalTitle}>Comment fonctionne cette section ? 📋</Text>
                <TouchableOpacity onPress={() => setCustomHelpVisible(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.helpModalClose}>Fermer ✕</Text>
                </TouchableOpacity>
              </View>
              {[
                { title: 'Ajouter un événement', body: 'Appuie sur le bouton + pour ajouter n\'importe quel événement — rendez-vous médical, billet de train à réserver, cadeau à acheter... tout ce dont tu veux te souvenir !' },
                { title: 'Renseigner les détails', body: 'Pour chaque événement, renseigne le titre, la date et une description optionnelle. Tu peux aussi choisir l\'heure de la notification de rappel.' },
                { title: 'Notifications', body: 'Tu reçois automatiquement une notification au moment choisi pour ne jamais rater ce qui compte 🔔' },
                { title: 'Gérer tes événements', body: 'Fais glisser un événement vers la gauche pour le supprimer une fois passé. Appuie dessus pour le modifier à tout moment.' },
                { title: 'Bon à savoir 💡', body: 'Cette section est ton bloc-notes personnel — note tout ce qui ne rentre pas dans les autres catégories de l\'appli !' },
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

  // ── Vue fêtes spéciales ──────────────────────────────────────────────────────
  if (isHolidays) {
    const allUpcoming = getUpcomingHolidays(365);

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>

        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

          {/* Header */}
          <View style={styles.monthHeader}>
            <View style={styles.monthInfo}>
              <Text style={styles.monthTitle}>🎊 Fêtes spéciales</Text>
              <Text style={styles.monthSub}>{allUpcoming.length} fêtes à venir cette année</Text>
            </View>
            <TouchableOpacity
              onPress={() => setHolidaysHelpVisible(true)}
              style={styles.helpInfoBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.helpInfoBtnText}>ℹ️</Text>
            </TouchableOpacity>
          </View>

          <FeatureIntroCard
            introText={"Au-delà des anniversaires et des fêtes de prénoms, l'année est jalonnée de moments collectifs qui méritent d'être célébrés 🎊 La fête des secrétaires, la fête du travail, la journée des amis... autant d'occasions souvent oubliées de montrer aux gens qu'on pense à eux ! Ne laisse plus passer ces petits moments de partage — une pensée envoyée au bon moment peut faire toute la différence 💛✨"}
            modeEmploiLines={[
              "🎊 Toutes les fêtes et journées spéciales de l'année sont répertoriées automatiquement",
              '📅 Classées par ordre chronologique — les plus proches en premier',
              '👆 Appuie sur une fête pour créer un message personnalisé à envoyer à tes proches concernés',
              '🔔 Tu reçois une notification la veille et le jour J de chaque fête spéciale',
              '🎁 Ne laisse plus passer ces occasions uniques de faire plaisir 💛✨',
            ]}
          />

          {/* Liste de toutes les fêtes à venir */}
          <View style={styles.eventsList}>
            {allUpcoming.map((h) => {
              const isToday = h.daysUntil === 0;
              const isNear  = h.daysUntil <= 7;
              const dateLabel = h.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
              return (
                <View
                  key={h.id}
                  style={[styles.specialHolidayCard, isNear && styles.specialHolidayCardNear]}
                >
                  {/* Countdown badge */}
                  <View style={[styles.specialHolidayBadge, isNear && !isToday && styles.specialHolidayBadgeNear, isToday && styles.specialHolidayBadgeToday]}>
                    <Text style={[styles.specialHolidayBadgeText, isNear && !isToday && styles.specialHolidayBadgeTextActive, isToday && { color: Colors.white }]}>
                      {isToday ? "Aujourd'hui !" : h.daysUntil === 1 ? 'Demain' : `J-${h.daysUntil}`}
                    </Text>
                  </View>
                  {/* Contenu */}
                  <View style={styles.specialHolidayContent}>
                    <View style={styles.specialHolidayTop}>
                      <Text style={styles.specialHolidayEmoji}>{h.emoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.specialHolidayName}>{h.name}</Text>
                        <Text style={styles.specialHolidayDate}>{dateLabel}</Text>
                      </View>
                    </View>
                    <Text style={styles.specialHolidayDesc}>{h.description}</Text>
                    {h.hasMessageCta && h.occasion && (
                      <TouchableOpacity
                        style={styles.specialHolidayCta}
                        onPress={() => handleHolidayCta(h.occasion!)}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.specialHolidayCtaText}>{h.ctaLabel ?? '✨ Créer un message'}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>

        {/* Modal aide — Fêtes spéciales */}
        <Modal visible={holidaysHelpVisible} transparent animationType="fade" onRequestClose={() => setHolidaysHelpVisible(false)}>
          <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setHolidaysHelpVisible(false)}>
            <View style={styles.helpModalCard}>
              <View style={styles.helpModalHeader}>
                <Text style={styles.helpModalTitle}>Comment fonctionne cette section ? 🎊</Text>
                <TouchableOpacity onPress={() => setHolidaysHelpVisible(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.helpModalClose}>Fermer ✕</Text>
                </TouchableOpacity>
              </View>
              {[
                { title: 'Toutes les fêtes spéciales', body: "Toutes les fêtes et journées spéciales de l'année sont répertoriées automatiquement — fête du travail, fête des mères, fête des secrétaires, journée mondiale des amis... et bien d'autres !" },
                { title: 'Envoyer un message', body: "Appuie sur une fête pour créer un message personnalisé et l'envoyer aux proches concernés en quelques secondes." },
                { title: 'Notifications', body: "Tu reçois automatiquement une notification la veille et le jour J de chaque fête spéciale pour ne jamais rater une occasion 🔔" },
                { title: 'Bon à savoir 💡', body: "Ces fêtes spéciales sont différentes des fêtes de prénoms — elles concernent tout le monde et sont l'occasion parfaite d'envoyer un message collectif ou ciblé !" },
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backBtnText}>‹</Text>
      </TouchableOpacity>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Header du mois */}
        <View style={styles.monthHeader}>
          <View style={styles.monthInfo}>
            <Text style={styles.monthTitle}>{monthLabelCapitalized}</Text>
            <Text style={styles.monthSub}>
              {eventsThisMonth.length > 0
                ? eventType === 'birthday'
                  ? `${eventsThisMonth.length} anniversaire${eventsThisMonth.length > 1 ? 's' : ''} ce mois 🎁`
                  : `${eventsThisMonth.length} fête${eventsThisMonth.length > 1 ? 's' : ''} ce mois 🌸`
                : eventType === 'birthday'
                  ? 'Aucun anniversaire ce mois'
                  : 'Aucune fête ce mois'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {eventType === 'name_day' && (
              <TouchableOpacity
                onPress={() => setNameDayHelpVisible(true)}
                style={styles.helpInfoBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.helpInfoBtnText}>ℹ️</Text>
              </TouchableOpacity>
            )}
            {eventType === 'birthday' && !isHolidays && (
              <TouchableOpacity
                onPress={() => setBirthdayHelpVisible(true)}
                style={styles.helpInfoBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.helpInfoBtnText}>ℹ️</Text>
              </TouchableOpacity>
            )}
          <View style={styles.monthNavBtns}>
            <TouchableOpacity onPress={() => setViewDate((d) => subMonths(d, 1))} style={styles.navBtn}>
              <Text style={styles.navBtnText}>‹</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setViewDate(new Date())} style={styles.todayBtn}>
              <Text style={styles.todayBtnText}>Auj.</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setViewDate((d) => addMonths(d, 1))} style={styles.navBtn}>
              <Text style={styles.navBtnText}>›</Text>
            </TouchableOpacity>
          </View>
          </View>
        </View>

        {/* Bannière signe zodiacal */}
        {zodiacBanner && (
          <View style={styles.zodiacBanner}>
            <Text style={styles.zodiacBannerText}>
              {zodiacBanner.emoji} Saison {zodiacBanner.name} · {zodiacBanner.dateRange}
            </Text>
          </View>
        )}

        {/* ── Intro anniversaires ── */}
        {eventType === 'birthday' && !isHolidays && (
          <FeatureIntroCard
            introText={"Les plus belles surprises se préparent à l'avance 🎁 Retrouve ici tous les prochains anniversaires de tes contacts et prends le temps de leur offrir un message qui vient du cœur 💛"}
            modeEmploiLines={[
              "🎂 La liste s'affiche automatiquement à partir des dates de naissance de tes contacts",
              '📅 Les anniversaires sont classés par ordre chronologique — les plus proches en premier',
              '👆 Appuie sur un contact pour accéder à sa fiche et préparer ton message',
              '🔔 Tu reçois une notification 7 jours avant, 3 jours avant et le jour J',
              '🎁 Ne rate plus jamais un anniversaire de ceux qui comptent pour toi 💛✨',
            ]}
          />
        )}

        {/* ── Intro fêtes des prénoms ── */}
        {eventType === 'name_day' && (
          <FeatureIntroCard
            introText={"Chaque prénom a son jour de fête et chaque fête est une occasion unique de montrer aux gens qu'on pense à eux 💐 La vie va vite et ces petits moments passent souvent inaperçus... Ne laisse plus passer ces attentions qui font toute la différence et surprends ceux qui comptent pour toi avec un message qui vient du cœur ✨"}
            modeEmploiLines={[
              "🌸 La liste s'affiche automatiquement à partir des prénoms de tes contacts",
              '📅 Les fêtes sont classées par ordre chronologique — les plus proches en premier',
              '👆 Appuie sur un contact pour accéder à sa fiche et préparer ton message',
              '🔔 Tu reçois une notification la veille et le jour de chaque fête de prénom',
              '🎉 Pour les prénoms composés, tu peux célébrer une fête ou les deux !',
              '🎁 Ne rate plus jamais une occasion de faire plaisir à ceux qui comptent pour toi 💛✨',
            ]}
          />
        )}

        {/* Grille calendrier */}
        <View style={styles.calCard}>
          {/* Entêtes jours */}
          <View style={styles.dayHeaders}>
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
              <View key={i} style={styles.dayHeaderCell}>
                <Text style={styles.dayHeaderText}>{d}</Text>
              </View>
            ))}
          </View>
          {/* Jours */}
          <View style={styles.calGrid}>
            {calendarDays.map((cell, i) => {
              const isToday =
                cell.day !== null &&
                cell.day === new Date().getDate() &&
                viewDate.getMonth() === new Date().getMonth() &&
                viewDate.getFullYear() === new Date().getFullYear();
              const hasEvent = cell.events.length > 0;
              const hasUrgent = cell.events.some((e) => isUrgent(e.daysUntil));

              return (
                <View key={i} style={styles.calCell}>
                  {cell.day !== null && (
                    <View
                      style={[
                        styles.calDayWrap,
                        isToday && styles.calDayToday,
                      ]}
                    >
                      <Text
                        style={[
                          styles.calDayText,
                          isToday && styles.calDayTextToday,
                          hasUrgent && styles.calDayTextUrgent,
                        ]}
                      >
                        {cell.day}
                      </Text>
                      {hasEvent && (
                        <Text style={styles.calEventEmoji}>
                          {eventType === 'birthday' ? '🎁' : '🌸'}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Liste des événements */}
        {eventsThisMonth.length > 0 && (
          <>
            <Text style={styles.listTitle}>
              {eventType === 'birthday' ? 'Liste des anniversaires du mois :' : 'Liste des fêtes des prénoms du mois :'}
            </Text>
            <View style={styles.eventsList}>
              {eventsThisMonth
                .sort((a, b) => a.daysUntil - b.daysUntil)
                .flatMap((event) => {
                  const firstName = event.contact.name.split(' ').slice(1).join(' ') || event.contact.name.split(' ')[0];
                  const isCompound = eventType === 'name_day' && firstName.includes('-');
                  if (isCompound) {
                    const [part1, part2] = firstName.split('-');
                    const date1 = getNameDayForName(part1);
                    const date2 = getNameDayForName(part2);
                    const choice = compoundChoices[event.contact.id];
                    const items: React.ReactElement[] = [];
                    items.push(
                      <View key={`banner-${event.contact.id}`} style={styles.compoundBanner}>
                        <Text style={styles.compoundBannerText}>✨ {firstName} est un prénom composé ! Plusieurs fêtes à célébrer — laquelle tu veux retenir ?</Text>
                        <View style={styles.compoundBtns}>
                          <TouchableOpacity
                            style={[styles.compoundBtn, (!choice || choice === 'first') && styles.compoundBtnActive]}
                            onPress={() => setCompoundChoices((p) => ({ ...p, [event.contact.id]: 'first' }))}
                          >
                            <Text style={[styles.compoundBtnText, (!choice || choice === 'first') && styles.compoundBtnTextActive]}>
                              📅 {part1}{date1 ? ` (${date1.slice(5, 7)}/${date1.slice(0, 2) === '0' ? date1.slice(1, 2) : date1.slice(0, 2)})` : ''}
                            </Text>
                          </TouchableOpacity>
                          {date2 && (
                            <TouchableOpacity
                              style={[styles.compoundBtn, choice === 'second' && styles.compoundBtnActive]}
                              onPress={() => setCompoundChoices((p) => ({ ...p, [event.contact.id]: 'second' }))}
                            >
                              <Text style={[styles.compoundBtnText, choice === 'second' && styles.compoundBtnTextActive]}>📅 {part2}</Text>
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity
                            style={[styles.compoundBtn, choice === 'both' && styles.compoundBtnActive]}
                            onPress={() => setCompoundChoices((p) => ({ ...p, [event.contact.id]: 'both' }))}
                          >
                            <Text style={[styles.compoundBtnText, choice === 'both' && styles.compoundBtnTextActive]}>🎉 Les deux !</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                    const showFirst = !choice || choice === 'first' || choice === 'both';
                    const showSecond = (choice === 'second' || choice === 'both') && date2;
                    if (showFirst) {
                      items.push(
                        <EventCard
                          key={`${event.contact.id}-part1`}
                          event={{ ...event, contact: { ...event.contact, name: event.contact.name.replace(firstName, part1) } }}
                          onCreateMessage={() => router.push({ pathname: '/(app)/create/', params: { contactId: event.contact.id } } as never)}
                          onPress={() => router.push(`/(app)/contact/${event.contact.id}` as never)}
                          onLearnMore={() => openNameMeaning(part1, event.contact.id, event.contact.birthday)}
                        />
                      );
                    }
                    if (showSecond) {
                      items.push(
                        <EventCard
                          key={`${event.contact.id}-part2`}
                          event={{ ...event, contact: { ...event.contact, name: event.contact.name.replace(firstName, part2) } }}
                          onCreateMessage={() => router.push({ pathname: '/(app)/create/', params: { contactId: event.contact.id } } as never)}
                          onPress={() => router.push(`/(app)/contact/${event.contact.id}` as never)}
                          onLearnMore={() => openNameMeaning(part2, event.contact.id, event.contact.birthday)}
                        />
                      );
                    }
                    return items;
                  }
                  return [
                    <EventCard
                      key={`${event.contact.id}-${event.eventType}`}
                      event={event}
                      onCreateMessage={() =>
                        router.push({
                          pathname: '/(app)/create/',
                          params: { contactId: event.contact.id },
                        } as never)
                      }
                      onPress={() => router.push(`/(app)/contact/${event.contact.id}` as never)}
                      onLearnMore={() => openNameMeaning(firstName, event.contact.id, event.contact.birthday)}
                    />
                  ];
                })}
            </View>
          </>
        )}

        {/* Prochainement (hors mois affiché) */}
        {filteredEvents.filter((e) => {
          const m = viewDate.getMonth();
          const y = viewDate.getFullYear();
          return !(e.date.getMonth() === m && e.date.getFullYear() === y);
        }).length > 0 && (
          <>
            <Text style={[styles.listTitle, { marginTop: Spacing[5] }]}>
              {eventType === 'birthday' ? 'Anniversaires des mois suivants :' : 'Fêtes des prénoms des mois suivants :'}
            </Text>
            <View style={styles.eventsList}>
              {filteredEvents
                .filter((e) => {
                  const m = viewDate.getMonth();
                  const y = viewDate.getFullYear();
                  return !(e.date.getMonth() === m && e.date.getFullYear() === y);
                })
                .slice(0, 5)
                .map((event) => {
                  const firstName = event.contact.name.split(' ').slice(1).join(' ') || event.contact.name.split(' ')[0];
                  return (
                    <EventCard
                      key={`next-${event.contact.id}-${event.eventType}`}
                      event={event}
                      onCreateMessage={() =>
                        router.push({
                          pathname: '/(app)/create/',
                          params: { contactId: event.contact.id },
                        } as never)
                      }
                      onPress={() => router.push(`/(app)/contact/${event.contact.id}` as never)}
                      onLearnMore={() => openNameMeaning(firstName, event.contact.id, event.contact.birthday)}
                    />
                  );
                })}
            </View>
          </>
        )}

        {filteredEvents.length === 0 && (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyTitle}>Aucun anniversaire</Text>
            <Text style={styles.emptySub}>
              Ajoutez des contacts avec leur date de naissance pour voir apparaître leurs anniversaires ici.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push({ pathname: '/(app)/contacts/new', params: { resetKey: Date.now().toString() } } as never)}
            >
              <Text style={styles.emptyBtnText}>+ Ajouter un contact</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Fêtes & Journées du mois ─────────────────── */}
        {/* ── Ajouter un contact ─── */}
        <Text style={styles.addContactHint}>
          {eventType === 'birthday'
            ? "Maman, Pierre, ton chien, ton chat, ton poisson rouge… ou ton·ta meilleur·e ami·e ! 🐾🐟✨\n\nAjoute-les dans tes contacts pour ne rater aucun anniversaire (ou presque) ! 🎁"
            : "Pierre, Marie, Valentine, Noël… ou ton·ta meilleur·e ami·e ! 🌸✨\n\nAjoute-les dans tes contacts pour ne rater aucune fête (ou presque) ! 🌸"}
        </Text>
        <TouchableOpacity
          style={styles.addEventBtn}
          onPress={() => router.push({ pathname: '/(app)/contacts/new', params: { resetKey: Date.now().toString() } } as never)}
          activeOpacity={0.85}
        >
          <Text style={styles.addEventIcon}>👤</Text>
          <Text style={styles.addEventText}>+ Ajouter un contact</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Modal aide — Fêtes des prénoms */}
      <Modal visible={nameDayHelpVisible} transparent animationType="fade" onRequestClose={() => setNameDayHelpVisible(false)}>
        <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setNameDayHelpVisible(false)}>
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne cette section ? 🌸</Text>
              <TouchableOpacity onPress={() => setNameDayHelpVisible(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.helpModalClose}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            {[
              { title: 'Ta liste personnalisée', body: 'Tous tes contacts ayant un prénom avec une fête dans le calendrier français apparaissent automatiquement ici, classés par date.' },
              { title: 'Préparer un message', body: 'Appuie sur un contact pour accéder à sa fiche et générer un message personnalisé pour sa fête de prénom.' },
              { title: 'Notifications', body: 'Tu reçois automatiquement une notification la veille et le jour J pour ne jamais rater une fête 🔔' },
              { title: 'Les prénoms composés 🎉', body: 'Pour les contacts ayant un prénom composé (Marie-Claire, Jean-Pierre...), tu peux choisir de célébrer la fête du premier prénom, du second, ou des deux ! Appuie sur les boutons pour sélectionner ton choix.' },
              { title: 'Bon à savoir 💡', body: 'Les prénoms qui n\'ont pas de fête dans le calendrier français n\'apparaissent pas dans cette liste.' },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal aide — Anniversaires */}
      <Modal visible={birthdayHelpVisible} transparent animationType="fade" onRequestClose={() => setBirthdayHelpVisible(false)}>
        <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setBirthdayHelpVisible(false)}>
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne cette section ? 🎂</Text>
              <TouchableOpacity onPress={() => setBirthdayHelpVisible(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.helpModalClose}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            {[
              { title: 'Ta liste personnalisée', body: 'Tous tes contacts ayant une date de naissance renseignée apparaissent automatiquement ici, classés par ordre chronologique.' },
              { title: 'Préparer un message', body: 'Appuie sur un contact pour accéder à sa fiche et générer un message personnalisé pour son anniversaire.' },
              { title: 'Notifications', body: 'Tu reçois automatiquement une notification 7 jours avant, 3 jours avant et le jour J pour ne jamais rater un anniversaire 🔔' },
              { title: 'Bon à savoir 💡', body: 'Les contacts sans date de naissance renseignée n\'apparaissent pas dans cette liste. Pense à compléter les fiches de tes contacts !' },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal "Tout sur [Prénom]" */}
      <Modal
        visible={nameMeaningModal.visible}
        animationType="slide"
        transparent
        onRequestClose={() => setNameMeaningModal((s) => ({ ...s, visible: false }))}
      >
        <View style={styles.meaningOverlay}>
          <SafeAreaView style={styles.meaningSheet} edges={['top']}>
            <View style={styles.meaningHeader}>
              <View>
                <Text style={styles.meaningEyebrow}>✨ En savoir plus sur {nameMeaningModal.name}</Text>
                <Text style={styles.meaningTitle}>🌸 {nameMeaningModal.name}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setNameMeaningModal((s) => ({ ...s, visible: false }))}
                style={styles.meaningCloseBtn}
              >
                <Text style={styles.meaningCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.meaningBody} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

              {/* ── Signification du prénom ── */}
              <Text style={styles.meaningSectionTitle}>📖 Signification du prénom {nameMeaningModal.name}</Text>
              {nameMeaningModal.loading ? (
                <View style={styles.meaningLoading}>
                  <ActivityIndicator color={Colors.primary} size="large" />
                  <Text style={styles.meaningLoadingText}>Recherche en cours…</Text>
                </View>
              ) : (
                <Text style={styles.meaningText}>{nameMeaningModal.meaning}</Text>
              )}

              {/* ── Profil astro ── */}
              {nameMeaningModal.birthday && (() => {
                const sign = getZodiacSign(nameMeaningModal.birthday);
                if (!sign) return null;
                return (
                  <View style={styles.astroBlock}>
                    <Text style={styles.meaningSectionTitle}>🔮 Profil astrologique</Text>
                    <View style={styles.astroSignRow}>
                      <Text style={styles.astroEmoji}>{sign.emoji}</Text>
                      <View>
                        <Text style={styles.astroSignName}>{sign.name}</Text>
                        <Text style={styles.astroDateRange}>{sign.dateRange}</Text>
                      </View>
                    </View>
                    <Text style={styles.meaningText}>{sign.description}</Text>
                  </View>
                );
              })()}

              {/* ── CTA créer message ── */}
              <TouchableOpacity
                style={styles.meaningCta}
                activeOpacity={0.85}
                onPress={() => {
                  setNameMeaningModal((s) => ({ ...s, visible: false }));
                  router.push({ pathname: '/(app)/create/', params: { contactId: nameMeaningModal.contactId } } as never);
                }}
              >
                <Text style={styles.meaningCtaText}>✨ Créer un message pour {nameMeaningModal.name}</Text>
              </TouchableOpacity>

            </ScrollView>
            <View style={styles.meaningHandle} />
          </SafeAreaView>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

function EventCard({
  event,
  onCreateMessage,
  onPress,
  onLearnMore,
}: {
  event: UpcomingEvent;
  onCreateMessage: () => void;
  onPress: () => void;
  onLearnMore?: () => void;
}) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const urgent = isUrgent(event.daysUntil);
  const isBirthday = event.eventType === 'birthday';
  const firstName = event.contact.name.split(' ').slice(1).join(' ') || event.contact.name.split(' ')[0];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.eventCard, urgent && styles.eventCardUrgent]}
    >
      <Avatar
        uri={event.contact.avatar_url}
        name={event.contact.name}
        size="md"
        badge={isBirthday ? '🎁' : '🌸'}
      />
      <View style={styles.eventInfo}>
        <Text style={styles.eventName}>{event.contact.name}</Text>
        <Text style={styles.eventSub}>
          {isBirthday && event.contact.birthday
            ? `Né·e le ${formatDate(event.contact.birthday, 'd MMMM yyyy')}`
            : 'Fête'}
        </Text>
        {onLearnMore && (
          <TouchableOpacity
            onPress={(e) => { e.stopPropagation(); onLearnMore(); }}
            hitSlop={{ top: 6, bottom: 6, left: 0, right: 6 }}
          >
            <Text style={styles.learnMoreLink}>✨ En savoir plus sur {firstName}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.eventRight}>
        <Text style={[styles.eventDays, urgent && { color: Colors.primary }]}>
          {humanDaysUntil(event.daysUntil)}
        </Text>
        <TouchableOpacity
          style={[styles.createBtn, !urgent && styles.createBtnLight]}
          onPress={(e) => { e.stopPropagation(); onCreateMessage(); }}
        >
          <Text style={[styles.createBtnText, !urgent && { color: Colors.primary }]}>
            {isBirthday ? '✦ Créer' : '✦ Créer'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  backBtn: { paddingHorizontal: Spacing[4], paddingTop: 8, paddingBottom: 4 },
  backBtnText: { fontSize: 34, color: Colors.primary, lineHeight: 38 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: Spacing[5], paddingBottom: 100 },

  // Header
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(155,107,181,0.07)',
    borderRadius: Radii.lg,
    padding: Spacing[5],
    marginBottom: Spacing[5],
    borderWidth: 0.5,
    borderColor: 'rgba(155,107,181,0.15)',
  },
  monthInfo: { flex: 1 },
  monthTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    marginBottom: 2,
  },
  monthSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
  },
  monthNavBtns: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: Radii.full,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: C.primaryContainer,
  },
  navBtnText: { fontSize: 20, color: C.primary, lineHeight: 24 },
  todayBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.full,
    backgroundColor: C.primary,
  },
  todayBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    color: Colors.white,
  },

  // Bannière zodiacale
  zodiacBanner: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.full,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginBottom: Spacing[2],
    borderWidth: 0.5,
    borderColor: Colors.surfaceContainerHighest,
  },
  zodiacBannerText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },

  // Calendrier
  calCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    padding: Spacing[4],
    marginBottom: Spacing[5],
    borderWidth: 0.5,
    borderColor: Colors.surfaceContainerHighest,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: Colors.onSurfaceVariant,
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  calDayWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDayToday: {
    backgroundColor: Colors.surfaceContainer,
  },
  calDayText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
  },
  calDayTextToday: {
    fontFamily: 'BeVietnamPro_700Bold',
    color: C.primary,
  },
  calDayTextUrgent: {
    fontFamily: 'BeVietnamPro_700Bold',
    color: C.primary,
  },
  calEventEmoji: {
    position: 'absolute',
    bottom: 0,
    fontSize: 13,
    lineHeight: 14,
  },

  // Liste
  listTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
    marginBottom: Spacing[3],
  },
  eventsList: { gap: Spacing[3] },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: Spacing[4],
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    borderWidth: 0.5,
    borderColor: Colors.surfaceContainerHighest,
  },
  eventCardUrgent: {
    borderColor: C.primary,
    borderWidth: 1.5,
  },
  customEventIcon: {
    width: 44,
    height: 44,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  eventInfo: { flex: 1 },
  eventName: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
    marginBottom: 2,
  },
  eventSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  eventRight: { alignItems: 'flex-end', gap: 4 },
  eventDays: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  createBtn: {
    backgroundColor: C.primary,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
  },
  createBtnLight: {
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: C.primaryContainer,
  },
  createBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    color: Colors.white,
  },

  // Vide
  emptyWrap: { alignItems: 'center', paddingTop: 40, paddingHorizontal: 20 },
  emptyEmoji: { fontSize: 56, marginBottom: Spacing[3] },
  emptyTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
    marginBottom: Spacing[2],
  },
  emptySub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing[5],
  },
  emptyBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: Radii.full,
    backgroundColor: C.primary,
  },
  emptyBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.white,
  },

  addContactHint: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.lg,
    color: C.primary,
    textAlign: 'center',
    marginHorizontal: Spacing[4],
    marginTop: Spacing[6],
    marginBottom: Spacing[3],
    lineHeight: 26,
    backgroundColor: C.primaryContainer + '50',
    borderWidth: 1.5,
    borderColor: C.primary + '55',
    borderRadius: Radii.xl,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[4],
  },
  // Modal signification prénom
  meaningOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-start',
  },
  meaningSheet: {
    backgroundColor: Colors.background,
    borderBottomLeftRadius: Radii['2xl'],
    borderBottomRightRadius: Radii['2xl'],
    paddingBottom: 24,
    maxHeight: '80%',
  },
  meaningHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: Colors.outlineVariant,
    alignSelf: 'center', marginTop: 10, marginBottom: 4,
  },
  meaningHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing[5], paddingVertical: 14,
    borderBottomWidth: 0.5, borderBottomColor: Colors.surfaceContainer,
  },
  meaningTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
    flex: 1,
  },
  meaningCloseBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  meaningCloseText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  meaningBody: { paddingHorizontal: Spacing[5], paddingTop: Spacing[4] },
  meaningEyebrow: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  meaningSectionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
    marginTop: Spacing[4],
    marginBottom: Spacing[2],
  },
  meaningLoading: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  meaningLoadingText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
  },
  meaningText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 24,
  },
  astroBlock: { marginTop: Spacing[3] },
  astroSignRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.lg,
    padding: 12,
    marginBottom: Spacing[3],
  },
  astroEmoji: { fontSize: 32 },
  astroSignName: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.lg,
    color: Colors.onSurface,
  },
  astroDateRange: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  learnMoreLink: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: Colors.primary,
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  meaningCta: {
    marginTop: Spacing[5],
    backgroundColor: Colors.primary,
    borderRadius: Radii.full,
    paddingVertical: 15,
    alignItems: 'center',
  },
  meaningCtaText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.md,
    color: Colors.white,
  },

  addEventBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    margin: Spacing[4],
    marginTop: Spacing[6],
    paddingVertical: 15,
    borderRadius: Radii.full,
    backgroundColor: C.primary,
  },
  addEventIcon: {
    fontSize: 20,
    color: Colors.white,
    lineHeight: 24,
  },
  addEventText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.lg,
    color: Colors.white,
  },

  // ── Intro / mode d'emploi commun ─────────────────────────────────────────
  nameDayIntroCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
    padding: Spacing[4],
    marginBottom: Spacing[4],
    gap: 10,
  },
  nameDayIntroText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    lineHeight: 21,
  },
  nameDayModeEmploi: { gap: 6, marginTop: 2 },
  nameDayModeEmploiLine: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 20,
  },

  // ── Prénoms composés ──────────────────────────────────────────────────
  compoundBanner: {
    backgroundColor: C.primaryContainer + '50',
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: C.primaryContainer,
    padding: Spacing[4],
    gap: 10,
  },
  compoundBannerText: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.sm,
    color: C.primary,
    lineHeight: 20,
  },
  compoundBtns: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  compoundBtn: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: Radii.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: C.primaryContainer,
  },
  compoundBtnActive: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  compoundBtnText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },
  compoundBtnTextActive: { color: Colors.white },

  // ── Bouton ℹ️ ──────────────────────────────────────────────────────────
  helpInfoBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpInfoBtnText: { fontSize: 13 },

  // ── Modals d'aide ──────────────────────────────────────────────────────
  helpModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  helpModalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  helpModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  helpModalTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.base,
    color: Colors.onSurface,
    flex: 1,
    lineHeight: 22,
  },
  helpModalClose: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: Colors.primary,
  },
  helpModalSection: { gap: 3 },
  helpModalSectionTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.onSurface,
  },
  helpModalSectionBody: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    lineHeight: 19,
  },

  // ── Fêtes spéciales à venir ──────────────────────────────────────────────────
  specialHolidayCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    borderWidth: 0.5,
    borderColor: Colors.surfaceContainerHighest,
    padding: Spacing[4],
    gap: 10,
  },
  specialHolidayCardNear: {
    borderColor: C.primary,
    borderWidth: 1.5,
    backgroundColor: C.primaryContainer + '18',
  },
  specialHolidayBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighest,
  },
  specialHolidayBadgeNear: {
    backgroundColor: C.primaryContainer,
    borderColor: C.primary + '55',
  },
  specialHolidayBadgeToday: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  specialHolidayBadgeText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },
  specialHolidayBadgeTextActive: {
    color: C.primary,
  },
  specialHolidayContent: { gap: 6 },
  specialHolidayTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  specialHolidayEmoji: { fontSize: 28, lineHeight: 34, flexShrink: 0 },
  specialHolidayName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
    marginBottom: 2,
  },
  specialHolidayDate: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  specialHolidayDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },
  specialHolidayCta: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: Radii.full,
    backgroundColor: C.primary,
    marginTop: 4,
  },
  specialHolidayCtaText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },
  });
}
