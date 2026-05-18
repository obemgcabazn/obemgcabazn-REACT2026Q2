import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import PokemonPage from '../components/PokemonPage';

globalThis.fetch = vi.fn();

const { mockGet, mockSet } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockSet: vi.fn(),
}));

vi.mock('../controller/StorageHelper', () => ({
  default: {
    get: mockGet,
    set: mockSet,
  },
}));

vi.mock('../components/Spinner', () => ({
  default: () => <div>Loading...</div>,
}));

vi.mock('../components/PokemonsList', () => ({
  default: ({ pokemonsList }: { pokemonsList: { name: string }[] }) => (
    <ul>
      {pokemonsList.map((p) => (
        <li key={p.name}>{p.name}</li>
      ))}
    </ul>
  ),
}));

vi.mock('../components/OnePokemon', () => ({
  default: ({ pokemon }: { pokemon: { name: string } }) => (
    <div>Pokemon: {pokemon.name}</div>
  ),
}));

const mockFetch = (data: unknown, ok = true) => {
  (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok,
    status: ok ? 200 : 404,
    json: async () => data,
  });
};

describe('PokemonPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockReturnValue(null);
  });

  it('shows spinner then renders pokemon list', async () => {
    mockFetch({ results: [{ name: 'bulbasaur', url: '...' }] });

    render(
      <MemoryRouter>
        <PokemonPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
  });

  it('fetches pokemon by name when searchQuery exists in localStorage', async () => {
    mockGet.mockReturnValue('pikachu');
    mockFetch({ id: 25, name: 'pikachu', types: [], sprites: {} });

    render(
      <MemoryRouter>
        <PokemonPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });
  });
});
