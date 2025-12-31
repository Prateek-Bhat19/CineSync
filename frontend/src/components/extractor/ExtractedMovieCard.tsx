import React from 'react';
import { Check } from 'lucide-react';
import { Movie } from '../../types';

interface ExtractedMovieCardProps {
    movie: any; // ExtractedMovie type
    isSelected: boolean;
    onToggle: (tmdbId: number) => void;
}

export const ExtractedMovieCard: React.FC<ExtractedMovieCardProps> = ({
    movie,
    isSelected,
    onToggle
}) => {
    const posterUrl = movie.posterPath
        ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
        : '/placeholder-poster.png';

    return (
        <div
            onClick={() => onToggle(movie.tmdbId)}
            className={`retro-card cursor-pointer transition-all duration-200 p-4 ${isSelected
                    ? 'bg-yellow-100 border-4 border-yellow-500 shadow-[6px_6px_0px_0px_rgba(234,179,8,1)] scale-105'
                    : 'bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:scale-105'
                }`}
        >
            <div className="relative">
                {isSelected && (
                    <div className="absolute top-2 right-2 bg-yellow-500 border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10">
                        <Check size={20} className="text-black" />
                    </div>
                )}
                <img
                    src={posterUrl}
                    alt={movie.title}
                    className="w-full h-64 object-cover border-2 border-black mb-3"
                />
            </div>
            <h3 className="font-black text-lg uppercase mb-1">{movie.title}</h3>
            {movie.year && (
                <p className="text-sm text-gray-600 font-bold">{movie.year}</p>
            )}
            {movie.overview && (
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                    {movie.overview}
                </p>
            )}
        </div>
    );
};
