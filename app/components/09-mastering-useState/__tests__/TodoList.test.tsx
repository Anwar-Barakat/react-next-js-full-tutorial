import { render, fireEvent, within } from '@testing-library/react';
import TodoList from '../components/TodoList';

describe('TodoList', () => {
  it('renders "Todo List" title', () => {
    const { container } = render(<TodoList />);
    expect(within(container).getByText('Todo List')).toBeInTheDocument();
  });

  it('adds a new todo item when submitted and clears input', () => {
    const { container } = render(<TodoList />);
    const inputElement = within(container).getByPlaceholderText('Add a new todo...');
    const addButton = within(container).getByRole('button', { name: /add todo/i });

    fireEvent.change(inputElement, { target: { value: 'Buy groceries' } });
    fireEvent.click(addButton);

    expect(within(container).getByText('Buy groceries')).toBeInTheDocument();
    expect(inputElement).toHaveValue(''); // Input should be cleared
  });

  it('does not add an empty todo item', () => {
    const { container } = render(<TodoList />);
    const addButton = within(container).getByRole('button', { name: /add todo/i });

    fireEvent.click(addButton); // Click without typing

    expect(within(container).queryByRole('listitem')).not.toBeInTheDocument(); // Also check no list items are added
  });
});
