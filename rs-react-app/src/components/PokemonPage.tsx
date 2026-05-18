import { useEffect, useState } from 'react';
import StorageHelper from '../controller/StorageHelper.ts';
import SearchForm from './SearchForm.tsx';
import PokemonsList from './PokemonsList.tsx';
import Spinner from './Spinner.tsx';
import ErrorHandler from './ErrorHandler.tsx';
import type { Pokemon } from 'pokeapi-typescript';
import { Outlet, useSearchParams } from 'react-router';
import OnePokemon from './OnePokemon.tsx';

interface PokemonInList {
  name: string;
  url: string;
}

const PokemonPage = () => {
  const savedQuery = StorageHelper.get<string>('searchQuery') ?? '';
  const [searchQuery, setSearchQuery] = useState(savedQuery);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PokemonInList[] | Pokemon | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get('page');
  const pokemonId = searchParams.get('pokemonId');

  useEffect(() => {
    if (!page) {
      setSearchParams({ page: '1' });
      return;
    }
    if (searchQuery) {
      fetchPokemonByName(searchQuery.toString());
    } else {
      fetchAllPokemons(Number(page));
    }
  }, [savedQuery, page]);

  const fetchAllPokemons = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    const PAGE_SIZE = 10;

    try {
      const offset = (page - 1) * PAGE_SIZE;
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?limit=${PAGE_SIZE}&offset=${offset}`
      );
      const data: { results: PokemonInList[] } = await response.json();
      if (data) {
        setResult(data.results);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Error while loading data')
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPokemonByName = async (name: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${name}/`
      );
      if (!response.ok) {
        throw new Error(String(response.status));
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Error while loading data')
      );
    } finally {
      setLoading(false);
    }
  };

  const bottomSection = () => {
    if (loading) return <Spinner />;
    if (error) return <ErrorHandler errorData={error} />;
    if (Array.isArray(result)) {
      return (
        <div className="pokemon-list__wrapper">
          <PokemonsList pokemonsList={result} />
          {pokemonId && <Outlet />}
        </div>
      );
    }
    if (searchQuery && result && !Array.isArray(result)) {
      return <OnePokemon pokemon={result} />;
    }
  };
  return (
    <>
      <SearchForm searchQuery={searchQuery} onSearch={setSearchQuery} />
      {bottomSection()}
    </>
  );
};

export default PokemonPage;
