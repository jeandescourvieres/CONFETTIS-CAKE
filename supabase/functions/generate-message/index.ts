import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const MISTRAL_MODEL = 'mistral-small-latest';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type Occasion =
  | 'birthday' | 'nameday' | 'wedding' | 'engagement' | 'birth'
  | 'baptism' | 'communion'
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

type AppLanguage = 'fr' | 'en' | 'de' | 'es' | 'it' | 'pt';

interface GenerateRequest {
  format: 'song' | 'poem' | 'message' | 'joke';
  tone: 'humorous' | 'touching' | 'poetic' | 'playful' | 'professional';
  relation: string;
  contact_name: string;
  age?: number | null;
  memories?: string | null;
  personality_tags?: string[];
  favourite_color?: string | null; // couleur préférée du contact (optionnel)
  occasion: Occasion;
  late_mode?: boolean;
  extras?: OccasionExtras;
  style_hint?: string; // 'Court' | 'Moyen' | 'Long'
  language?: AppLanguage; // langue de génération (défaut: 'fr')
  is_regeneration?: boolean; // true = pas de déduction de crédit
  sender_civilite?: 'M.' | 'Mme' | null; // Civilité de l'expéditeur → accord grammatical
  // Mode spécial : message écrit à la 1ère personne par l'animal
  pet_from_mode?: boolean;
  pet_from_name?: string; // nom de l'animal (ex: "Rex")
  pet_from_type?: string; // type d'animal (ex: "chien", "chat"…)
}

// Noms complets des langues pour le prompt Claude
const LANGUAGE_NAMES: Record<string, string> = {
  fr: 'français',
  en: 'anglais (English)',
  de: 'allemand (Deutsch)',
  es: 'espagnol (Español)',
  it: 'italien (Italiano)',
  pt: 'portugais (Português)',
};

const RELATION_FR: Record<string, string> = {
  best_friend: 'meilleur·e ami·e', friend: 'ami·e', family: 'membre de la famille',
  partner: 'partenaire amoureux·se', colleague: 'collègue', other: 'connaissance',
  // Sous-relations famille
  frère: 'frère', soeur: 'sœur', sœur: 'sœur',
  père: 'père', mere: 'mère', mère: 'mère',
  'grand-père': 'grand-père', 'grand-mere': 'grand-mère', 'grand-mère': 'grand-mère',
  oncle: 'oncle', tante: 'tante',
  cousin: 'cousin', cousine: 'cousine',
  fils: 'fils', fille: 'fille',
  neveu: 'neveu', niece: 'nièce', nièce: 'nièce',
  // Boule de poils
  'chien (animal de compagnie)': 'chien',
  'chat (animal de compagnie)': 'chat',
  'autre (animal de compagnie)': 'animal de compagnie',
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

/**
 * Extrait le prénom depuis un nom stocké au format "NOM Prénom".
 * "DESCOURVIERES Michelle" → "Michelle"
 * "Jean" → "Jean"
 */
function extractFirstName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  // Si le premier mot est tout en majuscules, c'est le nom de famille
  if (parts[0] === parts[0].toUpperCase() && /[A-ZÀÂÄÉÈÊËÎÏÔÙÛÜ]/.test(parts[0])) {
    return parts.slice(1).join(' ');
  }
  return fullName;
}

