// ═══════════════════════════════════════════════════════════════
//  Confettis & Cake — Hook Notifications
// ═══════════════════════════════════════════════════════════════

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import type { AppNotification } from '../types/models';

// ── Liste des notifications de l'utilisateur ──────────────────
export function useAppNotifications() {
  return useQuery({
    queryKey: ['app_notifications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from('notifications')
        .select('*, contact:contacts(*)')
        .eq('user_id', user.id)
        .order('scheduled_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data ?? []) as AppNotification[];
    },
  });
}

// ── Nombre de notifications non lues ─────────────────────────
export function useUnreadCount() {
  const { data = [] } = useAppNotifications();
  return data.filter((n) => !n.read_at).length;
}

// ── Marquer comme lu ──────────────────────────────────────────
export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('notifications') as any)
        .update({ read_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['app_notifications'] }),
  });
}

// ── Marquer toutes comme lues ─────────────────────────────────
export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('notifications') as any)
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .is('read_at', null);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['app_notifications'] }),
  });
}
