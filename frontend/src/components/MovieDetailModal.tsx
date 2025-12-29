import React from 'react';
import { Movie } from '../types';
import { Button } from './Button';
import { X, Calendar, Star, Clock, User, Film } from 'lucide-react';

interface MovieDetailModalProps {
    movie: Movie;
    onClose: () => void;
    onAction: () => void;
    actionType: 'add' | 'remove';
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
    movie,
    onClose,
    onAction,
    actionType
}) => {
    const posterSrc = movie.posterUrl || 'https://via.placeholder.com/500x750?text=No+Poster';

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div 
                className="bg-[#f4e4bc] border-4 border-black w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative flex flex-col md:flex-row"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-red-600 text-white p-2 border-2 border-black hover:bg-red-700 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                {/* Poster Section */}
                <div className="w-full md:w-2/5 lg:w-1/3 relative shrink-0 bg-black">
                    <div className="aspect-[2/3] md:h-full sticky md:top-0">
                        <img
                            src={posterSrc}
                            alt={movie.title}
                            className="w-full h-full object-cover border-b-4 md:border-b-0 md:border-r-4 border-black"
                            loading="eager"
                        />
                    </div>
                </div>

                {/* Details Section */}
                <div className="p-6 md:p-8 lg:p-10 flex-1 flex flex-col min-h-0">
                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight uppercase pr-8">
                        {movie.title}
                    </h2>

                    {/* Meta Info Badges */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        {movie.rating && (
                            <div className="flex items-center gap-1.5 bg-black text-white px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                <span className="font-bold text-sm uppercase">{movie.rating}</span>
                            </div>
                        )}
                        {movie.year && (
                            <div className="flex items-center gap-1.5 border-2 border-black px-4 py-2 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                <Calendar size={16} />
                                <span className="font-bold text-sm uppercase">{movie.year}</span>
                            </div>
                        )}
                        {movie.runtime && (
                            <div className="flex items-center gap-1.5 border-2 border-black px-4 py-2 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                <Clock size={16} />
                                <span className="font-bold text-sm uppercase">{movie.runtime}</span>
                            </div>
                        )}
                    </div>

                    {/* Genre Tags */}
                    {movie.genre && movie.genre.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2">
                                <Film size={20} /> Genre
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {movie.genre.map((g, i) => (
                                    <span 
                                        key={i} 
                                        className="bg-blue-900 text-white px-3 py-1.5 text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        {g}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Plot */}
                    {movie.plot && (
                        <div className="mb-6 flex-grow min-h-0">
                            <h3 className="text-lg md:text-xl font-bold mb-3">Plot</h3>
                            <p className="text-base md:text-lg leading-relaxed font-medium text-gray-800" style={{ fontFamily: 'var(--font-body)' }}>
                                {movie.plot}
                            </p>
                        </div>
                    )}

                    {/* Director & Cast */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {movie.director && (
                            <div>
                                <h3 className="text-base md:text-lg font-bold mb-2 flex items-center gap-2">
                                    <User size={18} /> Director
                                </h3>
                                <p className="font-medium text-gray-800">{movie.director}</p>
                            </div>
                        )}
                        {movie.actors && movie.actors.length > 0 && (
                            <div>
                                <h3 className="text-base md:text-lg font-bold mb-2 flex items-center gap-2">
                                    <User size={18} /> Cast
                                </h3>
                                <p className="font-medium text-gray-800">{movie.actors.join(', ')}</p>
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto pt-6 border-t-4 border-black">
                        <Button
                            onClick={() => {
                                onAction();
                                onClose();
                            }}
                            className="w-full md:w-auto min-w-[200px]"
                            variant={actionType === 'add' ? 'primary' : 'secondary'}
                        >
                            {actionType === 'add' ? 'Add to Collection' : 'Remove from Collection'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
