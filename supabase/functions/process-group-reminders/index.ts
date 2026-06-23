import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const MONTHS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

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

/** Soustrait N jours à une date "MM-DD" (gère le passage d'année) */
function mmddMinusDays(mmdd: string, days: number): string {
  const [m, d] = mmdd.split('-').map(Number);
  const date = new Date(2001, m - 1, d); // année non-bissextile arbitraire
  date.setDate(date.getDate() - days);
  return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** Formate "MM-DD" en "15 juin" */
function formatMmdd(mmdd: string): string {
  const [m, d] = mmdd.split('-').map(Number);
  return `${d} ${MONTHS_FR[m - 1]}`;
}

/** Extrait le prénom d'un nom stocké au format "NOM Prénom" */
function extractFirstName(name: string): string {
  return name.split(' ').slice(1).join(' ') || name.split(' ')[0];
}

/** Remplace {prenom} par le prénom du contact concerné */
function renderTemplate(content: string, contactName: string): string {
  return content.replace(/\{prenom\}/gi, extractFirstName(contactName));
}

async function sendPush(token: string, title: string, body: string, data: Record<string, unknown>) {
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ to: token, title, body, sound: 'default', channelId: 'birthdays', data }),
  });
}

async function sendSms(to: string, body: string): Promise<boolean> {
  const sid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const token = Deno.env.get('TWILIO_AUTH_TOKEN');
  const from = Deno.env.get('TWILIO_PHONE_NUMBER');
  if (!sid || !token || !from) {
    console.warn('[group-reminders] Twilio non configuré — SMS simulé');
    return true;
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

async function sendEmail(to: string, subject: string, text: string): Promise<boolean> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    console.warn('[group-reminders] Resend non configuré — email simulé');
    return true;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'Confettis & Cake <onboarding@resend.dev>', to: [to], subject, text }),
  });
  return res.ok;
}

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
    const today = todayMmdd();
    console.log(`[process-group-reminders] Running for ${today}`);

    const { data: reminders, error } = await supabase
      .from('group_reminders')
      .select(`
        id, user_id, trigger_event, days_before, content, channel, recipient_contact_ids,
        contact:contacts ( id, name, birthday, name_day )
      `)
      .eq('is_active', true);

    if (error) throw error;
    if (!reminders || reminders.length === 0) {
      return new Response(JSON.stringify({ processed: 0, message: 'Aucun rappel actif' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── Filtre ceux dont la date de rappel (J - days_before) est aujourd'hui
    const toFire = (reminders as any[]).filter((r) => {
      const contact = r.contact;
      if (!contact) return false;
      const eventDate = r.trigger_event === 'birthday' ? contact.birthday : contact.name_day;
      if (!eventDate) return false;
      const eventMmdd = r.trigger_event === 'birthday' ? toMmdd(eventDate) : eventDate;
      return mmddMinusDays(eventMmdd, r.days_before) === today;
    });

    console.log(`[process-group-reminders] ${toFire.length} rappel(s) à traiter`);

    let successCount = 0;
    const processedIds: string[] = [];

    for (const reminder of toFire) {
      const contact = reminder.contact;
      if (!contact || !reminder.recipient_contact_ids?.length) continue;

      const eventDate = reminder.trigger_event === 'birthday' ? contact.birthday : contact.name_day;
      const eventMmdd = reminder.trigger_event === 'birthday' ? toMmdd(eventDate) : eventDate;
      const contactFirstName = extractFirstName(contact.name);
      const occasionWord = reminder.trigger_event === 'birthday' ? "l'anniversaire" : 'la fête';

      const message = reminder.content
        ? renderTemplate(reminder.content, contact.name)
        : `🎉 Rappel : c'est ${occasionWord} de ${contactFirstName} le ${formatMmdd(eventMmdd)} !`;

      const { data: recipients } = await supabase
        .from('contacts')
        .select('id, name, phone, email')
        .eq('user_id', reminder.user_id)
        .in('id', reminder.recipient_contact_ids);

      if (!recipients?.length) continue;

      let reminderSent = false;
      for (const recipient of recipients) {
        let sent = false;
        if (reminder.channel === 'sms' && recipient.phone) {
          sent = await sendSms(recipient.phone, message);
        } else if (reminder.channel === 'email' && recipient.email) {
          sent = await sendEmail(recipient.email, `🎉 Rappel : ${occasionWord} de ${contactFirstName}`, message);
        } else {
          continue;
        }
        if (sent) reminderSent = true;
      }

      if (!reminderSent) continue;

      processedIds.push(reminder.id);
      successCount++;

      // ── Notification push à l'organisateur
      const { data: profile } = await supabase
        .from('profiles')
        .select('push_token')
        .eq('id', reminder.user_id)
        .single();

      const pushToken = (profile as any)?.push_token;
      if (pushToken) {
        await sendPush(
          pushToken,
          `🔔 Rappel collectif envoyé !`,
          `Tes proches ont été prévenus pour ${occasionWord} de ${contactFirstName} (le ${formatMmdd(eventMmdd)}). 💜`,
          { type: 'group_reminder', contactId: contact.id, screen: 'group-reminders' },
        );
      }
    }

    if (processedIds.length > 0) {
      await supabase
        .from('group_reminders')
        .update({ last_sent_at: new Date().toISOString() })
        .in('id', processedIds);
    }

    console.log(`[process-group-reminders] Done — ${successCount}/${toFire.length} rappel(s) envoyé(s)`);

    return new Response(
      JSON.stringify({ processed: successCount, total: toFire.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('[process-group-reminders] Error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
