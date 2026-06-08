import { supabase } from './supabase';

const CREDITS_PER_REFERRAL = 5;
const CHALLENGE_GOAL       = 5;

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
  const { data: referrer, error } = await (supabase as any)
    .from('profiles')
    .select('id, credits, full_name')
    .eq('referral_code', code)
    .single();

  if (error || !referrer) return; // Code invalide — silencieux
  if (referrer.id === refereeId) return; // Ne peut pas se parrainer soi-même

  // 2. Enregistrer le parrainage
  await (supabase as any).from('referrals').insert({
    referrer_id: referrer.id,
    referee_id: refereeId,
    referred_email: refereeEmail,
    referrer_name: referrer.full_name ?? null,
    credits_awarded: CREDITS_PER_REFERRAL,
  });

  // 2b. Notifier le parrain par push (best-effort, non bloquant)
  (supabase as any).functions.invoke('notify-referral', {
    body: { referrer_id: referrer.id, referee_email: refereeEmail },
  }).catch(() => {/* silent */});

  // 3. Créditer le parrain
  await (supabase as any)
    .from('profiles')
    .update({ credits: (referrer.credits ?? 0) + CREDITS_PER_REFERRAL })
    .eq('id', referrer.id);

  // 4. Créditer le filleul
  const { data: referee } = await (supabase as any)
    .from('profiles')
    .select('credits')
    .eq('id', refereeId)
    .single();

  await (supabase as any)
    .from('profiles')
    .update({ credits: ((referee?.credits) ?? 0) + CREDITS_PER_REFERRAL })
    .eq('id', refereeId);

  // 5. Challenge prescripteurs — vérifier si l'objectif est atteint
  const { count } = await (supabase as any)
    .from('referrals')
    .select('id', { count: 'exact', head: true })
    .eq('referrer_id', referrer.id);

  if ((count ?? 0) >= CHALLENGE_GOAL) {
    const { data: referrerProfile } = await (supabase as any)
      .from('profiles')
      .select('challenge_won_at')
      .eq('id', referrer.id)
      .single();

    if (!referrerProfile?.challenge_won_at) {
      (supabase as any).functions.invoke('notify-challenge-winner', {
        body: {
          winner_id:      referrer.id,
          winner_name:    referrer.full_name ?? null,
          referral_count: count,
        },
      }).catch(() => {});
    }
  }
}

/**
 * Récupère le parrainage dont l'utilisateur est le filleul (qui l'a parrainé).
 */
export async function fetchMyReferral(refereeId: string) {
  const { data } = await (supabase as any)
    .from('referrals')
    .select('id, referrer_name, credits_awarded, created_at')
    .eq('referee_id', refereeId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return data ?? null;
}

/**
 * Récupère le dernier classement mensuel des prescripteurs (volume + qualité).
 */
export async function fetchLatestMonthlyChallenge() {
  const { data } = await (supabase as any)
    .from('referral_monthly_challenges')
    .select('period_start, period_end, volume_winner_name, volume_winner_count, quality_winner_name, quality_winner_count')
    .order('period_start', { ascending: false })
    .limit(1)
    .maybeSingle();

  return data ?? null;
}

/**
 * Récupère l'historique des parrainages du user connecté.
 */
export async function fetchReferralHistory(referrerId: string) {
  const { data } = await (supabase as any)
    .from('referrals')
    .select('id, referred_email, credits_awarded, created_at, status')
    .eq('referrer_id', referrerId)
    .order('created_at', { ascending: false });

  return data ?? [];
}
