import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../services/supabase';
import {
  fetchCustomEvents,
  createCustomEvent,
  updateCustomEvent,
  deleteCustomEvent,
  type NewCustomEvent,
} from '../services/customEvents.service';

const KEY = 'custom_events';

export function useCustomEvents() {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`custom_events:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'custom_events',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: [KEY, userId] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return useQuery({
    queryKey: [KEY, userId],
    queryFn: () => fetchCustomEvents(userId!),
    enabled: !!userId,
    staleTime: 0,
  });
}

export function useUpcomingCustomEvents(limitDays = 365) {
  const { data = [] } = useCustomEvents();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return data.filter((e) => {
    // Parsez la date en local (évite le décalage UTC de new Date("YYYY-MM-DD"))
    const [y, mo, d] = e.event_date.split('-').map(Number);
    const eventDate = new Date(y, mo - 1, d);
    const diff = Math.ceil((eventDate.getTime() - today.getTime()) / 86400000);
    return diff >= 0 && diff <= limitDays;
  });
}

export function useCreateCustomEvent() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);
  return useMutation({
    mutationFn: (input: NewCustomEvent) => createCustomEvent(userId!, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY, userId] }),
  });
}

export function useUpdateCustomEvent() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<NewCustomEvent> }) =>
      updateCustomEvent(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY, userId] }),
  });
}

export function useDeleteCustomEvent() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);
  return useMutation({
    mutationFn: (id: string) => deleteCustomEvent(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY, userId] }),
  });
}
