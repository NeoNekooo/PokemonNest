import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonsService } from './pokemons.service';
import { PokemonsController } from './pokemons.controller';
import { Pokemon, PokemonSchema } from 'src/schemas/Pokemon.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pokemon.name, schema: PokemonSchema }]),
  ],
  controllers: [PokemonsController],
  providers: [PokemonsService],
})
export class PokemonModule implements OnModuleInit {
  onModuleInit() {
    console.log('✅ PokemonModule successfully initialized!');
  }
}
