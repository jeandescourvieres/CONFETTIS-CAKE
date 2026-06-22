import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ── Helpers date ──────────────────────────────────────────────────────────────

/** Retourne "MM-DD" pour une date donnée */
function mmdd(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${m}-${d}`;
}

/** Retourne "MM-DD" pour aujourd'hui + N jours */
function mmddIn(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return mmdd(d);
}

// ── Messages de notification ───────────────────────────────────────────────────

function birthdayNotif(name: string, days: number): { title: string; body: string } {
  const first = name.split(' ').slice(1).join(' ') || name.split(' ')[0];
  if (days === 0) return {
    title: `🎉 C'est l'anniversaire de ${first} aujourd'hui !`,
    body: `Envoyez-lui un message ou une chanson pour lui faire plaisir 🎂`,
  };
  if (days === 1) return {
    title: `🎂 Demain, c'est l'anniversaire de ${first} !`,
    body: `Préparez un message maintenant pour ne pas l'oublier 🎁`,
  };
  if (days === 3) return {
    title: `🎂 Dans 3 jours — anniversaire de ${first}`,
    body: `Il est encore temps de créer quelque chose de beau ✨`,
  };
  return {
    title: `🎂 Dans ${days} jours — anniversaire de ${first}`,
    body: `Pensez à préparer un message pour ${first} 🎉`,
  };
}

function nameDayNotif(name: string, days: number): { title: string; body: string } {
  const first = name.split(' ').slice(1).join(' ') || name.split(' ')[0];
  if (days === 0) return {
    title: `🌸 Bonne fête à ${first} aujourd'hui !`,
    body: `Envoyez-lui un petit message pour marquer l'occasion 💜`,
  };
  if (days === 1) return {
    title: `🌸 Demain, c'est la fête de ${first} !`,
    body: `Un message de votre part ferait toujours plaisir 😊`,
  };
  if (days === 3) return {
    title: `🌸 Dans 3 jours — fête de ${first}`,
    body: `Préparez un petit mot pour ${first} 🌸`,
  };
  return {
    title: `🌸 Dans ${days} jours — fête de ${first}`,
    body: `Pensez à ${first} pour sa fête 🌸`,
  };
}

// ── Envoi Expo Push ────────────────────────────────────────────────────────────

interface PushMessage {
  to: string;
  title: string;
  body: string;
  sound: string;
  data: Record<string, unknown>;
}

async function sendPushNotifications(messages: PushMessage[]): Promise<void> {
  if (messages.length === 0) return;

  // Expo accepte des lots de 100 max
  const chunks: PushMessage[][] = [];
  for (let i = 0; i < messages.length; i += 100) {
    chunks.push(messages.slice(i, i + 100));
  }

  for (const chunk of chunks) {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(chunk),
    });
  }
}

// ── Serve ─────────────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  try {
    // Dates cibles : aujourd'hui, +1, +3, +7
    const targetDays = [0, 1, 3, 7];
    const targets = targetDays.map((d) => mmddIn(d)); // ["04-08", "04-09", "04-11", "04-15"]

    console.log(`[birthday-reminders] Checking dates: ${targets.join(', ')}`);

    // Récupérer tous les contacts dont l'anniversaire ou la fête tombe dans les dates cibles
    // On joint avec le profil pour avoir le push_token
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select(`
        id,
        name,
        birthday,
        name_day,
        user_id,
        profiles!inner (
          push_token
        )
      `)
      .not('profiles.push_token', 'is', null);

    if (error) throw error;
    if (!contacts || contacts.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: 'Aucun contact avec push token' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const pushMessages: PushMessage[] = [];

    for (const contact of contacts as any[]) {
      const token: string | null = contact.profiles?.push_token ?? null;
      if (!token) continue;

      // ── Anniversaire ──
      if (contact.birthday) {
        // Extraire MM-DD (gère "YYYY-MM-DD" et "0000-MM-DD")
        const parts = contact.birthday.split('-');
        const birthdayMmdd = `${parts[1]}-${parts[2]}`;

        const daysIdx = targets.indexOf(birthdayMmdd);
        if (daysIdx !== -1) {
          const days = targetDays[daysIdx];
          const notif = birthdayNotif(contact.name, days);
          pushMessages.push({
            to: token,
            title: notif.title,
            body: notif.body,
            sound: 'default',
            data: { type: 'birthday', contactId: contact.id, days },
          });
        }
      }

      // ── Fête ──
      if (contact.name_day) {
        const daysIdx = targets.indexOf(contact.name_day);
        if (daysIdx !== -1) {
          const days = targetDays[daysIdx];
          const notif = nameDayNotif(contact.name, days);
          pushMessages.push({
            to: token,
            title: notif.title,
            body: notif.body,
            sound: 'default',
            data: { type: 'name_day', contactId: contact.id, days },
          });
        }
      }
    }

    console.log(`[birthday-reminders] Sending ${pushMessages.length} notification(s)`);
    await sendPushNotifications(pushMessages);

    return new Response(
      JSON.stringify({ sent: pushMessages.length, checked: contacts.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('[birthday-reminders] Error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
