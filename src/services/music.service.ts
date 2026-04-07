import { supabase } from './supabase';
import type { MusicStatus } from '../types/models';

export interface MusicGenerationResult {
  audio_url: string | null;
  music_status: MusicStatus;
  music_service: string | null;
  music_duration_s: number | null;
}

// Déclenche la génération musicale via l'Edge Function generate-music
export async function triggerMusicGeneration(params: {
  message_id: string;
  user_id: string;
  lyrics: string;
  style: string;
  tone: string;
}): Promise<{ status: 'ready' | 'queued'; audio_url?: string; queue_id?: string }> {
  const { data, error } = await supabase.functions.invoke('generate-music', {
    body: params,
  });

  if (error) throw new Error(error.message);
  return data;
}

// Récupère l'état actuel de la musique pour un message
export async function fetchMusicStatus(messageId: string): Promise<MusicGenerationResult | null> {
  const { data, error } = await (supabase.from('messages') as any)
    .select('audio_url, music_status, music_service, music_duration_s')
    .eq('id', messageId)
    .single();

  if (error || !data) return null;
  return data as MusicGenerationResult;
}

// S'abonne aux changements Realtime d'un message pour détecter quand l'audio est prêt
export function subscribeMusicReady(
  messageId: string,
  onReady: (result: MusicGenerationResult) => void,
  onFailed: () => void,
): () => void {
  const channel = supabase
    .channel(`music_status_${messageId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `id=eq.${messageId}`,
      },
      (payload) => {
        const row = payload.new as MusicGenerationResult & { music_status: MusicStatus };
        if (row.music_status === 'ready' && row.audio_url) {
          onReady(row);
        } else if (row.music_status === 'failed') {
          onFailed();
        }
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
