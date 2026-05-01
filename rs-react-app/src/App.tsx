import { Component } from "react";
import StorageHelper from "./controller/StorageHelper.ts";
import SearchForm from "./components/SearchForm.tsx";
import PokemonsList from "./components/PokemonsList.tsx";
import Spinner from "./components/Spinner.tsx";
import type { Pokemon } from "pokeapi-typescript";

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
        }
    }

    componentDidUpdate(_prevProps: Record<string, never>, prevState: AppState) {
        if (prevState.currentSearchQuery !== this.state.currentSearchQuery) {
            if (!this.state.currentSearchQuery) {
                this.fetchAllPokemons();
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


    setSearchQuery = (searchQuery: string) => {
        this.setState({ currentSearchQuery: searchQuery });
    };

    bottomSection = () => {
        const { loading, result } = this.state;

        if (loading) return <Spinner />;

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