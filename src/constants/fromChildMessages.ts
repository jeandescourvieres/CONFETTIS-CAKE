// Messages écrits de la part d'un enfant à son parent (anniversaire ou fête)
// {prenom} = prénom du parent (ex: Sophie, Pierre)
// {role}   = Maman ou Papa selon la civilité du contact

export interface FromChildMessage {
  id: string;
  text: string;
  occasion: 'birthday' | 'nameday';
  emoji: string;
  label: string;
}

export const FROM_CHILD_BIRTHDAY: FromChildMessage[] = [
  {
    id: 'fc_b01',
    emoji: '😅',
    label: 'Le coup du rappel',
    occasion: 'birthday',
    text: `{role}, t'inquiète j'avais pas oublié... enfin presque. On m'a donné un petit coup de pouce ce matin pour me rappeler. Mais l'important c'est que je pense à toi — et que je t'aime fort. Bon anni {role} 🎂 😄`,
  },
  {
    id: 'fc_b02',
    emoji: '🥹',
    label: 'Le sincère',
    occasion: 'birthday',
    text: `{role}, t'es {le_la} {meilleur_e} {role} du monde. Je sais que je le dis pas souvent (ou presque jamais) mais c'est vrai. Bon anni {role} 🎂 Je t'aime (même si c'est bizarre à dire).`,
  },
  {
    id: 'fc_b03',
    emoji: '😂',
    label: 'Le négociateur',
    occasion: 'birthday',
    text: `Bon anni {role} ! 🎂 Pour ton cadeau... je prépare quelque chose. C'est pas encore prêt. Mais je pense très fort à toi en attendant. Très fort. Vraiment. (Le cadeau arrive bientôt je promets.)`,
  },
  {
    id: 'fc_b04',
    emoji: '🤗',
    label: 'Le câlin',
    occasion: 'birthday',
    text: `{role}, aujourd'hui c'est ton jour ! 🎂 Je t'offre le plus grand câlin du monde (à réclamer dès ce soir). Bon anni {role}, t'es {le_la} {meilleur_e} de tous. Et ça, c'est pas discutable. Je t'aime fort ! 🤗`,
  },
  {
    id: 'fc_b05',
    emoji: '🎤',
    label: 'La chanson ratée',
    occasion: 'birthday',
    text: `🎵 Bon anniversaire {role}, bon anniversaire à toi... 🎵 Bon j'ai pas la voix mais le cœur y est ! Bon anni {role}, je t'aime fort 🎂`,
  },
  {
    id: 'fc_b06',
    emoji: '🧐',
    label: 'Le philosophe',
    occasion: 'birthday',
    text: `{role}, un an de plus c'est un an de sagesse en plus. Enfin c'est ce que tu m'as toujours dit. Donc techniquement t'es encore plus sage qu'avant. Ce qui veut dire que t'as pas le droit de te mettre en colère aujourd'hui. Logique non ? Bon anni {role} 🎂`,
  },
  {
    id: 'fc_b07',
    emoji: '💸',
    label: 'Le réaliste',
    occasion: 'birthday',
    text: `Bon anni {role} ! 🎉 Mon budget cadeau est un peu serré ce mois-ci (c'est compliqué) donc je t'offre ce message rempli d'amour. C'est mieux qu'un objet de toute façon. Enfin c'est ce qu'on dit. Je t'aime fort ! 🥰`,
  },
  {
    id: 'fc_b08',
    emoji: '📸',
    label: 'Le nostalgique',
    occasion: 'birthday',
    text: `{role}, j'ai regardé de vieilles photos ce matin. T'as pas beaucoup changé (si si je t'assure). Merci d'être là depuis le début. Merci pour tout. Bon anni {role} ❤️`,
  },
  {
    id: 'fc_b09',
    emoji: '🌟',
    label: 'Le flatteur',
    occasion: 'birthday',
    text: `T'es officiellement {le_la} {meilleur_e} {role} du monde ! Et je dis pas ça pour avoir quelque chose. Enfin pas que pour ça. Bon anni, je t'aime 🎂✨`,
  },
  {
    id: 'fc_b10',
    emoji: '😴',
    label: 'Le presque oublieux',
    occasion: 'birthday',
    text: `{role} ! J'allais pas oublier ton anniversaire. J'avais juste... besoin qu'on me le rappelle. Mais dans ma tête j'y pensais ! Bon anni {role}, je t'aime fort quand même 🎂`,
  },
];

export const FROM_CHILD_NAMEDAY: FromChildMessage[] = [
  {
    id: 'fc_n01',
    emoji: '😅',
    label: 'Le rappelé',
    occasion: 'nameday',
    text: `Bonne fête {role} ! 🎉 J'avais mis un rappel... sur le téléphone de quelqu'un d'autre. Mais l'essentiel c'est que je pense à toi ! Bonne fête {role}, je t'aime 💛`,
  },
  {
    id: 'fc_n02',
    emoji: '🌸',
    label: 'Le sincère',
    occasion: 'nameday',
    text: `Bonne fête {role} ! 🌸 C'est une belle occasion de te dire que t'es quelqu'un de formidable. Même quand t'es insupportable. Enfin surtout quand t'es formidable. Je t'aime fort !`,
  },
  {
    id: 'fc_n03',
    emoji: '🎉',
    label: 'Le festif',
    occasion: 'nameday',
    text: `Bonne fête {role} ! 🎊 Aujourd'hui c'est le prénom {prenom} qui est à l'honneur — et c'est mérité. T'as le plus beau prénom du monde (objectivement). Je t'aime ! 💛`,
  },
];
