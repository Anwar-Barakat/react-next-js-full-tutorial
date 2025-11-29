"use client";

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from './types';
import { useDispatch } from 'react-redux';
import { deleteCard, editCard } from './boardSlice';
import { Check, GripVertical, Edit2, X } from 'lucide-react';

interface TaskCardProps {
  card: Card;
  index: number;
  columnId: string;
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
      className={`bg-card p-3 mb-3 rounded shadow-sm border border-border text-foreground ${isDragging ? 'shadow-lg transform rotate-2 bg-primary/50' : ''}`}
    >
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Enter card content..."
            className="input resize-none focus:ring-primary text-sm bg-card text-foreground"
            rows={2}
            autoFocus
          />
          <button
            onClick={handleEdit}
            className="btn bg-primary/50 text-foreground self-end text-sm"
          >
            <Check className="w-4 h-4" /> Save
          </button>
        </div>
      ) : (
        <div className="flex items-start gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-foreground text-sm flex-1">{card.content}</p>
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={handleEdit}
              className="p-1 text-muted-foreground hover:text-primary transition-colors"
              title="Edit"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-muted-foreground hover:text-secondary transition-colors"
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