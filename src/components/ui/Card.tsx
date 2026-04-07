import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors, Radii, Shadows, Spacing } from '@constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'flat';
  padding?: keyof typeof Spacing;
}

export function Card({
  children,
  style,
  onPress,
  variant = 'default',
  padding = 5,
}: CardProps) {
  const cardStyle = [
    styles.base,
    variantStyles[variant],
    { padding: Spacing[padding] },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.88}
        style={cardStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radii.lg,
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: Colors.surfaceContainerHighest,
  },
});

const variantStyles: Record<string, ViewStyle> = {
  default: {
    backgroundColor: Colors.white,
  },
  elevated: {
    backgroundColor: Colors.white,
    ...Shadows.md,
  },
  flat: {
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 0,
  },
};
