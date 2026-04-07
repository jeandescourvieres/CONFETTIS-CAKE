import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from './ui/Avatar';
import { Colors, Typography, Spacing, Radii } from '../constants/theme';
import { daysUntilBirthday, isUrgent } from '../utils/dateHelpers';
import type { Contact, UpcomingEvent } from '../types/models';

interface ContactRowProps {
  contact: Contact;
  upcomingEvent?: UpcomingEvent;
  onPress: () => void;
  onCreateMessage?: () => void;
}

export function ContactRow({ contact, upcomingEvent, onPress, onCreateMessage }: ContactRowProps) {
  const isHighlighted = upcomingEvent && isUrgent(upcomingEvent.daysUntil);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      style={[styles.row, isHighlighted && styles.rowHighlighted]}
    >
      <View style={styles.avatarWrap}>
        <Avatar
          uri={contact.avatar_url}
          name={contact.name}
          size="md"
          badge={upcomingEvent?.eventType === 'birthday' && isHighlighted ? '🔥' : undefined}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={[styles.sub, isHighlighted && styles.subHighlighted]}>
          {RELATION_LABELS[contact.relation]}
          {upcomingEvent
            ? ` · ${formatEventLabel(upcomingEvent)}`
            : contact.birthday
            ? ` · ${formatBirthday(contact.birthday)}`
            : ''}
        </Text>
      </View>

      <View style={styles.right}>
        {upcomingEvent && isUrgent(upcomingEvent.daysUntil) && onCreateMessage ? (
          <TouchableOpacity
            onPress={(e) => { e.stopPropagation(); onCreateMessage(); }}
            style={styles.createBtn}
          >
            <Text style={styles.createBtnText}>
              {upcomingEvent.eventType === 'birthday' ? '✦ Créer' : '🌸 Fête'}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.chevron}>›</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

function formatEventLabel(event: UpcomingEvent): string {
  if (event.daysUntil === 0) return event.eventType === 'birthday' ? 'Anniversaire 🎉' : 'Fête 🌸';
  if (event.daysUntil === 1) return event.eventType === 'birthday' ? 'Demain 🎂🔥' : 'Fête demain 🌸';
  return `Dans ${event.daysUntil}j ${event.eventType === 'birthday' ? '🎂' : '🌸'}`;
}

function formatBirthday(birthday: string): string {
  const [, mm, dd] = birthday.split('-');
  const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc'];
  return `${parseInt(dd)} ${months[parseInt(mm) - 1]}`;
}

const RELATION_LABELS: Record<string, string> = {
  best_friend: 'Meilleur·e ami·e',
  friend: 'Ami·e',
  family: 'Famille',
  partner: 'Partenaire',
  colleague: 'Collègue',
  other: 'Autre',
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingVertical: 11,
    paddingHorizontal: Spacing[4],
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.surfaceContainerLow,
    backgroundColor: Colors.white,
  },
  rowHighlighted: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radii.lg,
    marginBottom: Spacing[2],
    borderBottomWidth: 1.5,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarWrap: { flexShrink: 0 },
  info: { flex: 1 },
  name: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurface,
    marginBottom: 2,
  },
  sub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },
  subHighlighted: {
    color: Colors.primary,
    fontFamily: 'BeVietnamPro_600SemiBold',
  },
  right: { alignItems: 'flex-end' },
  createBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radii.full,
  },
  createBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    color: Colors.onPrimary,
  },
  chevron: {
    fontSize: 22,
    color: Colors.outlineVariant,
    lineHeight: 24,
  },
});
