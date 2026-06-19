// ══════════════════════════════════════════════════════════════
//  handle-reaction — Enregistre une réaction + notifie l'auteur
// ══════════════════════════════════════════════════════════════

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const VALID_EMOJIS = ['❤️', '😂', '😍', '🙏', '😭', '🎉'];

function displayName(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts.filter((p) => !(p === p.toUpperCase() && /[A-Z]/.test(p)));
  return first.join(' ') || parts[0] || name;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl    = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

  // ── GET : métadonnées du message (bg_theme, destinataire) ──────────────────
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const id  = url.searchParams.get('id') ?? '';
    if (!id) {
      return new Response(JSON.stringify({ error: 'id manquant' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const sb = createClient(supabaseUrl, serviceRoleKey);
    const { data: msg } = await (sb.from('messages') as any)
      .select('contact_name, bg_theme')
      .eq('id', id)
      .single();
    if (!msg) {
      return new Response(JSON.stringify({ error: 'not_found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({
      bg_theme:  msg.bg_theme  ?? 'none',
      recipient: displayName(msg.contact_name ?? ''),
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  try {

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();
    const { message_id, emoji, note } = body;

    // Validation
    if (!message_id || !emoji) {
      return new Response(JSON.stringify({ error: 'message_id et emoji requis' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!VALID_EMOJIS.includes(emoji)) {
      return new Response(JSON.stringify({ error: 'Emoji invalide' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Vérifier que le message existe + récupérer l'auteur
    const { data: message, error: msgErr } = await supabase
      .from('messages')
      .select('id, user_id, content, contact_id, contacts(name)')
      .eq('id', message_id)
      .single();

    if (msgErr || !message) {
      return new Response(JSON.stringify({ error: 'Message introuvable' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Enregistrer la réaction
    const { data: reaction, error: insertErr } = await supabase
      .from('message_reactions')
      .insert({
        message_id,
        emoji,
        note: note?.trim()?.slice(0, 200) || null,
      })
      .select()
      .single();

    if (insertErr) {
      console.error('Insert reaction error:', insertErr);
      return new Response(JSON.stringify({ error: 'Erreur enregistrement' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Envoyer une notification push à l'auteur du message
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('push_token, full_name')
        .eq('id', message.user_id)
        .single();

      if (profile?.push_token) {
        const contactName = (message as { contacts?: { name?: string } }).contacts?.name ?? 'quelqu\'un';
        const notePreview = note?.trim() ? ` "${note.trim().slice(0, 40)}"` : '';

        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            to:    profile.push_token,
            title: `${emoji} Réaction reçue !`,
            body:  `Ton message pour ${contactName} a reçu une réaction${notePreview}`,
            data:  { type: 'reaction', message_id, reaction_id: reaction.id },
          }),
        });
      }
    } catch (notifErr) {
      // Non-bloquant
      console.error('Push notification error:', notifErr);
    }

    return new Response(
      JSON.stringify({ id: reaction.id, emoji, created_at: reaction.created_at }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
