import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import PokemonsList from '../components/PokemonsList.tsx';
import useStore from '../store/Store.tsx';

const mockPush = vi.hoisted(() => vi.fn());
const mockSearchParams = vi.hoisted(() => ({
  current: new URLSearchParams(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams.current,
  useRouter: () => ({ push: mockPush, replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
}));

const singlePokemon = [
  { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
];

const multiplePokemon = [
  { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
  { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
];

describe('DOM tests PokemonList', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockSearchParams.current = new URLSearchParams();
  });

  it('Empty Array', () => {
    render(<PokemonsList pokemonsList={[]} />);

    expect(screen.getByText('Pokemons count: 0')).toBeInTheDocument();

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    expect(
      screen.getByRole('columnheader', { name: 'Name' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Description' })
    ).toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1);
  });

  it('Single Pokemon', () => {
    render(<PokemonsList pokemonsList={singlePokemon} />);
    expect(screen.getByText('Pokemons count: 1')).toBeInTheDocument();
  });

  it('Heading "Name" exists', () => {
    render(<PokemonsList pokemonsList={singlePokemon} />);

    expect(
      screen.getByRole('columnheader', { name: 'Name' })
    ).toBeInTheDocument();
  });

  it('Heading "Description" exists', () => {
    render(<PokemonsList pokemonsList={singlePokemon} />);

    expect(
      screen.getByRole('columnheader', { name: 'Description' })
    ).toBeInTheDocument();
  });

  it('Multiple Pokemons', () => {
    render(<PokemonsList pokemonsList={multiplePokemon} />);
    expect(screen.getByText('Pokemons count: 3')).toBeInTheDocument();
  });
});

describe('Render PokemonList', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockSearchParams.current = new URLSearchParams();
  });

  it('Prevent to call render', () => {
    const { rerender } = render(
      <PokemonsList pokemonsList={multiplePokemon} />
    );

    rerender(<PokemonsList pokemonsList={multiplePokemon} />);

    expect(screen.getByText('Pokemons count: 3')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(4);
  });

  it('Length change', () => {
    const { rerender } = render(
      <PokemonsList pokemonsList={multiplePokemon} />
    );

    const longerList = [
      ...multiplePokemon,
      { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
    ];

    rerender(<PokemonsList pokemonsList={longerList} />);
    expect(screen.getByText('Pokemons count: 4')).toBeInTheDocument();
  });

  it('Name of item in object change for same length', () => {
    const { rerender } = render(
      <PokemonsList pokemonsList={multiplePokemon} />
    );

    const changedNameList = [
      { name: 'charmander', url: multiplePokemon[0].url },
      multiplePokemon[1],
    ];

    rerender(<PokemonsList pokemonsList={changedNameList} />);

    expect(
      screen.getByRole('cell', { name: 'charmander' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('cell', { name: 'bulbasaur' })
    ).not.toBeInTheDocument();
  });

  it('URL of item in object change for same length', () => {
    const { rerender } = render(
      <PokemonsList pokemonsList={multiplePokemon} />
    );

    const newUrl = 'https://pokeapi.co/api/v2/pokemon/999/';
    const changedUrlList = [
      { name: multiplePokemon[0].name, url: newUrl },
      multiplePokemon[1],
    ];

    rerender(<PokemonsList pokemonsList={changedUrlList} />);

    expect(
      screen.getByRole('cell', { name: `URL: ${newUrl}` })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('cell', { name: `URL: ${multiplePokemon[0].url}` })
    ).not.toBeInTheDocument();
  });

  it('item name differs at same length triggers re-render', () => {
    const { rerender } = render(
      <PokemonsList pokemonsList={multiplePokemon} />
    );

    const changedNameSameLength = [
      { name: 'charmander', url: multiplePokemon[0].url },
      multiplePokemon[1],
      multiplePokemon[2],
    ];

    rerender(<PokemonsList pokemonsList={changedNameSameLength} />);

    expect(
      screen.getByRole('button', { name: 'charmander' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'bulbasaur' })
    ).not.toBeInTheDocument();
  });

  it('same data new array does not re-render', () => {
    const { rerender } = render(
      <PokemonsList pokemonsList={multiplePokemon} />
    );

    const sameDataNewReference = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
    ];

    rerender(<PokemonsList pokemonsList={sameDataNewReference} />);

    expect(screen.getByText('Pokemons count: 3')).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'bulbasaur' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'ivysaur' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'venusaur' })).toBeInTheDocument();
  });
});

describe('Pagination', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('Next button increments page in search params', () => {
    mockSearchParams.current = new URLSearchParams('page=1');
    render(<PokemonsList pokemonsList={singlePokemon} />);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(mockPush).toHaveBeenCalledWith('/?page=2');
  });

  it('Prev button decrements page when page > 1', () => {
    mockSearchParams.current = new URLSearchParams('page=3');
    render(<PokemonsList pokemonsList={singlePokemon} />);
    fireEvent.click(screen.getByRole('button', { name: 'Prev' }));
    expect(mockPush).toHaveBeenCalledWith('/?page=2');
  });

  it('Prev button does nothing when page is 1', () => {
    mockSearchParams.current = new URLSearchParams('page=1');
    render(<PokemonsList pokemonsList={singlePokemon} />);
    fireEvent.click(screen.getByRole('button', { name: 'Prev' }));
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('displays current page number', () => {
    mockSearchParams.current = new URLSearchParams('page=5');
    render(<PokemonsList pokemonsList={singlePokemon} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});

describe('Pokemon selection', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockSearchParams.current = new URLSearchParams();
    useStore.setState({ selectedPokemons: [] });
  });

  it('clicking pokemon name sets pokemonId in search params', () => {
    render(<PokemonsList pokemonsList={singlePokemon} />);
    fireEvent.click(screen.getByRole('button', { name: 'bulbasaur' }));
    expect(mockPush).toHaveBeenCalledWith('/?pokemonId=1');
  });

  it('checking checkbox adds pokemon to store', () => {
    render(<PokemonsList pokemonsList={singlePokemon} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(useStore.getState().selectedPokemons).toContain('bulbasaur');
  });

  it('unchecking checkbox removes pokemon from store', () => {
    useStore.setState({ selectedPokemons: ['bulbasaur'] });
    render(<PokemonsList pokemonsList={singlePokemon} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(useStore.getState().selectedPokemons).not.toContain('bulbasaur');
  });

  it('checkbox is checked when pokemon is in store', () => {
    useStore.setState({ selectedPokemons: ['bulbasaur'] });
    render(<PokemonsList pokemonsList={singlePokemon} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('checkbox is unchecked when pokemon is not in store', () => {
    render(<PokemonsList pokemonsList={singlePokemon} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });
});
