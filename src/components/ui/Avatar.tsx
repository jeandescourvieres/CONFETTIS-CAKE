import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography } from '@constants/theme';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
  badge?: string;  // emoji badge affiché en bas à droite
}

const sizeMap: Record<AvatarSize, number> = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 56,
  xl: 72,
};

export function Avatar({ uri, name, size = 'md', style, badge }: AvatarProps) {
  const dim = sizeMap[size];
  const fontSize = dim * 0.38;
  const initials = name
    ? name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <View style={[{ width: dim, height: dim }, style]}>
      <View
        style={[
          styles.container,
          { width: dim, height: dim, borderRadius: dim / 2 },
        ]}
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={{ width: dim, height: dim, borderRadius: dim / 2 }}
            resizeMode="cover"
          />
        ) : (
          <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
        )}
      </View>
      {badge ? (
        <View style={[styles.badge, { width: dim * 0.36, height: dim * 0.36, borderRadius: (dim * 0.36) / 2 }]}>
          <Text style={{ fontSize: dim * 0.2 }}>{badge}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.primary,
  },
  badge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
});
