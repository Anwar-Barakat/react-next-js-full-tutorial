import { render, screen } from '@testing-library/react';
import Person from '../components/Person';

describe('Person', () => {
  it('renders the person\'s name and age', () => {
    render(<Person name="Jane Doe" age={30} />);

    expect(screen.getByText('Name: Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Age: 30')).toBeInTheDocument();
  });
});
