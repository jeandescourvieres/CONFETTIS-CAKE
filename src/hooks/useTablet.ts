import { useWindowDimensions } from 'react-native';

export const TABLET_BREAKPOINT = 768;

/**
 * Détecte si l'appli s'affiche sur un écran de type tablette (largeur ≥ 768px)
 * et fournit des valeurs d'aide pour adapter les layouts (colonnes, échelle de police).
 */
export function useTablet() {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= TABLET_BREAKPOINT;
  const isLandscape = width > height;

  return {
    isTablet,
    isLandscape,
    width,
    height,
    /** Nombre de colonnes recommandé pour une grille (3 sur téléphone, 4-5 sur tablette) */
    gridColumns: isTablet ? (width >= 1024 ? 5 : 4) : 3,
    /** Multiplicateur à appliquer aux tailles de police pour rester proportionné sur grand écran */
    fontScale: isTablet ? 1.08 : 1,
  };
}
