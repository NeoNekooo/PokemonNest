import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'pokemons' }) // Pastikan koleksi 'pokemons' di sini
export class Pokemon extends Document {
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

  @Prop({ type: [{ stat: { name: String }, base_stat: Number }] })
  stats: { stat: { name: string }; base_stat: number }[];

  @Prop()
  averageStats: string;

  @Prop({ default: false })
  caught: boolean;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
