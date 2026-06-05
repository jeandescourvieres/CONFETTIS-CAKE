const SUPABASE_URL = 'https://rlwxcbnsqokpirhzzurj.supabase.co';
const BUCKET = 'festive-images';

export interface FestiveImageOption {
  slug: string;
  label: string;
}

export const FESTIVE_IMAGES: Record<string, FestiveImageOption[]> = {
  birthday: [
    { slug: 'gateau1',  label: '🎂 Gâteau 1'  },
    { slug: 'gateau2',  label: '🎂 Gâteau 2'  },
    { slug: 'gateau3',  label: '🎂 Gâteau 3'  },
    { slug: 'cadeau1',  label: '🎁 Cadeau'    },
    { slug: 'ballon1',  label: '🎈 Ballon'    },
  ],
  nameday: [
    { slug: 'gateau1',  label: '🎂 Gâteau 1'  },
    { slug: 'gateau2',  label: '🎂 Gâteau 2'  },
    { slug: 'gateau3',  label: '🎂 Gâteau 3'  },
    { slug: 'gateau4',  label: '🎂 Gâteau 4'  },
    { slug: 'gateau5',  label: '🎂 Gâteau 5'  },
    { slug: 'ballon1',  label: '🎈 Ballon'    },
  ],
};

export const FESTIVE_OVERLAY: Record<string, string> = {
  birthday: 'Joyeux anniversaire',
  nameday:  'Bonne fête',
};

export function getFestiveImageUrl(occasion: string, slug: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${occasion}/${slug}.png`;
}

export function hasFestiveImages(occasion: string): boolean {
  return !!(FESTIVE_IMAGES[occasion]?.length);
}
