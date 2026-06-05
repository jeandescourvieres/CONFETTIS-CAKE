import { supabase } from './supabase';

// ── Types ────────────────────────────────────────────────────

export interface CardBackground {
  id: string;
  title: string;
  category: string;
  mp4_url: string;
  thumbnail_url: string;
  duration_ms: number;
  loop: boolean;
  dominant_color: string;
  tier: 'free' | 'pro';
}

export interface CardEffect {
  id: string;
  title: string;
  effect_type: string;
  lottie_url: string;
  thumbnail_url: string;
  loop: boolean;
  has_name_layer: boolean;
  name_layer_id: string | null;
  occasions: string[];
  tier: 'free' | 'pro';
}

export interface CardTextConfig {
  position: 'center' | 'top' | 'bottom';
  align: 'center' | 'left';
  prefix?: string;
  suffix?: string;
  name_size: number;
  prefix_size: number;
  color: string;
  shadow: boolean;
  animation: 'fade_in' | 'slide_up' | 'bounce' | 'typewriter' | 'none';
  animation_delay_ms: number;
}

export interface CardTextStyle {
  id: string;
  title: string;
  config: CardTextConfig;
}

/** Mode de la carte :
 *  'name'     → affiche le prénom du destinataire
 *  'age'      → affiche le chiffre de l'âge animé dynamiquement
 *  'age_name' → affiche le chiffre + le prénom superposés
 */
export type CardMode = 'name' | 'age' | 'age_name';

export interface CardTemplate {
  id: string;
  title: string;
  occasion: string;
  mood: string;
  mode: CardMode;
  gender: 'neutral' | 'female' | 'male' | 'child';
  tier: 'free' | 'pro';
  tags: string[];
  sort_order: number;
  background: CardBackground;
  effect: CardEffect;
  text_style: CardTextStyle;
  ai_description: string | null;
}

// ── Fetch ────────────────────────────────────────────────────

const TEMPLATE_SELECT = `
  *,
  background:card_backgrounds(*),
  effect:card_effects(*),
  text_style:card_text_styles(*)
`;

export async function fetchCardTemplates(
  occasion?: string | null,
  mood?: string | null,
  mode?: CardMode | null,
  gender?: string | null,
): Promise<CardTemplate[]> {
  let query = supabase
    .from('card_templates')
    .select(TEMPLATE_SELECT)
    .eq('active', true)
    .order('sort_order');

  if (occasion && occasion !== 'all') query = query.eq('occasion', occasion);
  if (mood)                           query = query.eq('mood', mood);
  if (mode)                           query = query.eq('mode', mode);
  if (gender && gender !== 'all')     query = query.or(`gender.eq.${gender},gender.eq.neutral`);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as CardTemplate[];
}

export async function fetchCardTemplate(id: string): Promise<CardTemplate> {
  const { data, error } = await supabase
    .from('card_templates')
    .select(TEMPLATE_SELECT)
    .eq('id', id)
    .eq('active', true)
    .single();
  if (error) throw error;
  return data as unknown as CardTemplate;
}
