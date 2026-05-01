import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { referrer_id, referee_email } = await req.json();
    if (!referrer_id) {
      return new Response(JSON.stringify({ error: 'referrer_id manquant' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Récupère le push token du parrain
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('push_token, full_name')
      .eq('id', referrer_id)
      .single();

    const pushToken = profile?.push_token;
    if (!pushToken) {
      // Pas de token — pas de notif, mais ce n'est pas une erreur
      return new Response(JSON.stringify({ sent: false, reason: 'no_token' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Masque l'email pour la notif (ex: j***@gmail.com)
    const maskedEmail = referee_email
      ? referee_email.replace(/^(.).+(@.+)$/, '$1***$2')
      : 'Un nouvel ami';

    // Envoie la notification via Expo Push API
    const expoRes = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        to: pushToken,
        title: '🎉 Nouveau filleul !',
        body: `${maskedEmail} vient de s'inscrire avec ton code. Tu gagnes 5 crédits IA !`,
        data: { screen: 'referral' },
        sound: 'default',
        channelId: 'birthdays',
      }),
    });

    const result = await expoRes.json();
    console.log('Expo push result:', JSON.stringify(result));

    return new Response(JSON.stringify({ sent: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('notify-referral error:', err);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
