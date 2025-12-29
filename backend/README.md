# CineSync Backend API

Backend server for CineSync - A movie tracking and recommendation application.

## Tech Stack

- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **MongoDB** with **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Configure environment variables in `.env`:
   - Set `MONGODB_URI` to your MongoDB connection string
   - Set `JWT_SECRET` to a secure random string
   - Optionally configure `PORT` and other settings

### Running the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

**Seed database (optional):**
```bash
npm run seed
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/session` - Get current session (protected)
- `POST /api/auth/logout` - Logout (protected)

### Spaces

- `GET /api/spaces` - Get user's spaces (protected)
- `POST /api/spaces` - Create new space (protected)
- `POST /api/spaces/:spaceId/members` - Add member to space (protected)
- `POST /api/spaces/:spaceId/movies` - Add movie to space (protected)
- `DELETE /api/spaces/:spaceId/movies/:movieId` - Remove movie from space (protected)

### Movies

- `GET /api/movies/personal` - Get personal movie list (protected)
- `POST /api/movies/personal` - Add movie to personal list (protected)
- `DELETE /api/movies/personal/:movieId` - Remove movie from personal list (protected)

## Database Schema

### User
- `username`: String (required)
- `email`: String (required, unique)
- `password`: String (hashed, required)
- `createdAt`: Date

### Space
- `name`: String (required)
- `description`: String
- `ownerId`: ObjectId (ref: User)
- `memberIds`: [ObjectId] (ref: User)
- `movies`: [Movie] (embedded)
- `createdAt`: Date

### PersonalList
- `userId`: ObjectId (ref: User, unique)
- `movies`: [Movie] (embedded)
- `createdAt`: Date

### Movie (Embedded)
- `id`: String
- `title`: String
- `year`: String
- `genre`: [String]
- `plot`: String
- `posterUrl`: String (optional)
- `rating`: String (optional)
- `director`: String (optional)
- `runtime`: String (optional)
- `actors`: [String] (optional)

## MongoDB Setup

### Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   mongod
   ```
3. Use connection string: `mongodb://localhost:27017/cinesync`

### MongoDB Atlas (Cloud)

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string and add to `.env`
4. Whitelist your IP address

## Development

The server uses `nodemon` and `tsx` for hot-reloading during development. Any changes to TypeScript files will automatically restart the server.
