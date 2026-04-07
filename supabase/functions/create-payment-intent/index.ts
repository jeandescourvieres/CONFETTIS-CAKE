import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!stripeKey) {
      return new Response(JSON.stringify({ error: 'STRIPE_SECRET_KEY manquante' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { pot_id, contributor_name, contributor_email, amount_cents } = await req.json();

    if (!pot_id || !contributor_name || !contributor_email || !amount_cents) {
      return new Response(JSON.stringify({ error: 'Paramètres manquants' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (amount_cents < 100) {
      return new Response(JSON.stringify({ error: 'Montant minimum : 1 €' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Créer le PaymentIntent Stripe
    const stripeBody = new URLSearchParams({
      amount: String(amount_cents),
      currency: 'eur',
      'metadata[pot_id]': pot_id,
      'metadata[contributor_name]': contributor_name,
      'metadata[contributor_email]': contributor_email,
      'payment_method_types[]': 'card',
    });

    const stripeResp = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: stripeBody.toString(),
    });

    if (!stripeResp.ok) {
      const err = await stripeResp.json();
      return new Response(JSON.stringify({ error: err.error?.message ?? 'Erreur Stripe' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const intent = await stripeResp.json();

    // Pré-créer la contribution en DB (sera confirmée par le webhook)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: contribution, error: dbError } = await (supabase.from('contributions') as any)
      .insert({
        pot_id,
        contributor_name,
        contributor_email,
        amount: amount_cents / 100,
        stripe_payment_intent: intent.id,
      })
      .select('id')
      .single();

    if (dbError) throw dbError;

    return new Response(
      JSON.stringify({ client_secret: intent.client_secret, contribution_id: contribution.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
