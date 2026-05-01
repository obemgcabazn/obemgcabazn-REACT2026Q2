import './pokemon-list.scss';
import { Component } from 'react';

interface PokemonInList {
  name: string;
  url: string;
}

interface PokemonsListProps {
  pokemonsList: PokemonInList[];
}

export default class PokemonsList extends Component<PokemonsListProps> {
  render() {
    return (
      <div className="pokemon-list">
        <p className="pokemon-list__count">
          Pokemons count: {this.props.pokemonsList.length}
        </p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {this.props.pokemonsList.map(
              (pokemon: PokemonInList, index: number) => (
                <tr key={index}>
                  <td>{pokemon.name}</td>
                  <td>URL: {pokemon.url}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    );
  }
}
