import { render, screen, fireEvent, cleanup } from '@testing-library/react'; // Import cleanup
import { ButtonDemo } from '../components/ButtonDemo';

describe('ButtonDemo', () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
    cleanup(); // Explicitly call cleanup after each test
  });

  it('renders a heading and two buttons', () => {
    render(<ButtonDemo />);
    expect(screen.getByRole('heading', { name: /button usage example/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /primary button/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /secondary button/i })).toBeInTheDocument();
  });

  it('triggers alert when primary button is clicked', () => {
    render(<ButtonDemo />);
    const primaryButton = screen.getByRole('button', { name: /primary button/i });
    fireEvent.click(primaryButton);
    expect(alertSpy).toHaveBeenCalledWith('Primary button clicked!');
  });

  it('triggers alert when secondary button is clicked', () => {
    render(<ButtonDemo />);
    const secondaryButton = screen.getByRole('button', { name: /secondary button/i });
    fireEvent.click(secondaryButton);
    expect(alertSpy).toHaveBeenCalledWith('Secondary button clicked!');
  });
});
