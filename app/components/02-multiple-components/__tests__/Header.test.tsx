import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

describe('Header', () => {
    it('renders the header with a welcome message and navigation links', () => {
      render(<Header />);
      const welcomeMessage = screen.getByText('Welcome to My Website!');
      const links = screen.getAllByRole('link');

      expect(welcomeMessage).toBeInTheDocument();
      expect(links).toHaveLength(3);
    },
  );
});
