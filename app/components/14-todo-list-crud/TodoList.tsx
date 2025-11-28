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
        <div className="center-content py-12 px-4">
            <div className="max-w-2xl w-full bg-card border border-border rounded-lg p-6 md:p-8 shadow-md">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 center-text">
                    Todo List
                </h2>
                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="flex gap-2">
                        <input 
                            name='name' 
                            value={name} 
                            onChange={e => setName(e.target.value)}
                            placeholder="Add a new todo..."
                            className="input flex-1"
                        />
                        <button 
                            type="submit"
                            className="btn btn-primary"
                        >
                            Add
                        </button>
                    </div>
                </form>
                <ul className="space-y-2">
                    {todos.map((item) => (
                        <li 
                            key={item.id} 
                            className="flex justify-between items-center p-4 border border-border rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                        >
                            <span className="text-foreground">{item.name}</span>
                            <button 
                                onClick={() => handleRemove(item.id)}
                                className="text-secondary hover:text-secondary/80 transition-colors p-1"
                            >
                                <CgClose size={20} />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TodoList;
