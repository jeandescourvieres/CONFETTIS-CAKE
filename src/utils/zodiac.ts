// ═══════════════════════════════════════════════════════════════════
//  Confettis & Cake — Utilitaires Zodiaque
// ═══════════════════════════════════════════════════════════════════

import type { Contact } from '../types/models';

export interface ZodiacSign {
  name: string;
  emoji: string;
  dateRange: string;      // ex: "21 mars – 19 avril"
  element: string;        // Feu | Terre | Air | Eau
  elementEmoji: string;
  trait: string;          // description courte (fiche contact)
  description: string;    // description longue (écran saison + fiche contact)
  keywords: string[];     // mots-clés de personnalité
  strengths: string;      // points forts
  inRelationship: string; // comment il·elle aime
}

const SIGNS: ZodiacSign[] = [
  {
    name: 'Bélier', emoji: '♈', dateRange: '21 mars – 19 avril',
    element: 'Feu', elementEmoji: '🔥',
    trait: 'Courageux, passionné et spontané.',
    description: 'Fonceur·se et plein·e d\'énergie, le Bélier fonce tête baissée là où les autres hésitent. Enthousiaste et courageux·se, il·elle entraîne tout le monde dans ses aventures avec une générosité naturelle. Sa franchise peut parfois surprendre, mais c\'est avant tout sa façon d\'aimer sans détour.',
    keywords: ['Courageux', 'Spontané', 'Énergique', 'Direct', 'Passionné'],
    strengths: 'Leadership naturel, énergie débordante, capacité à relever n\'importe quel défi avec enthousiasme.',
    inRelationship: 'Aime avec fougue et intensité. Attentionné·e à sa façon, il·elle exprime son affection par des actes plutôt que des mots. Loyal·e et protecteur·rice envers ceux qu\'il·elle aime.',
  },
  {
    name: 'Taureau', emoji: '♉', dateRange: '20 avril – 20 mai',
    element: 'Terre', elementEmoji: '🌍',
    trait: 'Fidèle, sensuel et persévérant.',
    description: 'Solide comme un roc et doux·ce comme du velours, le Taureau est l\'ami·e sur qui on peut compter en toutes circonstances. Fidèle, sensible et attaché·e aux plaisirs simples de la vie, il·elle sait créer autour de lui·elle une atmosphère chaleureuse et réconfortante.',
    keywords: ['Fidèle', 'Patient', 'Sensible', 'Fiable', 'Gourmand'],
    strengths: 'Fiabilité absolue, sens du beau et du confort, patience infinie, ancrage et stabilité dans la durée.',
    inRelationship: 'Aime profondément et durablement. Discret·ète dans ses élans, mais d\'une loyauté à toute épreuve. Exprime son amour par des gestes concrets, des petites attentions et une présence constante.',
  },
  {
    name: 'Gémeaux', emoji: '♊', dateRange: '21 mai – 20 juin',
    element: 'Air', elementEmoji: '💨',
    trait: 'Curieux, adaptable et communicatif.',
    description: 'Vif·ve d\'esprit et toujours en mouvement, les Gémeaux adorent les échanges, les idées nouvelles et les conversations qui s\'envolent. Curieux·se de tout, il·elle passe d\'un sujet à l\'autre avec une agilité déconcertante et une légèreté communicative.',
    keywords: ['Curieux', 'Adaptable', 'Sociable', 'Créatif', 'Vivant'],
    strengths: 'Intelligence vive, communication brillante, adaptabilité en toutes circonstances, humour et légèreté naturels.',
    inRelationship: 'Stimulant·e et plein·e de surprises. Aime partager, débattre, rigoler. Il·elle garde une relation vivante et ne laisse jamais la routine s\'installer. Sa curiosité pour l\'autre est un vrai cadeau.',
  },
  {
    name: 'Cancer', emoji: '♋', dateRange: '21 juin – 22 juillet',
    element: 'Eau', elementEmoji: '💧',
    trait: 'Protecteur, émotif et intuitif.',
    description: 'Profondément attaché·e à ses proches, le Cancer est le·la gardien·ne du foyer et de la mémoire familiale. D\'une grande sensibilité, il·elle ressent les émotions avec intensité et offre une tendresse sans limites à ceux qui ont la chance d\'entrer dans son cercle intime.',
    keywords: ['Protecteur', 'Intuitif', 'Tendre', 'Mémoriel', 'Empathique'],
    strengths: 'Empathie profonde, mémoire du cœur, sens du foyer et du lien, générosité émotionnelle sans limite.',
    inRelationship: 'Aime de façon totale et inconditionnelle. Il·elle retient chaque détail important pour toi, anticipe tes besoins et crée un cocon de sécurité unique. Son attachement est sa plus belle qualité.',
  },
  {
    name: 'Lion', emoji: '♌', dateRange: '23 juillet – 22 août',
    element: 'Feu', elementEmoji: '🔥',
    trait: 'Charismatique, généreux et créatif.',
    description: 'Chaleureux·se, généreux·se et naturellement charismatique, le Lion rayonne où qu\'il·elle aille. Il·elle aime profondément et avec panache, prenant soin de ses proches avec une loyauté absolue. Son enthousiasme et sa joie de vivre sont tout simplement contagieux.',
    keywords: ['Charismatique', 'Généreux', 'Loyal', 'Créatif', 'Rayonnant'],
    strengths: 'Charisme naturel, générosité sans calcul, créativité, capacité à fédérer et à rendre chaque moment mémorable.',
    inRelationship: 'Aime avec grandeur et loyauté. Il·elle met ses proches sur un piédestal et ne lésine pas sur les gestes flamboyants. Fier·ière de ceux qu\'il·elle aime, il·elle les défend avec une ardeur sans failles.',
  },
  {
    name: 'Vierge', emoji: '♍', dateRange: '23 août – 22 septembre',
    element: 'Terre', elementEmoji: '🌍',
    trait: 'Attentionné, minutieux et serviable.',
    description: 'Attentionné·e et méticuleux·se, la Vierge a le don de remarquer ce que les autres ne voient pas. Sous des dehors réservés se cache un·e ami·e d\'une loyauté exemplaire, toujours prêt·e à rendre service avec discrétion et efficacité.',
    keywords: ['Attentionné', 'Discret', 'Fiable', 'Analytique', 'Serviable'],
    strengths: 'Sens du détail exceptionnel, fiabilité totale, pragmatisme, capacité à trouver des solutions là où les autres voient des problèmes.',
    inRelationship: 'Aime en faisant. Ses actes de service sont sa langue d\'amour : il·elle règle les problèmes avant qu\'on les remarque, retient chaque préférence, et veille silencieusement sur ceux qui lui sont chers.',
  },
  {
    name: 'Balance', emoji: '♎', dateRange: '23 septembre – 22 octobre',
    element: 'Air', elementEmoji: '💨',
    trait: 'Diplomate, charmant et équitable.',
    description: 'Diplomate dans l\'âme, la Balance déteste les conflits et cherche toujours le juste milieu. Charmant·e et attentionné·e, il·elle met tout le monde à l\'aise avec une grâce naturelle et un sens inné de l\'harmonie dans les relations.',
    keywords: ['Diplomate', 'Charmant', 'Équitable', 'Élégant', 'Pacifique'],
    strengths: 'Sens de la justice, charme naturel, capacité à réconcilier, goût prononcé pour la beauté et l\'harmonie.',
    inRelationship: 'Aime dans l\'équilibre et la douceur. Il·elle s\'assure que tout le monde se sente bien et fait de chaque rencontre un moment agréable. Sa quête d\'harmonie rend les relations avec lui·elle apaisantes.',
  },
  {
    name: 'Scorpion', emoji: '♏', dateRange: '23 octobre – 21 novembre',
    element: 'Eau', elementEmoji: '💧',
    trait: 'Intense, loyal et perspicace.',
    description: 'Intense et passionné·e, le Scorpion vit tout avec une profondeur rare. Loyal·e jusqu\'au bout, il·elle s\'investit entièrement dans ses relations et fait preuve d\'une perspicacité impressionnante. Quand il·elle aime, c\'est pour toujours.',
    keywords: ['Intense', 'Loyal', 'Perspicace', 'Passionné', 'Profond'],
    strengths: 'Loyauté absolue, intuition redoutable, capacité à aller au fond des choses, résilience face à l\'adversité.',
    inRelationship: 'Aime avec une intensité rare, tout ou rien. Il·elle lit les émotions à livre ouvert, sent instinctivement quand quelque chose ne va pas, et offre une fidélité que peu de signes peuvent égaler.',
  },
  {
    name: 'Sagittaire', emoji: '♐', dateRange: '22 novembre – 21 décembre',
    element: 'Feu', elementEmoji: '🔥',
    trait: 'Aventurier, optimiste et philosophe.',
    description: 'Optimiste incurable et grand·e aventurier·ère, le Sagittaire voit la vie comme un terrain de jeu infini. Franc·che et enthousiaste, il·elle insuffle une énergie positive autour de lui·elle et entraîne ses proches vers des horizons toujours plus vastes.',
    keywords: ['Aventurier', 'Optimiste', 'Libre', 'Généreux', 'Philosophe'],
    strengths: 'Enthousiasme contagieux, ouverture d\'esprit, générosité naturelle, capacité à trouver le positif en toute situation.',
    inRelationship: 'Aime librement et joyeusement. Il·elle apporte une bonne humeur communicative, des idées folles et une vision du monde qui donne envie de tout quitter pour l\'aventure. Son honnêteté est rafraîchissante.',
  },
  {
    name: 'Capricorne', emoji: '♑', dateRange: '22 décembre – 19 janvier',
    element: 'Terre', elementEmoji: '🌍',
    trait: 'Ambitieux, fiable et persévérant.',
    description: 'Déterminé·e et fiable, le Capricorne construit sa vie avec patience et persévérance. Derrière sa réserve naturelle se cache une chaleur sincère et un sens de l\'humour bien réel. Ses proches savent qu\'ils peuvent compter sur lui·elle dans toutes les situations.',
    keywords: ['Fiable', 'Ambitieux', 'Patient', 'Sérieux', 'Discret'],
    strengths: 'Fiabilité à toute épreuve, sens des responsabilités, détermination, capacité à tenir ses promesses sur la durée.',
    inRelationship: 'Aime discrètement mais profondément. Il·elle ne fait pas de grandes déclarations, mais ses actes parlent pour lui·elle : toujours présent·e quand ça compte vraiment, d\'une constance rassurante.',
  },
  {
    name: 'Verseau', emoji: '♒', dateRange: '20 janvier – 18 février',
    element: 'Air', elementEmoji: '💨',
    trait: 'Idéaliste, original et bienveillant.',
    description: 'Original·e et visionnaire, le Verseau pense souvent en avance sur son époque. Profondément humain·e et altruiste, il·elle s\'engage avec sincérité pour ceux qui l\'entourent et apporte toujours un regard frais et décalé qui fait du bien.',
    keywords: ['Original', 'Idéaliste', 'Altruiste', 'Visionnaire', 'Indépendant'],
    strengths: 'Pensée novatrice, sens de l\'amitié profonde, humanisme sincère, capacité à voir le monde autrement.',
    inRelationship: 'Aime de manière unique et sincère. Il·elle considère ses proches comme des égaux, ne juge jamais, et offre une amitié ou un amour fondé sur le respect mutuel et la liberté partagée.',
  },
  {
    name: 'Poissons', emoji: '♓', dateRange: '19 février – 20 mars',
    element: 'Eau', elementEmoji: '💧',
    trait: 'Intuitif, sensible et rêveur.',
    description: 'Doux·ce, intuitif·ve et empathique, les Poissons captent les émotions des autres avec une sensibilité rare. Artiste dans l\'âme, il·elle apporte une touche de poésie et de rêve dans la vie de ses proches, et offre une écoute incomparable.',
    keywords: ['Intuitif', 'Empathique', 'Rêveur', 'Artistique', 'Doux'],
    strengths: 'Empathie hors du commun, créativité, écoute profonde, capacité à ressentir et comprendre les émotions des autres.',
    inRelationship: 'Aime avec une douceur et une profondeur que peu de signes atteignent. Il·elle ressent tes émotions avant même que tu les exprimes, et offre une présence apaisante, poétique et inconditionnelle.',
  },
];

