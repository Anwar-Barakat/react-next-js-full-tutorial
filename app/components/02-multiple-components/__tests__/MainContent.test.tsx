import { render, screen } from '@testing-library/react';
import MainContent from '@/app/components/02-multiple-components/components/MainContent';

describe('MainContent', () => {
  it('renders the main content with a title and paragraph', () => {
    render(<MainContent />);
    const title = screen.getByText('Main Content');
    const paragraph = screen.getByText('This is the main content of the page.');

    expect(title).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();
  });
});
