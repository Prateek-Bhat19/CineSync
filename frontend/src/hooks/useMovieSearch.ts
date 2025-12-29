import { useState, useEffect, useRef } from 'react';
import { Movie } from '../types';
import { searchMovies } from '../services/tmdb.service';

interface UseMovieSearchReturn {
    results: Movie[];
    isLoading: boolean;
    error: string | null;
}

export const useDebouncedMovieSearch = (query: string, delay: number = 500): UseMovieSearchReturn => {
    const [results, setResults] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cache to store results: query -> Movie[]
    const cache = useRef<Map<string, Movie[]>>(new Map());

    useEffect(() => {
        const trimmedQuery = query.trim();
        let isActive = true; // Flag to prevent race conditions

        // 1. Clear results if query is empty
        if (!trimmedQuery) {
            setResults([]);
            setIsLoading(false);
            setError(null);
            return;
        }

        // 2. Check cache first for instant results
        if (cache.current.has(trimmedQuery)) {
            setResults(cache.current.get(trimmedQuery)!);
            setIsLoading(false);
            setError(null);
            return;
        }

        // 3. Set loading state immediately (UX requirement)
        setIsLoading(true);
        setError(null);

        // 4. Debounce the API call
        const timer = setTimeout(async () => {
            if (!isActive) return;

            try {
                const data = await searchMovies(trimmedQuery);
                
                // Only update state if this effect is still active (user hasn't typed more)
                if (isActive) {
                    cache.current.set(trimmedQuery, data);
                    setResults(data);
                    setIsLoading(false);
                }
            } catch (err) {
                if (isActive) {
                    console.error('Search failed:', err);
                    setError('Failed to search movies');
                    setIsLoading(false);
                }
            }
        }, delay);

        // Cleanup: cancel timeout and mark effect as inactive
        return () => {
            isActive = false;
            clearTimeout(timer);
        };
    }, [query, delay]);

    return { results, isLoading, error };
};
