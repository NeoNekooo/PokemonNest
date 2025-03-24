import { PartialType } from '@nestjs/mapped-types';
import { CreatePokemonDto } from './CreatePokemon.dto';

export class UpdatePokemonDto extends PartialType(CreatePokemonDto) {}
