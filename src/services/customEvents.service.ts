import { supabase } from './supabase';

export interface CustomEvent {
  id: string;
  user_id: string;
  title: string;
  event_date: string; // YYYY-MM-DD
  description: string | null;
  remind_before: number;
  created_at: string;
}

export type NewCustomEvent = Omit<CustomEvent, 'id' | 'user_id' | 'created_at'>;

export async function fetchCustomEvents(userId: string): Promise<CustomEvent[]> {
  const { data, error } = await (supabase as any)
    .from('custom_events')
    .select('*')
    .eq('user_id', userId)
    .order('event_date');
  if (error) throw error;
  return (data ?? []) as CustomEvent[];
}

export async function createCustomEvent(userId: string, input: NewCustomEvent): Promise<CustomEvent> {
  const { data, error } = await (supabase as any)
    .from('custom_events')
    .insert({ ...input, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCustomEvent(
  id: string,
  updates: Partial<NewCustomEvent>,
): Promise<CustomEvent> {
  const { data, error } = await (supabase as any)
    .from('custom_events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCustomEvent(id: string): Promise<void> {
  const { error } = await (supabase as any)
    .from('custom_events')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
