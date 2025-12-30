import { Request, Response } from 'express';
import { PersonalList } from '../models/index.js';
import mongoose from 'mongoose';

// Get personal movie list
export const getPersonalMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const userId = new mongoose.Types.ObjectId(req.user.userId);
    
    let personalList = await PersonalList.findOne({ userId });
    
    // Create if doesn't exist
    if (!personalList) {
      personalList = await PersonalList.create({
        userId,
        movies: []
      });
    }

    res.json(personalList.movies);
  } catch (error: any) {
    console.error('Get personal movies error:', error);
    res.status(500).json({ error: error.message || 'Failed to get personal movies' });
  }
};

// Add movie to personal list
export const addPersonalMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const movie = req.body;

    if (!movie || !movie.title) {
      res.status(400).json({ error: 'Movie data is required' });
      return;
    }

    const userId = new mongoose.Types.ObjectId(req.user.userId);
    
    let personalList = await PersonalList.findOne({ userId });
    
    // Create if doesn't exist
    if (!personalList) {
      personalList = await PersonalList.create({
        userId,
        movies: [movie]
      });
    } else {
      // Check for duplicates
      if (personalList.movies.some(m => m.title === movie.title)) {
        res.status(400).json({ error: 'Movie already exists in your list' });
        return;
      }

      personalList.movies.push(movie);
      await personalList.save();
    }

    res.json({ message: 'Movie added successfully' });
  } catch (error: any) {
    console.error('Add personal movie error:', error);
    res.status(500).json({ error: error.message || 'Failed to add movie' });
  }
};

// Remove movie from personal list
export const removePersonalMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { movieId } = req.params;

    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const personalList = await PersonalList.findOne({ userId });

    if (!personalList) {
      res.status(404).json({ error: 'Personal list not found' });
      return;
    }

    personalList.movies = personalList.movies.filter(m => m.id !== movieId);
    await personalList.save();

    res.json({ message: 'Movie removed successfully' });
  } catch (error: any) {
    console.error('Remove personal movie error:', error);
    res.status(500).json({ error: error.message || 'Failed to remove movie' });
  }
};
// Update a movie in personal list
export const updatePersonalMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { movieId } = req.params;
    const updates = req.body;

    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const personalList = await PersonalList.findOne({ userId });

    if (!personalList) {
      res.status(404).json({ error: 'Personal list not found' });
      return;
    }

    const movieIndex = personalList.movies.findIndex(m => m.id === movieId);
    if (movieIndex === -1) {
      res.status(404).json({ error: 'Movie not found in list' });
      return;
    }

    // Merge updates safely
    const movieToUpdate = personalList.movies[movieIndex];
    
    // Explicitly update fields that are allowed to change
    if (updates.plot) movieToUpdate.plot = updates.plot;
    if (updates.runtime) movieToUpdate.runtime = updates.runtime;
    if (updates.director) movieToUpdate.director = updates.director;
    if (updates.actors) movieToUpdate.actors = updates.actors;
    if (updates.genre) movieToUpdate.genre = updates.genre;
    if (updates.rating) movieToUpdate.rating = updates.rating;
    if (updates.year) movieToUpdate.year = updates.year;
    if (updates.posterUrl) movieToUpdate.posterUrl = updates.posterUrl;
    if (updates.tmdbId) (movieToUpdate as any).tmdbId = updates.tmdbId; // If we add tmdbId to schema later

    // Or use Object.assign if we trust the input, but manual mapping is safer for subdocs
    // Object.assign(movieToUpdate, updates); 
    
    // Important: Mongoose detects changes automatically on subdocs
    await personalList.save();

    res.json({ message: 'Movie updated successfully', movie: personalList.movies[movieIndex] });
  } catch (error: any) {
    console.error('Update personal movie error:', error);
    res.status(500).json({ error: error.message || 'Failed to update movie' });
  }
};
