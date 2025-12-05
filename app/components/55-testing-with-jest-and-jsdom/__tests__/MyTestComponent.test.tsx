import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MyTestComponent } from '../components/MyTestComponent';

describe('MyTestComponent', () => {
  test('renders the correct message', () => {
    render(<MyTestComponent message="Hello, Test!" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello, Test!');
  });

  test('renders a different message correctly', () => {
    render(<MyTestComponent message="Another Message" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Another Message');
  });

  test('button is present and clickable', () => {
    const handleClick = jest.fn();
    render(<MyTestComponent message="Test Button" onClick={handleClick} />);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
