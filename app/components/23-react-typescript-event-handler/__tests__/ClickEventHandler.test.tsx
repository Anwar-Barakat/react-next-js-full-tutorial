import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ClickEventHandler } from '../components/ClickEventHandler';

describe('ClickEventHandler Component', () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('renders a button and triggers alert on click', () => {
    render(<ClickEventHandler />);
    const button = screen.getByRole('button', { name: /click me/i });
    
    fireEvent.click(button);
    expect(alertSpy).toHaveBeenCalledWith('Button clicked! Event type: click');
  });
});
