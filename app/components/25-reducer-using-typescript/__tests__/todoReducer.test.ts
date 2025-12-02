import { todoReducer } from '../todoReducer';
import { Todo } from '../types';

describe('todoReducer', () => {
  let initialState: Todo[];

  beforeEach(() => {
    initialState = [
      { id: 1, text: 'Existing Todo 1', completed: false },
      { id: 2, text: 'Existing Todo 2', completed: true },
    ];
    jest.spyOn(Math, 'max').mockReturnValue(2); // Mock Math.max for consistent ID generation
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should add a new todo item', () => {
    const action = { type: 'ADD_TODO', payload: 'New Todo' };
    const newState = todoReducer(initialState, action);

    expect(newState.length).toBe(3);
    expect(newState[2]).toEqual({ id: 3, text: 'New Todo', completed: false });
  });

  it('should toggle the completed status of a todo item', () => {
    const action = { type: 'TOGGLE_TODO', payload: 1 }; // Toggle Existing Todo 1
    const newState = todoReducer(initialState, action);

    expect(newState[0].completed).toBe(true);
    expect(newState[1].completed).toBe(true); // Other todo should remain unchanged
  });

  it('should delete a todo item', () => {
    const action = { type: 'DELETE_TODO', payload: 2 }; // Delete Existing Todo 2
    const newState = todoReducer(initialState, action);

    expect(newState.length).toBe(1);
    expect(newState[0]).toEqual({ id: 1, text: 'Existing Todo 1', completed: false });
  });

  it('should return the current state for an unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION', payload: 'any' } as any; // Cast to any to simulate unknown action
    const newState = todoReducer(initialState, action);

    expect(newState).toEqual(initialState);
  });
});
