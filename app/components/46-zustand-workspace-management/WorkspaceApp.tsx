'use client';
import React, { useState } from 'react';
import { useWorkspaceStore, Workspace, List, Todo } from './useWorkspaceStore';
import WorkspaceList from './WorkspaceList';
import ListList from './ListList';
import TodoList from './TodoList';

const WorkspaceApp = () => {
  const {
    workspaces,
    lists,
    todos,
    selectedWorkspaceId,
    selectedListId,
    selectWorkspace,
    selectList,
    addWorkspace,
    updateWorkspace,
    deleteWorkspace,
    addList,
    updateList,
    deleteList,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoCompletion,
  } = useWorkspaceStore();

  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);

  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [currentList, setCurrentList] = useState<List | null>(null);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);

  const [modalName, setModalName] = useState('');
  const [modalEmoji, setModalEmoji] = useState('');
  const [modalTodoText, setModalTodoText] = useState('');
  const [modalTodoCompleted, setModalTodoCompleted] = useState(false);

  const handleOpenWorkspaceModal = (workspace: Workspace | null = null) => {
    setCurrentWorkspace(workspace);
    setModalName(workspace ? workspace.name : '');
    setModalEmoji(workspace ? workspace.emoji : '');
    setIsWorkspaceModalOpen(true);
  };

  const handleSaveWorkspace = () => {
    if (!modalName.trim()) return;
    if (currentWorkspace) {
      updateWorkspace(currentWorkspace.id, modalName, modalEmoji);
    } else {
      addWorkspace(modalName, modalEmoji);
    }
    setIsWorkspaceModalOpen(false);
  };

  const handleOpenListModal = (list: List | null = null) => {
    setCurrentList(list);
    setModalName(list ? list.name : '');
    setModalEmoji(list ? list.emoji : '');
    setIsListModalOpen(true);
  };

  const handleSaveList = () => {
    if (!modalName.trim() || !selectedWorkspaceId) return;
    if (currentList) {
      updateList(currentList.id, modalName, modalEmoji);
    } else {
      addList(selectedWorkspaceId, modalName, modalEmoji);
    }
    setIsListModalOpen(false);
  };

  const handleOpenTodoModal = (todo: Todo | null = null) => {
    setCurrentTodo(todo);
    setModalTodoText(todo ? todo.text : '');
    setModalTodoCompleted(todo ? todo.completed : false);
    setIsTodoModalOpen(true);
  };

  const handleSaveTodo = () => {
    if (!modalTodoText.trim() || !selectedListId) return;
    if (currentTodo) {
      updateTodo(currentTodo.id, modalTodoText, modalTodoCompleted);
    } else {
      addTodo(selectedListId, modalTodoText);
    }
    setIsTodoModalOpen(false);
  };

  const currentWorkspaceData = selectedWorkspaceId
    ? workspaces.find((ws) => ws.id === selectedWorkspaceId)
    : null;

  const currentLists = selectedWorkspaceId
    ? lists.filter((list) => list.workspaceId === selectedWorkspaceId)
    : [];

  const currentTodos = selectedListId
    ? todos.filter((todo) => todo.listId === selectedListId)
    : [];

  return (
    <div className="card flex h-screen p-0 overflow-hidden">
      {/* Workspace Sidebar */}
      <div className="w-1/4 p-4 border-r border-[var(--border)] bg-[var(--card)] flex flex-col">
        <h3 className="text-xl font-bold text-white mb-4">Workspaces</h3>
        <WorkspaceList
          workspaces={workspaces}
          selectedWorkspaceId={selectedWorkspaceId}
          selectWorkspace={selectWorkspace}
          onAddWorkspace={() => handleOpenWorkspaceModal()}
          onEditWorkspace={handleOpenWorkspaceModal}
          onDeleteWorkspace={deleteWorkspace}
        />
      </div>

      {/* Lists Section */}
      <div className="w-1/4 p-4 border-r border-[var(--border)] bg-[var(--card)] flex flex-col">
        <h3 className="text-xl font-bold text-white mb-4">
          {currentWorkspaceData ? `${currentWorkspaceData.emoji} ${currentWorkspaceData.name} Lists` : 'Select a Workspace'}
        </h3>
        {selectedWorkspaceId && (
          <ListList
            lists={currentLists}
            selectedWorkspaceId={selectedWorkspaceId}
            selectedListId={selectedListId}
            selectList={selectList}
            onAddList={() => handleOpenListModal()}
            onEditList={handleOpenListModal}
            onDeleteList={deleteList}
          />
        )}
      </div>

      {/* Todos Section */}
      <div className="w-1/2 p-4 bg-[var(--background)] flex flex-col">
        <h3 className="text-xl font-bold text-white mb-4">
          {currentList ? `${currentList.emoji} ${currentList.name} Todos` : 'Select a List'}
        </h3>
        {selectedListId && (
          <TodoList
            todos={currentTodos}
            onAddTodo={() => handleOpenTodoModal()}
            onEditTodo={handleOpenTodoModal}
            onDeleteTodo={deleteTodo}
            onToggleTodoCompletion={toggleTodoCompletion}
          />
        )}
      </div>

      {/* Workspace Modal */}
      {isWorkspaceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--card)] p-6 rounded-lg shadow-lg w-96">
            <h4 className="text-lg font-bold text-white mb-4">
              {currentWorkspace ? 'Edit Workspace' : 'Add Workspace'}
            </h4>
            <input
              type="text"
              placeholder="Workspace Name"
              value={modalName}
              onChange={(e) => setModalName(e.target.value)}
              className="input mb-3 w-full"
            />
            <input
              type="text"
              placeholder="Emoji (e.g., 🏠)"
              value={modalEmoji}
              onChange={(e) => setModalEmoji(e.target.value)}
              className="input mb-4 w-full"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsWorkspaceModalOpen(false)} className="btn btn-muted">
                Cancel
              </button>
              <button onClick={handleSaveWorkspace} className="btn btn-primary">
                {currentWorkspace ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List Modal */}
      {isListModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--card)] p-6 rounded-lg shadow-lg w-96">
            <h4 className="text-lg font-bold text-white mb-4">
              {currentList ? 'Edit List' : 'Add List'}
            </h4>
            <input
              type="text"
              placeholder="List Name"
              value={modalName}
              onChange={(e) => setModalName(e.target.value)}
              className="input mb-3 w-full"
            />
            <input
              type="text"
              placeholder="Emoji (e.g., 📝)"
              value={modalEmoji}
              onChange={(e) => setModalEmoji(e.target.value)}
              className="input mb-4 w-full"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsListModalOpen(false)} className="btn btn-muted">
                Cancel
              </button>
              <button onClick={handleSaveList} className="btn btn-primary">
                {currentList ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Todo Modal */}
      {isTodoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--card)] p-6 rounded-lg shadow-lg w-96">
            <h4 className="text-lg font-bold text-white mb-4">
              {currentTodo ? 'Edit Todo' : 'Add Todo'}
            </h4>
            <input
              type="text"
              placeholder="Todo Text"
              value={modalTodoText}
              onChange={(e) => setModalTodoText(e.target.value)}
              className="input mb-3 w-full"
            />
            {currentTodo && (
              <label className="flex items-center text-white mb-4">
                <input
                  type="checkbox"
                  checked={modalTodoCompleted}
                  onChange={(e) => setModalTodoCompleted(e.target.checked)}
                  className="mr-2"
                />
                Completed
              </label>
            )}
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsTodoModalOpen(false)} className="btn btn-muted">
                Cancel
              </button>
              <button onClick={handleSaveTodo} className="btn btn-primary">
                {currentTodo ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceApp;
