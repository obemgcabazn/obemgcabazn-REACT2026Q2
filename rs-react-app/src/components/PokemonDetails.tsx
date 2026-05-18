import './pokemon-details.scss';
import { useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import type { Pokemon } from 'pokeapi-typescript';
import Spinner from './Spinner.tsx';
import ErrorHandler from './ErrorHandler.tsx';
import close from '../assets/close.svg';

export const PokemonDetails = () => {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Pokemon | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const pokemonId = searchParams.get('pokemonId');

  useEffect(() => {
    fetchPokemonById(Number(pokemonId));
  }, [pokemonId]);

  const fetchPokemonById = async (pokemonId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`
      );
      if (!response.ok) {
        throw new Error(String(response.status));
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Error while loading data')
      );
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (): string => {
    if (result !== null) {
      const official =
        result.sprites.other?.['official-artwork']?.front_default;
      if (official) return official;
      return result.sprites.front_default || '';
    } else {
      return '';
    }
  };

  if (error) return <ErrorHandler errorData={error} />;

  const firstLetterUppercase = (title: string | undefined) => {
    if (title == null) return '';
    return title[0].toUpperCase() + title.slice(1);
  };

  const closeDetails = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('pokemonId');
    setSearchParams(newParams);
  };

  return (
    <div className="pokemon-details__wrapper">
      <div className="overlay" onClick={closeDetails}></div>
      <div className="pokemon-details">
        {loading && <Spinner />}
        {!loading && (
          <>
            <button
              className="button__main pokemon-details__close-button"
              onClick={closeDetails}
            >
              <img src={close} alt="" /> Close
            </button>
            <div className="pokemon-details__header">
              <h3>
                <span className="pokemon-card__id">
                  #{result?.id.toString().padStart(3, '0')}
                </span>{' '}
                Pokemon {firstLetterUppercase(result?.name)}
              </h3>
            </div>

            <div className="pokemon-card__image-container">
              {getImageUrl() ? (
                <img
                  src={getImageUrl()}
                  alt={result?.name}
                  className="pokemon-card__image"
                  loading="lazy"
                />
              ) : (
                <div className="pokemon-card__no-image">No image</div>
              )}
            </div>

            <div className="pokemon-card__info">
              <div className="pokemon-card__types">
                {result?.types.map((typeSlot, index) => (
                  <span
                    key={index}
                    className={`pokemon-type pokemon-type--${typeSlot.type.name}`}
                  >
                    {typeSlot.type.name}
                  </span>
                ))}
              </div>

              <div className="pokemon-card__details">
                <div className="pokemon-card__detail">
                  <span className="detail-label">Height:</span>
                  <span className="detail-value">{result?.height}</span>
                </div>
                <div className="pokemon-card__detail">
                  <span className="detail-label">Weight:</span>
                  <span className="detail-value">{result?.weight}</span>
                </div>
              </div>

              {result?.base_experience && (
                <div className="pokemon-card__experience">
                  Base Exp: <strong>{result?.base_experience}</strong>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