/** Retourne le signe zodiacal pour une date de naissance "YYYY-MM-DD" ou "0000-MM-DD". */
export function getZodiacSign(birthday: string): ZodiacSign | null {
  const parts = birthday.replace(/^0000-/, '2000-').split('-');
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  if (isNaN(m) || isNaN(d)) return null;
  const md = m * 100 + d;
  return findByMD(md);
}

/** Retourne le signe zodiacal actif aujourd'hui. */
export function getCurrentZodiacSign(): ZodiacSign {
  const now = new Date();
  const md = (now.getMonth() + 1) * 100 + now.getDate();
  return findByMD(md) ?? SIGNS[9]; // Capricorne par défaut
}

/** Filtre les contacts dont le signe est actuellement en saison. Exclut les animaux. */
export function getContactsInZodiacSeason(contacts: Contact[]): Contact[] {
  const current = getCurrentZodiacSign();
  return contacts.filter((c) => {
    if (c.relation === 'pet') return false;
    if (!c.birthday) return false;
    const sign = getZodiacSign(c.birthday);
    return sign?.name === current.name;
  });
}

// ── Compatibilité zodiacale ──────────────────────────────────────────────────

export interface ZodiacCompatibility {
  score: 1 | 2 | 3 | 4 | 5;
  label: string;
  emoji: string;
  description: string;
}

