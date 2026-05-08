import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TestError from '../components/TestError';
import ErrorBoundary from '../components/ErrorBoundary';

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('TestError', () => {
  it('Render button Test Error', () => {
    render(
      <ErrorBoundary>
        <TestError />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /test error/i });
    expect(button).toBeInTheDocument();
  });

  it('Button click throw error', () => {
    render(
      <ErrorBoundary>
        <TestError />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /test error/i });
    fireEvent.click(button);

    expect(screen.getByText(/test error/i)).toBeInTheDocument();
  });
});
