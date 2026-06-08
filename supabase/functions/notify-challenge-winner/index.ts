import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CHALLENGE_EMAIL = 'défi@confetticake.fr';
const CHALLENGE_GOAL  = 5;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const resendKey = Deno.env.get('RESEND_API_KEY');

    const { winner_id, winner_name, referral_count } = await req.json();
    if (!winner_id) {
      return new Response(JSON.stringify({ error: 'winner_id manquant' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Récupérer l'email du gagnant via auth admin
    let winner_email: string | null = null;
    try {
      const { data: { user } } = await supabase.auth.admin.getUserById(winner_id);
      winner_email = user?.email ?? null;
    } catch { /* silent */ }

    // 1. Marquer challenge_won_at sur le profil (idempotent grâce au WHERE NULL)
    await (supabase as any)
      .from('profiles')
      .update({ challenge_won_at: new Date().toISOString() })
      .eq('id', winner_id)
      .is('challenge_won_at', null);

    // 2. Envoyer email à défi@confetticake.fr
    const subject = `🏆 Nouveau gagnant du challenge — ${winner_name ?? winner_email}`;
    const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"/></head>
<body style="font-family:Arial,sans-serif;background:#f4f0f8;padding:32px 16px;">
  <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;margin:0 auto;">
    <tr>
      <td style="background:linear-gradient(135deg,#9b6bb5,#c49ad4);padding:32px;text-align:center;">
        <p style="font-size:48px;margin:0;">🏆</p>
        <h1 style="color:#fff;font-size:24px;margin:12px 0 0;">Nouveau gagnant du Challenge !</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 32px;">
        <p style="color:#333;font-size:16px;line-height:1.6;">
          <strong>${winner_name ?? 'Un utilisateur'}</strong> vient d'atteindre l'objectif du challenge prescripteurs
          en parrainant <strong>${referral_count ?? CHALLENGE_GOAL} amis</strong> !
        </p>
        <table style="background:#f9f5ff;border-radius:12px;padding:16px 20px;width:100%;margin:16px 0;">
          <tr><td>
            <p style="margin:0 0 6px;color:#9b6bb5;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Infos du gagnant</p>
            <p style="margin:0 0 4px;color:#333;font-size:14px;">👤 ${winner_name ?? '—'}</p>
            <p style="margin:0 0 4px;color:#333;font-size:14px;">📧 ${winner_email ?? '—'}</p>
            <p style="margin:0;color:#333;font-size:14px;">🎯 ${referral_count ?? CHALLENGE_GOAL} filleuls</p>
          </td></tr>
        </table>
        <p style="color:#555;font-size:14px;line-height:1.6;">
          Pour lui offrir son <strong>mois Premium gratuit</strong>, mets à jour son plan dans Supabase :<br/>
          <code style="background:#f0f0f0;padding:4px 8px;border-radius:4px;font-size:13px;">
            UPDATE profiles SET plan = 'premium' WHERE id = '${winner_id}';
          </code>
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

    if (resendKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'ConfettiCake <noreply@confetticake.fr>',
          to: [CHALLENGE_EMAIL],
          subject,
          html,
        }),
      });
      if (!res.ok) console.error('Resend error:', await res.text());
    } else {
      console.warn('RESEND_API_KEY non configuré — email simulé');
    }

    // 3. Push notif au gagnant (best-effort)
    const { data: profile } = await supabase
      .from('profiles')
      .select('push_token')
      .eq('id', winner_id)
      .single();

    if ((profile as any)?.push_token) {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: (profile as any).push_token,
          title: '🏆 Challenge réussi !',
          body: `Tu as parrainé ${CHALLENGE_GOAL} amis — notre équipe te contacte sous 48h pour ton cadeau ! 🎁`,
          sound: 'default',
        }),
      }).catch(() => {});
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('notify-challenge-winner error:', err);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
