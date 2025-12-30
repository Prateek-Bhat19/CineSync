import React, { useState } from 'react';
import { Movie } from '../types';
import { Button } from '../components/Button';
import { updatePersonalMovie, updateMovieInSpace } from '../services/api.service';
import { searchMovies, getMovieDetails as getTmdbDetails } from '../services/tmdb.service';
import { Sparkles, Loader2 } from 'lucide-react';

interface MovieDetailPageProps {
    movie: Movie & { persistenceContext?: { type: 'personal' | 'space', spaceId?: string } };
    onBack: () => void;
}

export const MovieDetailPage: React.FC<MovieDetailPageProps> = ({ movie: initialMovie, onBack }) => {
    const [movie, setMovie] = useState<Movie>(initialMovie);
    const [isEnriching, setIsEnriching] = useState(false);

    const posterSrc = movie.posterUrl || 'https://via.placeholder.com/500x750?text=No+Poster';

    // Check if we need enrichment (e.g. missing plot, runtime is 0/NA, or actors empty)
    // Also allow enrichment if we don't have a TMDB ID but have a title (common for extractor results)
    const needsEnrichment = movie.title && (
        !movie.tmdbId ||
        !movie.plot || movie.plot === 'No plot available' ||
        !movie.actors || movie.actors.length === 0 ||
        !movie.director || movie.director === 'N/A'
    );

    const handleEnrichDetails = async () => {
        setIsEnriching(true);
        try {
            let targetTmdbId = movie.tmdbId;

            // If we don't have a TMDB ID, search for the movie first
            if (!targetTmdbId) {
                const searchResults = await searchMovies(movie.title);

                if (searchResults.length > 0) {
                    // Extract ID from the first result (it usually comes as 'tmdb-123')
                    const firstMatch = searchResults[0];
                    if (firstMatch.id.startsWith('tmdb-')) {
                        targetTmdbId = parseInt(firstMatch.id.replace('tmdb-', ''), 10);
                    }
                }
            }

            if (targetTmdbId) {
                const enriched = await getTmdbDetails(targetTmdbId);
                if (enriched) {
                    const updatedMovie = {
                        ...movie,
                        ...enriched,
                        id: movie.id // Keep the original ID
                    };
                    setMovie(updatedMovie);

                    // Persist changes if context exists
                    if (initialMovie.persistenceContext) {
                        try {
                            const { type, spaceId } = initialMovie.persistenceContext;
                            // We only want to send the fields that changed/verified
                            const updates = {
                                tmdbId: targetTmdbId,
                                plot: enriched.plot,
                                runtime: enriched.runtime,
                                director: enriched.director,
                                actors: enriched.actors,
                                genre: enriched.genre,
                                rating: enriched.rating,
                                year: enriched.year,
                                posterUrl: enriched.posterUrl
                            };

                            if (type === 'personal') {
                                await updatePersonalMovie('me', movie.id, updates);
                            } else if (type === 'space' && spaceId) {
                                await updateMovieInSpace(spaceId, movie.id, updates);
                            }

                        } catch (persistError) {
                            console.error('Failed to persist enriched details:', persistError);
                        }
                    }
                }
            } else {
                console.warn('Could not find TMDB ID for movie:', movie.title);
            }
        } catch (error) {
            console.error('Failed to enrich details:', error);
        } finally {
            setIsEnriching(false);
        }
    };

    return (
        <div className="container min-h-screen py-8 mt-24">
            <div className="mb-6 flex justify-between items-center">
                <Button variant="secondary" onClick={onBack} >&larr; Back to Dashboard</Button>
            </div>

            <div className="retro-card p-0 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Poster Side */}
                    <div className="w-full md:w-1/3 lg:w-1/4 border-b-4 md:border-b-0 md:border-r-4 border-black bg-gray-100">
                        <img
                            src={posterSrc}
                            alt={movie.title}
                            className="w-full h-full object-cover aspect-[2/3]"
                        />
                    </div>

                    {/* Details Side */}
                    <div className="w-full md:w-2/3 lg:w-3/4 p-6 md:p-8 bg-white relative flex flex-col">

                        <div className="flex flex-col h-full">
                            <div className="mb-6 border-b-2 border-gray-300 pb-4">
                                <h1 className="text-4xl md:text-5xl font-bold uppercase mb-2 leading-none">{movie.title}</h1>

                                <div className="flex flex-wrap items-center gap-4 text-sm font-bold uppercase text-gray-600">
                                    <span className="bg-black text-white px-2 py-1">{movie.year || 'N/A'}</span>
                                    {movie.rating && (
                                        <span className="flex items-center gap-1 text-yellow-600">
                                            <span>★</span> {movie.rating}
                                        </span>
                                    )}
                                    {movie.runtime && <span>{movie.runtime}</span>}
                                </div>
                            </div>

                            <div className="space-y-6 flex-grow">
                                {movie.genre && movie.genre.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold uppercase mb-2 text-red-600">Genres</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {movie.genre.map((g, i) => (
                                                <span key={i} className="border-2 border-black px-3 py-1 text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors cursor-default">
                                                    {g}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-lg font-bold uppercase mb-2 text-red-600">Plot Summary</h3>
                                    <p className="text-lg leading-relaxed font-medium text-gray-800">
                                        {movie.plot || 'No plot summary available.'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {movie.director && movie.director !== 'N/A' && (
                                        <div>
                                            <h3 className="text-lg font-bold uppercase mb-1 text-red-600">Director</h3>
                                            <p className="font-bold text-xl">{movie.director}</p>
                                        </div>
                                    )}

                                    {movie.actors && movie.actors.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-bold uppercase mb-1 text-red-600">Cast</h3>
                                            <p className="font-medium">{movie.actors.join(', ')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Enrichment Button - Moved to Bottom */}
                            {needsEnrichment && (
                                <div className="mt-8 pt-6 border-t-2 border-gray-200">
                                    <Button
                                        onClick={handleEnrichDetails}
                                        disabled={isEnriching}
                                        className="w-full md:w-auto bg-yellow-400 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-500 hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                                    >
                                        {isEnriching ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Fetching Extended Details from TMDB...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4" />
                                                Enrich Movie Details
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-xs text-gray-500 mt-2 text-center md:text-left">
                                        * Uses AI to find the best match from TMDB database.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
