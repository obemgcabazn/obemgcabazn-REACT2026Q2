import { useQuery } from '@tanstack/react-query';

const PAGE_SIZE = 10;

interface PokemonInList {
  name: string;
  url: string;
}

const fetchList = async (offset: number): Promise<PokemonInList[]> => {
  const resp = await fetch(
    `https://pokeapi.co/api/v2/pokemon/?limit=${PAGE_SIZE}&offset=${offset}`
  );
  const results: { results: PokemonInList[] } = await resp.json();
  return results.results;
};

export const usePokemonList = (page: string | null, enabled = true) =>
  useQuery({
    queryKey: ['list', page],
    queryFn: () => fetchList(Number(page)),
    retry: false,
    enabled,
  });
