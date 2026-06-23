import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OCCASION_SUBJECT: Record<string, string> = {
  newyear:    '🎆 Bonne année !',
  christmas:  '🎄 Joyeux Noël !',
  easter:     '🐣 Joyeuses Pâques !',
  greetings:  '👋 Coucou !',
  valentines: '💝 Joyeuse Saint-Valentin !',
  mothersday: '👩 Joyeuse fête des mères !',
  fathersday: '👨 Joyeuse fête des pères !',
  halloween:  '🎃 Joyeux Halloween !',
};

/** Extrait le prénom d'un nom stocké au format "NOM Prénom" */
function extractFirstName(name: string): string {
  return name.split(' ').slice(1).join(' ') || name.split(' ')[0];
}

/** Remplace {prenom} par le prénom du contact */
function renderContent(content: string, contactName: string): string {
  return content.replace(/\{prenom\}/gi, extractFirstName(contactName));
}

async function sendSms(to: string, body: string): Promise<boolean> {
  const sid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const token = Deno.env.get('TWILIO_AUTH_TOKEN');
  const from = Deno.env.get('TWILIO_PHONE_NUMBER');
  if (!sid || !token || !from) {
    console.warn('[send-broadcast] Twilio non configuré — SMS simulé');
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
    console.warn('[send-broadcast] Resend non configuré — email simulé');
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
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const { contact_ids, content, occasion, channel } = await req.json() as {
      contact_ids: string[];
      content: string;
      occasion: string;
      channel: 'sms' | 'email';
    };

    if (!contact_ids?.length || !content?.trim() || !channel) {
      return new Response(JSON.stringify({ error: 'Paramètres manquants' }), {
        status: 400, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const { data: contacts } = await supabase
      .from('contacts')
      .select('id, name, phone, email, relation')
      .eq('user_id', user.id)
      .in('id', contact_ids);

    if (!contacts?.length) {
      return new Response(JSON.stringify({ error: 'Contacts introuvables' }), {
        status: 404, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const subject = OCCASION_SUBJECT[occasion] ?? '🎉 Pour toi !';
    let sentCount = 0;
    let skippedCount = 0;

    for (const contact of contacts) {
      const personalized = renderContent(content, contact.name);
      let sent = false;

      if (channel === 'sms' && contact.phone) {
        sent = await sendSms(contact.phone, personalized);
      } else if (channel === 'email' && contact.email) {
        sent = await sendEmail(contact.email, subject, personalized);
      } else {
        skippedCount++;
        continue;
      }

      if (!sent) { skippedCount++; continue; }

      sentCount++;

      await supabase.from('messages').insert({
        user_id: user.id,
        contact_id: contact.id,
        contact_name: contact.name,
        format: 'message',
        tone: 'festif',
        content: personalized,
        relation: contact.relation ?? 'friend',
        status: 'sent',
        sent_via: channel,
        sent_at: new Date().toISOString(),
      });
    }

    return new Response(
      JSON.stringify({ sent: sentCount, skipped: skippedCount, total: contacts.length }),
      { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } },
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('[send-broadcast] Error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }
});
