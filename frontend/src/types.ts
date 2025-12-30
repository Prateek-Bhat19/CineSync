export interface Movie {
  id: string;
  tmdbId?: number;
  title: string;
  year: string;
  genre: string[];
  plot: string;
  overview?: string;
  posterUrl?: string;
  rating?: string;
  director?: string;
  runtime?: string;
  actors?: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt?: string | number;
}

export interface Space {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  memberIds: string[];
  movies: Movie[];
  createdAt: number;
}

// Response format for our simulated API
export interface AuthResponse {
  user: User;
  token: string;
}

export type View = 'LOGIN' | 'REGISTER' | 'DASHBOARD' | 'SPACE';
