import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RootNotFound from '../app/not-found';

describe('NotFound', () => {
  it('renders 404 heading', () => {
    render(<RootNotFound />);
    expect(
      screen.getByRole('heading', { name: /404 Not Found/i })
    ).toBeInTheDocument();
  });

  it('renders link to main page', () => {
    render(<RootNotFound />);
    expect(
      screen.getByRole('link', { name: /To Main Page/i })
    ).toBeInTheDocument();
  });

  it('link points to root path', () => {
    render(<RootNotFound />);
    expect(screen.getByRole('link', { name: /To Main Page/i })).toHaveAttribute(
      'href',
      '/'
    );
  });
});
