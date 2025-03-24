import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/schemas/Pokemon.schema';
import { Model } from 'mongoose';
import { CreatePokemonDto } from './dto/CreatePokemon.dto';
import axios from 'axios';

interface PokemonAPIResponse {
  id: number;
  name: string;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string | null;
      };
    };
  };
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
  constructor(
    @InjectModel(Pokemon.name) private pokemonModel: Model<Pokemon>,
  ) {}

  async createPokemon(createPokemonDto: CreatePokemonDto) {
    try {
      const newPokemon = new this.pokemonModel(createPokemonDto);
      return await newPokemon.save();
    } catch (error) {
      console.error('Error creating Pokémon:', error);
      throw error;
    }
  }

  async getPokemons() {
    try {
      return await this.pokemonModel.find();
    } catch (error) {
      console.error('Error fetching Pokémon list:', error);
      throw error;
    }
  }

  async getPokemonById(pokeId: number) {
    try {
      return await this.pokemonModel.findOne({ pokeId });
    } catch (error) {
      console.error(`Error fetching Pokémon with ID ${pokeId}:`, error);
      throw error;
    }
  }

  async updatePokemon(
    pokeId: number,
    updatePokemonDto: Partial<CreatePokemonDto>,
  ) {
    try {
      return await this.pokemonModel.findOneAndUpdate(
        { pokeId },
        updatePokemonDto,
        { new: true },
      );
    } catch (error) {
      console.error(`Error updating Pokémon with ID ${pokeId}:`, error);
      throw error;
    }
  }

  async deletePokemon(pokeId: number) {
    try {
      return await this.pokemonModel.findOneAndDelete({ pokeId });
    } catch (error) {
      console.error(`Error deleting Pokémon with ID ${pokeId}:`, error);
      throw error;
    }
  }

  async fetchPokemons(limit = 25) {
    try {
      const pokemonIds = Array.from({ length: limit }, (_, i) => i + 1);

      // Fetch data secara paralel untuk semua Pokemon dengan tipe yang jelas
      const pokemonData = await Promise.all(
        pokemonIds.map(async (pokeId) => {
          const { data } = await axios.get<PokemonAPIResponse>(
            `https://pokeapi.co/api/v2/pokemon/${pokeId}`,
          );

          return {
            pokeId: data.id,
            name: data.name,
            image: data.sprites.other['official-artwork'].front_default || '',
            types: data.types.map((t) => t.type.name),
            height: `${data.height / 10}m`,
            weight: `${data.weight / 10}kg`,
            abilities: data.abilities.map((a) => a.ability.name),
            experience: data.base_experience,
            moves: data.moves.slice(0, 5).map((m) => ({
              move: { name: m.move.name },
            })),
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
      return { message: `${limit} Pokémon berhasil disimpan.` };
    } catch (error) {
      console.error('Error fetching multiple Pokémon:', error);
      throw error;
    }
  }

  async getCaughtCount(): Promise<number> {
    try {
      return await this.pokemonModel.countDocuments({ caught: true });
    } catch (error) {
      console.error('Error fetching caught Pokémon count:', error);
      throw error;
    }
  }

  async getCaughtPokemons() {
    try {
      return await this.pokemonModel.find({ caught: true }).exec();
    } catch (error) {
      console.error('Error fetching caught Pokémon:', error);
      throw error;
    }
  }
}
