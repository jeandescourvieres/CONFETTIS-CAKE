import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Retourne "MM-DD" pour demain */
function tomorrowMmdd(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${m}-${day}`;
}

/** Extrait "MM-DD" d'une date "YYYY-MM-DD" ou "0000-MM-DD" */
function toMmdd(date: string): string {
  const parts = date.split('-');
  return `${parts[1]}-${parts[2]}`;
}

/** Envoie une notification push via Expo */
async function sendPush(
  token: string,
  title: string,
  body: string,
  data: Record<string, unknown>,
) {
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ to: token, title, body, sound: 'default', channelId: 'birthdays', data }),
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  try {
    const tomorrow = tomorrowMmdd();
    console.log(`[notify-auto-sends-preview] Checking for ${tomorrow}`);

    // ── Récupère tous les envois actifs avec contacts
    const { data: sends, error } = await supabase
      .from('scheduled_sends')
      .select(`
        id,
        user_id,
        trigger_event,
        channel,
        contact:contacts ( id, name, birthday, name_day )
      `)
      .eq('is_active', true);

    if (error) throw error;
    if (!sends || sends.length === 0) {
      return new Response(JSON.stringify({ notified: 0, message: 'Aucun envoi actif' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── Filtre ceux dont c'est demain le jour J
    const toNotify = (sends as any[]).filter((s) => {
      const contact = s.contact;
      if (!contact) return false;
      if (s.trigger_event === 'birthday' && contact.birthday) {
        return toMmdd(contact.birthday) === tomorrow;
      }
      if (s.trigger_event === 'nameday' && contact.name_day) {
        return toMmdd(contact.name_day) === tomorrow;
      }
      return false;
    });

    console.log(`[notify-auto-sends-preview] ${toNotify.length} envoi(s) prévu(s) demain`);

    // ── Groupe par user_id pour récupérer les push tokens en une seule requête
    const userIds = [...new Set(toNotify.map((s: any) => s.user_id as string))];

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, push_token')
      .in('id', userIds);

    const tokenByUser: Record<string, string> = {};
    for (const p of (profiles ?? []) as any[]) {
      if (p.push_token) tokenByUser[p.id] = p.push_token;
    }

    let notifiedCount = 0;

    for (const send of toNotify) {
      const pushToken = tokenByUser[send.user_id];
      if (!pushToken) continue;

      const contact = send.contact;
      const contactFirstName = contact.name.split(' ').slice(1).join(' ') || contact.name.split(' ')[0];
      const isNameday = send.trigger_event === 'nameday';
      const channelLabel = send.channel === 'sms' ? 'SMS' : 'email';
      const occasionLabel = isNameday ? 'fête' : 'anniversaire';
      const emoji = isNameday ? '🌸' : '🎂';

      await sendPush(
        pushToken,
        `${emoji} Envoi demain pour ${contactFirstName}`,
        `Un ${channelLabel} d'${occasionLabel} partira automatiquement demain. Appuie pour annuler si besoin.`,
        {
          type: 'auto_send_preview',
          sendId: send.id,
          contactId: contact.id,
          screen: 'auto-sends',
        },
      );

      notifiedCount++;
      console.log(`[notify-auto-sends-preview] Notifié user ${send.user_id} pour ${contact.name}`);
    }

    console.log(`[notify-auto-sends-preview] Done — ${notifiedCount} notification(s) envoyée(s)`);

    return new Response(
      JSON.stringify({ notified: notifiedCount, total: toNotify.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('[notify-auto-sends-preview] Error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
