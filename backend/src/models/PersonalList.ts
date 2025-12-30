import mongoose, { Schema, Document } from 'mongoose';
import { Movie } from '../types/index.js';

export interface IPersonalList extends Document {
  userId: mongoose.Types.ObjectId;
  movies: Movie[];
  createdAt: Date;
}

const movieSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  year: { type: String, required: true },
  tmdbId: { type: Number }, // Added for enrichment
  genre: [{ type: String }],
  plot: { type: String, required: false },
  posterUrl: { type: String },
  rating: { type: String },
  director: { type: String },
  runtime: { type: String },
  actors: [{ type: String }]
}, { _id: false });

const personalListSchema = new Schema<IPersonalList>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  movies: [movieSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
personalListSchema.index({ userId: 1 });

export const PersonalList = mongoose.model<IPersonalList>('PersonalList', personalListSchema);
