// ═══════════════════════════════════════════════════════════
//  Confettis & Cake — Quota QR code (palier gratuit avant mur Premium)
// ═══════════════════════════════════════════════════════════

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../stores/authStore';

export const QR_FREE_QUOTA = 3;

export function useQrQuota(messageId: string | undefined) {
  const userId = useAuthStore((s) => s.profile?.id);
  const isPremium = useAuthStore((s) => s.profile?.plan === 'premium');
  const queryClient = useQueryClient();

  const { data: generatedIds = [], isLoading } = useQuery({
    queryKey: ['qr-generations', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('qr_generations')
        .select('message_id')
        .eq('user_id', userId);
      if (error) throw error;
      return (data ?? []).map((row) => row.message_id as string);
    },
    enabled: !!userId,
  });

  const alreadyGenerated = !!messageId && generatedIds.includes(messageId);
  const isLocked = !isPremium && !alreadyGenerated && generatedIds.length >= QR_FREE_QUOTA;
  const remaining = Math.max(0, QR_FREE_QUOTA - generatedIds.length);

  const { mutate: registerGeneration } = useMutation({
    mutationFn: async () => {
      if (!userId || !messageId || alreadyGenerated) return;
      const { error } = await supabase
        .from('qr_generations')
        .upsert({ user_id: userId, message_id: messageId }, { onConflict: 'user_id,message_id', ignoreDuplicates: true });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['qr-generations', userId] }),
  });

  return { isLoading, isLocked, isPremium, alreadyGenerated, remaining, registerGeneration };
}
