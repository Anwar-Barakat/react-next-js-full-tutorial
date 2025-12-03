import { render, screen } from '@testing-library/react';
import JSXRules from '@/app/components/03-jsx-rules/components/JsxRules';

describe('JSXRules', () => {
  it('renders the component with a title and a list of rules', () => {
    render(<JSXRules />);
    const title = screen.getByText('JSX Rules');
    const rules = screen.getAllByRole('listitem');

    expect(title).toBeInTheDocument();
    expect(rules).toHaveLength(3);
  });
});
