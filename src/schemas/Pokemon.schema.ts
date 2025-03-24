import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PokemonDocument = Pokemon & Document; // ✅ Correct typing

@Schema()
export class Pokemon {
  @Prop({ required: true })
  pokeId: number;

  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop({ type: [String] })
  types: string[];

  @Prop()
  height: string;

  @Prop()
  weight: string;

  @Prop({ type: [String] })
  abilities: string[];

  @Prop()
  experience: number;

  @Prop({ type: [{ move: { name: String } }] })
  moves: { move: { name: string } }[];

  @Prop({ type: [{ base_stat: Number, stat: { name: String } }] })
  stats: { base_stat: number; stat: { name: string } }[];

  @Prop()
  averageStats: string;

  @Prop()
  caught: boolean;

  @Prop({ type: Date, default: null })
  caughtAt: Date | null;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
