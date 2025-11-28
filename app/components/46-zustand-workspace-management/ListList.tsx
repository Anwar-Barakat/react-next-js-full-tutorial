'use client';
import React from 'react';
import { List } from './useWorkspaceStore';

interface ListListProps {
  lists: List[];
  selectedListId: string | null;
  selectedWorkspaceId: string | null;
  selectList: (id: string | null) => void;
  onAddList: () => void;
  onEditList: (list: List) => void;
  onDeleteList: (id: string) => void;
}

const ListList: React.FC<ListListProps> = ({
  lists,
  selectedWorkspaceId,
  selectedListId,
  selectList,
  onAddList,
  onEditList,
  onDeleteList,
}) => {

  console.log(selectedListId)

  return (
    <div className="flex flex-col h-full">
      <button onClick={onAddList} className="btn btn-primary mb-4"
      disabled={!selectedWorkspaceId}
      >
        + Add List
      </button>
      <ul className="flex-1 overflow-y-auto">
        {lists.map((list) => (
          <li
            key={list.id}
            className={`flex items-center justify-between p-2 mb-2 rounded-md cursor-pointer transition-colors duration-200 ${selectedListId === list.id ? 'bg-accent' : 'hover:bg-muted'
              }`}
            onClick={() => selectList(list.id)}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{list.emoji}</span>
              <span className="text-foreground">{list.name}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditList(list);
                }}
                className="btn btn-sm btn-accent"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteList(list.id);
                }}
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

export default ListList;
