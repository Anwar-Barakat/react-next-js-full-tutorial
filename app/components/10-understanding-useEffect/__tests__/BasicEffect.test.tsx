import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BasicEffect from '../components/BasicEffect';

describe('BasicEffect Component', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders the component and logs "Component mounted" on mount', () => {
    render(<BasicEffect />);
    expect(screen.getByText('Basic Effect Component (Check console for mount message)')).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith('Component mounted');
  });
});
