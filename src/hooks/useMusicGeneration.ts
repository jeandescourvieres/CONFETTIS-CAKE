import { useState, useEffect, useCallback, useRef } from 'react';
import type { MusicStatus } from '../types/models';
import {
  triggerMusicGeneration,
  fetchMusicStatus,
  subscribeMusicReady,
  type MusicGenerationResult,
} from '../services/music.service';

interface UseMusicGenerationOptions {
  messageId: string;
  initialStatus: MusicStatus;
  initialAudioUrl: string | null;
  lyrics: string;
  style: string;
  tone: string;
  userId: string;
}

interface UseMusicGenerationReturn {
  audioUrl: string | null;
  musicStatus: MusicStatus;
  durationS: number | null;
  isLoading: boolean;        // génération en cours (generating | queued)
  isReady: boolean;          // audio disponible
  isFailed: boolean;
  isQueued: boolean;
  trigger: () => Promise<void>;  // déclenche manuellement
  error: string | null;
}

export function useMusicGeneration({
  messageId,
  initialStatus,
  initialAudioUrl,
  lyrics,
  style,
  tone,
  userId,
}: UseMusicGenerationOptions): UseMusicGenerationReturn {
  const [musicStatus, setMusicStatus] = useState<MusicStatus>(initialStatus);
  const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl);
  const [durationS, setDurationS] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  // S'abonner aux changements Realtime quand la génération est en cours
  const startListening = useCallback(() => {
    // Éviter les doublons
    if (unsubscribeRef.current) return;

    const unsubscribe = subscribeMusicReady(
      messageId,
      (result: MusicGenerationResult) => {
        setAudioUrl(result.audio_url);
        setMusicStatus('ready');
        setDurationS(result.music_duration_s);
        setIsLoading(false);
        unsubscribeRef.current?.();
        unsubscribeRef.current = null;
      },
      () => {
        setMusicStatus('failed');
        setIsLoading(false);
        setError('La génération a échoué. Réessayez dans quelques instants.');
        unsubscribeRef.current?.();
        unsubscribeRef.current = null;
      },
    );

    unsubscribeRef.current = unsubscribe;
  }, [messageId]);

  // Polling de secours si Realtime non disponible (toutes les 10s)
  useEffect(() => {
    if (musicStatus !== 'generating' && musicStatus !== 'queued') return;

    const interval = setInterval(async () => {
      const result = await fetchMusicStatus(messageId);
      if (!result) return;

      if (result.music_status === 'ready' && result.audio_url) {
        setAudioUrl(result.audio_url);
        setMusicStatus('ready');
        setDurationS(result.music_duration_s);
        setIsLoading(false);
        clearInterval(interval);
      } else if (result.music_status === 'failed') {
        setMusicStatus('failed');
        setIsLoading(false);
        setError('La génération a échoué. Réessayez dans quelques instants.');
        clearInterval(interval);
      }
    }, 10_000);

    return () => clearInterval(interval);
  }, [musicStatus, messageId]);

  // Si déjà en cours lors du montage, se connecter au Realtime
  useEffect(() => {
    if (initialStatus === 'generating' || initialStatus === 'queued') {
      setIsLoading(true);
      startListening();
    }
    return () => {
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
    };
  }, []);

  const trigger = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    setMusicStatus('generating');

    try {
      const result = await triggerMusicGeneration({
        message_id: messageId,
        user_id: userId,
        lyrics,
        style,
        tone,
      });

      if (result.status === 'ready' && result.audio_url) {
        setAudioUrl(result.audio_url);
        setMusicStatus('ready');
        setIsLoading(false);
      } else {
        // Mis en file d'attente
        setMusicStatus('queued');
        startListening();
      }
    } catch (err) {
      setIsLoading(false);
      setMusicStatus('failed');
      setError(err instanceof Error ? err.message : 'Erreur de génération');
    }
  }, [isLoading, messageId, userId, lyrics, style, tone, startListening]);

  return {
    audioUrl,
    musicStatus,
    durationS,
    isLoading,
    isReady: musicStatus === 'ready' && audioUrl !== null,
    isFailed: musicStatus === 'failed',
    isQueued: musicStatus === 'queued',
    trigger,
    error,
  };
}
