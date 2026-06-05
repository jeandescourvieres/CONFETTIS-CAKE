const _registry = new Map<string, () => void>();

export const scrollToTopRegistry = {
  register(key: string, fn: () => void) {
    _registry.set(key, fn);
  },
  unregister(key: string) {
    _registry.delete(key);
  },
  trigger(key: string) {
    _registry.get(key)?.();
  },
};
