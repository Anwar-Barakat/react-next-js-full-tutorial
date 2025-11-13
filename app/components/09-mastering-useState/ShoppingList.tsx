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
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8 shadow-[var(--shadow-md)]">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-6 center-text">
          Shopping List
        </h2>
        <form onSubmit={addItem} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              name="name"
              value={newItem.name}
              onChange={handleInputChange}
              placeholder="Item name"
              className="input flex-1"
            />
            <input
              type="number"
              name="quantity"
              value={newItem.quantity}
              onChange={handleInputChange}
              placeholder="Quantity"
              className="input w-full sm:w-32"
            />
            <button 
              type="submit"
              className="btn btn-primary"
            >
              Add Item
            </button>
          </div>
        </form>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li 
              key={index} 
              className="p-4 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--muted)] text-[var(--foreground)]"
            >
              <span className="font-semibold">{item.name}</span> - Quantity: {item.quantity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShoppingList;
