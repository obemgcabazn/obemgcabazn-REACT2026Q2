import './search-form.scss';
import React, { Component } from 'react';
import StorageHelper from '../controller/StorageHelper.ts';

interface SearchProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

interface SearchState {
  searchQuery: string;
}

export default class SearchForm extends Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);

    this.state = {
      searchQuery: props.searchQuery,
    };
  }

  shouldComponentUpdate(
    nextProps: Readonly<SearchProps>,
    nextState: Readonly<SearchState>
  ): boolean {
    return (
      nextProps.searchQuery !== this.props.searchQuery ||
      nextProps.onSearch !== this.props.onSearch ||
      nextState.searchQuery !== this.state.searchQuery
    );
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newSearchQuery = event.target.value.trim();
    if (newSearchQuery !== this.state.searchQuery) {
      this.setState({ searchQuery: newSearchQuery });
    }
  };

  searchStart = (event: React.SubmitEvent) => {
    event.preventDefault();
    StorageHelper.set('searchQuery', this.state.searchQuery);
    this.props.onSearch(this.state.searchQuery);
  };

  render() {
    return (
      <form className="search__form" onSubmit={this.searchStart}>
        <input
          type="text"
          name="search-input"
          placeholder="Search request"
          value={this.state.searchQuery}
          onChange={this.handleInputChange}
          className="search__input"
        />
        <button className="search__button" type="submit">
          Search
        </button>
      </form>
    );
  }
}
