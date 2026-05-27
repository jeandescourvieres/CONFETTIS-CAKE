import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// URL publique du player HTML statique hébergé sur confetticake.fr (o2switch)
// Dossier à créer : /vocal-player/player.html sur l'hébergement
const PLAYER_BASE_URL = 'https://jeandescourvieres.github.io/confettis-cake/player.html';

const BG_MUSIC: Record<string, string> = {
  piano:   `${SUPABASE_URL}/storage/v1/object/public/generated-audio/bg-music/piano.mp3`,
  guitare: `${SUPABASE_URL}/storage/v1/object/public/generated-audio/bg-music/guitare.mp3`,
  festif:  `${SUPABASE_URL}/storage/v1/object/public/generated-audio/bg-music/festif.mp3`,
};

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const id  = url.searchParams.get('id') ?? '';

  if (!id) {
    return new Response('ID manquant', { status: 400 });
  }

  const bgParam = url.searchParams.get('bg') ?? '';

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const { data: msg } = await (supabase.from('messages') as any)
    .select('tts_url, tts_bg_music, contact_name')
    .eq('id', id)
    .single();

  if (!msg?.tts_url) {
    return new Response(html404(), { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  const bgKey      = bgParam || msg.tts_bg_music || 'aucune';
  const bgMusicUrl = BG_MUSIC[bgKey] ?? null;
  const recipient  = msg.contact_name ? displayName(msg.contact_name) : null;

  // Redirige vers le player statique avec les données en query params
  const playerUrl = new URL(PLAYER_BASE_URL);
  playerUrl.searchParams.set('tts_url', msg.tts_url);
  if (bgMusicUrl) playerUrl.searchParams.set('bg_url', bgMusicUrl);
  if (recipient)  playerUrl.searchParams.set('recipient', recipient);

  return new Response(null, {
    status: 302,
    headers: { 'Location': playerUrl.toString() },
  });
});

function displayName(name: string): string {
  // Format stocké : "NOM Prénom" → afficher "Prénom NOM"
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return parts[0] ?? name;
  const lastName  = parts[0];
  const firstName = parts.slice(1).join(' ');
  return `${firstName} ${lastName}`;
}

function html404(): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Message introuvable</title></head>
<body style="font-family:sans-serif;text-align:center;padding:60px 20px;color:#666">
  <p style="font-size:48px">😕</p>
  <h2>Message introuvable</h2>
  <p>Ce lien n'est plus valide ou le message a été supprimé.</p>
</body>
</html>`;
}
