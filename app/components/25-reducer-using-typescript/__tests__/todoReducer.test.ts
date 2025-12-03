import { todoReducer } from '../todoReducer';
import { Todo } from '../types';

describe('todoReducer', () => {
  // No longer using beforeEach for initialState due to it.concurrent issues
  jest.spyOn(Math, 'max').mockReturnValue(2); // Mock Math.max for consistent ID generation

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.concurrent('should add a new todo item', () => {
    const initialState: Todo[] = [
      { id: 1, text: 'Existing Todo 1', completed: false },
      { id: 2, text: 'Existing Todo 2', completed: true },
    ];
    const action = { type: 'ADD_TODO', payload: 'New Todo' };
    const newState = todoReducer(initialState, action);

    expect(newState.length).toBe(3);
    expect(newState[2]).toEqual({ id: 3, text: 'New Todo', completed: false });
  });

  it.concurrent('should toggle the completed status of a todo item', () => {
    const initialState: Todo[] = [
      { id: 1, text: 'Existing Todo 1', completed: false },
      { id: 2, text: 'Existing Todo 2', completed: true },
    ];
    const action = { type: 'TOGGLE_TODO', payload: 1 }; // Toggle Existing Todo 1
    const newState = todoReducer(initialState, action);

    expect(newState[0].completed).toBe(true);
    expect(newState[1].completed).toBe(true); // Other todo should remain unchanged
  });

  it.concurrent('should delete a todo item', () => {
    const initialState: Todo[] = [
      { id: 1, text: 'Existing Todo 1', completed: false },
      { id: 2, text: 'Existing Todo 2', completed: true },
    ];
    const action = { type: 'DELETE_TODO', payload: 2 }; // Delete Existing Todo 2
    const newState = todoReducer(initialState, action);

    expect(newState.length).toBe(1);
    expect(newState[0]).toEqual({ id: 1, text: 'Existing Todo 1', completed: false });
  });

  it.concurrent('should return the current state for an unknown action', () => {
    const initialState: Todo[] = [
      { id: 1, text: 'Existing Todo 1', completed: false },
      { id: 2, text: 'Existing Todo 2', completed: true },
    ];
    const action = { type: 'UNKNOWN_ACTION', payload: 'any' } as any; // Cast to any to simulate unknown action
    const newState = todoReducer(initialState, action);

    expect(newState).toEqual(initialState);
  });

  it.concurrent('should return the initial state when state is undefined and action is unknown', () => {
    const action = { type: 'UNKNOWN_ACTION', payload: 'any' } as any; // Cast to any to simulate unknown action
    const newState = todoReducer(undefined, action);
    expect(newState).toEqual([]); // Because of the default parameter state = []
  });
});
