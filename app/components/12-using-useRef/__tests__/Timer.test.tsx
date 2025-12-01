import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Timer from '../components/Timer';

describe('Timer Component', () => {
  beforeEach(() => {
    jest.useFakeTimers(); // Enable fake timers
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // Run any pending timers
    jest.useRealTimers(); // Disable fake timers
  });

  it('renders initial count of 0', () => {
    render(<Timer />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  it('increments count every second', () => {
    render(<Timer />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000); // Advance timers by 1 second
    });
    expect(screen.getByText('Count: 1')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000); // Advance timers by 2 more seconds
    });
    expect(screen.getByText('Count: 3')).toBeInTheDocument();
  });

  it('stops the timer when "Stop Timer" button is clicked', () => {
    render(<Timer />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('Count: 1')).toBeInTheDocument();

    const stopButton = screen.getByRole('button', { name: /stop timer/i });
    fireEvent.click(stopButton);

    act(() => {
      jest.advanceTimersByTime(5000); // Advance by 5 seconds, but timer should be stopped
    });
    expect(screen.getByText('Count: 1')).toBeInTheDocument(); // Count should remain 1
  });
});
