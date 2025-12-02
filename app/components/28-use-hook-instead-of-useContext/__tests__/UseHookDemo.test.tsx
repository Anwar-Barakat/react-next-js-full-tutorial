import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UseHookDemo } from '../components/UseHookDemo';
import { ThemeProvider } from '../ThemeProvider';
import { LegacyThemeDisplay } from '../LegacyThemeDisplay';
import { NewThemeDisplay } from '../NewThemeDisplay';

// Mock child components to isolate UseHookDemo's rendering structure
jest.mock('../LegacyThemeDisplay', () => ({
  __esModule: true,
  LegacyThemeDisplay: () => <div data-testid="mock-legacy-theme-display">Mock LegacyThemeDisplay</div>,
}));

jest.mock('../NewThemeDisplay', () => ({
  __esModule: true,
  NewThemeDisplay: () => <div data-testid="mock-new-theme-display">Mock NewThemeDisplay</div>,
}));

// We need the real ThemeProvider here, as UseHookDemo wraps its children with it.
// jest.mock('../ThemeProvider', () => ({
//   __esModule: true,
//   ThemeProvider: ({ children }: { children: React.ReactNode }) => (
//     <div data-testid="mock-theme-provider">{children}</div>
//   ),
// }));


describe('UseHookDemo Component', () => {
  it('renders LegacyThemeDisplay and NewThemeDisplay components within ThemeProvider', () => {
    render(<UseHookDemo />);

    // Check for the presence of the mocked child components
    expect(screen.getByTestId('mock-legacy-theme-display')).toBeInTheDocument();
    expect(screen.getByTestId('mock-new-theme-display')).toBeInTheDocument();

    // Verify that ThemeProvider is implicitly rendering them by checking a top-level element
    // of UseHookDemo itself, and trusting the individual component tests for ThemeProvider.
    expect(screen.getByText(/React 19 `use` Hook vs. `useContext` Demo/i)).toBeInTheDocument();
  });
});
