import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL  = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const STRIPE_KEY    = Deno.env.get('STRIPE_SECRET_KEY')!;
const PAGE_BASE     = `${SUPABASE_URL}/functions/v1/pot-page`;

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Méthode non autorisée', { status: 405 });
  }

  const form = await req.formData();
  const token  = form.get('token')?.toString() ?? '';
  const name   = form.get('name')?.toString().trim() ?? '';
  const email  = form.get('email')?.toString().trim().toLowerCase() ?? '';
  const amount = parseFloat(form.get('amount')?.toString() ?? '0');

  if (!token || !name || !email || amount < 1) {
    return new Response('Paramètres invalides', { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const { data: pot } = await supabase
    .from('pots')
    .select('id, title, contact:contacts(name)')
    .eq('share_token', token)
    .single();

  if (!pot) return new Response('Cagnotte introuvable', { status: 404 });

  const amountCents = Math.round(amount * 100);
  const contactName = (pot.contact as { name?: string } | null)?.name ?? '';
  const description = `Cagnotte "${pot.title}" pour ${contactName} — ${name}`;

  // Créer la Stripe Checkout Session
  const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRIPE_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'mode':                        'payment',
      'customer_email':              email,
      'line_items[0][price_data][currency]':              'eur',
      'line_items[0][price_data][unit_amount]':           String(amountCents),
      'line_items[0][price_data][product_data][name]':    description,
      'line_items[0][quantity]':     '1',
      'payment_intent_data[metadata][pot_id]':           pot.id,
      'payment_intent_data[metadata][contributor_name]': name,
      'payment_intent_data[metadata][contributor_email]':email,
      'success_url': `${PAGE_BASE}?token=${token}&success=1`,
      'cancel_url':  `${PAGE_BASE}?token=${token}`,
    }),
  });

  const session = await stripeRes.json() as { url?: string; error?: { message: string } };
  if (!session.url) {
    return new Response(`Erreur Stripe : ${session.error?.message ?? 'inconnue'}`, { status: 500 });
  }

  // Créer la contribution en attente dans la DB
  await supabase.from('contributions').insert({
    pot_id:             pot.id,
    contributor_name:   name,
    contributor_email:  email,
    amount:             amount,
  }).throwOnError().catch(() => {/* non-bloquant */});

  // Rediriger vers Stripe Checkout
  return new Response(null, {
    status: 303,
    headers: { 'Location': session.url },
  });
});
