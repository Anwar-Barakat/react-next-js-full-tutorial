'use client';
import React, { useReducer, useState } from 'react';
import { todoReducer } from './todoReducer';
import { Todo } from './types';

const initialTodos: Todo[] = [
  { id: 1, text: 'Learn useReducer', completed: false },
  { id: 2, text: 'Apply TypeScript', completed: true },
];

export const TodoList: React.FC = () => {
  const [state, dispatch] = useReducer(todoReducer, initialTodos);
  const [newTodoText, setNewTodoText] = useState<string>('');

  const handleAddTodo = () => {
    if (newTodoText.trim() === '') return;
    dispatch({ type: 'ADD_TODO', payload: newTodoText });
    setNewTodoText('');
  };

  return (
    <div className="glass glass-xl w-full max-w-2xl">
      <h2 className="text-3xl font-bold text-primary text-center mb-6">Todo List with useReducer</h2>

      {/* Input for new todo */}
      <div className="flex mb-6 gap-2">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
          placeholder="Add a new task..."
          className="input flex-1 bg-white/10 border-white/20 focus:border-primary focus:bg-white/20"
        />
        <button
          onClick={handleAddTodo}
          className="btn btn-primary"
        >
          Add
        </button>
      </div>

      {/* List of todos */}
      <ul className="space-y-2">
        {state.map(todo => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-4 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
                className="h-5 w-5 rounded border-white/50 text-primary focus:ring-primary"
              />
              <span
                className={`ml-3 text-lg ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
              >
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}
              className="btn btn-danger btn-sm rounded-full"
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};