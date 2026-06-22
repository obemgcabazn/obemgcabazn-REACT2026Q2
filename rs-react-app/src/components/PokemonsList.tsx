'use client';
import './pokemon-list.scss';
import React from 'react';
import { useNextSearchParams } from '../hooks/useNextSearchParams.tsx';
import useStore from '../store/Store.tsx';

interface PokemonInList {
  name: string;
  url: string;
}

interface PokemonsListProps {
  pokemonsList: PokemonInList[];
}

function PokemonsListComponent(props: PokemonsListProps) {
  const [searchParams, setSearchParams] = useNextSearchParams();
  const { selectedPokemons, togglePokemon } = useStore();

  const nextPage = () => {
    const newPage = Number(searchParams.get('page')) + 1;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('page', String(newPage));
    setSearchParams(newParams);
  };
  const prevPage = () => {
    const page = Number(searchParams.get('page'));
    if (page > 1) {
      const newPage = page - 1;
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('page', String(newPage));
      setSearchParams(newParams);
    }
  };

  const handleSelectPokemon = (url: string) => {
    const pokemonId = new URL(url).pathname.split('/').filter(Boolean).pop();
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('pokemonId', String(pokemonId));
    setSearchParams(newParams);
  };

  return (
    <div className="pokemon-list">
      <div className="flex-aic-sb">
        <p className="pokemon-list__count">
          Pokemons count: {props.pokemonsList.length}
        </p>
        <div className="pagination">
          <button className="button__main" onClick={prevPage}>
            Prev
          </button>
          <span className="button__main">{searchParams.get('page')}</span>
          <button className="button__main" onClick={nextPage}>
            Next
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {props.pokemonsList.map((pokemon: PokemonInList, index: number) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  className="pokemon-list-checkbox"
                  onChange={() => togglePokemon(pokemon.name)}
                  checked={selectedPokemons.includes(pokemon.name)}
                />
                <button
                  className="button__link"
                  onClick={() => handleSelectPokemon(pokemon.url)}
                >
                  {pokemon.name}
                </button>
              </td>
              <td>URL: {pokemon.url}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const PokemonsList = React.memo(
  PokemonsListComponent,
  (prevProps, nextProps) => {
    const prev = prevProps.pokemonsList;
    const next = nextProps.pokemonsList;
    if (prev === next) return true;
    if (prev.length !== next.length) return false;
    for (let i = 0; i < next.length; i++) {
      if (next[i].name !== prev[i].name || next[i].url !== prev[i].url)
        return false;
    }
    return true;
  }
);

export default PokemonsList;
