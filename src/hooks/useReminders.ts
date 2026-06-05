import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../stores/authStore';

// ── Types ─────────────────────────────────────────────────────────────────────

export type Recurrence = 'weekly' | 'monthly' | 'yearly' | 'once';

export interface Reminder {
  id: string;
  user_id: string;
  contact_id: string | null;
  contact?: { id: string; name: string } | null;
  title: string;
  recurrence: Recurrence;
  day_of_week:  number | null;  // 0=Sun
  day_of_month: number | null;
  month:        number | null;
  once_date:    string | null;  // YYYY-MM-DD
  is_active: boolean;
  created_at: string;
}

export interface CreateReminderInput {
  contact_id?:  string | null;
  title:        string;
  recurrence:   Recurrence;
  day_of_week?:  number | null;
  day_of_month?: number | null;
  month?:        number | null;
  once_date?:    string | null;
}

// ── Labels ────────────────────────────────────────────────────────────────────

const DOW_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const DOW_FULL = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const MONTH_FR = ['', 'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
                  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

export function recurrenceLabel(r: Reminder): string {
  switch (r.recurrence) {
    case 'weekly':
      return `Chaque ${DOW_FULL[r.day_of_week ?? 0]}`;
    case 'monthly':
      return `Le ${r.day_of_month} de chaque mois`;
    case 'yearly':
      return `Chaque ${r.day_of_month} ${MONTH_FR[r.month ?? 1]}`;
    case 'once':
      if (r.once_date) {
        try {
          const [y, m, d] = r.once_date.split('-');
          return `Le ${Number(d)} ${MONTH_FR[Number(m)]} ${y}`;
        } catch { return r.once_date; }
      }
      return 'Date unique';
    default:
      return '';
  }
}

export { DOW_FR, DOW_FULL, MONTH_FR };

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useReminders() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['reminders', user?.id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('reminders')
        .select('*, contact:contacts(id, name)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Reminder[];
    },
    enabled: !!user,
  });
}

export function useCreateReminder() {
  const qc   = useQueryClient();
  const user = useAuthStore((s) => s.user);
  return useMutation({
    mutationFn: async (input: CreateReminderInput) => {
      const { data, error } = await (supabase as any)
        .from('reminders')
        .insert({ ...input, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data as Reminder;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reminders'] }),
  });
}

export function useToggleReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await (supabase as any)
        .from('reminders')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reminders'] }),
  });
}

export function useUpdateReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: { id: string } & CreateReminderInput) => {
      const { error } = await (supabase as any)
        .from('reminders')
        .update(input)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reminders'] }),
  });
}

export function useDeleteReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from('reminders').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reminders'] }),
  });
}
