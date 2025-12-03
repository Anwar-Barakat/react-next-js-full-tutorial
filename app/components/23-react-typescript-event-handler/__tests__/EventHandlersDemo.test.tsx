import { render, screen } from '@testing-library/react';
import { EventHandlersDemo } from '../components/EventHandlersDemo';
import { ClickEventHandler } from '../components/ClickEventHandler';
import { ChangeEventHandler } from '../components/ChangeEventHandler';
import { SubmitEventHandler } from '../components/SubmitEventHandler';

// Mock child components to isolate Container's rendering
jest.mock('../components/ClickEventHandler', () => ({
  __esModule: true,
  ClickEventHandler: () => <div data-testid="mock-click-handler">Mock ClickEventHandler</div>,
}));

jest.mock('../components/ChangeEventHandler', () => ({
  __esModule: true,
  ChangeEventHandler: () => <div data-testid="mock-change-handler">Mock ChangeEventHandler</div>,
}));

jest.mock('../components/SubmitEventHandler', () => ({
  __esModule: true,
  SubmitEventHandler: () => <div data-testid="mock-submit-handler">Mock SubmitEventHandler</div>,
}));

describe('EventHandlersDemo', () => {
  it('renders ClickEventHandler, ChangeEventHandler, and SubmitEventHandler components', () => {
    render(<EventHandlersDemo />);

    expect(screen.getByTestId('mock-click-handler')).toBeInTheDocument();
    expect(screen.getByTestId('mock-change-handler')).toBeInTheDocument();
    expect(screen.getByTestId('mock-submit-handler')).toBeInTheDocument();
  });
});
