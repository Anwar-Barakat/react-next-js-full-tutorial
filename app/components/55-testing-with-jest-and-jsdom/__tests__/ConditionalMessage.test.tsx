import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConditionalMessage } from '../components/ConditionalMessage';

describe('ConditionalMessage', () => {
  test('renders the message when isVisible is true', () => {
    render(<ConditionalMessage message="This is a visible message" isVisible={true} />);
    expect(screen.getByText('This is a visible message')).toBeInTheDocument();
  });

  test('does not render the message when isVisible is false', () => {
    render(<ConditionalMessage message="This is a hidden message" isVisible={false} />);
    expect(screen.queryByText('This is a hidden message')).not.toBeInTheDocument();
  });

  test('renders nothing when isVisible is false and no message is present', () => {
    render(<ConditionalMessage message="Hidden" isVisible={false} />);
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });
});
