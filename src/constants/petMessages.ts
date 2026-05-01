export type PetType = 'chien' | 'chat' | 'lapin' | 'oiseau' | 'autre';

export interface PetMessage {
  id: string;
  text: string; // [NOM_ANIMAL] sera remplacé dynamiquement
}

export const PET_MESSAGES: Record<PetType, PetMessage[]> = {
  chien: [
    {
      id: 'dog_1',
      text: 'Wouf wouf ! 🐕 Ton fidèle [NOM_ANIMAL] te souhaite un joyeux anniversaire plein de câlins et de friandises !',
    },
    {
      id: 'dog_2',
      text: "J'ai failli mâchouiller tes pantoufles pour fêter ça... mais finalement j'ai décidé de te souhaiter un joyeux anniversaire à la place. Gros bisou, [NOM_ANIMAL] 🦴",
    },
    {
      id: 'dog_3',
      text: 'OUAF OUAF OUAF ! (Traduction : joyeux anniversaire de la part de ton meilleur ami à quatre pattes, [NOM_ANIMAL] ! 🐾)',
    },
    {
      id: 'dog_4',
      text: "Pour ton anniversaire, je t'offre ma place sur le canapé ce soir. C'est mon plus beau cadeau. Avec tout mon amour, [NOM_ANIMAL] 🐕",
    },
    {
      id: 'dog_5',
      text: "Tu es mon humain préféré et aujourd'hui c'est ton jour ! [NOM_ANIMAL] t'envoie mille coups de langue et un joyeux anniversaire ! 🐶",
    },
    {
      id: 'dog_6',
      text: "J'aurais bien creusé un trou dans le jardin pour cacher un cadeau... mais j'ai oublié où. Joyeux anniversaire quand même ! [NOM_ANIMAL] 🐕",
    },
  ],
  chat: [
    {
      id: 'cat_1',
      text: "Miaou... miaou... j'aurais pu oublier mais non. Joyeux anniversaire de la part de [NOM_ANIMAL] qui daigne te le souhaiter ! 🐱",
    },
    {
      id: 'cat_2',
      text: "Je te souhaite un anniversaire aussi parfait que mes siestes. Ronron ronron, [NOM_ANIMAL] 🐱",
    },
    {
      id: 'cat_3',
      text: "Pour ton anniversaire, j'ai décidé de ne pas renverser ton verre ce soir. C'est mon cadeau. Miaou, [NOM_ANIMAL] 😸",
    },
    {
      id: 'cat_4',
      text: "J'aurais bien apporté un cadeau... mais j'ai jugé que ma présence suffisait amplement. Joyeux anniversaire, [NOM_ANIMAL] 🐱",
    },
    {
      id: 'cat_5',
      text: "Ronron ronron... c'est ma façon de te dire que tu comptes pour moi. Joyeux anniversaire, [NOM_ANIMAL] 🐾",
    },
    {
      id: 'cat_6',
      text: "Vieillir c'est comme moi : ça prend de la valeur avec le temps. Joyeux anniversaire ! [NOM_ANIMAL] 😺",
    },
  ],
  lapin: [
    {
      id: 'rabbit_1',
      text: "Cui cui ! Eh non, c'est le lapin qui parle : joyeux anniversaire de la part de [NOM_ANIMAL] ! 🐰",
    },
    {
      id: 'rabbit_2',
      text: "Ton petit [NOM_ANIMAL] a gratté partout pour trouver un cadeau... finalement voilà un gros bisou poilu ! Joyeux anniversaire 🐰",
    },
    {
      id: 'rabbit_3',
      text: "Je te souhaite un anniversaire aussi doux que mes oreilles ! Plein de câlins, [NOM_ANIMAL] 🐰",
    },
  ],
  oiseau: [
    {
      id: 'bird_1',
      text: "Cui cui ! [NOM_ANIMAL] chante joyeux anniversaire rien que pour toi aujourd'hui ! 🐦",
    },
    {
      id: 'bird_2',
      text: "Je t'aurais bien apporté un cadeau en volant... mais mes pattes sont trop petites. Joyeux anniversaire, [NOM_ANIMAL] 🐦",
    },
    {
      id: 'bird_3',
      text: "Que du bonheur pour ton anniversaire ! Plein de bises emplumées, [NOM_ANIMAL] 🐦",
    },
  ],
  autre: [
    {
      id: 'other_1',
      text: "Joyeux anniversaire de la part de ton fidèle compagnon [NOM_ANIMAL] ! Plein de tendresse et de bonheur pour toi 🐾",
    },
    {
      id: 'other_2',
      text: "Ton petit [NOM_ANIMAL] te souhaite le meilleur anniversaire qui soit, plein d'amour et de moments heureux ! 🐾",
    },
    {
      id: 'other_3',
      text: "De la part de [NOM_ANIMAL] : tu es son humain préféré, et aujourd'hui c'est ton jour ! Joyeux anniversaire 🎉🐾",
    },
  ],
};

export function getPetMessages(petType: PetType | null | undefined, petName: string): string[] {
  const type: PetType = (petType as PetType) || 'autre';
  const messages = PET_MESSAGES[type] ?? PET_MESSAGES.autre;
  return messages.map((m) => m.text.replace(/\[NOM_ANIMAL\]/g, petName));
}
