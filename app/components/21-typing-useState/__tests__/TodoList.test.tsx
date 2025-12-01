import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TodoList } from '../components/TodoList';

describe('TodoList Component', () => {
  it('renders initial todo items', () => {
    render(<TodoList />);
    expect(screen.getByText('Learn TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Build React App')).toBeInTheDocument();
  });

  it('adds a new todo item', () => {
    render(<TodoList />);
    const inputElement = screen.getByPlaceholderText('Add a new todo') as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: /add todo/i });

    fireEvent.change(inputElement, { target: { value: 'New Test Todo' } });
    fireEvent.click(addButton);

    expect(screen.getByText('New Test Todo')).toBeInTheDocument();
    expect(inputElement.value).toBe(''); // Input should be cleared
  });

  it('toggles todo completion status', () => {
    render(<TodoList />);
    const learnTypeScriptTodo = screen.getByText('Learn TypeScript');
    const checkbox = learnTypeScriptTodo.previousSibling as HTMLInputElement; // Get the checkbox associated

    expect(checkbox).not.toBeChecked();
    expect(learnTypeScriptTodo).not.toHaveClass('line-through');

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(learnTypeScriptTodo).toHaveClass('line-through');

    fireEvent.click(checkbox); // Toggle back
    expect(checkbox).not.toBeChecked();
    expect(learnTypeScriptTodo).not.toHaveClass('line-through');
  });

  it('does not add empty todo', () => {
    render(<TodoList />);
    const addButton = screen.getByRole('button', { name: /add todo/i });
    fireEvent.click(addButton); // Click without typing

    expect(screen.queryByText('Add a new todo')).not.toBeInTheDocument(); // Assuming no default empty todo is shown
  });
});
