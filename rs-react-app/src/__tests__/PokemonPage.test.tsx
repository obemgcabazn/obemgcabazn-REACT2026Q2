import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import PokemonPage from '../components/PokemonPage';

globalThis.fetch = vi.fn();

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

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe('PokemonPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('shows spinner then renders pokemon list', async () => {
    mockFetch({ results: [{ name: 'bulbasaur', url: '...' }] });

    renderWithProviders(<PokemonPage />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
  });

  it('fetches pokemon by name when searchQuery exists in localStorage', async () => {
    localStorage.setItem('searchQuery', JSON.stringify('pikachu'));
    mockFetch({ id: 25, name: 'pikachu', types: [], sprites: {} });

    renderWithProviders(<PokemonPage />);

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });
  });

  it('shows error message when fetchAllPokemons network request fails', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('Network error')
    );

    renderWithProviders(<PokemonPage />);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('shows generic error message when fetchAllPokemons catch receives non-Error value', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      'plain string error'
    );

    renderWithProviders(<PokemonPage />);

    await waitFor(() => {
      expect(screen.getByText('Error while loading data')).toBeInTheDocument();
    });
  });

  it('shows "Pokemon not found" when fetchPokemonByName returns 404', async () => {
    localStorage.setItem('searchQuery', JSON.stringify('unknownmon'));
    mockFetch({}, false);

    renderWithProviders(<PokemonPage />);

    await waitFor(() => {
      expect(screen.getByText('Pokemon not found')).toBeInTheDocument();
    });
  });

  it('shows error message when fetchPokemonByName network request fails', async () => {
    localStorage.setItem('searchQuery', JSON.stringify('pikachu'));
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('fetch failed')
    );

    renderWithProviders(<PokemonPage />);

    await waitFor(() => {
      expect(screen.getByText('fetch failed')).toBeInTheDocument();
    });
  });
});
