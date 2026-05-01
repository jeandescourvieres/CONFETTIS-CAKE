import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import {
  fetchTemplates,
  fetchScheduledSends,
  createScheduledSend,
  createCustomTemplate,
  updateCustomTemplate,
  deleteCustomTemplate,
  toggleScheduledSend,
  deleteScheduledSend,
} from '../services/autoSends.service';

const TEMPLATES_KEY = 'message_templates';
const SENDS_KEY = 'scheduled_sends';

export function useTemplates() {
  const userId = useAuthStore((s) => s.user?.id ?? '');
  return useQuery({
    queryKey: [TEMPLATES_KEY, userId],
    queryFn: () => fetchTemplates(userId),
    enabled: !!userId,
  });
}

export function useScheduledSends() {
  const userId = useAuthStore((s) => s.user?.id ?? '');
  return useQuery({
    queryKey: [SENDS_KEY, userId],
    queryFn: () => fetchScheduledSends(userId),
    enabled: !!userId,
  });
}

export function useCreateScheduledSend() {
  const userId = useAuthStore((s) => s.user?.id ?? '');
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      template_id: string;
      contact_ids: string[];
      trigger_event: 'birthday' | 'nameday';
      channel: 'sms' | 'email';
    }) => createScheduledSend(userId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [SENDS_KEY] }),
  });
}

export function useCreateCustomTemplate() {
  const userId = useAuthStore((s) => s.user?.id ?? '');
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ title, content }: { title: string; content: string }) =>
      createCustomTemplate(userId, title, content),
    onSuccess: () => qc.invalidateQueries({ queryKey: [TEMPLATES_KEY] }),
  });
}

export function useUpdateCustomTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      updateCustomTemplate(id, content),
    onSuccess: () => qc.invalidateQueries({ queryKey: [TEMPLATES_KEY] }),
  });
}

export function useDeleteCustomTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCustomTemplate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [TEMPLATES_KEY] }),
  });
}

export function useToggleScheduledSend() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      toggleScheduledSend(id, is_active),
    onSuccess: () => qc.invalidateQueries({ queryKey: [SENDS_KEY] }),
  });
}

export function useDeleteScheduledSend() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteScheduledSend(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [SENDS_KEY] }),
  });
}
