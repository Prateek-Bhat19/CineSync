import mongoose, { Schema, Document } from 'mongoose';

export interface IExtractedMovie {
  title: string;
  year?: number;
  confidence: 'high' | 'medium' | 'low';
  tmdbId?: number;
  posterPath?: string;
}

export interface IAddedToList {
  type: 'personal' | 'space';
  listId: mongoose.Types.ObjectId;
  movieIds: number[];
  addedAt: Date;
}

export interface IVideoExtraction extends Document {
  userId: mongoose.Types.ObjectId;
  videoUrl: string;
  platform: 'youtube';
  extractedMovies: IExtractedMovie[];
  videoTitle?: string;
  videoDescription?: string;
  extractedAt: Date;
  addedToLists: IAddedToList[];
}

const VideoExtractionSchema = new Schema<IVideoExtraction>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  videoUrl: {
    type: String,
    required: true,
    trim: true
  },
  platform: {
    type: String,
    enum: ['youtube'],
    required: true
  },
  extractedMovies: [{
    title: {
      type: String,
      required: true
    },
    year: Number,
    confidence: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required: true
    },
    tmdbId: Number,
    posterPath: String
  }],
  videoTitle: String,
  videoDescription: String,
  extractedAt: {
    type: Date,
    default: Date.now
  },
  addedToLists: [{
    type: {
      type: String,
      enum: ['personal', 'space'],
      required: true
    },
    listId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    movieIds: [Number],
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

export const VideoExtraction = mongoose.model<IVideoExtraction>('VideoExtraction', VideoExtractionSchema);
