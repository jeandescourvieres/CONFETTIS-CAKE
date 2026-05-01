import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Dimensions, ActivityIndicator, Share,
} from 'react-native';
import * as Linking from 'expo-linking';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCardTemplate } from '../../../src/hooks/useCards';
import { CardComposer } from '../../../src/components/cards/CardComposer';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useCreateStore } from '../../../src/stores/createStore';
import { useColors } from '../../../src/hooks/useColors';

const { width: W, height: H } = Dimensions.get('window');

// Hauteur de la carte : format portrait 9/16, ajustée à la largeur disponible
const CARD_W = W;
const CARD_H = CARD_W * (16 / 9);

export default function CardPreviewScreen() {
  const C = useColors();
  const router = useRouter();
  const { id, contactName: paramName, contactId } = useLocalSearchParams<{
    id: string;
    contactName?: string;
    contactId?: string;
  }>();

  const { data: template, isLoading, isError } = useCardTemplate(id);
  const [recipientName, setRecipientName] = useState(paramName ?? '');
  const [nameEditing, setNameEditing] = useState(false);

  const handleShare = useCallback(async () => {
    try {
      const cardLink = Linking.createURL(`card/${id}`, {
        queryParams: { name: recipientName || '' },
      });
      await Share.share({
        message: `🎉 ${recipientName || 'Quelqu\'un'} t'a envoyé une carte animée !\n\nOuvre ce lien pour la voir : ${cardLink}\n\n— Créé avec Confettis & Cake`,
        url: cardLink,
      });
    } catch {
      // Annulé par l'utilisateur
    }
  }, [recipientName, id]);

  const handleCreateMessage = useCallback(() => {
    if (!id) return;
    const store = useCreateStore.getState();
    store.setCardTemplateId(id);
    // Pré-remplir le contact si on vient d'une fiche contact
    if (contactId && recipientName) {
      store.setContact(contactId, recipientName, 'friend');
    }
    router.push('/(app)/create' as never);
  }, [router, id, contactId, recipientName]);

  const styles = useMemo(() => makeStyles(C), [C]);

  // ── Loading / Error states ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator color={C.primary} size="large" />
        <Text style={styles.loadingText}>Chargement de la carte…</Text>
      </SafeAreaView>
    );
  }

  if (isError || !template) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorTitle}>Carte introuvable</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      {/* ── Carte plein écran ─────────────────────────────────────────────── */}
      <View style={styles.cardContainer}>
        <CardComposer
          template={template}
          recipientName={recipientName}
          style={styles.card}
        />

        {/* Dégradé supérieur pour les contrôles */}
        <View style={styles.topGradient} pointerEvents="none" />

        {/* Bouton retour */}
        <SafeAreaView style={styles.topControls} edges={['top']}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <View style={styles.titleWrap}>
            <Text style={styles.titleText} numberOfLines={1}>{template.title}</Text>
          </View>
          <View style={{ width: 40 }} />
        </SafeAreaView>
      </View>

      {/* ── Panneau bas ──────────────────────────────────────────────────────── */}
      <View style={styles.panel}>

        {/* Champ prénom */}
        <View style={styles.nameRow}>
          <Text style={styles.nameLabel}>Prénom du destinataire</Text>
          <TextInput
            style={[styles.nameInput, nameEditing && styles.nameInputFocused]}
            value={recipientName}
            onChangeText={setRecipientName}
            placeholder="Ex : Marie"
            placeholderTextColor={Colors.onSurfaceVariant}
            onFocus={() => setNameEditing(true)}
            onBlur={() => setNameEditing(false)}
            maxLength={40}
            returnKeyType="done"
            autoCorrect={false}
          />
        </View>

        {/* Boutons d'action */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShare}
            activeOpacity={0.85}
          >
            <Text style={styles.shareBtnText}>Partager ›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.msgBtn}
            onPress={handleCreateMessage}
            activeOpacity={0.85}
          >
            <Text style={styles.msgBtnText}>✦ Ajouter un message</Text>
          </TouchableOpacity>
        </View>

        {/* Info occasion + effet */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {template.occasion} · {template.effect.effect_type} · {template.tier === 'pro' ? '⭐ Pro' : 'Gratuit'}
          </Text>
        </View>
      </View>
    </View>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },

  // ── Carte ──
  cardContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  card: {
    ...StyleSheet.absoluteFillObject,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    // Simulé par backgroundColor semi-transparent
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
  },
  backBtnText: {
    fontSize: 26,
    color: '#fff',
    lineHeight: 30,
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.lg,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // ── Panneau bas ──
  panel: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radii['2xl'],
    borderTopRightRadius: Radii['2xl'],
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[6],
    gap: Spacing[4],
    ...Shadows.lg,
  },
  nameRow: {
    gap: 6,
  },
  nameLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  nameInput: {
    height: 48,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing[4],
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  nameInputFocused: {
    borderColor: C.primary,
    backgroundColor: Colors.white,
  },

  actions: {
    gap: 10,
  },
  shareBtn: {
    height: 52,
    backgroundColor: C.primary,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  shareBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.lg,
    color: Colors.white,
  },
  msgBtn: {
    height: 48,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: C.primary,
  },
  msgBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: C.primary,
  },

  metaRow: {
    alignItems: 'center',
  },
  metaText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },

  // ── Loading / Error ──
  centered: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
  },
  errorEmoji: { fontSize: 48 },
  errorTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
  },
  backButton: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 28,
    backgroundColor: C.primary,
    borderRadius: Radii.full,
  },
  backButtonText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.white,
  },
  });
}
