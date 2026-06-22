'use client';
import './search-form.scss';
import { useActionState } from 'react';
import { searchAction } from '../actions/search';
import { useTranslations } from 'next-intl';

interface SearchProps {
  searchQuery: string;
  locale: string;
}

const SearchForm = ({ searchQuery, locale }: SearchProps) => {
  const t = useTranslations('search');
  const [, formAction, isPending] = useActionState(searchAction, searchQuery);

  return (
    <form className="search__form" action={formAction}>
      <input type="hidden" name="locale" value={locale} />
      <input
        type="text"
        id="search-input"
        name="query"
        placeholder={t('placeholder')}
        defaultValue={searchQuery}
        className="search__input"
      />
      <button className="search__button" type="submit" disabled={isPending}>
        {t('button')}
      </button>
    </form>
  );
};

export default SearchForm;
