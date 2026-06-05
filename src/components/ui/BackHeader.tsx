import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing } from '@constants/theme';
import { useColors } from '../../hooks/useColors';

interface Props {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  fallback?: string;
}

export function BackHeader({ title, onBack, rightElement, fallback = '/(app)/' }: Props) {
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const { backTo } = useLocalSearchParams<{ backTo?: string }>();

  const handleBack = onBack ?? (() => {
    if (backTo) {
      router.replace(backTo as never);
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallback as never);
    }
  });
  return (
    <View style={styles.topbar}>
      <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
        <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {rightElement ?? <View style={styles.placeholder} />}
    </View>
  );
}

// ── Bouton retour seul (pour headers custom) ──────────────────────────────────
export function BackButton({ onPress, fallback = '/(app)/' }: { onPress?: () => void; fallback?: string }) {
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  const handleBack = onPress ?? (() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallback as never);
    }
  });

  return (
    <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
      <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
    </TouchableOpacity>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    topbar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing[4],
      paddingVertical: 12,
      borderBottomWidth: 0.5,
      borderBottomColor: C.primaryContainer,
      backgroundColor: Colors.surfaceContainerLow,
    },
    backBtn: { justifyContent: 'center', minWidth: 70 },
    backLinkText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
    title: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: Colors.onSurface, flex: 1, textAlign: 'center' },
    placeholder: { minWidth: 70 },
  });
}
