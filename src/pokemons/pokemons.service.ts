/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/schemas/Pokemon.schema';
import { Model } from 'mongoose';
import { CreatePokemonDto } from './dto/CreatePokemon.dto';
import axios from 'axios';

@Injectable()
export class PokemonsService {
  constructor(
    @InjectModel(Pokemon.name) private pokemonModel: Model<Pokemon>,
  ) {}

  async createPokemon(createPokemonDto: CreatePokemonDto) {
    const newPokemon = new this.pokemonModel(createPokemonDto);
    return newPokemon.save();
  }

  getPokemons() {
    return this.pokemonModel.find();
  }

  async getPokemonById(pokeId: number) {
    return this.pokemonModel.findOne({ pokeId });
  }

  async updatePokemon(
    pokeId: number,
    updatePokemonDto: Partial<CreatePokemonDto>,
  ) {
    return this.pokemonModel.findOneAndUpdate({ pokeId }, updatePokemonDto, {
      new: true,
    });
  }

  async deletePokemon(pokeId: number) {
    return this.pokemonModel.findOneAndDelete({ pokeId });
  }

  async fetchPokemons(limit = 25) {
    try {
      const pokemonIds = Array.from({ length: limit }, (_, i) => i + 1); 

      // Fetch data secara paralel untuk semua Pokemon
      const pokemonData = await Promise.all(
        pokemonIds.map(async (pokeId) => {
          const { data } = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${pokeId}`,
          );

          return {
            pokeId: data.id,
            name: data.name,
            image: data.sprites.other['official-artwork'].front_default,
            types: data.types.map((t) => t.type.name),
            height: `${data.height / 10}m`,
            weight: `${data.weight / 10}kg`,
            abilities: data.abilities.map((a) => a.ability.name),
            experience: data.base_experience,
            moves: data.moves
              .slice(0, 5)
              .map((m) => ({ move: { name: m.move.name } })),
            stats: data.stats.map((s) => ({
              stat: { name: s.stat.name },
              base_stat: s.base_stat,
            })),
            averageStats: (
              data.stats.reduce((acc, s) => acc + s.base_stat, 0) /
              data.stats.length
            ).toFixed(2),
            caught: false,
          };
        }),
      );

      // Simpan ke database dalam satu operasi batch
      await this.pokemonModel.insertMany(pokemonData);
      return { message: `${limit} Pokémons berhasil disimpan.` };
    } catch (error) {
      console.error('Error fetching multiple Pokémon:', error.message);
      throw error;
    }
  }
  async getCaughtCount(): Promise<number> {
    const count = await this.pokemonModel.countDocuments({ caught: true });
    return count;
  }
  async getCaughtPokemons() {
    return this.pokemonModel.find({ caught: true }).exec();
  }
}
