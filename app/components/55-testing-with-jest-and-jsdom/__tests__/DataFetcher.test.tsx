import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataFetcher } from '../components/DataFetcher';

describe('DataFetcher', () => {
  test('displays loading message initially', () => {
    render(<DataFetcher shouldFetchSuccessfully={true} />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  test('displays fetched data on successful fetch', async () => {
    render(<DataFetcher shouldFetchSuccessfully={true} />);
    await waitFor(() => {
      expect(screen.getByText('Data: Fetched data successfully!')).toBeInTheDocument();
    });
    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
  });

  test('displays error message on failed fetch', async () => {
    render(<DataFetcher shouldFetchSuccessfully={false} />);
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch data.')).toBeInTheDocument();
    });
    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
  });
});
