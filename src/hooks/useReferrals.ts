import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { fetchReferralHistory, fetchMyReferral, fetchLatestMonthlyChallenge } from '../services/referral.service';

export function useReferralHistory() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['referrals', user?.id],
    queryFn: () => fetchReferralHistory(user!.id),
    enabled: !!user?.id,
  });
}

export function useMyReferral() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['my-referral', user?.id],
    queryFn: () => fetchMyReferral(user!.id),
    enabled: !!user?.id,
  });
}

export function useLatestMonthlyChallenge() {
  return useQuery({
    queryKey: ['referral-monthly-challenge'],
    queryFn: fetchLatestMonthlyChallenge,
  });
}
