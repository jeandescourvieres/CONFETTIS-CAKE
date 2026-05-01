import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ── Push Expo ────────────────────────────────────────────────────────────────

async function sendPush(
  token: string,
  title: string,
  body: string,
  data: Record<string, unknown> = {},
): Promise<void> {
  if (!token.startsWith('ExponentPushToken[')) return;
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: token, title, body, data, sound: 'default' }),
  });
}

// ── Correspondance date → rappel ──────────────────────────────────────────────

function matchesToday(reminder: Record<string, unknown>): boolean {
  const now = new Date();
  const dow   = now.getDay();               // 0=Sun
  const dom   = now.getDate();              // 1-31
  const month = now.getMonth() + 1;        // 1-12
  const dateStr = now.toISOString().split('T')[0];

  switch (reminder.recurrence) {
    case 'weekly':  return reminder.day_of_week  === dow;
    case 'monthly': return reminder.day_of_month === dom;
    case 'yearly':  return reminder.day_of_month === dom && reminder.month === month;
    case 'once':    return reminder.once_date === dateStr;
    default:        return false;
  }
}

// ── Labels ────────────────────────────────────────────────────────────────────

const DOW_FR = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const MONTH_FR = ['', 'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
                  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

function recurrenceLabel(r: Record<string, unknown>): string {
  switch (r.recurrence) {
    case 'weekly':  return `Chaque ${DOW_FR[r.day_of_week as number] ?? ''}`;
    case 'monthly': return `Le ${r.day_of_month} de chaque mois`;
    case 'yearly':  return `Chaque ${r.day_of_month} ${MONTH_FR[r.month as number] ?? ''}`;
    case 'once':    return `Le ${r.once_date}`;
    default:        return '';
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  try {
    // Récupère tous les rappels actifs + push token du profil
    const { data: reminders, error } = await supabase
      .from('reminders')
      .select('*, profiles!inner(id, push_token)')
      .eq('is_active', true);

    if (error) throw error;
    if (!reminders || reminders.length === 0) {
      return new Response(JSON.stringify({ fired: 0 }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let firedCount = 0;
    const toDeactivate: string[] = [];

    for (const reminder of reminders as any[]) {
      if (!matchesToday(reminder)) continue;

      const pushToken = reminder.profiles?.push_token;
      if (pushToken) {
        const label = recurrenceLabel(reminder);
        await sendPush(
          pushToken,
          `⏰ ${reminder.title}`,
          label,
          { type: 'reminder', reminderId: reminder.id, screen: 'reminders' },
        );
        firedCount++;
        console.log(`[process-reminders] Notifié user ${reminder.user_id} — "${reminder.title}"`);
      }

      // Les rappels "une fois" sont désactivés après déclenchement
      if (reminder.recurrence === 'once') {
        toDeactivate.push(reminder.id);
      }
    }

    if (toDeactivate.length > 0) {
      await supabase
        .from('reminders')
        .update({ is_active: false })
        .in('id', toDeactivate);
    }

    console.log(`[process-reminders] Done — ${firedCount} rappel(s) envoyé(s)`);
    return new Response(
      JSON.stringify({ fired: firedCount, checked: reminders.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('[process-reminders] Error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
