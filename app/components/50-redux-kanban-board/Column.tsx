"use client";

import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { Column as ColumnType } from './types';
import { addCard } from './boardSlice';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  index: number;
}

const Column: React.FC<ColumnProps> = React.memo(({ column }) => {
  const { id, title, cardIds } = column;
  const cards = useSelector((state: RootState) =>
    cardIds.map((cardId) => state.kanbanBoard.cards[cardId])
  );
  const dispatch = useDispatch();
  const [newCardContent, setNewCardContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const handleAddCard = () => {
    if (newCardContent.trim()) {
      dispatch(addCard({ columnId: id, content: newCardContent.trim() }));
      setNewCardContent('');
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-card/50 rounded-lg shadow-md p-4 w-80 flex flex-col flex-shrink-0 mx-2">
      <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
      <div
        ref={setNodeRef}
        className={`flex-grow min-h-[100px] ${isOver ? 'bg-primary/50' : ''}`}
      >
        <SortableContext items={cards.map(card => card.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card, index) => (
            <TaskCard key={card.id} card={card} index={index} columnId={id} />
          ))}
        </SortableContext>
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        {isAdding ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={newCardContent}
              onChange={(e) => setNewCardContent(e.target.value)}
              placeholder="Enter card content..."
              className="input resize-none focus:ring-primary text-sm bg-card/50 text-foreground"
              rows={2}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleAddCard();
                }
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddCard}
                className="btn bg-primary/50 text-foreground flex-1"
              >
                Add Card
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewCardContent('');
                }}
                className="btn bg-muted/50 text-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-2 p-2 text-muted-foreground hover:bg-muted/50 rounded transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add a card
          </button>
        )}
      </div>
    </div>
  );
});

export default Column;

Column.displayName = 'Column';