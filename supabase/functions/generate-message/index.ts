import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_MODEL = 'claude-opus-4-6';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type Occasion =
  | 'birthday' | 'nameday' | 'wedding' | 'birth'
  | 'graduation' | 'promotion' | 'thanks' | 'newyear';

interface OccasionExtras {
  partner1Name?: string;
  partner2Name?: string;
  babyName?: string;
  parentNames?: string;
  diplomaLabel?: string;
  newJobTitle?: string;
  thankReason?: string;
}

type AppLanguage = 'fr' | 'en' | 'de' | 'es' | 'it' | 'ar' | 'pt';

interface GenerateRequest {
  format: 'song' | 'poem' | 'message' | 'joke';
  tone: 'humorous' | 'touching' | 'poetic' | 'playful' | 'professional';
  relation: string;
  contact_name: string;
  age?: number | null;
  memories?: string | null;
  personality_tags?: string[];
  occasion: Occasion;
  late_mode?: boolean;
  extras?: OccasionExtras;
  language?: AppLanguage; // langue de génération (défaut: 'fr')
}

// Noms complets des langues pour le prompt Claude
const LANGUAGE_NAMES: Record<string, string> = {
  fr: 'français',
  en: 'anglais (English)',
  de: 'allemand (Deutsch)',
  es: 'espagnol (Español)',
  it: 'italien (Italiano)',
  ar: 'arabe (العربية)',
  pt: 'portugais (Português)',
};

const RELATION_FR: Record<string, string> = {
  best_friend: 'meilleur·e ami·e', friend: 'ami·e', family: 'membre de la famille',
  partner: 'partenaire amoureux·se', colleague: 'collègue', other: 'proche',
};

const FORMAT_FR: Record<string, string> = {
  song: 'une chanson avec couplets et refrain',
  poem: 'un poème',
  message: 'un message chaleureux',
  joke: 'une blague ou texte humoristique court',
};

const TONE_FR: Record<string, string> = {
  humorous: 'humoristique et drôle', touching: 'touchant et émouvant',
  poetic: 'poétique et lyrique', playful: 'enjoué et taquin',
  professional: 'chaleureux mais professionnel',
};

function buildOccasionContext(req: GenerateRequest): string {
  const relation = RELATION_FR[req.relation] ?? 'proche';
  const extras = req.extras ?? {};
  const lateMention = req.late_mode
    ? ' (NB : le message est envoyé en retard — intègre une touche légère d\'excuse ou d\'humour)' : '';

  switch (req.occasion) {
    case 'birthday':
      return `l'anniversaire de ${req.contact_name}${req.age ? ` qui fête ses ${req.age} ans` : ''}. C'est ${relation} de l'utilisateur.${lateMention}`;

    case 'nameday':
      return `la fête (saint prénom) de ${req.contact_name}. C'est ${relation} de l'utilisateur.${lateMention}`;

    case 'wedding':
      return `le mariage de ${extras.partner1Name ?? req.contact_name}${extras.partner2Name ? ` et ${extras.partner2Name}` : ''}. C'est ${relation} de l'utilisateur. Le ton doit être festif et plein d'amour.`;

    case 'birth':
      return `la naissance de ${extras.babyName ? `bébé ${extras.babyName}` : 'leur bébé'}${extras.parentNames ? `, enfant de ${extras.parentNames}` : ''}. C'est ${relation} de l'utilisateur. Le ton doit être tendre et chaleureux.`;

    case 'graduation':
      return `la réussite${extras.diplomaLabel ? ` au ${extras.diplomaLabel}` : ' aux examens'} de ${req.contact_name}. C'est ${relation} de l'utilisateur. Le ton doit être valorisant et encourageant.`;

    case 'promotion':
      return `la promotion professionnelle de ${req.contact_name}${extras.newJobTitle ? ` (nouveau poste : ${extras.newJobTitle})` : ''}. C'est ${relation} de l'utilisateur. Le ton doit être inspirant et enthousiaste.`;

    case 'thanks':
      return `remercier ${req.contact_name}${extras.thankReason ? ` pour ${extras.thankReason}` : ''}. C'est ${relation} de l'utilisateur. Le message doit être sincère et reconnaissant.`;

    case 'newyear':
      return `présenter les vœux du Nouvel An à ${req.contact_name}. C'est ${relation} de l'utilisateur. Le ton doit être optimiste et plein d'espoir pour l'année à venir.`;

    default:
      return `féliciter ${req.contact_name}. C'est ${relation} de l'utilisateur.`;
  }
}

function buildSystemPrompt(req: GenerateRequest): string {
  const format = FORMAT_FR[req.format] ?? 'un message';
  const tone = TONE_FR[req.tone] ?? 'chaleureux';
  const occasionContext = buildOccasionContext(req);
  const targetLang = req.language ?? 'fr';
  const langName = LANGUAGE_NAMES[targetLang] ?? 'français';

  let prompt = `Tu es un assistant créatif spécialisé dans la rédaction de messages de célébration.

Génère ${format} pour ${occasionContext}

**Ton :** ${tone}
**LANGUE DE GÉNÉRATION OBLIGATOIRE :** Génère le message UNIQUEMENT en ${langName}. Ne mélange pas les langues.`;

  if (req.personality_tags && req.personality_tags.length > 0) {
    prompt += `\n**Personnalité du destinataire :** ${req.personality_tags.join(', ')}`;
  }

  if (req.memories && req.memories.trim()) {
    prompt += `\n**Souvenirs/contexte personnel :** ${req.memories.trim()}`;
  }

  if (req.format === 'song') {
    prompt += `

**Structure attendue :**
- Un titre accrocheur
- Couplet 1 (4-6 lignes)
- Refrain (4-6 lignes, répété)
- Couplet 2 (4-6 lignes)
- Refrain final

Réponds UNIQUEMENT avec le contenu de la chanson, sans explications.`;
  } else if (req.format === 'poem') {
    prompt += `

**Structure :** 3 à 5 strophes, avec rimes si possible.
Réponds UNIQUEMENT avec le poème, sans titre ni explications.`;
  } else if (req.format === 'message') {
    prompt += `

**Longueur :** 3 à 5 paragraphes, sincère et personnalisé.
Réponds UNIQUEMENT avec le message, sans explications.`;
  } else if (req.format === 'joke') {
    prompt += `

**Longueur :** Court et percutant, 2 à 4 paragraphes maximum.
Réponds UNIQUEMENT avec le texte, sans explications.`;
  }

  return prompt;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicApiKey) {
      return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY manquante' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body: GenerateRequest = await req.json();

    if (!body.contact_name || !body.format || !body.tone || !body.relation || !body.occasion) {
      return new Response(JSON.stringify({ error: 'Paramètres manquants' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = buildSystemPrompt(body);

    const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1024,
        messages: [{ role: 'user', content: systemPrompt }],
      }),
    });

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text();
      return new Response(JSON.stringify({ error: `Erreur Claude API: ${anthropicResponse.status}`, detail: errText }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const claudeData = await anthropicResponse.json();
    const content = claudeData.content?.[0]?.text ?? '';

    return new Response(JSON.stringify({ content }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
