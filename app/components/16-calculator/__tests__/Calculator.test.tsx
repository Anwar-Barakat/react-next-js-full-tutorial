import { render, screen, fireEvent } from '@testing-library/react';
import { Calculator } from '../components/Calculator';

describe('Calculator', () => {
  it('renders initial display value as "0"', () => {
    render(<Calculator />);
    expect(screen.getByRole('status')).toHaveTextContent('0');
  });

  it('displays clicked numbers correctly', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    expect(screen.getByRole('status')).toHaveTextContent('123');
  });

  it('performs addition correctly', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: 'Equals' }));
    expect(screen.getByRole('status')).toHaveTextContent('3');
  });

  it('performs subtraction correctly', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '-' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: 'Equals' }));
    expect(screen.getByRole('status')).toHaveTextContent('3');
  });

  it('performs multiplication correctly', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByRole('button', { name: '4' }));
    fireEvent.click(screen.getByRole('button', { name: '*' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: 'Equals' }));
    expect(screen.getByRole('status')).toHaveTextContent('12');
  });

  it('performs division correctly', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByRole('button', { name: '/' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: 'Equals' }));
    expect(screen.getByRole('status')).toHaveTextContent('5');
  });

  it('clears the display when "C" is clicked', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByRole('status')).toHaveTextContent('0');
  });

  it('handles chaining operations', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: '*' }));
    fireEvent.click(screen.getByRole('button', { name: '4' }));
    fireEvent.click(screen.getByRole('button', { name: 'Equals' }));
    // (2+3)*4 = 20
    expect(screen.getByRole('status')).toHaveTextContent('20');
  });

  it('starts a new calculation after equals', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Equals' })); // Result 2
    fireEvent.click(screen.getByRole('button', { name: '5' })); // New input
    expect(screen.getByRole('status')).toHaveTextContent('5');
  });
});
