'use client';
import React from 'react';
import { Workspace } from './useWorkspaceStore';

interface WorkspaceListProps {
  workspaces: Workspace[];
  selectedWorkspaceId: string | null;
  selectWorkspace: (id: string | null) => void;
  onAddWorkspace: () => void;
  onEditWorkspace: (workspace: Workspace) => void;
  onDeleteWorkspace: (id: string) => void;
}

const WorkspaceList: React.FC<WorkspaceListProps> = ({
  workspaces,
  selectedWorkspaceId,
  selectWorkspace,
  onAddWorkspace,
  onEditWorkspace,
  onDeleteWorkspace,
}) => {
  return (
    <div className="flex flex-col h-full">
      <button onClick={onAddWorkspace} className="btn btn-primary mb-4">
        + Add Workspace
      </button>
      <ul className="flex-1 overflow-y-auto">
        {workspaces.map((workspace) => (
          <li
            key={workspace.id}
            className={`flex items-center justify-between p-2 mb-2 rounded-md cursor-pointer transition-colors duration-200 ${
              selectedWorkspaceId === workspace.id ? 'bg-[var(--accent)]' : 'hover:bg-[var(--muted)]'
            }`}
            onClick={() => selectWorkspace(workspace.id)}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{workspace.emoji}</span>
              <span className="text-white">{workspace.name}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditWorkspace(workspace);
                }}
                className="btn btn-sm btn-accent"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteWorkspace(workspace.id);
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

export default WorkspaceList;
