import { Component } from "react";
import StorageHelper from "./controller/StorageHelper.ts";
import SearchForm from "./components/SearchForm.tsx";
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

    setSearchQuery = (searchQuery: string) => {
        this.setState({ currentSearchQuery: searchQuery });
    };

    bottomSection = () => {
        const { loading } = this.state;

        if (loading) return <Spinner />;
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