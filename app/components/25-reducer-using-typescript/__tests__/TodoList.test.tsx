import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { TodoList } from '../components/TodoList'; // This will now use the actual todoReducer

// Mock react-icons/cg
jest.mock('react-icons/cg', () => ({
  CgClose: () => <svg data-testid="cg-close-icon" />,
}));

describe('TodoList', () => {
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
    // Find the checkbox associated with 'Apply TypeScript'
    const checkbox = within(applyTypeScriptTodo.closest('li')!).getByRole('checkbox') as HTMLInputElement;

    expect(checkbox).toBeChecked(); // Initially completed
    expect(applyTypeScriptTodo).toHaveClass('line-through'); // Should have line-through

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
