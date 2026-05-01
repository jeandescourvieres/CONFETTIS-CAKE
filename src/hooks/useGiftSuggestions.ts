import { useState } from 'react';
import { supabase } from '../services/supabase';

export interface GiftIdea {
  title: string;
  description: string;
  price_range: string;
}

interface SuggestParams {
  contact_name: string;
  relation: string;
  age?: number | null;
  personality_tags?: string[];
  occasion?: string | null;
  budget?: string | null;
}

export function useGiftSuggestions() {
  const [suggestions, setSuggestions] = useState<GiftIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggest = async (params: SuggestParams) => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('suggest-gifts', {
        body: params,
      });
      if (fnError) throw new Error(fnError.message);
      setSuggestions(data?.suggestions ?? []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setSuggestions([]);
    setError(null);
  };

  return { suggest, suggestions, isLoading, error, reset };
}
