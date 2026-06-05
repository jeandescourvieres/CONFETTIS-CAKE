import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { useColors } from '../../src/hooks/useColors';
import { useContacts } from '../../src/hooks/useContacts';
import { BackHeader } from '../../src/components/ui/BackHeader';

const PET_TYPE_LABEL: Record<string, string> = {
  chien:        '🐶 Chien',
  chat:         '🐱 Chat',
  lapin:        '🐰 Lapin',
  perroquet:    '🦜 Perroquet',
  hamster:      '🐹 Hamster',
  poisson:      '🐠 Poisson',
  cheval:       '🐴 Cheval',
  oiseau:       '🐦 Oiseau',
  cochon_d_inde:'🐹 Cochon d\'Inde',
  souris:       '🐭 Souris',
  tortue:       '🐢 Tortue',
  autre:        '🐾 Animal',
};

export default function AnimauxScreen() {
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const { data: contacts = [] } = useContacts();

  // Tous les contacts qui sont des animaux de compagnie
  const pets = contacts.filter((c) => c.relation === 'pet');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="🐾 Mes animaux" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Intro */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>Messages depuis le monde animal 😄</Text>
          <Text style={styles.introText}>
            {'Ajoute les animaux de tes contacts pour débloquer deux types de messages fun :\n\n🎂 Un message adressé directement à l\'animal — son anniversaire mérite d\'être fêté !\n\n💌 Un message écrit par toi-même, comme si c\'était l\'animal qui tenait la plume — jalousie, réclamations de croquettes, déclarations d\'amour à son maître… l\'IA se glisse dans sa tête.'}
          </Text>
        </View>

        {pets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🐶🐱🐰🦜🐹🐠🐴</Text>
            <Text style={styles.emptyTitle}>
              {'Ajoute ici les boules de poils\n— et les autres — de tes contacts 🐾'}
            </Text>
            <Text style={styles.emptyText}>
              {'Tu pourras ainsi leur envoyer un message ou\n(et c\'est complètement fun 😄)\nleur faire envoyer un message à leur maître · maîtresse,\ncomme si c\'était eux qui leur écrivaient ! 🐾✨'}
            </Text>
            <View style={styles.animalRow}>
              {[
                { emoji: '🐶', label: 'Chien' },
                { emoji: '🐱', label: 'Chat' },
                { emoji: '🐰', label: 'Lapin' },
                { emoji: '🐦', label: 'Oiseau' },
                { emoji: '🐴', label: 'Cheval' },
                { emoji: '🐹', label: 'Hamster' },
                { emoji: '🦜', label: 'Perroquet' },
                { emoji: '🐭', label: 'Souris' },
                { emoji: '🐠', label: 'Poisson' },
                { emoji: '🐢', label: 'Tortue' },
                { emoji: '🐾', label: 'Autre' },
              ].map((a) => (
                <View key={a.label} style={styles.animalChip}>
                  <Text style={styles.animalChipEmoji}>{a.emoji}</Text>
                  <Text style={styles.animalChipLabel}>{a.label}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: C.primary }]}
              onPress={() => router.push('/(app)/animaux/new' as never)}
              activeOpacity={0.85}
            >
              <Text style={styles.addBtnText}>Ajoute un animal 🐾</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Mes boules de poils et les autres ({pets.length})</Text>
            {pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                style={styles.petCard}
                onPress={() =>
                  router.push({ pathname: '/(app)/contact/[id]', params: { id: pet.id } } as never)
                }
                activeOpacity={0.8}
              >
                <View style={styles.petAvatar}>
                  <Text style={styles.petAvatarText}>
                    {pet.name.split(' ').slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? '').join('')}
                  </Text>
                </View>
                <View style={styles.petInfo}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    {(pet as any).pet_type && (
                      <Text style={styles.petTypeTag}>
                        {PET_TYPE_LABEL[(pet as any).pet_type] ?? '🐾 Animal'}
                      </Text>
                    )}
                  </View>
                  {(pet as any).pet_owner_name ? (
                    <Text style={styles.petSub}>
                      {(() => {
                        const parts = ((pet as any).pet_owner_name as string).trim().split(/\s+/);
                        const upper = parts.filter((p: string) => p.length > 1 && p === p.toUpperCase());
                        const mixed = parts.filter((p: string) => p.length <= 1 || p !== p.toUpperCase());
                        return '🧑 ' + (mixed.length && upper.length ? [...mixed, ...upper].join(' ') : (pet as any).pet_owner_name);
                      })()}
                    </Text>
                  ) : pet.birthday ? (
                    <Text style={styles.petSub}>
                      {new Date(pet.birthday).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </Text>
                  ) : null}
                </View>
                <Text style={[styles.petArrow, { color: C.primary }]}>›</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.addBtnSmall, { borderColor: C.primary }]}
              onPress={() => router.push('/(app)/animaux/new' as never)}
              activeOpacity={0.85}
            >
              <Text style={[styles.addBtnSmallText, { color: C.primary }]}>Ajoute un animal 🐾</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { paddingHorizontal: Spacing[4], gap: 12, paddingTop: Spacing[4], paddingBottom: 120 },

    introCard: {
      backgroundColor: '#FFF8E7',
      borderRadius: Radii.xl,
      padding: Spacing[4],
      borderLeftWidth: 4,
      borderLeftColor: '#F59E0B',
      gap: 8,
    },
    introTitle: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography.xl,
      color: '#B45309',
    },
    introText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.md,
      color: Colors.onSurface,
      lineHeight: 22,
    },

    emptyState: { alignItems: 'center', paddingTop: 32, gap: 14, paddingHorizontal: 8 },
    emptyEmoji: { fontSize: 42, letterSpacing: 4, textAlign: 'center' },
    emptyTitle: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography.xl,
      color: Colors.onSurface,
      textAlign: 'center',
      lineHeight: 30,
    },
    emptyText: {
      fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base,
      color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 24,
    },
    animalRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 8,
      marginVertical: 4,
    },
    animalChip: {
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: Radii.xl,
      backgroundColor: C.primaryContainer,
      borderWidth: 1.5,
      borderColor: C.primary + '40',
      gap: 3,
      minWidth: 68,
    },
    animalChipEmoji: { fontSize: 26 },
    animalChipLabel: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.xs,
      color: C.primary,
    },
    addBtn: {
      marginTop: 4, paddingVertical: 14, paddingHorizontal: 28,
      borderRadius: Radii.full, ...Shadows.sm,
    },
    addBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.white },

    sectionTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.lg, color: Colors.onSurface },
    petCard: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      backgroundColor: Colors.white, borderRadius: Radii.lg,
      padding: Spacing[3], ...Shadows.sm,
    },
    petAvatar: {
      width: 44, height: 44, borderRadius: Radii.full,
      backgroundColor: C.primaryContainer, alignItems: 'center', justifyContent: 'center',
    },
    petAvatarText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: C.primary },
    petInfo: { flex: 1, gap: 2 },
    petName: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.onSurface },
    petTypeTag: {
      fontFamily: 'BeVietnamPro_500Medium',
      fontSize: Typography.xs,
      color: C.primary,
      backgroundColor: C.primaryContainer,
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: Radii.full,
    },
    petSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant },
    petArrow: { fontSize: 22, fontFamily: 'BeVietnamPro_700Bold' },
    addBtnSmall: {
      borderWidth: 1.5, borderRadius: Radii.full,
      paddingVertical: 12, alignItems: 'center', marginTop: 4,
    },
    addBtnSmallText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base },
  });
}
