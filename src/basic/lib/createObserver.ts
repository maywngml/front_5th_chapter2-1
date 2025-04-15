export const createObserver = () => {
  const listeners = new Set();
  const subscribe = (fn: () => void) => listeners.add(fn);
  const notify = () =>
    listeners.forEach((listener) => {
      if (typeof listener === 'function') {
        listener();
      }
    });

  return { subscribe, notify };
};
