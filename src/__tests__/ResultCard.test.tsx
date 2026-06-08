import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResultCard from '../components/ResultCard';
import type { FormResult } from '../Store/Store';

const base: FormResult = {
  source: 'rhf',
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
  country: 'Germany',
  image: '',
  password: 'Secret1!',
  privacy: true,
};

const wrap = (card: React.ReactElement) => <ul>{card}</ul>;

describe('ResultCard', () => {
  it('renders name, age, email and country', () => {
    render(wrap(<ResultCard item={base} isNew={false} />));
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('Germany')).toBeInTheDocument();
  });

  it('applies result-new class when isNew is true', () => {
    const { container } = render(wrap(<ResultCard item={base} isNew={true} />));
    expect(container.querySelector('li')).toHaveClass('result-new');
  });

  it('omits result-new class when isNew is false', () => {
    const { container } = render(
      wrap(<ResultCard item={base} isNew={false} />)
    );
    expect(container.querySelector('li')).not.toHaveClass('result-new');
  });

  it('shows gender when provided', () => {
    render(
      wrap(<ResultCard item={{ ...base, gender: 'female' }} isNew={false} />)
    );
    expect(screen.getByText('female')).toBeInTheDocument();
  });

  it('hides gender section when not provided', () => {
    const { container } = render(
      wrap(<ResultCard item={base} isNew={false} />)
    );
    expect(container.innerHTML).not.toMatch(/Gender/);
  });

  it('renders image tag when image is provided', () => {
    render(
      wrap(
        <ResultCard
          item={{ ...base, image: 'data:image/png;base64,x' }}
          isNew={false}
        />
      )
    );
    expect(screen.getByAltText('uploaded')).toBeInTheDocument();
  });

  it('hides image tag when image is empty', () => {
    render(wrap(<ResultCard item={base} isNew={false} />));
    expect(screen.queryByAltText('uploaded')).not.toBeInTheDocument();
  });

  it('shows "Agreed" when privacy is true', () => {
    render(wrap(<ResultCard item={base} isNew={false} />));
    expect(screen.getByText('Agreed')).toBeInTheDocument();
  });

  it('shows "Not agreed" when privacy is false', () => {
    render(
      wrap(<ResultCard item={{ ...base, privacy: false }} isNew={false} />)
    );
    expect(screen.getByText('Not agreed')).toBeInTheDocument();
  });
});
