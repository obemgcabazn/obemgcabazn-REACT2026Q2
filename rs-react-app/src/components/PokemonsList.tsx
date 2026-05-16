import './pokemon-list.scss';
import React from 'react';

interface PokemonInList {
  name: string;
  url: string;
}

interface PokemonsListProps {
  pokemonsList: PokemonInList[];
}

function PokemonsListComponent(props: PokemonsListProps) {
  return (
    <div className="pokemon-list">
      <p className="pokemon-list__count">
        Pokemons count: {props.pokemonsList.length}
      </p>
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
              <td>{pokemon.name}</td>
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
