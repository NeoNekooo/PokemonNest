import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'pokemons' }) // Harus sesuai dengan collection di database
export class Pokemon extends Document {
  @Prop({ required: true, unique: true })
  pokeId: number;

  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop([String])
  types: string[];

  @Prop()
  height: string;

  @Prop()
  weight: string;

  @Prop([String])
  abilities: string[];

  @Prop()
  experience: number;

  @Prop()
  moves: { move: { name: string } }[];

  @Prop()
  stats: { base_stat: number; stat: { name: string } }[];

  @Prop()
  averageStats: string;

  @Prop({ default: false })
  caught: boolean;

  @Prop()
  caughtAt?: string;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
