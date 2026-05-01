// ═══════════════════════════════════════════════════════════════════
//  Confettis & Cake — birth-insights Edge Function
//  Génère quatre types de contenu lié à la date de naissance :
//    • year_facts     → ce qui s'est passé l'année de naissance
//    • celebrities    → personnalités nées le même jour (jour + mois)
//    • day_facts      → ce qui s'est passé le jour exact de naissance
//    • life_path      → chemin de vie numérologique (date complète)
// ═══════════════════════════════════════════════════════════════════

const MISTRAL_MODEL = 'mistral-small-latest';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-•]\s+/gm, '');
}

async function callMistral(prompt: string): Promise<string> {
  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Deno.env.get('MISTRAL_API_KEY')}`,
    },
    body: JSON.stringify({
      model: MISTRAL_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 600,
    }),
  });
  if (!res.ok) throw new Error(`Mistral error: ${await res.text()}`);
  const data = await res.json();
  return stripMarkdown((data.choices?.[0]?.message?.content ?? '').trim());
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { type, year, day, month, contact_name = 'mon proche' } = body;

    if (type === 'year_facts') {
      // ── Ce qui s'est passé l'année de naissance ──────────────────
      if (!year || isNaN(Number(year))) {
        return new Response(JSON.stringify({ error: 'Année manquante' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const prompt = `Tu es un historien passionné et accessible. ${contact_name} est né·e en ${year}.
Génère un portrait fascinant de l'année ${year} en France et dans le monde, en 6 rubriques EXACTEMENT dans cet ordre :

1. ÉVÉNEMENTS (label "📰 Événements") : 3 événements historiques majeurs survenus en France ou dans le monde en ${year}. 1 phrase par événement.
2. MUSIQUE (label "🎵 Chanson de l'année") : La chanson ou l'album le plus populaire en France en ${year}. 1 phrase.
3. CINÉMA (label "🎬 Film de l'année") : Le film le plus populaire au cinéma en France en ${year}. 1 phrase.
4. PRIX (label "💰 Les prix en ${year}") : Prix d'une baguette, d'un café au comptoir, du SMIC mensuel net en ${year}. Indique les prix en francs si avant 2002, en euros si après. 1-2 phrases.
5. POLITIQUE (label "👑 Au pouvoir en ${year}") : Président de la République française et président des États-Unis en ${year}. 1 phrase.
6. ANECDOTE (label "😄 Le saviez-vous ?") : 1 anecdote insolite ou surprenante sur l'année ${year}. 1-2 phrases.

