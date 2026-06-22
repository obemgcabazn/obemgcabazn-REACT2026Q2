import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import OnePokemon from '../components/OnePokemon';
import type { PokemonDetail } from '../lib/pokemon';

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

const mockPokemon: PokemonDetail = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  base_experience: 112,
  types: [{ type: { name: 'electric' } }],
  sprites: {
    front_default:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    other: {
      'official-artwork': {
        front_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
      },
    },
  },
};

describe('OnePokemon', () => {
  it('should render image', () => {
    render(<OnePokemon pokemon={mockPokemon} />);
    const img = screen.getByRole('img', { name: /pikachu/i });
    expect(img).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
    );
  });

  it('should render pokemon name', () => {
    render(<OnePokemon pokemon={mockPokemon} />);
    expect(screen.getByText('pikachu')).toBeInTheDocument();
  });
});
