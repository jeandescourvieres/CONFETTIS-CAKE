import { useState, useRef, useCallback } from 'react';
import { supabase } from '../services/supabase';

type AssistAction = 'complete' | 'improve' | 'ideas';
type AssistError = string | null;

interface AssistParams {
  text: string;
  action: AssistAction;
  contact_name?: string;
  relation?: string;
  occasion?: string;
}

export function useWritingAssistant() {
  const [completion, setCompletion] = useState<string | null>(null);   // inline ghost text
  const [improved, setImproved] = useState<string | null>(null);       // côte-à-côte amélioration
  const [ideas, setIdeas] = useState<string[]>([]);                    // 3 inspirations
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<AssistAction | null>(null);
  const [error, setError] = useState<AssistError>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const call = useCallback(async (params: AssistParams) => {
    setIsLoading(true);
    setActiveAction(params.action);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('assist-writing', { body: params });
      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);
      if (params.action === 'complete') setCompletion(data?.text ?? null);
      if (params.action === 'improve')  setImproved(data?.text ?? null);
      if (params.action === 'ideas')    setIdeas(data?.ideas ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue');
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  }, []);

  // Déclenche la complétion automatique après 1.5s d'inactivité
  const scheduleCompletion = useCallback((params: Omit<AssistParams, 'action'>) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setCompletion(null); // efface l'ancienne suggestion pendant que l'utilisateur tape
    if (!params.text || params.text.trim().length < 12) return; // trop court pour compléter
    debounceRef.current = setTimeout(() => {
      call({ ...params, action: 'complete' });
    }, 1500);
  }, [call]);

  const cancelCompletion = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setCompletion(null);
  }, []);

  const improve = useCallback((params: Omit<AssistParams, 'action'>) => {
    setImproved(null);
    call({ ...params, action: 'improve' });
  }, [call]);

  const fetchIdeas = useCallback((params: Omit<AssistParams, 'action' | 'text'> & { text?: string }) => {
    setIdeas([]);
    call({ text: '', ...params, action: 'ideas' });
  }, [call]);

  const dismissCompletion = useCallback(() => setCompletion(null), []);
  const dismissImproved  = useCallback(() => setImproved(null), []);
  const dismissIdeas     = useCallback(() => setIdeas([]), []);

  return {
    // Completion
    completion, scheduleCompletion, cancelCompletion, dismissCompletion,
    // Améliorer
    improved, improve, dismissImproved,
    // Idées
    ideas, fetchIdeas, dismissIdeas,
    // État
    isLoading, activeAction, error,
  };
}
