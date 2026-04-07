import { useQuery } from '@tanstack/react-query';
import { fetchCardTemplates, fetchCardTemplate } from '../services/cards.service';
import type { CardMode } from '../services/cards.service';

const STALE = 1000 * 60 * 60; // 1h — contenu statique

export function useCardTemplates(
  occasion?: string | null,
  mood?: string | null,
  mode?: CardMode | null,
) {
  return useQuery({
    queryKey: ['cards', occasion ?? 'all', mood ?? 'all', mode ?? 'all'],
    queryFn: () => fetchCardTemplates(occasion, mood, mode),
    staleTime: STALE,
  });
}

export function useCardTemplate(id: string | null) {
  return useQuery({
    queryKey: ['card', id],
    queryFn: () => fetchCardTemplate(id!),
    enabled: !!id,
    staleTime: STALE,
  });
}
