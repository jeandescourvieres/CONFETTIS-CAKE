import { useMemo } from 'react';
import { useMessages } from './useAIGenerate';
import { useContacts } from './useContacts';

export interface BarometerContact {
  id: string;
  name: string;
  relation: string;
  daysSinceLastMessage: number | null; // null = jamais écrit
  avatar_url?: string | null;
}

const THRESHOLD_DAYS = 60; // signaler après 60 jours sans message

export function useRelationBarometer(): BarometerContact[] {
  const { data: messages = [] } = useMessages();
  const { data: contacts = [] } = useContacts();

  return useMemo(() => {
    // Humains seulement (pas animaux, pas enfants)
    const humans = contacts.filter(
      (c) => c.relation !== 'pet' && c.relation !== 'child_of'
    );

    // Dernier message envoyé par contact
    const lastMsgMap = new Map<string, Date>();
    for (const m of messages) {
      if (!m.contact_id) continue;
      const date = new Date(m.created_at);
      const existing = lastMsgMap.get(m.contact_id);
      if (!existing || date > existing) lastMsgMap.set(m.contact_id, date);
    }

    const now = new Date();
    const result: BarometerContact[] = [];

    for (const c of humans) {
      const last = lastMsgMap.get(c.id);
      let daysSince: number | null = null;
      if (last) {
        daysSince = Math.floor((now.getTime() - last.getTime()) / 86400000);
      }

      // Inclure si jamais écrit OU si > seuil
      if (daysSince === null || daysSince >= THRESHOLD_DAYS) {
        result.push({
          id: c.id,
          name: c.name,
          relation: c.relation,
          daysSinceLastMessage: daysSince,
          avatar_url: (c as any).avatar_url,
        });
      }
    }

    // Trier : jamais écrit en premier, puis par ancienneté
    result.sort((a, b) => {
      if (a.daysSinceLastMessage === null && b.daysSinceLastMessage === null) return 0;
      if (a.daysSinceLastMessage === null) return -1;
      if (b.daysSinceLastMessage === null) return 1;
      return b.daysSinceLastMessage - a.daysSinceLastMessage;
    });

    return result.slice(0, 3); // Max 3 suggestions
  }, [messages, contacts]);
}
