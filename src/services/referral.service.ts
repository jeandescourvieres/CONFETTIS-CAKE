import { supabase } from './supabase';

const CREDITS_PER_REFERRAL = 5;

/**
 * Appelé à l'inscription si l'utilisateur a saisi un code parrainage.
 * - Trouve le parrain via son referral_code
 * - Crée la ligne dans referrals
 * - Crédite les deux utilisateurs (+5 chacun)
 */
export async function applyReferralCode(
  referralCode: string,
  refereeId: string,
  refereeEmail: string,
): Promise<void> {
  const code = referralCode.trim().toUpperCase();
  if (!code) return;

  // 1. Trouver le parrain
  const { data: referrer, error } = await supabase
    .from('profiles')
    .select('id, credits')
    .eq('referral_code', code)
    .single();

  if (error || !referrer) return; // Code invalide — silencieux
  if (referrer.id === refereeId) return; // Ne peut pas se parrainer soi-même

  // 2. Enregistrer le parrainage
  await supabase.from('referrals').insert({
    referrer_id: referrer.id,
    referee_id: refereeId,
    referred_email: refereeEmail,
    credits_awarded: CREDITS_PER_REFERRAL,
  });

  // 3. Créditer le parrain
  await supabase
    .from('profiles')
    .update({ credits: (referrer.credits ?? 0) + CREDITS_PER_REFERRAL })
    .eq('id', referrer.id);

  // 4. Créditer le filleul
  const { data: referee } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', refereeId)
    .single();

  await supabase
    .from('profiles')
    .update({ credits: ((referee?.credits) ?? 0) + CREDITS_PER_REFERRAL })
    .eq('id', refereeId);
}

/**
 * Récupère l'historique des parrainages du user connecté.
 */
export async function fetchReferralHistory(referrerId: string) {
  const { data } = await supabase
    .from('referrals')
    .select('id, referred_email, credits_awarded, created_at')
    .eq('referrer_id', referrerId)
    .order('created_at', { ascending: false });

  return data ?? [];
}
