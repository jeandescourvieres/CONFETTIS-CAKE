// ═══════════════════════════════════════════════════════════
//  Confettis & Cake — Liste de souhaits (Phase 2)
// ═══════════════════════════════════════════════════════════

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';

export interface WishItem {
  id: string;
  user_id: string;
  contact_id: string;
  description: string;
  category: string | null;
  budget_max: number | null;   // en centimes
  is_done: boolean;
  created_at: string;
}

// ── Liste des souhaits d'un contact ──────────────────────────
export function useWishItems(contactId: string) {
  return useQuery({
    queryKey: ['wish_items', contactId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wish_items')
        .select('*')
        .eq('contact_id', contactId)
        .order('is_done', { ascending: true })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as WishItem[];
    },
    enabled: !!contactId,
  });
}

// ── Ajouter un souhait ────────────────────────────────────────
export function useAddWishItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      contact_id: string;
      description: string;
      category?: string | null;
      budget_max?: number | null;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non connecté');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.from('wish_items') as any)
        .insert({ ...payload, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data as WishItem;
    },
    onSuccess: (_d, { contact_id }) =>
      qc.invalidateQueries({ queryKey: ['wish_items', contact_id] }),
  });
}

// ── Cocher / décocher un souhait ──────────────────────────────
export function useToggleWishItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_done, contact_id }: { id: string; is_done: boolean; contact_id: string }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('wish_items') as any)
        .update({ is_done })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_d, { contact_id }) =>
      qc.invalidateQueries({ queryKey: ['wish_items', contact_id] }),
  });
}

// ── Supprimer un souhait ──────────────────────────────────────
export function useDeleteWishItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, contact_id }: { id: string; contact_id: string }) => {
      const { error } = await supabase.from('wish_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_d, { contact_id }) =>
      qc.invalidateQueries({ queryKey: ['wish_items', contact_id] }),
  });
}
