// ═══════════════════════════════════════════════════════════
//  Confettis & Cake — Pop-up freemium (incitation Premium)
// ═══════════════════════════════════════════════════════════

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../constants/theme';
import { useColors } from '../../hooks/useColors';

interface Props {
  visible: boolean;
  onClose: () => void;
  emoji?: string;
  title: string;
  description: string;
  ctaLabel?: string;
}

export function PremiumGateModal({ visible, onClose, emoji = '🍭', title, description, ctaLabel = 'Découvrir Premium ⭐' }: Props) {
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1}>
          <LinearGradient
            colors={['#fdd34d', '#c97d10']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            <TouchableOpacity
              style={styles.cta}
              onPress={() => { onClose(); router.push('/(app)/profile/premium' as never); }}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaText}>{ctaLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
              <Text style={styles.laterText}>Plus tard</Text>
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing[5], backgroundColor: 'rgba(0,0,0,0.45)' },
    card: {
      borderRadius: Radii.xl, padding: Spacing[6], alignItems: 'center', gap: 10,
      borderWidth: 3, borderColor: '#fff', maxWidth: 360, ...Shadows.lg,
    },
    closeBtn: { position: 'absolute', top: 12, right: 14, zIndex: 1 },
    closeBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 16, color: '#3b2207' },
    emoji: { fontSize: 44 },
    title: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: '#3b2207', textAlign: 'center' },
    description: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: '#5c3d12', textAlign: 'center', lineHeight: 20 },
    cta: { backgroundColor: '#3b2207', borderRadius: Radii.full, paddingVertical: 12, paddingHorizontal: 24, marginTop: 6 },
    ctaText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.white },
    laterText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: '#3b2207', opacity: 0.7, marginTop: 2 },
  });
}
