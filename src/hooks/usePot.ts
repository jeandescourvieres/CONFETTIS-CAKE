import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import {
  fetchMyPots,
  fetchPot,
  fetchContributions,
  createPot,
  updatePotStatus,
  updatePotDeadline,
  updatePotGiftDescription,
  watchPot,
  unwatchPot,
} from '../services/pot.service';
import type { PotStatus } from '../types/models';

const POTS_KEY = 'pots';

// ── Liste des cagnottes de l'utilisateur ──────────────────────────────────────

export function useMyPots() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: [POTS_KEY, 'mine', user?.id],
    queryFn: () => fetchMyPots(user!.id),
    enabled: !!user,
  });
}

// ── Détail d'une cagnotte ─────────────────────────────────────────────────────

export function usePot(id: string | null) {
  return useQuery({
    queryKey: [POTS_KEY, id],
    queryFn: () => fetchPot(id!),
    enabled: !!id,
  });
}

// ── Contributions d'une cagnotte ──────────────────────────────────────────────

export function useContributions(potId: string | null) {
  return useQuery({
    queryKey: ['contributions', potId],
    queryFn: () => fetchContributions(potId!),
    enabled: !!potId,
    refetchInterval: 30_000, // poll toutes les 30s pour voir les nouvelles contributions
  });
}

// ── Créer une cagnotte ────────────────────────────────────────────────────────

export function useCreatePot() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (input: {
      contact_id: string;
      title: string;
      target_amount: number;
      gift_description?: string | null;
      deadline?: string | null;
    }) => createPot(user!.id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POTS_KEY, 'mine', user?.id] });
    },
  });
}

// ── Changer le statut ─────────────────────────────────────────────────────────

export function useUpdatePotStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PotStatus }) =>
      updatePotStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [POTS_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [POTS_KEY, 'mine'] });
    },
  });
}

// ── Prolonger la deadline ─────────────────────────────────────────────────────

export function useUpdatePotDeadline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, deadline }: { id: string; deadline: string }) =>
      updatePotDeadline(id, deadline),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [POTS_KEY, id] });
    },
  });
}

// ── Modifier la description cadeau ────────────────────────────────────────────

export function useUpdatePotGift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, gift_description }: { id: string; gift_description: string }) =>
      updatePotGiftDescription(id, gift_description),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [POTS_KEY, id] });
    },
  });
}

// ── Suivre / ne plus suivre une cagnotte ──────────────────────────────────────

export function useWatchPot(potId: string | null) {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const watch = useMutation({
    mutationFn: () => watchPot(potId!, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [POTS_KEY, potId] }),
  });

  const unwatch = useMutation({
    mutationFn: () => unwatchPot(potId!, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [POTS_KEY, potId] }),
  });

  return { watch, unwatch };
}
