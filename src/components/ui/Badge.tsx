import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Radii, Spacing } from '@constants/theme';

type BadgeVariant = 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  dot?: boolean;
}

export function Badge({ label, variant = 'primary', style, dot = false }: BadgeProps) {
  return (
    <View style={[styles.base, variantStyles[variant].container, style]}>
      {dot && <View style={[styles.dot, { backgroundColor: variantStyles[variant].text.color as string }]} />}
      <Text style={[styles.label, variantStyles[variant].text]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing[0] + 4,
    paddingHorizontal: Spacing[2] + 2,
    borderRadius: Radii.full,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: Typography.xs,
    fontFamily: 'BeVietnamPro_700Bold',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: Radii.full,
  },
});

const variantStyles: Record<BadgeVariant, { container: ViewStyle; text: { color: string } }> = {
  primary: {
    container: { backgroundColor: Colors.primary },
    text: { color: Colors.onPrimary },
  },
  secondary: {
    container: { backgroundColor: Colors.secondaryContainer },
    text: { color: Colors.onSecondaryFixed },
  },
  tertiary: {
    container: { backgroundColor: Colors.surfaceContainerLow },
    text: { color: Colors.onTertiaryContainer },
  },
  error: {
    container: { backgroundColor: Colors.errorContainer },
    text: { color: Colors.onError },
  },
  success: {
    container: { backgroundColor: '#EAF3DE' },
    text: { color: '#3B6D11' },
  },
  neutral: {
    container: { backgroundColor: Colors.surfaceContainer },
    text: { color: Colors.onSurfaceVariant },
  },
};
