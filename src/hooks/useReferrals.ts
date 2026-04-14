import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { fetchReferralHistory } from '../services/referral.service';

export function useReferralHistory() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['referrals', user?.id],
    queryFn: () => fetchReferralHistory(user!.id),
    enabled: !!user?.id,
  });
}
