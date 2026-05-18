import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import PokemonsList from '../components/PokemonsList.tsx';

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

const singlePokemon = [
  { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
];

const multiplePokemon = [
  { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
  { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
];

describe('DOM tests PokemonList', () => {
  it('Empty Array', () => {
    renderWithRouter(<PokemonsList pokemonsList={[]} />);

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
    renderWithRouter(<PokemonsList pokemonsList={singlePokemon} />);
    expect(screen.getByText('Pokemons count: 1')).toBeInTheDocument();
  });

  it('Heading "Name" exists', () => {
    renderWithRouter(<PokemonsList pokemonsList={singlePokemon} />);

    expect(
      screen.getByRole('columnheader', { name: 'Name' })
    ).toBeInTheDocument();
  });

  it('Heading "Description" exists', () => {
    renderWithRouter(<PokemonsList pokemonsList={singlePokemon} />);

    expect(
      screen.getByRole('columnheader', { name: 'Description' })
    ).toBeInTheDocument();
  });

  it('Multiple Pokemons', () => {
    renderWithRouter(<PokemonsList pokemonsList={multiplePokemon} />);
    expect(screen.getByText('Pokemons count: 3')).toBeInTheDocument();
  });
});

describe('Render PokemonList', () => {
  it('Prevent to call render', () => {
    const { rerender } = render(
      <MemoryRouter>
        <PokemonsList pokemonsList={multiplePokemon} />
      </MemoryRouter>
    );

    rerender(
      <MemoryRouter>
        <PokemonsList pokemonsList={multiplePokemon} />
      </MemoryRouter>
    );

    expect(screen.getByText('Pokemons count: 3')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(4);
  });

  it('Length change', () => {
    const { rerender } = render(
      <MemoryRouter>
        <PokemonsList pokemonsList={multiplePokemon} />
      </MemoryRouter>
    );

    const longerList = [
      ...multiplePokemon,
      { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
    ];

    rerender(
      <MemoryRouter>
        <PokemonsList pokemonsList={longerList} />
      </MemoryRouter>
    );
    expect(screen.getByText('Pokemons count: 4')).toBeInTheDocument();
  });

  it('Name of item in object change for same length', () => {
    const { rerender } = render(
      <MemoryRouter>
        <PokemonsList pokemonsList={multiplePokemon} />
      </MemoryRouter>
    );

    const changedNameList = [
      { name: 'charmander', url: multiplePokemon[0].url },
      multiplePokemon[1],
    ];

    rerender(
      <MemoryRouter>
        <PokemonsList pokemonsList={changedNameList} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('cell', { name: 'charmander' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('cell', { name: 'bulbasaur' })
    ).not.toBeInTheDocument();
  });

  it('URL of item in object change for same length', () => {
    const { rerender } = render(
      <MemoryRouter>
        <PokemonsList pokemonsList={multiplePokemon} />
      </MemoryRouter>
    );

    const newUrl = 'https://pokeapi.co/api/v2/pokemon/999/';
    const changedUrlList = [
      { name: multiplePokemon[0].name, url: newUrl },
      multiplePokemon[1],
    ];

    rerender(
      <MemoryRouter>
        <PokemonsList pokemonsList={changedUrlList} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('cell', { name: `URL: ${newUrl}` })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('cell', { name: `URL: ${multiplePokemon[0].url}` })
    ).not.toBeInTheDocument();
  });

  it('Same data, but new array', () => {
    const { rerender } = render(
      <MemoryRouter>
        <PokemonsList pokemonsList={multiplePokemon} />
      </MemoryRouter>
    );

    const sameDataNewReference = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
    ];

    rerender(
      <MemoryRouter>
        <PokemonsList pokemonsList={sameDataNewReference} />
      </MemoryRouter>
    );

    expect(screen.getByText('Pokemons count: 3')).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'bulbasaur' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'ivysaur' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'venusaur' })).toBeInTheDocument();
  });
});
