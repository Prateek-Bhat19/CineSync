import { User, Space, Movie, AuthResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token management
const getToken = (): string | null => {
  return localStorage.getItem('cinesync_token');
};

const setToken = (token: string): void => {
  localStorage.setItem('cinesync_token', token);
};

const removeToken = (): void => {
  localStorage.removeItem('cinesync_token');
  localStorage.removeItem('cinesync_current_user');
};

// HTTP client wrapper
const apiClient = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

// --- Auth API ---

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const data = await apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  setToken(data.token);
  localStorage.setItem('cinesync_current_user', JSON.stringify(data));
  return data;
};

export const register = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  const data = await apiClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
  
  setToken(data.token);
  localStorage.setItem('cinesync_current_user', JSON.stringify(data));
  return data;
};

export const getSession = async (): Promise<AuthResponse | null> => {
  try {
    const token = getToken();
    if (!token) return null;

    const data = await apiClient('/auth/session');
    return { ...data, token };
  } catch (error) {
    removeToken();
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient('/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    removeToken();
  }
};

// --- Space API ---

export const getSpaces = async (userId: string): Promise<Space[]> => {
  return apiClient('/spaces');
};

export const createSpace = async (userId: string, name: string): Promise<Space> => {
  return apiClient('/spaces', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
};

export const addMemberToSpace = async (spaceId: string, email: string): Promise<void> => {
  // Now sends an invitation instead of directly adding member
  await apiClient('/invitations', {
    method: 'POST',
    body: JSON.stringify({ spaceId, email }),
  });
};

export const addMovieToSpace = async (spaceId: string, movie: Movie): Promise<void> => {
  await apiClient(`/spaces/${spaceId}/movies`, {
    method: 'POST',
    body: JSON.stringify(movie),
  });
};

export const removeMovieFromSpace = async (spaceId: string, movieId: string): Promise<void> => {
  await apiClient(`/spaces/${spaceId}/movies/${movieId}`, {
    method: 'DELETE',
  });
};

// --- Invitation API ---

export interface Invitation {
  id: string;
  space: {
    id: string;
    name: string;
    description: string;
  };
  invitedBy: {
    username: string;
    email: string;
  };
  createdAt: Date;
}

export const getPendingInvitations = async (): Promise<Invitation[]> => {
  return apiClient('/invitations/pending');
};

export const acceptInvitation = async (invitationId: string): Promise<void> => {
  await apiClient(`/invitations/${invitationId}/accept`, {
    method: 'POST',
  });
};

export const rejectInvitation = async (invitationId: string): Promise<void> => {
  await apiClient(`/invitations/${invitationId}/reject`, {
    method: 'POST',
  });
};

// --- Movie API (Personal List) ---

export const getPersonalMovies = async (userId: string): Promise<Movie[]> => {
  return apiClient('/movies/personal');
};

export const addMovieToPersonal = async (userId: string, movie: Movie): Promise<void> => {
  await apiClient('/movies/personal', {
    method: 'POST',
    body: JSON.stringify(movie),
  });
};

export const removeMovieFromPersonal = async (userId: string, movieId: string): Promise<void> => {
  await apiClient(`/movies/personal/${movieId}`, {
    method: 'DELETE',
  });
};
