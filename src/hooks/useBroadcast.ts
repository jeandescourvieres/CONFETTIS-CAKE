import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { fetchTemplates } from '../services/autoSends.service';
import { sendBroadcast } from '../services/broadcast.service';

export const BROADCAST_OCCASIONS = [
  'newyear', 'christmas', 'easter', 'greetings',
  'valentines', 'mothersday', 'fathersday', 'halloween',
];

export function useBroadcastTemplates() {
  const userId = useAuthStore((s) => s.user?.id ?? '');
  return useQuery({
    queryKey: ['message_templates', 'broadcast', userId],
    queryFn: () => fetchTemplates(userId, BROADCAST_OCCASIONS),
    enabled: !!userId,
  });
}

export function useSendBroadcast() {
  return useMutation({ mutationFn: sendBroadcast });
}
