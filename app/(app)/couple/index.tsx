import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, Share, Clipboard,
  ActivityIndicator, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  useMyCouple,
  useCreateCoupleInvite,
  useAcceptCoupleInvite,
  useEndCouple,
  usePartnerContacts,
} from '../../../src/hooks/useCouple';
import { useAuthStore } from '../../../src/stores/authStore';
import { BackHeader } from '../../../src/components/ui/BackHeader';
import { Colors, Typography, Spacing, Radii } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';

export default function CoupleModeScreen() {
  const C       = useColors();
  const styles  = useMemo(() => makeStyles(C), [C]);
  const user    = useAuthStore((s) => s.user);

  const { data: couple, isLoading } = useMyCouple();
  const { mutateAsync: createInvite, isPending: isCreating } = useCreateCoupleInvite();
  const { mutateAsync: acceptInvite, isPending: isAccepting } = useAcceptCoupleInvite();
  const { mutateAsync: endCouple,   isPending: isEnding   } = useEndCouple();
  const { data: partnerContacts = [] } = usePartnerContacts();

  const [joinCode, setJoinCode] = useState('');

  const isUserA  = couple?.user_a === user?.id;
  const isPending = couple?.status === 'pending';
  const isActive  = couple?.status === 'active';

  const partnerName = couple?.partner_profile?.full_name?.split(' ')[0]
    ?? (isActive ? 'ton partenaire' : null);

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleCreate = async () => {
    await createInvite();
  };

  const handleShare = async () => {
    if (!couple?.invite_code) return;
    await Share.share({
      message: `💑 Rejoins-moi sur ConfettiCake pour partager nos contacts !\nCode : ${couple.invite_code}`,
    });
  };

  const handleCopy = () => {
    if (!couple?.invite_code) return;
    Clipboard.setString(couple.invite_code);
    Alert.alert('Copié !', `Code ${couple.invite_code} copié dans le presse-papier.`);
  };

  const handleAccept = async () => {
    if (!joinCode.trim()) return;
    try {
      await acceptInvite(joinCode);
    } catch (e: unknown) {
      Alert.alert('Erreur', e instanceof Error ? e.message : 'Code invalide.');
    }
  };

  const handleEnd = () => {
    Alert.alert(
      'Dissocier le mode couple ?',
      `Tu ne verras plus les contacts de ${partnerName ?? 'ton partenaire'} et vice versa.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Dissocier', style: 'destructive',
          onPress: () => couple && endCouple(couple.id),
        },
      ],
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <BackHeader title="" />
        <View style={styles.center}><ActivityIndicator color={C.primary} /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>💑</Text>
          <Text style={styles.heroTitle}>Mode couple</Text>
          <Text style={styles.heroSub}>
            {isActive
              ? `Connecté·e avec ${partnerName}`
              : isPending && isUserA
              ? 'En attente que ton partenaire rejoigne'
              : 'Partage vos contacts pour ne jamais rater un anniversaire'}
          </Text>
        </View>

        {/* ── Introduction (si pas encore en couple) ────────────────────── */}
        {!isActive && (
          <View style={styles.introCard}>
            <Text style={styles.introDesc}>
              Connecte ton compte avec celui de ton/ta partenaire pour partager vos agendas de contacts.
            </Text>

            <Text style={styles.introSectionTitle}>Comment ça marche ?</Text>
            {[
              'L\'un de vous va dans "Mode couple" (accueil → "💑 Mode couple").',
              'Il crée une invitation → un code à 6 lettres s\'affiche (ex. ABCDEF).',
              'Il partage ce code à l\'autre.',
              'L\'autre saisit le code dans "Rejoindre avec un code".',
              'Le lien est activé !',
            ].map((step, i) => (
              <View key={i} style={styles.introStep}>
                <View style={[styles.introStepNum, { backgroundColor: C.primary }]}>
                  <Text style={styles.introStepNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.introStepText}>{step}</Text>
              </View>
            ))}

            <Text style={styles.introSectionTitle}>Une fois en mode couple :</Text>
            {[
              'Vous voyez chacun les contacts de l\'autre dans vos listes (avec le badge 💑).',
              'Les anniversaires et fêtes du partenaire apparaissent dans l\'agenda principal.',
              'Un bloc "Agenda de [prénom]" s\'affiche sur l\'accueil.',
            ].map((point, i) => (
              <View key={i} style={styles.introBullet}>
                <Text style={[styles.introBulletDot, { color: C.primary }]}>•</Text>
                <Text style={styles.introBulletText}>{point}</Text>
              </View>
            ))}

            <View style={[styles.introFooter, { borderLeftColor: C.primary }]}>
              <Text style={styles.introFooterText}>
                💔 Dissocier le lien à tout moment depuis la page "Mode couple" → "Dissocier le mode couple". Les contacts redeviennent privés immédiatement.
              </Text>
            </View>
          </View>
        )}

        {/* ── État actif ─────────────────────────────────────────────────── */}
        {isActive && (
          <>
            <View style={[styles.activeCard, { borderColor: C.primary }]}>
              <Text style={styles.activeEmoji}>💞</Text>
              <View style={styles.activeInfo}>
                <Text style={styles.activeTitle}>Connecté·e avec {partnerName}</Text>
                <Text style={styles.activeSub}>
                  {partnerContacts.length} contact{partnerContacts.length !== 1 ? 's' : ''} partagé{partnerContacts.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={[styles.statBox, { backgroundColor: C.primaryContainer }]}>
                <Text style={[styles.statNum, { color: C.primary }]}>{partnerContacts.filter(c => c.birthday).length}</Text>
                <Text style={styles.statLabel}>anniversaires</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: C.primaryContainer }]}>
                <Text style={[styles.statNum, { color: C.primary }]}>{partnerContacts.filter(c => c.name_day).length}</Text>
                <Text style={styles.statLabel}>fêtes</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: C.primaryContainer }]}>
                <Text style={[styles.statNum, { color: C.primary }]}>{partnerContacts.length}</Text>
                <Text style={styles.statLabel}>contacts</Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>Contacts de {partnerName}</Text>
            {partnerContacts.slice(0, 5).map((c) => (
              <View key={c.id} style={styles.contactRow}>
                <Text style={styles.contactEmoji}>👤</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactName}>{c.name}</Text>
                  {c.birthday && (
                    <Text style={styles.contactSub}>🎂 {c.birthday.slice(5).replace('-', '/')}</Text>
                  )}
                </View>
                <Text style={styles.partnerBadge}>💑</Text>
              </View>
            ))}
            {partnerContacts.length > 5 && (
              <Text style={styles.moreContacts}>
                + {partnerContacts.length - 5} autre{partnerContacts.length - 5 > 1 ? 's' : ''}...
              </Text>
            )}

            <TouchableOpacity
              style={styles.endBtn}
              onPress={handleEnd}
              disabled={isEnding}
              activeOpacity={0.8}
            >
              <Text style={styles.endBtnText}>
                {isEnding ? 'Dissociation...' : '💔 Dissocier le mode couple'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* ── Invitation en attente (user_a) ─────────────────────────────── */}
        {isPending && isUserA && (
          <>
            <View style={[styles.codeCard, { borderColor: C.primaryContainer }]}>
              <Text style={styles.codeLabel}>Ton code d'invitation</Text>
              <Text style={[styles.codeValue, { color: C.primary }]}>{couple.invite_code}</Text>
              <Text style={styles.codeSub}>
                Envoie ce code à ton/ta partenaire. Une fois qu'il/elle l'a saisi, vous serez connecté·e·s !
              </Text>
              <View style={styles.codeActions}>
                <TouchableOpacity
                  style={[styles.codeBtn, { backgroundColor: C.primary }]}
                  onPress={handleShare}
                >
                  <Text style={styles.codeBtnText}>📤 Partager</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.codeBtn, { backgroundColor: Colors.surfaceContainer }]}
                  onPress={handleCopy}
                >
                  <Text style={[styles.codeBtnText, { color: Colors.onSurface }]}>📋 Copier</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.endBtn}
              onPress={() => couple && endCouple(couple.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.endBtnText}>Annuler l'invitation</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ── Pas de couple — Créer ou rejoindre ────────────────────────── */}
        {!couple && (
          <>
            <Text style={styles.sectionLabel}>Tu as reçu un code ?</Text>
            <View style={styles.joinRow}>
              <TextInput
                style={[styles.joinInput, { flex: 1 }]}
                placeholder="XXXXXX"
                placeholderTextColor={Colors.onSurfaceVariant}
                value={joinCode}
                onChangeText={(t) => setJoinCode(t.toUpperCase())}
                maxLength={6}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={[styles.joinBtn, { backgroundColor: joinCode.length === 6 ? C.primary : Colors.outlineVariant }]}
                onPress={handleAccept}
                disabled={joinCode.length !== 6 || isAccepting}
              >
                {isAccepting
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.joinBtnText}>Rejoindre</Text>
                }
              </TouchableOpacity>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <Text style={styles.sectionLabel}>Inviter ton/ta partenaire</Text>
            <Text style={styles.inviteDesc}>
              Génère un code unique et envoie-le à ton/ta partenaire. Une fois qu'il/elle l'a saisi dans son appli, vous partagerez automatiquement vos contacts.
            </Text>
            <TouchableOpacity
              style={[styles.createBtn, { backgroundColor: C.primary }]}
              onPress={handleCreate}
              disabled={isCreating}
              activeOpacity={0.85}
            >
              {isCreating
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={styles.createBtnText}>💑 Générer mon code d'invitation</Text>
              }
            </TouchableOpacity>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content:   { paddingHorizontal: Spacing[4], paddingBottom: 100 },
    center:    { flex: 1, alignItems: 'center', justifyContent: 'center' },

    hero: { alignItems: 'center', paddingVertical: 20, gap: 6 },
    heroEmoji: { fontSize: 40 },
    heroTitle: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography['2xl'],
      color: Colors.onSurface,
      textAlign: 'center',
    },
    heroSub: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 20,
    },

    // Introduction
    introCard: {
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      padding: Spacing[5],
      marginBottom: Spacing[5],
      gap: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    introDesc: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.md,
      color: Colors.onSurface,
      lineHeight: 22,
      marginBottom: 4,
    },
    introSectionTitle: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.md,
      color: Colors.onSurface,
      marginTop: 8,
      marginBottom: 2,
    },
    introStep: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    introStepNum: {
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginTop: 1,
    },
    introStepNumText: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography.xs,
      color: Colors.white,
    },
    introStepText: {
      flex: 1,
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.md,
      color: Colors.onSurface,
      lineHeight: 21,
    },
    introBullet: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
    },
    introBulletDot: {
      fontSize: 16,
      lineHeight: 22,
      flexShrink: 0,
    },
    introBulletText: {
      flex: 1,
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.md,
      color: Colors.onSurface,
      lineHeight: 21,
    },
    introFooter: {
      borderLeftWidth: 3,
      paddingLeft: 12,
      marginTop: 4,
    },
    introFooterText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
      lineHeight: 20,
    },

    // Actif
    activeCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderRadius: Radii.lg,
      borderWidth: 2,
      padding: Spacing[3],
      marginBottom: 16,
    },
    activeEmoji: { fontSize: 28 },
    activeInfo:  { flex: 1 },
    activeTitle: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.md,
      color: Colors.onSurface,
    },
    activeSub: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
      marginTop: 2,
    },

    statsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
    statBox: {
      flex: 1,
      borderRadius: Radii.md,
      padding: 12,
      alignItems: 'center',
      gap: 2,
    },
    statNum: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography.xl,
    },
    statLabel: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
    },

    sectionLabel: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.md,
      color: Colors.onSurface,
      marginBottom: 10,
      marginTop: 4,
    },

    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      backgroundColor: Colors.surfaceContainer,
      borderRadius: Radii.md,
      marginBottom: 6,
    },
    contactEmoji: { fontSize: 20 },
    contactName: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.sm,
      color: Colors.onSurface,
    },
    contactSub: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
    },
    partnerBadge: { fontSize: 14 },
    moreContacts: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
      textAlign: 'center',
      marginTop: 4,
      marginBottom: 16,
    },

    // Code d'invitation
    codeCard: {
      borderRadius: Radii.xl,
      borderWidth: 2,
      padding: 24,
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
    },
    codeLabel: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    codeValue: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: 42,
      letterSpacing: 8,
    },
    codeSub: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 20,
      marginTop: 4,
    },
    codeActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
    codeBtn: {
      borderRadius: Radii.full,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    codeBtnText: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.sm,
      color: '#fff',
    },

    // Rejoindre
    joinRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
    joinInput: {
      backgroundColor: Colors.surfaceContainer,
      borderRadius: Radii.md,
      padding: Spacing[3],
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography.xl,
      color: Colors.onSurface,
      letterSpacing: 6,
      textAlign: 'center',
    },
    joinBtn: {
      borderRadius: Radii.md,
      paddingHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 90,
    },
    joinBtnText: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.sm,
      color: '#fff',
    },

    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginVertical: 20,
    },
    dividerLine: { flex: 1, height: 1, backgroundColor: Colors.outlineVariant },
    dividerText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
    },

    inviteDesc: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
      lineHeight: 20,
      marginBottom: 16,
    },
    createBtn: {
      borderRadius: Radii.full,
      paddingVertical: 14,
      alignItems: 'center',
    },
    createBtnText: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.md,
      color: '#fff',
    },

    // Dissocier
    endBtn: {
      marginTop: 20,
      borderRadius: Radii.full,
      borderWidth: 1,
      borderColor: Colors.error,
      paddingVertical: 12,
      alignItems: 'center',
    },
    endBtnText: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.sm,
      color: Colors.error,
    },
  });
}
