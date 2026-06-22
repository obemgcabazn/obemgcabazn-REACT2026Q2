import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import PokemonsList from '../components/PokemonsList';
import useStore from '../store/Store';
import { IntlWrapper } from './test-utils';

vi.mock('../i18n/navigation', () => ({
  Link: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    locale?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
}));

const singlePokemon = [
  { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
];

const multiplePokemon = [
  { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
  { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
];

const renderList = (
  pokemonsList = singlePokemon,
  currentPage = '1',
  locale = 'en'
) =>
  render(
    <IntlWrapper>
      <PokemonsList
        pokemonsList={pokemonsList}
        currentPage={currentPage}
        locale={locale}
      />
    </IntlWrapper>
  );

describe('DOM tests PokemonList', () => {
  beforeEach(() => {
    useStore.setState({ selectedPokemons: [] });
  });

  it('Empty Array', () => {
    renderList([]);
    expect(screen.getByText('Pokemons count: 0')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Name' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Description' })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(1);
  });

  it('Single Pokemon', () => {
    renderList(singlePokemon);
    expect(screen.getByText('Pokemons count: 1')).toBeInTheDocument();
  });

  it('Multiple Pokemons', () => {
    renderList(multiplePokemon);
    expect(screen.getByText('Pokemons count: 3')).toBeInTheDocument();
  });
});

describe('Render PokemonList', () => {
  beforeEach(() => {
    useStore.setState({ selectedPokemons: [] });
  });

  it('Prevent to call render', () => {
    const { rerender } = render(
      <IntlWrapper>
        <PokemonsList
          pokemonsList={multiplePokemon}
          currentPage="1"
          locale="en"
        />
      </IntlWrapper>
    );

    rerender(
      <IntlWrapper>
        <PokemonsList
          pokemonsList={multiplePokemon}
          currentPage="1"
          locale="en"
        />
      </IntlWrapper>
    );

    expect(screen.getByText('Pokemons count: 3')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(4);
  });
});

describe('Pagination', () => {
  it('displays current page number', () => {
    renderList(singlePokemon, '5');
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('Next link points to next page', () => {
    renderList(singlePokemon, '1');
    expect(screen.getByRole('link', { name: 'Next' })).toHaveAttribute(
      'href',
      '/?page=2'
    );
  });

  it('Prev is disabled on page 1', () => {
    renderList(singlePokemon, '1');
    expect(screen.queryByRole('link', { name: 'Prev' })).toBeNull();
  });

  it('Prev link points to previous page when page > 1', () => {
    renderList(singlePokemon, '3');
    expect(screen.getByRole('link', { name: 'Prev' })).toHaveAttribute(
      'href',
      '/?page=2'
    );
  });
});

describe('Pokemon selection', () => {
  beforeEach(() => {
    useStore.setState({ selectedPokemons: [] });
  });

  it('pokemon name is a link with pokemonId', () => {
    renderList(singlePokemon, '1');
    expect(screen.getByRole('link', { name: 'bulbasaur' })).toHaveAttribute(
      'href',
      '/?page=1&pokemonId=1'
    );
  });

  it('checking checkbox adds pokemon to store', () => {
    renderList(singlePokemon);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(useStore.getState().selectedPokemons).toContain('bulbasaur');
  });

  it('unchecking checkbox removes pokemon from store', () => {
    useStore.setState({ selectedPokemons: ['bulbasaur'] });
    renderList(singlePokemon);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(useStore.getState().selectedPokemons).not.toContain('bulbasaur');
  });

  it('checkbox is checked when pokemon is in store', () => {
    useStore.setState({ selectedPokemons: ['bulbasaur'] });
    renderList(singlePokemon);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});
