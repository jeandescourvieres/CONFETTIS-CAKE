// ══════════════════════════════════════════════════════════════
//  send-postcard — Commande carte postale physique via Gelato
// ══════════════════════════════════════════════════════════════

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PostcardRequest {
  contact_id?: string | null;
  message: string;
  sender_name: string;
  recipient_name: string;
  recipient_line1: string;
  recipient_line2?: string | null;
  recipient_city: string;
  recipient_zip: string;
  recipient_country?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const gelatoApiKey = Deno.env.get('GELATO_API_KEY');
    const supabaseUrl    = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const authHeader     = req.headers.get('Authorization');

    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Identifier l'utilisateur
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData.user) {
      return new Response(JSON.stringify({ error: 'Utilisateur non trouvé' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = authData.user.id;

    const body: PostcardRequest = await req.json();

    // Validation
    if (!body.message?.trim() || !body.recipient_name?.trim() || !body.recipient_line1?.trim()
        || !body.recipient_city?.trim() || !body.recipient_zip?.trim()) {
      return new Response(JSON.stringify({ error: 'Champs obligatoires manquants' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1. Créer l'entrée DB (status pending)
    const { data: postcard, error: insertErr } = await supabase
      .from('postcards')
      .insert({
        user_id:          userId,
        contact_id:       body.contact_id ?? null,
        message:          body.message.trim(),
        sender_name:      body.sender_name?.trim() ?? '',
        recipient_name:   body.recipient_name.trim(),
        recipient_line1:  body.recipient_line1.trim(),
        recipient_line2:  body.recipient_line2?.trim() ?? null,
        recipient_city:   body.recipient_city.trim(),
        recipient_zip:    body.recipient_zip.trim(),
        recipient_country: body.recipient_country ?? 'FR',
        status:           'pending',
        price_cents:      349,
      })
      .select()
      .single();

    if (insertErr || !postcard) {
      console.error('DB insert error:', insertErr);
      return new Response(JSON.stringify({ error: 'Erreur lors de la création de la commande' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Appel Gelato API (si la clé est configurée)
    let gelatoOrderId: string | null = null;

    if (gelatoApiKey) {
      try {
        // Template Gelato : carte postale A6 recto/verso
        // Recto : template Confettis & Cake (fond coloré + logo)
        // Verso : message manuscrit + adresse destinataire
        const gelatoPayload = {
          orderReferenceId: postcard.id,
          customerReferenceId: userId,
          currency: 'EUR',
          items: [
            {
              itemReferenceId: `item_${postcard.id}`,
              productUid: 'postcard_a6_4_4_pt_170_gsm_art_silk_postcard',
              quantity: 1,
              files: [
                {
                  type: 'default',
                  url: `${supabaseUrl}/functions/v1/postcard-template?id=${postcard.id}`,
                },
              ],
              recipientName:    body.recipient_name.trim(),
              recipientAddress: body.recipient_line1.trim(),
              recipientAddress2: body.recipient_line2?.trim() ?? '',
              recipientCity:    body.recipient_city.trim(),
              recipientState:   '',
              recipientZip:     body.recipient_zip.trim(),
              recipientCountry: body.recipient_country ?? 'FR',
              recipientEmail:   '',
              recipientPhone:   '',
            },
          ],
        };

        const gelatoRes = await fetch('https://order.gelatoapis.com/v4/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': gelatoApiKey,
          },
          body: JSON.stringify(gelatoPayload),
        });

        if (gelatoRes.ok) {
          const gelatoData = await gelatoRes.json();
          gelatoOrderId = gelatoData.id ?? gelatoData.orderId ?? null;
        } else {
          const errText = await gelatoRes.text();
          console.error('Gelato error:', gelatoRes.status, errText);
        }
      } catch (gelatoErr) {
        console.error('Gelato fetch error:', gelatoErr);
      }
    }

    // 3. Mettre à jour le statut
    const newStatus = gelatoOrderId ? 'processing' : (gelatoApiKey ? 'failed' : 'processing');
    await supabase
      .from('postcards')
      .update({
        gelato_order_id: gelatoOrderId,
        status: newStatus,
      })
      .eq('id', postcard.id);

    return new Response(
      JSON.stringify({
        id: postcard.id,
        status: newStatus,
        gelato_order_id: gelatoOrderId,
        price_cents: 349,
        // En dev sans clé Gelato, on simule une commande validée
        simulated: !gelatoApiKey,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
