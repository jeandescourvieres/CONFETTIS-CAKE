// ══════════════════════════════════════════════════════════════
//  generate-avatar — Génère un avatar IA via DALL-E 3
//  Prend les infos du contact (signe astro, animal chinois,
//  couleur préférée, tags) et génère un portrait illustré.
// ══════════════════════════════════════════════════════════════

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ── Styles artistiques ────────────────────────────────────────
const STYLES: Record<string, string> = {
  aquarelle:   'soft watercolor illustration, delicate pastel brushstrokes, transparent washes, dreamy artistic watercolor painting',
  cartoon:     'cute friendly cartoon character, bright flat colors, bold outlines, cheerful and playful cartoon illustration style',
  pixel_art:   '16-bit pixel art character portrait, retro video game style, colorful pixel art, crisp pixels',
  manga:       'Japanese manga anime illustration, expressive large eyes, clean line art, anime portrait style',
  esquisse:    'detailed pencil sketch portrait, hand-drawn artistic sketch, fine pencil lines, expressive drawing',
  fantastique: 'fantasy magical illustration, ethereal enchanted atmosphere, glowing mystical light, fantasy art portrait',
};

// ── Signe astrologique (inline, sans import) ──────────────────
function getZodiacName(birthday: string): string | null {
  const parts = birthday.split('-');
  const month = parseInt(parts[1]);
  const day   = parseInt(parts[2]);
  if (!month || !day) return null;
  const d = month * 100 + day;
  if (d >= 321 && d <= 419) return 'Aries';
  if (d >= 420 && d <= 520) return 'Taurus';
  if (d >= 521 && d <= 620) return 'Gemini';
  if (d >= 621 && d <= 722) return 'Cancer';
  if (d >= 723 && d <= 822) return 'Leo';
  if (d >= 823 && d <= 922) return 'Virgo';
  if (d >= 923 && d <= 1022) return 'Libra';
  if (d >= 1023 && d <= 1121) return 'Scorpio';
  if (d >= 1122 && d <= 1221) return 'Sagittarius';
  if ((d >= 1222 && d <= 1231) || (d >= 101 && d <= 119)) return 'Capricorn';
  if (d >= 120 && d <= 218) return 'Aquarius';
  return 'Pisces';
}

// ── Animal chinois (inline) ───────────────────────────────────
const CHINESE_ANIMALS = ['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];
function getChineseAnimal(birthday: string): string | null {
  const year = parseInt(birthday.split('-')[0]);
  if (!year || year < 100) return null;
  return CHINESE_ANIMALS[(year - 1900) % 12] ?? null;
}

// ── Relation → sujet portrait ─────────────────────────────────
const RELATION_SUBJECT: Record<string, string> = {
  best_friend: 'a joyful friendly person',
  friend:      'a cheerful person',
  family:      'a warm family member',
  partner:     'a loving person',
  colleague:   'a professional person',
  pet:         'a cute animal companion',
  other:       'a person',
};

// ── Helper réponse erreur ─────────────────────────────────────
function errorResp(status: number, message: string) {
  return new Response(
    JSON.stringify({ error: message }),
    { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
}

// ── Handler principal ─────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  let body: { contact_id: string; style: string; user_id: string };
  try {
    body = await req.json();
  } catch {
    return errorResp(400, 'Corps JSON invalide');
  }

  const { contact_id, style, user_id } = body;

  if (!contact_id || !style || !user_id) {
    return errorResp(400, 'contact_id, style et user_id sont requis');
  }
  if (!STYLES[style]) {
    return errorResp(400, `Style inconnu : ${style}. Styles disponibles : ${Object.keys(STYLES).join(', ')}`);
  }

  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    return errorResp(503, 'OPENAI_API_KEY non configurée dans les secrets Supabase');
  }

  // ── Charger le contact ────────────────────────────────────────
  const { data: contact, error: contactErr } = await supabase
    .from('contacts')
    .select('name, birthday, relation, personality_tags, favourite_color')
    .eq('id', contact_id)
    .eq('user_id', user_id)
    .single();

  if (contactErr || !contact) {
    return errorResp(404, 'Contact introuvable ou accès refusé');
  }

  // ── Construire le prompt ──────────────────────────────────────
  const firstName = contact.name.split(' ').slice(1).join(' ') || contact.name.split(' ')[0];
  const stylePrompt = STYLES[style];
  const subject = RELATION_SUBJECT[contact.relation] ?? 'a person';

  const details: string[] = [];

  if (contact.birthday && !contact.birthday.startsWith('0000-')) {
    const birthYear = parseInt(contact.birthday.split('-')[0]);
    const age = new Date().getFullYear() - birthYear;
    if (age > 0 && age < 120) details.push(`approximately ${age} years old`);
    const zodiac = getZodiacName(contact.birthday);
    const animal = getChineseAnimal(contact.birthday);
    if (zodiac) details.push(`inspired by ${zodiac} zodiac energy`);
    if (animal) details.push(`with subtle ${animal} motifs`);
  }

  if (contact.favourite_color) {
    details.push(`color palette featuring ${contact.favourite_color}`);
  }

  const tags: string[] = Array.isArray(contact.personality_tags)
    ? contact.personality_tags.slice(0, 4)
    : [];
  if (tags.length > 0) {
    details.push(`personality traits: ${tags.join(', ')}`);
  }

  const detailStr = details.length > 0 ? `, ${details.join(', ')}` : '';

  const prompt =
    `A beautiful profile avatar portrait illustration of ${subject} named ${firstName}, ` +
    `${stylePrompt}${detailStr}. ` +
    `No text, no letters, no numbers. ` +
    `Centered portrait, square composition, vibrant and expressive. ` +
    `Suitable as a profile picture avatar.`;

  console.log(`generate-avatar: style=${style}, contact=${firstName}, prompt length=${prompt.length}`);

  try {
    // ── Appel DALL-E 3 ────────────────────────────────────────────
    const dalleResp = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model:   'gpt-image-1',
        prompt,
        n:       1,
        size:    '1024x1024',
        quality: 'medium',
      }),
    });

    if (!dalleResp.ok) {
      const errBody = await dalleResp.text();
      throw new Error(`DALL-E error ${dalleResp.status}: ${errBody}`);
    }

    const dalleData = await dalleResp.json();
    const b64 = dalleData.data[0].b64_json;
    if (!b64) throw new Error('Réponse image vide');

    // ── Décoder le base64 en buffer ───────────────────────────────
    const binaryStr = atob(b64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
    const imgBuffer = bytes.buffer;

    // ── Upload vers contact-avatars ───────────────────────────────
    const fileName = `${user_id}/ai_${contact_id}_${Date.now()}.png`;
    const { error: uploadErr } = await supabase.storage
      .from('contact-avatars')
      .upload(fileName, imgBuffer, { contentType: 'image/png', upsert: true });

    if (uploadErr) throw new Error(`Storage upload: ${uploadErr.message}`);

    const { data: urlData } = supabase.storage
      .from('contact-avatars')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // ── Mettre à jour le contact ──────────────────────────────────
    await supabase
      .from('contacts')
      .update({ avatar_url: publicUrl })
      .eq('id', contact_id);

    return new Response(
      JSON.stringify({ success: true, url: publicUrl }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err) {
    console.error('generate-avatar error:', err);
    return errorResp(500, err instanceof Error ? err.message : 'Erreur interne');
  }
});
