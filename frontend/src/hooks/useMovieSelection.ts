import { useState } from 'react';

export const useMovieSelection = () => {
  const [selectedMovies, setSelectedMovies] = useState<Set<number>>(new Set());

  const toggleMovie = (tmdbId: number) => {
    const newSelected = new Set(selectedMovies);
    if (newSelected.has(tmdbId)) {
      newSelected.delete(tmdbId);
    } else {
      newSelected.add(tmdbId);
    }
    setSelectedMovies(newSelected);
  };

  const selectAll = (movieIds: number[]) => {
    setSelectedMovies(new Set(movieIds));
  };

  const deselectAll = () => {
    setSelectedMovies(new Set());
  };

  const isSelected = (tmdbId: number) => {
    return selectedMovies.has(tmdbId);
  };

  return {
    selectedMovies,
    toggleMovie,
    selectAll,
    deselectAll,
    isSelected,
    selectedCount: selectedMovies.size
  };
};
