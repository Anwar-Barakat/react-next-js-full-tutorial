import { render, screen, fireEvent } from '@testing-library/react';
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
  });

  it('adds a new todo item when Enter key is pressed in input', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText('Add a new task...') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'Task via Enter' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('Task via Enter')).toBeInTheDocument();
  });
});
