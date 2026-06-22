import { fetchPokemonByName, fetchPokemonList } from '../../lib/pokemon';
import type { PokemonDetail, PokemonInList } from '../../lib/pokemon';
import SearchForm from '../../components/SearchForm';
import PokemonsList from '../../components/PokemonsList';
import OnePokemon from '../../components/OnePokemon';
import PokemonDetailsServer from '../../components/PokemonDetailsServer';
import ErrorHandler from '../../components/ErrorHandler';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    query?: string;
    pokemonId?: string;
  }>;
  params: Promise<{ locale: string }>;
}

export default async function Page({ searchParams, params }: PageProps) {
  const { page = '1', query = '', pokemonId } = await searchParams;
  const { locale } = await params;

  let pokemonList: PokemonInList[] | null = null;
  let searchResult: PokemonDetail | null = null;
  let error: string | null = null;

  try {
    if (query) {
      searchResult = await fetchPokemonByName(query);
    } else {
      pokemonList = await fetchPokemonList(page);
    }
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error';
  }

  return (
    <>
      <SearchForm searchQuery={query} locale={locale} />
      {error && <ErrorHandler errorMessage={error} />}
      {searchResult && <OnePokemon pokemon={searchResult} />}
      {pokemonList && (
        <div className="pokemon-list__wrapper">
          <PokemonsList
            pokemonsList={pokemonList}
            currentPage={page}
            locale={locale}
          />
          {pokemonId && (
            <PokemonDetailsServer
              pokemonId={pokemonId}
              currentPage={page}
              locale={locale}
            />
          )}
        </div>
      )}
    </>
  );
}
