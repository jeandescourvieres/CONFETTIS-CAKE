import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const MISTRAL_MODEL = 'mistral-small-latest';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SuggestRequest {
  contact_name: string;
  relation: string;
  age?: number | null;
  personality_tags?: string[];
  occasion?: string | null;
  budget?: string | null;
  language?: string;
}

interface GiftIdea {
  title: string;
  description: string;
  price_range: string;
}

const RELATION_FR: Record<string, string> = {
  best_friend: 'meilleur·e ami·e',
  friend: 'ami·e',
  family: 'membre de la famille',
  partner: 'partenaire amoureux·se',
  colleague: 'collègue',
  other: 'proche',
  frère: 'frère',
  soeur: 'sœur',
  sœur: 'sœur',
  père: 'père',
  mère: 'mère',
  'grand-père': 'grand-père',
  'grand-mère': 'grand-mère',
  oncle: 'oncle',
  tante: 'tante',
  cousin: 'cousin',
  cousine: 'cousine',
  neveu: 'neveu',
  nièce: 'nièce',
  pet: 'animal de compagnie',
};

const OCCASION_FR: Record<string, string> = {
  birthday: 'anniversaire',
  nameday: 'fête',
  christmas: 'Noël',
  wedding: 'mariage',
  birth: 'naissance',
  graduation: 'diplôme',
  promotion: 'promotion professionnelle',
  retirement: 'retraite',
  valentines: 'Saint-Valentin',
  mothersday: 'fête des mères',
  fathersday: 'fête des pères',
  easter: 'Pâques',
  newyear: 'Nouvel An',
  thanks: 'remerciement',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } },
    );

    const body: SuggestRequest = await req.json();
    const { contact_name, relation, age, personality_tags = [], occasion, budget } = body;

    const relationLabel = RELATION_FR[relation] ?? relation;
    const occasionLabel = occasion ? (OCCASION_FR[occasion] ?? occasion) : null;
    const ageInfo = age ? `${age} ans` : null;
    const tagsInfo = personality_tags.length > 0 ? personality_tags.join(', ') : null;

    const budgetConstraint = budget && budget !== 'all'
      ? `Budget maximum souhaité : ${budget}. TOUTES les idées doivent respecter ce budget.`
      : null;

    const contextParts = [
      `Destinataire : ${contact_name}`,
      `Relation : ${relationLabel}`,
      ageInfo && `Âge : ${ageInfo}`,
      tagsInfo && `Traits de personnalité : ${tagsInfo}`,
      occasionLabel && `Occasion : ${occasionLabel}`,
      budgetConstraint,
    ].filter(Boolean).join('\n');

    const priceInstruction = budgetConstraint
      ? `Toutes les idées doivent tenir dans le budget "${budget}". Le champ price_range doit être précis et cohérent avec ce budget.`
      : `Varie les fourchettes de prix (inclus au moins une option < 30 € et une > 50 €).`;

    const prompt = `Tu es un assistant expert en idées cadeaux personnalisés.

Profil du destinataire :
${contextParts}

Génère exactement 5 idées cadeaux originales, variées et adaptées à ce profil.
Pour chaque idée, fournis :
- title : nom court et accrocheur du cadeau (max 6 mots)
- description : une phrase courte et enthousiaste expliquant pourquoi c'est parfait (max 20 mots)
- price_range : fourchette de prix réaliste (ex: "10–30 €", "50–100 €", "Gratuit", "< 20 €")

${priceInstruction}
Sois créatif et chaleureux, évite les idées trop génériques.

Réponds UNIQUEMENT avec un tableau JSON valide, sans texte supplémentaire, sans markdown :
[{"title":"...","description":"...","price_range":"..."},...]`;

    const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Deno.env.get('MISTRAL_API_KEY')}`,
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9,
        max_tokens: 800,
      }),
    });

    if (!mistralRes.ok) {
      const err = await mistralRes.text();
      console.error('Mistral error:', err);
      return new Response(JSON.stringify({ error: 'Erreur IA' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const mistralData = await mistralRes.json();
    const rawContent: string = mistralData.choices?.[0]?.message?.content ?? '[]';

    // Extract JSON array from response (handles markdown code blocks)
    const jsonMatch = rawContent.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : '[]';

    let suggestions: GiftIdea[] = [];
    try {
      suggestions = JSON.parse(jsonStr);
    } catch {
      console.error('JSON parse error:', jsonStr);
      suggestions = [];
    }

    return new Response(JSON.stringify({ suggestions }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('suggest-gifts error:', err);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
