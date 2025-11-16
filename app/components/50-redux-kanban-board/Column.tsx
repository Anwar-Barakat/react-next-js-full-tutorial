"use client";

import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { Column as ColumnType } from './types';
import { addCard } from './boardSlice'; // Import addCard action
import { Plus } from 'lucide-react'; // Assuming lucide-react is installed for icons
import TaskCard from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  index: number;
}

const Column: React.FC<ColumnProps> = React.memo(({ column }) => {
  const cards = useSelector((state: RootState) =>
    column.cardIds.map((cardId) => state.kanbanBoard.cards[cardId])
  );
  const dispatch = useDispatch();
  const [newCardContent, setNewCardContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCard = () => {
    if (newCardContent.trim()) {
      dispatch(addCard({ columnId: column.id, content: newCardContent.trim() }));
      setNewCardContent('');
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-4 w-80 flex flex-col flex-shrink-0 mx-2">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{column.title}</h3>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-grow min-h-[100px] ${snapshot.isDraggingOver ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
          >
            {cards.map((card, index) => (
              <TaskCard key={card.id} card={card} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add Card Section */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        {isAdding ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={newCardContent}
              onChange={(e) => setNewCardContent(e.target.value)}
              placeholder="Enter card content..."
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                className="flex-1 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
              >
                Add Card
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewCardContent('');
                }}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-2 p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors text-sm dark:text-gray-400 dark:hover:bg-gray-700"
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


