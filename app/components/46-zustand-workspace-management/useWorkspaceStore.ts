import { create } from "zustand";
import { produce } from "immer";

export interface Workspace {
    id: string;
    name: string;
    emoji: string;
}

export interface List {
    id: string;
    workspaceId: string;
    name: string;
    emoji: string;
}

export interface Todo {
    id: string;
    listId: string;
    text: string;
    completed: boolean;
}

interface WorkspaceState {
    workspaces: Workspace[];
    lists: List[];
    todos: Todo[];
    selectedWorkspaceId: string | null;
    selectedListId: string | null;
}

interface WorkspaceActions {
    addWorkspace: (name: string, emoji: string) => void;
    updateWorkspace: (id: string, name: string, emoji: string) => void;
    deleteWorkspace: (id: string) => void;
    selectWorkspace: (id: string | null) => void;

    addList: (workspaceId: string, name: string, emoji: string) => void;
    updateList: (id: string, name: string, emoji: string) => void;
    deleteList: (id: string) => void;
    selectList: (id: string | null) => void;

    addTodo: (listId: string, text: string) => void;
    updateTodo: (id: string, text: string, completed: boolean) => void;
    deleteTodo: (id: string) => void;
    toggleTodoCompletion: (id: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState & WorkspaceActions>((set, get) => ({
    workspaces: [],
    lists: [],
    todos: [],
    selectedWorkspaceId: null,
    selectedListId: null,

    addWorkspace: (name, emoji) =>
        set(produce((state: WorkspaceState) => {
            const newWorkspace: Workspace = { id: crypto.randomUUID(), name, emoji };
            state.workspaces.push(newWorkspace);
            if (!state.selectedWorkspaceId) {
                state.selectedWorkspaceId = newWorkspace.id;
            }
        })),

    updateWorkspace: (id, name, emoji) =>
        set(produce((state: WorkspaceState) => {
            const workspace = state.workspaces.find((ws) => ws.id === id);
            if (workspace) {
                workspace.name = name;
                workspace.emoji = emoji;
            }
        })),

    deleteWorkspace: (id) =>
        set(produce((state: WorkspaceState) => {
            state.workspaces = state.workspaces.filter((ws) => ws.id !== id);
            state.lists = state.lists.filter((list) => list.workspaceId !== id);
            state.todos = state.todos.filter((todo) =>
                !get().lists.some((list) => list.id === todo.listId && list.workspaceId === id)
            );
            if (state.selectedWorkspaceId === id) {
                state.selectedWorkspaceId = state.workspaces.length > 0 ? state.workspaces[0].id : null;
                state.selectedListId = null;
            }
        })),

    selectWorkspace: (id) =>
        set(produce((state: WorkspaceState) => {
            state.selectedWorkspaceId = id;
            state.selectedListId = null;
        })),

    addList: (workspaceId, name, emoji) =>
        set(produce((state: WorkspaceState) => {
            const newList: List = { id: crypto.randomUUID(), workspaceId, name, emoji };
            state.lists.push(newList);
            if (state.selectedWorkspaceId === workspaceId && !state.selectedListId) {
                state.selectedListId = newList.id;
            }
        })),

    updateList: (id, name, emoji) =>
        set(produce((state: WorkspaceState) => {
            const list = state.lists.find((l) => l.id === id);
            if (list) {
                list.name = name;
                list.emoji = emoji;
            }
        })),

    deleteList: (id) =>
        set(produce((state: WorkspaceState) => {
            state.lists = state.lists.filter((l) => l.id !== id);
            state.todos = state.todos.filter((todo) => todo.listId !== id);
            if (state.selectedListId === id) {
                const currentWorkspaceLists = state.lists.filter(l => l.workspaceId === state.selectedWorkspaceId);
                state.selectedListId = currentWorkspaceLists.length > 0 ? currentWorkspaceLists[0].id : null;
            }
        })),

    selectList: (id) =>
        set(produce((state: WorkspaceState) => {
            state.selectedListId = id;
        })),

    addTodo: (listId, text) =>
        set(produce((state: WorkspaceState) => {
            const newTodo: Todo = { id: crypto.randomUUID(), listId, text, completed: false };
            state.todos.push(newTodo);
        })),

    updateTodo: (id, text, completed) =>
        set(produce((state: WorkspaceState) => {
            const todo = state.todos.find((t) => t.id === id);
            if (todo) {
                todo.text = text;
                todo.completed = completed;
            }
        })),

    deleteTodo: (id) =>
        set(produce((state: WorkspaceState) => {
            state.todos = state.todos.filter((t) => t.id !== id);
        })),

    toggleTodoCompletion: (id) =>
        set(produce((state: WorkspaceState) => {
            const todo = state.todos.find((t) => t.id === id);
            if (todo) {
                todo.completed = !todo.completed;
            }
        })),
}));