import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUIStore } from '@stores/uiStore';
import { Colors, Typography } from '@constants/theme';

function ToastItem({ id, message, type }: { id: string; message: string; type: 'success' | 'error' | 'info' }) {
  const dismiss = useUIStore((s) => s.dismissToast);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2800),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const bg =
    type === 'success' ? '#2e7d32' :
    type === 'error'   ? '#c62828' :
                         '#1565c0';

  return (
    <Animated.View style={[styles.toast, { backgroundColor: bg, opacity }]}>
      <Pressable onPress={() => dismiss(id)} style={{ flex: 1 }}>
        <Text style={styles.text}>{message}</Text>
      </Pressable>
    </Animated.View>
  );
}

export function ToastRenderer() {
  const toasts = useUIStore((s) => s.toasts);
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View style={[styles.container, { top: insets.top + 12 }]} pointerEvents="box-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    gap: 8,
  },
  toast: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  text: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.sm,
    color: '#fff',
  },
});
