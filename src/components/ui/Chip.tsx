import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Radii, Spacing } from '@constants/theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Chip({ label, selected = false, onPress, style }: ChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.base, selected ? styles.selected : styles.unselected, style]}
    >
      <Text style={[styles.label, selected ? styles.labelSelected : styles.labelUnselected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[4],
    borderRadius: Radii.full,
    borderWidth: 0.5,
  },
  unselected: {
    backgroundColor: Colors.transparent,
    borderColor: Colors.outlineVariant,
  },
  selected: {
    backgroundColor: Colors.surfaceContainerLow,
    borderColor: Colors.primaryFixedDim,
  },
  label: {
    fontSize: Typography.base,
    fontFamily: 'BeVietnamPro_400Regular',
  },
  labelUnselected: {
    color: Colors.onSurfaceVariant,
  },
  labelSelected: {
    color: Colors.onTertiaryContainer,
    fontFamily: 'BeVietnamPro_600SemiBold',
  },
});
