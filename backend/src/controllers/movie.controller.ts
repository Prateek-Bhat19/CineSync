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
