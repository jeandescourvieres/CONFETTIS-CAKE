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
  occasion: Occasion;
  late_mode?: boolean;
  extras?: OccasionExtras;
  language?: string; // code langue ISO (fr, en, de, es, it...)
}

// ── Edge Function ────────────────────────────────

export async function generateMessageContent(input: GenerateMessageInput): Promise<string> {
  const { data, error } = await supabase.functions.invoke('generate-message', {
    body: input,
  });

  if (error) throw new Error(error.message ?? 'Erreur génération IA');

  const content = (data as { content?: string })?.content;
  if (!content) throw new Error('Réponse vide du générateur IA');

  return content;
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

export async function markMessageSent(id: string, sentVia: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('messages') as any)
    .update({ status: 'sent', sent_via: sentVia, sent_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteMessage(id: string): Promise<void> {
  const { error } = await supabase.from('messages').delete().eq('id', id);
  if (error) throw error;
}
