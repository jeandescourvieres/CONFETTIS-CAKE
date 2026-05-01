import { useState, useCallback } from 'react';
import type { TTSStatus, TTSVoiceKey } from '../types/models';
import { triggerTTSGeneration } from '../services/tts.service';

interface UseTTSGenerationReturn {
  ttsUrl:     string | null;
  ttsStatus:  TTSStatus;
  ttsVoice:   TTSVoiceKey | null;
  isLoading:  boolean;
  isReady:    boolean;
  isFailed:   boolean;
  error:      string | null;
  generate:   (messageId: string, text: string, voiceKey: TTSVoiceKey) => Promise<void>;
  reset:      () => void;
}

export function useTTSGeneration(): UseTTSGenerationReturn {
  const [ttsUrl,    setTtsUrl]    = useState<string | null>(null);
  const [ttsStatus, setTtsStatus] = useState<TTSStatus>('none');
  const [ttsVoice,  setTtsVoice]  = useState<TTSVoiceKey | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const generate = useCallback(async (
    messageId: string,
    text:       string,
    voiceKey:   TTSVoiceKey,
  ) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    setTtsStatus('generating');
    setTtsVoice(voiceKey);

    try {
      const result = await triggerTTSGeneration({ message_id: messageId, text, voice_key: voiceKey });

      if (result.status === 'ready' && result.tts_url) {
        setTtsUrl(result.tts_url);
        setTtsStatus('ready');
      } else {
        throw new Error('Génération terminée sans URL audio');
      }
    } catch (err) {
      setTtsStatus('failed');
      setError(err instanceof Error ? err.message : 'Erreur de génération vocale');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const reset = useCallback(() => {
    setTtsUrl(null);
    setTtsStatus('none');
    setTtsVoice(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    ttsUrl,
    ttsStatus,
    ttsVoice,
    isLoading,
    isReady:  ttsStatus === 'ready' && ttsUrl !== null,
    isFailed: ttsStatus === 'failed',
    error,
    generate,
    reset,
  };
}
