import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '../ThemeProvider';
import { NewThemeDisplay } from '../NewThemeDisplay';
import { ThemeContext } from '../ThemeContext'; // Import ThemeContext for mocking

describe('NewThemeDisplay', () => {
  it('renders theme and toggles it when wrapped in ThemeProvider', () => {
    render(
      <ThemeProvider>
        <NewThemeDisplay />
      </ThemeProvider>
    );

    const themeDisplay = screen.getByText(/Current Theme:/i);
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });

    expect(themeDisplay).toHaveTextContent('light');

    fireEvent.click(toggleButton);
    expect(themeDisplay).toHaveTextContent('dark');

    fireEvent.click(toggleButton);
    expect(themeDisplay).toHaveTextContent('light');
  });

  it('throws an error if not wrapped in ThemeProvider', () => {
    // Suppress console.error output for this test
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // For the new `use` hook, the error is thrown directly during render if context is null
    expect(() => render(<NewThemeDisplay />)).toThrow('NewThemeDisplay must be used within a ThemeProvider');
    
    consoleErrorSpy.mockRestore(); // Restore console.error
  });
});
