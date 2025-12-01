import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Person from '../components/Person';

describe('Person Component', () => {
  it('renders person\'s name and age', () => {
    render(<Person name="Jane Doe" age={30} />);

    expect(screen.getByText('Name: Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Age: 30')).toBeInTheDocument();
  });
});
