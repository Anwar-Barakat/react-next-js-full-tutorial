"use client";

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from './types';
import { useDispatch } from 'react-redux';
import { deleteCard, editCard } from './boardSlice'; // Import actions
import { Check, GripVertical, Edit2, X } from 'lucide-react'; // Assuming lucide-react is installed for icons

interface TaskCardProps {
  card: Card;
  index: number;
  columnId: string; // Add columnId to props for delete action
}

const TaskCard: React.FC<TaskCardProps> = React.memo(({ card, index, columnId }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(card.content);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEdit = () => {
    if (isEditing && editContent.trim()) {
      dispatch(editCard({ cardId: card.id, content: editContent.trim() }));
    }
    setIsEditing(!isEditing);
  };

  const handleDelete = () => {
    dispatch(deleteCard({ cardId: card.id, columnId }));
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white dark:bg-gray-700 p-3 mb-3 rounded shadow-sm border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200
        ${isDragging ? 'shadow-lg transform rotate-2 bg-blue-50 dark:bg-blue-900' : ''}`}
    >
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Enter card content..."
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            rows={2}
            autoFocus
          />
          <button
            onClick={handleEdit}
            className="self-end px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center gap-1"
          >
            <Check className="w-4 h-4" /> Save
          </button>
        </div>
      ) : (
        <div className="flex items-start gap-2">
          <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-gray-800 text-sm flex-1">{card.content}</p>
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={handleEdit}
              className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
              title="Edit"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default TaskCard;

TaskCard.displayName = 'TaskCard';



