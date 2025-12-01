import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoList from '../components/TodoList';

// Mock react-icons to prevent issues with SVG rendering
jest.mock('react-icons/cg', () => ({
  CgClose: () => <svg data-testid="cg-close-icon" />,
}));

describe('TodoList Component', () => {
  // Mock Math.random to return consistent values for predictable IDs
  const mockMathRandom = jest.spyOn(Math, 'random');

  beforeEach(() => {
    mockMathRandom.mockReturnValueOnce(0.123); // For first todo ID
    mockMathRandom.mockReturnValueOnce(0.456); // For second todo ID
    mockMathRandom.mockReturnValueOnce(0.789); // For third todo ID
  });

  afterEach(() => {
    mockMathRandom.mockRestore();
  });

  it('renders "Todo List" title', () => {
    render(<TodoList />);
    expect(screen.getByText('Todo List')).toBeInTheDocument();
  });

  it('adds a new todo item', () => {
    render(<TodoList />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    const addButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(inputElement, { target: { value: 'Learn Testing' } });
    fireEvent.click(addButton);

    expect(screen.getByText('Learn Testing')).toBeInTheDocument();
    expect((inputElement as HTMLInputElement).value).toBe('');
  });

  it('removes a todo item', async () => {
    render(<TodoList />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    const addButton = screen.getByRole('button', { name: /add/i });

    // Add first todo
    fireEvent.change(inputElement, { target: { value: 'Todo to be removed' } });
    fireEvent.click(addButton);
    expect(screen.getByText('Todo to be removed')).toBeInTheDocument();

    // Add second todo to ensure multiple items work
    fireEvent.change(inputElement, { target: { value: 'Another todo' } });
    fireEvent.click(addButton);
    expect(screen.getByText('Another todo')).toBeInTheDocument();

    // Find and click the remove button for the first todo
    const removeButtons = screen.getAllByTestId('cg-close-icon');
    const firstRemoveButton = removeButtons[0].closest('button');
    if (firstRemoveButton) {
      fireEvent.click(firstRemoveButton);
    }

    expect(screen.queryByText('Todo to be removed')).not.toBeInTheDocument();
    expect(screen.getByText('Another todo')).toBeInTheDocument(); // The other todo should still be there
  });

  it('does not add an empty todo item', () => {
    render(<TodoList />);
    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton); // Click without typing

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });
});
