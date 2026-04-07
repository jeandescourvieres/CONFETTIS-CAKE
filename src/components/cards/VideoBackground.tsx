import { useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import type { CardBackground } from '../../services/cards.service';

interface Props {
  background: CardBackground;
}

export function VideoBackground({ background }: Props) {
  // Affiche le thumbnail jusqu'à ce que la vidéo soit prête à jouer
  const [videoReady, setVideoReady] = useState(false);

  return (
    <>
      {/* Thumbnail : toujours présent en fond, masqué dès que la vidéo joue */}
      {(!videoReady || !background.mp4_url) && (
        <Image
          source={{ uri: background.thumbnail_url }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      )}

      {/* Vidéo MP4 : uniquement si une URL est fournie */}
      {!!background.mp4_url && (
        <Video
          source={{ uri: background.mp4_url }}
          style={[StyleSheet.absoluteFill, !videoReady && styles.hidden]}
          resizeMode={ResizeMode.COVER}
          isLooping={background.loop}
          isMuted
          shouldPlay
          onReadyForDisplay={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  hidden: { opacity: 0 },
});
