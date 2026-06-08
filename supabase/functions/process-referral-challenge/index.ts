import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CHALLENGE_EMAIL = 'défi@confetticake.fr';

function displayName(fullName: string | null | undefined): string | null {
  if (!fullName) return null;
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0];
  const lastInitial = parts.length > 1 ? `${parts[parts.length - 1][0]}.` : '';
  return lastInitial ? `${first} ${lastInitial}` : first;
}

function previousMonthRange(now: Date) {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const end   = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const toISODate = (d: Date) => d.toISOString().slice(0, 10);
  return { periodStart: toISODate(start), periodEnd: toISODate(end), startISO: start.toISOString(), endISO: end.toISOString() };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const resendKey = Deno.env.get('RESEND_API_KEY');

    const { periodStart, periodEnd, startISO, endISO } = previousMonthRange(new Date());

    // Déjà calculé pour cette période ? (idempotent)
    const { data: existing } = await (supabase as any)
      .from('referral_monthly_challenges')
      .select('id')
      .eq('period_start', periodStart)
      .eq('period_end', periodEnd)
      .maybeSingle();
    if (existing) {
      return new Response(JSON.stringify({ skipped: true, reason: 'already_processed' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1. Parrainages du mois écoulé
    const { data: referrals } = await (supabase as any)
      .from('referrals')
      .select('referrer_id, referee_id')
      .gte('created_at', startISO)
      .lt('created_at', endISO);

    const rows: { referrer_id: string; referee_id: string | null }[] = referrals ?? [];

    if (rows.length === 0) {
      await (supabase as any).from('referral_monthly_challenges').insert({
        period_start: periodStart, period_end: periodEnd,
        volume_winner_id: null, volume_winner_count: 0,
        quality_winner_id: null, quality_winner_count: 0,
      });
      return new Response(JSON.stringify({ success: true, empty: true }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Classement volume — nb de filleuls par parrain
    const volumeCounts = new Map<string, number>();
    for (const row of rows) {
      volumeCounts.set(row.referrer_id, (volumeCounts.get(row.referrer_id) ?? 0) + 1);
    }

    // 3. Classement qualité — nb de ces filleuls actuellement en Premium
    const refereeIds = [...new Set(rows.map((r) => r.referee_id).filter(Boolean))] as string[];
    const { data: refereeProfiles } = await (supabase as any)
      .from('profiles')
      .select('id, plan')
      .in('id', refereeIds);

    const premiumRefereeIds = new Set(
      (refereeProfiles ?? []).filter((p: any) => p.plan === 'premium').map((p: any) => p.id),
    );

    const qualityCounts = new Map<string, number>();
    for (const row of rows) {
      if (row.referee_id && premiumRefereeIds.has(row.referee_id)) {
        qualityCounts.set(row.referrer_id, (qualityCounts.get(row.referrer_id) ?? 0) + 1);
      }
    }

    const topOf = (counts: Map<string, number>) => {
      let bestId: string | null = null;
      let bestCount = 0;
      for (const [id, count] of counts) {
        if (count > bestCount) { bestId = id; bestCount = count; }
      }
      return { id: bestId, count: bestCount };
    };

    const volumeWinner  = topOf(volumeCounts);
    const qualityWinner = topOf(qualityCounts);

    // 4. Récupérer les profils des gagnants (nom d'affichage + push token)
    const winnerIds = [...new Set([volumeWinner.id, qualityWinner.id].filter(Boolean))] as string[];
    const profilesById = new Map<string, any>();
    if (winnerIds.length > 0) {
      const { data: winnerProfiles } = await (supabase as any)
        .from('profiles')
        .select('id, full_name, push_token')
        .in('id', winnerIds);
      for (const p of winnerProfiles ?? []) profilesById.set(p.id, p);
    }

    // 5. Enregistrer le résultat (idempotent grâce à la contrainte unique de période)
    await (supabase as any).from('referral_monthly_challenges').insert({
      period_start: periodStart, period_end: periodEnd,
      volume_winner_id: volumeWinner.id,
      volume_winner_name: displayName(profilesById.get(volumeWinner.id ?? '')?.full_name),
      volume_winner_count: volumeWinner.count,
      quality_winner_id: qualityWinner.id,
      quality_winner_name: displayName(profilesById.get(qualityWinner.id ?? '')?.full_name),
      quality_winner_count: qualityWinner.count,
    });

    const periodLabel = new Date(startISO).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' });

    if (resendKey && winnerIds.length > 0) {
      const lines: string[] = [];
      if (volumeWinner.id) {
        const p = profilesById.get(volumeWinner.id);
        lines.push(`<p>🥇 <strong>Volume</strong> — ${p?.full_name ?? volumeWinner.id} avec <strong>${volumeWinner.count}</strong> filleuls parrainés</p>`);
      }
      if (qualityWinner.id) {
        const p = profilesById.get(qualityWinner.id);
        lines.push(`<p>💎 <strong>Qualité</strong> — ${p?.full_name ?? qualityWinner.id} avec <strong>${qualityWinner.count}</strong> filleuls passés en Premium</p>`);
      }
      const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"/></head>
<body style="font-family:Arial,sans-serif;background:#f4f0f8;padding:32px 16px;">
  <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;margin:0 auto;">
    <tr>
      <td style="background:linear-gradient(135deg,#9b6bb5,#c49ad4);padding:32px;text-align:center;">
        <p style="font-size:48px;margin:0;">🏆</p>
        <h1 style="color:#fff;font-size:24px;margin:12px 0 0;">Challenge prescripteurs — ${periodLabel}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 32px;">
        <p style="color:#333;font-size:16px;line-height:1.6;">Voici les gagnants du mois :</p>
        <table style="background:#f9f5ff;border-radius:12px;padding:16px 20px;width:100%;margin:16px 0;">
          <tr><td style="color:#333;font-size:14px;">${lines.join('')}</td></tr>
        </table>
        <p style="color:#555;font-size:14px;line-height:1.6;">
          Pense à les contacter pour organiser leur récompense (Premium offert, ou bon d'achat si le volume est exceptionnel sur la durée).
        </p>
      </td>
    </tr>
    <tr>
      <td style="background:#faf8fd;padding:16px 32px;text-align:center;border-top:1px solid #ede8f5;">
        <p style="margin:0;color:#aaa;font-size:12px;">ConfettiCake — Challenge prescripteurs 🎁</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'ConfettiCake <noreply@confetticake.fr>',
          to: [CHALLENGE_EMAIL],
          subject: `🏆 Gagnants du challenge prescripteurs — ${periodLabel}`,
          html,
        }),
      });
      if (!res.ok) console.error('Resend error:', await res.text());
    }

    // Push notif aux gagnants
    for (const id of winnerIds) {
      const p = profilesById.get(id);
      if (!p?.push_token) continue;
      const isVolume  = id === volumeWinner.id;
      const isQuality = id === qualityWinner.id;
      const body = isVolume && isQuality
        ? `Tu es en tête des deux classements du mois (volume et qualité) — notre équipe te contacte pour ta récompense ! 🎁`
        : isVolume
          ? `Tu es le parrain le plus actif du mois avec ${volumeWinner.count} filleuls — notre équipe te contacte pour ta récompense ! 🎁`
          : `Tes filleuls sont les plus nombreux à être passés en Premium ce mois-ci — notre équipe te contacte pour ta récompense ! 🎁`;

      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: p.push_token,
          title: '🏆 Challenge prescripteurs du mois — tu as gagné !',
          body,
          sound: 'default',
        }),
      }).catch(() => {});
    }

    return new Response(JSON.stringify({ success: true, volumeWinner, qualityWinner }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('process-referral-challenge error:', err);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
