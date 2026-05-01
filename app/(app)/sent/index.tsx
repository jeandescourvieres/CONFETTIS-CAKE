import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@constants/theme';
import { BackHeader } from '../../../src/components/ui/BackHeader';

export default function SentScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <BackHeader title="Envoyé" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 22, color: Colors.primary }}>
          sent
        </Text>
      </View>
    </SafeAreaView>
  );
}
