import { render, screen } from '@testing-library/react';
import IconComponent from '../components/IconComponent';

// Mocking react-icons/fa to avoid issues with SVG rendering in JSDOM
jest.mock('react-icons/fa', () => ({
  FaBeer: () => <svg data-testid="fa-beer-icon" />,
}));

describe('IconComponent', () => {
  it('renders the icon component with a title and an icon', () => {
    render(<IconComponent />);
    const title = screen.getByText('Icon Component');
    const icon = screen.getByTestId('fa-beer-icon');

    expect(title).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
  });
});
