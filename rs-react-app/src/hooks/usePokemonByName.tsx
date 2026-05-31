import type { Pokemon } from 'pokeapi-typescript';
import { useQuery } from '@tanstack/react-query';

const fetchPokemonByName = async (name: string): Promise<Pokemon> => {
  const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);
  if (!resp.ok) {
    throw new Error(String(resp.status));
  }
  return resp.json() as Promise<Pokemon>;
};

export const usePokemonByName = (name: string) =>
  useQuery({
    queryKey: ['pokemon-name', name],
    queryFn: () => fetchPokemonByName(name),
    retry: false,
    enabled: !!name,
  });
