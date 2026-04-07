import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography } from '@constants/theme';
export default function PreviewScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 22, color: Colors.primary }}>
          preview
        </Text>
      </View>
    </SafeAreaView>
  );
}
