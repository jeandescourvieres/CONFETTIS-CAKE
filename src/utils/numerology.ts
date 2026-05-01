// ═══════════════════════════════════════════════════════════════════
//  Confettis & Cake — Numérologie
// ═══════════════════════════════════════════════════════════════════
//
//  Table de correspondance officielle :
//  A,J,S=1 | B,K,T=2 | C,L,U=3 | D,M,V=4 | E,N,W=5
//  F,O,X=6 | G,P,Y=7 | H,Q,Z=8 | I,R=9
//
//  Réduction : additionner jusqu'à 1-9, SAUF 11 et 22 (nombres maîtres)
// ═══════════════════════════════════════════════════════════════════

const LETTER_VALUES: Record<string, number> = {
  A:1, J:1, S:1,
  B:2, K:2, T:2,
  C:3, L:3, U:3,
  D:4, M:4, V:4,
  E:5, N:5, W:5,
  F:6, O:6, X:6,
  G:7, P:7, Y:7,
  H:8, Q:8, Z:8,
  I:9, R:9,
};

/** Normalise une lettre accentuée en base latine */
function normalize(char: string): string {
  return char
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

/** Réduit un nombre jusqu'à 1-9, sauf 11 et 22 (nombres maîtres) */
function reduce(n: number): number {
  if (n === 11 || n === 22) return n;
  if (n < 10) return n;
  const sum = String(n).split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  return reduce(sum);
}

/** Calcule le chiffre vibratoire d'une chaîne de caractères */
export function calcNumerology(text: string): number {
  const sum = text
    .split('')
    .map(normalize)
    .filter((c) => LETTER_VALUES[c] !== undefined)
    .reduce((acc, c) => acc + LETTER_VALUES[c], 0);
  return reduce(sum);
}

/** Calcule le chemin de vie depuis une date ISO "YYYY-MM-DD" */
export function calcLifePath(birthday: string): number | null {
  if (!birthday || birthday.startsWith('0000-')) return null;
  const digits = birthday.replace(/-/g, '').split('').map(Number);
  const sum = digits.reduce((acc, d) => acc + d, 0);
  return reduce(sum);
}

// ── Données par chiffre ──────────────────────────────────────────────────────

export interface NumerologyProfile {
  number: number;
  name: string;        // ex: "Le Libre"
  color: string;       // couleur hex
  colorName: string;   // ex: "Bleu ciel"
  keywords: string[];
  description: string;
}

const PROFILES: Record<number, NumerologyProfile> = {
  1: {
    number: 1, name: 'Le Leader', color: '#E53935', colorName: 'Rouge',
    keywords: ['Pionnier', 'Indépendant', 'Ambitieux', 'Courageux'],
    description: 'Né pour ouvrir la voie, le 1 possède une force intérieure et une volonté hors du commun. Indépendant et déterminé, il trace son chemin là où les autres hésitent. Son leadership naturel inspire ceux qui l\'entourent — il est celui qui commence, qui ose, qui crée.',
  },
  2: {
    number: 2, name: 'Le Diplomate', color: '#FF7043', colorName: 'Orange',
    keywords: ['Empathique', 'Médiateur', 'Sensible', 'Coopératif'],
    description: 'Le 2 est le maître de l\'harmonie et de la coopération. Doté d\'une empathie rare, il perçoit les émotions des autres et sait trouver le juste équilibre. Médiateur naturel, il crée des ponts là où les autres construisent des murs. Sa sensibilité est sa plus grande force.',
  },
  3: {
    number: 3, name: 'Le Créatif', color: '#FDD835', colorName: 'Jaune',
    keywords: ['Expressif', 'Joyeux', 'Artistique', 'Communicatif'],
    description: 'Le 3 vibre sur la fréquence de la joie et de la création. Expressif, enthousiaste et doué pour la communication, il illumine tout ce qu\'il touche. Artiste dans l\'âme, il voit le monde comme une toile vierge sur laquelle tout est possible. Sa présence est un cadeau pour ceux qui l\'entourent.',
  },
  4: {
    number: 4, name: 'Le Bâtisseur', color: '#43A047', colorName: 'Vert',
    keywords: ['Méthodique', 'Fiable', 'Travailleur', 'Stable'],
    description: 'Le 4 est la fondation sur laquelle tout repose. Patient, méthodique et profondément fiable, il construit dans la durée avec une détermination sans faille. Là où les autres voient des obstacles, il voit des étapes. Son sérieux et sa constance font de lui quelqu\'un sur qui on peut toujours compter.',
  },
  5: {
    number: 5, name: 'Le Libre', color: '#29B6F6', colorName: 'Bleu ciel',
    keywords: ['Aventurier', 'Adaptable', 'Curieux', 'Libre'],
    description: 'Le 5 est né pour la liberté et l\'aventure. Curieux de tout et adaptable à tout, il ne supporte pas les frontières et les conventions. Son énergie est communicative — il entraîne les autres dans ses aventures avec un enthousiasme contagieux. Chaque jour est une nouvelle découverte.',
  },
  6: {
    number: 6, name: 'Le Protecteur', color: '#3949AB', colorName: 'Bleu indigo',
    keywords: ['Altruiste', 'Responsable', 'Bienveillant', 'Harmonieux'],
    description: 'Le 6 est le gardien du foyer et des cœurs. Naturellement altruiste et bienveillant, il prend soin des autres avec un amour inconditionnel. Sa présence apporte harmonie et chaleur. Responsable et généreux, il est le pilier autour duquel une famille, une équipe, une communauté se retrouve et s\'épanouit.',
  },
  7: {
    number: 7, name: 'Le Spirituel', color: '#8E24AA', colorName: 'Violet',
    keywords: ['Intuitif', 'Philosophe', 'Mystérieux', 'Sage'],
    description: 'Le 7 cherche la vérité au-delà des apparences. Philosophe et contemplatif, il plonge dans les profondeurs de l\'existence avec une curiosité insatiable. Son intuition lui permet de voir ce que les autres ne voient pas. Mystérieux et sage, il fascine ceux qui l\'approchent par la profondeur de sa pensée.',
  },
  8: {
    number: 8, name: 'L\'Ambitieux', color: '#EC407A', colorName: 'Rose',
    keywords: ['Puissant', 'Stratège', 'Déterminé', 'Réaliste'],
    description: 'Le 8 est le maître de la manifestation matérielle. Stratège né, il voit grand et sait transformer ses ambitions en réalité concrète. Son sens des affaires et sa détermination lui permettent d\'atteindre des sommets. Réaliste et puissant, il inspire le respect par sa capacité à construire ce qu\'il imagine.',
  },
  9: {
    number: 9, name: 'L\'Humaniste', color: '#F9A825', colorName: 'Or',
    keywords: ['Généreux', 'Sage', 'Universel', 'Idéaliste'],
    description: 'Le 9 porte en lui la sagesse de tous les chiffres. Idéaliste et généreux, il aspire à un monde meilleur et n\'hésite pas à tout donner pour y contribuer. Son amour est universel — il appartient à tout le monde. Sa grande sensibilité et son humanité profonde en font une âme rare et précieuse.',
  },
  11: {
    number: 11, name: 'Le Visionnaire', color: '#B0BEC5', colorName: 'Blanc argenté',
    keywords: ['Inspiré', 'Intuitif', 'Visionnaire', 'Sensitif'],
    description: 'Nombre maître par excellence, le 11 est le canal entre le monde terrestre et le monde spirituel. Doté d\'une intuition extraordinaire et d\'une sensibilité hors norme, il perçoit ce que les autres ne peuvent ni voir ni ressentir. Son chemin est celui de l\'inspiration et de l\'illumination des consciences.',
  },
  22: {
    number: 22, name: 'Le Grand Bâtisseur', color: '#D4AF37', colorName: 'Blanc doré',
    keywords: ['Maître', 'Visionnaire', 'Bâtisseur', 'Légendaire'],
    description: 'Le plus puissant des nombres maîtres, le 22 combine la vision du 11 et la capacité de construction du 4. Rare et exceptionnel, il possède le potentiel de réaliser ce que d\'autres considèrent comme impossible. Sa mission est de laisser une empreinte durable sur le monde — une œuvre qui traverse les générations.',
  },
};

export function getNumerologyProfile(n: number): NumerologyProfile {
  return PROFILES[n] ?? PROFILES[1];
}

// ── Compatibilité numérologique ───────────────────────────────────────────────

export interface NumerologyCompatibility {
  score: number;   // 1-5
  label: string;
  emoji: string;
  description: string;
}

/**
 * Compatibilité entre deux chiffres vibratoires.
 * Basée sur les triangles numériques traditionnels et les polarités.
 * Triangles : (1,4,7) intuitif-actif | (2,5,8) émotionnel-matériel | (3,6,9) créatif-humaniste
 * Maîtres : 11 ≈ 2 amplifié | 22 ≈ 4 amplifié
 */
export function getNumerologyCompatibility(a: number, b: number): NumerologyCompatibility {
  // Normalise les maîtres pour la logique de triangle (11→2, 22→4)
  const base = (n: number) => n === 11 ? 2 : n === 22 ? 4 : n;
  const ba = base(a);
  const bb = base(b);

  // Même chiffre (ou même base)
  if (ba === bb) {
    return { score: 4, label: 'Vibrations miroir', emoji: '🪞',
      description: `Deux ${a}${a !== b ? ` et ${b}` : ''} — vous vibrez à la même fréquence. Cette ressemblance profonde crée une complicité immédiate et une compréhension mutuelle sans effort. Vous partagez les mêmes aspirations, les mêmes peurs, et les mêmes élans. Attention toutefois à ne pas vous renforcer mutuellement dans vos limites — vos forces sont décuplées, et vos points de friction aussi ! 😄`,
    };
  }

  // Partenaires naturels (somme = 9, classique en numérologie)
  if (ba + bb === 9) {
    return { score: 5, label: 'Complémentarité parfaite', emoji: '💛',
      description: `${a} et ${b} forment une paire dont la somme est 9 — le nombre de l\'achèvement. Vous vous complétez avec une harmonie naturelle qui surprend souvent les autres. Ce que l\'un cherche, l\'autre le possède. Ce que l\'un initie, l\'autre accomplit. Une connexion rare et précieuse 🌟`,
    };
  }

  // Triangle 1 — 1, 4, 7 (vision, construction, spiritualité)
  const tri1 = new Set([1, 4, 7]);
  // Triangle 2 — 2, 5, 8 (relation, liberté, ambition)
  const tri2 = new Set([2, 5, 8]);
  // Triangle 3 — 3, 6, 9 (création, protection, universalité)
  const tri3 = new Set([3, 6, 9]);

  if ((tri1.has(ba) && tri1.has(bb)) || (tri2.has(ba) && tri2.has(bb)) || (tri3.has(ba) && tri3.has(bb))) {
    const triName = tri1.has(ba) ? 'vision, construction et intuition' : tri2.has(ba) ? 'relation, liberté et ambition' : 'créativité, générosité et universalité';
    return { score: 5, label: 'Affinités vibratoires', emoji: '✨',
      description: `${a} et ${b} appartiennent au même triangle vibratoire (${triName}). Vous partagez un langage commun au niveau de l\'âme — des valeurs fondamentales alignées et une vision du monde compatible. Cette relation coule naturellement, comme si vous vous connaissiez depuis toujours 💫`,
    };
  }

  // Opposés créatifs — triangles voisins (1+2, 2+3, 3+1 cross-triangle)
  if (ba + bb === 6 || ba + bb === 7) {
    return { score: 4, label: 'Tension créative', emoji: '⚡',
      description: `${a} et ${b} apportent des énergies différentes mais complémentaires. Là où l\'un est fort, l\'autre apporte une perspective nouvelle. Cette différence peut créer des frictions, mais c\'est souvent dans ce frottement que naissent les plus belles choses — une dynamique qui vous tire mutuellement vers le haut ✨`,
    };
  }

  // Maîtres avec leur chiffre de base
  if ((a === 11 && b === 2) || (b === 11 && a === 2) || (a === 22 && b === 4) || (b === 22 && a === 4)) {
    return { score: 5, label: 'Connexion maîtresse', emoji: '💎',
      description: `Un nombre maître et son écho terrestre — une relation d'une rare profondeur. Le nombre maître apporte une vision, une intuition et une intensité hors du commun. L'autre ancre cette énergie dans le réel et lui donne un sol où s'épanouir. Ensemble, vous pouvez accomplir ce que ni l'un ni l'autre n'imaginerait seul 🌟`,
    };
  }

  // Deux nombres maîtres
  if ((a === 11 || a === 22) && (b === 11 || b === 22)) {
    return { score: 5, label: 'Alliance de maîtres', emoji: '👑',
      description: 'Deux nombres maîtres ensemble — une rencontre exceptionnelle. Vous portez tous les deux une mission de vie puissante et une sensibilité hors norme. Une relation intense, transformatrice, qui peut élever les deux âmes vers leur plein potentiel. Rare et précieux 🌟💎',
    };
  }

  // Défaut équilibré
  return { score: 3, label: 'Relation nuancée', emoji: '🌗',
    description: `${a} et ${b} apportent des énergies distinctes dans cette relation. Ni parfaite harmonie ni véritable tension — une relation riche en découvertes mutuelles, qui révèle ses trésors progressivement avec la confiance et le temps 💛`,
  };
}
