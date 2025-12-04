import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExpenseTracker from '../components/ExpenseTracker';
import useExpense from '../store'; // Import original store to mock

// Mock the Zustand store
jest.mock('../store', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockUseExpense = useExpense as jest.Mock;

describe('ExpenseTracker', () => {
  const mockExpenses = [
    { id: 1, title: 'Groceries', amount: 50.00 },
    { id: 2, title: 'Dinner', amount: 30.50 },
  ];

  let addExpense: jest.Mock;
  let deleteExpense: jest.Mock;
  let updateExpense: jest.Mock;

  beforeEach(() => {
    addExpense = jest.fn();
    deleteExpense = jest.fn();
    updateExpense = jest.fn();

    mockUseExpense.mockReturnValue({
      expenses: mockExpenses,
      addExpense,
      deleteExpense,
      updateExpense,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial expenses and total', () => {
    mockUseExpense.mockReturnValue({ // Override for initial empty state
        expenses: [],
        addExpense,
        deleteExpense,
        updateExpense,
    });
    render(<ExpenseTracker />);

    expect(screen.getByText('Expense Tracker')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Expense Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Expense' })).toBeInTheDocument();
    expect(screen.getByText('Expenses')).toBeInTheDocument();
    expect(screen.getByText('No expenses added yet.')).toBeInTheDocument();
    expect(screen.getByText('Total:')).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument(); // Initial total for empty list
  });



  it('adds a new expense', async () => {
    render(<ExpenseTracker />);

    fireEvent.change(screen.getByPlaceholderText('Expense Title'), { target: { value: 'Rent' } });
    fireEvent.change(screen.getByPlaceholderText('Amount'), { target: { value: '1200' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Expense' }));

    await waitFor(() => {
        expect(addExpense).toHaveBeenCalled();
    });

    // Ensure form is cleared
    expect(screen.getByPlaceholderText('Expense Title')).toHaveValue('');
    expect(screen.getByPlaceholderText('Amount')).toHaveValue(null);
  });

  it('displays error for empty title', async () => {
    render(<ExpenseTracker />);

    fireEvent.change(screen.getByPlaceholderText('Amount'), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Expense' }));

    await waitFor(() => {
      expect(screen.getByText('Title cannot be empty.')).toBeInTheDocument();
    });
    expect(addExpense).not.toHaveBeenCalled();
  });

  it('displays error for invalid amount', async () => {
    render(<ExpenseTracker />);

    fireEvent.change(screen.getByPlaceholderText('Expense Title'), { target: { value: 'Invalid Expense' } });
    fireEvent.change(screen.getByPlaceholderText('Amount'), { target: { value: '-10' } }); // Invalid amount
    fireEvent.click(screen.getByRole('button', { name: 'Add Expense' }));

    await waitFor(() => {
      expect(screen.getByText('Amount must be a positive number.')).toBeInTheDocument();
    });
    expect(addExpense).not.toHaveBeenCalled();
  });



  it('deletes an expense', async () => {
    render(<ExpenseTracker />);

    // Click delete on Groceries
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);

    await waitFor(() => {
        expect(deleteExpense).toHaveBeenCalledWith(1);
    });
  });
});