import { Request, Response } from 'express';
import { Space, User } from '../models/index.js';
import mongoose from 'mongoose';

// Get all spaces for a user
export const getSpaces = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const userId = new mongoose.Types.ObjectId(req.user.userId);
    
    // Find spaces where user is owner or member
    const spaces = await Space.find({
      $or: [
        { ownerId: userId },
        { memberIds: userId }
      ]
    }).sort({ createdAt: -1 });

    res.json(spaces.map(space => ({
      id: space._id.toString(),
      name: space.name,
      description: space.description,
      ownerId: space.ownerId.toString(),
      memberIds: space.memberIds.map(id => id.toString()),
      movies: space.movies,
      createdAt: space.createdAt.getTime()
    })));
  } catch (error: any) {
    console.error('Get spaces error:', error);
    res.status(500).json({ error: error.message || 'Failed to get spaces' });
  }
};

// Create a new space
export const createSpace = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Space name is required' });
      return;
    }

    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const space = await Space.create({
      name,
      description: description || '',
      ownerId: userId,
      memberIds: [userId],
      movies: []
    });

    res.status(201).json({
      id: space._id.toString(),
      name: space.name,
      description: space.description,
      ownerId: space.ownerId.toString(),
      memberIds: space.memberIds.map(id => id.toString()),
      movies: space.movies,
      createdAt: space.createdAt.getTime()
    });
  } catch (error: any) {
    console.error('Create space error:', error);
    res.status(500).json({ error: error.message || 'Failed to create space' });
  }
};

// Add member to space
export const addMember = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { spaceId } = req.params;
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    // Find the user to add
    const userToAdd = await User.findOne({ email: email.toLowerCase() });
    if (!userToAdd) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Find the space
    const space = await Space.findById(spaceId);
    if (!space) {
      res.status(404).json({ error: 'Space not found' });
      return;
    }

    // Check if requester is the owner
    if (space.ownerId.toString() !== req.user.userId) {
      res.status(403).json({ error: 'Only the space owner can add members' });
      return;
    }

    // Check if user is already a member
    if (space.memberIds.some(id => id.toString() === userToAdd._id.toString())) {
      res.status(400).json({ error: 'User is already a member' });
      return;
    }

    // Add member
    space.memberIds.push(userToAdd._id as mongoose.Types.ObjectId);
    await space.save();

    res.json({ message: 'Member added successfully' });
  } catch (error: any) {
    console.error('Add member error:', error);
    res.status(500).json({ error: error.message || 'Failed to add member' });
  }
};

// Add movie to space
export const addMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { spaceId } = req.params;
    const movie = req.body;

    if (!movie || !movie.title) {
      res.status(400).json({ error: 'Movie data is required' });
      return;
    }

    const space = await Space.findById(spaceId);
    if (!space) {
      res.status(404).json({ error: 'Space not found' });
      return;
    }

    // Check if user is a member
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    if (!space.memberIds.some(id => id.toString() === userId.toString())) {
      res.status(403).json({ error: 'You are not a member of this space' });
      return;
    }

    // Check for duplicates
    if (space.movies.some(m => m.title === movie.title)) {
      res.status(400).json({ error: 'Movie already exists in this space' });
      return;
    }

    // Add movie
    space.movies.push(movie);
    await space.save();

    res.json({ message: 'Movie added successfully' });
  } catch (error: any) {
    console.error('Add movie error:', error);
    res.status(500).json({ error: error.message || 'Failed to add movie' });
  }
};

// Remove movie from space
export const removeMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { spaceId, movieId } = req.params;

    const space = await Space.findById(spaceId);
    if (!space) {
      res.status(404).json({ error: 'Space not found' });
      return;
    }

    // Check if user is a member
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    if (!space.memberIds.some(id => id.toString() === userId.toString())) {
      res.status(403).json({ error: 'You are not a member of this space' });
      return;
    }

    // Remove movie
    space.movies = space.movies.filter(m => m.id !== movieId);
    await space.save();

    res.json({ message: 'Movie removed successfully' });
  } catch (error: any) {
    console.error('Remove movie error:', error);
    res.status(500).json({ error: error.message || 'Failed to remove movie' });
  }
};
