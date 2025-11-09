'use client';
import { useState } from 'react';
import { CgClose } from 'react-icons/cg';

interface TodoItem {
    id: number;
    name: string;
}

const TodoList = () => {
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() === '') return;
        setTodos([...todos, {
            id: Math.round(Math.random() * 1000),
            name
        }]);
        setName('');
    };

    const handleRemove = (id: number) => {
        setTodos(todos.filter(item => item.id !== id));
    };

    return (
        <div className="p-4 border border-gray-300 rounded-lg mt-4">
            <h2 className="text-2xl font-bold mb-2">Todo List</h2>
            <form onSubmit={handleSubmit} className="mb-4">
                <input 
                    name='name' 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="p-2 border border-gray-300 rounded mr-2"
                />
                <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add
                </button>
            </form>
            <ul>
                {todos.map((item) => (
                    <li key={item.id} className="flex justify-between items-center p-2 border-b border-gray-200">
                        <span>{item.name}</span>
                        <button 
                            onClick={() => handleRemove(item.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <CgClose />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
