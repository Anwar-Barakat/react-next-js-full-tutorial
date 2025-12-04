import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormBuilder from '../components/FormBuilder';
import { useFormStore, FormField } from '../store'; // Import original store to mock

// Mock the Zustand store
jest.mock('../store', () => ({
  useFormStore: jest.fn(),
  // Also mock FormField type if needed, but not directly used in mock implementation
}));

const mockUseFormStore = useFormStore as jest.Mock;

describe('FormBuilder', () => {
  let addField: jest.Mock;
  let removeField: jest.Mock;
  let resetForm: jest.Mock;
  let updateField: jest.Mock;

  beforeEach(() => {
    addField = jest.fn();
    removeField = jest.fn();
    resetForm = jest.fn();
    updateField = jest.fn();

    mockUseFormStore.mockReturnValue({
      formFields: [], // Initial empty state
      addField,
      removeField,
      resetForm,
      updateField,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial empty state', () => {
    render(<FormBuilder />);

    expect(screen.getByText('Form Builder')).toBeInTheDocument();
    expect(screen.getByText('Add New Field')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Field label')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument(); // Select for field type
    expect(screen.getByPlaceholderText('Field value (optional)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Field' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset Form' })).toBeInTheDocument();

    expect(screen.getByText('Generated Form')).toBeInTheDocument();
    expect(screen.getByText('No fields added yet.')).toBeInTheDocument();
  });

  it('adds a new field', () => {
    render(<FormBuilder />);

    const labelInput = screen.getByPlaceholderText('Field label');
    const typeSelect = screen.getByRole('combobox');
    const valueInput = screen.getByPlaceholderText('Field value (optional)');
    const addButton = screen.getByRole('button', { name: 'Add Field' });

    fireEvent.change(labelInput, { target: { value: 'Username' } });
    fireEvent.change(typeSelect, { target: { value: 'password' } });
    fireEvent.change(valueInput, { target: { value: 'initial' } });
    fireEvent.click(addButton);

    expect(addField).toHaveBeenCalledWith({
      label: 'Username',
      type: 'password',
      value: 'initial',
    });
    // Ensure inputs are cleared
    expect(labelInput).toHaveValue('');
    expect(typeSelect).toHaveValue('string'); // Resets to default
    expect(valueInput).toHaveValue('');
  });

  it('does not add a field with an empty label', () => {
    render(<FormBuilder />);
    const addButton = screen.getByRole('button', { name: 'Add Field' });

    fireEvent.click(addButton); // Click without filling label
    expect(addField).not.toHaveBeenCalled();
  });



  it('updates a field value', () => {
    const mockFields: FormField[] = [{ label: 'Name', type: 'string', value: 'John' }];
    mockUseFormStore.mockReturnValueOnce({
      formFields: mockFields,
      addField, removeField, resetForm, updateField,
    });
    render(<FormBuilder />);

    const nameInput = screen.getByDisplayValue('John') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Jane' } });

    expect(updateField).toHaveBeenCalledWith(0, { label: 'Name', type: 'string', value: 'Jane' });
  });

  it('resets the form', () => {
    const mockFields: FormField[] = [{ label: 'Name', type: 'string', value: 'John' }];
    mockUseFormStore.mockReturnValueOnce({
      formFields: mockFields,
      addField, removeField, resetForm, updateField,
    });
    render(<FormBuilder />);

    fireEvent.click(screen.getByRole('button', { name: 'Reset Form' }));
    expect(resetForm).toHaveBeenCalled();
  });
});
