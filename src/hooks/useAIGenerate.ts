import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { useCreateStore } from '../stores/createStore';
import { generateMessageContent, saveMessage } from '../services/messages.service';

/**
 * Hook qui orchestre la génération IA + sauvegarde du message en DB.
 * Utilise le store Zustand `createStore` comme source de vérité.
 */
export function useAIGenerate() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const { i18n } = useTranslation();

  const {
    contactId,
    contactName,
    relation,
    occasion,
    age,
    extras,
    personalityTags,
    memories,
    lateMode,
    format,
    tone,
    setGeneratedContent,
    setSavedMessageId,
    setIsGenerating,
    setGenerationError,
  } = useCreateStore();


  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Non authentifié');

      const content = await generateMessageContent({
        format,
        tone,
        relation,
        contact_name: contactName,
        age: age ?? null,
        memories: memories || null,
        personality_tags: personalityTags,
        occasion,
        late_mode: lateMode,
        extras,
        language: i18n.language, // passe la langue choisie par l'utilisateur
      });

      const saved = await saveMessage(user.id, {
        contact_id: contactId,
        contact_name: contactName,
        format,
        tone,
        content,
        relation,
        memories: memories || null,
      });

      return { content, messageId: saved.id };
    },
    onMutate: () => {
      setIsGenerating(true);
      setGenerationError(null);
    },
    onSuccess: ({ content, messageId }) => {
      setGeneratedContent(content);
      setSavedMessageId(messageId);
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la génération.';
      setGenerationError(msg);
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });

  const generate = useCallback(() => {
    if (!contactName.trim()) {
      setGenerationError('Veuillez entrer un prénom.');
      return;
    }
    mutation.mutate();
  }, [mutation, contactName, setGenerationError]);

  return {
    generate,
    isPending: mutation.isPending,
  };
}

// ── Messages list hook ────────────────────────────

import { useQuery } from '@tanstack/react-query';
import { fetchMessages, fetchMessage } from '../services/messages.service';

export function useMessages() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['messages', user?.id],
    queryFn: () => fetchMessages(user!.id),
    enabled: !!user,
  });
}

export function useMessage(id: string | null) {
  return useQuery({
    queryKey: ['messages', id],
    queryFn: () => fetchMessage(id!),
    enabled: !!id,
  });
}
