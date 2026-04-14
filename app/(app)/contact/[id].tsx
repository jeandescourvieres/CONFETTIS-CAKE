import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useContact, useDeleteContact } from '../../../src/hooks/useContacts';
import { Avatar } from '../../../src/components/ui/Avatar';
import { Badge } from '../../../src/components/ui/Badge';
import { Colors, Typography, Spacing, Radii, Gradients } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import {
  daysUntilBirthday,
  daysUntilNextOccurrence,
  formatDate,
  formatShortDate,
  getAge,
  isUrgent,
  humanDaysUntil,
} from '../../../src/utils/dateHelpers';
import { getNameDayForName, getNamesForDate } from '../../../src/utils/namedays';
import type { Relation } from '../../../src/types/models';

const RELATION_LABELS: Record<Relation, string> = {
  best_friend: '💜 Meilleur·e ami·e',
  friend: '😊 Ami·e',
  family: '👨‍👩‍👧 Famille',
  partner: '💑 Partenaire',
  colleague: '💼 Collègue',
  other: '👤 Autre',
};

const FORMAT_ICONS: Record<string, string> = {
  song: '🎵',
  poem: '✍️',
  message: '💬',
  joke: '😄',
};

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const C = useColors();
  const { data: contact, isLoading } = useContact(id);
  const { mutateAsync: deleteContact, isPending: isDeleting } = useDeleteContact();

  const handleDelete = () => {
    Alert.alert(
      'Supprimer ce contact ?',
      `${contact?.name} sera supprimé définitivement.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteContact(id);
            router.back();
          },
        },
      ],
    );
  };

  const handleCall = () => {
    if (contact?.phone) Linking.openURL(`tel:${contact.phone}`);
  };

  const handleCreateMessage = () =>
    router.push({ pathname: '/(app)/create/index', params: { contactId: id } } as never);

  const handleOpenPot = () => router.push('/(app)/pot/new' as never);
  const handleOpenQR = () => router.push('/(app)/qr/index' as never);

  const styles = useMemo(() => makeStyles(C), [C]);

  if (isLoading || !contact) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.center}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  // Calculs dates
  const birthdayDays = contact.birthday ? daysUntilBirthday(contact.birthday) : null;
  const birthdayUrgent = birthdayDays !== null && isUrgent(birthdayDays);
  const hasYear = contact.birthday && !contact.birthday.startsWith('0000-');
  const age = hasYear ? getAge(contact.birthday!, false) : null; // âge actuel (inconnu si année absente)

  const nameDayMmdd =
    contact.name_day ?? getNameDayForName(contact.name.split(' ')[0]);
  const nameDayDays = nameDayMmdd ? daysUntilNextOccurrence(nameDayMmdd) : null;
  const nameDayNames = nameDayMmdd ? getNamesForDate(nameDayMmdd) : [];

  const nextEvent =
    birthdayDays !== null && (nameDayDays === null || birthdayDays <= nameDayDays)
      ? { type: 'birthday', days: birthdayDays }
      : nameDayDays !== null
      ? { type: 'name_day', days: nameDayDays }
      : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>Fiche contact</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() =>
            router.push({ pathname: '/(app)/contacts/new', params: { editId: id } } as never)
          }
        >
          <Text style={styles.editBtnText}>✏️ Modifier</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero */}
        <LinearGradient colors={[...Gradients.primary]} style={styles.hero}>
          <View style={styles.heroPattern} />
          <View style={styles.heroContent}>
            <View style={styles.avatarWrap}>
              <Avatar uri={contact.avatar_url} name={contact.name} size="xl" />
              <TouchableOpacity style={styles.editAvatarBtn}>
                <Text style={{ fontSize: 10 }}>✏️</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.heroName}>{contact.name}</Text>
            <Text style={[styles.heroBirthday, !contact.birthday && styles.heroBirthdayEmpty]}>
              {contact.birthday
                ? contact.birthday.startsWith('0000-')
                  ? `Né·e le ${formatDate(contact.birthday.replace('0000-', '2000-'), 'd MMMM')}`
                  : `Né·e le ${formatDate(contact.birthday, 'd MMMM yyyy')}`
                : 'Date de naissance non renseignée'}
            </Text>
            {nameDayMmdd && (
              <Text style={styles.heroNameDay}>
                🌸 Fête le {formatShortDate(nameDayMmdd)}
                {nameDayDays !== null
                  ? nameDayDays === 0 ? ' · aujourd\'hui !'
                  : nameDayDays === 1 ? ' · demain'
                  : ` · dans ${nameDayDays}j`
                  : ''}
              </Text>
            )}
            <View style={styles.heroBadges}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>{RELATION_LABELS[contact.relation]}</Text>
              </View>
              {age && (
                <View style={[styles.heroBadge, styles.heroBadgeYellow]}>
                  <Text style={[styles.heroBadgeText, { color: Colors.secondaryContainer }]}>
                    {age} ans
                  </Text>
                </View>
              )}
            </View>

            {/* Alerte prochaine occasion */}
            {nextEvent && isUrgent(nextEvent.days) && (
              <View style={styles.alertBox}>
                <Text style={styles.alertIcon}>{nextEvent.days === 0 ? '🎉' : '🔥'}</Text>
                <View style={styles.alertInfo}>
                  <Text style={styles.alertTitle}>
                    {nextEvent.type === 'birthday' ? 'Anniversaire' : 'Fête'}{' '}
                    {nextEvent.days === 0 ? "aujourd'hui !" : nextEvent.days === 1 ? 'demain !' : `dans ${nextEvent.days} jours !`}
                  </Text>
                  {contact.birthday && (
                    <Text style={styles.alertSub}>
                      {formatShortDate(contact.birthday.slice(5))} — {age} ans
                    </Text>
                  )}
                </View>
                <TouchableOpacity style={styles.alertBtn} onPress={handleCreateMessage}>
                  <Text style={styles.alertBtnText}>✦ Créer</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* Dates importantes */}
        <View style={styles.datesGrid}>
          {contact.birthday && (
            <View style={styles.dateCard}>
              <View style={[styles.dateIcon, { backgroundColor: Colors.primary }]}>
                <Text style={{ fontSize: 14 }}>📅</Text>
              </View>
              <View>
                <Text style={styles.dateCardLabel}>Anniversaire</Text>
                <Text style={styles.dateCardValue}>
                  {formatDate(
                    new Date(2000, parseInt(contact.birthday.split('-')[1]) - 1, parseInt(contact.birthday.split('-')[2])),
                  )}
                </Text>
                {birthdayDays !== null && (
                  <Text style={[styles.dateCardSub, birthdayUrgent && { color: Colors.primary }]}>
                    {humanDaysUntil(birthdayDays)}
                  </Text>
                )}
              </View>
            </View>
          )}
          {nameDayMmdd && (
            <View style={styles.dateCard}>
              <View style={[styles.dateIcon, { backgroundColor: Colors.primaryContainer }]}>
                <Text style={{ fontSize: 14 }}>🌸</Text>
              </View>
              <View>
                <Text style={styles.dateCardLabel}>Fête</Text>
                <Text style={styles.dateCardValue}>{formatShortDate(nameDayMmdd)}</Text>
                <Text style={styles.dateCardSub}>{nameDayNames.slice(0, 2).join(', ')}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Actions rapides */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Actions rapides</Text>
          <View style={styles.actionsGrid}>
            <ActionButton emoji="✦" line1="Créer un" line2="message" color={Colors.primary} onPress={handleCreateMessage} />
            <ActionButton emoji="🎁" line1="Lancer une" line2="cagnotte" color="#c97d10" onPress={handleOpenPot} />
            <ActionButton emoji="⬛" line1="Générer un" line2="QR code" color="#4dd4c4" onPress={handleOpenQR} />
            <ActionButton
              emoji="📞"
              line1="Pour"
              line2="appeler"
              color={Colors.onSurfaceVariant}
              onPress={handleCall}
              disabled={!contact.phone}
            />
          </View>
        </View>

        {/* Notes */}
        {(contact.notes || true) && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Notes personnelles</Text>
            <TouchableOpacity style={styles.notesCard}>
              <Text style={styles.notesText}>
                {contact.notes || 'Appuyez pour ajouter des notes...'}
              </Text>
              <Text style={{ color: Colors.primary, fontSize: 14 }}>✏️</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Coordonnées */}
        {(contact.phone || contact.email) && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Coordonnées</Text>
            <View style={styles.coordsCard}>
              {contact.phone && (
                <TouchableOpacity onPress={handleCall} style={styles.coordRow}>
                  <Text style={styles.coordIcon}>📱</Text>
                  <Text style={styles.coordValue}>{contact.phone}</Text>
                </TouchableOpacity>
              )}
              {contact.email && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`mailto:${contact.email}`)}
                  style={[styles.coordRow, { borderTopWidth: contact.phone ? 0.5 : 0, borderTopColor: Colors.surfaceContainerLow }]}
                >
                  <Text style={styles.coordIcon}>📧</Text>
                  <Text style={styles.coordValue}>{contact.email}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Préférences de communication */}
        {(contact.preferred_channel || contact.preferred_send_time) && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Préférences d'envoi</Text>
            <View style={styles.coordsCard}>
              {contact.preferred_channel && (
                <View style={styles.coordRow}>
                  <Text style={styles.coordIcon}>{contact.preferred_channel === 'sms' ? '📱' : '📧'}</Text>
                  <Text style={styles.coordValue}>
                    Préfère recevoir par {contact.preferred_channel === 'sms' ? 'SMS' : 'Email'}
                  </Text>
                </View>
              )}
              {contact.preferred_send_time && (
                <View style={[styles.coordRow, { borderTopWidth: contact.preferred_channel ? 0.5 : 0, borderTopColor: Colors.surfaceContainerLow }]}>
                  <Text style={styles.coordIcon}>
                    {contact.preferred_send_time === 'morning' ? '🌅' : contact.preferred_send_time === 'afternoon' ? '☀️' : contact.preferred_send_time === 'evening' ? '🌙' : '🕐'}
                  </Text>
                  <Text style={styles.coordValue}>
                    Heure idéale : {contact.preferred_send_time === 'morning' ? 'le matin' : contact.preferred_send_time === 'afternoon' ? "l'après-midi" : contact.preferred_send_time === 'evening' ? 'le soir' : 'peu importe'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Bouton supprimer */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            <Text style={styles.deleteBtnText}>
              {isDeleting ? 'Suppression...' : '🗑 Supprimer ce contact'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionButton({
  emoji,
  line1,
  line2,
  color,
  onPress,
  disabled = false,
}: {
  emoji: string;
  line1: string;
  line2: string;
  color: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return (
    <TouchableOpacity
      style={[styles.actionBtn, disabled && { opacity: 0.4 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={[styles.actionIcon, { backgroundColor: color }]}>
        <Text style={{ fontSize: 18, color: Colors.white }}>{emoji}</Text>
      </View>
      <Text style={styles.actionLabel}>{line1}</Text>
      <Text style={styles.actionLabel}>{line2}</Text>
    </TouchableOpacity>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

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
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 28, color: C.primary, lineHeight: 32 },
  topbarTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.lg,
    color: Colors.onSurface,
  },
  editBtn: {
    paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: Radii.full, borderWidth: 1,
    borderColor: C.primary, backgroundColor: Colors.white,
  },
  editBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: C.primary },

  scrollContent: { paddingBottom: 100 },

  // Hero
  hero: { padding: Spacing[6], paddingTop: Spacing[6], overflow: 'hidden' },
  heroPattern: {
    position: 'absolute',
    inset: 0,
    top: 0, left: 0, right: 0, bottom: 0,
  },
  heroContent: { alignItems: 'center', zIndex: 1 },
  avatarWrap: { position: 'relative', marginBottom: 12 },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  heroName: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['3xl'],
    color: Colors.white,
    marginBottom: 8,
  },
  heroBirthday: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 10,
    marginTop: -4,
  },
  heroBirthdayEmpty: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.45)',
    fontStyle: 'italic',
  },
  heroNameDay: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
    marginBottom: 8,
  },
  heroBadges: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  heroBadgeYellow: { backgroundColor: 'rgba(253,211,77,0.28)', borderColor: 'rgba(253,211,77,0.5)' },
  heroBadgeText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: Radii.md,
    padding: 10,
    width: '100%',
  },
  alertIcon: { fontSize: 20 },
  alertInfo: { flex: 1 },
  alertTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.lg,
    color: '#fff',
  },
  alertSub: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.base,
    color: 'rgba(255,255,255,0.95)',
    marginTop: 2,
  },
  alertBtn: {
    backgroundColor: Colors.secondaryContainer,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
  },
  alertBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    color: Colors.onSecondaryFixed,
  },

  // Dates
  datesGrid: {
    flexDirection: 'row',
    gap: 8,
    padding: Spacing[4],
  },
  dateCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: C.primaryContainer,
    borderRadius: Radii.md,
    padding: 12,
  },
  dateIcon: {
    width: 32,
    height: 32,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dateCardLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: Colors.onSurfaceVariant,
    marginBottom: 1,
  },
  dateCardValue: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.onSurface,
  },
  dateCardSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },

  // Section
  section: { paddingHorizontal: Spacing[4], paddingBottom: Spacing[3] },
  sectionLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: Colors.onSurfaceVariant,
    marginBottom: 8,
    marginTop: Spacing[1],
  },

  // Actions
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionBtn: { flex: 1, alignItems: 'center', gap: 4 },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  actionLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 14,
  },

  // Notes
  notesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: C.primaryContainer,
    borderRadius: Radii.md,
    padding: 12,
  },
  notesText: {
    flex: 1,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
  },

  // Coordonnées
  coordsCard: {
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: C.primaryContainer,
    borderRadius: Radii.md,
    overflow: 'hidden',
  },
  coordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
  },
  coordIcon: { fontSize: 16 },
  coordValue: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },

  // Supprimer
  deleteBtn: {
    paddingVertical: 11,
    borderRadius: Radii.full,
    borderWidth: 0.5,
    borderColor: Colors.errorContainer,
    alignItems: 'center',
  },
  deleteBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.error,
  },
  });
}
