import { describe, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PokemonsList from '../components/PokemonsList.tsx';

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

  it('Single Pokemon', () => {
    render(<PokemonsList pokemonsList={multiplePokemon} />);
    expect(screen.getByText('Pokemons count: 3')).toBeInTheDocument();
  });
});

function renderWithRef(pokemonsList: { name: string; url: string }[]) {
  let instance: PokemonsList | null = null;

  const { rerender } = render(
    <PokemonsList
      ref={(el) => {
        instance = el;
      }}
      pokemonsList={pokemonsList}
    />
  );

  return { rerender, getInstance: () => instance };
}

describe('Render PokemonList', () => {
  it('Prevent to call render', () => {
    const { rerender, getInstance } = renderWithRef(multiplePokemon);

    const instance = getInstance();
    if (!instance) throw new Error('instance is null');
    const renderSpy = vi.spyOn(instance, 'render');

    rerender(<PokemonsList ref={() => {}} pokemonsList={multiplePokemon} />);

    expect(renderSpy).not.toHaveBeenCalled();
  });

  it('Length change', () => {
    const { rerender, getInstance } = renderWithRef(multiplePokemon);

    const instance = getInstance();
    if (!instance) throw new Error('instance is null');
    const renderSpy = vi.spyOn(instance, 'render');

    const longerList = [
      ...multiplePokemon,
      { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
    ];

    rerender(<PokemonsList ref={() => {}} pokemonsList={longerList} />);
    expect(renderSpy).toHaveBeenCalledOnce();
  });

  it('Name of item in object change for same length', () => {
    const { rerender, getInstance } = renderWithRef(multiplePokemon);

    const instance = getInstance();
    if (!instance) throw new Error('instance is null');
    const renderSpy = vi.spyOn(instance, 'render');

    const changedNameList = [
      { name: 'charmander', url: multiplePokemon[0].url },
      multiplePokemon[1],
    ];

    rerender(<PokemonsList ref={() => {}} pokemonsList={changedNameList} />);

    expect(renderSpy).toHaveBeenCalledOnce();
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

  it('Same data, but new arrau', () => {
    const { rerender, getInstance } = renderWithRef(multiplePokemon);

    const instance = getInstance();
    if (!instance) throw new Error('instance is null');
    const renderSpy = vi.spyOn(instance, 'render');

    const sameDataNewReference = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
    ];

    rerender(
      <PokemonsList ref={() => {}} pokemonsList={sameDataNewReference} />
    );

    expect(renderSpy).not.toHaveBeenCalled();
  });
});
