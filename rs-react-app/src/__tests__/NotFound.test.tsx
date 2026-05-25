import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { NotFound } from '../components/NotFound';

const renderNotFound = () =>
  render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );

describe('NotFound', () => {
  it('renders 404 heading', () => {
    renderNotFound();
    expect(
      screen.getByRole('heading', { name: /404 Not Found/i })
    ).toBeInTheDocument();
  });

  it('renders link to main page', () => {
    renderNotFound();
    expect(
      screen.getByRole('link', { name: /To Main Page/i })
    ).toBeInTheDocument();
  });

  it('link points to root path', () => {
    renderNotFound();
    expect(screen.getByRole('link', { name: /To Main Page/i })).toHaveAttribute(
      'href',
      '/'
    );
  });
});
