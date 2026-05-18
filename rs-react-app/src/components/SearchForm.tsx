import './search-form.scss';
import React, { useState } from 'react';

interface SearchProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

const SearchForm = ({ searchQuery, onSearch }: SearchProps) => {
  const [search, setSearch] = useState(searchQuery);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newSearchQuery = event.target.value.trim();
    setSearch(newSearchQuery);
  };

  const searchStart = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(search);
  };

  return (
    <form className="search__form" onSubmit={searchStart}>
      <input
        type="text"
        id="search-input"
        name="search-input"
        placeholder="Search request"
        value={search}
        onChange={handleInputChange}
        className="search__input"
      />
      <button className="search__button" type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchForm;
