const SUPABASE_URL = 'https://rlwxcbnsqokpirhzzurj.supabase.co';
const BUCKET      = 'pet-images';

const CAT_BREED_SLUG: Record<string, string> = {
  'Abyssin':                        'abyssin',
  'Angora':                         'angora',
  'Bengal':                         'bengal',
  'Bleu russe':                     'bleu_russe',
  'British Shorthair':              'british_shorthair',
  'Chartreux':                      'chartreux',
  'Devon Rex':                      'devon_rex',
  'Européen (chat de gouttière)':   'europeen',
  'Exotic Shorthair':               'exotic_shorthair',
  'Maine Coon':                     'maine_coon',
  'Norvégien':                      'norvegien',
  'Oriental Shorthair':             'oriental_shorthair',
  'Persan':                         'persan',
  'Ragdoll':                        'ragdoll',
  'Sacré de Birmanie':              'sacre_de_birmanie',
  'Savannah':                       'savannah',
  'Scottish Fold':                  'scottish_fold',
  'Sibérien':                       'siberien',
  'Siamois':                        'siamois',
  'Sphynx':                         'sphynx',
};

const DOG_BREED_SLUG: Record<string, string> = {
  'Beagle':                         'beagle',
  'Berger allemand':                'berger_allemand',
  'Berger américain miniature':     'berger_americain',
  'Berger australien':              'berger_australien',
  'Berger belge Malinois':          'berger_malinois',
  'Border Collie':                  'border_collie',
  'Bouledogue français':            'bouledogue_francais',
  'Caniche':                        'caniche',
  'Cane Corso':                     'cane_corso',
  'Cavalier King Charles':          'cavalier_king_charles',
  'Chihuahua':                      'chihuahua',
  'Cocker Spaniel anglais':         'cocker_spaniel',
  'Golden Retriever':               'golden_retriever',
  'Husky sibérien':                 'husky',
  'Jack Russell':                   'jack_russell',
  'Labrador Retriever':             'labrador_retriever',
  'Rottweiler':                     'rottweiler',
  'Spitz allemand / Poméranien':    'spitz',
  'Staffie':                        'staffie',
  'Teckel':                         'teckel',
  'Yorkshire Terrier':              'yorkshire',
};

const OCCASION_SLUG: Record<string, string> = {
  birthday: 'anniversaire',
  nameday:  'fete',
};

// Espèces avec image générique (pas de déclinaison par race)
const GENERIC_PET_TYPES = new Set([
  'lapin', 'perroquet', 'hamster', 'cheval',
  'oiseau', 'cochon_d_inde', 'souris', 'tortue', 'poisson',
]);

export function getPetImageUrl(
  petType: string,
  breed: string | null | undefined,
  occasion: string,
): string | null {
  const occasionSlug = OCCASION_SLUG[occasion];
  if (!occasionSlug) return null;

  // Chien / chat : image par race
  if (petType === 'chat' || petType === 'chien') {
    if (!breed) return null;
    const slugMap = petType === 'chat' ? CAT_BREED_SLUG : DOG_BREED_SLUG;
    const breedSlug = slugMap[breed];
    if (!breedSlug) return null;
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${petType}_${breedSlug}_${occasionSlug}.png`;
  }

  // Autres espèces : image générique
  if (GENERIC_PET_TYPES.has(petType)) {
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${petType}_${occasionSlug}.png`;
  }

  return null;
}
