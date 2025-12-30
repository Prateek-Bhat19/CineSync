// TMDB Service for movie search and details
// This service helps match extracted movie titles with TMDB database

interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
}

interface TMDBSearchResponse {
  results: TMDBMovie[];
}

export class TMDBService {
  private apiKey: string;
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor() {
    this.apiKey = process.env.TMDB_API_KEY || '';
    if (!this.apiKey) {
      console.warn('TMDB_API_KEY not set. Movie matching will not work.');
    }
  }

  /**
   * Search for a movie by title and optional year
   */
  async searchMovie(title: string, year?: number): Promise<TMDBMovie | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const params = new URLSearchParams({
        api_key: this.apiKey,
        query: title,
        ...(year && { year: year.toString() })
      });

      const response = await fetch(`${this.baseUrl}/search/movie?${params}`);
      
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.statusText}`);
      }

      const data = await response.json() as TMDBSearchResponse;
      
      // Return the first (most relevant) result
      if (data.results && data.results.length > 0) {
        return data.results[0];
      }

      return null;
    } catch (error) {
      console.error('Error searching TMDB:', error);
      return null;
    }
  }

  /**
   * Match multiple movie titles with TMDB
   */
  async matchMovies(movies: Array<{ title: string; year?: number }>): Promise<Array<{
    title: string;
    year?: number;
    tmdbId?: number;
    posterPath?: string;
    matched: boolean;
  }>> {
    const results = await Promise.all(
      movies.map(async (movie) => {
        const tmdbMovie = await this.searchMovie(movie.title, movie.year);
        
        if (tmdbMovie) {
          return {
            title: tmdbMovie.title, // Use TMDB's canonical title
            year: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : movie.year,
            tmdbId: tmdbMovie.id,
            posterPath: tmdbMovie.poster_path || undefined,
            matched: true
          };
        }

        // Return original if no match found
        return {
          title: movie.title,
          year: movie.year,
          matched: false
        };
      })
    );

    return results;
  }

  /**
   * Get full poster URL from poster path
   */
  getPosterUrl(posterPath: string | null | undefined, size: 'w185' | 'w342' | 'w500' | 'original' = 'w342'): string | null {
    if (!posterPath) return null;
    return `https://image.tmdb.org/t/p/${size}${posterPath}`;
  }
}

export const tmdbService = new TMDBService();
