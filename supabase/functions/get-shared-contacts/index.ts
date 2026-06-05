import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });

  const url   = new URL(req.url);
  const token = url.searchParams.get('token') ?? '';

  if (!token) return new Response(JSON.stringify({ error: 'Token manquant' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  const { data: share } = await supabase
    .from('contact_share_tokens')
    .select('user_id, contact_ids, expires_at, used_at')
    .eq('token', token)
    .single();

  if (!share) return new Response(JSON.stringify({ error: 'Lien invalide ou expiré' }), { status: 404, headers: { ...cors, 'Content-Type': 'application/json' } });
  if (new Date(share.expires_at) < new Date()) return new Response(JSON.stringify({ error: 'Ce lien a expiré (valable 24h)' }), { status: 410, headers: { ...cors, 'Content-Type': 'application/json' } });

  // Récupérer les contacts partagés
  const { data: contacts } = await supabase
    .from('contacts')
    .select('id, name, civilite, relation, birthday, notes')
    .eq('user_id', share.user_id)
    .in('id', share.contact_ids);

  // Prénom de l'expéditeur
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', share.user_id)
    .single();

  const senderName = profile?.full_name
    ? (profile.full_name.split(' ').slice(1).join(' ') || profile.full_name.split(' ')[0])
    : 'Quelqu\'un';

  return new Response(JSON.stringify({
    sender_name: senderName,
    contacts: contacts ?? [],
    expires_at: share.expires_at,
  }), { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } });
});
