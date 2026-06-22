import { render, screen } from '@testing-library/react';
import Spinner from '../components/Spinner.tsx';
import { describe, expect, it } from 'vitest';

describe('Spinner', () => {
  it('render loading image', () => {
    render(<Spinner />);
    expect(screen.getByAltText('Loading...')).toBeInTheDocument();
  });

  it('render loading text', () => {
    render(<Spinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
