import { supabase } from './supabase';

export interface GroupReminder {
  id: string;
  user_id: string;
  contact_id: string;
  trigger_event: 'birthday' | 'nameday';
  days_before: number;
  content: string | null;
  channel: 'sms' | 'email';
  recipient_contact_ids: string[];
  is_active: boolean;
  last_sent_at: string | null;
  created_at: string;
  // Joined fields
  contact?: { id: string; name: string; birthday: string | null; name_day: string | null };
}

export async function fetchGroupReminders(userId: string): Promise<GroupReminder[]> {
  const { data, error } = await (supabase as any)
    .from('group_reminders')
    .select(`
      *,
      contact:contacts ( id, name, birthday, name_day )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createGroupReminder(
  userId: string,
  payload: {
    contact_id: string;
    trigger_event: 'birthday' | 'nameday';
    days_before: number;
    content: string | null;
    channel: 'sms' | 'email';
    recipient_contact_ids: string[];
  },
): Promise<void> {
  const { error } = await (supabase as any).from('group_reminders').insert({ user_id: userId, ...payload });
  if (error) throw error;
}

export async function toggleGroupReminder(id: string, is_active: boolean): Promise<void> {
  const { error } = await (supabase as any)
    .from('group_reminders')
    .update({ is_active })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteGroupReminder(id: string): Promise<void> {
  const { error } = await (supabase as any)
    .from('group_reminders')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
