import { render, screen } from '@testing-library/react';
import Greeting from '@/app/components/04-dynamic-content/components/Greeting';

describe('Greeting', () => {
  it('renders the greeting component with a name and current date', () => {
    render(<Greeting />);
    const nameGreeting = screen.getByText('Hello, John!');
    const currentDate = new Date().toLocaleDateString();
    const dateDisplay = screen.getByText(`Today's date is: ${currentDate}`);

    expect(nameGreeting).toBeInTheDocument();
    expect(dateDisplay).toBeInTheDocument();
  });
});
