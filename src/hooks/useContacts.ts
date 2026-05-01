import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import {
  fetchContacts,
  fetchContact,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.service';
import { getUpcomingEvents } from '../utils/dateHelpers';
import type { Contact } from '../types/models';

const CONTACTS_KEY = 'contacts';

// ── Liste complète ─────────────────────────────

export function useContacts() {
  const userId = useAuthStore((s) => s.user?.id);

  return useQuery({
    queryKey: [CONTACTS_KEY, userId],
    queryFn: () => fetchContacts(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

// ── Événements à venir (anniversaires + fêtes) ─

export function useUpcomingEvents(limitDays = 365) {
  const { data: contacts = [] } = useContacts();
  return getUpcomingEvents(contacts, limitDays);
}

// ── Détail d'un contact ────────────────────────

export function useContact(id: string) {
  return useQuery({
    queryKey: [CONTACTS_KEY, id],
    queryFn: () => fetchContact(id),
    enabled: !!id,
  });
}

// ── Créer ──────────────────────────────────────

export function useCreateContact() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation({
    mutationFn: (input: Omit<Contact, 'id' | 'user_id' | 'created_at'>) =>
      createContact(userId!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTACTS_KEY, userId] });
    },
  });
}

// ── Mettre à jour ──────────────────────────────

export function useUpdateContact() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Omit<Contact, 'id' | 'user_id' | 'created_at'>>;
    }) => updateContact(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [CONTACTS_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [CONTACTS_KEY, userId] });
    },
  });
}

// ── Supprimer ──────────────────────────────────

export function useDeleteContact() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation({
    mutationFn: (id: string) => deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTACTS_KEY, userId] });
    },
  });
}

// ── Recherche locale ───────────────────────────

export function useContactSearch(query: string) {
  const { data: contacts = [] } = useContacts();
  if (!query.trim()) return contacts;
  const q = query.toLowerCase();
  return contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.email?.toLowerCase().includes(q),
  );
}

// ── Groupement alphabétique ────────────────────

export function useContactsGrouped() {
  const { data: contacts = [], ...rest } = useContacts();

  const grouped: Record<string, Contact[]> = {};
  for (const contact of contacts) {
    const letter = contact.name[0]?.toUpperCase() ?? '#';
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(contact);
  }

  const sections = Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, data]) => ({ letter, data }));

  return { sections, ...rest };
}

// ── Animaux rattachés à un maître ──────────────

export function usePetsByOwnerName(ownerName: string) {
  const { data: contacts = [] } = useContacts();
  if (!ownerName.trim()) return [];
  const lower = ownerName.trim().toLowerCase();
  return contacts.filter(
    (c) => c.relation === 'pet' && c.pet_owner_name?.toLowerCase() === lower,
  );
}
