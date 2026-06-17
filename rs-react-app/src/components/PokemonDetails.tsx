import './pokemon-details.scss';
import { useSearchParams } from 'react-router';
import Spinner from './Spinner.tsx';
import ErrorHandler from './ErrorHandler.tsx';
import close from '../assets/close.svg';
import { usePokemonByName } from '../hooks/usePokemonByName.tsx';

export const PokemonDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pokemonId = searchParams.get('pokemonId');

  const { data, isLoading, isError, error } = usePokemonByName(
    String(pokemonId)
  );

  const getImageUrl = (): string => {
    if (data) {
      const official = data.sprites.other?.['official-artwork']?.front_default;
      if (official) return official;
      return data.sprites.front_default || '';
    } else {
      return '';
    }
  };

  if (isError) return <ErrorHandler errorData={error} />;

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
        {isLoading && <Spinner />}
        {!isLoading && (
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
                  #{data?.id.toString().padStart(3, '0')}
                </span>{' '}
                Pokemon {firstLetterUppercase(data?.name)}
              </h3>
            </div>

            <div className="pokemon-card__image-container">
              {getImageUrl() ? (
                <img
                  src={getImageUrl()}
                  alt={data?.name}
                  className="pokemon-card__image"
                  loading="lazy"
                />
              ) : (
                <div className="pokemon-card__no-image">No image</div>
              )}
            </div>

            <div className="pokemon-card__info">
              <div className="pokemon-card__types">
                {data?.types.map((typeSlot, index) => (
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
                  <span className="detail-value">{data?.height}</span>
                </div>
                <div className="pokemon-card__detail">
                  <span className="detail-label">Weight:</span>
                  <span className="detail-value">{data?.weight}</span>
                </div>
              </div>

              {data?.base_experience && (
                <div className="pokemon-card__experience">
                  Base Exp: <strong>{data?.base_experience}</strong>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