type ElementKey = 'fire' | 'earth' | 'air' | 'water';

const SIGN_ELEMENT: ElementKey[] = [
  'fire',  // 0  Bélier
  'earth', // 1  Taureau
  'air',   // 2  Gémeaux
  'water', // 3  Cancer
  'fire',  // 4  Lion
  'earth', // 5  Vierge
  'air',   // 6  Balance
  'water', // 7  Scorpion
  'fire',  // 8  Sagittaire
  'earth', // 9  Capricorne
  'air',   // 10 Verseau
  'water', // 11 Poissons
];

// Descriptions par combinaison d'éléments (clé : "el1-el2" avec el1 <= el2 alphabétiquement)
const ELEMENT_COMPAT: Record<string, { score: 1|2|3|4|5; label: string; emoji: string; description: string }> = {
  'fire-fire': {
    score: 5, label: 'Flamme commune', emoji: '🔥',
    description: 'Même énergie, même passion, même envie de brûler la vie par les deux bouts. Vous vous comprenez instinctivement, sans avoir besoin de vous expliquer — l\'élan de l\'un emporte l\'autre naturellement. Vous vous poussez mutuellement à dépasser vos limites, à oser plus. Attention à l\'emballement quand deux feux se croisent — mais quelle chaleur, quelle intensité quand vous êtes ensemble !',
  },
  'earth-earth': {
    score: 5, label: 'Socle commun', emoji: '🌿',
    description: 'Fiabilité, sens du concret, loyauté à toute épreuve — vous partagez les mêmes valeurs fondamentales sans même avoir besoin de les formuler. Ici, pas de faux-semblants ni de grandes promesses : juste des actes, de la constance et une confiance qui se construit dans la durée. Une relation solide comme la roche, bâtie pour résister à tous les vents.',
  },
  'air-air': {
    score: 5, label: 'Complicité intellectuelle', emoji: '💨',
    description: 'Deux esprits vifs, curieux, toujours en mouvement — les conversations ne finissent jamais et c\'est tant mieux ! Vous vous stimulez mutuellement, rebondissez sur les idées de l\'autre, riez des mêmes absurdités. Humour, légèreté, créativité… Une relation pétillante où l\'ennui n\'a tout simplement pas sa place.',
  },
  'water-water': {
    score: 5, label: 'Âmes sœurs', emoji: '💧',
    description: 'Une connexion émotionnelle d\'une rare profondeur — vous n\'avez parfois pas besoin de mots pour vous comprendre. Vous ressentez les humeurs de l\'autre avant même qu\'elles s\'expriment, vous portez les peines ensemble et célébrez les joies avec une intensité décuplée. Ensemble, vous créez un lien d\'une richesse intérieure que peu de relations atteignent.',
  },
  'air-fire': {
    score: 4, label: 'Belle alchimie', emoji: '✨',
    description: 'L\'Air attise le Feu, et le Feu donne au vent une direction. Vous vous dynamisez mutuellement d\'une façon presque magique : l\'un apporte les idées, l\'enthousiasme et la légèreté, l\'autre l\'élan, la chaleur et le courage d\'agir. Ensemble, vous faites naître des projets que ni l\'un ni l\'autre n\'aurait osé seul. Une combinaison créative, vivante et enthousiasmante.',
  },
  'earth-water': {
    score: 4, label: 'Complémentarité naturelle', emoji: '🌱',
    description: 'L\'Eau nourrit la Terre et la Terre donne à l\'Eau un endroit où s\'épanouir. Une complicité apaisante, presque évidente : l\'un ancre, stabilise et protège ; l\'autre ressent, intuitionne et enrichit. Vous vous complétez avec une naturel désarmant. Une relation sécurisante, profondément humaine, construite sur la confiance et la douceur.',
  },
  'earth-fire': {
    score: 2, label: 'Contraste stimulant', emoji: '⚡',
    description: 'Deux rythmes qui s\'opposent : l\'un vit dans l\'instant, fonce et s\'emballe ; l\'autre construit dans la durée, pèse et ancre. Des frictions sont inévitables — mais c\'est souvent dans ce frottement que naît quelque chose d\'inattendu. Si chacun accepte de s\'ouvrir au monde de l\'autre, ce contraste peut devenir une vraie source d\'équilibre et de croissance mutuelle.',
  },
  'air-water': {
    score: 2, label: 'Mondes parallèles', emoji: '🌊',
    description: 'L\'un pense, analyse et verbalise ; l\'autre ressent, intuitionne et plonge dans les profondeurs. Ces deux langages se comprennent difficilement au premier abord — et les malentendus peuvent s\'accumuler. Mais avec de la curiosité sincère et une vraie volonté de s\'apprivoiser, cette relation peut devenir une source d\'enrichissement profond et inattendu pour les deux.',
  },
  'fire-water': {
    score: 3, label: 'Attraction magnétique', emoji: '🌀',
    description: 'Le Feu et l\'Eau : deux forces que tout oppose, et pourtant… La fascination est immédiate, presque inexplicable. L\'un brûle, l\'autre ressent — ensemble, vous créez de la vapeur ou vous vous éteignez. Quand la bienveillance l\'emporte, cette relation devient l\'une des plus intenses et des plus transformatrices qui soit. Chacun apprend de l\'autre ce qu\'il ne saurait trouver en lui-même.',
  },
  'air-earth': {
    score: 3, label: 'Contraste enrichissant', emoji: '🍃',
    description: 'L\'un vit dans les idées, les projets, l\'abstraction ; l\'autre dans le concret, le tangible, le durable. Vous regardez le monde avec des yeux très différents — et c\'est précisément ce qui rend cette relation intéressante. Si chacun accepte le rythme de l\'autre plutôt que de le brusquer, ce contraste peut devenir une richesse : l\'un ancre les rêves de l\'autre, l\'autre élève la vision du premier.',
  },
};

