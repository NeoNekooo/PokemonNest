import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from 'src/schemas/Pokemon.schema';
import { PokemonsService } from './pokemons.service';
import { PokemonsController } from './pokemons.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonSchema,
      },
    ]),
  ],
  providers: [PokemonsService],
  controllers: [PokemonsController],
})
export class PokemonModule {}
