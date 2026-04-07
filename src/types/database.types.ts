// ═══════════════════════════════════════════════
//  Types générés depuis le schéma Supabase
//  (À regénérer via : npx supabase gen types typescript)
// ═══════════════════════════════════════════════

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          plan: 'free' | 'premium';
          referral_code: string;
          credits: number;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: 'free' | 'premium';
          referral_code?: string;
          credits?: number;
          created_at?: string;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: 'free' | 'premium';
          credits?: number;
        };
      };
      contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          birthday: string | null;
          name_day: string | null;
          relation: 'best_friend' | 'friend' | 'family' | 'partner' | 'colleague' | 'other';
          phone: string | null;
          email: string | null;
          notes: string | null;
          avatar_url: string | null;
          imported_from: 'phone' | 'manual' | null;
          personality_tags: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          birthday?: string | null;
          name_day?: string | null;
          relation?: 'best_friend' | 'friend' | 'family' | 'partner' | 'colleague' | 'other';
          phone?: string | null;
          email?: string | null;
          notes?: string | null;
          avatar_url?: string | null;
          imported_from?: 'phone' | 'manual' | null;
          personality_tags?: string[];
        };
        Update: {
          name?: string;
          birthday?: string | null;
          name_day?: string | null;
          relation?: 'best_friend' | 'friend' | 'family' | 'partner' | 'colleague' | 'other';
          phone?: string | null;
          email?: string | null;
          notes?: string | null;
          avatar_url?: string | null;
          personality_tags?: string[];
        };
      };
      messages: {
        Row: {
          id: string;
          user_id: string;
          contact_id: string;
          content: string;
          format: 'song' | 'poem' | 'message' | 'joke';
          tone: 'humorous' | 'touching' | 'poetic' | 'playful' | 'professional';
          relation: 'best_friend' | 'friend' | 'family' | 'partner' | 'colleague' | 'other';
          memories: string | null;
          status: 'draft' | 'sent';
          sent_at: string | null;
          sent_via: 'sms' | 'email' | 'whatsapp' | 'copy' | null;
          reaction: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          contact_id: string;
          content: string;
          format: 'song' | 'poem' | 'message' | 'joke';
          tone: 'humorous' | 'touching' | 'poetic' | 'playful' | 'professional';
          relation: 'best_friend' | 'friend' | 'family' | 'partner' | 'colleague' | 'other';
          memories?: string | null;
          status?: 'draft' | 'sent';
        };
        Update: {
          content?: string;
          status?: 'draft' | 'sent';
          sent_at?: string | null;
          sent_via?: 'sms' | 'email' | 'whatsapp' | 'copy' | null;
          reaction?: string | null;
        };
      };
      pots: {
        Row: {
          id: string;
          creator_id: string;
          contact_id: string;
          title: string;
          target_amount: number;
          current_amount: number;
          gift_description: string | null;
          status: 'open' | 'completed' | 'closed';
          deadline: string | null;
          purchase_photo_url: string | null;
          share_token: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          contact_id: string;
          title: string;
          target_amount: number;
          current_amount?: number;
          gift_description?: string | null;
          status?: 'open' | 'completed' | 'closed';
          deadline?: string | null;
          share_token?: string;
        };
        Update: {
          title?: string;
          target_amount?: number;
          current_amount?: number;
          gift_description?: string | null;
          status?: 'open' | 'completed' | 'closed';
          purchase_photo_url?: string | null;
        };
      };
      contributions: {
        Row: {
          id: string;
          pot_id: string;
          contributor_name: string;
          contributor_email: string;
          amount: number;
          stripe_payment_intent: string | null;
          paid_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          pot_id: string;
          contributor_name: string;
          contributor_email: string;
          amount: number;
          stripe_payment_intent?: string | null;
        };
        Update: {
          stripe_payment_intent?: string | null;
          paid_at?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'birthday_reminder' | 'name_day_reminder' | 'pot_update' | 'system';
          contact_id: string | null;
          scheduled_at: string;
          sent_at: string | null;
          read_at: string | null;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'birthday_reminder' | 'name_day_reminder' | 'pot_update' | 'system';
          contact_id?: string | null;
          scheduled_at: string;
          content: string;
        };
        Update: {
          sent_at?: string | null;
          read_at?: string | null;
        };
      };
      referrals: {
        Row: {
          id: string;
          referrer_id: string;
          referred_email: string;
          status: 'pending' | 'registered' | 'rewarded';
          rewarded_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          referrer_id: string;
          referred_email: string;
          status?: 'pending' | 'registered' | 'rewarded';
        };
        Update: {
          status?: 'pending' | 'registered' | 'rewarded';
          rewarded_at?: string | null;
        };
      };
      custom_events: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          event_date: string;
          description: string | null;
          remind_before: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          event_date: string;
          description?: string | null;
          remind_before?: number;
          created_at?: string;
        };
        Update: {
          title?: string;
          event_date?: string;
          description?: string | null;
          remind_before?: number;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
