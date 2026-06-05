import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL  = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const CHECKOUT_URL  = `${SUPABASE_URL}/functions/v1/pot-checkout`;

Deno.serve(async (req) => {
  const url   = new URL(req.url);
  const token = url.searchParams.get('token') ?? url.pathname.split('/').pop() ?? '';

  if (!token) return new Response('Token manquant', { status: 400 });

  const success = url.searchParams.get('success') === '1';

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const { data: pot, error } = await supabase
    .from('pots')
    .select('*, contact:contacts(name)')
    .eq('share_token', token)
    .single();

  if (error || !pot) {
    return new Response(html404(), { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  const total   = pot.current_amount ?? 0;
  const target  = pot.target_amount ?? 0;
  const pct     = target > 0 ? Math.min(Math.round((total / target) * 100), 100) : 0;
  const contact = (pot.contact as { name?: string } | null)?.name ?? 'quelqu\'un de spécial';
  const deadline = pot.deadline ? new Date(pot.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  return new Response(htmlPage({ pot, total, target, pct, contact, deadline, token, checkoutUrl: CHECKOUT_URL, success }), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
});

function htmlPage({ pot, total, target, pct, contact, deadline, token, checkoutUrl, success }: {
  pot: Record<string, unknown>;
  total: number; target: number; pct: number;
  contact: string; deadline: string | null;
  token: string; checkoutUrl: string; success: boolean;
}) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pot.title ?? 'Cagnotte'} — Confettis & Cake</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f0ff; color: #1a1a2e; min-height: 100vh; }
    .header { background: linear-gradient(135deg, #9b6bb5, #c084fc); color: white; padding: 32px 20px 48px; text-align: center; }
    .header-logo { font-size: 14px; opacity: 0.8; margin-bottom: 16px; letter-spacing: 1px; text-transform: uppercase; }
    .header-title { font-size: 26px; font-weight: 800; margin-bottom: 8px; }
    .header-sub { font-size: 15px; opacity: 0.9; }
    .card { background: white; border-radius: 20px; padding: 24px; margin: -24px 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .progress-label { display: flex; justify-content: space-between; font-size: 13px; color: #666; margin-bottom: 8px; }
    .progress-bar { background: #f0e6ff; border-radius: 99px; height: 10px; overflow: hidden; margin-bottom: 16px; }
    .progress-fill { background: linear-gradient(90deg, #9b6bb5, #c084fc); height: 100%; border-radius: 99px; transition: width 0.6s; }
    .amounts { display: flex; gap: 12px; margin-bottom: 16px; }
    .amount-box { flex: 1; background: #f8f4ff; border-radius: 12px; padding: 12px; text-align: center; }
    .amount-value { font-size: 22px; font-weight: 800; color: #9b6bb5; }
    .amount-label { font-size: 11px; color: #888; margin-top: 2px; }
    .deadline { font-size: 13px; color: #666; text-align: center; margin-top: 8px; }
    .section { margin: 0 16px 16px; }
    .section-title { font-size: 18px; font-weight: 700; color: #1a1a2e; margin-bottom: 16px; }
    label { display: block; font-size: 13px; font-weight: 600; color: #444; margin-bottom: 6px; margin-top: 14px; }
    input { width: 100%; padding: 13px 14px; border: 1.5px solid #e0d6f0; border-radius: 12px; font-size: 15px; outline: none; transition: border-color 0.2s; }
    input:focus { border-color: #9b6bb5; }
    .quick-amounts { display: flex; gap: 8px; flex-wrap: wrap; margin: 12px 0 4px; }
    .quick-btn { padding: 8px 14px; border: 1.5px solid #ddd; border-radius: 99px; background: white; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
    .quick-btn.active, .quick-btn:hover { background: #9b6bb5; color: white; border-color: #9b6bb5; }
    .pay-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #9b6bb5, #c084fc); color: white; border: none; border-radius: 99px; font-size: 16px; font-weight: 800; cursor: pointer; margin-top: 20px; transition: opacity 0.2s; }
    .pay-btn:hover { opacity: 0.9; }
    .pay-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .secure { text-align: center; font-size: 12px; color: #999; margin-top: 10px; }
    .footer { text-align: center; padding: 24px 16px 32px; font-size: 13px; color: #aaa; }
    @media (min-width: 500px) { .card, .section { max-width: 440px; margin-left: auto; margin-right: auto; } .header { padding-bottom: 56px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-logo">🎉 Confettis & Cake</div>
    <div class="header-title">${escHtml(String(pot.title ?? 'Cagnotte'))}</div>
    <div class="header-sub">Pour ${escHtml(contact)}</div>
  </div>

  <div class="card">
    <div class="progress-label">
      <span>Collecté</span>
      <span>${pct}%</span>
    </div>
    <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    <div class="amounts">
      <div class="amount-box"><div class="amount-value">${total.toFixed(0)} €</div><div class="amount-label">collectés</div></div>
      <div class="amount-box"><div class="amount-value">${target.toFixed(0)} €</div><div class="amount-label">objectif</div></div>
    </div>
    ${deadline ? `<div class="deadline">⏰ Clôture le ${escHtml(deadline)}</div>` : ''}
  </div>

  ${success ? `
  <div class="section" style="text-align:center;padding:24px 16px;">
    <div style="font-size:52px">🎉</div>
    <h2 style="margin:12px 0 8px;color:#4CAF50">Merci pour ta contribution !</h2>
    <p style="color:#666;font-size:14px">Un justificatif a été envoyé à ton email par Stripe.</p>
  </div>` : `
  <div class="section">
    <div class="section-title">💜 Participer à la cagnotte</div>
    <form id="form" action="${checkoutUrl}" method="POST">
      <input type="hidden" name="token" value="${escHtml(token)}">
      <label for="name">Ton prénom et nom</label>
      <input type="text" id="name" name="name" placeholder="Sophie Dupont" required>
      <label for="email">Ton email (pour le justificatif)</label>
      <input type="email" id="email" name="email" placeholder="sophie@email.com" required>
      <label>Montant</label>
      <div class="quick-amounts">
        ${[5,10,20,30,50].map(a => `<button type="button" class="quick-btn" onclick="setAmount(${a})">${a} €</button>`).join('')}
      </div>
      <input type="number" id="amount" name="amount" placeholder="Autre montant (€)" min="1" step="0.50" required>
      <button type="submit" class="pay-btn" id="payBtn">💳 Continuer vers le paiement</button>
      <div class="secure">🔒 Paiement sécurisé par Stripe</div>
    </form>
  </div>

  `}

  <div class="footer">Confettis & Cake — Messages IA pour chaque occasion</div>

  <script>
    function setAmount(v) {
      document.getElementById('amount').value = v;
      document.querySelectorAll('.quick-btn').forEach(b => b.classList.remove('active'));
      event.target.classList.add('active');
    }
    document.getElementById('form').addEventListener('submit', function() {
      document.getElementById('payBtn').disabled = true;
      document.getElementById('payBtn').textContent = 'Redirection…';
    });
  </script>
</body>
</html>`;
}

function html404() {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Cagnotte introuvable</title><style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f5f0ff;}.box{text-align:center;padding:32px;}</style></head><body><div class="box"><div style="font-size:48px">🔍</div><h2 style="margin:16px 0 8px">Cagnotte introuvable</h2><p style="color:#666">Ce lien est peut-être expiré ou invalide.</p></div></body></html>`;
}

function escHtml(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
