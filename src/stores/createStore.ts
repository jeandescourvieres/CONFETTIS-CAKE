import { create } from 'zustand';
import type { MessageFormat, MessageTone, Relation } from '../types/models';

export type Occasion =
  | 'birthday'
  | 'nameday'
  | 'wedding'
  | 'birth'
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

/** Extra fields that appear/disappear depending on the occasion */
export interface OccasionExtras {
  // wedding
  partner1Name?: string;
  partner2Name?: string;
  // birth
  babyName?: string;
  parentNames?: string;
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
  occasion: Occasion;
  age: number | null;
  extras: OccasionExtras;

  // Carte animée sélectionnée (optionnel — défini depuis l'écran preview carte)
  cardTemplateId: string | null;

  // Step 2 — Personnalisation
  personalityTags: PersonalityTag[];
  memories: string;
  lateMode: boolean;

  // Step 3 — Format & ton
  format: MessageFormat;
  tone: MessageTone;
  styleHint: string; // 'Court' | 'Moyen' | 'Long' | '' (pour messages/poèmes)

  // Step 4 — Résultat généré
  generatedContent: string;
  savedMessageId: string | null;
  isGenerating: boolean;
  generationError: string | null;

  // Actions
  setContact: (id: string | null, name: string, relation: Relation, phone?: string | null, email?: string | null) => void;
  setFamilySubRelation: (sub: string) => void;
  setOccasion: (occasion: Occasion) => void;
  setAge: (age: number | null) => void;
  setExtras: (extras: Partial<OccasionExtras>) => void;
  togglePersonalityTag: (tag: PersonalityTag) => void;
  setMemories: (memories: string) => void;
  setLateMode: (lateMode: boolean) => void;
  setFormat: (format: MessageFormat) => void;
  setTone: (tone: MessageTone) => void;
  setStyleHint: (hint: string) => void;
  setCardTemplateId: (id: string | null) => void;
  setGeneratedContent: (content: string) => void;
  setSavedMessageId: (id: string | null) => void;
  setIsGenerating: (value: boolean) => void;
  setGenerationError: (error: string | null) => void;
  reset: () => void;
}

type ActionKeys =
  | 'setContact' | 'setFamilySubRelation' | 'setOccasion' | 'setAge' | 'setExtras' | 'togglePersonalityTag'
  | 'setMemories' | 'setLateMode' | 'setFormat' | 'setTone' | 'setStyleHint' | 'setCardTemplateId'
  | 'setGeneratedContent' | 'setSavedMessageId' | 'setIsGenerating'
  | 'setGenerationError' | 'reset';

const initialState: Omit<CreateState, ActionKeys> = {
  contactId: null,
  contactName: '',
  contactPhone: null,
  contactEmail: null,
  relation: 'friend',
  familySubRelation: '',
  occasion: 'birthday',
  age: null,
  extras: {},
  cardTemplateId: null,
  personalityTags: [],
  memories: '',
  lateMode: false,
  format: 'message',
  tone: 'touching',
  styleHint: 'Court',
  generatedContent: '',
  savedMessageId: null,
  isGenerating: false,
  generationError: null,
};

export const useCreateStore = create<CreateState>((set) => ({
  ...initialState,

  setContact: (id, name, relation, phone = null, email = null) => set({ contactId: id, contactName: name, contactPhone: phone, contactEmail: email, relation, familySubRelation: '' }),
  setFamilySubRelation: (familySubRelation) => set({ familySubRelation }),
  setOccasion: (occasion) => set({ occasion, extras: {}, age: null }),
  setAge: (age) => set({ age }),
  setExtras: (extras) => set((s) => ({ extras: { ...s.extras, ...extras } })),
  togglePersonalityTag: (tag) =>
    set((state) => ({
      personalityTags: state.personalityTags.includes(tag)
        ? state.personalityTags.filter((t) => t !== tag)
        : [...state.personalityTags, tag],
    })),
  setMemories: (memories) => set({ memories }),
  setLateMode: (lateMode) => set({ lateMode }),
  setFormat: (format) => set({ format }),
  setTone: (tone) => set({ tone }),
  setStyleHint: (styleHint) => set({ styleHint }),
  setCardTemplateId: (cardTemplateId) => set({ cardTemplateId }),
  setGeneratedContent: (generatedContent) => set({ generatedContent }),
  setSavedMessageId: (savedMessageId) => set({ savedMessageId }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setGenerationError: (generationError) => set({ generationError }),
  reset: () => set({ ...initialState }),
}));
