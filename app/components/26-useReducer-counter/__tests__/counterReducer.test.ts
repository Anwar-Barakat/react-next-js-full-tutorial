import { counterReducer, initialCounterState, CounterState, CounterAction } from '../counterReducer';

describe('counterReducer', () => {
  it('should return the initial state', () => {
    expect(counterReducer(undefined as any, {} as any)).toEqual(initialCounterState);
  });

  it('should handle "increment" action', () => {
    const action: CounterAction = { type: 'increment' };
    const newState = counterReducer(initialCounterState, action);
    expect(newState.count).toBe(1);
  });

  it('should handle "decrement" action', () => {
    const state: CounterState = { count: 5 };
    const action: CounterAction = { type: 'decrement' };
    const newState = counterReducer(state, action);
    expect(newState.count).toBe(4);
  });

  it('should handle "reset" action', () => {
    const state: CounterState = { count: 10 };
    const action: CounterAction = { type: 'reset', payload: 0 };
    const newState = counterReducer(state, action);
    expect(newState.count).toBe(0);
  });

  it('should return current state for unknown action type', () => {
    const state: CounterState = { count: 10 };
    const action: CounterAction = { type: 'UNKNOWN' } as any; // Cast to any to simulate unknown action
    const newState = counterReducer(state, action);
    expect(newState.count).toBe(10);
  });
});
