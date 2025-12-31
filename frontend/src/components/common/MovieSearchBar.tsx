import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Movie } from '../../types';

interface MovieSearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    searchResults: Movie[];
    isSearching: boolean;
    onMovieSelect: (movie: Movie) => void;
    placeholder?: string;
}

export const MovieSearchBar: React.FC<MovieSearchBarProps> = ({
    searchQuery,
    onSearchChange,
    searchResults,
    isSearching,
    onMovieSelect,
    placeholder = "Search for movies..."
}) => {
    return (
        <div className="relative mb-6">
            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 pr-12 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isSearching ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <Search size={20} />
                    )}
                </div>
            </div>

            {searchQuery && searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-96 overflow-y-auto">
                    {searchResults.map((movie) => (
                        <button
                            key={movie.id}
                            onClick={() => {
                                onMovieSelect(movie);
                                onSearchChange('');
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-yellow-100 border-b border-gray-200 last:border-b-0 flex items-center gap-3"
                        >
                            {movie.posterUrl && (
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="w-12 h-16 object-cover border border-black"
                                />
                            )}
                            <div>
                                <div className="font-bold">{movie.title}</div>
                                <div className="text-sm text-gray-600">{movie.year}</div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
