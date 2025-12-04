import { render, screen } from '@testing-library/react';
import KanbanDemo from '../components/KanbanDemo';

// Mock react-redux Provider
jest.mock('react-redux', () => ({
  __esModule: true,
  Provider: ({ children }: any) => <div data-testid="mock-redux-provider">{children}</div>,
}));

// Mock KanbanBoard component
jest.mock('../components/KanbanBoard', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-kanban-board">Mock KanbanBoard</div>,
}));


describe('KanbanDemo', () => {
  it('renders the KanbanBoard component within the Redux Provider', () => {
    render(<KanbanDemo />);

    expect(screen.getByTestId('mock-redux-provider')).toBeInTheDocument();
    expect(screen.getByTestId('mock-kanban-board')).toBeInTheDocument();
  });
});