function buildOccasionContext(req: GenerateRequest): string {
  // Utiliser uniquement le prénom dans les prompts (le nom de famille perturbe l'IA)
  const firstName = extractFirstName(req.contact_name);
  // Si la relation n'est pas dans le dictionnaire, on l'utilise telle quelle (saisie libre)
  const relation = RELATION_FR[req.relation] ?? req.relation;
  const extras = req.extras ?? {};
  const lateMention = req.late_mode
    ? ' (NB : le message est envoyé en retard — intègre une touche légère d\'excuse ou d\'humour)' : '';

  switch (req.occasion) {
    case 'birthday': {
      const isPetBirthday = req.relation.includes('(animal de compagnie)');
      if (isPetBirthday) {
        const animalType = req.relation.split('(')[0].trim(); // 'chien', 'chat', 'autre'
        return `l'anniversaire de ${firstName}, ${animalType} de l'utilisateur.${lateMention}`;
      }
      return `l'anniversaire de ${firstName}${req.age ? ` qui fête ses ${req.age} ans` : ''}. C'est ${relation} de l'utilisateur.${lateMention}`;
    }

    case 'nameday':
      return `la fête (saint prénom) de ${firstName}. C'est ${relation} de l'utilisateur.${lateMention}`;

    case 'wedding':
      return `le mariage${extras.partner1Name ? ` de ${extras.partner1Name}` : ''}${extras.partner2Name ? ` et ${extras.partner2Name}` : ` de ${firstName}`}. C'est ${relation} de l'utilisateur.`;

    case 'engagement':
      return `les fiançailles${extras.partner1Name ? ` de ${extras.partner1Name}` : ''}${extras.partner2Name ? ` et ${extras.partner2Name}` : ` de ${firstName}`}. C'est ${relation} de l'utilisateur.`;

    case 'birth':
      return `la naissance de ${extras.babyName ? `bébé ${extras.babyName}` : 'leur bébé'}${extras.parentNames ? `, enfant de ${extras.parentNames}` : ''}. C'est ${relation} de l'utilisateur.`;

    case 'baptism':
      return `le baptême de ${extras.babyName ? extras.babyName : firstName}. C'est ${relation} de l'utilisateur.`;

    case 'communion':
      return `la communion de ${firstName}. C'est ${relation} de l'utilisateur.`;

    case 'graduation':
      return `la réussite${extras.diplomaLabel ? ` au ${extras.diplomaLabel}` : ' aux examens'} de ${firstName}. C'est ${relation} de l'utilisateur.`;

    case 'promotion':
      return `la promotion professionnelle de ${firstName}${extras.newJobTitle ? ` (nouveau poste : ${extras.newJobTitle})` : ''}. C'est ${relation} de l'utilisateur.`;

    case 'thanks':
      return `remercier ${firstName}${extras.thankReason ? ` pour ${extras.thankReason}` : ''}. C'est ${relation} de l'utilisateur.`;

    case 'newyear':
      return `présenter les vœux du Nouvel An à ${firstName}. C'est ${relation} de l'utilisateur.`;

    case 'christmas':
      return `souhaiter un joyeux Noël à ${firstName}. C'est ${relation} de l'utilisateur.`;

    case 'easter':
      return `souhaiter de joyeuses Pâques à ${firstName}. C'est ${relation} de l'utilisateur.`;

    case 'valentines':
      return `envoyer un message de Saint-Valentin à ${firstName}. C'est ${relation} de l'utilisateur.`;

    case 'mothersday':
      return `souhaiter une bonne fête des Mères à ${firstName}. C'est ${relation} de l'utilisateur.`;

    case 'fathersday':
      return `souhaiter une bonne fête des Pères à ${firstName}. C'est ${relation} de l'utilisateur.`;

    case 'halloween':
      return `envoyer un message d'Halloween à ${firstName}. C'est ${relation} de l'utilisateur.`;

    case 'retirement':
      return `célébrer le départ à la retraite de ${firstName}. C'est ${relation} de l'utilisateur.`;

    case 'support': {
      const supportLabels: Record<string, string> = {
        bereavement: `soutenir ${firstName} face à un deuil ou une perte`,
        illness: `soutenir ${firstName} pendant une maladie ou une hospitalisation`,
        breakup: `réconforter ${firstName} après une séparation ou rupture`,
        hardtime: `soutenir ${firstName} dans une période difficile (stress, burn-out, déprime)`,
        encouragement: `encourager ${firstName} et lui envoyer un message de soutien moral`,
      };
      const supportCtx = extras.supportType ? supportLabels[extras.supportType] : `envoyer un message de soutien à ${firstName}`;
      return `${supportCtx}. C'est ${relation} de l'utilisateur.`;
    }

    case 'custom':
      return `${extras.customOccasionLabel ? extras.customOccasionLabel : `célébrer un événement spécial avec ${firstName}`}. C'est ${relation} de l'utilisateur.`;

    default:
      return `féliciter ${firstName}. C'est ${relation} de l'utilisateur.`;
  }
}

