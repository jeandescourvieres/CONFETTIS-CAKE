import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@constants/theme';
import { BackHeader } from '../../../src/components/ui/BackHeader';

export default function QrScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <BackHeader title="QR Code" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 22, color: Colors.primary }}>
          Bientôt disponible
        </Text>
      </View>
    </SafeAreaView>
  );
}
