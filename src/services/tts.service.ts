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

  if (error) {
    // Essaie d'extraire le vrai message d'erreur depuis le corps JSON
    let msg = error.message ?? 'Erreur de génération vocale';
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body = await (error as any).context?.json?.();
      if (body?.error) msg = body.error;
    } catch { /* ignore */ }
    throw new Error(msg);
  }
  return data;
}

// Sauvegarde le choix de musique de fond pour le lecteur vocal
export async function saveTTSBgMusic(messageId: string, bgMusic: string): Promise<void> {
  await (supabase.from('messages') as any)
    .update({ tts_bg_music: bgMusic })
    .eq('id', messageId);
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
