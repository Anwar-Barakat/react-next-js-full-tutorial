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
    <div className="center-content py-12 px-4 min-h-screen bg-[var(--background)]">
      <div className="max-w-2xl w-full bg-[var(--card)] rounded-[var(--radius)] shadow-[var(--shadow-lg)] p-6 md:p-8 border border-[var(--border)]">
        <h2 className="text-3xl md:text-4xl font-bold center-text mb-6 text-[var(--foreground)]">Todo List with useReducer</h2>

        {/* Input for new todo */}
        <div className="flex mb-6 gap-2">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
            placeholder="Add a new task..."
            className="input flex-1"
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
              className="flex items-center justify-between p-4 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--muted)] hover:bg-[var(--muted)]/80 transition-colors"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
                  className="h-5 w-5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span
                  className={`ml-3 text-lg ${todo.completed ? 'line-through text-[var(--muted-foreground)]' : 'text-[var(--foreground)]'}`}
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
    </div>
  );
};
