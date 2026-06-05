import { useEffect, useRef } from 'react';
import { usePathname, useSegments } from 'expo-router';

// Logs navigation events in __DEV__ only.
// Tracks current route, previous route, inferred action (PUSH/POP/NAVIGATE), and stack depth.
export function useNavigationLogger() {
  const pathname = usePathname();
  const segments = useSegments();
  const prevRef = useRef<string | null>(null);
  const stackRef = useRef<string[]>([]);

  useEffect(() => {
    if (!__DEV__) return;
    const prev = prevRef.current;

    if (prev === null) {
      stackRef.current = [pathname];
      console.log(`[NAV] INIT → ${pathname}`);
      console.log(`[NAV SEGMENTS]`, segments);
    } else if (prev !== pathname) {
      const stack = stackRef.current;
      const existingIndex = stack.lastIndexOf(pathname);
      let action: string;

      if (existingIndex !== -1 && existingIndex === stack.length - 2) {
        action = 'POP';
        stackRef.current = stack.slice(0, stack.length - 1);
      } else if (existingIndex !== -1) {
        action = 'NAVIGATE/REPLACE';
        stackRef.current = stack.slice(0, existingIndex + 1);
      } else {
        action = 'PUSH';
        stackRef.current = [...stack, pathname];
      }

      console.log(`[NAV ${action}] ${prev} → ${pathname}`);
      console.log(`[NAV STACK depth=${stackRef.current.length}]`, stackRef.current.join(' > '));
      console.log(`[NAV SEGMENTS]`, segments);
    }

    prevRef.current = pathname;
  }, [pathname]);
}
