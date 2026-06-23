import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import {
  fetchGroupReminders,
  createGroupReminder,
  toggleGroupReminder,
  deleteGroupReminder,
} from '../services/groupReminders.service';

const KEY = 'group_reminders';

export function useGroupReminders() {
  const userId = useAuthStore((s) => s.user?.id ?? '');
  return useQuery({
    queryKey: [KEY, userId],
    queryFn: () => fetchGroupReminders(userId),
    enabled: !!userId,
  });
}

export function useCreateGroupReminder() {
  const userId = useAuthStore((s) => s.user?.id ?? '');
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      contact_id: string;
      trigger_event: 'birthday' | 'nameday';
      days_before: number;
      content: string | null;
      channel: 'sms' | 'email';
      recipient_contact_ids: string[];
    }) => createGroupReminder(userId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useToggleGroupReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) => toggleGroupReminder(id, is_active),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeleteGroupReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGroupReminder(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
