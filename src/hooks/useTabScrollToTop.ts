import { useEffect, useRef } from 'react';
import { scrollToTopRegistry } from '../utils/scrollRegistry';

// Registers a scroll-to-top callback for a tab screen.
// Only triggers when the tab bar re-taps the already-active tab — never on focus events.
export function useTabScrollToTop(routeKey: string, scrollFn: () => void) {
  const fnRef = useRef(scrollFn);
  fnRef.current = scrollFn;

  useEffect(() => {
    scrollToTopRegistry.register(routeKey, () => fnRef.current());
    return () => { scrollToTopRegistry.unregister(routeKey); };
  }, [routeKey]);
}
