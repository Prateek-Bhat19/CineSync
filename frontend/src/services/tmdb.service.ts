import { Movie } from "../types";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// TMDB API response types
interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  genre_ids: number[];
}

interface TMDBSearchResponse {
  results: TMDBMovie[];
}

interface TMDBMovieDetails {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  runtime: number;
  genres: { id: number; name: string }[];
  credits?: {
    cast: { name: string }[];
    crew: { job: string; name: string }[];
  };
}

// Genre mapping (TMDB genre IDs to names)
const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

/**
 * Get poster URL from TMDB poster path
 */
const getPosterUrl = (posterPath: string | null, size: string = 'w500'): string => {
  if (!posterPath) {
    // Fallback to a placeholder if no poster available
    return `https://via.placeholder.com/500x750/1e293b/64748b?text=No+Poster`;
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
};

/**
 * Convert TMDB movie to CineSync Movie format
 */
const convertTMDBMovie = (tmdbMovie: TMDBMovie | TMDBMovieDetails): Movie => {
  const year = tmdbMovie.release_date ? tmdbMovie.release_date.split('-')[0] : 'N/A';
  
  // Get genres
  let genres: string[] = [];
  if ('genres' in tmdbMovie && tmdbMovie.genres) {
    genres = tmdbMovie.genres.map(g => g.name);
  } else if ('genre_ids' in tmdbMovie) {
    genres = tmdbMovie.genre_ids.map(id => GENRE_MAP[id] || 'Unknown').filter(g => g !== 'Unknown');
  }

  // Get runtime
  let runtime = 'N/A';
  if ('runtime' in tmdbMovie && tmdbMovie.runtime) {
    const hours = Math.floor(tmdbMovie.runtime / 60);
    const minutes = tmdbMovie.runtime % 60;
    runtime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }

  // Get director and actors
  let director = 'N/A';
  let actors: string[] = [];
  if ('credits' in tmdbMovie && tmdbMovie.credits) {
    const directorObj = tmdbMovie.credits.crew?.find(c => c.job === 'Director');
    if (directorObj) director = directorObj.name;
    actors = tmdbMovie.credits.cast?.slice(0, 3).map(a => a.name) || [];
  }

  return {
    id: `tmdb-${tmdbMovie.id}`,
    title: tmdbMovie.title,
    year,
    genre: genres,
    plot: tmdbMovie.overview || 'No plot available',
    posterUrl: getPosterUrl(tmdbMovie.poster_path),
    rating: tmdbMovie.vote_average ? `${tmdbMovie.vote_average.toFixed(1)}/10` : 'N/A',
    director,
    runtime,
    actors
  };
};

/**
 * Search for movies using TMDB API
 */
export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query || !TMDB_API_KEY) {
    if (!TMDB_API_KEY) {
      console.error('TMDB API key not configured. Please set VITE_TMDB_API_KEY in your .env.local file');
    }
    return [];
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data: TMDBSearchResponse = await response.json();
    
    // Get detailed info for top 5 results to include director and cast
    const detailedMovies = await Promise.all(
      data.results.slice(0, 5).map(movie => getMovieDetails(movie.id))
    );

    return detailedMovies.filter(m => m !== null) as Movie[];
  } catch (error) {
    console.error('TMDB Search Error:', error);
    return [];
  }
};

/**
 * Get detailed movie information including credits
 */
export const getMovieDetails = async (tmdbId: number): Promise<Movie | null> => {
  if (!TMDB_API_KEY) return null;

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=credits`
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data: TMDBMovieDetails = await response.json();
    return convertTMDBMovie(data);
  } catch (error) {
    console.error('TMDB Details Error:', error);
    return null;
  }
};
