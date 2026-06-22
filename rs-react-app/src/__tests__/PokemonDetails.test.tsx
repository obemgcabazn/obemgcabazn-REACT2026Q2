import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PokemonDetails } from '../components/PokemonDetails';

const mockPush = vi.hoisted(() => vi.fn());
const mockSearchParams = vi.hoisted(() => ({
  current: new URLSearchParams(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams.current,
  useRouter: () => ({ push: mockPush, replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
}));

const createQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderWithProviders = (
  params = '',
  queryClient = createQueryClient()
) => {
  mockSearchParams.current = new URLSearchParams(params);
  return render(
    <QueryClientProvider client={queryClient}>
      <PokemonDetails />
    </QueryClientProvider>
  );
};

const baseMockPokemon = {
  id: 25,
  name: 'pikachu',
  types: [{ type: { name: 'electric' } }],
  sprites: {
    front_default: 'https://example.com/front.png',
    other: {
      'official-artwork': {
        front_default: 'https://example.com/artwork.png',
      },
    },
  },
  height: 4,
  weight: 60,
  base_experience: 112,
};

beforeEach(() => {
  vi.restoreAllMocks();
  mockPush.mockClear();
});

describe('PokemonDetails', () => {
  it('renders wrapper element', () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => baseMockPokemon,
    } as Response);
    renderWithProviders();
    expect(
      document.querySelector('.pokemon-details__wrapper')
    ).toBeInTheDocument();
  });

  it('shows spinner while loading', async () => {
    vi.spyOn(global, 'fetch').mockReturnValue(new Promise(() => {}));
    renderWithProviders('pokemonId=25');
    await waitFor(() => {
      expect(screen.getByAltText('Loading...')).toBeInTheDocument();
    });
  });

  it('hides spinner after loading completes', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => baseMockPokemon,
    } as Response);
    renderWithProviders('pokemonId=25');
    await waitFor(() => {
      expect(screen.queryByAltText('Loading...')).not.toBeInTheDocument();
    });
  });

  it('shows pokemon name with capitalised first letter', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => baseMockPokemon,
    } as Response);
    renderWithProviders('pokemonId=25');
    await waitFor(() => {
      expect(screen.getByText(/Pikachu/)).toBeInTheDocument();
    });
  });

  it('shows pokemon id formatted with leading zeros', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => baseMockPokemon,
    } as Response);
    renderWithProviders('pokemonId=25');
    await waitFor(() => {
      expect(screen.getByText('#025')).toBeInTheDocument();
    });
  });

  it('shows official artwork image when available', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => baseMockPokemon,
    } as Response);
    renderWithProviders('pokemonId=25');
    await waitFor(() => {
      expect(screen.getByAltText('pikachu')).toHaveAttribute(
        'src',
        'https://example.com/artwork.png'
      );
    });
  });

  it('falls back to front_default when no official artwork', async () => {
    const pokemon = {
      ...baseMockPokemon,
      sprites: {
        front_default: 'https://example.com/front.png',
        other: { 'official-artwork': { front_default: null } },
      },
    };
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => pokemon,
    } as Response);
    renderWithProviders('pokemonId=25');
    await waitFor(() => {
      expect(screen.getByAltText('pikachu')).toHaveAttribute(
        'src',
        'https://example.com/front.png'
      );
    });
  });

  it('shows pokemon types', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => baseMockPokemon,
    } as Response);
    renderWithProviders('pokemonId=25');
    await waitFor(() => {
      expect(screen.getByText('electric')).toBeInTheDocument();
    });
  });

  it('shows height and weight', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => baseMockPokemon,
    } as Response);
    renderWithProviders('pokemonId=25');
    await waitFor(() => {
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('60')).toBeInTheDocument();
    });
  });

  it('shows base experience', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => baseMockPokemon,
    } as Response);
    renderWithProviders('pokemonId=25');
    await waitFor(() => {
      expect(screen.getByText('112')).toBeInTheDocument();
    });
  });

  it('hides base experience section when value is 0', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...baseMockPokemon, base_experience: 0 }),
    } as Response);
    renderWithProviders('pokemonId=25');
    await waitFor(() => screen.getByText(/Pikachu/));
    expect(screen.queryByText(/Base Exp/)).not.toBeInTheDocument();
  });

  it('shows error handler when fetch returns 404', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({}),
    } as Response);
    renderWithProviders('pokemonId=9999');
    await waitFor(() => {
      expect(screen.getByText('Pokemon not found')).toBeInTheDocument();
    });
  });

  it('close button removes pokemonId from search params', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => baseMockPokemon,
    } as Response);
    renderWithProviders('pokemonId=25');
    await waitFor(() => screen.getByText(/Pikachu/));

    fireEvent.click(screen.getByText(/Close/));

    expect(mockPush).toHaveBeenCalledWith('/?');
  });

  it('serves cached data on re-render without calling fetch again', async () => {
    const queryClient = createQueryClient();
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => baseMockPokemon,
    } as Response);

    const { rerender } = renderWithProviders('pokemonId=25', queryClient);

    await waitFor(() => {
      expect(screen.getByText(/Pikachu/)).toBeInTheDocument();
    });

    rerender(
      <QueryClientProvider client={queryClient}>
        <PokemonDetails />
      </QueryClientProvider>
    );

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
