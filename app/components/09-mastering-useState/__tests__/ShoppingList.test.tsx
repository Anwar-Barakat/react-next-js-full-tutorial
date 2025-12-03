import { render, screen, fireEvent, within } from '@testing-library/react';
import ShoppingList from '../components/ShoppingList';

describe('ShoppingList', () => {
  it('renders "Shopping List" title', () => {
    render(<ShoppingList />);
    expect(screen.getByText('Shopping List')).toBeInTheDocument();
  });

  it('adds a new item to the shopping list and clears inputs', () => {
    render(<ShoppingList />);
    const nameInput = screen.getByPlaceholderText('Item name');
    const quantityInput = screen.getByPlaceholderText('Quantity');
    const addButton = screen.getByRole('button', { name: /add item/i });

    fireEvent.change(nameInput, { target: { value: 'Apples' } });
    fireEvent.change(quantityInput, { target: { value: '3' } });
    fireEvent.click(addButton);

    const shoppingList = screen.getByRole('list'); // Assuming there's only one ul, or add a data-testid

    // Now, use within to query for the list item inside the ul
    const listItems = within(shoppingList).getAllByRole('listitem');

    const targetItem = listItems.find(item => {
      const normalizedContent = (item.textContent || '').replace(/\s+/g, ' ').trim();
      return normalizedContent === 'Apples - Quantity: 3';
    });

    expect(targetItem).toBeInTheDocument();
    expect(nameInput).toHaveValue('');
    expect(quantityInput).toHaveValue(1); // Resets to default quantity 1
  });

  it('does not add an item with an empty name', () => {
    render(<ShoppingList />);
    const quantityInput = screen.getByPlaceholderText('Quantity');
    const addButton = screen.getByRole('button', { name: /add item/i });

    fireEvent.change(quantityInput, { target: { value: '5' } });
    fireEvent.click(addButton);

    expect(screen.queryByText(/Quantity: 5/)).not.toBeInTheDocument(); // Assert the item is NOT added
  });
});
