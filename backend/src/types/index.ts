export interface Movie {
  id: string;
  title: string;
  year: string;
  genre: string[];
  plot: string;
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

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthRequest {
  userId: string;
  email: string;
}

// Express Request extension
declare global {
  namespace Express {
    interface Request {
      user?: AuthRequest;
    }
  }
}
