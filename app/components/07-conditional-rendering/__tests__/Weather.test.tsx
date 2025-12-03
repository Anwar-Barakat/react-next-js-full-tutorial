import { render, screen } from '@testing-library/react';
import Weather from '../components/Weather';

describe('Weather', () => {
  it('renders "It\'s cold outside!" for temperature less than 15', () => {
    render(<Weather temperature={10} />);
    expect(screen.getByText("It's cold outside! ❄️")).toBeInTheDocument();
  });

  it('renders "It\'s nice outside!" for temperature between 15 and 25', () => {
    render(<Weather temperature={20} />);
    expect(screen.getByText("It's nice outside! ☀️")).toBeInTheDocument();
  });

  it('renders "It\'s hot outside!" for temperature greater than 25', () => {
    render(<Weather temperature={30} />);
    expect(screen.getByText("It's hot outside! 🔥")).toBeInTheDocument();
  });
});
