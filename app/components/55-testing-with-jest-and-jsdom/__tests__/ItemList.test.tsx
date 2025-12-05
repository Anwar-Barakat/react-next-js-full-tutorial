import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ItemList } from '../components/ItemList';

describe('ItemList', () => {
  test('renders "No items to display." when the items array is empty', () => {
    render(<ItemList items={[]} />);
    expect(screen.getByText('No items to display.')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  test('renders a list of items correctly', () => {
    const items = ['Apple', 'Banana', 'Cherry'];
    render(<ItemList items={items} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(items.length);

    items.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });

    expect(within(listItems[0]).getByText('Apple')).toBeInTheDocument();
    expect(within(listItems[1]).getByText('Banana')).toBeInTheDocument();
    expect(within(listItems[2]).getByText('Cherry')).toBeInTheDocument();
  });
});
