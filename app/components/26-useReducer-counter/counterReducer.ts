// app/components/26-useReducer-counter/counterReducer.ts

// 1. Define State and Actions
export interface CounterState {
  count: number;
}

export type CounterAction =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset'; payload: number };

export const initialCounterState: CounterState = {
  count: 0,
};

export function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: action.payload };
    default:
      // This should ideally not be reached if all action types are handled
      // For robustness, you might throw an error or return the current state
      return state;
  }
}
