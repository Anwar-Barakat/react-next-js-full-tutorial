import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkspaceApp from '../components/WorkspaceApp';
import { useWorkspaceStore, Workspace, List, Todo } from '../useWorkspaceStore';

// Mock the Zustand store
jest.mock('../useWorkspaceStore', () => ({
  useWorkspaceStore: jest.fn(),
}));

const mockUseWorkspaceStore = useWorkspaceStore as jest.Mock;

// Mock child components
jest.mock('../WorkspaceList', () => ({
  __esModule: true,
  default: jest.fn(({ workspaces, selectedWorkspaceId, selectWorkspace, onAddWorkspace, onEditWorkspace, onDeleteWorkspace }) => (
    <div data-testid="mock-workspace-list">
      Mock WorkspaceList
      <button onClick={() => onAddWorkspace()} data-testid="add-workspace-btn">Add Workspace</button>
      {workspaces.map((ws: Workspace) => (
        <div key={ws.id} data-testid={`ws-item-${ws.id}`}>
          {ws.name}
          <button onClick={() => onEditWorkspace(ws)} data-testid={`edit-ws-btn-${ws.id}`}>Edit</button>
          <button onClick={() => onDeleteWorkspace(ws.id)} data-testid={`delete-ws-btn-${ws.id}`}>Delete</button>
        </div>
      ))}
    </div>
  )),
}));

jest.mock('../ListList', () => ({
  __esModule: true,
  default: jest.fn(({ lists, selectedListId, selectList, onAddList, onEditList, onDeleteList }) => (
    <div data-testid="mock-list-list">
      Mock ListList
      <button onClick={() => onAddList()} data-testid="add-list-btn">Add List</button>
      {lists.map((list: List) => (
        <div key={list.id} data-testid={`list-item-${list.id}`}>
          {list.name}
          <button onClick={() => onEditList(list)} data-testid={`edit-list-btn-${list.id}`}>Edit</button>
          <button onClick={() => onDeleteList(list.id)} data-testid={`delete-list-btn-${list.id}`}>Delete</button>
        </div>
      ))}
    </div>
  )),
}));

jest.mock('../TodoList', () => ({
  __esModule: true,
  default: jest.fn(({ todos, onAddTodo, onEditTodo, onDeleteTodo, onToggleTodoCompletion }) => (
    <div data-testid="mock-todo-list">
      Mock TodoList
      <button onClick={() => onAddTodo()} data-testid="add-todo-btn">Add Todo</button>
      {todos.map((todo: Todo) => (
        <div key={todo.id} data-testid={`todo-item-${todo.id}`}>
          {todo.text}
          <button onClick={() => onEditTodo(todo)} data-testid={`edit-todo-btn-${todo.id}`}>Edit</button>
          <button onClick={() => onDeleteTodo(todo.id)} data-testid={`delete-todo-btn-${todo.id}`}>Delete</button>
          <input type="checkbox" checked={todo.completed} onChange={() => onToggleTodoCompletion(todo.id)} data-testid={`toggle-todo-btn-${todo.id}`} />
        </div>
      ))}
    </div>
  )),
}));

