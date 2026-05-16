import { useEffect, useState } from 'react';
import StorageHelper from './controller/StorageHelper.ts';
import SearchForm from './components/SearchForm.tsx';
import PokemonsList from './components/PokemonsList.tsx';
import OnePokemon from './components/OnePokemon.tsx';
import Spinner from './components/Spinner.tsx';
import ErrorHandler from './components/ErrorHandler.tsx';
import TestError from './components/TestError.tsx';
import type { Pokemon } from 'pokeapi-typescript';

interface PokemonInList {
  name: string;
  url: string;
}

const App = () => {
  const savedQuery = StorageHelper.get<string>('searchQuery') ?? '';
  const [searchQuery, setSearchQuery] = useState(savedQuery);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PokemonInList[] | Pokemon | null>(null);

  useEffect(() => {
    if (searchQuery) {
      fetchPokemonByName(searchQuery.toString());
    } else {
      fetchAllPokemons();
    }
  }, [savedQuery]);

  const fetchAllPokemons = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?limit=10`
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
    if (searchQuery && result && !Array.isArray(result)) {
      return <OnePokemon pokemon={result} />;
    }

    if (Array.isArray(result)) {
      return <PokemonsList pokemonsList={result} />;
    }
  };
  return (
    <div className="container">
      <div className="flex-aic-sb">
        <h1>Pokemon Searching App</h1>
        <TestError />
      </div>
      <SearchForm searchQuery={searchQuery} onSearch={setSearchQuery} />
      {bottomSection()}
    </div>
  );
};

export default App;
