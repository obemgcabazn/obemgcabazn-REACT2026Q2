import { Component } from 'react';
import StorageHelper from './controller/StorageHelper.ts';
import SearchForm from './components/SearchForm.tsx';
import PokemonsList from './components/PokemonsList.tsx';
import OnePokemon from './components/OnePokemon.tsx';
import Spinner from './components/Spinner.tsx';
import ErrorHandler from './components/ErrorHandler.tsx';
import type { Pokemon } from 'pokeapi-typescript';

interface AppState {
  currentSearchQuery: string;
  loading: boolean;
  error: Error | null;
  result: PokemonInList[] | Pokemon | null;
}

interface PokemonInList {
  name: string;
  url: string;
}

export default class App extends Component<Record<string, never>, AppState> {
  state: AppState = {
    currentSearchQuery: StorageHelper.get('searchQuery') ?? '',
    loading: false,
    error: null,
    result: null,
  };

  componentDidMount() {
    if (!this.state.currentSearchQuery) {
      this.fetchAllPokemons();
    } else {
      this.fetchPokemonByName(this.state.currentSearchQuery);
    }
  }

  componentDidUpdate(_prevProps: Record<string, never>, prevState: AppState) {
    if (prevState.currentSearchQuery !== this.state.currentSearchQuery) {
      if (!this.state.currentSearchQuery) {
        this.fetchAllPokemons();
      } else {
        this.fetchPokemonByName(this.state.currentSearchQuery);
      }
    }
  }

  fetchAllPokemons = async () => {
    this.setState({ loading: true, error: null });
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?limit=10`
      );
      const data: { results: PokemonInList[] } = await response.json();
      if (data) {
        this.setState({ result: data.results });
      }
    } catch (err) {
      this.setState({
        error:
          err instanceof Error ? err : new Error('Error while loading data'),
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  fetchPokemonByName = async (name: string) => {
    this.setState({ loading: true });
    this.setState({ error: null });

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${name}/`
      );
      if (!response.ok) {
        throw new Error(String(response.status));
      }
      const data = await response.json();
      this.setState({ result: data });
    } catch (err) {
      this.setState({
        error:
          err instanceof Error ? err : new Error('Error while loading data'),
        result: null,
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  setSearchQuery = (searchQuery: string) => {
    this.setState({ currentSearchQuery: searchQuery });
  };

  bottomSection = () => {
    const { loading, error, result, currentSearchQuery } = this.state;

    if (loading) return <Spinner />;
    if (error) return <ErrorHandler errorData={error} />;

    if (currentSearchQuery && result && !Array.isArray(result)) {
      return <OnePokemon pokemon={result} />;
    }

    if (Array.isArray(result)) {
      return <PokemonsList pokemonsList={result} />;
    }
  };

  render() {
    return (
      <div className="container">
        <h1>Pokemon Searching App</h1>
        <SearchForm
          searchQuery={this.state.currentSearchQuery}
          onSearch={this.setSearchQuery}
        />
        {this.bottomSection()}
      </div>
    );
  }
}
