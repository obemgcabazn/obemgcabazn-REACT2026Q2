import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ErrorHandler from '../components/ErrorHandler';

describe('ErrorHandler', () => {
  it('Test for 404 error message', () => {
    render(<ErrorHandler errorMessage="404" />);
    expect(screen.getByText('Pokemon not found')).toBeInTheDocument();
  });

  it('Test for 400 error message', () => {
    render(<ErrorHandler errorMessage="400" />);
    expect(screen.getByText('Bad request')).toBeInTheDocument();
  });

  it('Test for 500 error message', () => {
    render(<ErrorHandler errorMessage="500" />);
    expect(
      screen.getByText('Server error, try again later')
    ).toBeInTheDocument();
  });

  it('Test for default error message', () => {
    const testMessage = 'test message';
    render(<ErrorHandler errorMessage={testMessage} />);
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });
});
