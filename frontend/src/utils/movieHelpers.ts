import { Movie } from '../types';

/**
 * Convert extracted movie data to Movie type
 */
export const convertExtractedToMovie = (extracted: any): Movie => {
  return {
    id: extracted.tmdbId?.toString() || `temp-${Date.now()}`,
    title: extracted.title,
    year: extracted.year?.toString() || '',
    genre: extracted.genres || [],
    plot: extracted.overview || '',
    posterUrl: extracted.poster_path 
      ? `https://image.tmdb.org/t/p/w500${extracted.poster_path}`
      : '/placeholder-poster.png',
    rating: extracted.vote_average?.toString() || 'N/A',
    tmdbId: extracted.tmdbId
  };
};

/**
 * Check if a movie needs enrichment
 */
export const needsEnrichment = (movie: Movie): boolean => {
  return !movie.plot || !movie.posterUrl || movie.posterUrl.includes('placeholder');
};

/**
 * Format movie year from various inputs
 */
export const formatMovieYear = (year: string | number | undefined): string => {
  if (!year) return '';
  const yearStr = year.toString();
  // Extract year from date strings like "2024-01-01"
  return yearStr.split('-')[0];
};

/**
 * Generate a unique temporary ID
 */
export const generateTempId = (): string => {
  return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
