import { Request, Response } from 'express';
import { VideoExtraction } from '../models/VideoExtraction.js';
import { geminiVideoService } from '../services/gemini-video.service.js';
import { tmdbService } from '../services/tmdb.service.js';
import { PersonalList } from '../models/PersonalList.js';
import { Space } from '../models/Space.js';

/**
 * Analyze video URL and extract movie titles
 * POST /api/video-extraction/analyze
 */
export const analyzeVideo = async (req: Request, res: Response) => {
  try {
    const { videoUrl } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!videoUrl || typeof videoUrl !== 'string') {
      return res.status(400).json({ message: 'Video URL is required' });
    }

    // Extract movies from video using Gemini AI
    const { movies, metadata } = await geminiVideoService.extractMoviesFromVideo(videoUrl);

    if (movies.length === 0) {
      return res.status(200).json({
        message: 'No movies found in this video',
        extraction: null
      });
    }

    // Match extracted movies with TMDB
    const matchedMovies = await tmdbService.matchMovies(
      movies.map(m => ({ title: m.title, year: m.year }))
    );

    // Combine Gemini extraction with TMDB data
    const extractedMovies = movies.map((movie, index) => ({
      title: matchedMovies[index].title,
      year: matchedMovies[index].year,
      confidence: movie.confidence,
      tmdbId: matchedMovies[index].tmdbId,
      posterPath: matchedMovies[index].posterPath
    }));

    // Save extraction to database
    const extraction = await VideoExtraction.create({
      userId,
      videoUrl,
      platform: metadata.platform,
      extractedMovies,
      videoTitle: metadata.title,
      videoDescription: metadata.description,
      addedToLists: []
    });

    const responseData = {
      message: `Found ${extractedMovies.length} movie(s) in the video`,
      extraction: {
        id: extraction._id,
        videoUrl: extraction.videoUrl,
        platform: extraction.platform,
        videoTitle: extraction.videoTitle,
        extractedMovies: extraction.extractedMovies,
        extractedAt: extraction.extractedAt
      }
    };



    res.status(200).json(responseData);
  } catch (error: any) {
    console.error('Error analyzing video:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to analyze video',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Add extracted movies to personal watchlist or space
 * POST /api/video-extraction/:id/add-to-list
 */
export const addMoviesToList = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { movieIds, destination } = req.body; // destination: { type: 'personal' | 'space', listId?: string }
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!movieIds || !Array.isArray(movieIds) || movieIds.length === 0) {
      return res.status(400).json({ message: 'Movie IDs are required' });
    }

    if (!destination || !destination.type) {
      return res.status(400).json({ message: 'Destination is required' });
    }

    // Find the extraction
    const extraction = await VideoExtraction.findById(id);
    if (!extraction) {
      return res.status(404).json({ message: 'Extraction not found' });
    }

    // Verify ownership
    if (extraction.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Filter valid movie IDs from extraction
    const validMovieIds = movieIds.filter(tmdbId => 
      extraction.extractedMovies.some(m => m.tmdbId === tmdbId)
    );

    if (validMovieIds.length === 0) {
      return res.status(400).json({ message: 'No valid movie IDs provided' });
    }

    let targetListId;

    if (destination.type === 'personal') {
      // Add to personal watchlist
      let personalList = await PersonalList.findOne({ userId });
      
      if (!personalList) {
        personalList = await PersonalList.create({
          userId,
          movies: []
        });
      }

      // Get movie details from extraction
      const moviesToAdd = extraction.extractedMovies
        .filter(m => m.tmdbId && validMovieIds.includes(m.tmdbId))
        .map(m => ({
          id: m.tmdbId!.toString(),
          title: m.title,
          year: m.year?.toString() || '',
          genre: [],
          plot: '',
          posterUrl: m.posterPath ? tmdbService.getPosterUrl(m.posterPath) : undefined
        }));

      // Add movies that aren't already in the list
      for (const movie of moviesToAdd) {
        const exists = personalList.movies.some((m: any) => m.id === movie.id);
        if (!exists) {
          personalList.movies.push(movie as any);
        }
      }

      await personalList.save();
      targetListId = personalList._id;

    } else if (destination.type === 'space') {
      // Add to space
      if (!destination.listId) {
        return res.status(400).json({ message: 'Space ID is required' });
      }

      const space = await Space.findById(destination.listId);
      if (!space) {
        return res.status(404).json({ message: 'Space not found' });
      }

      // Verify user is a member
      const isMember = space.memberIds.some((m: any) => m.toString() === userId);
      if (!isMember) {
        return res.status(403).json({ message: 'You are not a member of this space' });
      }

      // Get movie details from extraction
      const moviesToAdd = extraction.extractedMovies
        .filter(m => m.tmdbId && validMovieIds.includes(m.tmdbId))
        .map(m => ({
          id: m.tmdbId!.toString(),
          title: m.title,
          year: m.year?.toString() || '',
          genre: [],
          plot: '',
          posterUrl: m.posterPath ? tmdbService.getPosterUrl(m.posterPath) : undefined
        }));

      // Add movies that aren't already in the space
      for (const movie of moviesToAdd) {
        const exists = space.movies.some((m: any) => m.id === movie.id);
        if (!exists) {
          space.movies.push(movie as any);
        }
      }

      await space.save();
      targetListId = space._id;
    } else {
      return res.status(400).json({ message: 'Invalid destination type' });
    }

    // Update extraction record
    extraction.addedToLists.push({
      type: destination.type,
      listId: targetListId,
      movieIds: validMovieIds,
      addedAt: new Date()
    });
    await extraction.save();

    res.status(200).json({
      message: `Successfully added ${validMovieIds.length} movie(s) to ${destination.type === 'personal' ? 'your watchlist' : 'the space'}`,
      addedCount: validMovieIds.length
    });
  } catch (error: any) {
    console.error('Error adding movies to list:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error:', error);
    res.status(500).json({ 
      message: 'Failed to add movies to list',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get user's extraction history
 * GET /api/video-extraction/history
 */
export const getExtractionHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    const extractions = await VideoExtraction.find({ userId })
      .sort({ extractedAt: -1 })
      .limit(limit)
      .skip(skip)
      .select('-__v');

    const total = await VideoExtraction.countDocuments({ userId });

    res.status(200).json({
      extractions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching extraction history:', error);
    res.status(500).json({ 
      message: 'Failed to fetch extraction history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete an extraction record
 * DELETE /api/video-extraction/:id
 */
export const deleteExtraction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const extraction = await VideoExtraction.findById(id);
    if (!extraction) {
      return res.status(404).json({ message: 'Extraction not found' });
    }

    // Verify ownership
    if (extraction.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await extraction.deleteOne();

    res.status(200).json({ message: 'Extraction deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting extraction:', error);
    res.status(500).json({ 
      message: 'Failed to delete extraction',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