/** Retourne la compatibilité zodiacale entre deux signes (par leur index dans SIGNS). */
export function getZodiacCompatibility(signA: ZodiacSign, signB: ZodiacSign): ZodiacCompatibility {
  const indexA = SIGNS.findIndex((s) => s.name === signA.name);
  const indexB = SIGNS.findIndex((s) => s.name === signB.name);

  // Même signe
  if (indexA === indexB) {
    return {
      score: 3, label: 'Miroir parfait', emoji: '🪞',
      description: `Deux ${signA.name}s ensemble — vous vous comprenez comme personne d'autre, parfois trop bien ! Cette ressemblance crée une complicité immédiate, mais peut aussi révéler vos points de friction communs. Qui de vous deux concède en premier ? 😄`,
    };
  }

  // Signes opposés (6 positions d'écart) — attraction magnétique particulière
  if (Math.abs(indexA - indexB) === 6) {
    return {
      score: 4, label: 'Opposés complémentaires', emoji: '☯️',
      description: `${signA.name} et ${signB.name} sont les signes opposés du zodiaque. Vous représentez deux faces d\'une même pièce. Cette polarité crée une attraction puissante et une complémentarité rare — chacun possède ce que l\'autre cherche.`,
    };
  }

  const elA = SIGN_ELEMENT[indexA];
  const elB = SIGN_ELEMENT[indexB];
  const key = [elA, elB].sort().join('-');
  return ELEMENT_COMPAT[key] ?? {
    score: 3, label: 'Relation nuancée', emoji: '🌗',
    description: 'Une relation avec ses hauts et ses bas, mais toujours riche en découvertes mutuelles.',
  };
}

