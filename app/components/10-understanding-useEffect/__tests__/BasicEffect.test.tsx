import { render, screen } from '@testing-library/react';
import BasicEffect from '../components/BasicEffect';

describe('BasicEffect', () => {
  it('renders the component and logs "Component mounted" on mount', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<BasicEffect />);
    expect(screen.getByText('Basic Effect Component (Check console for mount message)')).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith('Component mounted');

    consoleSpy.mockRestore();
  });
});
