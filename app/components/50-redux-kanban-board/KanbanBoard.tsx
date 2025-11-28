"use client";

import React from 'react';
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { moveCard } from './boardSlice';
import Column from './Column';

const KanbanBoard: React.FC = () => {
  const board = useSelector((state: RootState) => state.kanbanBoard);
  const dispatch = useDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Enable dragging after 8px of movement
      },
    })
  );

  const findColumn = (id: string) => {
    if (board.columns[id]) {
      return id;
    }
    const columnIds = Object.keys(board.columns);
    for (const columnId of columnIds) {
      if (board.columns[columnId].cardIds.includes(id)) {
        return columnId;
      }
    }
    return undefined;
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeColumnId = findColumn(active.id as string);
    const overColumnId = findColumn(over.id as string);

    if (!activeColumnId || !overColumnId) {
      return;
    }

    const activeCardIndex = board.columns[activeColumnId].cardIds.indexOf(active.id as string);
    // Determine the overCardIndex carefully. If over is a column itself, place at end.
    // If over is a card, get its index within its column.
    const overCardIndex = over.data.current?.sortable?.index ?? board.columns[overColumnId].cardIds.length;


    if (activeColumnId === overColumnId) {
      if (activeCardIndex === -1) return; // Should not happen if activeCardIndex is found

      const newCardIds = arrayMove(
        board.columns[activeColumnId].cardIds,
        activeCardIndex,
        overCardIndex
      );

      // Dispatch moveCard for reordering within the same column
      dispatch(
        moveCard({
          sourceColumnId: activeColumnId,
          destinationColumnId: overColumnId,
          sourceIndex: activeCardIndex,
          destinationIndex: overCardIndex,
          draggableId: active.id as string,
        })
      );
    } else {
      // Moving card between columns
      dispatch(
        moveCard({
          sourceColumnId: activeColumnId,
          destinationColumnId: overColumnId,
          sourceIndex: activeCardIndex,
          destinationIndex: overCardIndex, // Use the calculated overCardIndex for inter-column moves
          draggableId: active.id as string,
        })
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={onDragEnd}
    >
      <div className="flex p-4 space-x-4 overflow-x-auto">
        {board.columnOrder.map((columnId, index) => {
          const column = board.columns[columnId];
          return <Column key={column.id} column={column} index={index} />;
        })}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;