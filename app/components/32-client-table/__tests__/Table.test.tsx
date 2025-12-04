import { render, screen, fireEvent } from '@testing-library/react';
import Table from '../components/Table';
import { data } from '../data'; // Import original data to base mocks on

// Mock the data.ts module
jest.mock('../data', () => ({
  data: [
    {
      client: "Mock Client A",
      country: "USA",
      email: "a@example.com",
      project: "Project X",
      progress: "50%",
      status: "In Progress",
      date: "01/01/2023",
      image: "image-a.jpg",
    },
    {
      client: "Mock Client B",
      country: "UK",
      email: "b@example.com",
      project: "Project Y",
      progress: "100%",
      status: "Completed",
      date: "02/02/2023",
      image: "image-b.jpg",
    },
    {
      client: "Another Client",
      country: "Canada",
      email: "c@example.com",
      project: "Project Z",
      progress: "25%",
      status: "In Progress",
      date: "03/03/2023",
      image: "image-c.jpg",
    },
  ],
}));

describe('Table', () => {
  it('renders the Clients title and filter elements', () => {
    render(<Table />);
    expect(screen.getByRole('heading', { name: /clients/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Filter by client name...')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument(); // Select element
  });

  it('displays initial data correctly', () => {
    render(<Table />);
    expect(screen.getByText('Mock Client A')).toBeInTheDocument();
    expect(screen.getByText('Project Y')).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Completed' })).toBeInTheDocument();
    expect(screen.getByAltText('Mock Client B')).toBeInTheDocument();
  });

  it('filters by client name correctly', () => {
    render(<Table />);
    const nameInput = screen.getByPlaceholderText('Filter by client name...');
    fireEvent.change(nameInput, { target: { value: 'Mock Client A' } });

    expect(screen.getByText('Mock Client A')).toBeInTheDocument();
    expect(screen.queryByText('Mock Client B')).not.toBeInTheDocument();
  });

  it('filters by status correctly', () => {
    render(<Table />);
    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'Completed' } });

    expect(screen.getByText('Mock Client B')).toBeInTheDocument();
    expect(screen.queryByText('Mock Client A')).not.toBeInTheDocument();
    expect(screen.queryByText('Another Client')).not.toBeInTheDocument();
  });

  it('filters by both client name and status', () => {
    render(<Table />);
    const nameInput = screen.getByPlaceholderText('Filter by client name...');
    const statusSelect = screen.getByRole('combobox');

    fireEvent.change(nameInput, { target: { value: 'Client' } });
    fireEvent.change(statusSelect, { target: { value: 'In Progress' } });

    expect(screen.getByText('Mock Client A')).toBeInTheDocument();
    expect(screen.getByText('Another Client')).toBeInTheDocument();
    expect(screen.queryByText('Mock Client B')).not.toBeInTheDocument();
  });

  it('displays "No results found." when filters yield no matches', () => {
    render(<Table />);
    const nameInput = screen.getByPlaceholderText('Filter by client name...');
    fireEvent.change(nameInput, { target: { value: 'NonExistentClient' } });

    expect(screen.getByText('No results found.')).toBeInTheDocument();
    expect(screen.queryByText('Mock Client A')).not.toBeInTheDocument();
  });

  it('renders client images with correct alt text', () => {
    render(<Table />);
    expect(screen.getByAltText('Mock Client A')).toHaveAttribute('src', 'image-a.jpg');
    expect(screen.getByAltText('Mock Client B')).toHaveAttribute('src', 'image-b.jpg');
  });
});
