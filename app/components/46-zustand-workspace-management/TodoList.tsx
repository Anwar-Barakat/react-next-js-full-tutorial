'use client';
import React from 'react';
import { Todo } from './useWorkspaceStore';

interface TodoListProps {
  todos: Todo[];
  onAddTodo: () => void;
  onEditTodo: (todo: Todo) => void;
  onDeleteTodo: (id: string) => void;
  onToggleTodoCompletion: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onAddTodo,
  onEditTodo,
  onDeleteTodo,
  onToggleTodoCompletion,
}) => {
  return (
    <div className="flex flex-col h-full">
      <button onClick={onAddTodo} className="btn btn-primary mb-4">
        + Add Todo
      </button>
      <ul className="flex-1 overflow-y-auto">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`flex items-center justify-between p-2 mb-2 rounded-md ${
              todo.completed ? 'bg-gray-700 line-through text-gray-400' : 'bg-gray-800 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggleTodoCompletion(todo.id)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span>{todo.text}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEditTodo(todo)}
                className="btn btn-sm btn-accent"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteTodo(todo.id)}
                className="btn btn-sm btn-danger"
              >
                X
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
