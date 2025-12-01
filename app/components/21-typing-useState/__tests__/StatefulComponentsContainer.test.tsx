import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatefulComponentsContainer } from '../components/StatefulComponentsContainer';
import { BasicState } from '../components/BasicState';
import { UserProfile } from '../components/UserProfile';
import { TodoList } from '../components/TodoList';

// Mock child components to isolate Container's rendering
jest.mock('../components/BasicState', () => ({
  __esModule: true,
  BasicState: () => <div data-testid="mock-basic-state">Mock BasicState</div>,
}));

jest.mock('../components/UserProfile', () => ({
  __esModule: true,
  UserProfile: () => <div data-testid="mock-user-profile">Mock UserProfile</div>,
}));

jest.mock('../components/TodoList', () => ({
  __esModule: true,
  TodoList: () => <div data-testid="mock-todo-list">Mock TodoList</div>,
}));

describe('StatefulComponentsContainer Component', () => {
  it('renders BasicState, UserProfile, and TodoList components', () => {
    render(<StatefulComponentsContainer />);

    expect(screen.getByTestId('mock-basic-state')).toBeInTheDocument();
    expect(screen.getByTestId('mock-user-profile')).toBeInTheDocument();
    expect(screen.getByTestId('mock-todo-list')).toBeInTheDocument();
  });
});
