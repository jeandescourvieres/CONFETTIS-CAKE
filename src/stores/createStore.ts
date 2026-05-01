import { create } from 'zustand';
import type { AppLanguage, MessageFormat, MessageTone, Relation } from '../types/models';

export type Occasion =
  | 'birthday'
  | 'nameday'
  | 'wedding'
  | 'engagement'
  | 'birth'
  | 'baptism'
  | 'communion'
  | 'graduation'
  | 'promotion'
  | 'thanks'
  | 'newyear'
  | 'christmas'
  | 'easter'
  | 'valentines'
  | 'mothersday'
  | 'fathersday'
  | 'halloween'
  | 'retirement'
  | 'support'
  | 'custom';

export type PersonalityTag =
  | 'drôle'
  | 'calme'
  | 'passionné'
  | 'créatif'
  | 'sportif'
  | 'gourmand'
  | 'voyageur'
  | 'geek';

export type DogPersonalityTag =
  | 'câlin' | 'joueur' | 'gourmand' | 'peureux' | 'protecteur'
  | 'bavard' | 'énergique' | 'canapé-addict' | 'chasseur' | 'fidèle';

export type CatPersonalityTag =
  | 'royal' | 'indifférent' | 'destructeur' | 'chasseur nocturne'
  | 'gourmet difficile' | 'câlin capricieux' | 'contemplatif'
  | 'jaloux' | 'acrobate' | 'mystérieux';

export type PetPersonalityTag = DogPersonalityTag | CatPersonalityTag;

/** Extra fields that appear/disappear depending on the occasion */
export interface OccasionExtras {
  // wedding
  partner1Name?: string;
  partner2Name?: string;
  // birth
  babyName?: string;
  parent1Name?: string;
  parent2Name?: string;
  parentNames?: string; // combinaison de parent1Name + parent2Name, utilisée par le prompt IA
  // graduation
  diplomaLabel?: string;
  // promotion
  newJobTitle?: string;
  // thanks
  thankReason?: string;
  // newyear — uses contactName as recipient(s)
  // custom
  customOccasionLabel?: string;
  // support
  supportType?: 'bereavement' | 'illness' | 'breakup' | 'hardtime' | 'encouragement';
}

export interface CreateState {
  // Step 1 — Contact & occasion
  contactId: string | null;
  contactName: string;
  contactPhone: string | null;
  contactEmail: string | null;
  relation: Relation;
  familySubRelation: string; // précision pour "famille" : frère, mère, etc.
  petSubRelation: string;    // précision pour "boule de poils" : chien, chat, autre
  occasion: Occasion;
  age: number | null;
  extras: OccasionExtras;

  // Carte animée sélectionnée (optionnel — défini depuis l'écran preview carte)
  cardTemplateId: string | null;

  // Step 2 — Personnalisation
  personalityTags: PersonalityTag[];
  petPersonalityTags: PetPersonalityTag[];
  favouriteColor: string | null;
  memories: string;
  lateMode: boolean;

  // Step 3 — Format & ton
  format: MessageFormat;
  tone: MessageTone;
  styleHint: string; // 'Court' | 'Moyen' | 'Long' | '' (pour messages/poèmes)
  musicVoice: 'female' | 'male' | 'mixed'; // voix pour les chansons
  messageLanguage: AppLanguage; // langue de génération du message

  // Step 3b — Style d'affichage
  fontStyle: string;   // 'standard' | 'caveat_bold' | 'dancing' | 'satisfy' | 'patrick' | 'pacifico' | 'special_elite' | 'bangers'
  fontSize: 'sm' | 'md' | 'lg';
  isItalic: boolean;

  // Step 4 — Résultat généré
  generatedContent: string;
  savedMessageId: string | null;
  isGenerating: boolean;
  generationError: string | null;

