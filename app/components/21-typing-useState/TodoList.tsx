'use client';
import React, { useState } from 'react';
import { TodoItem } from './types';

export const TodoList: React.FC = () => {
  // Explicitly typing the state variable as an array of TodoItem
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: 'Learn TypeScript', completed: false },
    { id: 2, text: 'Build React App', completed: false },
  ]);
  const [newTodoText, setNewTodoText] = useState<string>('');

  const addTodo = () => {
    if (newTodoText.trim() === '') return;
    const newTodo: TodoItem = {
      id: todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1,
      text: newTodoText,
      completed: false,
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
    setNewTodoText('');
  };

  const toggleTodo = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="p-6 border border-border rounded-lg shadow-md bg-card text-foreground">
      <h3 className="text-xl font-semibold mb-4 text-foreground">Todo List (Array State)</h3>
      <div className="flex mb-4 gap-2">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new todo"
              className="input flex-1"
        />
        <button
          onClick={addTodo}
              className="btn btn-primary"
        >
          Add Todo
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center p-3 border border-border rounded-lg bg-muted">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="mr-3 w-4 h-4"
            />
            <span 
              className={todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}
            >
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
