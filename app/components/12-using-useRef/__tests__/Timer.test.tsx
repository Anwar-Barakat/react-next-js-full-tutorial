import { render, fireEvent, act, within } from '@testing-library/react';
import Timer from '../components/Timer';

describe('Timer', () => {
  beforeEach(() => {
    jest.useFakeTimers(); // Enable fake timers
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // Run any pending timers
    jest.useRealTimers(); // Disable fake timers
  });

  it('renders initial count and increments every second', () => {
    const { container } = render(<Timer />);

    expect(within(container).getByText('Count: 0')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000); // Advance timers by 1 second
    });
    expect(within(container).getByText('Count: 1')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000); // Advance timers by 2 more seconds
    });
    expect(within(container).getByText('Count: 3')).toBeInTheDocument();
  });

  it('stops the timer when "Stop Timer" button is clicked', () => {
    const { container } = render(<Timer />);

    expect(within(container).getByText('Count: 0')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(within(container).getByText('Count: 1')).toBeInTheDocument();

    const stopButton = within(container).getByRole('button', { name: /stop timer/i });
    fireEvent.click(stopButton);

    act(() => {
      jest.advanceTimersByTime(5000); // Advance by 5 seconds, but timer should be stopped
    });
    expect(within(container).getByText('Count: 1')).toBeInTheDocument(); // Count should remain 1
  });
});
