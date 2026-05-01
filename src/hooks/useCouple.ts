import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../stores/authStore';
import { fetchContacts } from '../services/contacts.service';
import { getUpcomingEvents } from '../utils/dateHelpers';
import type { Contact } from '../types/models';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CoupleLink {
  id: string;
  user_a: string;
  user_b: string | null;
  status: 'pending' | 'active' | 'ended';
  invite_code: string;
  created_at: string;
  linked_at: string | null;
  partner_profile?: { id: string; full_name: string | null; avatar_url: string | null } | null;
}

// ── Hooks principaux ──────────────────────────────────────────────────────────

/** Lien couple de l'utilisateur courant (actif ou en attente) */
export function useMyCouple() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['couple', user?.id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('couple_links')
        .select('*')
        .or(`user_a.eq.${user!.id},user_b.eq.${user!.id}`)
        .in('status', ['pending', 'active'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;

      // Récupère le profil du partenaire si le lien est actif
      const partnerId = data.user_a === user!.id ? data.user_b : data.user_a;
      if (data.status === 'active' && partnerId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .eq('id', partnerId)
          .maybeSingle();
        return { ...data, partner_profile: profile } as CoupleLink;
      }
      return data as CoupleLink;
    },
    enabled: !!user,
  });
}

/** Crée une invitation (user_a) */
export function useCreateCoupleInvite() {
  const qc   = useQueryClient();
  const user = useAuthStore((s) => s.user);
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await (supabase as any)
        .from('couple_links')
        .insert({ user_a: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data as CoupleLink;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['couple'] }),
  });
}

/** Accepte une invitation via le code (user_b) */
export function useAcceptCoupleInvite() {
  const qc   = useQueryClient();
  const user = useAuthStore((s) => s.user);
  return useMutation({
    mutationFn: async (code: string) => {
      // Cherche l'invitation en attente
      const { data: link, error: findErr } = await (supabase as any)
        .from('couple_links')
        .select('*')
        .eq('invite_code', code.toUpperCase().trim())
        .eq('status', 'pending')
        .is('user_b', null)
        .maybeSingle();
      if (findErr) throw findErr;
      if (!link) throw new Error('Code invalide ou déjà utilisé.');
      if (link.user_a === user!.id) throw new Error('Tu ne peux pas rejoindre ton propre lien.');

      // Accepte
      const { data, error: updErr } = await (supabase as any)
        .from('couple_links')
        .update({ user_b: user!.id, status: 'active', linked_at: new Date().toISOString() })
        .eq('id', link.id)
        .select()
        .single();
      if (updErr) throw updErr;
      return data as CoupleLink;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['couple'] });
      qc.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

/** Termine le lien couple */
export function useEndCouple() {
  const qc   = useQueryClient();
  const user = useAuthStore((s) => s.user);
  return useMutation({
    mutationFn: async (linkId: string) => {
      const { error } = await (supabase as any)
        .from('couple_links')
        .update({ status: 'ended' })
        .eq('id', linkId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['couple'] });
      qc.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

// ── Contacts du partenaire ────────────────────────────────────────────────────

/** Contacts du partenaire (null si pas de lien actif) */
export function usePartnerContacts() {
  const user    = useAuthStore((s) => s.user);
  const { data: couple } = useMyCouple();

  const partnerId = couple?.status === 'active'
    ? (couple.user_a === user?.id ? couple.user_b : couple.user_a)
    : null;

  return useQuery({
    queryKey: ['contacts', 'partner', partnerId],
    queryFn: () => fetchContacts(partnerId!),
    enabled: !!partnerId,
    staleTime: 1000 * 60 * 5,
  });
}

/** Événements à venir pour les contacts du partenaire */
export function usePartnerUpcomingEvents(limitDays = 365) {
  const { data: contacts = [] } = usePartnerContacts();
  return getUpcomingEvents(contacts, limitDays);
}

/** Label court du partenaire */
export function usePartnerName(): string | null {
  const user    = useAuthStore((s) => s.user);
  const { data: couple } = useMyCouple();
  if (!couple || couple.status !== 'active') return null;
  const profile = couple.partner_profile;
  if (profile?.full_name) return profile.full_name.split(' ')[0];
  return 'ton partenaire';
}
