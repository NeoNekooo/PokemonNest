/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  Delete,
  Patch,
  BadRequestException,
  Query
} from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { CreatePokemonDto } from './dto/CreatePokemon.dto';
@Controller('pokemons')
export class PokemonsController {
  constructor(private pokemonsService: PokemonsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createPokemon(@Body() createPokemonDto: CreatePokemonDto) {
    return await this.pokemonsService.createPokemon(createPokemonDto);
  }

  @Get()
  async getPokemons() {
    return await this.pokemonsService.getPokemons();
  }

  @Get('caught/count')
  async getCaughtCount() {
    return { caughtCount: await this.pokemonsService.getCaughtCount() };
  }

  @Get('caught')
  async getCaughtPokemon() {
    return await this.pokemonsService.getCaughtPokemons();
  }

  @Get(':id')
  async getPokemonById(@Param('id') pokeId: string) {
    const numericId = Number(pokeId);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid Pokémon ID');
    }
    return await this.pokemonsService.getPokemonById(numericId);
  }

  @Patch(':id')
  async updatePokemon(
    @Param('id') pokeId: string,
    @Body() updatePokemonDto: Partial<CreatePokemonDto>,
  ) {
    return await this.pokemonsService.updatePokemon(
      Number(pokeId),
      updatePokemonDto,
    );
  }

  @Delete(':id')
  async deletePokemon(@Param('id') pokeId: string) {
    return await this.pokemonsService.deletePokemon(Number(pokeId));
  }

 

  @Post('fetch')
  async fetchPokemons(@Query('limit') limit: number) {
    return this.pokemonsService.fetchPokemons(limit || 50);
  }
}
