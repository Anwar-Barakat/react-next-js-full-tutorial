import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

describe('Footer', () => {
  it('renders the copyright notice with the current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    const copyrightNotice = screen.getByText(`© ${currentYear} My Website`);
    expect(copyrightNotice).toBeInTheDocument();
  });
});
