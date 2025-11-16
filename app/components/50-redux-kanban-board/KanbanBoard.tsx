"use client";

import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { moveCard } from './boardSlice';
import Column from './Column';

const KanbanBoard: React.FC = () => {
  const board = useSelector((state: RootState) => state.kanbanBoard);
  const dispatch = useDispatch();

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    dispatch(
      moveCard({
        sourceColumnId: source.droppableId,
        destinationColumnId: destination.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
        draggableId: draggableId,
      })
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex p-4 space-x-4 overflow-x-auto">
        {board.columnOrder.map((columnId) => {
          const column = board.columns[columnId];
          return <Column key={column.id} column={column} />;
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;