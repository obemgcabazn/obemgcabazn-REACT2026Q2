import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ErrorHandler from '../components/ErrorHandler.tsx';

describe('ErrorHandler', () => {
  it('Test for 404 error message', () => {
    render(<ErrorHandler errorData={new Error('404')} />);

    expect(screen.getByText('Pokemon not found')).toBeInTheDocument();
  });

  it('Test for 400 error message', () => {
    render(<ErrorHandler errorData={new Error('400')} />);

    expect(screen.getByText('Bad request')).toBeInTheDocument();
  });

  it('Test for 500 error message', () => {
    render(<ErrorHandler errorData={new Error('500')} />);

    expect(
      screen.getByText('Server error, try again later')
    ).toBeInTheDocument();
  });

  it('Test for default error message', () => {
    const testMessage = 'test message';
    render(<ErrorHandler errorData={new Error(testMessage)} />);

    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });
});
