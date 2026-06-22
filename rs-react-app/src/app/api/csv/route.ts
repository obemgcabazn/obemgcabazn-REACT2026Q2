import { NextRequest, NextResponse } from 'next/server';

interface PokemonApiResponse {
  name: string;
  id: number;
  types: { type: { name: string } }[];
  species: { url: string };
  height: number;
  weight: number;
  base_experience: number;
}

export async function POST(request: NextRequest) {
  const { pokemons } = (await request.json()) as { pokemons: string[] };

  const responses = await Promise.all(
    pokemons.map((name) => fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`))
  );
  const data: PokemonApiResponse[] = await Promise.all(
    responses.map((r) => r.json())
  );

  const header = 'name,id,types,details URL,height,weight,base_experience';
  const rows = data.map((pokemon) => {
    const types = pokemon.types.map((t) => t.type.name).join(' | ');
    return [
      pokemon.name,
      pokemon.id,
      `"${types}"`,
      pokemon.species.url,
      pokemon.height,
      pokemon.weight,
      pokemon.base_experience,
    ].join(',');
  });
  const csv = [header, ...rows].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${pokemons.length}_items.csv"`,
    },
  });
}
