/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/schemas/Pokemon.schema';
import { CreatePokemonDto } from './dto/CreatePokemon.dto';
import { UpdatePokemonDto } from './dto/UpdatePokemon.dto';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';

interface PokemonAPIResponse {
  id: number;
  name: string;
  sprites: { other: { ['official-artwork']: { front_default: string } } };
  types: { type: { name: string } }[];
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
  base_experience: number;
  moves: { move: { name: string } }[];
  stats: { stat: { name: string }; base_stat: number }[];
}

@Injectable()
export class PokemonsService {
  constructor(@InjectModel(Pokemon.name) private pokemonModel: Model<Pokemon>) {}

  @Cron(CronExpression.EVERY_HOUR)
  async fetchPokemonsAutomatically() {
    console.log('🔄 [Cron] Fetching Pokémon automatically...');
    try {
      await this.fetchPokemons(50);
      console.log('✅ [Cron] Pokémon berhasil di-fetch otomatis');
    } catch (error) {
      console.error('❌ [Cron] Error fetching Pokémon:', error);
    }
  }

  async fetchPokemons(limit = 25) {
    try {
      const pokemonIds = Array.from({ length: limit }, (_, i) => i + 1);
      const pokemonData = await Promise.all(
        pokemonIds.map(async (pokeId) => {
          const { data } = await axios.get<PokemonAPIResponse>(
            `https://pokeapi.co/api/v2/pokemon/${pokeId}`
          );
          return {
            pokeId: data.id,
            name: data.name,
            image: data.sprites?.other?.['official-artwork']?.front_default || '',
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
      await Promise.all(
        pokemonData.map(async (pokemon) => {
          await this.pokemonModel.updateOne(
            { pokeId: pokemon.pokeId },
            { $set: pokemon },
            { upsert: true },
          );
        })
      );
      return { message: `${limit} Pokémon berhasil disimpan.` };
    } catch (error) {
      console.error('❌ Error fetching Pokémon:', error);
      throw error;
    }
  }

  async createPokemon(createPokemonDto: CreatePokemonDto) {
    const newPokemon = new this.pokemonModel(createPokemonDto);
    return newPokemon.save();
  }

  async getPokemons() {
    return this.pokemonModel.find();
  }

  async getCaughtCount() {
    return this.pokemonModel.countDocuments({ caught: true });
  }

  async getCaughtPokemons() {
    return this.pokemonModel.find({ caught: true });
  }

  async getPokemonById(pokeId: number) {
    return this.pokemonModel.findOne({ pokeId });
  }

  async updatePokemon(pokeId: number, updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonModel.findOneAndUpdate({ pokeId }, updatePokemonDto, { new: true });
  }

  async deletePokemon(pokeId: number) {
    return this.pokemonModel.findOneAndDelete({ pokeId });
  }
}