// ═══════════════════════════════════════════════════════════════════
//  Zodiaque Chinois
// ═══════════════════════════════════════════════════════════════════

export interface ChineseZodiacSign {
  name: string;
  emoji: string;
  element: string;       // Bois | Feu | Terre | Métal | Eau
  elementEmoji: string;
  virtues: string;
  traits: string[];
  description: string;
}

const CHINESE_SIGNS: ChineseZodiacSign[] = [
  {
    name: 'Rat', emoji: '🐭',
    element: 'Eau', elementEmoji: '💧',
    virtues: 'Intelligence, adaptabilité, charme',
    traits: ['Malin', 'Sociable', 'Charmeur', 'Ambitieux', 'Créatif'],
    description: 'Le Rat est l\'un des signes les plus fins et les plus adaptables du zodiaque chinois. Observateur hors pair, il sait saisir les opportunités là où les autres ne voient rien. Sociable et séduisant, il crée des liens forts et durables. Sa vivacité d\'esprit lui permet de trouver des solutions là où les autres abandonnent.',
  },
  {
    name: 'Bœuf', emoji: '🐂',
    element: 'Terre', elementEmoji: '🌍',
    virtues: 'Persévérance, fiabilité, force intérieure',
    traits: ['Travailleur', 'Fiable', 'Patient', 'Déterminé', 'Honnête'],
    description: 'Le Bœuf incarne la ténacité et la droiture. Travailleur infatigable, il avance lentement mais sûrement vers ses objectifs. D\'une honnêteté irréprochable, il inspire confiance à tous ceux qui l\'entourent. Sa stabilité est un roc sur lequel ses proches peuvent s\'appuyer en toutes circonstances.',
  },
  {
    name: 'Tigre', emoji: '🐅',
    element: 'Bois', elementEmoji: '🌿',
    virtues: 'Courage, leadership, magnétisme',
    traits: ['Courageux', 'Charismatique', 'Généreux', 'Impulsif', 'Audacieux'],
    description: 'Le Tigre est né pour briller. Charismatique et généreux, il attire naturellement les regards et inspire ceux qui l\'entourent. Courageux jusqu\'à la témérité, il n\'hésite jamais à se battre pour ce en quoi il croit. Sa vitalité et son enthousiasme sont communicatifs — difficile de rester indifférent face à un Tigre.',
  },
  {
    name: 'Lapin', emoji: '🐰',
    element: 'Bois', elementEmoji: '🌿',
    virtues: 'Diplomatie, élégance, intuition',
    traits: ['Délicat', 'Empathique', 'Diplomatique', 'Élégant', 'Intuitif'],
    description: 'Le Lapin est le symbole de la grâce et de la paix. Doté d\'une sensibilité rare et d\'un tact naturel, il sait naviguer dans les situations délicates avec une élégance remarquable. Empathique et attentionné, il crée des atmosphères harmonieuses et chaleureuses où chacun se sent compris.',
  },
  {
    name: 'Dragon', emoji: '🐉',
    element: 'Terre', elementEmoji: '🌍',
    virtues: 'Magnétisme, vitalité, ambition',
    traits: ['Magnétique', 'Passionné', 'Visionnaire', 'Énergique', 'Fier'],
    description: 'Le Dragon est le signe le plus puissant et le plus fascinant du zodiaque chinois. Doté d\'un magnétisme extraordinaire, il illumine chaque pièce qu\'il traverse. Visionnaire et passionné, il voit grand et entraîne les autres dans ses rêves ambitieux. Sa vitalité et son éclat naturel en font un être à part, inoubliable.',
  },
  {
    name: 'Serpent', emoji: '🐍',
    element: 'Feu', elementEmoji: '🔥',
    virtues: 'Sagesse, intuition, élégance profonde',
    traits: ['Sage', 'Intuitif', 'Élégant', 'Mystérieux', 'Philosophe'],
    description: 'Le Serpent est le penseur du zodiaque chinois. D\'une intelligence subtile et d\'une intuition remarquable, il perçoit ce que les autres ne voient pas. Discret en apparence mais profondément réfléchi, il n\'agit qu\'après mûre réflexion. Sa sagesse et son élégance naturelle font de lui un être fascinant, aux ressources insoupçonnées.',
  },
  {
    name: 'Cheval', emoji: '🐴',
    element: 'Feu', elementEmoji: '🔥',
    virtues: 'Liberté, enthousiasme, loyauté',
    traits: ['Libre', 'Enthousiaste', 'Loyal', 'Aventurier', 'Spontané'],
    description: 'Le Cheval vit pour la liberté et l\'aventure. Enthousiaste et spontané, il fonce dans la vie avec une joie de vivre communicative. Loyal envers ceux qu\'il aime, il est un ami sûr et un partenaire de vie stimulant. Son énergie débordante et son optimisme naturel font de lui quelqu\'un dont la présence éclaire les journées.',
  },
  {
    name: 'Chèvre', emoji: '🐐',
    element: 'Terre', elementEmoji: '🌍',
    virtues: 'Créativité, générosité, sensibilité artistique',
    traits: ['Créatif', 'Doux', 'Généreux', 'Sensible', 'Artistique'],
    description: 'La Chèvre est l\'artiste et le rêveur du zodiaque chinois. Dotée d\'une sensibilité artistique remarquable, elle voit la beauté là où les autres passent sans la remarquer. Douce et généreuse, elle offre sans compter et crée autour d\'elle une atmosphère de douceur et d\'harmonie. Sa créativité est une source d\'émerveillement pour tous.',
  },
  {
    name: 'Singe', emoji: '🐒',
    element: 'Métal', elementEmoji: '⚙️',
    virtues: 'Intelligence, ingéniosité, polyvalence',
    traits: ['Ingénieux', 'Vif', 'Polyvalent', 'Joueur', 'Inventif'],
    description: 'Le Singe est le génie du zodiaque chinois. Doué d\'une intelligence vive et d\'une curiosité insatiable, il s\'adapte à toutes les situations avec une facilité déconcertante. Inventif et joueur, il résout les problèmes complexes avec une créativité surprenante. Sa vivacité d\'esprit et son humour en font un compagnon particulièrement stimulant.',
  },
  {
    name: 'Coq', emoji: '🐓',
    element: 'Métal', elementEmoji: '⚙️',
    virtues: 'Précision, excellence, sens du détail',
    traits: ['Précis', 'Observateur', 'Courageux', 'Organisé', 'Direct'],
    description: 'Le Coq est le perfectionniste du zodiaque chinois. D\'une précision et d\'un sens de l\'organisation remarquables, il voit les détails que les autres manquent. Direct et courageux, il dit ce qu\'il pense sans détour. Son sens aigu de l\'observation et son exigence envers lui-même font de lui quelqu\'un de profondément fiable et compétent.',
  },
  {
    name: 'Chien', emoji: '🐕',
    element: 'Terre', elementEmoji: '🌍',
    virtues: 'Loyauté, honnêteté, sens du devoir',
    traits: ['Loyal', 'Honnête', 'Protecteur', 'Altruiste', 'Juste'],
    description: 'Le Chien est le gardien le plus fidèle du zodiaque chinois. D\'une loyauté absolue envers ceux qu\'il aime, il est prêt à tout pour les protéger. Honnête jusqu\'à la franchise, il défend ses valeurs avec une conviction inébranlable. Altruiste et généreux, il place le bonheur des autres au-dessus du sien.',
  },
  {
    name: 'Cochon', emoji: '🐷',
    element: 'Eau', elementEmoji: '💧',
    virtues: 'Générosité, bienveillance, joie de vivre',
    traits: ['Généreux', 'Bienveillant', 'Sincère', 'Joyeux', 'Indulgent'],
    description: 'Le Cochon est le plus généreux et le plus bienveillant du zodiaque chinois. Sincère et sans malice, il voit le meilleur en chacun et offre son amitié avec une générosité sans égale. Sa joie de vivre est communicative et sa présence réchauffe les cœurs. Il fait partie de ces êtres rares qui embellissent véritablement la vie des autres.',
  },
];

