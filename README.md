# CineSync - Movie Tracking & Recommendation App

A full-stack application for tracking movies, creating shared spaces with friends, and getting AI-powered recommendations using Google Gemini.

## Tech Stack

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS
- Lucide Icons
- Google Gemini AI

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- TypeScript

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Gemini API Key (for AI features)
- TMDB API Key (for movie data)

## Setup Instructions

### 1. Backend Setup

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in the backend folder (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/cinesync  # or your Atlas connection string
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:5173
   ```

### 2. Frontend Setup

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` (or `.env.local`) file:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables:
   ```env
   # Gemini API Key for AI recommendations
   VITE_GEMINI_API_KEY=your-gemini-api-key
   
   # TMDB API Key for movie search and posters
   # Get your free API key at: https://www.themoviedb.org/settings/api
   VITE_TMDB_API_KEY=your-tmdb-api-key
   
   # Backend API URL
   VITE_API_URL=http://localhost:5000/api
   ```

## Running the Application

### Run Both Frontend and Backend (Recommended)

From the **root** directory:
```bash
npm run dev:all
```

This will start:
- Frontend on `http://localhost:5173`
- Backend on `http://localhost:5000`

## Deployment

We recommend deploying the **Backend to Render** and the **Frontend to Vercel**.

### Backend (Render)
- **Build Command:** `npm install --include=dev && npm run build`
- **Start Command:** `npm start`
- **Env Vars:** `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL` (your Vercel URL).

### Frontend (Vercel)
- **Framework:** Vite
- **Root Directory:** `frontend`
- **Env Vars:** `VITE_API_URL` (your Render URL), `VITE_TMDB_API_KEY`, `VITE_GEMINI_API_KEY`.

## Project Structure

```
cinesync/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth & error middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── server.ts       # Main server file
│   └── package.json
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.tsx         # Main App component
│   └── package.json
├── package.json            # Root orchestration
└── README.md
```

## Features

- **Secure Auth:** JWT-based authentication with password encryption.
- **Movie Search:** Real-time search using TMDB API with debouncing and caching.
- **Watchlists:** Manage your personal movie list.
- **Shared Spaces:** Create spaces, invite friends, and manage movies together.
- **AI Recommendations:** Get personalized movie suggestions powered by Google Gemini.
- **Responsive Design:** Fully responsive UI with a retro-modern aesthetic.

## License

ISC
