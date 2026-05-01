const MISTRAL_MODEL = 'mistral-small-latest';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Actions disponibles
// complete : complète une phrase commencée (inline suggestion)
// improve  : améliore légèrement sans dénaturer (vue côte à côte)
// ideas    : 3 courtes inspirations à s'approprier

type AssistAction = 'complete' | 'improve' | 'ideas';

interface AssistRequest {
  text: string;           // texte écrit par l'utilisateur
  action: AssistAction;
  contact_name?: string;
  relation?: string;
  occasion?: string;
}

function buildContext(contact_name?: string, relation?: string, occasion?: string): string {
  const parts = [
    contact_name && `Destinataire : ${contact_name}`,
    relation && `Relation : ${relation}`,
    occasion && `Occasion : ${occasion}`,
  ].filter(Boolean);
  return parts.length > 0 ? `\nContexte : ${parts.join(', ')}.` : '';
}

function buildPrompt(action: AssistAction, text: string, ctx: string): string {
  if (action === 'complete') {
    return `Tu aides un utilisateur à terminer un message personnel qu'il a commencé à écrire.${ctx}

Début du message : "${text}"

Instructions :
- Propose UNE SEULE continuation naturelle et courte (maximum 1–2 phrases)
- Garde exactement le même ton et style que le début
- Ne répète pas le début du message
- Le texte doit pouvoir s'enchaîner parfaitement avec le début
- Reste simple, chaleureux, humain
- N'essaie pas d'être parfait — l'utilisateur va adapter

Réponds UNIQUEMENT avec la suite du message, sans guillemets, sans explication.`;
  }

  if (action === 'improve') {
    return `Tu améliores légèrement un message personnel écrit par un utilisateur.${ctx}

Message original : "${text}"

Instructions :
- Garde le ton, le style et l'intention d'origine — c'est essentiel
- Améliore la fluidité et la formulation
- Corrige les fautes si nécessaire
- Ne rallonge pas le message
- Ne rends pas le texte trop formel, trop littéraire ou trop parfait
- Le message doit rester reconnaissable : l'utilisateur doit se dire "oui c'est moi, mais en mieux"
- Ne remplace pas les informations personnelles

Important : l'utilisateur est l'auteur — tu es juste son correcteur bienveillant.

Réponds UNIQUEMENT avec la version améliorée, sans guillemets, sans explication.`;
  }

  // ideas
  return `Tu proposes des inspirations courtes pour aider un utilisateur à écrire un message.${ctx}

Instructions :
- Génère exactement 3 propositions courtes (1 à 2 phrases chacune)
- Ce ne sont pas des messages finis — ce sont des pistes que l'utilisateur peut s'approprier
- Laisse de la place pour que l'utilisateur personnalise
- Varie les formulations (une fun, une touchante, une simple)
- Évite les formules toutes faites et les cartes de vœux génériques
- Reste humain, naturel, imperfect
- Utilise des emojis seulement si vraiment adapté
${ctx.includes('animal') || ctx.includes('Animal') || ctx.includes('pet') ? '- Si relation = animal, écrire comme si l\'animal parlait, de façon simple et amusante' : ''}

Réponds UNIQUEMENT avec les 3 propositions, une par ligne (sans numérotation, sans guillemets, sans explication).`;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: AssistRequest = await req.json();
    const { text, action, contact_name, relation, occasion } = body;

    if (!text?.trim() && action !== 'ideas') {
      return new Response(JSON.stringify({ error: 'Texte vide' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ctx = buildContext(contact_name, relation, occasion);
    const prompt = buildPrompt(action, text?.trim() ?? '', ctx);

    const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Deno.env.get('MISTRAL_API_KEY')}`,
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: action === 'ideas' ? 0.85 : 0.65,
        max_tokens: action === 'ideas' ? 300 : 400,
      }),
    });

    if (!mistralRes.ok) {
      console.error('Mistral error:', await mistralRes.text());
      return new Response(JSON.stringify({ error: 'Erreur IA' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const mistralData = await mistralRes.json();
    const raw: string = (mistralData.choices?.[0]?.message?.content ?? '').trim();

    if (action === 'ideas') {
      // Split by line, clean up, keep 3
      const ideas = raw
        .split('\n')
        .map((l: string) => l.replace(/^[-•*\d.)\s]+/, '').trim())
        .filter((l: string) => l.length > 0)
        .slice(0, 3);
      return new Response(JSON.stringify({ ideas }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ text: raw }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('assist-writing error:', err);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
