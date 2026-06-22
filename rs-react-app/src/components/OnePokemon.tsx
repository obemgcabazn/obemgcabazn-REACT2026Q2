import './one-pokemon.scss';
import Image from 'next/image';
import type { PokemonDetail } from '../lib/pokemon';

interface OnePokemonProps {
  pokemon: PokemonDetail;
}

const OnePokemon = ({ pokemon }: OnePokemonProps) => {
  const official = pokemon.sprites.other?.['official-artwork']?.front_default;
  const imageUrl = official || pokemon.sprites.front_default || '';

  return (
    <div className="pokemon-card">
      <div className="pokemon-card__image-container">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={pokemon.name}
            className="pokemon-card__image"
            width={200}
            height={200}
          />
        ) : (
          <div className="pokemon-card__no-image">No image</div>
        )}
      </div>

      <div className="pokemon-card__info">
        <div className="pokemon-card__header">
          <span className="pokemon-card__id">
            #{pokemon.id.toString().padStart(3, '0')}
          </span>
          <h3 className="pokemon-card__name">{pokemon.name}</h3>
        </div>

        <div className="pokemon-card__types">
          {pokemon.types.map((typeSlot, index) => (
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
            <span className="detail-value">{pokemon.height}</span>
          </div>
          <div className="pokemon-card__detail">
            <span className="detail-label">Weight:</span>
            <span className="detail-value">{pokemon.weight}</span>
          </div>
        </div>

        {pokemon.base_experience && (
          <div className="pokemon-card__experience">
            Base Exp: <strong>{pokemon.base_experience}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnePokemon;
