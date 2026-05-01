const MISTRAL_MODEL = 'mistral-small-latest';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name, type = 'prénom' } = await req.json();
    if (!name?.trim()) {
      return new Response(JSON.stringify({ error: 'Nom manquant' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const isLastName = type === 'nom' || type === 'nom de famille';

    const prompt = isLastName
      ? `Tu es un expert en généalogie et en anthroponymie (science des noms de famille).
IMPORTANT : Tu analyses uniquement le NOM DE FAMILLE "${name.trim()}". Dans TOUTE ta réponse, utilise exclusivement l'expression "nom de famille" ou "ce nom" — le mot "prénom" est INTERDIT.

Rédige une courte présentation en français, en 3 paragraphes distincts :

Paragraphe 1 — Étymologie : origine géographique ou linguistique du nom de famille (région, langue, racine, sens littéral).
Paragraphe 2 — Histoire : époque d'apparition, répartition géographique en France, évolution orthographique éventuelle.
Paragraphe 3 — Anecdote ou trait distinctif : particularité intéressante, familles célèbres portant ce nom, ou signification symbolique.

Règles de rédaction STRICTES :
- Texte brut uniquement, AUCUN markdown (pas d'astérisques, pas de tirets, pas de dièses, pas de crochets).
- INTERDIT d'utiliser le mot "prénom" — toujours "nom de famille" ou "ce nom".
- Pas de titre, pas de numérotation, pas de liste à puces.
- Chaque paragraphe séparé par une ligne vide.
- Maximum 180 mots au total.
- Ton chaleureux et accessible.`
      : `Tu es un expert en onomastique (science des prénoms).
IMPORTANT : Tu analyses uniquement le PRÉNOM "${name.trim()}". Dans TOUTE ta réponse, utilise exclusivement le mot "prénom" — les expressions "nom" ou "nom de famille" sont INTERDITES.

Rédige une courte présentation en français, en 3 paragraphes distincts :

Paragraphe 1 — Étymologie : origine et signification du prénom (langues d'origine, racines, sens littéral).
Paragraphe 2 — Histoire & popularité : époque(s) de popularité en France, évolution, pays ou cultures associés.
Paragraphe 3 — Caractère : traits de personnalité et qualités généralement associés à ce prénom, de façon positive et bienveillante.

Règles de rédaction STRICTES :
- Texte brut uniquement, AUCUN markdown (pas d'astérisques, pas de tirets, pas de dièses, pas de crochets).
- INTERDIT d'utiliser "nom" ou "nom de famille" — toujours "prénom" ou "ce prénom".
- Pas de titre, pas de numérotation, pas de liste à puces.
- Chaque paragraphe séparé par une ligne vide.
- Maximum 180 mots au total.
- Ton chaleureux et accessible.`;

    const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Deno.env.get('MISTRAL_API_KEY')}`,
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        max_tokens: 400,
      }),
    });

    if (!mistralRes.ok) {
      console.error('Mistral error:', await mistralRes.text());
      return new Response(JSON.stringify({ error: 'Erreur IA' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await mistralRes.json();
    const raw: string = (data.choices?.[0]?.message?.content ?? '').trim();

    // Supprime tout formatage markdown résiduel
    let meaning = raw
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^\s*[-•]\s+/gm, '');

    // Pour les noms de famille : correction des occurrences résiduelles de "prénom"
    if (isLastName) {
      meaning = meaning
        .replace(/\bce prénom\b/gi,          'ce nom de famille')
        .replace(/\bdu prénom\b/gi,           'du nom de famille')
        .replace(/\bau prénom\b/gi,           'au nom de famille')
        .replace(/\bun prénom\b/gi,           'un nom de famille')
        .replace(/\ble prénom\b/gi,           'le nom de famille')
        .replace(/\bles prénoms\b/gi,         'les noms de famille')
        .replace(/\bdes prénoms\b/gi,         'des noms de famille')
        .replace(/\bportant ce prénom\b/gi,   'portant ce nom')
        .replace(/\bprénom rare\b/gi,         'nom de famille rare')
        .replace(/\bprénom\b/gi,              'nom de famille');
    }

    return new Response(JSON.stringify({ meaning }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('name-meaning error:', err);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
