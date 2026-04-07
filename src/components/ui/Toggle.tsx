import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@constants/theme';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Toggle({ value, onValueChange, disabled = false, style }: ToggleProps) {
  const thumbAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const trackColor = thumbAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.outlineVariant, Colors.primary],
  });

  useEffect(() => {
    Animated.timing(thumbAnim, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [value, thumbAnim]);

  const translateX = thumbAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 23],
  });

  return (
    <TouchableOpacity
      onPress={() => !disabled && onValueChange(!value)}
      activeOpacity={0.85}
      style={[style, disabled && { opacity: 0.4 }]}
    >
      <Animated.View style={[styles.track, { backgroundColor: trackColor }]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
});
