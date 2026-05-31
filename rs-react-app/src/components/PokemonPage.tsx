import useLocalStorage from '../hooks/useLocalStorage.tsx';
import SearchForm from './SearchForm.tsx';
import PokemonsList from './PokemonsList.tsx';
import Spinner from './Spinner.tsx';
import ErrorHandler from './ErrorHandler.tsx';
import { Outlet, useSearchParams } from 'react-router';
import OnePokemon from './OnePokemon.tsx';
import { useQuery } from '@tanstack/react-query';
import type { Pokemon } from 'pokeapi-typescript';

interface PokemonInList {
  name: string;
  url: string;
}

const PAGE_SIZE = 10;
const fetchList = async (
  offset: number,
  name?: string
): Promise<Pokemon | PokemonInList[]> => {
  if (name) {
    const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);
    if (!resp.ok) {
      throw new Error(String(resp.status));
    }
    return resp.json() as Promise<Pokemon>;
  }
  const resp = await fetch(
    `https://pokeapi.co/api/v2/pokemon/?limit=${PAGE_SIZE}&offset=${offset}`
  );
  const results: { results: PokemonInList[] } = await resp.json();
  return results.results;
};

const PokemonPage = () => {
  const [searchQuery, setSearchQuery] = useLocalStorage<string>(
    'searchQuery',
    ''
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get('page');
  if (!page) {
    setSearchParams({ page: '1' });
  }
  const pokemonId = searchParams.get('pokemonId');

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ['list', page, searchQuery],
    queryFn: () => fetchList(Number(page), searchQuery),
    retry: false,
  });

  const bottomSection = () => {
    if (isLoading) return <Spinner />;
    if (isError) return <ErrorHandler errorData={error} />;
    if (Array.isArray(data)) {
      return (
        <div className="pokemon-list__wrapper">
          <PokemonsList pokemonsList={data} />
          {pokemonId && <Outlet />}
        </div>
      );
    }
    if (searchQuery && data && !Array.isArray(data)) {
      return <OnePokemon pokemon={data} />;
    }
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    newParams.delete('pokemonId');
    setSearchParams(newParams);
  };

  return (
    <>
      <SearchForm searchQuery={searchQuery} onSearch={handleSearch} />
      {bottomSection()}
    </>
  );
};

export default PokemonPage;
