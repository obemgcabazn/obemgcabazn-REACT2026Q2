import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Footer from '../components/footer';
import useStore from '../store/Store';

const mockPokemon = (name: string) => ({
  name,
  id: 1,
  types: [{ type: { name: 'electric' } }],
  species: { url: `https://pokeapi.co/api/v2/pokemon-species/1/` },
  height: 4,
  weight: 60,
  base_experience: 112,
});

beforeEach(() => {
  useStore.setState({ selectedPokemons: [] });
  vi.restoreAllMocks();
  global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  global.URL.revokeObjectURL = vi.fn();
});

describe('Footer', () => {
  it('renders nothing when no pokemons are selected', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer')).toBeNull();
  });

  it('renders footer when pokemons are selected', () => {
    useStore.setState({ selectedPokemons: ['pikachu'] });
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('shows correct count of selected pokemons', () => {
    useStore.setState({ selectedPokemons: ['pikachu', 'bulbasaur'] });
    render(<Footer />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('"Unselect all" clears selected pokemons', () => {
    useStore.setState({ selectedPokemons: ['pikachu'] });
    render(<Footer />);
    fireEvent.click(screen.getByText('Unselect all'));
    expect(useStore.getState().selectedPokemons).toEqual([]);
  });

  it('Download button is enabled by default', () => {
    useStore.setState({ selectedPokemons: ['pikachu'] });
    render(<Footer />);
    expect(screen.getByRole('button', { name: /download/i })).toBeEnabled();
  });

  it('Download button is disabled while loading', async () => {
    useStore.setState({ selectedPokemons: ['pikachu'] });
    vi.spyOn(global, 'fetch').mockReturnValue(new Promise(() => {}));

    render(<Footer />);
    fireEvent.click(screen.getByRole('button', { name: /download/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /download/i })).toBeDisabled();
    });
  });

  it('shows spinner while loading', async () => {
    useStore.setState({ selectedPokemons: ['pikachu'] });
    vi.spyOn(global, 'fetch').mockReturnValue(new Promise(() => {}));

    render(<Footer />);
    fireEvent.click(screen.getByRole('button', { name: /download/i }));

    await waitFor(() => {
      expect(document.querySelector('.btn-spinner')).toBeInTheDocument();
    });
  });

  it('triggers CSV download on success', async () => {
    useStore.setState({ selectedPokemons: ['pikachu'] });
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: () => Promise.resolve(mockPokemon('pikachu')),
    } as Response);
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});

    render(<Footer />);
    fireEvent.click(screen.getByRole('button', { name: /download/i }));

    await waitFor(() => expect(clickSpy).toHaveBeenCalled());
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('sets correct filename for downloaded CSV', async () => {
    useStore.setState({ selectedPokemons: ['pikachu', 'bulbasaur'] });
    vi.spyOn(global, 'fetch').mockResolvedValue({
      json: () => Promise.resolve(mockPokemon('pikachu')),
    } as Response);
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});
    const createElementSpy = vi.spyOn(document, 'createElement');

    render(<Footer />);
    fireEvent.click(screen.getByRole('button', { name: /download/i }));

    await waitFor(() => expect(clickSpy).toHaveBeenCalled());
    const anchor = createElementSpy.mock.results.find(
      (r) => r.value instanceof HTMLAnchorElement
    )?.value as HTMLAnchorElement;
    expect(anchor.download).toBe('2_items.csv');
  });

  it('shows error when fetch fails', async () => {
    useStore.setState({ selectedPokemons: ['pikachu'] });
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    render(<Footer />);
    fireEvent.click(screen.getByRole('button', { name: /download/i }));

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('re-enables Download button after error', async () => {
    useStore.setState({ selectedPokemons: ['pikachu'] });
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('fail'));

    render(<Footer />);
    fireEvent.click(screen.getByRole('button', { name: /download/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /download/i })).toBeEnabled();
    });
  });
});
