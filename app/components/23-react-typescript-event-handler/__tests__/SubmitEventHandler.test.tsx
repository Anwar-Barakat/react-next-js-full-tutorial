import { render, screen, fireEvent } from '@testing-library/react';
import { SubmitEventHandler } from '../components/SubmitEventHandler';

describe('SubmitEventHandler', () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('renders a form with input and submit button', () => {
    render(<SubmitEventHandler />);
    expect(screen.getByRole('textbox')).toBeInTheDocument(); // input field
    expect(screen.getByRole('button', { name: /submit form/i })).toBeInTheDocument();
  });

  it('updates input value on change', () => {
    render(<SubmitEventHandler />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New Value' } });
    expect(input.value).toBe('New Value');
  });

  it('triggers alert with current input value on form submission', () => {
    render(<SubmitEventHandler />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /submit form/i });

    fireEvent.change(input, { target: { value: 'My Form Data' } });
    fireEvent.click(submitButton);

    expect(alertSpy).toHaveBeenCalledWith('Form submitted with value: My Form Data');
  });
});
