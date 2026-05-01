// ═══════════════════════════════════════════════════════════
//  Confettis & Cake — Hooks Livre d'or (Phase 9)
// ═══════════════════════════════════════════════════════════

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';

// ── Types ─────────────────────────────────────────────────
export interface Guestbook {
  id: string;
  user_id: string;
  contact_id: string | null;
  title: string;
  event_date: string | null;
  token: string;
  is_open: boolean;
  created_at: string;
}

export interface GuestbookEntry {
  id: string;
  guestbook_id: string;
  contributor_name: string;
  message: string;
  created_at: string;
}

// ── Liste des livres d'or de l'utilisateur ────────────────
export function useGuestbooks() {
  return useQuery({
    queryKey: ['guestbooks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guestbooks')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Guestbook[];
    },
  });
}

// ── Un livre d'or par ID ──────────────────────────────────
export function useGuestbook(id: string) {
  return useQuery({
    queryKey: ['guestbook', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guestbooks')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Guestbook;
    },
    enabled: !!id,
  });
}

// ── Contributions d'un livre ──────────────────────────────
export function useGuestbookEntries(guestbookId: string) {
  return useQuery({
    queryKey: ['guestbook_entries', guestbookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guestbook_entries')
        .select('*')
        .eq('guestbook_id', guestbookId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data ?? []) as GuestbookEntry[];
    },
    enabled: !!guestbookId,
  });
}

// ── Créer un livre ────────────────────────────────────────
export function useCreateGuestbook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      contact_id?: string | null;
      title: string;
      event_date?: string | null;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non connecté');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.from('guestbooks') as any)
        .insert({ ...payload, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data as Guestbook;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['guestbooks'] }),
  });
}

// ── Fermer / rouvrir un livre ─────────────────────────────
export function useToggleGuestbook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_open }: { id: string; is_open: boolean }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('guestbooks') as any)
        .update({ is_open })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: ['guestbooks'] });
      qc.invalidateQueries({ queryKey: ['guestbook', id] });
    },
  });
}

// ── Supprimer un livre ────────────────────────────────────
export function useDeleteGuestbook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('guestbooks').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['guestbooks'] }),
  });
}

// ── Ajouter une contribution (service role via edge function) ─
export function useAddGuestbookEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      token: string;
      contributor_name: string;
      message: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('guestbook-contribute', {
        body: payload,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (_d, { token }) => {
      // token → pas de queryKey direct, on invalide globalement
      qc.invalidateQueries({ queryKey: ['guestbook_entries'] });
    },
  });
}
