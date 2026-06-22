'use client';
import './pokemon-list.scss';
import React from 'react';
import useStore from '../store/Store';
import { Link } from '../i18n/navigation';
import { useTranslations } from 'next-intl';
import type { PokemonInList } from '../lib/pokemon';

interface PokemonsListProps {
  pokemonsList: PokemonInList[];
  currentPage: string;
  locale: string;
}

function PokemonsListComponent({
  pokemonsList,
  currentPage,
  locale,
}: PokemonsListProps) {
  const { selectedPokemons, togglePokemon } = useStore();
  const t = useTranslations('pokemonList');
  const page = Number(currentPage);

  return (
    <div className="pokemon-list">
      <div className="flex-aic-sb">
        <p className="pokemon-list__count">
          {t('count', { count: pokemonsList.length })}
        </p>
        <div className="pagination">
          {page > 1 ? (
            <Link
              href={`/?page=${page - 1}`}
              locale={locale}
              className="button__main"
            >
              {t('prev')}
            </Link>
          ) : (
            <span className="button__main" aria-disabled="true">
              {t('prev')}
            </span>
          )}
          <span className="button__main">{page}</span>
          <Link
            href={`/?page=${page + 1}`}
            locale={locale}
            className="button__main"
          >
            {t('next')}
          </Link>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {pokemonsList.map((pokemon, index) => {
            const pokemonId = new URL(pokemon.url).pathname
              .split('/')
              .filter(Boolean)
              .pop();
            return (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    className="pokemon-list-checkbox"
                    onChange={() => togglePokemon(pokemon.name)}
                    checked={selectedPokemons.includes(pokemon.name)}
                  />
                  <Link
                    href={`/?page=${currentPage}&pokemonId=${pokemonId}`}
                    locale={locale}
                    className="button__link"
                  >
                    {pokemon.name}
                  </Link>
                </td>
                <td>URL: {pokemon.url}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const PokemonsList = React.memo(
  PokemonsListComponent,
  (prevProps, nextProps) => {
    const prev = prevProps.pokemonsList;
    const next = nextProps.pokemonsList;
    if (prev === next && prevProps.currentPage === nextProps.currentPage)
      return true;
    if (prev.length !== next.length) return false;
    for (let i = 0; i < next.length; i++) {
      if (next[i].name !== prev[i].name || next[i].url !== prev[i].url)
        return false;
    }
    return prevProps.currentPage === nextProps.currentPage;
  }
);

export default PokemonsList;
