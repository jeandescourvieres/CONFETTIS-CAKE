import { View, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { VideoBackground } from './VideoBackground';
import { LottieEffect } from './LottieEffect';
import { CardText } from './CardText';
import type { CardTemplate } from '../../services/cards.service';

interface Props {
  template: CardTemplate;
  recipientName: string;
  recipientAge?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Moteur de composition — assemble les 3 couches :
 *   Layer 1 (bas)  : Fond MP4 animé        → VideoBackground
 *   Layer 2 (mil.) : Effet Lottie superposé → LottieEffect
 *   Layer 3 (haut) : Texte / âge / prénom  → CardText
 *
 * Le mode (name | age | age_name) est lu depuis template.mode
 * et transmis à CardText qui adapte son rendu dynamiquement.
 */
export function CardComposer({ template, recipientName, recipientAge, style }: Props) {
  return (
    <View style={[styles.canvas, style]}>
      <VideoBackground background={template.background} />
      <LottieEffect effect={template.effect} recipientName={recipientName} />
      <CardText
        config={template.text_style.config}
        recipientName={recipientName}
        recipientAge={recipientAge}
        mode={template.mode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    overflow: 'hidden',
    backgroundColor: '#0a0a1a',
  },
});
