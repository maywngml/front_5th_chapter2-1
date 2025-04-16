import { createObserver } from '../lib/createObserver';

export const createStore = <
  TState,
  TActions extends Record<string, (state: TState, ...args: any[]) => TState>,
>(
  initialState: TState,
  initialActions: TActions,
): {
  getState: () => TState;
  subscribe: (fn: () => void) => Set<unknown>;
  actions: {
    [K in keyof TActions]: (
      ...args: TActions[K] extends (state: TState, ...args: infer A) => TState
        ? A
        : never
    ) => void;
  };
} => {
  const { subscribe, notify } = createObserver();

  let state = { ...initialState };

  const setState = (newState: Partial<TState>) => {
    state = { ...state, ...newState };
    notify();
  };

  const getState = () => ({ ...state });

  const actions = {} as {
    [K in keyof TActions]: (
      ...args: TActions[K] extends (state: TState, ...args: infer A) => TState
        ? A
        : never
    ) => void;
  };

  for (const key in initialActions) {
    actions[key] = ((...args: any[]) => {
      const updater = initialActions[key];
      const nextState = updater(getState(), ...args);
      setState(nextState);
    }) as (typeof actions)[typeof key];
  }

  return { getState, subscribe, actions };
};
