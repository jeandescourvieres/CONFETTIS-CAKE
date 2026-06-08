// ═══════════════════════════════════════════════════════════
//  Confettis & Cake — Mur Premium (incitation à l'abonnement)
// ═══════════════════════════════════════════════════════════

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../constants/theme';
import { useColors } from '../../hooks/useColors';

interface Props {
  emoji: string;
  title: string;
  description: string;
  ctaLabel?: string;
}

export function PremiumWall({ emoji, title, description, ctaLabel = 'Découvrir Premium ⭐' }: Props) {
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  return (
    <View style={styles.overlay}>
      <LinearGradient
        colors={['#fdd34d', '#c97d10']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <TouchableOpacity
          style={styles.cta}
          onPress={() => router.push('/(app)/profile/premium' as never)}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>{ctaLabel}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing[5], backgroundColor: Colors.surface },
    card: {
      borderRadius: Radii.xl, padding: Spacing[6], alignItems: 'center', gap: 10,
      borderWidth: 3, borderColor: '#fff', ...Shadows.lg,
    },
    emoji: { fontSize: 44 },
    title: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: '#3b2207', textAlign: 'center' },
    description: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: '#5c3d12', textAlign: 'center', lineHeight: 20 },
    cta: { backgroundColor: '#3b2207', borderRadius: Radii.full, paddingVertical: 12, paddingHorizontal: 24, marginTop: 6 },
    ctaText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.white },
  });
}
