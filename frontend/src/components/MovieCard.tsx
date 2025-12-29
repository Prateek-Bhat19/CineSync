import React from 'react';
import { Movie } from '../types';
import { Button } from './Button';
import { Trash2, Plus, Info } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onAction: (e: React.MouseEvent) => void;
  onClick?: () => void;
  actionType: 'add' | 'remove';
  className?: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onAction,
  onClick,
  actionType,
  className = ''
}) => {
  const posterSrc = movie.posterUrl || 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <div
      className={`retro-card p-0 overflow-hidden flex flex-col h-full cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${className}`}
      onClick={() => {
        console.log('MovieCard clicked:', movie.title);
        onClick?.();
      }}
    >
      {/* Poster Section */}
      <div className="relative aspect-[2/3] overflow-hidden border-b-2 border-black bg-gray-100">
        <img
          src={posterSrc}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="bg-white text-black px-4 py-2 font-bold uppercase text-xs border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-200">
            View Details
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow bg-white">
        <h3 className="text-base font-bold leading-tight mb-2 line-clamp-2 min-h-[2.5rem]" title={movie.title}>
          {movie.title}
        </h3>

        <div className="flex justify-between items-center text-xs font-bold text-gray-600 mb-4">
          <span>{movie.year || 'N/A'}</span>
          {movie.rating && (
            <span className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span>{movie.rating.split('/')[0]}</span>
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-2">
          <Button
            variant={actionType === 'add' ? 'primary' : 'secondary'}
            onClick={onAction}
            className="w-full flex items-center justify-center gap-2 text-xs py-2 font-bold"
          >
            {actionType === 'add' ? <Plus size={14} /> : <Trash2 size={14} />}
            {actionType === 'add' ? 'Add' : 'Remove'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;