function buildOccasionGuidelines(req: GenerateRequest): string {
  const firstName = extractFirstName(req.contact_name);
  switch (req.occasion) {
    case 'birthday': {
      const isPet = req.relation.includes('(animal de compagnie)');
      if (isPet) {
        const isDog = req.relation.includes('chien');
        const isCat = req.relation.includes('chat');
        if (isDog) {
          return `**Consignes spécifiques anniversaire — Chien 🐶 :**
- Ce message célèbre l'anniversaire d'un chien. Adopte un ton joyeux, drôle et affectueux.
- Adresse-toi directement au chien par son prénom (${firstName}).
- L'expéditeur est le maître/la maîtresse du chien — écris à la première personne du singulier.
- Si des tags de personnalité sont fournis (passions, traits de caractère), intègre-les naturellement dans le texte — ne les liste pas.
- Si des souvenirs ou anecdotes sont mentionnés dans le champ "Souvenirs", tisse-les de façon vivante et amusante.
- Joue sur les thèmes qui font la joie d'un chien : les promenades, les câlins, la gamelle, les jouets, la balle, la fidélité sans faille.
- Évite toute conversion d'âge en "années humaines".
- Termine par une promesse tendre ou une blague affectueuse (ex: "Ce soir, c'est toi qui choisis le coin du canapé !").
- Émojis conseillés : 🐶 🎂 🦴 ❤️ 🎾`;
        } else if (isCat) {
          return `**Consignes spécifiques anniversaire — Chat 🐱 :**
- Ce message célèbre l'anniversaire d'un chat. Adopte un ton élégant, espiègle et légèrement ironique.
- Adresse-toi au chat par son prénom (${firstName}), en le traitant comme une "Sa Majesté" ou un être supérieur qui daigne accepter les hommages.
- L'expéditeur est l'"esclave humain" ou le serviteur dévoué — joue sur cette dynamique avec humour et autodérision.
- Si des tags de personnalité sont fournis, intègre-les naturellement — le chat les possède évidemment depuis toujours et le sait très bien.
- Si des souvenirs ou anecdotes sont mentionnés dans le champ "Souvenirs", tisse-les avec humour et une pointe d'ironie de la part de l'humain.
- Joue sur les thèmes félinement incontournables : la sieste royale, l'indifférence calculée, la chasse aux jouets à 3h du matin, les ronrons mystérieux, le regard de jugement.
- Évite toute conversion d'âge en "années humaines".
- Termine sur une note où l'humain reconnaît humblement sa chance d'être choisi et toléré par ce chat.
- Émojis conseillés : 🐱 👑 🎂 ✨ 😸`;
        } else {
          return `**Consignes spécifiques anniversaire — Animal de compagnie 🐾 :**
- Ce message célèbre l'anniversaire d'un animal de compagnie. Adresse-toi à lui directement par son prénom (${firstName}).
- L'expéditeur est son maître/sa maîtresse — ton tendre et complice.
- Si des souvenirs ou anecdotes sont mentionnés, intègre-les avec chaleur et humour.
- Célèbre ce compagnon unique avec tendresse et joie.
- Émojis conseillés : 🐾 🎂 ❤️ 🎉`;
        }
      }
      return `**Consignes spécifiques anniversaire :**
- Commence par une salutation adaptée à la relation (ex: "Hey frérot !" pour un frère, "Salut mon cœur !" pour un partenaire, "Cher [Prénom]" pour un collègue).
- **OBLIGATOIRE — Mention de l'âge :** ${req.age ? `${firstName} fête ses ${req.age} ans. Tu DOIS mentionner ce chiffre de façon naturelle dans le message (ex: "pour tes ${req.age} ans", "en ce beau jour de tes ${req.age} printemps", "tes ${req.age} ans méritent d'être célébrés", etc.). Ne l'omets sous aucun prétexte.` : `L'âge n'est pas connu — ne l'invente pas et ne mets pas de chiffre.`}
- Si des détails personnels sont fournis (personnalité, souvenirs), intègre-les naturellement dans le texte — ne les liste pas.
- **INTERDIT : n'invente AUCUN détail personnel** (voyage, hobby, souvenir, anecdote) qui n'est pas explicitement fourni. Si aucune info personnelle n'est disponible, génère un message chaleureux et sincère mais générique.
- Ajoute une suggestion d'activité ou de cadeau en fin de message si pertinent et si le ton s'y prête.`;
    }

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

    case 'engagement':
      return `**Consignes spécifiques fiançailles :**
- Félicite le couple pour cette étape magnifique dans leur histoire d'amour.
- Souligne la beauté de leur décision de s'engager l'un envers l'autre.
- Si des détails sur le couple sont dans les souvenirs, intègre-les avec chaleur.
- Exprime enthousiasme et joie pour cette belle nouvelle.
- Termine sur un vœu romantique et chaleureux pour la suite (fiançailles, puis mariage). 💎`;

    case 'birth':
      return `**Consignes spécifiques naissance :**
- Félicite les parents avec chaleur et émotion ("Quel bonheur de savoir que [bébé] a rejoint votre vie !").
- Exprime des vœux tendres pour l'enfant et des encouragements pour les parents.
- Si une cagnotte ou un cadeau est mentionné dans les souvenirs, intègre-le naturellement. 👶`;

    case 'baptism':
      return `**Consignes spécifiques baptême :**
- Adopte un registre doux, spirituel et bienveillant. Ce message célèbre un moment solennel et intime.
- Félicite la famille pour ce beau jour de grâce et de lumière.
- Exprime des vœux tendres pour l'enfant : qu'il/elle grandisse entouré·e d'amour et de bienveillance.
- Si le prénom du bébé est connu, adresse-lui un vœu direct ("Bienvenue dans cette grande famille, [prénom]").
- Termine par une note de paix et de lumière, sans tomber dans le cliché religieux formel.
- **INTERDIT absolument** : tout humour, toute légèreté déplacée, tout ton festif bruyant.
- Émojis conseillés : 🕊️ 🌿 💛 ✨`;

    case 'communion':
      return `**Consignes spécifiques communion :**
- Adopte un registre recueilli, bienveillant et solennel. Ce message marque un moment important dans la vie de l'enfant.
- Félicite l'enfant pour cette étape spirituelle avec sincérité et chaleur.
- Exprime de la fierté et de la tendresse pour ce jour particulier ("Tu grandis si bien, [prénom]").
- Adresse un vœu pour l'avenir : sagesse, bonheur, et force dans les épreuves.
- Si des souvenirs ou détails sont fournis, intègre-les avec délicatesse.
- **INTERDIT absolument** : tout humour, toute légèreté déplacée, tout ton festif bruyant.
- Émojis conseillés : ✝️ 🌿 💛 🕊️`;

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

const PET_FROM_PERSONALITIES: Record<string, string> = {
  chien: 'un chien enthousiaste, joyeux, loyal et un peu maladroit — il adore les câlins, les promenades et sa gamelle',
  chat: 'un chat hautain et mystérieux qui daigne accorder son attention — il se croit supérieur mais aime secrètement son humain',
  lapin: 'un lapin doux, câlin et un peu timide — il aime les câlins et les légumes',
  perroquet: 'un perroquet bavard, expressif et curieux — il répète les mots, imite les sons et adore attirer l\'attention',
  hamster: 'un hamster actif et enjoué — il court dans sa roue, stocke des graines et fait des cabrioles',
  poisson: 'un poisson sage et serein qui observe tout depuis son bocal avec une sagesse silencieuse',
  cheval: 'un cheval fier, majestueux et noble — il galope librement et est d\'une loyauté sans faille',
};

function buildPetFromPrompt(req: GenerateRequest): string {
  const petName = req.pet_from_name ?? 'l\'animal';
  const petType = req.pet_from_type ?? 'autre';
  const humanName = extractFirstName(req.contact_name);
  const targetLang = req.language ?? 'fr';
  const langName = LANGUAGE_NAMES[targetLang] ?? 'français';
  const personality = PET_FROM_PERSONALITIES[petType] ?? 'un animal de compagnie attachant';

  const occasionLabel: Record<string, string> = {
    birthday: `Joyeux anniversaire à ${humanName} !`,
    nameday: `Bonne fête à ${humanName} !`,
    christmas: `Joyeux Noël à ${humanName} !`,
    newyear: `Bonne année à ${humanName} !`,
    thanks: `Remercier ${humanName} avec sa propre façon d'animal`,
    custom: `Envoyer un bonjour spontané et affectueux à ${humanName}`,
  };
  const occasionContext = occasionLabel[req.occasion] ?? `Féliciter ${humanName}`;

  let prompt = `Tu es ${petName}, ${personality}.

Tu vas écrire un message à la première personne exactement comme si tu étais cet animal qui s'exprime.
Adresse-toi directement à ${humanName}.
**LANGUE DE GÉNÉRATION OBLIGATOIRE :** Génère le message UNIQUEMENT en ${langName}.
**Occasion :** ${occasionContext}

**Consignes strictes :**
- Écris ENTIÈREMENT à la première personne, comme si tu étais vraiment ${petName} (${petType})
- Adopte le vocabulaire, les tics et la personnalité de ta nature d'animal (ex : "Wouf !" pour un chien, des "Miaou..." condescendants pour un chat, des répétitions pour un perroquet, une sagesse contemplative pour un poisson)
- Rends le message hilarant, attendrissant et totalement inattendu — l'objectif est de faire sourire ou pleurer de tendresse
- Si des traits de caractère sont fournis, intègre-les naturellement dans le texte
- Termine en signant du nom de l'animal suivi d'une patte 🐾 (ex : "Rex 🐾")
- **INTERDIT :** ne brise jamais le 4e mur, ne révèle pas que c'est un humain qui écrit, ne dis pas "comme si j'étais un animal"

**Longueur :** 2 à 4 phrases courtes et percutantes. Maximum 80 mots.
Réponds UNIQUEMENT avec le message, sans explications ni titre.`;

  if (req.personality_tags && req.personality_tags.length > 0) {
    prompt += `\n**Traits de caractère de ${petName} :** ${req.personality_tags.join(', ')}`;
  }

  return prompt;
}

function buildSystemPrompt(req: GenerateRequest): string {
  // Mode spécial : message écrit à la 1ère personne par l'animal
  if (req.pet_from_mode) {
    return buildPetFromPrompt(req);
  }

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

  if (req.sender_civilite) {
    const genre = req.sender_civilite === 'M.' ? 'masculin' : 'féminin';
    prompt += `\n**Genre de l'expéditeur :** ${req.sender_civilite} — accorde le message au genre ${genre} pour l'expéditeur (ex : "je suis content" vs "je suis contente", "heureux" vs "heureuse", etc.).`;
  }

  prompt += `\n**Formule de clôture :** Termine toujours le message par une formule chaleureuse et sincère adaptée au ton (ex: "Je t'embrasse", "Avec toute mon affection", "Bien à toi", "Plein de bisous"...). Ne mets pas de signature ni de prénom.`;

  prompt += `\n**RÈGLE ABSOLUE — Anti-hallucination :** N'invente jamais de détails personnels (voyages, destinations, hobbies, souvenirs, anecdotes, lieux, événements passés) qui ne sont pas explicitement fournis dans le contexte. Si aucune information personnelle n'est disponible, génère un message chaleureux et sincère mais entièrement générique.`;

  // ── Règle de ton obligatoire par occasion ─────────────────────────────────
  const OCCASION_TONE_RULES: Partial<Record<Occasion, string>> = {
    birthday:    'Joyeux, festif, chaleureux',
    nameday:     'Chaleureux, bienveillant',
    birth:       'Émerveillé, tendre, chaleureux',
    baptism:     'Doux, spirituel, bienveillant',
    communion:   'Recueilli, bienveillant, solennel',
    engagement:  'Romantique, joyeux, chaleureux',
    wedding:     'Romantique, solennel, émouvant',
    graduation:  'Fier, encourageant, joyeux',
    promotion:   'Fier, encourageant, joyeux',
    retirement:  'Chaleureux, nostalgique, joyeux',
    newyear:     'Festif, optimiste, chaleureux',
    christmas:   'Chaleureux, magique, bienveillant',
    easter:      'Joyeux, printanier, chaleureux',
    valentines:  'Romantique, tendre, passionné',
    mothersday:  'Tendre, émouvant, reconnaissant',
    fathersday:  'Chaleureux, complice, reconnaissant',
    halloween:   'Décalé, amusant, mystérieux',
  };
  const SOLEMN_OCCASIONS: Occasion[] = ['baptism', 'communion'];
  const SUPPORT_HUMOR_BANNED: Array<string> = ['bereavement', 'illness', 'breakup', 'hardtime'];

  const toneRule = OCCASION_TONE_RULES[req.occasion];
  if (toneRule) {
    prompt += `\n**RÈGLE ABSOLUE — Registre de l'occasion :** Le ton de ce message DOIT être : ${toneRule}. Adapte impérativement le registre à cette occasion, même si un style d'écriture différent a été sélectionné.`;
  }

  // Interdiction d'humour pour les occasions solennelles/sensibles
  const isSolemnOccasion = SOLEMN_OCCASIONS.includes(req.occasion);
  const isSupportHumorBanned = req.occasion === 'support' && req.extras?.supportType && SUPPORT_HUMOR_BANNED.includes(req.extras.supportType);
  if (isSolemnOccasion || isSupportHumorBanned) {
    prompt += `\n**INTERDIT ABSOLU :** Le ton humoristique, décalé ou festif bruyant est strictement interdit pour cette occasion. Même si l'utilisateur a sélectionné un style léger, tu dois imposer un registre ${isSolemnOccasion ? 'doux, solennel et bienveillant' : 'sobre, doux et compatissant'}.`;
  }

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

  if (req.relation === 'other') {
    prompt += `
**RELATION — Connaissance :** Le destinataire est une simple connaissance (pas un ami proche).
- Ton poli, neutre à légèrement chaleureux — ni trop familier, ni trop froid
- Message court : 1 à 2 phrases maximum
- Aucune référence personnelle ou intime
- Pas d'enthousiasme exagéré
- Emojis légers uniquement si vraiment adaptés
- Le message doit sembler naturellement humain, varié à chaque génération`;
  }

  const occasionGuidelines = buildOccasionGuidelines(req);
  if (occasionGuidelines) {
    prompt += `\n\n${occasionGuidelines}`;
  }

  if (req.personality_tags && req.personality_tags.length > 0) {
    prompt += `\n**Personnalité du destinataire :** ${req.personality_tags.join(', ')}`;
  }

  if (req.favourite_color && req.favourite_color.trim()) {
    prompt += `\n**Couleur préférée du destinataire :** ${req.favourite_color.trim()} — tu peux l'évoquer subtilement si c'est naturel dans le contexte.`;
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
        temperature: 0.72,
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
