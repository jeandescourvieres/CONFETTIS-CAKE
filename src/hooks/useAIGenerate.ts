import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { useCreateStore } from '../stores/createStore';
import { extractFirstName } from '../utils/nameHelpers';
import { generateMessageContent, saveMessage } from '../services/messages.service';

/**
 * Hook qui orchestre la génération IA + sauvegarde du message en DB.
 * Utilise le store Zustand `createStore` comme source de vérité.
 */
export function useAIGenerate(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const { i18n } = useTranslation();

  const {
    contactId,
    contactName,
    contactCivilite,
    relation,
    familySubRelation,
    petSubRelation,
    occasion,
    age,
    extras,
    personalityTags,
    petPersonalityTags,
    favouriteColor,
    memories,
    lateMode,
    format,
    tone,
    styleHint,
    messageLanguage,
    savedMessageId,
    setGeneratedContent,
    setSavedMessageId,
    setIsGenerating,
    setGenerationError,
  } = useCreateStore();

  // contactName stocké en "NOM Prénom" — on envoie seulement le prénom à l'IA
  const firstName = extractFirstName(contactName);

  // Pour "famille", on affine la relation si une sous-relation est définie
  // Pour "boule de poils", on précise le type d'animal
  const effectiveRelation = relation === 'family' && familySubRelation.trim()
    ? familySubRelation.trim()
    : relation === 'pet' && petSubRelation.trim()
    ? `${petSubRelation.trim()} (animal de compagnie)`
    : relation;


  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Non authentifié');

      // Pour les animaux, on envoie les tags spécifiques à l'espèce
      const activeTags = relation === 'pet' ? petPersonalityTags : personalityTags;

      const content = await generateMessageContent({
        format,
        tone,
        relation: effectiveRelation,
        contact_name: firstName,
        age: age ?? null,
        memories: memories || null,
        personality_tags: activeTags,
        favourite_color: favouriteColor ?? null,
        occasion,
        late_mode: lateMode,
        extras,
        style_hint: styleHint || undefined,
        language: messageLanguage,
        is_regeneration: !!savedMessageId,
        sender_civilite: profile?.civilite ?? null,
        contact_civilite: contactCivilite ?? null,
      });

      const saved = await saveMessage(user.id, {
        contact_id: contactId,
        contact_name: firstName,
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
      onSuccess?.();
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error
        ? err.message
        : (err as { message?: string })?.message ?? JSON.stringify(err);
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

export function useContactMessages(contactId: string | null) {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['messages', user?.id, 'contact', contactId],
    queryFn: async () => {
      const all = await fetchMessages(user!.id);
      return all.filter((m) => m.contact_id === contactId);
    },
    enabled: !!user && !!contactId,
  });
}
