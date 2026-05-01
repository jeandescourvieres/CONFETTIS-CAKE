import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing } from '@constants/theme';

interface Props {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  fallback?: string;
}

export function BackHeader({ title, onBack, rightElement, fallback = '/(app)/' }: Props) {
  const router = useRouter();
  const handleBack = onBack ?? (() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallback as never);
    }
  });
  return (
    <View style={styles.topbar}>
      <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
        <Text style={styles.backBtnText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {rightElement ?? <View style={styles.placeholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.primaryContainer,
    backgroundColor: Colors.surfaceContainerLow,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primaryContainer },
  backBtnText: { fontSize: 34, color: Colors.primary, lineHeight: 38 },
  title: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.lg, color: Colors.onSurface },
  placeholder: { width: 32 },
});