  // Actions
  setContact: (id: string | null, name: string, relation: Relation, phone?: string | null, email?: string | null) => void;
  setFavouriteColor: (color: string | null) => void;
  setFamilySubRelation: (sub: string) => void;
  setPetSubRelation: (sub: string) => void;
  setOccasion: (occasion: Occasion) => void;
  setAge: (age: number | null) => void;
  setExtras: (extras: Partial<OccasionExtras>) => void;
  togglePersonalityTag: (tag: PersonalityTag) => void;
  togglePetPersonalityTag: (tag: PetPersonalityTag) => void;
  setMemories: (memories: string) => void;
  setLateMode: (lateMode: boolean) => void;
  setFormat: (format: MessageFormat) => void;
  setTone: (tone: MessageTone) => void;
  setStyleHint: (hint: string) => void;
  setMusicVoice: (voice: 'female' | 'male' | 'mixed') => void;
  setMessageLanguage: (lang: AppLanguage) => void;
  setFontStyle: (style: string) => void;
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  setIsItalic: (v: boolean) => void;
  setCardTemplateId: (id: string | null) => void;
  setGeneratedContent: (content: string) => void;
  setSavedMessageId: (id: string | null) => void;
  setIsGenerating: (value: boolean) => void;
  setGenerationError: (error: string | null) => void;
  reset: () => void;
}

type ActionKeys =
  | 'setContact' | 'setFavouriteColor' | 'setFamilySubRelation' | 'setPetSubRelation' | 'setOccasion' | 'setAge' | 'setExtras'
  | 'togglePersonalityTag' | 'togglePetPersonalityTag'
  | 'setMemories' | 'setLateMode' | 'setFormat' | 'setTone' | 'setStyleHint' | 'setCardTemplateId'
  | 'setGeneratedContent' | 'setSavedMessageId' | 'setIsGenerating'
  | 'setGenerationError' | 'setMusicVoice' | 'setMessageLanguage'
  | 'setFontStyle' | 'setFontSize' | 'setIsItalic' | 'reset';

const initialState: Omit<CreateState, ActionKeys> = {
  contactId: null,
  contactName: '',
  contactPhone: null,
  contactEmail: null,
  relation: 'friend',
  familySubRelation: '',
  petSubRelation: '',
  occasion: 'birthday',
  age: null,
  extras: {},
  cardTemplateId: null,
  personalityTags: [],
  petPersonalityTags: [],
  favouriteColor: null,
  memories: '',
  lateMode: false,
  format: 'message',
  tone: 'touching',
  styleHint: 'Court',
  musicVoice: 'mixed',
  messageLanguage: 'fr' as AppLanguage,
  fontStyle: 'standard',
  fontSize: 'md' as const,
  isItalic: false,
  generatedContent: '',
  savedMessageId: null,
  isGenerating: false,
  generationError: null,
};

export const useCreateStore = create<CreateState>((set) => ({
  ...initialState,

  setContact: (id, name, relation, phone = null, email = null) => set({ contactId: id, contactName: name, contactPhone: phone, contactEmail: email, relation, familySubRelation: '', petSubRelation: '' }),
  setFavouriteColor: (favouriteColor) => set({ favouriteColor }),
  setFamilySubRelation: (familySubRelation) => set({ familySubRelation }),
  setPetSubRelation: (petSubRelation) => set({ petSubRelation }),
  setOccasion: (occasion) => set({ occasion, extras: {}, age: null }),
  setAge: (age) => set({ age }),
  setExtras: (extras) => set((s) => ({ extras: { ...s.extras, ...extras } })),
  togglePersonalityTag: (tag) =>
    set((state) => ({
      personalityTags: state.personalityTags.includes(tag)
        ? state.personalityTags.filter((t) => t !== tag)
        : [...state.personalityTags, tag],
    })),
  togglePetPersonalityTag: (tag) =>
    set((state) => ({
      petPersonalityTags: state.petPersonalityTags.includes(tag)
        ? state.petPersonalityTags.filter((t) => t !== tag)
        : [...state.petPersonalityTags, tag],
    })),
  setMemories: (memories) => set({ memories }),
  setLateMode: (lateMode) => set({ lateMode }),
  setFormat: (format) => set({ format }),
  setTone: (tone) => set({ tone }),
  setStyleHint: (styleHint) => set({ styleHint }),
  setMusicVoice: (musicVoice) => set({ musicVoice }),
  setMessageLanguage: (messageLanguage) => set({ messageLanguage }),
  setFontStyle: (fontStyle) => set({ fontStyle }),
  setFontSize: (fontSize) => set({ fontSize }),
  setIsItalic: (isItalic) => set({ isItalic }),
  setCardTemplateId: (cardTemplateId) => set({ cardTemplateId }),
  setGeneratedContent: (generatedContent) => set({ generatedContent }),
  setSavedMessageId: (savedMessageId) => set({ savedMessageId }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setGenerationError: (generationError) => set({ generationError }),
  reset: () => set({ ...initialState }),
}));