Règles STRICTES :
- Commence chaque rubrique par son label exact entre crochets, ex : [📰 Événements]
- Texte brut, AUCUN markdown (pas d'astérisques, pas de tirets, pas de dièses).
- Séparateur entre rubriques : une ligne vide.
- Maximum 300 mots au total.
- Ton accessible, fun et légèrement nostalgique.
- Si une information est incertaine, propose l'information la plus probable de cette époque.`;

      const content = await callMistral(prompt);
      return new Response(JSON.stringify({ content }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (type === 'celebrities') {
      // ── Personnalités nées le même jour ──────────────────────────
      if (!day || !month) {
        return new Response(JSON.stringify({ error: 'Jour et mois manquants' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const MONTH_NAMES = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
      const monthName = MONTH_NAMES[Number(month) - 1] ?? month;

      const prompt = `Tu es un expert en people et en histoire. ${contact_name} est né·e le ${day} ${monthName}.
Liste 5 personnalités célèbres nées exactement le ${day} ${monthName} (toutes années confondues).

Pour chaque personnalité, fournis exactement :
- NOM : Prénom Nom
- DOMAINE : (ex: Acteur américain, Footballeur brésilien, Physicienne française...)
- COMMENTAIRE : 1 phrase fun ou anecdotique sur cette personne

Présentation attendue pour chaque personnalité (5 fois) :
[NOM] Prénom Nom
[DOMAINE] description
[COMMENTAIRE] phrase amusante

Règles STRICTES :
- 5 personnalités variées : acteurs, sportifs, musiciens, politiques, scientifiques — différentes époques et nationalités
- Personnalités RÉELLEMENT nées ce jour-là — ne pas inventer
- Texte brut, AUCUN markdown (pas d'astérisques, pas de tirets, pas de dièses)
- Pas d'introduction, pas de conclusion, juste les 5 personnalités dans le format demandé`;

      const content = await callMistral(prompt);
      return new Response(JSON.stringify({ content }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (type === 'day_facts') {
      // ── Ce qui s'est passé le JOUR exact de naissance ────────────
      if (!day || !month || !year) {
        return new Response(JSON.stringify({ error: 'Date complète manquante (year/month/day)' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const MONTH_NAMES = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
      const monthName = MONTH_NAMES[Number(month) - 1] ?? month;

      const prompt = `Tu es un expert en histoire et culture populaire. ${contact_name} est né·e le ${day} ${monthName} ${year}.
Génère un portrait unique de ce jour précis.

Structure attendue (utilise exactement ces étiquettes entre crochets) :
[ÉVÉNEMENTS DU JOUR] 2 à 3 événements historiques marquants survenus le ${day} ${monthName} ${year} dans le monde. S'il n'y a pas d'événements notables ce jour précis, cite des événements de la semaine. Sois précis et factuel.
[CHANSON N°1] La chanson qui était n°1 en France cette semaine-là en ${year}. Format : Titre — Artiste
[FILM AU CINÉMA] Le film le plus populaire au box-office français en ${monthName} ${year}. Format : Titre (réalisateur)
[ACTU EN FRANCE] L'actualité principale en France ce jour-là ou cette semaine-là en ${year}. 1 phrase factuelle.
[ANECDOTE] 1 fait insolite ou amusant sur cette date ou cette année ${year}.

Règles STRICTES :
- Texte brut UNIQUEMENT — AUCUN markdown, pas d'astérisques, pas de tirets, pas de dièses
- Chaque section commence par son étiquette entre crochets sur sa propre ligne
- Sois précis, factuel et amusant
- Si tu n'es pas certain d'une information, dis-le clairement (ex: "Vers cette époque en France...")
- Pas d'introduction ni de conclusion en dehors des sections`;

      const content = await callMistral(prompt);
      return new Response(JSON.stringify({ content }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (type === 'life_path') {
      // ── Chemin de vie numérologique ───────────────────────────────
      if (!day || !month || !year) {
        return new Response(JSON.stringify({ error: 'Date complète manquante (year/month/day)' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Calcul local du chemin de vie (pour passer au prompt)
      const digits = `${year}${String(month).padStart(2,'0')}${String(day).padStart(2,'0')}`.split('').map(Number);
      let sum = digits.reduce((a, b) => a + b, 0);
      while (sum > 9 && sum !== 11 && sum !== 22) {
        sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
      }
      const lifePathNumber = sum;

      const LIFE_PATH_NAMES: Record<number, string> = {
        1: 'Le Leader', 2: "L'Harmonieux", 3: 'Le Créatif', 4: 'Le Bâtisseur',
        5: 'Le Libre', 6: 'Le Nourricier', 7: 'Le Sage', 8: "L'Ambitieux",
        9: "L'Humaniste", 11: 'Le Visionnaire', 22: 'Le Maître Bâtisseur',
      };
      const lifePathName = LIFE_PATH_NAMES[lifePathNumber] ?? `Chemin ${lifePathNumber}`;

      const prompt = `Tu es un expert en numérologie et développement personnel. ${contact_name} est né·e le ${day}/${month}/${year}.
Son chemin de vie numérologique est le ${lifePathNumber} — "${lifePathName}".

Génère une description profonde et inspirante en 3 rubriques EXACTEMENT :

[MISSION DE VIE] 2-3 phrases sur la mission profonde et le but de vie que porte ce chemin. Ce que ${contact_name} est venu accomplir dans cette vie. Ton inspirant et positif.

[TALENTS NATURELS] 3-4 talents ou forces naturels portés par ce chemin de vie. Formule chaque talent en 1 courte phrase.

[DÉFIS À SURMONTER] 2-3 défis ou obstacles typiques de ce chemin. Présente-les positivement, comme des opportunités de croissance.

Règles STRICTES :
- Commence chaque rubrique par son label exact entre crochets, ex : [MISSION DE VIE]
- Texte brut, AUCUN markdown (pas d'astérisques, pas de tirets en début de ligne, pas de dièses)
- Séparateur entre rubriques : une ligne vide
- Maximum 250 mots au total
- Ton bienveillant, inspirant, accessible — évite le jargon ésotérique complexe
- Utilise parfois le prénom ${contact_name} pour personnaliser`;

      const content = await callMistral(prompt);
      return new Response(JSON.stringify({ content, life_path_number: lifePathNumber, life_path_name: lifePathName }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'type invalide (year_facts | celebrities | day_facts | life_path)' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('birth-insights error:', err);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
