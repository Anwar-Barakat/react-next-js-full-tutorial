import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShoppingList from '../components/ShoppingList';

describe('ShoppingList Component', () => {
  it('renders "Shopping List" title', () => {
    render(<ShoppingList />);
    expect(screen.getByText('Shopping List')).toBeInTheDocument();
  });

  it('adds a new item to the shopping list', () => {
    render(<ShoppingList />);
    const nameInput = screen.getByPlaceholderText('Item name');
    const quantityInput = screen.getByPlaceholderText('Quantity');
    const addButton = screen.getByRole('button', { name: /add item/i });

    fireEvent.change(nameInput, { target: { value: 'Apples' } });
    fireEvent.change(quantityInput, { target: { value: '3' } });
    fireEvent.click(addButton);

    expect(screen.getByText('Apples')).toBeInTheDocument();
    const listItem = screen.getByText('Apples').closest('li');
    expect(listItem).toHaveTextContent('Apples - Quantity: 3');
    expect((nameInput as HTMLInputElement).value).toBe('');
    expect((quantityInput as HTMLInputElement).value).toBe('1'); // Resets to default quantity
  });

  it('does not add an item with an empty name', () => {
    render(<ShoppingList />);
    const quantityInput = screen.getByPlaceholderText('Quantity');
    const addButton = screen.getByRole('button', { name: /add item/i });

    fireEvent.change(quantityInput, { target: { value: '5' } });
    fireEvent.click(addButton);

    expect(screen.queryByText('Quantity: 5')).not.toBeInTheDocument();
  });
});
