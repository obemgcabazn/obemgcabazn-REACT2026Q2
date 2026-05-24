import { describe, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from '../components/About.tsx';

describe('About', () => {
  it('links exist', () => {
    render(<About />);

    expect(screen.getByText('RS School React Course')).toBeInTheDocument();
    expect(screen.getByText('@obemgcabazn')).toBeInTheDocument();
  });
});
