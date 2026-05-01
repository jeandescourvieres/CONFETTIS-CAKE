import { supabase } from './supabase';
import type { TTSStatus, TTSVoiceKey } from '../types/models';

export interface TTSResult {
  tts_url:    string | null;
  tts_status: TTSStatus;
  tts_voice:  string | null;
}

// Déclenche la génération TTS via l'Edge Function generate-tts (synchrone)
export async function triggerTTSGeneration(params: {
  message_id: string;
  text:       string;
  voice_key:  TTSVoiceKey;
}): Promise<{ status: TTSStatus; tts_url?: string }> {
  const { data, error } = await supabase.functions.invoke('generate-tts', {
    body: params,
  });

  if (error) throw new Error(error.message);
  return data;
}

// Récupère l'état TTS actuel pour un message
export async function fetchTTSStatus(messageId: string): Promise<TTSResult | null> {
  const { data, error } = await (supabase.from('messages') as any)
    .select('tts_url, tts_status, tts_voice')
    .eq('id', messageId)
    .single();

  if (error || !data) return null;
  return data as TTSResult;
}
