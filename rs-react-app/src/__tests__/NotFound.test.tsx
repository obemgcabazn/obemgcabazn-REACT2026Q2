import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from '../app/not-found';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

const renderNotFound = () => render(<NotFound />);

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
