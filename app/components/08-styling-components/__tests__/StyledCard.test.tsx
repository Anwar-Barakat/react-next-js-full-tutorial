import { render, screen } from '@testing-library/react';
import StyledCard from '../components/StyledCard';

describe('StyledCard', () => {
  it('renders the styled card with a title and description', () => {
    render(<StyledCard />);
    const title = screen.getByText('Styled Card');
    const paragraph = screen.getByText('This card is styled with Tailwind CSS.');

    expect(title).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();
  });
});