describe('WorkspaceApp', () => {
  let addWorkspace: jest.Mock;
  let updateWorkspace: jest.Mock;
  let deleteWorkspace: jest.Mock;
  let selectWorkspace: jest.Mock;
  let addList: jest.Mock;
  let updateList: jest.Mock;
  let deleteList: jest.Mock;
  let selectList: jest.Mock;
  let addTodo: jest.Mock;
  let updateTodo: jest.Mock;
  let deleteTodo: jest.Mock;
  let toggleTodoCompletion: jest.Mock;

  const mockWorkspaces: Workspace[] = [
    { id: 'ws1', name: 'Home', emoji: '🏠' },
    { id: 'ws2', name: 'Work', emoji: '💼' },
  ];
  const mockLists: List[] = [
    { id: 'list1', workspaceId: 'ws1', name: 'Groceries', emoji: '🛒' },
    { id: 'list2', workspaceId: 'ws1', name: 'Chores', emoji: '🧹' },
  ];
  const mockTodos: Todo[] = [
    { id: 'todo1', listId: 'list1', text: 'Buy milk', completed: false },
    { id: 'todo2', listId: 'list1', text: 'Buy eggs', completed: true },
  ];

  beforeEach(() => {
    addWorkspace = jest.fn();
    updateWorkspace = jest.fn();
    deleteWorkspace = jest.fn();
    selectWorkspace = jest.fn();
    addList = jest.fn();
    updateList = jest.fn();
    deleteList = jest.fn();
    selectList = jest.fn();
    addTodo = jest.fn();
    updateTodo = jest.fn();
    deleteTodo = jest.fn();
    toggleTodoCompletion = jest.fn();

    mockUseWorkspaceStore.mockReturnValue({
      workspaces: mockWorkspaces,
      lists: mockLists,
      todos: mockTodos,
      selectedWorkspaceId: null,
      selectedListId: null,
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
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders main structure and initial headings', () => {
    render(<WorkspaceApp />);

    expect(screen.getByText('Workspaces')).toBeInTheDocument();
    expect(screen.getByText('Select a Workspace')).toBeInTheDocument();
    expect(screen.getByText('Select a List')).toBeInTheDocument();
    expect(screen.getByTestId('mock-workspace-list')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-list-list')).not.toBeInTheDocument(); // Not rendered initially
    expect(screen.queryByTestId('mock-todo-list')).not.toBeInTheDocument(); // Not rendered initially
  });

  it('opens and closes Add Workspace modal', async () => {
    render(<WorkspaceApp />);

    fireEvent.click(screen.getByTestId('add-workspace-btn')); // From mock WorkspaceList

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Add Workspace' })).toBeInTheDocument(); // Modal title
      expect(screen.getByPlaceholderText('Workspace Name')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Add Workspace' })).not.toBeInTheDocument();
    });
  });

  it('adds a new workspace via modal', async () => {
    render(<WorkspaceApp />);
    fireEvent.click(screen.getByTestId('add-workspace-btn'));

    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText('Workspace Name'), { target: { value: 'New WS' } });
      fireEvent.change(screen.getByPlaceholderText('Emoji (e.g., 🏠)'), { target: { value: '🚀' } });
      fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    });

    await waitFor(() => {
      expect(addWorkspace).toHaveBeenCalledWith('New WS', '🚀');
      expect(screen.queryByText('New WS')).not.toBeInTheDocument(); // Modal should be closed
    });
  });

  it('opens and closes Edit Workspace modal and updates workspace', async () => {
    mockUseWorkspaceStore.mockReturnValueOnce({
      ...mockUseWorkspaceStore(),
      selectedWorkspaceId: 'ws1', // Select a workspace to make WorkspaceList render edit button
    });
    render(<WorkspaceApp />);

    fireEvent.click(screen.getByTestId('edit-ws-btn-ws1')); // From mock WorkspaceList

    await waitFor(() => {
      expect(screen.getByText('Edit Workspace')).toBeInTheDocument(); // Modal title
      expect(screen.getByPlaceholderText('Workspace Name')).toHaveValue('Home');
      expect(screen.getByPlaceholderText('Emoji (e.g., 🏠)')).toHaveValue('🏠');
    });

    fireEvent.change(screen.getByPlaceholderText('Workspace Name'), { target: { value: 'Updated Home' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    await waitFor(() => {
      expect(updateWorkspace).toHaveBeenCalledWith('ws1', 'Updated Home', '🏠');
      expect(screen.queryByText('Edit Workspace')).not.toBeInTheDocument();
    });
  });

  it('opens and closes Add List modal', async () => {
    mockUseWorkspaceStore.mockReturnValueOnce({
      ...mockUseWorkspaceStore(),
      selectedWorkspaceId: 'ws1', // Select a workspace to enable ListList
    });
    render(<WorkspaceApp />);

    await waitFor(() => {
        expect(screen.getByTestId('mock-list-list')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('add-list-btn')); // From mock ListList

    await waitFor(() => {
      expect(screen.getByText('Add List')).toBeInTheDocument(); // Modal title
      expect(screen.getByPlaceholderText('List Name')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => {
      expect(screen.queryByText('Add List')).not.toBeInTheDocument();
    });
  });

  it.skip('adds a new list via modal', async () => {
    mockUseWorkspaceStore.mockReturnValueOnce({
      ...mockUseWorkspaceStore(),
      selectedWorkspaceId: 'ws1',
    });
    render(<WorkspaceApp />);
    await waitFor(() => expect(screen.getByTestId('add-list-btn')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('add-list-btn'));

    const user = userEvent.setup(); // Initialize userEvent
    await waitFor(() => screen.getByPlaceholderText('List Name')); // Wait for input to be present
    const listNameInput = screen.getByPlaceholderText('List Name');
    const emojiInput = screen.getByPlaceholderText('Emoji (e.g., 📝)');
    const addButton = screen.getByRole('button', { name: 'Add' });

    await user.type(listNameInput, 'New List');
    await user.type(emojiInput, '🌟');
    await user.click(addButton);


    await waitFor(() => {
      expect(addList).toHaveBeenCalledWith('ws1', 'New List', '🌟');
      expect(screen.queryByText('Add List')).not.toBeInTheDocument();
    });
  });

  it('opens and closes Add Todo modal', async () => {
    mockUseWorkspaceStore.mockReturnValueOnce({
      ...mockUseWorkspaceStore(),
      selectedWorkspaceId: 'ws1',
      selectedListId: 'list1', // Select a list to enable TodoList
    });
    render(<WorkspaceApp />);

    await waitFor(() => {
        expect(screen.getByTestId('mock-todo-list')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('add-todo-btn')); // From mock TodoList

    await waitFor(() => {
      expect(screen.getByText('Add Todo')).toBeInTheDocument(); // Modal title
      expect(screen.getByPlaceholderText('Todo Text')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => {
      expect(screen.queryByText('Add Todo')).not.toBeInTheDocument();
    });
  });

  it.skip('adds a new todo via modal', async () => {
    mockUseWorkspaceStore.mockReturnValueOnce({
      ...mockUseWorkspaceStore(),
      selectedWorkspaceId: 'ws1',
      selectedListId: 'list1',
    });
    render(<WorkspaceApp />);
    await waitFor(() => expect(screen.getByTestId('add-todo-btn')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('add-todo-btn'));

    const user = userEvent.setup(); // Initialize userEvent
    await waitFor(() => screen.getByPlaceholderText('Todo Text')); // Wait for input to be present
    const todoTextInput = screen.getByPlaceholderText('Todo Text');
    const addButton = screen.getByRole('button', { name: 'Add' });

    await user.type(todoTextInput, 'New Todo');
    await user.click(addButton);

    await waitFor(() => {
      expect(addTodo).toHaveBeenCalledWith('list1', 'New Todo');
      expect(screen.queryByText('Add Todo')).not.toBeInTheDocument();
    });
  });

  it.skip('updates an existing todo via modal', async () => {
    mockUseWorkspaceStore.mockReturnValueOnce({
      ...mockUseWorkspaceStore(),
      selectedWorkspaceId: 'ws1',
      selectedListId: 'list1',
    });
    render(<WorkspaceApp />);

    await waitFor(() => {
      expect(screen.getByTestId('mock-todo-list')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('edit-todo-btn-todo1')); // Edit "Buy milk"

    await waitFor(() => {
      expect(screen.getByText('Edit Todo')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Todo Text')).toHaveValue('Buy milk');
      expect(screen.getByLabelText('Completed')).not.toBeChecked();
    });

    const user = userEvent.setup(); // Initialize userEvent
    await waitFor(() => screen.getByPlaceholderText('Todo Text')); // Wait for input to be present
    const todoTextInput = screen.getByPlaceholderText('Todo Text');
    const completedCheckbox = screen.getByLabelText('Completed');
    const updateButton = screen.getByRole('button', { name: 'Update' });

    await user.clear(todoTextInput); // Clear before typing new value
    await user.type(todoTextInput, 'Updated milk');
    await user.click(completedCheckbox); // Toggle completed
    await user.click(updateButton);

    await waitFor(() => {
      expect(updateTodo).toHaveBeenCalledWith('todo1', 'Updated milk', true);
      expect(screen.queryByText('Edit Todo')).not.toBeInTheDocument();
    });
  });
});
