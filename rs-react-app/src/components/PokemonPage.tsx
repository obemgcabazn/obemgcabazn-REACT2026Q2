'use client';
import useLocalStorage from '../hooks/useLocalStorage.tsx';
import SearchForm from './SearchForm.tsx';
import PokemonsList from './PokemonsList.tsx';
import Spinner from './Spinner.tsx';
import ErrorHandler from './ErrorHandler.tsx';
import OnePokemon from './OnePokemon.tsx';
import { PokemonDetails } from './PokemonDetails.tsx';
import { usePokemonList } from '../hooks/usePokemonList.tsx';
import { usePokemonByName } from '../hooks/usePokemonByName.tsx';
import { useNextSearchParams } from '../hooks/useNextSearchParams.tsx';

const PokemonPage = () => {
  const [searchQuery, setSearchQuery] = useLocalStorage<string>(
    'searchQuery',
    ''
  );
  const [searchParams, setSearchParams] = useNextSearchParams();

  const page = searchParams.get('page') || '1';
  const pokemonId = searchParams.get('pokemonId');

  const {
    data: list,
    isLoading: listLoading,
    isError: listError,
    error: listErr,
  } = usePokemonList(page, !searchQuery);

  const {
    data: pokemon,
    isLoading: searchLoading,
    isError: searchError,
    error: searchErr,
  } = usePokemonByName(searchQuery);

  const isLoading = searchQuery ? searchLoading : listLoading;
  const isError = searchQuery ? searchError : listError;
  const error = searchQuery ? searchErr : listErr;

  const bottomSection = () => {
    if (isLoading) return <Spinner />;
    if (isError && error) return <ErrorHandler errorData={error} />;
    if (searchQuery && pokemon) {
      return <OnePokemon pokemon={pokemon} />;
    }
    if (list) {
      return (
        <div className="pokemon-list__wrapper">
          <PokemonsList pokemonsList={list} />
          {pokemonId && <PokemonDetails />}
        </div>
      );
    }
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const newParams = new URLSearchParams(searchParams.toString());
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
