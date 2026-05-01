import { supabase } from './supabase';

export interface CardTemplate {
  id: string;
  user_id: string | null;
  title: string;
  content: string;
  tone: string;
  is_system: boolean;
  created_at: string;
}

export interface ScheduledSend {
  id: string;
  user_id: string;
  template_id: string;
  contact_id: string;
  trigger_event: 'birthday' | 'nameday';
  channel: 'sms' | 'email';
  is_active: boolean;
  last_sent_at: string | null;
  created_at: string;
  // Joined fields
  template?: CardTemplate;
  contact?: { id: string; name: string; phone: string | null; email: string | null };
}

// ── Templates ────────────────────────────────────────────────────────────────

export async function fetchTemplates(userId: string): Promise<CardTemplate[]> {
  const { data, error } = await (supabase as any)
    .from('message_templates')
    .select('*')
    .or(`user_id.is.null,user_id.eq.${userId}`)
    .order('is_system', { ascending: false })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createCustomTemplate(
  userId: string,
  title: string,
  content: string,
): Promise<CardTemplate> {
  const { data, error } = await (supabase as any)
    .from('message_templates')
    .insert({ user_id: userId, title, content, tone: 'custom', is_system: false })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCustomTemplate(
  id: string,
  content: string,
): Promise<void> {
  const { error } = await (supabase as any)
    .from('message_templates')
    .update({ content })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteCustomTemplate(id: string): Promise<void> {
  const { error } = await (supabase as any)
    .from('message_templates')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ── Scheduled sends ──────────────────────────────────────────────────────────

export async function fetchScheduledSends(userId: string): Promise<ScheduledSend[]> {
  const { data, error } = await (supabase as any)
    .from('scheduled_sends')
    .select(`
      *,
      template:message_templates(id, title, content, tone, is_system),
      contact:contacts(id, name, phone, email)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as ScheduledSend[];
}

export async function createScheduledSend(
  userId: string,
  payload: {
    template_id: string;
    contact_ids: string[];
    trigger_event: 'birthday' | 'nameday';
    channel: 'sms' | 'email';
  },
): Promise<void> {
  const rows = payload.contact_ids.map((contact_id) => ({
    user_id: userId,
    template_id: payload.template_id,
    contact_id,
    trigger_event: payload.trigger_event,
    channel: payload.channel,
  }));
  const { error } = await (supabase as any).from('scheduled_sends').insert(rows);
  if (error) throw error;
}

export async function toggleScheduledSend(id: string, is_active: boolean): Promise<void> {
  const { error } = await (supabase as any)
    .from('scheduled_sends')
    .update({ is_active })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteScheduledSend(id: string): Promise<void> {
  const { error } = await (supabase as any)
    .from('scheduled_sends')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ── Utilitaire ───────────────────────────────────────────────────────────────

/** Remplace {prenom} par le prénom du contact */
export function renderTemplate(content: string, contactName: string): string {
  const firstName = contactName.split(' ').slice(1).join(' ') || contactName.split(' ')[0];
  return content.replace(/\{prenom\}/gi, firstName);
}
