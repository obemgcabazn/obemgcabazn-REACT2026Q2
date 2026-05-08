import type { Pokemon } from 'pokeapi-typescript';
import { describe, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import OnePokemon from '../components/OnePokemon.tsx';

export const mockPokemon: Pokemon = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  base_experience: 112,
  types: [{ slot: 1, type: { name: 'electric', url: '' } }],
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
} as unknown as Pokemon;

describe('OnePokemon', () => {
  it('should render image', () => {
    render(<OnePokemon pokemon={mockPokemon} />);

    const img = screen.getByRole('img', { name: /pikachu/i });
    expect(img).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
    );
  });
});