/**
 * Retourne le signe du zodiaque chinois à partir d'une date de naissance ISO "YYYY-MM-DD".
 * Retourne null si la date est invalide ou si l'année est inconnue ("0000-…").
 */
export function getChineseZodiac(birthday: string): ChineseZodiacSign | null {
  if (!birthday || birthday.startsWith('0000-')) return null;
  const year = parseInt(birthday.split('-')[0], 10);
  if (isNaN(year) || year < 1) return null;
  // Base : 1924 = Rat (index 0)
  const index = ((year - 1924) % 12 + 12) % 12;
  return CHINESE_SIGNS[index] ?? null;
}

// ── Compatibilité Zodiaque Chinois ────────────────────────────────────────────

export interface ChineseCompatibility {
  score: number;   // 1-5
  label: string;
  emoji: string;
  description: string;
}

/**
 * Compatibilité traditionnelle selon les triangles du zodiaque chinois.
 * Triangles : Rat/Dragon/Singe | Bœuf/Serpent/Coq | Tigre/Cheval/Chien | Lapin/Chèvre/Cochon
 * Opposés (6 positions) : traditionnellement plus difficiles.
 */
export function getChineseZodiacCompatibility(a: ChineseZodiacSign, b: ChineseZodiacSign): ChineseCompatibility {
  const idxA = CHINESE_SIGNS.findIndex((s) => s.name === a.name);
  const idxB = CHINESE_SIGNS.findIndex((s) => s.name === b.name);

  // Même signe
  if (idxA === idxB) {
    return { score: 4, label: 'Miroir animal', emoji: '🪞',
      description: `Deux ${a.name}s ensemble — vous partagez les mêmes forces, les mêmes ambitions et les mêmes points de friction. Cette ressemblance crée une complicité immédiate, parfois déconcertante pour les autres. À vous de décider si vous vous complétez ou si vous vous doublez ! 😄`,
    };
  }

  // Opposés dans le cycle (6 positions) — traditionnellement challenges
  if (Math.abs(idxA - idxB) === 6) {
    const pairs: Record<string, string> = {
      'Rat-Cheval': 'Le Rat avance par la ruse, le Cheval par l\'instinct. Deux fortes têtes qui s\'affrontent... mais s\'admirent secrètement.',
      'Bœuf-Chèvre': 'Le Bœuf construit méthodiquement, la Chèvre suit son inspiration. La stabilité contre la liberté — une tension créative si chacun accepte le monde de l\'autre.',
      'Tigre-Singe': 'Le Tigre est impétueux et direct, le Singe rusé et stratège. Une rivalité stimulante qui peut devenir une complémentarité redoutable.',
      'Lapin-Coq': 'La douceur du Lapin face aux exigences du Coq. Des approches très différentes mais une même quête de perfection à leur façon.',
      'Dragon-Chien': 'Le Dragon cherche la grandeur, le Chien la loyauté simple. Deux visions du monde qui se heurtent... mais qui peuvent s\'équilibrer avec de la patience.',
      'Serpent-Cochon': 'Le Serpent est discret et stratège, le Cochon sincère et ouvert. Des natures opposées qui peuvent soit se fasciner mutuellement, soit se méfier.',
    };
    const key = [a.name, b.name].sort().join('-');
    const altKey = [b.name, a.name].join('-');
    const desc = pairs[key] || pairs[altKey] || `${a.name} et ${b.name} sont des signes opposés dans le cycle chinois. Une relation qui demande du travail mais peut devenir une source d'apprentissage profond.`;
    return { score: 2, label: 'Tension créative', emoji: '⚡', description: desc };
  }

  // Même triangle (index % 4 identique dans les groupes 0,4,8 / 1,5,9 / 2,6,10 / 3,7,11)
  const triA = idxA % 4;
  const triB = idxB % 4;
  if (triA === triB) {
    const triNames: Record<number, string> = {
      0: 'Rat, Dragon et Singe',
      1: 'Bœuf, Serpent et Coq',
      2: 'Tigre, Cheval et Chien',
      3: 'Lapin, Chèvre et Cochon',
    };
    return { score: 5, label: 'Affinités profondes', emoji: '💫',
      description: `${a.name} et ${b.name} appartiennent au même triangle d'affinités (${triNames[triA]}). Selon la sagesse ancestrale chinoise, ces deux animaux sont naturellement attirés l\'un vers l\'autre — ils partagent des valeurs fondamentales et se comprennent avec une facilité déconcertante. Une relation bénie par le cosmos 🌟`,
    };
  }

  // Voisins dans le cycle (1 position d'écart)
  if (Math.abs(idxA - idxB) === 1 || Math.abs(idxA - idxB) === 11) {
    return { score: 3, label: 'Relation équilibrée', emoji: '☯️',
      description: `${a.name} et ${b.name} se suivent dans le zodiaque chinois. Deux énergies proches qui se comprennent bien sans se ressembler totalement. Une relation naturelle, fluide, où chacun apporte ce que l\'autre n\'a pas tout à fait.`,
    };
  }

  // Carré (3 positions d'écart) — légère tension stimulante
  if (Math.abs(idxA - idxB) === 3 || Math.abs(idxA - idxB) === 9) {
    return { score: 3, label: 'Contraste vivant', emoji: '🌗',
      description: `${a.name} et ${b.name} apportent chacun une énergie distincte dans cette relation. Ni fusion ni opposition — plutôt une tension créatrice qui vous pousse mutuellement à grandir et à sortir de vos zones de confort.`,
    };
  }

  // Autres cas
  return { score: 3, label: 'Relation nuancée', emoji: '🌿',
    description: `${a.name} et ${b.name} partagent une relation complexe et nuancée. Ni parfaite harmonie ni incompatibilité — une relation qui mérite d\'être explorée en profondeur, car ses richesses cachées révèlent leur vrai potentiel avec le temps.`,
  };
}

function findByMD(md: number): ZodiacSign | null {
  if (md >= 321  && md <= 419)  return SIGNS[0];  // Bélier
  if (md >= 420  && md <= 520)  return SIGNS[1];  // Taureau
  if (md >= 521  && md <= 620)  return SIGNS[2];  // Gémeaux
  if (md >= 621  && md <= 722)  return SIGNS[3];  // Cancer
  if (md >= 723  && md <= 822)  return SIGNS[4];  // Lion
  if (md >= 823  && md <= 922)  return SIGNS[5];  // Vierge
  if (md >= 923  && md <= 1022) return SIGNS[6];  // Balance
  if (md >= 1023 && md <= 1121) return SIGNS[7];  // Scorpion
  if (md >= 1122 && md <= 1221) return SIGNS[8];  // Sagittaire
  if (md >= 1222 || md <= 119)  return SIGNS[9];  // Capricorne
  if (md >= 120  && md <= 218)  return SIGNS[10]; // Verseau
  if (md >= 219  && md <= 320)  return SIGNS[11]; // Poissons
  return null;
}
