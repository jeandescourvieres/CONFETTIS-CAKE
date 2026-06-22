import type { Profile } from '../types/models';

export function getTrialDaysLeft(profile: Pick<Profile, 'plan' | 'trial_ends_at'> | null): number | null {
  if (!profile || profile.plan !== 'premium' || !profile.trial_ends_at) return null;
  const msLeft = new Date(profile.trial_ends_at).getTime() - Date.now();
  if (msLeft <= 0) return null;
  return Math.ceil(msLeft / (24 * 60 * 60 * 1000));
}

export function isTrialEnded(profile: Pick<Profile, 'plan' | 'trial_ends_at'> | null): boolean {
  if (!profile || profile.plan !== 'free' || !profile.trial_ends_at) return false;
  return new Date(profile.trial_ends_at).getTime() < Date.now();
}
