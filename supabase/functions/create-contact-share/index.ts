import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } });

    const { contact_ids } = await req.json() as { contact_ids: string[] };
    if (!contact_ids?.length) return new Response(JSON.stringify({ error: 'Aucun contact sélectionné' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });

    // Vérifier que les contacts appartiennent bien à l'utilisateur
    const { data: contacts } = await supabase
      .from('contacts')
      .select('id, name, civilite, relation, birthday, notes')
      .eq('user_id', user.id)
      .in('id', contact_ids);

    if (!contacts?.length) return new Response(JSON.stringify({ error: 'Contacts introuvables' }), { status: 404, headers: { ...cors, 'Content-Type': 'application/json' } });

    // Récupérer le prénom de l'expéditeur
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    const senderName = profile?.full_name
      ? (profile.full_name.split(' ').slice(1).join(' ') || profile.full_name.split(' ')[0])
      : 'Quelqu\'un';

    // Créer le token
    const { data: token, error } = await supabase
      .from('contact_share_tokens')
      .insert({ user_id: user.id, contact_ids })
      .select('token')
      .single();

    if (error || !token) throw new Error(error?.message ?? 'Erreur création token');

    return new Response(JSON.stringify({
      token: token.token,
      url: `https://confetticake.fr/import-contacts.html?token=${token.token}`,
      sender_name: senderName,
      contact_count: contacts.length,
    }), { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } });

  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
});
