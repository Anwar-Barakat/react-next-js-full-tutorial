import { render, screen, fireEvent } from '@testing-library/react';
import NotesApp from '../components/NotesApp';
import { useNoteStore } from '../store'; // Import original store to mock

// Mock the Zustand store
jest.mock('../store', () => ({
  useNoteStore: jest.fn(),
}));

const mockUseNoteStore = useNoteStore as jest.Mock;

// Mock the Sidebar component
jest.mock('../Sidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-sidebar">Mock Sidebar</div>,
}));

describe('NotesApp', () => {
  let addOrUpdateNote: jest.Mock;
  let setEditorContent: jest.Mock;
  let setNoteColor: jest.Mock;

  beforeEach(() => {
    addOrUpdateNote = jest.fn();
    setEditorContent = jest.fn();
    setNoteColor = jest.fn();

    mockUseNoteStore.mockReturnValue({
      notes: [],
      currentNoteIndex: null,
      editorContent: '',
      noteColor: '#ffffff',
      addOrUpdateNote,
      setEditorContent,
      setNoteColor,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial state (Save Note mode)', () => {
    render(<NotesApp />);

    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Write your note...')).toBeInTheDocument();
    expect(screen.getByDisplayValue('#ffffff')).toBeInTheDocument(); // Color input
    expect(screen.getByRole('button', { name: 'Save Note' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Update Note' })).not.toBeInTheDocument();
  });

  it('renders correctly in Update Note mode when currentNoteIndex is set', () => {
    mockUseNoteStore.mockReturnValueOnce({
      ...mockUseNoteStore(), // Retain other mocked values
      currentNoteIndex: 0,
      editorContent: 'Existing note content',
      noteColor: '#ff0000',
    });
    render(<NotesApp />);

    expect(screen.getByPlaceholderText('Write your note...')).toHaveValue('Existing note content');
    expect(screen.getByDisplayValue('#ff0000')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Update Note' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save Note' })).not.toBeInTheDocument();
  });

  it('updates editor content on textarea change', () => {
    render(<NotesApp />);
    const textarea = screen.getByPlaceholderText('Write your note...');
    fireEvent.change(textarea, { target: { value: 'New note content' } });
    expect(setEditorContent).toHaveBeenCalledWith('New note content');
  });

  it('updates note color on color input change', () => {
    render(<NotesApp />);
    const colorInput = screen.getByDisplayValue('#ffffff');
    fireEvent.change(colorInput, { target: { value: '#ff00ff' } });
    expect(setNoteColor).toHaveBeenCalledWith('#ff00ff');
  });

  it('calls addOrUpdateNote when Save Note button is clicked', () => {
    render(<NotesApp />);
    fireEvent.click(screen.getByRole('button', { name: 'Save Note' }));
    expect(addOrUpdateNote).toHaveBeenCalled();
  });

  it('calls addOrUpdateNote when Update Note button is clicked', () => {
    mockUseNoteStore.mockReturnValueOnce({
      ...mockUseNoteStore(),
      currentNoteIndex: 0,
      editorContent: 'Existing note content',
    });
    render(<NotesApp />);
    fireEvent.click(screen.getByRole('button', { name: 'Update Note' }));
    expect(addOrUpdateNote).toHaveBeenCalled();
  });
});
