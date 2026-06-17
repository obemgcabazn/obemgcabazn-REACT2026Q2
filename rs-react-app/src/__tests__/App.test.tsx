import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import App from '../App';

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

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderApp = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/?page=1']}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('Load ', async () => {
    mockFetch({ results: [{ name: 'bulbasaur', url: '...' }] });

    renderApp();

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
  });

  it('searchQuery exists in localStorage', async () => {
    localStorage.setItem('searchQuery', JSON.stringify('pikachu'));
    mockFetch({ id: 25, name: 'pikachu', types: [], sprites: {} });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });
  });
});
