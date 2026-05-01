// ══════════════════════════════════════════════════════════════
//  guestbook-contribute — Contribution anonyme au livre d'or
// ══════════════════════════════════════════════════════════════

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
    const supabaseUrl    = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { token, contributor_name, message } = await req.json();

    if (!token || !contributor_name?.trim() || !message?.trim()) {
      return new Response(
        JSON.stringify({ error: 'token, contributor_name et message sont requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Récupérer le livre d'or via token
    const { data: book, error: bookErr } = await supabase
      .from('guestbooks')
      .select('id, is_open, title')
      .eq('token', token)
      .single();

    if (bookErr || !book) {
      return new Response(
        JSON.stringify({ error: 'Livre d\'or introuvable' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!book.is_open) {
      return new Response(
        JSON.stringify({ error: 'Ce livre d\'or est fermé aux nouvelles contributions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insérer la contribution
    const { data: entry, error: insertErr } = await supabase
      .from('guestbook_entries')
      .insert({
        guestbook_id: book.id,
        contributor_name: contributor_name.trim().slice(0, 100),
        message: message.trim().slice(0, 1000),
      })
      .select()
      .single();

    if (insertErr) throw insertErr;

    return new Response(
      JSON.stringify({ success: true, entry }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('guestbook-contribute error:', err);
    return new Response(
      JSON.stringify({ error: 'Erreur interne' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
