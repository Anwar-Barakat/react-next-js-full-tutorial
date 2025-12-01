import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoList from '../components/TodoList';

describe('TodoList Component', () => {
  it('renders "Todo List" title', () => {
    render(<TodoList />);
    expect(screen.getByText('Todo List')).toBeInTheDocument();
  });

  it('adds a new todo item when submitted', () => {
    render(<TodoList />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    const addButton = screen.getByRole('button', { name: /add todo/i });

    fireEvent.change(inputElement, { target: { value: 'Buy groceries' } });
    fireEvent.click(addButton);

    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect((inputElement as HTMLInputElement).value).toBe(''); // Input should be cleared
  });

  it('does not add an empty todo item', () => {
    render(<TodoList />);
    const addButton = screen.getByRole('button', { name: /add todo/i });

    fireEvent.click(addButton); // Click without typing
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });
});
