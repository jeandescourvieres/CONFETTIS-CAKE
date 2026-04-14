import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const MISTRAL_MODEL = 'open-mistral-7b';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type Occasion =
  | 'birthday' | 'nameday' | 'wedding' | 'birth'
  | 'graduation' | 'promotion' | 'thanks' | 'newyear' | 'support' | 'custom'
  | 'christmas' | 'easter' | 'valentines' | 'mothersday' | 'fathersday' | 'halloween' | 'retirement';

interface OccasionExtras {
  partner1Name?: string;
  partner2Name?: string;
  babyName?: string;
  parentNames?: string;
  diplomaLabel?: string;
  newJobTitle?: string;
  thankReason?: string;
  customOccasionLabel?: string;
  supportType?: 'bereavement' | 'illness' | 'breakup' | 'hardtime' | 'encouragement';
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
  style_hint?: string; // 'Court' | 'Moyen' | 'Long'
  language?: AppLanguage; // langue de génération (défaut: 'fr')
  is_regeneration?: boolean; // true = pas de déduction de crédit
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
  // Sous-relations famille
  frère: 'frère', soeur: 'sœur', sœur: 'sœur',
  père: 'père', mere: 'mère', mère: 'mère',
  'grand-père': 'grand-père', 'grand-mere': 'grand-mère', 'grand-mère': 'grand-mère',
  oncle: 'oncle', tante: 'tante',
  cousin: 'cousin', cousine: 'cousine',
  fils: 'fils', fille: 'fille',
  neveu: 'neveu', niece: 'nièce', nièce: 'nièce',
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
  // Si la relation n'est pas dans le dictionnaire, on l'utilise telle quelle (saisie libre)
  const relation = RELATION_FR[req.relation] ?? req.relation;
  const extras = req.extras ?? {};
  const lateMention = req.late_mode
    ? ' (NB : le message est envoyé en retard — intègre une touche légère d\'excuse ou d\'humour)' : '';

  switch (req.occasion) {
    case 'birthday':
      return `l'anniversaire de ${req.contact_name}${req.age ? ` qui fête ses ${req.age} ans` : ''}. C'est ${relation} de l'utilisateur.${lateMention}`;

    case 'nameday':
      return `la fête (saint prénom) de ${req.contact_name}. C'est ${relation} de l'utilisateur.${lateMention}`;

    case 'wedding':
      return `le mariage${extras.partner1Name ? ` de ${extras.partner1Name}` : ''}${extras.partner2Name ? ` et ${extras.partner2Name}` : ` de ${req.contact_name}`}. C'est ${relation} de l'utilisateur.`;

    case 'birth':
      return `la naissance de ${extras.babyName ? `bébé ${extras.babyName}` : 'leur bébé'}${extras.parentNames ? `, enfant de ${extras.parentNames}` : ''}. C'est ${relation} de l'utilisateur.`;

    case 'graduation':
      return `la réussite${extras.diplomaLabel ? ` au ${extras.diplomaLabel}` : ' aux examens'} de ${req.contact_name}. C'est ${relation} de l'utilisateur.`;

    case 'promotion':
      return `la promotion professionnelle de ${req.contact_name}${extras.newJobTitle ? ` (nouveau poste : ${extras.newJobTitle})` : ''}. C'est ${relation} de l'utilisateur.`;

    case 'thanks':
      return `remercier ${req.contact_name}${extras.thankReason ? ` pour ${extras.thankReason}` : ''}. C'est ${relation} de l'utilisateur.`;

    case 'newyear':
      return `présenter les vœux du Nouvel An à ${req.contact_name}. C'est ${relation} de l'utilisateur.`;

    case 'christmas':
      return `souhaiter un joyeux Noël à ${req.contact_name}. C'est ${relation} de l'utilisateur.`;

    case 'easter':
      return `souhaiter de joyeuses Pâques à ${req.contact_name}. C'est ${relation} de l'utilisateur.`;

    case 'valentines':
      return `envoyer un message de Saint-Valentin à ${req.contact_name}. C'est ${relation} de l'utilisateur.`;

    case 'mothersday':
      return `souhaiter une bonne fête des Mères à ${req.contact_name}. C'est ${relation} de l'utilisateur.`;

    case 'fathersday':
      return `souhaiter une bonne fête des Pères à ${req.contact_name}. C'est ${relation} de l'utilisateur.`;

    case 'halloween':
      return `envoyer un message d'Halloween à ${req.contact_name}. C'est ${relation} de l'utilisateur.`;

    case 'retirement':
      return `célébrer le départ à la retraite de ${req.contact_name}. C'est ${relation} de l'utilisateur.`;

    case 'support': {
      const supportLabels: Record<string, string> = {
        bereavement: `soutenir ${req.contact_name} face à un deuil ou une perte`,
        illness: `soutenir ${req.contact_name} pendant une maladie ou une hospitalisation`,
        breakup: `réconforter ${req.contact_name} après une séparation ou rupture`,
        hardtime: `soutenir ${req.contact_name} dans une période difficile (stress, burn-out, déprime)`,
        encouragement: `encourager ${req.contact_name} et lui envoyer un message de soutien moral`,
      };
      const supportCtx = extras.supportType ? supportLabels[extras.supportType] : `envoyer un message de soutien à ${req.contact_name}`;
      return `${supportCtx}. C'est ${relation} de l'utilisateur.`;
    }

    case 'custom':
      return `${extras.customOccasionLabel ? extras.customOccasionLabel : `célébrer un événement spécial avec ${req.contact_name}`}. C'est ${relation} de l'utilisateur.`;

    default:
      return `féliciter ${req.contact_name}. C'est ${relation} de l'utilisateur.`;
  }
}

