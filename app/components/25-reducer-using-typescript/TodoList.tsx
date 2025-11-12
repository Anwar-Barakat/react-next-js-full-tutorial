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
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Todo List with useReducer</h2>

        {/* Input for new todo */}
        <div className="flex mb-4">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
            placeholder="Add a new task..."
            className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddTodo}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors duration-200"
          >
            Add
          </button>
        </div>

        {/* List of todos */}
        <ul>
          {state.map(todo => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-3 mb-2 bg-gray-50 dark:bg-gray-700 rounded-md"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span
                  className={`ml-3 text-lg ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}
                >
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}
                className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full hover:bg-red-600 transition-colors duration-200"
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
