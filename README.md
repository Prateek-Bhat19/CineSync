<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CineSync - Movie Tracking & Recommendation App

A full-stack application for tracking movies, creating shared spaces with friends, and getting AI-powered recommendations using Google Gemini.

## Tech Stack

**Frontend:**
- React + TypeScript
- Vite
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
- Gemini API Key

## Setup Instructions

### 1. MongoDB Setup

**Option A: Local MongoDB**
1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   mongod
   ```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get your connection string
3. Whitelist your IP address

### 2. Backend Setup

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
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:5173
   ```

### 3. Frontend Setup

1. Navigate back to root folder:
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file (copy from `.env.example`):
   ```bash
   cp .env.example .env.local
   ```

4. Configure your `.env.local` file:
   ```env
   # Gemini API Key for AI recommendations
   API_KEY=your-gemini-api-key
   
   # TMDB API Key for movie search and posters
   # Get your free API key at: https://www.themoviedb.org/settings/api
   VITE_TMDB_API_KEY=your-tmdb-api-key
   
   # Backend API URL
   VITE_API_URL=http://localhost:5000/api
   ```

   **Getting API Keys:**
   - **Gemini API**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **TMDB API**: Sign up at [TMDB](https://www.themoviedb.org/signup), then go to Settings → API to request a free API key

## Running the Application

### Run Both Frontend and Backend Together (Recommended)

```bash
npm run dev:all
```

This will start:
- Frontend on `http://localhost:5173`
- Backend on `http://localhost:5000`

### Run Separately

**Backend only:**
```bash
npm run dev:backend
```

**Frontend only:**
```bash
npm run dev
```

## Features

- 🔐 User authentication with password encryption (bcrypt)
- 🎬 Search movies using TMDB API (real movie posters and data)
- 📝 Personal movie watchlists
- 👥 Shared spaces with invitation system
- 🤖 AI-powered movie recommendations (Google Gemini)
- 💾 Real MongoDB database with Mongoose ODM
- 🔒 JWT-based authentication with secure token management

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
│   │   ├── types/          # TypeScript types
│   │   └── server.ts       # Main server file
│   ├── package.json
│   └── tsconfig.json
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── services/           # API & Gemini services
│   ├── types.ts            # TypeScript types
│   └── App.tsx             # Main App component
├── index.html
├── index.tsx
└── package.json

```

## API Endpoints

See [backend/README.md](backend/README.md) for detailed API documentation.

## Development

The application uses hot-reloading for both frontend and backend during development. Any changes will automatically refresh.

## Building for Production

**Frontend:**
```bash
npm run build
```

**Backend:**
```bash
cd backend
npm run build
```

## License

ISC

