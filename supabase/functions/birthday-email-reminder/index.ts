import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

// ── Helpers ───────────────────────────────────────────────────────────────────

function mmddIn(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${m}-${day}`;
}

function toMmdd(date: string): string {
  const parts = date.split('-');
  return `${parts[1]}-${parts[2]}`;
}

function htmlEmail(params: {
  userName: string;
  contactFirstName: string;
  days: number;
  eventType: 'birthday' | 'nameday';
  deepLink: string;
}): { subject: string; html: string } {
  const { userName, contactFirstName, days, eventType, deepLink } = params;
  const isBirthday = eventType === 'birthday';
  const emoji = isBirthday ? '🎁' : '🌸';
  const occasion = isBirthday ? 'anniversaire' : 'fête';
  const verb = isBirthday ? 'fête son anniversaire' : 'célèbre sa fête';

  const dayLabel =
    days === 0 ? "C'est aujourd'hui !" :
    days === 1 ? "c'est demain !" :
    `c'est dans ${days} jours !`;

  const subject = days === 0
    ? `${emoji} Aujourd'hui, c'est l'${occasion} de ${contactFirstName} !`
    : days === 1
    ? `${emoji} Demain, c'est l'${occasion} de ${contactFirstName} !`
    : `${emoji} Dans ${days} jours — ${occasion} de ${contactFirstName}`;

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f4f0f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0f8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(155,107,181,0.12);">

          <!-- Header violet -->
          <tr>
            <td style="background:linear-gradient(135deg,#9b6bb5,#c49ad4);padding:40px 32px;text-align:center;">
              <p style="margin:0;font-size:48px;line-height:1;">${emoji}</p>
              <h1 style="margin:12px 0 4px;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">
                ${contactFirstName} ${verb}
              </h1>
              <p style="margin:0;color:rgba(255,255,255,0.85);font-size:18px;font-weight:600;">
                ${dayLabel}
              </p>
            </td>
          </tr>

          <!-- Corps -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;color:#555;font-size:15px;">Bonjour ${userName},</p>
              <p style="margin:0 0 24px;color:#333;font-size:16px;line-height:1.6;">
                ${days === 0
                  ? `Aujourd'hui c'est le grand jour pour <strong>${contactFirstName}</strong> ! Il est encore temps de lui envoyer un message qui lui fera vraiment plaisir. ✨`
                  : days === 1
                  ? `Demain c'est l'${occasion} de <strong>${contactFirstName}</strong> ! Prépare ton message maintenant pour ne pas l'oublier. 🎉`
                  : `<strong>${contactFirstName}</strong> ${verb} dans <strong>${days} jours</strong>. C'est le moment idéal pour préparer un message unique et personnalisé. ✨`
                }
              </p>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 24px;">
                    <a href="${deepLink}"
                       style="display:inline-block;background:#9b6bb5;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:50px;letter-spacing:0.3px;">
                      ✨ Créer un message maintenant
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Rappel fonctionnalités -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f5ff;border-radius:12px;padding:20px;">
                <tr>
                  <td style="padding:0 20px;">
                    <p style="margin:0 0 12px;color:#9b6bb5;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
                      Ce que tu peux créer
                    </p>
                    <p style="margin:0 0 6px;color:#444;font-size:14px;">🎵 Une chanson IA personnalisée</p>
                    <p style="margin:0 0 6px;color:#444;font-size:14px;">✍️ Un poème sur mesure</p>
                    <p style="margin:0 0 6px;color:#444;font-size:14px;">💬 Un message chaleureux</p>
                    <p style="margin:0;color:#444;font-size:14px;">😄 Un texte humoristique</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#faf8fd;padding:20px 32px;text-align:center;border-top:1px solid #ede8f5;">
              <p style="margin:0;color:#aaa;font-size:12px;">
                Tu reçois cet email car tu utilises <strong style="color:#9b6bb5;">ConfettiCake</strong> 🎂<br/>
                by Confettis & Cake
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
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
  const resendKey = Deno.env.get('RESEND_API_KEY');

  try {
    // J-7 et J-1 (les deux rappels email les plus utiles)
    const targetDays = [7, 1];
    const targets = targetDays.map((d) => ({ days: d, mmdd: mmddIn(d) }));

    console.log(`[birthday-email-reminder] Checking: ${targets.map(t => t.mmdd).join(', ')}`);

    // Récupère tous les contacts avec leurs profils
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select(`id, name, birthday, name_day, user_id, profiles!inner(id, push_token)`);

    if (error) throw error;
    if (!contacts || contacts.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: 'Aucun contact' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Récupère les emails depuis auth.users via l'admin API
    const userIds = [...new Set(contacts.map((c: any) => c.user_id))];
    const emailByUser: Record<string, string> = {};
    const nameByUser: Record<string, string> = {};

    for (const userId of userIds) {
      const { data: { user } } = await supabase.auth.admin.getUserById(userId as string);
      if (user?.email) {
        emailByUser[userId as string] = user.email;
        nameByUser[userId as string] = user.user_metadata?.first_name
          ?? user.email.split('@')[0];
      }
    }

    let sentCount = 0;
    const appUrl = 'https://confetticake.fr';

    for (const contact of contacts as any[]) {
      const userEmail = emailByUser[contact.user_id];
      if (!userEmail) continue;

      const userName = nameByUser[contact.user_id] ?? 'toi';
      const contactFirstName = contact.name.split(' ').slice(1).join(' ') || contact.name.split(' ')[0];

      // ── Anniversaire ──
      if (contact.birthday) {
        const bdMmdd = toMmdd(contact.birthday);
        const match = targets.find(t => t.mmdd === bdMmdd);
        if (match) {
          const deepLink = `${appUrl}/app/create?contactId=${contact.id}`;
          const { subject, html } = htmlEmail({
            userName, contactFirstName, days: match.days,
            eventType: 'birthday', deepLink,
          });
          await sendEmail(resendKey, userEmail, subject, html);
          sentCount++;
          console.log(`[birthday-email-reminder] Email J-${match.days} birthday → ${userEmail} pour ${contact.name}`);
        }
      }

      // ── Fête du prénom ──
      if (contact.name_day) {
        const match = targets.find(t => t.mmdd === contact.name_day);
        if (match) {
          const deepLink = `${appUrl}/app/create?contactId=${contact.id}`;
          const { subject, html } = htmlEmail({
            userName, contactFirstName, days: match.days,
            eventType: 'nameday', deepLink,
          });
          await sendEmail(resendKey, userEmail, subject, html);
          sentCount++;
          console.log(`[birthday-email-reminder] Email J-${match.days} nameday → ${userEmail} pour ${contact.name}`);
        }
      }
    }

    console.log(`[birthday-email-reminder] Done — ${sentCount} email(s) envoyé(s)`);
    return new Response(
      JSON.stringify({ sent: sentCount, checked: contacts.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('[birthday-email-reminder] Error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function sendEmail(
  apiKey: string | undefined,
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  if (!apiKey) {
    console.warn('[birthday-email-reminder] Resend non configuré — email simulé');
    return;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'ConfettiCake <noreply@confetticake.fr>',
      to: [to],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('[birthday-email-reminder] Resend error:', err);
  }
}
