# CineSync - Movie Tracking & Recommendation App

A full-stack application for tracking movies, creating shared spaces with friends, and extracting movies from YouTube Shorts using AI-powered video analysis.

## Tech Stack

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS (Retro-Modern Design)
- Lucide Icons
- Google Gemini AI

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- TypeScript
- Google Gemini AI (Video Analysis)
- TMDB API Integration

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Gemini API Key (for AI-powered video extraction)
- TMDB API Key (for movie data and posters)

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
   
   # Gemini API Key (for AI-powered video movie extraction)
   # Get your free API key at: https://makersuite.google.com/app/apikey
   GEMINI_API_KEY=your-gemini-api-key
   
   # TMDB API Key (for movie data and posters)
   # Get your free API key at: https://www.themoviedb.org/settings/api
   TMDB_API_KEY=your-tmdb-api-key
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
   # Backend API URL
   VITE_API_URL=http://localhost:5000/api
   ```

## Getting API Keys

### Gemini API Key (Required for Video Extraction)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to your backend `.env` file

### TMDB API Key (Required for Movie Data)
1. Visit [TMDB Settings](https://www.themoviedb.org/settings/api)
2. Create a free account if you don't have one
3. Request an API key (choose "Developer" option)
4. Copy the API key and add it to your backend `.env` file

## Running the Application

### Run Both Frontend and Backend (Recommended)

From the **root** directory:
```bash
npm run dev:all
```

This will start:
- Frontend on `http://localhost:5173`
- Backend on `http://localhost:5000`

### Run Separately

**Backend only:**
```bash
cd backend
npm run dev
```

**Frontend only:**
```bash
cd frontend
npm run dev
```

## Deployment

We recommend deploying the **Backend to Render** and the **Frontend to Vercel**.

### Backend (Render)
- **Build Command:** `npm install --include=dev && npm run build`
- **Start Command:** `npm start`
- **Env Vars:** `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL` (your Vercel URL), `GEMINI_API_KEY`, `TMDB_API_KEY`

### Frontend (Vercel)
- **Framework:** Vite
- **Root Directory:** `frontend`
- **Env Vars:** `VITE_API_URL` (your Render backend URL)

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
│   │   ├── services/       # Business logic (Gemini, TMDB)
│   │   └── server.ts       # Main server file
│   └── package.json
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── common/    # Reusable components
│   │   │   ├── dashboard/ # Dashboard-specific components
│   │   │   └── extractor/ # Video extraction components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Main App component
│   └── package.json
├── package.json            # Root orchestration
└── README.md
```

## Features

### 🎬 YouTube Shorts Video Extraction
- **AI-Powered Analysis:** Paste a YouTube Shorts URL and let Google Gemini AI extract all movies mentioned in the video
- **Multimodal Understanding:** Analyzes video content (visuals + audio), not just descriptions
- **Smart Movie Detection:** Identifies movies from dialogue, text overlays, and visual elements
- **TMDB Integration:** Automatically fetches movie posters, ratings, and metadata
- **Batch Selection:** Select multiple extracted movies to add to your watchlist or shared spaces

### 🔐 Secure Authentication
- JWT-based authentication with password encryption
- Secure user registration and login
- Protected routes and API endpoints

### 🎥 Movie Management
- **Real-time Search:** Search movies using TMDB API with debouncing and caching
- **Personal Watchlist:** Manage your personal movie collection
- **Movie Details:** View comprehensive movie information including plot, ratings, and cast

### 👥 Shared Spaces
- **Create Spaces:** Set up collaborative movie lists with friends
- **Invite System:** Send and accept invitations to join spaces
- **Collaborative Lists:** Add and manage movies together with space members
- **Space Management:** View member lists and manage space settings

### 🎨 Modern UI/UX
- **Retro-Modern Design:** Bold, vibrant aesthetic with neo-brutalist elements
- **Fully Responsive:** Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations:** Polished transitions and micro-interactions
- **Intuitive Navigation:** Clean, user-friendly interface

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Movies
- `GET /api/movies/search` - Search movies (TMDB)
- `GET /api/movies/:id` - Get movie details
- `POST /api/movies/watchlist` - Add to watchlist
- `DELETE /api/movies/watchlist/:id` - Remove from watchlist

### Spaces
- `GET /api/spaces` - Get user's spaces
- `POST /api/spaces` - Create new space
- `POST /api/spaces/:id/movies` - Add movie to space
- `DELETE /api/spaces/:id/movies/:movieId` - Remove movie from space

### Invitations
- `GET /api/invitations` - Get user's invitations
- `POST /api/invitations` - Send invitation
- `POST /api/invitations/:id/accept` - Accept invitation
- `DELETE /api/invitations/:id` - Decline invitation

### Video Extraction
- `POST /api/video-extraction/analyze` - Analyze YouTube Shorts video
- `POST /api/video-extraction/:id/add-to-list` - Add extracted movies to list
- `GET /api/video-extraction/history` - Get extraction history
- `DELETE /api/video-extraction/:id` - Delete extraction

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or your Atlas connection string is correct
- Check firewall settings if using MongoDB Atlas

### API Key Issues
- Verify your Gemini API key is valid and has quota remaining
- Ensure TMDB API key is correctly set in backend `.env`
- Check that API keys don't have extra spaces or quotes

### Video Extraction Not Working
- Confirm Gemini API key is set in backend `.env`
- Check that the URL is a valid YouTube Shorts URL
- Review backend logs for specific error messages

## License

ISC
