import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../components/App';

// Mock all direct child components
jest.mock('../components/Navigation', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-navigation">Mock Navigation</div>,
}));
jest.mock('../components/PeopleToFollow', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-people-to-follow">Mock PeopleToFollow</div>,
}));
jest.mock('../components/TrendList', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-trend-list">Mock TrendList</div>,
}));
jest.mock('../components/TopicsList', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-topics-list">Mock TopicsList</div>,
}));
jest.mock('../components/ArticleList', () => ({
  __esModule: true,
  default: ({ onEdit }: { onEdit: (blog: any) => void }) => (
    <div data-testid="mock-article-list">
      Mock ArticleList
      <button onClick={() => onEdit({ id: '1', title: 'Edit Me' })} data-testid="edit-article-btn">Edit Article</button>
    </div>
  ),
}));
jest.mock('../components/Modal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, title, children }: any) =>
    isOpen ? (
      <div data-testid="mock-modal">
        <h2>{title}</h2>
        <button onClick={onClose}>Close Modal</button>
        {children}
      </div>
    ) : null,
}));
jest.mock('../components/BlogForm', () => ({
  __esModule: true,
  default: ({ existingBlog, onClose }: any) => (
    <div data-testid="mock-blog-form">
      Mock BlogForm {existingBlog ? `(Editing: ${existingBlog.title})` : '(New)'}
      <button onClick={onClose}>Close Form</button>
    </div>
  ),
}));

// Mock BlogContext to avoid issues with context provider in tests
// For a simple rendering test, mocking the provider is sufficient
jest.mock('../components/BlogContext', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="mock-blog-provider">{children}</div>,
  useBlog: () => ({
    blogs: [],
    addBlog: jest.fn(),
    updateBlog: jest.fn(),
    deleteBlog: jest.fn(),
  }),
}));


describe('App (Blog Platform)', () => {
  it('renders correctly with all child components initially', async () => {
    render(<App />);

    // Initial render assertions
    expect(screen.getByText('Blog Posts')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add new blog/i })).toBeInTheDocument();
    expect(screen.getByTestId('mock-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('mock-people-to-follow')).toBeInTheDocument();
    expect(screen.getByTestId('mock-trend-list')).toBeInTheDocument();
    expect(screen.getByTestId('mock-topics-list')).toBeInTheDocument();
    expect(screen.getByTestId('mock-article-list')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument(); // Modal should be closed initially
  });

  it('opens and closes Add New Blog modal', async () => {
    render(<App />);

    // Open modal for new blog
    fireEvent.click(screen.getByRole('button', { name: /add new blog/i }));
    await waitFor(() => {
      expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
      expect(screen.getByText('Add New Blog')).toBeInTheDocument(); // Modal title
      expect(screen.getByText('Mock BlogForm (New)')).toBeInTheDocument();
    });

    // Close modal
    fireEvent.click(screen.getByRole('button', { name: /close modal/i }));
    await waitFor(() => {
      expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
    });
  });

  it('opens and closes Edit Blog modal', async () => {
    render(<App />);

    // Open modal for editing existing blog
    fireEvent.click(screen.getByTestId('edit-article-btn')); // From mock ArticleList
    await waitFor(() => {
      expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
      expect(screen.getByText('Edit Blog')).toBeInTheDocument(); // Modal title
      expect(screen.getByText('Mock BlogForm (Editing: Edit Me)')).toBeInTheDocument();
    });

    // Close modal from BlogForm
    fireEvent.click(screen.getByRole('button', { name: /close form/i }));
    await waitFor(() => {
      expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
    });
  });
});
