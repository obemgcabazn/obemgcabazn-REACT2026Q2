import { describe, it, expect, beforeEach } from 'vitest';
import useStore from '../store/Store.tsx';

beforeEach(() => {
  useStore.setState({ selectedPokemons: [] });
});

describe('store', () => {
  it('has empty selectedPokemons initially', () => {
    expect(useStore.getState().selectedPokemons).toEqual([]);
  });

  it('togglePokemon adds a pokemon', () => {
    useStore.getState().togglePokemon('pikachu');
    expect(useStore.getState().selectedPokemons).toEqual(['pikachu']);
  });

  it('togglePokemon removes a pokemon that is already selected', () => {
    useStore.getState().togglePokemon('pikachu');
    useStore.getState().togglePokemon('pikachu');
    expect(useStore.getState().selectedPokemons).toEqual([]);
  });

  it('togglePokemon can add multiple pokemons', () => {
    useStore.getState().togglePokemon('pikachu');
    useStore.getState().togglePokemon('bulbasaur');
    expect(useStore.getState().selectedPokemons).toEqual([
      'pikachu',
      'bulbasaur',
    ]);
  });

  it('togglePokemon removes only the targeted pokemon', () => {
    useStore.getState().togglePokemon('pikachu');
    useStore.getState().togglePokemon('bulbasaur');
    useStore.getState().togglePokemon('pikachu');
    expect(useStore.getState().selectedPokemons).toEqual(['bulbasaur']);
  });

  it('clearPokemons empties the list', () => {
    useStore.getState().togglePokemon('pikachu');
    useStore.getState().togglePokemon('bulbasaur');
    useStore.getState().clearPokemons();
    expect(useStore.getState().selectedPokemons).toEqual([]);
  });

  it('clearPokemons on empty list stays empty', () => {
    useStore.getState().clearPokemons();
    expect(useStore.getState().selectedPokemons).toEqual([]);
  });
});
