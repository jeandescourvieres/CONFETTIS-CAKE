import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing } from '@constants/theme';

interface Props {
  title: string;
  onBack?: () => void;
}

export function BackHeader({ title, onBack }: Props) {
  const router = useRouter();
  return (
    <View style={styles.topbar}>
      <TouchableOpacity onPress={onBack ?? (() => router.back())} style={styles.backBtn}>
        <Text style={styles.backBtnText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.placeholder} />
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
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 28, color: Colors.primary, lineHeight: 32 },
  title: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.lg, color: Colors.onSurface },
  placeholder: { width: 32 },
});
