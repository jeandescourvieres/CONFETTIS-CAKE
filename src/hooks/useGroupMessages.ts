import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../stores/authStore';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface GroupMessage {
  id: string;
  message_id: string;
  user_id: string;
  share_token: string;
  label: string;
  contact_name: string;
  is_active: boolean;
  created_at: string;
  signatures?: GroupSignature[];
}

export interface GroupSignature {
  id: string;
  group_message_id: string;
  signer_name: string;
  signer_note: string | null;
  created_at: string;
}

// ── Deep link ─────────────────────────────────────────────────────────────────

export function groupShareUrl(token: string): string {
  return `https://confetticake.fr/group/${token}`;
}

export function groupDeepLink(token: string): string {
  return `confettiscake://group/${token}`;
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/** Récupère le groupe de co-signature associé à un message */
export function useGroupMessage(messageId: string | null) {
  return useQuery({
    queryKey: ['group_messages', 'message', messageId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('group_messages')
        .select('*, signatures:group_signatures(*)')
        .eq('message_id', messageId!)
        .eq('is_active', true)
        .maybeSingle();
      if (error) throw error;
      return data as GroupMessage | null;
    },
    enabled: !!messageId,
  });
}

/** Récupère un groupe par son token public (sans auth) */
export function useGroupMessageByToken(token: string | null) {
  return useQuery({
    queryKey: ['group_messages', 'token', token],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('group_messages')
        .select('*, signatures:group_signatures(*)')
        .eq('share_token', token!)
        .eq('is_active', true)
        .maybeSingle();
      if (error) throw error;
      return data as GroupMessage | null;
    },
    enabled: !!token,
    retry: false,
  });
}

/** Crée un groupe de co-signature pour un message */
export function useCreateGroupMessage() {
  const qc   = useQueryClient();
  const user = useAuthStore((s) => s.user);
  return useMutation({
    mutationFn: async ({
      messageId,
      label,
      contactName,
    }: {
      messageId: string;
      label: string;
      contactName: string;
    }) => {
      const { data, error } = await (supabase as any)
        .from('group_messages')
        .insert({
          message_id:   messageId,
          user_id:      user!.id,
          label,
          contact_name: contactName,
        })
        .select()
        .single();
      if (error) throw error;
      return data as GroupMessage;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['group_messages'] }),
  });
}

/** Ajoute une signature (sans auth) */
export function useAddSignature() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      groupMessageId,
      signerName,
      signerNote,
    }: {
      groupMessageId: string;
      signerName: string;
      signerNote?: string;
    }) => {
      const { data, error } = await (supabase as any)
        .from('group_signatures')
        .insert({
          group_message_id: groupMessageId,
          signer_name:      signerName,
          signer_note:      signerNote ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data as GroupSignature;
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ['group_messages'] }),
  });
}

/** Formate la liste des signataires : "Jean, Marie et 3 autres" */
export function formatSigners(signatures: GroupSignature[], maxShown = 3): string {
  if (!signatures || signatures.length === 0) return '';
  const names = signatures.map((s) => s.signer_name);
  if (names.length <= maxShown) return names.join(', ');
  const shown = names.slice(0, maxShown);
  const rest  = names.length - maxShown;
  return `${shown.join(', ')} et ${rest} autre${rest > 1 ? 's' : ''}`;
}
