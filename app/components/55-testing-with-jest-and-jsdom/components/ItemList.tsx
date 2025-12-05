import React from 'react';

interface ItemListProps {
  items: string[];
}

export const ItemList: React.FC<ItemListProps> = ({ items }) => {
  return (
    <div>
      <h2>Items:</h2>
      {items.length === 0 ? (
        <p>No items to display.</p>
      ) : (
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
