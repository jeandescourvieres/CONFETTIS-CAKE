import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import type { CardEffect } from '../../services/cards.service';

interface Props {
  effect: CardEffect;
  recipientName: string;
}

// Injecte le prénom dans le layer texte du JSON Lottie (si présent)
function patchLottieName(json: unknown, layerId: string, name: string): unknown {
  const cloned = JSON.parse(JSON.stringify(json));

  function walkLayers(layers: unknown[]) {
    if (!Array.isArray(layers)) return;
    for (const layer of layers as Record<string, unknown>[]) {
      // Layer texte correspondant
      if (layer.nm === layerId) {
        const t = layer.t as Record<string, unknown> | undefined;
        const d = t?.d as Record<string, unknown> | undefined;
        const k = d?.k as Record<string, unknown>[] | undefined;
        if (Array.isArray(k)) {
          for (const keyframe of k) {
            const s = keyframe.s as Record<string, unknown> | undefined;
            if (s && 't' in s) s.t = name;
          }
        }
      }
      // Récursion sur les sous-layers
      const subLayers = (layer as Record<string, unknown>).layers;
      if (Array.isArray(subLayers)) walkLayers(subLayers);
    }
  }

  const root = cloned as Record<string, unknown>;
  if (Array.isArray(root.layers)) walkLayers(root.layers as unknown[]);
  return cloned;
}

export function LottieEffect({ effect, recipientName }: Props) {
  const [source, setSource] = useState<unknown>(null);

  useEffect(() => {
    if (effect.effect_type === 'none') return;

    fetch(effect.lottie_url)
      .then((r) => r.json())
      .then((json) => {
        const patched =
          effect.has_name_layer && effect.name_layer_id
            ? patchLottieName(json, effect.name_layer_id, recipientName)
            : json;
        setSource(patched);
      })
      .catch(() => {/* silencieux — l'effet est optionnel */});
  }, [effect.lottie_url, effect.name_layer_id, recipientName, effect.effect_type, effect.has_name_layer]);

  if (!source) return null;

  return (
    <LottieView
      source={source as Parameters<typeof LottieView>[0]['source']}
      autoPlay
      loop={effect.loop}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    />
  );
}
