import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';

import Counter from '../Counter';

import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../counterSlice';

// Helper function to create a fresh store for each test
const setupStore = () => configureStore({
  reducer: {
    counter: counterReducer,
  },
});

describe('Counter', () => {
  let testStore: ReturnType<typeof setupStore>;

  beforeEach(() => {
    testStore = setupStore();
  });

  it('renders with initial count of 0', () => {
    render(
      <Provider store={testStore}>
        <Counter />
      </Provider>
    );
    expect(screen.getByText((content, element) => {
      const normalizedContent = (element.textContent || '').replace(/\s+/g, ' ').trim();
      return normalizedContent === 'Count: 0';
    })).toBeInTheDocument();
  });

  it('increments count when "Increment" button is clicked', () => {
    render(
      <Provider store={testStore}>
        <Counter />
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Increment' }));
    expect(screen.getByText((content, element) => {
      const normalizedContent = (element.textContent || '').replace(/\s+/g, ' ').trim();
      return normalizedContent === 'Count: 1';
    })).toBeInTheDocument();
  });

  it('decrements count when "Decrement" button is clicked', () => {
    render(
      <Provider store={testStore}>
        <Counter />
      </Provider>
    );
    // Increment first to ensure we can decrement from a positive number
    fireEvent.click(screen.getByRole('button', { name: 'Increment' }));
    fireEvent.click(screen.getByRole('button', { name: 'Decrement' }));
    expect(screen.getByText((content, element) => {
      const normalizedContent = (element.textContent || '').replace(/\s+/g, ' ').trim();
      return normalizedContent === 'Count: 0';
    })).toBeInTheDocument();
  });

  it('increments by 5 when "Increment by 5" button is clicked', () => {
    render(
      <Provider store={testStore}>
        <Counter />
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Increment by 5' }));
    expect(screen.getByText((content, element) => {
      const normalizedContent = (element.textContent || '').replace(/\s+/g, ' ').trim();
      return normalizedContent === 'Count: 5';
    })).toBeInTheDocument();
  });
});
