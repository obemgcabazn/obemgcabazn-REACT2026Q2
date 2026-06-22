import { render, screen, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import PokemonPage from '../components/PokemonPage';

const mockPush = vi.hoisted(() => vi.fn());
const mockSearchParams = vi.hoisted(() => ({
  current: new URLSearchParams('page=1'),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams.current,
  useRouter: () => ({ push: mockPush, replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
}));

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
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe('PokemonPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockSearchParams.current = new URLSearchParams('page=1');
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

describe('PokemonPage caching', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderWithCache = (page: string, queryClient: QueryClient) => {
    mockSearchParams.current = new URLSearchParams(`page=${page}`);
    return render(
      <QueryClientProvider client={queryClient}>
        <PokemonPage />
      </QueryClientProvider>
    );
  };

  it('serves list data from cache on re-render without calling fetch again', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity } },
    });

    mockFetch({ results: [{ name: 'bulbasaur', url: '...' }] });

    const { rerender } = renderWithCache('1', queryClient);

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    mockSearchParams.current = new URLSearchParams('page=1');
    rerender(
      <QueryClientProvider client={queryClient}>
        <PokemonPage />
      </QueryClientProvider>
    );

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('caches different pages under separate query keys', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity } },
    });

    mockFetch({ results: [{ name: 'bulbasaur', url: '...' }] });

    const { unmount } = renderWithCache('1', queryClient);

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    unmount();

    mockFetch({ results: [{ name: 'charmander', url: '...' }] });

    renderWithCache('2', queryClient);

    await waitFor(() => {
      expect(screen.getByText('charmander')).toBeInTheDocument();
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it('does not re-fetch when navigating back to an already cached page', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity } },
    });

    mockFetch({ results: [{ name: 'bulbasaur', url: '...' }] });
    mockFetch({ results: [{ name: 'charmander', url: '...' }] });

    const { unmount: unmount1 } = renderWithCache('1', queryClient);
    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
    unmount1();

    const { unmount: unmount2 } = renderWithCache('2', queryClient);
    await waitFor(() => {
      expect(screen.getByText('charmander')).toBeInTheDocument();
    });
    unmount2();

    renderWithCache('1', queryClient);
    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it('removes cached data from the store when queryClient.clear() is called', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity } },
    });

    mockFetch({ results: [{ name: 'bulbasaur', url: '...' }] });

    renderWithCache('1', queryClient);

    await waitFor(() => {
      expect(queryClient.getQueryData(['list', '1'])).toBeDefined();
    });

    act(() => {
      queryClient.clear();
    });

    expect(queryClient.getQueryData(['list', '1'])).toBeUndefined();
  });

  it('fetches fresh data after cache is cleared and component remounts', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity } },
    });

    mockFetch({ results: [{ name: 'bulbasaur', url: '...' }] });

    const { unmount } = renderWithCache('1', queryClient);

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    unmount();

    act(() => {
      queryClient.clear();
    });

    mockFetch({ results: [{ name: 'squirtle', url: '...' }] });

    renderWithCache('1', queryClient);

    await waitFor(() => {
      expect(screen.getByText('squirtle')).toBeInTheDocument();
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });
});
