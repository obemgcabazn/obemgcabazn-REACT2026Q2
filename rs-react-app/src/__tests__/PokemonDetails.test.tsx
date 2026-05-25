import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useSearchParams } from 'react-router';
import { PokemonDetails } from '../components/PokemonDetails';

const SearchParamsDisplay = () => {
  const [params] = useSearchParams();
  return <div data-testid="search-params">{params.toString()}</div>;
};

const renderWithRouter = (initialEntry = '/') =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <PokemonDetails />
      <SearchParamsDisplay />
    </MemoryRouter>
  );

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
});

describe('PokemonDetails', () => {
  it('renders wrapper element', () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => baseMockPokemon,
    } as Response);
    renderWithRouter('/');
    expect(
      document.querySelector('.pokemon-details__wrapper')
    ).toBeInTheDocument();
  });

  it('shows spinner while loading', async () => {
    vi.spyOn(global, 'fetch').mockReturnValue(new Promise(() => {}));
    renderWithRouter('/?pokemonId=25');
    await waitFor(() => {
      expect(screen.getByAltText('Loading...')).toBeInTheDocument();
    });
  });

  it('hides spinner after loading completes', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => baseMockPokemon,
    } as Response);
    renderWithRouter('/?pokemonId=25');
    await waitFor(() => {
      expect(screen.queryByAltText('Loading...')).not.toBeInTheDocument();
    });
  });

  it('shows pokemon name with capitalised first letter', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => baseMockPokemon,
    } as Response);
    renderWithRouter('/?pokemonId=25');
    await waitFor(() => {
      expect(screen.getByText(/Pikachu/)).toBeInTheDocument();
    });
  });

  it('shows pokemon id formatted with leading zeros', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => baseMockPokemon,
    } as Response);
    renderWithRouter('/?pokemonId=25');
    await waitFor(() => {
      expect(screen.getByText('#025')).toBeInTheDocument();
    });
  });

  it('shows official artwork image when available', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => baseMockPokemon,
    } as Response);
    renderWithRouter('/?pokemonId=25');
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
    renderWithRouter('/?pokemonId=25');
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
    renderWithRouter('/?pokemonId=25');
    await waitFor(() => {
      expect(screen.getByText('electric')).toBeInTheDocument();
    });
  });

  it('shows height and weight', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => baseMockPokemon,
    } as Response);
    renderWithRouter('/?pokemonId=25');
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
    renderWithRouter('/?pokemonId=25');
    await waitFor(() => {
      expect(screen.getByText('112')).toBeInTheDocument();
    });
  });

  it('hides base experience section when value is 0', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...baseMockPokemon, base_experience: 0 }),
    } as Response);
    renderWithRouter('/?pokemonId=25');
    await waitFor(() => screen.getByText(/Pikachu/));
    expect(screen.queryByText(/Base Exp/)).not.toBeInTheDocument();
  });

  it('close button removes pokemonId from search params', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => baseMockPokemon,
    } as Response);
    renderWithRouter('/?pokemonId=25');
    await waitFor(() => screen.getByText(/Pikachu/));

    fireEvent.click(screen.getByText(/Close/));

    await waitFor(() => {
      expect(screen.getByTestId('search-params').textContent).toBe('');
    });
  });
});
