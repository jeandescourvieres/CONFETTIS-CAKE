import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { useColors } from '../../../src/hooks/useColors';

const { width, height } = Dimensions.get('window');

export default function StudioScreen() {
  const C = useColors();

  return (
    <View style={[styles.container, { backgroundColor: C.primary }]}>
      <Image
        source={require('../../../assets/splash-icon.png')}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>ConfettiCake</Text>
        <Text style={styles.brand}>by Confettis & Cake</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 72,
  },
  title: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 38,
    color: '#fff',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  brand: {
    fontFamily: 'BeVietnamPro_300Light',
    fontStyle: 'italic',
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 2,
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
});
