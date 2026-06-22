import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchForm from '../components/SearchForm';
import { IntlWrapper } from './test-utils';

vi.mock('../actions/search', () => ({
  searchAction: vi.fn(),
}));

const renderSearchForm = (searchQuery = '', locale = 'en') =>
  render(
    <IntlWrapper>
      <SearchForm searchQuery={searchQuery} locale={locale} />
    </IntlWrapper>
  );

describe('SearchForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without errors', () => {
    renderSearchForm();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('proper props handling', () => {
    renderSearchForm('pikachu');
    expect(screen.getByRole('textbox')).toHaveValue('pikachu');
  });

  it('search query can be updated by typing', async () => {
    const user = userEvent.setup();
    renderSearchForm();
    await user.type(screen.getByRole('textbox'), 'bulbasaur');
    expect(screen.getByRole('textbox')).toHaveValue('bulbasaur');
  });

  it('has a hidden locale input', () => {
    renderSearchForm('', 'ru');
    const hidden = document.querySelector(
      'input[name="locale"]'
    ) as HTMLInputElement;
    expect(hidden).toBeTruthy();
    expect(hidden.value).toBe('ru');
  });
});
