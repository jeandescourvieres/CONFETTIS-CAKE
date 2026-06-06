// ═══════════════════════════════════════════════
//  Confettis & Cake — Domain Models
// ═══════════════════════════════════════════════

export type Plan = 'free' | 'essentiel' | 'premium';
export type AppLanguage = 'fr' | 'en' | 'de' | 'es' | 'it' | 'pt';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: Plan;
  referral_code: string;
  credits: number;
  language: AppLanguage;
  show_signature: boolean;
  notif_birthday: boolean;
  notif_nameday: boolean;
  notif_pot: boolean;
  birthday: string | null;  // "YYYY-MM-DD" ou "0000-MM-DD" (jour/mois sans année)
  civilite: 'M.' | 'Mme' | null;
  email?: string | null;
  created_at: string;
}

// ── Contacts ─────────────────────────────────

export type Relation =
  | 'best_friend'
  | 'friend'
  | 'family'
  | 'partner'
  | 'colleague'
  | 'pet'
  | 'child_of'
  | 'other';

export interface Contact {
  id: string;
  user_id: string;
  name: string;
  birthday: string | null;       // ISO date string "YYYY-MM-DD"
  name_day: string | null;       // ISO date string "MM-DD"
  relation: Relation;
  phone: string | null;
  email: string | null;
  notes: string | null;
  avatar_url: string | null;
  imported_from: 'phone' | 'manual' | null;
  personality_tags: string[];    // ex: ['drôle', 'sportif']
  preferred_channel: 'sms' | 'email' | null;
  preferred_send_time: 'morning' | 'afternoon' | 'evening' | 'anytime' | null;
  pet_owner_name: string | null;        // ex: "Michel" — affiché sous le nom du pet
  pet_owner_contact_id: string | null;  // id du contact propriétaire
  pet_type: 'chien' | 'chat' | 'lapin' | 'perroquet' | 'hamster' | 'poisson' | 'cheval' | 'oiseau' | 'cochon_d_inde' | 'souris' | 'tortue' | 'autre' | null;
  pet_gender: 'male' | 'female' | null; // genre de l'animal
  breed: string | null;                  // race de l'animal
  child_parent_name?: string | null;      // ex: "Sophie" — parent du contact enfant
  child_parent_contact_id?: string | null; // id du contact parent
  child_gender?: 'male' | 'female' | null; // genre de l'enfant
  partner_contact_id?: string | null;     // id du contact partenaire/conjoint
  preferred_language: AppLanguage | null; // langue du message IA pour ce contact
  favourite_color: string | null;          // couleur préférée (saisie libre)
  civilite?: 'M.' | 'Mme' | null;         // civilité du contact (optionnel)
  created_at: string;
}

export interface UpcomingEvent {
  contact: Contact;
  eventType: 'birthday' | 'name_day';
  date: Date;
  daysUntil: number;
  age?: number;
}

// ── Messages ─────────────────────────────────

export type MessageFormat = 'song' | 'poem' | 'message' | 'joke';
export type MessageTone =
  | 'humorous'
  | 'touching'
  | 'poetic'
  | 'playful'
  | 'professional'
  | 'childlike';
export type MessageStatus = 'draft' | 'sent';
export type SentVia = 'sms' | 'email' | 'whatsapp' | 'copy' | null;
export type MusicStatus = 'none' | 'pending' | 'generating' | 'ready' | 'failed' | 'queued';
export type TTSStatus   = 'none' | 'generating' | 'ready' | 'failed';
export type TTSVoiceKey = 'homme_neutre' | 'homme_chaleureux' | 'femme_douce' | 'femme_joyeuse' | 'pere_noel' | 'pirate' | 'robot' | 'presentateur' | 'enfant' | 'roi_reine';

export interface Message {
  id: string;
  user_id: string;
  contact_id: string | null;
  contact_name: string;
  contact?: Contact;
  content: string;
  format: MessageFormat;
  tone: MessageTone;
  relation: Relation;
  memories: string | null;
  status: MessageStatus;
  sent_at: string | null;
  sent_via: SentVia;
  reaction: string | null;
  // Génération audio (musique)
  audio_url: string | null;
  music_status: MusicStatus;
  music_service: string | null;
  music_duration_s: number | null;
  // Génération vocale (TTS)
  tts_url: string | null;
  tts_status: TTSStatus;
  tts_voice: string | null;
  // Style visuel
  bg_theme: string | null;
  font_style: string | null;
  font_size: string | null;
  is_italic: boolean | null;
  // Photo attachée
  photo_url: string | null;
  created_at: string;
}

export interface CreateMessageInput {
  contact_id: string;
  format: MessageFormat;
  tone: MessageTone;
  relation: Relation;
  memories?: string;
}

// ── Cagnotte ─────────────────────────────────

export type PotStatus = 'open' | 'completed' | 'closed';

export interface Pot {
  id: string;
  creator_id: string;
  contact_id: string;
  contact?: Contact;
  title: string;
  target_amount: number;
  current_amount: number;
  gift_description: string | null;
  status: PotStatus;
  deadline: string | null;
  purchase_photo_url: string | null;
  share_token: string;
  created_at: string;
}

export interface Contribution {
  id: string;
  pot_id: string;
  contributor_name: string;
  contributor_email: string;
  amount: number;
  stripe_payment_intent: string | null;
  paid_at: string | null;
  created_at: string;
}

// ── Notifications ─────────────────────────────

export type NotificationType = 'birthday_reminder' | 'name_day_reminder' | 'pot_update' | 'system';

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  contact_id: string | null;
  contact?: Contact;
  scheduled_at: string;
  sent_at: string | null;
  read_at: string | null;
  content: string;
  created_at: string;
}

// ── Parrainage ────────────────────────────────

export type ReferralStatus = 'pending' | 'registered' | 'rewarded';

export interface Referral {
  id: string;
  referrer_id: string;
  referred_email: string;
  status: ReferralStatus;
  rewarded_at: string | null;
  created_at: string;
}
