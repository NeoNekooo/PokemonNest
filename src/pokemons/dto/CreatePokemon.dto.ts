import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreatePokemonDto {
  @IsNumber()
  @IsNotEmpty()
  pokeId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  image?: string;

  @IsArray()
  @IsString({ each: true })
  types: string[];

  @IsString()
  height: string;

  @IsString()
  weight: string;

  @IsArray()
  @IsString({ each: true })
  abilities: string[];

  @IsNumber()
  experience: number;

  @IsArray()
  moves: { move: { name: string } }[];

  @IsArray()
  stats: { base_stat: number; stat: { name: string } }[];

  @IsString()
  averageStats: string;

  @IsOptional()
  @IsBoolean()
  caught: boolean;

  @IsOptional()
  @IsDateString()
  caughtAt?: string;
}
