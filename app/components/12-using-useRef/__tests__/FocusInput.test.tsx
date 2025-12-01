import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FocusInput from '../components/FocusInput';

describe('FocusInput Component', () => {
  it('focuses the input when the button is clicked', () => {
    render(<FocusInput />);
    const inputElement = screen.getByPlaceholderText('Click button to focus');
    const focusButton = screen.getByRole('button', { name: /focus the input/i });

    // Initially, the input should not be focused
    expect(inputElement).not.toHaveFocus();

    // Click the button
    fireEvent.click(focusButton);

    // Now, the input should be focused
    expect(inputElement).toHaveFocus();
  });
});
