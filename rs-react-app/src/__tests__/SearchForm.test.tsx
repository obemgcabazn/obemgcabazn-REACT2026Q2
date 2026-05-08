import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchForm from '../components/SearchForm.tsx';
import StorageHelper from '../controller/StorageHelper.ts';

vi.mock('./../controller/StorageHelper', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

vi.mock('./search-form.scss', () => ({}));

describe('SearchForm', () => {
  const defaultProps = {
    searchQuery: '',
    onSearch: vi.fn(),
  };

  const onSearchMock = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('render without errors', () => {
    render(<SearchForm {...defaultProps} />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('Proper props handling', () => {
    const searchQuery = 'pikachy';
    render(<SearchForm searchQuery={searchQuery} onSearch={vi.fn()} />);
    expect(screen.getByRole('textbox')).toHaveValue(searchQuery);
  });

  it('SearchQuery has been updated', async () => {
    const user = userEvent.setup();
    render(<SearchForm {...defaultProps} />);
    await user.type(screen.getByRole('textbox'), 'bulbasaur');
    expect(screen.getByRole('textbox')).toHaveValue('bulbasaur');
  });

  it('SearchQuery has been trimmed', async () => {
    const user = userEvent.setup();
    render(<SearchForm {...defaultProps} />);
    await user.type(screen.getByRole('textbox'), '  bulbasaur  ');
    expect(screen.getByRole('textbox')).toHaveValue('bulbasaur');
  });
  it('submit form value', async () => {
    const user = userEvent.setup();
    render(<SearchForm searchQuery="" onSearch={onSearchMock} />);

    await user.type(
      screen.getByPlaceholderText(/search request/i),
      'pikachu{Enter}'
    );

    expect(onSearchMock).toHaveBeenCalledWith('pikachu');
  });
});

describe('SearchForm - searchStart', () => {
  const onSearchMock = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('call event.preventDefault on submit', () => {
    render(<SearchForm searchQuery="" onSearch={onSearchMock} />);

    const form = screen
      .getByRole('button', { name: /search/i })
      .closest('form');

    if (!form) throw new Error('Form not found');

    const submitEvent = new Event('submit', {
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(submitEvent, 'preventDefault');

    form.dispatchEvent(submitEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('StorageHelper.set set value in storage', () => {
    render(<SearchForm searchQuery="pikachu" onSearch={onSearchMock} />);

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(StorageHelper.set).toHaveBeenCalledWith('searchQuery', 'pikachu');
  });
});
