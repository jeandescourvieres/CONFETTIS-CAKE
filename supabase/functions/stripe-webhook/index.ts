import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = { 'Access-Control-Allow-Origin': '*' };

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  const expoAccessToken = Deno.env.get('EXPO_ACCESS_TOKEN') ?? '';

  try {
    // ── Vérification signature Stripe (optionnel si webhook secret configuré) ──
    const body = await req.text();
    let event: Record<string, unknown>;

    try {
      event = JSON.parse(body);
    } catch {
      return new Response('Invalid JSON', { status: 400 });
    }

    if (event.type !== 'payment_intent.succeeded') {
      return new Response(JSON.stringify({ received: true }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }

    const intent = event.data as Record<string, unknown>;
    const intentObj = intent.object as Record<string, unknown>;
    const metadata = intentObj.metadata as Record<string, string>;
    const potId = metadata?.pot_id;
    const contributorName = metadata?.contributor_name;
    const contributorEmail = metadata?.contributor_email;
    const intentId = intentObj.id as string;
    const amountReceived = (intentObj.amount_received as number) / 100;

    if (!potId || !intentId) {
      return new Response('Missing metadata', { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ── Marquer la contribution comme payée ───────────────────────────────────
    const { error: updateErr } = await (supabase.from('contributions') as any)
      .update({ paid_at: new Date().toISOString() })
      .eq('stripe_payment_intent', intentId);

    if (updateErr) throw updateErr;

    // ── Récupérer la cagnotte + créateur ─────────────────────────────────────
    const { data: pot } = await supabase
      .from('pots')
      .select('*, creator:profiles!creator_id(push_token, full_name)')
      .eq('id', potId)
      .single();

    if (!pot) {
      return new Response('Pot not found', { status: 404 });
    }

    // ── Marquer complétée si objectif atteint ──────────────────────────────────
    if (pot.current_amount >= pot.target_amount && pot.status === 'open') {
      await (supabase.from('pots') as any)
        .update({ status: 'completed' })
        .eq('id', potId);
    }

    // ── Notifications push via Expo ───────────────────────────────────────────
    // 1. Notifier l'organisateur
    const creatorToken = (pot.creator as Record<string, string> | null)?.push_token;
    const pushTokens: string[] = [];

    if (creatorToken?.startsWith('ExponentPushToken')) {
      pushTokens.push(creatorToken);
    }

    // 2. Notifier les watchers (participants app)
    const { data: watchers } = await supabase
      .from('pot_watchers')
      .select('profiles!user_id(push_token)')
      .eq('pot_id', potId);

    for (const watcher of watchers ?? []) {
      const token = (watcher.profiles as Record<string, string> | null)?.push_token;
      if (token?.startsWith('ExponentPushToken') && token !== creatorToken) {
        pushTokens.push(token);
      }
    }

    if (pushTokens.length > 0) {
      const notifications = pushTokens.map((to) => ({
        to,
        title: `🎉 Nouvelle contribution — ${pot.title}`,
        body: `${contributorName} a contribué ${amountReceived.toFixed(2)} € !`,
        data: { pot_id: potId },
        sound: 'default',
      }));

      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(expoAccessToken ? { Authorization: `Bearer ${expoAccessToken}` } : {}),
        },
        body: JSON.stringify(notifications),
      });
    }

    // ── Notifier par email les autres contributeurs (via Resend) ─────────────
    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (resendKey && contributorEmail) {
      const { data: allContribs } = await supabase
        .from('contributions')
        .select('contributor_email, contributor_name')
        .eq('pot_id', potId)
        .not('paid_at', 'is', null);

      const uniqueEmails = new Set(
        (allContribs ?? [])
          .map((c: Record<string, string>) => c.contributor_email)
          .filter((e: string) => e && e !== contributorEmail),
      );

      for (const email of uniqueEmails) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Confettis & Cake <noreply@confettis-cake.app>',
            to: [email],
            subject: `🎉 ${contributorName} a contribué à la cagnotte « ${pot.title} »`,
            html: `<p><strong>${contributorName}</strong> a contribué à la cagnotte <strong>${pot.title}</strong>.</p>
                   <p>Progression : ${pot.current_amount + amountReceived}€ / ${pot.target_amount}€</p>`,
          }),
        });
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
});
