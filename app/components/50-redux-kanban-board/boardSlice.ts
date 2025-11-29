import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Card {
  id: string;
  content: string;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface BoardState {
  cards: Record<string, Card>;
  columns: Record<string, Column>;
  columnOrder: string[];
}

const initialState: BoardState = {
  cards: {
    'card-1': { id: 'card-1', content: 'Set up project structure' },
    'card-2': { id: 'card-2', content: 'Install dependencies' },
    'card-3': { id: 'card-3', content: 'Define Redux slices' },
    'card-4': { id: 'card-4', content: 'Create Kanban components' },
    'card-5': { id: 'card-5', content: 'Implement drag and drop' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      cardIds: ['card-1', 'card-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      cardIds: ['card-3'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      cardIds: ['card-4', 'card-5'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

const boardSlice = createSlice({
  name: 'kanbanBoard',
  initialState,
  reducers: {
    addCard: (state, action: PayloadAction<{ columnId: string; content: string }>) => {
      const newCardId = `card-${Date.now()}`;
      state.cards[newCardId] = { id: newCardId, content: action.payload.content };
      state.columns[action.payload.columnId].cardIds.push(newCardId);
    },
    deleteCard: (state, action: PayloadAction<{ cardId: string; columnId: string }>) => {
      const { cardId, columnId } = action.payload;
      delete state.cards[cardId];
      state.columns[columnId].cardIds = state.columns[columnId].cardIds.filter(id => id !== cardId);
    },
    editCard: (state, action: PayloadAction<{ cardId: string; content: string }>) => {
      state.cards[action.payload.cardId].content = action.payload.content;
    },
    moveCard: (
      state,
      action: PayloadAction<{
        sourceColumnId: string;
        destinationColumnId: string;
        sourceIndex: number;
        destinationIndex: number;
        draggableId: string;
      }>
    ) => {
      const { sourceColumnId, destinationColumnId, sourceIndex, destinationIndex, draggableId } = action.payload;

      if (sourceColumnId === destinationColumnId) {
        const column = state.columns[sourceColumnId];
        const newCardIds = Array.from(column.cardIds);
        newCardIds.splice(sourceIndex, 1);
        newCardIds.splice(destinationIndex, 0, draggableId);
        column.cardIds = newCardIds;
      } else {
        const sourceColumn = state.columns[sourceColumnId];
        const destinationColumn = state.columns[destinationColumnId];

        const newSourceCardIds = Array.from(sourceColumn.cardIds);
        newSourceCardIds.splice(sourceIndex, 1);
        sourceColumn.cardIds = newSourceCardIds;

        const newDestinationCardIds = Array.from(destinationColumn.cardIds);
        newDestinationCardIds.splice(destinationIndex, 0, draggableId);
        destinationColumn.cardIds = newDestinationCardIds;
      }
    },
  },
});

export const { addCard, deleteCard, editCard, moveCard } = boardSlice.actions;
export default boardSlice.reducer;
