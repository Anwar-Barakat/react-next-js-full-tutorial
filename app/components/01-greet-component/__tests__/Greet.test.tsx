import { render, screen } from '@testing-library/react';
import Greet from '@/app/components/01-greet-component/components/Greet';

describe('Greet', () => {
  it('renders a default greeting message', () => {
    render(<Greet />);
    const textElement = screen.getByText('Hello, Guest!');
    expect(textElement).toBeInTheDocument();
  });

  it('renders a personalized greeting message when a name is provided', () => {
    render(<Greet name="Anwar" />);
    const textElement = screen.getByText('Hello, Anwar!');
    expect(textElement).toBeInTheDocument();
  });
});
