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
  Query,
  HttpCode,
  ParseIntPipe
} from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { CreatePokemonDto } from './dto/CreatePokemon.dto';

@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createPokemon(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonsService.createPokemon(createPokemonDto);
  }

  @Get()
  getPokemons() {
    return this.pokemonsService.getPokemons();
  }

  @Get('caught/count')
  async getCaughtCount() {
    return { caughtCount: await this.pokemonsService.getCaughtCount() };
  }

  @Get('caught')
  getCaughtPokemon() {
    return this.pokemonsService.getCaughtPokemons();
  }

  @Get(':id')
  async getPokemonById(@Param('id') pokeId: string) {
    const numericId = Number(pokeId);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid Pokémon ID');
    }
    return this.pokemonsService.getPokemonById(numericId);
  }

  @Patch(':id')
  async updatePokemon(
    @Param('id') pokeId: string,
    @Body() updatePokemonDto: Partial<CreatePokemonDto>,
  ) {
    return this.pokemonsService.updatePokemon(Number(pokeId), updatePokemonDto);
  }

  @Delete(':id')
  async deletePokemon(@Param('id') pokeId: string) {
    return this.pokemonsService.deletePokemon(Number(pokeId));
  }

  @Post('fetch')
  @HttpCode(200)
  fetchPokemons(@Query('limit', ParseIntPipe) limit = 50) {
    return this.pokemonsService.fetchPokemons(limit);
  }
}
