import { supabase } from './supabase';

export interface BroadcastResult {
  sent: number;
  skipped: number;
  total: number;
}

export async function sendBroadcast(input: {
  contact_ids: string[];
  content: string;
  occasion: string;
  channel: 'sms' | 'email';
}): Promise<BroadcastResult> {
  const { data, error } = await supabase.functions.invoke('send-broadcast', { body: input });
  if (error) throw error;
  return data as BroadcastResult;
}
