import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Footer from '../components/footer';
import useStore from '../store/Store';
import { IntlWrapper } from './test-utils';

beforeEach(() => {
  useStore.setState({ selectedPokemons: [] });
  vi.restoreAllMocks();
  global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  global.URL.revokeObjectURL = vi.fn();
});

const renderFooter = () =>
  render(
    <IntlWrapper>
      <Footer />
    </IntlWrapper>
  );

describe('Footer', () => {
  it('renders nothing when no pokemons are selected', () => {
    const { container } = renderFooter();
    expect(container.querySelector('footer')).toBeNull();
  });

  it('renders footer when pokemons are selected', () => {
    useStore.setState({ selectedPokemons: ['pikachu'] });
    renderFooter();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('"Unselect all" clears selected pokemons', () => {
    useStore.setState({ selectedPokemons: ['pikachu'] });
    renderFooter();
    fireEvent.click(screen.getByText('Unselect all'));
    expect(useStore.getState().selectedPokemons).toEqual([]);
  });

  it('Download button is enabled by default', () => {
    useStore.setState({ selectedPokemons: ['pikachu'] });
    renderFooter();
    expect(screen.getByRole('button', { name: /download/i })).toBeEnabled();
  });

  it('Download button is disabled while loading', async () => {
    useStore.setState({ selectedPokemons: ['pikachu'] });
    vi.spyOn(global, 'fetch').mockReturnValue(new Promise(() => {}));

    renderFooter();
    fireEvent.click(screen.getByRole('button', { name: /download/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /download/i })).toBeDisabled();
    });
  });

  it('triggers CSV download on success', async () => {
    useStore.setState({ selectedPokemons: ['pikachu'] });
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      blob: () => Promise.resolve(new Blob(['csv-data'])),
    } as Response);
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});

    renderFooter();
    fireEvent.click(screen.getByRole('button', { name: /download/i }));

    await waitFor(() => expect(clickSpy).toHaveBeenCalled());
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });
});
