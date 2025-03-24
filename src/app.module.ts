import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonModule } from './pokemons/pokemons.module';
import * as dotenv from 'dotenv';
dotenv.config();
console.log('this is in app module', process.env.MONGO_URL); // Debugging

@Module({
  imports: [
    MongooseModule.forRoot(
      (process.env.MONGO_URL as string) || 'mongodb://localhost:27017/',
      {},
    ),
    PokemonModule,
  ],
})
export class AppModule {}
