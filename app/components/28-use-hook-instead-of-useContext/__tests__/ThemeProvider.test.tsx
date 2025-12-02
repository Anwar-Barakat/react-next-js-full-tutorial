import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '../ThemeProvider';
import { ThemeContext } from '../ThemeContext';

// A test component to consume the context for ThemeProvider.test.tsx
const TestConsumer = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('TestConsumer must be used within a ThemeProvider');
  }
  const { theme, toggleTheme } = context;
  return (
    <div>
      <span data-testid="theme-display">{theme}</span>
      <button onClick={toggleTheme} data-testid="toggle-button">Toggle</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  it('provides an initial theme of "light"', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme-display')).toHaveTextContent('light');
  });

  it('toggles the theme when toggleTheme is called', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    const toggleButton = screen.getByTestId('toggle-button');
    const themeDisplay = screen.getByTestId('theme-display');

    fireEvent.click(toggleButton);
    expect(themeDisplay).toHaveTextContent('dark');

    fireEvent.click(toggleButton);
    expect(themeDisplay).toHaveTextContent('light');
  });
});
