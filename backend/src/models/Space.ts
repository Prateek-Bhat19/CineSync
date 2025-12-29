import mongoose, { Schema, Document } from 'mongoose';
import { Movie } from '../types/index.js';

export interface ISpace extends Document {
  name: string;
  description: string;
  ownerId: mongoose.Types.ObjectId;
  memberIds: mongoose.Types.ObjectId[];
  movies: Movie[];
  createdAt: Date;
}

const movieSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  year: { type: String, required: true },
  genre: [{ type: String }],
  plot: { type: String, required: true },
  posterUrl: { type: String },
  rating: { type: String },
  director: { type: String },
  runtime: { type: String },
  actors: [{ type: String }]
}, { _id: false });

const spaceSchema = new Schema<ISpace>({
  name: {
    type: String,
    required: [true, 'Space name is required'],
    trim: true,
    minlength: [2, 'Space name must be at least 2 characters long']
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  memberIds: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  movies: [movieSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
spaceSchema.index({ ownerId: 1 });
spaceSchema.index({ memberIds: 1 });

export const Space = mongoose.model<ISpace>('Space', spaceSchema);
