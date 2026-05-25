import { create } from 'zustand';

interface PokemonState {
  selectedPokemons: string[];
  togglePokemon: (name: string) => void;
  clearPokemons: () => void;
}

const useStore = create<PokemonState>((set) => ({
  selectedPokemons: [],
  clearPokemons: () => set({ selectedPokemons: [] }),
  togglePokemon: (name) =>
    set((state) => {
      if (state.selectedPokemons.includes(name)) {
        return {
          selectedPokemons: state.selectedPokemons.filter((p) => p !== name),
        };
      }
      return {
        selectedPokemons: [...state.selectedPokemons, name],
      };
    }),
}));

export default useStore;
