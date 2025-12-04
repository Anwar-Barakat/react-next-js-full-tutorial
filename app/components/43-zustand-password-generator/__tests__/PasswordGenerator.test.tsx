import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PasswordGenerator from '../components/PasswordGenerator';
import { usePasswordStore } from '../store'; // Import original store to mock

// Mock the Zustand store
jest.mock('../store', () => ({
  usePasswordStore: jest.fn(),
}));

const mockUsePasswordStore = usePasswordStore as jest.Mock;

describe('PasswordGenerator', () => {
  let setLength: jest.Mock;
  let toggleNumbers: jest.Mock;
  let toggleSymbols: jest.Mock;
  let toggleUppercase: jest.Mock;
  let toggleLowercase: jest.Mock;
  let generatePassword: jest.Mock;
  let writeText: jest.Mock;

  beforeEach(() => {
    setLength = jest.fn();
    toggleNumbers = jest.fn();
    toggleSymbols = jest.fn();
    toggleUppercase = jest.fn();
    toggleLowercase = jest.fn();
    generatePassword = jest.fn();
    writeText = jest.fn();

    // Mock navigator.clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: writeText,
      },
      writable: true,
    });

    mockUsePasswordStore.mockReturnValue({
      length: 12,
      includeNumbers: true,
      includeSymbols: false,
      includeUppercase: true,
      includeLowercase: true,
      generatedPassword: 'MockPassword1!',
      setLength,
      toggleNumbers,
      toggleSymbols,
      toggleUppercase,
      toggleLowercase,
      generatePassword,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial state', () => {
    render(<PasswordGenerator />);

    expect(screen.getByText('Password Generator')).toBeInTheDocument();
    expect(screen.getByText('MockPassword1!')).toBeInTheDocument();
    expect(screen.getByText('Password length: 12')).toBeInTheDocument();
    expect(screen.getByLabelText('Include numbers')).toBeChecked();
    expect(screen.getByLabelText('Include symbols')).not.toBeChecked();
    expect(screen.getByLabelText('Include uppercase')).toBeChecked();
    expect(screen.getByLabelText('Include lowercase')).toBeChecked();
    expect(screen.getByRole('button', { name: 'Generate Password' })).toBeInTheDocument();
  });

  it('updates password length', () => {
    render(<PasswordGenerator />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '15' } });
    expect(setLength).toHaveBeenCalledWith(15);
  });

  it('toggles "Include numbers" checkbox', () => {
    render(<PasswordGenerator />);
    fireEvent.click(screen.getByLabelText('Include numbers'));
    expect(toggleNumbers).toHaveBeenCalled();
  });

  it('toggles "Include symbols" checkbox', () => {
    render(<PasswordGenerator />);
    fireEvent.click(screen.getByLabelText('Include symbols'));
    expect(toggleSymbols).toHaveBeenCalled();
  });

  it('toggles "Include uppercase" checkbox', () => {
    render(<PasswordGenerator />);
    fireEvent.click(screen.getByLabelText('Include uppercase'));
    expect(toggleUppercase).toHaveBeenCalled();
  });

  it('toggles "Include lowercase" checkbox', () => {
    render(<PasswordGenerator />);
    fireEvent.click(screen.getByLabelText('Include lowercase'));
    expect(toggleLowercase).toHaveBeenCalled();
  });

  it('generates password on button click', () => {
    render(<PasswordGenerator />);
    fireEvent.click(screen.getByRole('button', { name: 'Generate Password' }));
    expect(generatePassword).toHaveBeenCalled();
  });

  it('copies generated password to clipboard', async () => {
    render(<PasswordGenerator />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('MockPassword1!');
    });
  });


});
