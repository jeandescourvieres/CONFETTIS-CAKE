import { supabase } from './supabase';
import type { Message, MessageFormat, MessageTone, Relation } from '../types/models';

// ── Types ────────────────────────────────────────

import type { Occasion, OccasionExtras } from '../stores/createStore';

export interface GenerateMessageInput {
  format: MessageFormat;
  tone: MessageTone;
  relation: string;
  contact_name: string;
  age?: number | null;
  memories?: string | null;
  personality_tags?: string[];
  favourite_color?: string | null;
  occasion: Occasion;
  late_mode?: boolean;
  extras?: OccasionExtras;
  style_hint?: string; // 'Court' | 'Moyen' | 'Long'
  language?: string; // code langue ISO (fr, en, de, es, it...)
  is_regeneration?: boolean; // true = pas de déduction de crédit
  sender_civilite?: 'M.' | 'Mme' | null; // Civilité de l'expéditeur → accord grammatical
  contact_civilite?: 'M.' | 'Mme' | null; // Civilité du destinataire → accord des participes
}

// ── Edge Function ────────────────────────────────

export async function generateMessageContent(input: GenerateMessageInput): Promise<string> {
  const { data, error } = await supabase.functions.invoke('generate-message', {
    body: input,
  });

  if (error) {
    let detail: string = (error as Error).message ?? 'Erreur génération IA';
    try {
      const ctx = (error as unknown as { context?: unknown }).context;
      if (ctx && typeof (ctx as Response).text === 'function') {
        const status = (ctx as Response).status;
        const rawText = await (ctx as Response).text();
        console.log('[generate] HTTP status:', status, '| body:', rawText);
        try {
          const body = JSON.parse(rawText);
          if (body?.error) detail = body.error;
          else detail = rawText;
        } catch {
          detail = `[${status}] ${rawText}`;
        }
      }
    } catch { /* ignore */ }
    throw new Error(detail);
  }

  const raw = (data as { content?: string })?.content;
  if (!raw) throw new Error('Réponse vide du générateur IA');

  // Nettoie les artefacts markdown de Mistral (* " en début/fin)
  const content = raw.trim().replace(/^[*"«\s]+/, '').replace(/[*"»\s]+$/, '').trim();

  // Normalise les sauts de ligne : tous les \n → \n\n pour que l'affichage découpe bien en paragraphes
  const normalized = content.replace(/\r\n/g, '\n').replace(/\n+/g, '\n\n');

  return normalized;
}

// ── CRUD Supabase ────────────────────────────────

export async function fetchMessages(userId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Message[];
}

export async function fetchMessage(id: string): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Message;
}

export async function saveMessage(
  userId: string,
  input: {
    contact_id?: string | null;
    contact_name: string;
    format: MessageFormat;
    tone: MessageTone;
    content: string;
    relation?: Relation;
    memories?: string | null;
  },
): Promise<Message> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('messages') as any)
    .insert({
      user_id: userId,
      contact_id: input.contact_id ?? null,
      contact_name: input.contact_name,
      format: input.format,
      tone: input.tone,
      content: input.content,
      relation: input.relation ?? 'friend',
      memories: input.memories ?? null,
      status: 'draft',
    })
    .select()
    .single();
  if (error) throw error;
  return data as Message;
}

export async function updateMessageContent(id: string, content: string): Promise<Message> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('messages') as any)
    .update({ content })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Message;
}

export async function updateMessageStyle(
  id: string,
  style: {
    bg_theme?: string;
    font_style?: string;
    font_size?: string;
    is_italic?: boolean;
  },
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('messages') as any)
    .update(style)
    .eq('id', id);
  if (error) throw error;
}

export async function updateMessagePhoto(id: string, photoUrl: string | null): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('messages') as any)
    .update({ photo_url: photoUrl })
    .eq('id', id);
  if (error) throw error;
}

export async function markMessageSent(id: string, sentVia: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('messages') as any)
    .update({ status: 'sent', sent_via: sentVia, sent_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteMessage(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');
  const { error } = await supabase.from('messages').delete().eq('id', id).eq('user_id', user.id);
  if (error) throw error;
}

export async function deleteMessages(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');
  const { error } = await supabase.from('messages').delete().in('id', ids).eq('user_id', user.id);
  if (error) throw error;
}
