'use client';
import { useState } from 'react';

interface ShoppingItem {
  name: string;
  quantity: number;
}

const ShoppingList = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1 });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.name.trim() !== '') {
      setItems([...items, newItem]);
      setNewItem({ name: '', quantity: 1 });
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg mt-4">
      <h2 className="text-2xl font-bold mb-2">Shopping List</h2>
      <form onSubmit={addItem} className="mb-4">
        <input
          type="text"
          name="name"
          value={newItem.name}
          onChange={handleInputChange}
          placeholder="Item name"
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <input
          type="number"
          name="quantity"
          value={newItem.quantity}
          onChange={handleInputChange}
          placeholder="Quantity"
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Item
        </button>
      </form>
      <ul>
        {items.map((item, index) => (
          <li key={index} className="p-2 border-b border-gray-200">
            {item.name} - Quantity: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingList;
