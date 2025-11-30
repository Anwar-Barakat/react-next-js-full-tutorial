'use client';
import { useState } from 'react';

const TodoList = () => {
  const [todos, setTodos] = useState<string[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() !== '') {
      setTodos([...todos, newTodo]);
      setNewTodo('');
    }
  };

  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full glass rounded-lg p-6 md:p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 center-text">
          Todo List
        </h2>
        <form onSubmit={addTodo} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              className="input flex-1"
            />
            <button 
              type="submit"
              className="btn btn-primary"
            >
              Add Todo
            </button>
          </div>
        </form>
        <ul className="space-y-2">
          {todos.map((todo, index) => (
            <li 
              key={index} 
              className="p-4 glass rounded-lg text-foreground"
            >
              {todo}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
