import { supabase } from './supabase';
import type { Pot, Contribution, PotStatus } from '../types/models';

// ── Pots ──────────────────────────────────────────────────────────────────────

export async function fetchMyPots(userId: string): Promise<Pot[]> {
  const { data, error } = await supabase
    .from('pots')
    .select('*, contact:contacts(*)')
    .eq('creator_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Pot[];
}

export async function fetchPot(id: string): Promise<Pot> {
  const { data, error } = await supabase
    .from('pots')
    .select('*, contact:contacts(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as unknown as Pot;
}

export async function fetchPotByToken(shareToken: string): Promise<Pot> {
  const { data, error } = await supabase
    .from('pots')
    .select('*, contact:contacts(*)')
    .eq('share_token', shareToken)
    .single();
  if (error) throw error;
  return data as unknown as Pot;
}

export async function createPot(
  userId: string,
  input: {
    contact_id: string;
    title: string;
    target_amount: number;
    gift_description?: string | null;
    deadline?: string | null;
  },
): Promise<Pot> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('pots') as any)
    .insert({ ...input, creator_id: userId })
    .select('*, contact:contacts(*)')
    .single();
  if (error) throw error;
  return data as Pot;
}

export async function updatePotStatus(id: string, status: PotStatus): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('pots') as any)
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function updatePotDeadline(id: string, deadline: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('pots') as any)
    .update({ deadline })
    .eq('id', id);
  if (error) throw error;
}

export async function updatePotGiftDescription(id: string, gift_description: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('pots') as any)
    .update({ gift_description })
    .eq('id', id);
  if (error) throw error;
}

// ── Contributions ────────────────────────────────────────────────────────────

export async function fetchContributions(potId: string): Promise<Contribution[]> {
  const { data, error } = await supabase
    .from('contributions')
    .select('*')
    .eq('pot_id', potId)
    .not('paid_at', 'is', null)
    .order('paid_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Contribution[];
}

export async function createPaymentIntent(input: {
  pot_id: string;
  contributor_name: string;
  contributor_email: string;
  amount_cents: number;
}): Promise<{ client_secret: string; contribution_id: string }> {
  const { data, error } = await supabase.functions.invoke('create-payment-intent', {
    body: input,
  });
  if (error) throw new Error(error.message ?? 'Erreur paiement');
  return data as { client_secret: string; contribution_id: string };
}

// ── Watchers (participants app) ───────────────────────────────────────────────

export async function watchPot(potId: string, userId: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('pot_watchers') as any)
    .upsert({ pot_id: potId, user_id: userId });
  if (error && error.code !== '23505') throw error; // ignore unique constraint
}

export async function unwatchPot(potId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('pot_watchers')
    .delete()
    .eq('pot_id', potId)
    .eq('user_id', userId);
  if (error) throw error;
}

// ── Push token ────────────────────────────────────────────────────────────────

export async function savePushToken(userId: string, token: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('profiles') as any)
    .update({ push_token: token })
    .eq('id', userId);
  if (error) throw error;
}
