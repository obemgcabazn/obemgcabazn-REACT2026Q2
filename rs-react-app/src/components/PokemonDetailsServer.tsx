import Image from 'next/image';
import { fetchPokemonByName } from '../lib/pokemon';
import { getTranslations } from 'next-intl/server';
import PokemonDetailsClose from './PokemonDetailsClose';
import './pokemon-details.scss';

interface Props {
  pokemonId: string;
  currentPage: string;
  locale: string;
}

export default async function PokemonDetailsServer({
  pokemonId,
  currentPage,
  locale,
}: Props) {
  const t = await getTranslations('details');

  let data;
  try {
    data = await fetchPokemonByName(pokemonId);
  } catch {
    return null;
  }

  const official = data.sprites.other?.['official-artwork']?.front_default;
  const imageUrl = official || data.sprites.front_default || '';

  const name = data.name[0].toUpperCase() + data.name.slice(1);

  return (
    <div className="pokemon-details__wrapper">
      <PokemonDetailsClose currentPage={currentPage} locale={locale} />
      <div className="pokemon-details">
        <div className="pokemon-details__header">
          <h3>
            <span className="pokemon-card__id">
              #{data.id.toString().padStart(3, '0')}
            </span>{' '}
            {t('pokemon', { name })}
          </h3>
        </div>

        <div className="pokemon-card__image-container">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={data.name}
              className="pokemon-card__image"
              width={200}
              height={200}
            />
          ) : (
            <div className="pokemon-card__no-image">{t('noImage')}</div>
          )}
        </div>

        <div className="pokemon-card__info">
          <div className="pokemon-card__types">
            {data.types.map((typeSlot, index) => (
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
              <span className="detail-label">{t('height')}:</span>
              <span className="detail-value">{data.height}</span>
            </div>
            <div className="pokemon-card__detail">
              <span className="detail-label">{t('weight')}:</span>
              <span className="detail-value">{data.weight}</span>
            </div>
          </div>

          {data.base_experience && (
            <div className="pokemon-card__experience">
              {t('baseExp')}: <strong>{data.base_experience}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
