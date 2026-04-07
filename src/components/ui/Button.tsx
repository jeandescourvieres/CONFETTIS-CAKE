import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Radii, Spacing } from '@constants/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = true,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const sizeStyles = sizes[size];

  const content = (
    <View style={styles.inner}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.onPrimary}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={[styles.label, sizeStyles.label, variantText[variant], textStyle]}>
            {label}
          </Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </>
      )}
    </View>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.82}
        style={[fullWidth && styles.fullWidth, style, isDisabled && styles.disabled]}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.base, sizeStyles.container, styles.primaryGrad]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.82}
      style={[
        styles.base,
        sizeStyles.container,
        variantContainer[variant],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryGrad: {
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
  },
  label: {
    fontFamily: Typography.fontHeadline,
    letterSpacing: -0.2,
  },
  iconLeft: { marginRight: 2 },
  iconRight: { marginLeft: 2 },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.42 },
});

const sizes = {
  sm: {
    container: { paddingVertical: 8, paddingHorizontal: 16 } as ViewStyle,
    label: { fontSize: Typography.sm } as TextStyle,
  },
  md: {
    container: { paddingVertical: 13, paddingHorizontal: 24 } as ViewStyle,
    label: { fontSize: Typography.md } as TextStyle,
  },
  lg: {
    container: { paddingVertical: 15, paddingHorizontal: 28 } as ViewStyle,
    label: { fontSize: Typography.lg } as TextStyle,
  },
};

const variantContainer: Record<Exclude<Variant, 'primary'>, ViewStyle> = {
  secondary: {
    backgroundColor: Colors.secondaryContainer,
    borderWidth: 0,
  },
  outline: {
    backgroundColor: Colors.transparent,
    borderWidth: 1.5,
    borderColor: Colors.primaryContainer,
  },
  ghost: {
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 0,
  },
  danger: {
    backgroundColor: Colors.errorContainer,
    borderWidth: 0,
  },
};

const variantText: Record<Variant, TextStyle> = {
  primary: { color: Colors.onPrimary },
  secondary: { color: Colors.onSecondaryFixed },
  outline: { color: Colors.primary },
  ghost: { color: Colors.primary },
  danger: { color: Colors.onError },
};
