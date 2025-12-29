import React from 'react';
import { Movie } from '../types';
import { Button } from '../components/Button';

interface MovieDetailPageProps {
    movie: Movie;
    onBack: () => void;
}

export const MovieDetailPage: React.FC<MovieDetailPageProps> = ({ movie, onBack }) => {
    const posterSrc = movie.posterUrl || 'https://via.placeholder.com/500x750?text=No+Poster';

    return (
        <div className="container min-h-screen py-8 mt-24">
            <div className="mb-6">
                <Button variant="secondary" onClick={onBack} size="sm">&larr; Back to Dashboard</Button>
            </div>

            <div className="retro-card p-0 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Poster Side */}
                    <div className="w-full md:w-1/3 lg:w-1/4 border-b-4 md:border-b-0 md:border-r-4 border-black">
                        <img
                            src={posterSrc}
                            alt={movie.title}
                            className="w-full h-full object-cover aspect-[2/3]"
                        />
                    </div>

                    {/* Details Side */}
                    <div className="w-full md:w-2/3 lg:w-3/4 p-6 md:p-8 bg-white">
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
                                    {movie.director && (
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
