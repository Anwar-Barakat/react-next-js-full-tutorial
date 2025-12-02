import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TodoList } from '../components/TodoList';
import { todoReducer } from '../todoReducer';
import { Todo } from '../types';

// Mock the todoReducer to control its behavior in the component test
jest.mock('../todoReducer', () => ({
  __esModule: true,
  todoReducer: jest.fn((state, action) => {
    // Implement basic reducer logic for the mock to function
    switch (action.type) {
      case 'ADD_TODO':
        return [...state, { id: state.length + 1, text: action.payload, completed: false }];
      case 'TOGGLE_TODO':
        return state.map(todo =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        );
      case 'DELETE_TODO':
        return state.filter(todo => todo.id !== action.payload);
      default:
        return state;
    }
  }),
}));

const mockTodoReducer = todoReducer as jest.Mock;

describe('TodoList Component (with mocked reducer)', () => {
  const initialTodos: Todo[] = [
    { id: 1, text: 'Learn useReducer', completed: false },
    { id: 2, text: 'Apply TypeScript', completed: true },
  ];

  beforeEach(() => {
    // Reset mock before each test and set initial state for the component
    mockTodoReducer.mockImplementation((state, action) => {
      // Use the actual reducer implementation for predictable state changes
      return jest.requireActual('../todoReducer').todoReducer(state, action);
    });
    // The initial state for the component is handled within the component itself
  });

  it('renders initial todo items', () => {
    render(<TodoList />);
    expect(screen.getByText('Learn useReducer')).toBeInTheDocument();
    expect(screen.getByText('Apply TypeScript')).toBeInTheDocument();
  });

  it('adds a new todo item when Add button is clicked', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText('Add a new task...') as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(addButton);

    // After adding, the component should re-render with the new task
    expect(screen.getByText('New Task')).toBeInTheDocument();
    expect(input.value).toBe(''); // Input should be cleared
  });

  it('toggles todo completion status when checkbox is clicked', () => {
    render(<TodoList />);
    const applyTypeScriptTodo = screen.getByText('Apply TypeScript');
    const checkbox = applyTypeScriptTodo.previousSibling as HTMLInputElement;

    expect(checkbox).toBeChecked(); // Initially completed

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked(); // Should be toggled to incomplete
    expect(applyTypeScriptTodo).not.toHaveClass('line-through'); // Line-through removed

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked(); // Toggled back to completed
    expect(applyTypeScriptTodo).toHaveClass('line-through'); // Line-through added back
  });

  it('deletes a todo item when X button is clicked', () => {
    render(<TodoList />);
    const learnUseReducerTodo = screen.getByText('Learn useReducer');
    const deleteButton = within(learnUseReducerTodo.closest('li')!).getByRole('button', { name: 'X' });

    fireEvent.click(deleteButton);
    expect(screen.queryByText('Learn useReducer')).not.toBeInTheDocument();
    expect(screen.getByText('Apply TypeScript')).toBeInTheDocument(); // Other todo still present
  });

  it('adds a new todo item when Enter key is pressed in input', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText('Add a new task...') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'Task via Enter' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('Task via Enter')).toBeInTheDocument();
    expect(input.value).toBe('');
  });
});
