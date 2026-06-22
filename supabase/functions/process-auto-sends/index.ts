import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Retourne "MM-DD" pour aujourd'hui */
function todayMmdd(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${m}-${day}`;
}

/** Extrait "MM-DD" d'une date "YYYY-MM-DD" ou "0000-MM-DD" */
function toMmdd(date: string): string {
  const parts = date.split('-');
  return `${parts[1]}-${parts[2]}`;
}

/** Extrait le prénom d'un nom stocké au format "NOM Prénom" */
function extractFirstName(name: string): string {
  return name.split(' ').slice(1).join(' ') || name.split(' ')[0];
}

/** Reformate "NOM Prénom" en "Prénom NOM" pour l'affichage */
function toDisplayName(name: string): string {
  const parts = name.split(' ');
  return parts.length > 1 ? `${parts.slice(1).join(' ')} ${parts[0]}` : name;
}

/** Remplace {prenom} par le prénom du contact */
function renderTemplate(content: string, contactName: string): string {
  return content.replace(/\{prenom\}/gi, extractFirstName(contactName));
}

/** Envoie une notification push via Expo */
async function sendPush(token: string, title: string, body: string, data: Record<string, unknown>) {
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ to: token, title, body, sound: 'default', channelId: 'birthdays', data }),
  });
}

/** Envoie un SMS via Twilio */
async function sendSms(to: string, body: string): Promise<boolean> {
  const sid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const token = Deno.env.get('TWILIO_AUTH_TOKEN');
  const from = Deno.env.get('TWILIO_PHONE_NUMBER');
  if (!sid || !token || !from) {
    console.warn('[auto-sends] Twilio non configuré — SMS simulé');
    return true; // mode simulation
  }
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${sid}:${token}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
  });
  return res.ok;
}

/** Envoie un email via Resend */
async function sendEmail(to: string, subject: string, text: string): Promise<boolean> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    console.warn('[auto-sends] Resend non configuré — email simulé');
    return true; // mode simulation
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Confettis & Cake <onboarding@resend.dev>',
      to: [to],
      subject,
      text,
    }),
  });
  return res.ok;
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
    const today = todayMmdd(); // ex: "04-20"
    console.log(`[process-auto-sends] Running for ${today}`);

    // ── Récupère tous les envois actifs avec leurs contacts et templates
    const { data: sends, error } = await supabase
      .from('scheduled_sends')
      .select(`
        id,
        user_id,
        trigger_event,
        channel,
        contact:contacts ( id, name, phone, email, birthday, name_day ),
        template:message_templates ( title, content )
      `)
      .eq('is_active', true);

    if (error) throw error;
    if (!sends || sends.length === 0) {
      return new Response(JSON.stringify({ processed: 0, message: 'Aucun envoi actif' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── Filtre ceux dont c'est le jour J
    const toSend = (sends as any[]).filter((s) => {
      const contact = s.contact;
      if (!contact) return false;
      if (s.trigger_event === 'birthday' && contact.birthday) {
        return toMmdd(contact.birthday) === today;
      }
      if (s.trigger_event === 'nameday' && contact.name_day) {
        return toMmdd(contact.name_day) === today;
      }
      return false;
    });

    console.log(`[process-auto-sends] ${toSend.length} envoi(s) à traiter`);

    let successCount = 0;
    const processedIds: string[] = [];

    for (const send of toSend) {
      const contact = send.contact;
      const template = send.template;
      if (!contact || !template) continue;

      const message = renderTemplate(template.content, contact.name);
      const contactFirstName = extractFirstName(contact.name);
      let sent = false;

      // ── Envoi SMS ou Email
      if (send.channel === 'sms' && contact.phone) {
        sent = await sendSms(contact.phone, message);
      } else if (send.channel === 'email' && contact.email) {
        const isNameday = send.trigger_event === 'nameday';
        const subject = isNameday
          ? `🌸 Bonne fête ${contactFirstName} !`
          : `🎉 Joyeux anniversaire ${contactFirstName} !`;
        sent = await sendEmail(contact.email, subject, message);
      } else {
        // Pas de coordonnées — on notifie quand même l'utilisateur
        sent = true;
        console.warn(`[auto-sends] Pas de ${send.channel} pour ${contact.name}`);
      }

      if (!sent) {
        console.error(`[auto-sends] Échec envoi pour ${contact.name}`);
        continue;
      }

      processedIds.push(send.id);
      successCount++;

      // ── Notification push à l'utilisateur
      const { data: profile } = await supabase
        .from('profiles')
        .select('push_token')
        .eq('id', send.user_id)
        .single();

      const pushToken = (profile as any)?.push_token;
      if (pushToken) {
        const isNameday = send.trigger_event === 'nameday';
        const emoji = isNameday ? '🌸' : '🎉';
        const occasion = isNameday ? 'fête' : 'anniversaire';
        const channelLabel = send.channel === 'sms' ? 'SMS' : 'email';

        await sendPush(
          pushToken,
          `${emoji} Message envoyé à ${contactFirstName} !`,
          `Ton message d'${occasion} a bien été envoyé par ${channelLabel} à ${toDisplayName(contact.name)}. 💜`,
          { type: 'auto_send', contactId: contact.id, screen: 'auto-sends' },
        );
      }
    }

    // ── Met à jour last_sent_at pour tous les envois réussis
    if (processedIds.length > 0) {
      await supabase
        .from('scheduled_sends')
        .update({ last_sent_at: new Date().toISOString() })
        .in('id', processedIds);
    }

    console.log(`[process-auto-sends] Done — ${successCount}/${toSend.length} envoi(s) réussi(s)`);

    return new Response(
      JSON.stringify({ processed: successCount, total: toSend.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('[process-auto-sends] Error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
