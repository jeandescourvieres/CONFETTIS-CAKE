import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Radii, Typography } from '../../constants/theme';

interface Button3DProps {
  label: string;
  onPress: () => void;
  color?: string;
  shadowColor?: string;
  textColor?: string;
  emoji?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
}

const SIZE_STYLES = {
  sm: { paddingVertical: 8,  paddingHorizontal: 14, fontSize: Typography.xs, depth: 4 },
  md: { paddingVertical: 10, paddingHorizontal: 16, fontSize: Typography.sm, depth: 5 },
  lg: { paddingVertical: 13, paddingHorizontal: 20, fontSize: Typography.base, depth: 6 },
};

export function Button3D({
  label,
  onPress,
  color = '#FF6B9D',
  shadowColor = '#CC3377',
  textColor = '#fff',
  size = 'md',
  fullWidth = false,
  disabled = false,
}: Button3DProps) {
  const s = SIZE_STYLES[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
      style={{
        alignSelf: fullWidth ? 'stretch' : 'flex-start',
        backgroundColor: disabled ? '#ccc' : shadowColor,
        borderRadius: Radii.full,
        paddingBottom: s.depth,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <View style={{
        backgroundColor: disabled ? '#aaa' : color,
        borderRadius: Radii.full,
        paddingVertical: s.paddingVertical,
        paddingHorizontal: s.paddingHorizontal,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}>
        <Text style={{
          fontFamily: 'BeVietnamPro_700Bold',
          fontSize: s.fontSize,
          color: textColor,
        }}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}
