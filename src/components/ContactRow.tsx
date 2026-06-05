import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from './ui/Avatar';
import { Colors, Typography, Spacing, Radii } from '../constants/theme';
import { daysUntilBirthday, isUrgent, getAge } from '../utils/dateHelpers';
import { extractFirstName } from '../utils/nameHelpers';
import type { Contact, UpcomingEvent } from '../types/models';

interface ContactRowProps {
  contact: Contact;
  upcomingEvent?: UpcomingEvent;
  onPress: () => void;
  onCreateMessage?: () => void;
  isPartnerContact?: boolean;
  allContacts?: Contact[];
}

function buildChildLabel(child: Contact, allContacts: Contact[]): string {
  const gender = (child as any).child_gender;
  const role = gender === 'female' ? 'Fille de' : gender === 'male' ? 'Fils de' : 'Enfant de';

  const fmt = (c: Contact) => {
    const firstName = extractFirstName(c.name);
    const initial   = firstName.charAt(0).toUpperCase();
    return { lastName: c.name, initial };
  };

  const parentContact = allContacts.find((c) => c.id === (child as any).child_parent_contact_id);
  if (!parentContact) return role + ' ' + ((child as any).child_parent_name ?? '');

  const p1 = fmt(parentContact);
  const partnerContact = allContacts.find((c) => c.id === (parentContact as any).partner_contact_id);

  if (!partnerContact) return `${role} ${p1.initial}. ${p1.lastName}`;

  const p2 = fmt(partnerContact);

  // Père (M.) en premier, mère (Mme) en second
  const isCivP1Male = parentContact.civilite === 'M.';
  const [pere, mere] = isCivP1Male ? [p1, p2] : [p2, p1];

  if (pere.lastName === mere.lastName) {
    return `${role} ${pere.initial}. et ${mere.initial}. ${pere.lastName}`;
  }
  return `${role} ${pere.initial}. ${pere.lastName} et ${mere.initial}. ${mere.lastName}`;
}

export function ContactRow({ contact, upcomingEvent, onPress, onCreateMessage, isPartnerContact, allContacts = [] }: ContactRowProps) {
  const isHighlighted = upcomingEvent && isUrgent(upcomingEvent.daysUntil);
  const age = contact.birthday && contact.relation !== 'pet' ? getAge(contact.birthday) : null;

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
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{contact.name}</Text>
          {age !== null && age >= 0 && (
            <Text style={styles.ageBadge}>{age} ans</Text>
          )}
          {isPartnerContact && <Text style={styles.partnerBadge}>💑</Text>}
        </View>
        <Text style={[styles.sub, isHighlighted && styles.subHighlighted]}>
          {contact.relation === 'pet' && contact.pet_owner_name
            ? `🐾 Animal de ${contact.pet_owner_name}`
            : contact.relation === 'child_of'
            ? `👶 ${buildChildLabel(contact, allContacts)}`
            : contact.relation === 'family'
            ? (extractFamilyLink(contact.notes) ?? 'Famille')
            : RELATION_LABELS[contact.relation]}
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
              {upcomingEvent.eventType === 'birthday'
                ? '✦ Créer un message'
                : upcomingEvent.daysUntil === 0 ? '🌸 Fête · aujourd\'hui'
                : upcomingEvent.daysUntil === 1 ? '🌸 Fête · demain'
                : `🌸 Fête · dans ${upcomingEvent.daysUntil}j`}
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
  if (event.eventType === 'birthday') {
    if (event.daysUntil === 0) return 'Anniversaire aujourd\'hui 🎉';
    if (event.daysUntil === 1) return 'Anniversaire demain 🎁🔥';
    return `Anniversaire dans ${event.daysUntil}j 🎁`;
  } else {
    if (event.daysUntil === 0) return 'Fête aujourd\'hui 🌸';
    if (event.daysUntil === 1) return 'Fête demain 🌸';
    return `Fête dans ${event.daysUntil}j 🌸`;
  }
}

function formatBirthday(birthday: string): string {
  const [, mm, dd] = birthday.split('-');
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
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

function extractFamilyLink(notes: string | null | undefined): string | null {
  if (!notes) return null;
  const m = notes.match(/^Lien\s*:\s*(.+?)(\n|$)/);
  if (!m) return null;
  const link = m[1].trim();
  return link.charAt(0).toUpperCase() + link.slice(1);
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingVertical: 11,
    paddingHorizontal: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.white,
  },
  rowHighlighted: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radii.lg,
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[2],
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarWrap: { flexShrink: 0 },
  info: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  partnerBadge: {
    fontSize: 13,
  },
  ageBadge: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radii.full,
  },
  name: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurface,
    marginBottom: 2,
  },
  sub: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.sm,
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
    paddingHorizontal: 8,
    borderRadius: Radii.full,
  },
  createBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 10,
    color: Colors.onPrimary,
  },
  chevron: {
    fontSize: 22,
    color: Colors.outlineVariant,
    lineHeight: 24,
  },
});
