import { useState, useEffect } from 'react';
import { getSpaces, createSpace, addMovieToSpace, removeMovieFromSpace, addMemberToSpace } from '../services/api.service';
import { Space, Movie } from '../types';

export const useSpaces = (userId: string) => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSpaces = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSpaces(userId);
      setSpaces(data);
    } catch (err) {
      setError('Failed to load spaces');
      console.error('Failed to load spaces:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadSpaces();
    }
  }, [userId]);

  const createNewSpace = async (name: string) => {
    if (!name.trim()) return;
    try {
      const newSpace = await createSpace(userId, name);
      setSpaces([...spaces, newSpace]);
      return newSpace;
    } catch (err) {
      setError('Failed to create space');
      console.error('Failed to create space:', err);
      throw err;
    }
  };

  const addMovie = async (spaceId: string, movie: Movie) => {
    try {
      await addMovieToSpace(spaceId, movie);
      await loadSpaces(); // Refresh to get updated data
    } catch (err) {
      setError('Failed to add movie');
      console.error('Failed to add movie:', err);
      throw err;
    }
  };

  const removeMovie = async (spaceId: string, movieId: string) => {
    try {
      await removeMovieFromSpace(spaceId, movieId);
      await loadSpaces(); // Refresh to get updated data
    } catch (err) {
      setError('Failed to remove movie');
      console.error('Failed to remove movie:', err);
      throw err;
    }
  };

  const inviteMember = async (spaceId: string, email: string) => {
    try {
      await addMemberToSpace(spaceId, email);
    } catch (err) {
      setError('Failed to invite member');
      console.error('Failed to invite member:', err);
      throw err;
    }
  };

  const selectedSpace = spaces.find(s => s.id === selectedSpaceId);

  return {
    spaces,
    selectedSpace,
    selectedSpaceId,
    setSelectedSpaceId,
    isLoading,
    error,
    createNewSpace,
    addMovie,
    removeMovie,
    inviteMember,
    refreshSpaces: loadSpaces
  };
};