function buildOccasionGuidelines(req: GenerateRequest): string {
  switch (req.occasion) {
    case 'birthday':
      return `**Consignes spécifiques anniversaire :**
- Commence par une salutation adaptée à la relation (ex: "Hey frérot !" pour un frère, "Salut mon cœur !" pour un partenaire, "Cher [Prénom]" pour un collègue).
- Intègre au moins 2 détails personnels dans le texte (personnalité, passion, souvenir mentionné…) — ne les liste pas, tisse-les naturellement.
- Ajoute une suggestion d'activité ou de cadeau en fin de message si pertinent et si le ton s'y prête.`;

    case 'nameday':
      return `**Consignes spécifiques fête du prénom :**
- Commence par une référence directe à la fête (ex: "Aujourd'hui c'est TA journée, [prénom] ! 🎉").
- Intègre si possible une anecdote ou tradition liée au saint/sainte du jour (ex: "Savais-tu que les Catherine sont célébrées depuis le Moyen Âge ?"). Si tu n'as pas d'anecdote précise, reste sur une touche festive générale.
- Ajoute une touche personnelle liée à la personnalité ou aux notes du contact si disponibles.
- Termine par un vœu joyeux et chaleureux adapté à la relation.
- Utilise des émojis festifs : 🎉 👑 🍰 🌸
- Pour un ton humoristique : joue sur l'idée que c'est "officiellement sa journée" et qu'il/elle peut en abuser.`;

    case 'wedding':
      return `**Consignes spécifiques mariage :**
- Félicite le couple pour leur amour et leur engagement.
- Si tu as des infos sur leur relation (durée, contexte dans les souvenirs), mentionne-les.
- Exprime un vœu sincère pour leur avenir commun.
- Termine sur une note festive et chaleureuse. 💍`;

    case 'birth':
      return `**Consignes spécifiques naissance :**
- Félicite les parents avec chaleur et émotion ("Quel bonheur de savoir que [bébé] a rejoint votre vie !").
- Exprime des vœux tendres pour l'enfant et des encouragements pour les parents.
- Si une cagnotte ou un cadeau est mentionné dans les souvenirs, intègre-le naturellement. 👶`;

    case 'promotion':
      return `**Consignes spécifiques promotion professionnelle :**
- Commence par une félicitation claire et enthousiaste.
- Souligne les compétences ou efforts concrets qui ont mené à cette promotion — si le nouveau poste ou un parcours est mentionné dans les notes, cite-les naturellement.
- Mentionne un défi futur avec optimisme et confiance (ex: "Je sais que tu vas exceller dans ce nouveau rôle").
- Termine par une offre de soutien sincère et chaleureuse, adaptée à la relation (collègue, ami, famille).
- Émojis conseillés : 🎉 👔 🚀 💼
- Pour un ton professionnel : structure plus formelle, "Cher/Chère [prénom]", signature chaleureuse.
- Pour un ton humoristique : joue sur la montée en grade, les nouvelles responsabilités qui arrivent.`;

    case 'thanks':
      return `**Consignes spécifiques remerciements :**
- Commence par un merci général sincère et chaleureux.
- Si le motif est précisé, mentionne son impact concret sur l'expéditeur.
- Si des moments ou détails spécifiques sont dans les souvenirs, cite-les pour personnaliser.
- Termine par une note personnelle et reconnaissante.`;

    case 'newyear':
    case 'christmas':
    case 'easter':
      return `**Consignes spécifiques fête :**
- Commence par une référence directe à la fête (ex: "Cette année, Noël sera encore plus spécial…").
- Si des traditions ou souvenirs sont mentionnés, intègre-les naturellement.
- Ajoute un vœu personnalisé adapté à la relation (ex: "Que cette nouvelle année t'apporte autant de joie que tu m'en donnes").`;

    case 'valentines': {
      const isPartner = req.relation === 'partner';
      return isPartner
        ? `**Consignes spécifiques Saint-Valentin (couple) :**
- Utilise des souvenirs ou moments partagés si disponibles.
- Propose une activité ou un moment à partager (dîner, sortie…).
- Ajoute une touche romantique et sincère. ❤️`
        : `**Consignes spécifiques Saint-Valentin (ami·e) :**
- Ton léger, complice et solidaire — pas de clichés romantiques.
- Célèbre l'amitié et la complicité. 🍫`;
    }

    case 'mothersday':
      return `**Consignes spécifiques fête des Mères :**
- Commence par un terme affectueux adapté à la relation (ex: "Ma chère maman", "Bonne-maman adorée", "Belle-maman").
- Évoque 1 à 2 qualités ou souvenirs concrets si disponibles dans les notes — tisse-les naturellement dans le texte.
- Exprime une gratitude profonde, visible et invisible (ex: "Merci pour tout ce que tu fais, vu et invisible").
- Termine par un vœu tendre et personnel pour elle (ex: "Je te souhaite une journée aussi douce que tes câlins").
- Émojis conseillés : ❤️ 🌸 🎁
- Le message doit être chaleureux et sincère — évite les formules trop génériques.`;

    case 'fathersday':
      return `**Consignes spécifiques fête des Pères :**
- Commence par un terme affectueux adapté à la relation (ex: "Mon cher papa", "Beau-père adoré", "Papi").
- Évoque 1 à 2 qualités ou souvenirs concrets si disponibles dans les notes — tisse-les naturellement dans le texte.
- Exprime reconnaissance et admiration pour sa présence et son soutien (ex: "Merci pour tout ce que tu m'as transmis, en actes et en silence").
- Termine par un vœu chaleureux et personnel pour lui (ex: "Je te souhaite une journée aussi belle que tout ce que tu nous as offert").
- Émojis conseillés : 💙 🛠️ 🎁 👨‍👧
- Le message doit célébrer la figure paternelle avec sincérité — évite les clichés trop convenus.`;

    case 'retirement':
      return `**Consignes spécifiques départ à la retraite :**
- Honore la carrière accomplie avec respect et chaleur.
- Si des souvenirs ou anecdotes sont mentionnés, cite-les pour personnaliser.
- Célèbre la nouvelle liberté avec enthousiasme ("Profite bien de tes matins sans réveil !").
- Propose une activité ou un cadeau si le ton s'y prête. 🌴🎉`;

    case 'support':
      return `**Consignes spécifiques message de soutien :**
- Commence par une reconnaissance sincère de la situation (ex: "Je sais que ce moment est difficile pour toi") — sans minimiser, sans dramatiser.
- Rappelle une qualité ou un souvenir positif du contact si disponible (ex: "Si quelqu'un peut traverser ça, c'est bien toi avec ta force et ta résilience").
- Propose un soutien concret adapté à la relation (ex: "Je suis là si tu as besoin de parler, d'une balade, ou même d'un silence partagé").
- Termine par une phrase de présence douce (ex: "Je t'envoie tout mon soutien, aujourd'hui et les jours suivants").
- **À éviter absolument** : "Tout va s'arranger", "Je comprends ce que tu vis", "Sois fort(e)", "Le temps guérit tout", conseils non sollicités, promesses de guérison.
- Émojis : ❤️ 🌟 🤗 — avec parcimonie.
- Adapte selon le sous-type :
  • Deuil : douceur et compassion, pas de "joie" ni d'"espoir" forcé
  • Maladie : énergie et présence, pas de promesse de guérison
  • Séparation : valide l'émotion sans critiquer l'ex-partenaire
  • Période difficile / burn-out : encourage sans banaliser`;

    case 'halloween':
      return `**Consignes spécifiques Halloween :**
- Commence par une accroche thématique percutante (ex: "🎃 BOO ! [prénom], prépare-toi…").
- Intègre une référence concrète à Halloween : fantômes, bonbons, déguisements, films d'horreur — adapte selon les notes ou la personnalité du contact.
- Ajoute une touche personnelle si des traditions ou anecdotes sont mentionnées (ex: "Toi qui adores les films d'horreur, tu dois être aux anges !").
- Termine par une invitation festive ou un vœu amusant (ex: "Soirée films d'horreur ? On se retrouve si tu l'oses !").
- Selon le ton : espiègle et drôle pour les amis, légèrement frissonnant pour les fans d'horreur, décalé pour les collègues.
- Émojis conseillés : 🎃 👻 🍬 🕷️ 🕯️`;

    default:
      return '';
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
**LANGUE DE GÉNÉRATION OBLIGATOIRE :** Génère le message UNIQUEMENT en ${langName}. Ne mélange pas les langues.
**IMPORTANT — Relation :** Utilise uniquement la relation indiquée ci-dessus. N'invente pas de lien de parenté ou d'affection non spécifié (ne suppose pas que c'est une cousine, sœur, etc. si ce n'est pas précisé).
**IMPORTANT — Point de vue :** Le message est écrit par UNE SEULE personne, à la première personne du singulier ("je", "mon", "ma", "mes"). N'utilise jamais "nous", "notre", "nos" sauf si le contexte l'impose explicitement (ex: mariage).`;

  prompt += `\n**Formule de clôture :** Termine toujours le message par une formule chaleureuse et sincère adaptée au ton (ex: "Je t'embrasse", "Avec toute mon affection", "Bien à toi", "Plein de bisous"...). Ne mets pas de signature ni de prénom.`;

  if (req.occasion === 'support') {
    prompt += `
**CONTEXTE DÉLICAT :** Ce message concerne un moment difficile. Respecte impérativement ces règles :
- Sois sobre, sincère et humain. Évite les formules toutes faites ou les clichés ("le temps guérit tout", "il est dans un monde meilleur", "sois fort·e", etc.)
- Ne minimise pas la douleur. Reconnais-la sans en rajouter.
- Propose ta présence, ton écoute, ton soutien concret — pas de grands discours.
- Pour un deuil : ne parle pas de "joie" ou d'"espoir". Reste dans la douceur et la compassion.
- Pour une maladie : ne promets pas la guérison. Envoie de l'énergie et de la présence.
- Pour une séparation : valide l'émotion sans critiquer l'ex-partenaire.
- Pour une période difficile : encourage sans banaliser ("ça va aller" est interdit).`;
  }

  const occasionGuidelines = buildOccasionGuidelines(req);
  if (occasionGuidelines) {
    prompt += `\n\n${occasionGuidelines}`;
  }

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
    const poemLength = req.style_hint === 'Long'
      ? '4 à 5 strophes de 4 vers chacune, avec rimes. Maximum 160 mots.'
      : '1 à 2 strophes de 4 vers, avec rimes si possible. Maximum 60 mots.';
    prompt += `

**Structure :** ${poemLength}
Réponds UNIQUEMENT avec le poème, sans titre ni explications.`;
  } else if (req.format === 'message') {
    const msgLength = req.style_hint === 'Court'
      ? '1 paragraphe court et percutant. Maximum 60 mots.'
      : req.style_hint === 'Long'
      ? '4 à 5 paragraphes riches et personnalisés. Maximum 300 mots.'
      : '2 paragraphes sincères et personnalisés. Maximum 120 mots.';
    prompt += `

**Longueur :** ${msgLength}
Réponds UNIQUEMENT avec le message, sans explications.`;
  } else if (req.format === 'joke') {
    prompt += `

**Longueur :** Court et percutant, maximum 60 mots. Une seule blague bien construite.
Réponds UNIQUEMENT avec le texte, sans explications.`;
  }

  return prompt;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const mistralApiKey = Deno.env.get('MISTRAL_API_KEY');
    if (!mistralApiKey) {
      return new Response(JSON.stringify({ error: 'MISTRAL_API_KEY manquante' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body: GenerateRequest = await req.json();

    if (!body.contact_name || !body.format || !body.tone || !body.relation || !body.occasion) {
      return new Response(JSON.stringify({ error: 'Paramètres manquants' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── Gestion des crédits (uniquement première génération, plan free) ──────
    if (!body.is_regeneration) {
      try {
        const authHeader = req.headers.get('Authorization');
        if (authHeader) {
          const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } },
          );
          const { data: authData } = await supabaseClient.auth.getUser();
          const user = authData?.user;
          if (user) {
            const { data: profile } = await supabaseClient
              .from('profiles')
              .select('plan, credits')
              .eq('id', user.id)
              .single();

            if (profile && profile.plan !== 'premium') {
              if ((profile.credits ?? 0) <= 0) {
                return new Response(JSON.stringify({ error: 'Crédits insuffisants. Parraine des amis ou passe en Premium pour continuer.' }), {
                  status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
              }
              // Déduire 1 crédit
              await supabaseClient
                .from('profiles')
                .update({ credits: (profile.credits ?? 1) - 1 })
                .eq('id', user.id);
            }
          }
        }
      } catch (creditErr) {
        // Ne pas bloquer la génération si la vérification de crédits échoue
        console.error('Credit check error (non-blocking):', creditErr);
      }
    }

    const systemPrompt = buildSystemPrompt(body);

    const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mistralApiKey}`,
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages: [{ role: 'user', content: systemPrompt }],
        max_tokens: 1024,
        temperature: 0.9,
      }),
    });

    if (!mistralResponse.ok) {
      const errText = await mistralResponse.text();
      console.error('Mistral error:', mistralResponse.status, errText);
      return new Response(JSON.stringify({ error: `Erreur Mistral API: ${mistralResponse.status}`, detail: errText }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const mistralData = await mistralResponse.json();
    const raw: string = mistralData.choices?.[0]?.message?.content ?? '';

    // Supprimer le formatage markdown renvoyé par Mistral
    const content = raw
      .replace(/\*\*(.+?)\*\*/g, '$1') // **gras** → gras
      .replace(/\*(.+?)\*/g, '$1')      // *italique* → italique
      .replace(/_{2}(.+?)_{2}/g, '$1')  // __gras__ → gras
      .replace(/_(.+?)_/g, '$1')        // _italique_ → italique
      .replace(/^#+\s+/gm, '')          // ## titres → supprimés
      .trim();

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
