import { GoogleGenAI, Type } from "@google/genai";
import { Movie } from "../types";

// Initialize Gemini Client
// We assume process.env.API_KEY is available in this environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Enhanced Schema for "Proper" Movie Data
const movieSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    year: { type: Type.STRING },
    genre: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    plot: { type: Type.STRING },
    rating: { type: Type.STRING, description: "IMDb style rating e.g. 8.5/10" },
    director: { type: Type.STRING },
    runtime: { type: Type.STRING, description: "e.g. 1h 55m" },
    actors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Top 3 main actors"
    }
  },
  required: ["title", "year", "genre", "plot", "rating", "director", "runtime", "actors"]
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query) return [];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search for movies matching the query: "${query}". Return a list of 5 relevant movies. Provide accurate details including director, runtime, and main actors.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: movieSchema
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    
    return data.map((m: any, idx: number) => ({
      ...m,
      // In a real app, we might use an external ID (IMDB ID), here we generate a stable-ish ID
      id: `gemini-${m.title.toLowerCase().replace(/\s/g, '-')}-${m.year}`,
      posterUrl: `https://picsum.photos/seed/${m.title.replace(/\s/g, '')}/300/450`
    }));

  } catch (error) {
    console.error("Gemini Search Error:", error);
    return [];
  }
};

export const getRecommendations = async (userMovies: Movie[]): Promise<Movie[]> => {
  if (userMovies.length === 0) return [];
  
  const movieTitles = userMovies.map(m => m.title).join(", ");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on these movies: ${movieTitles}, recommend 3 similar movies that are NOT in the list. Focus on hidden gems or highly rated classics similar in tone.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: movieSchema
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    return data.map((m: any, idx: number) => ({
      ...m,
      id: `rec-${m.title.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`,
      posterUrl: `https://picsum.photos/seed/${m.title.replace(/\s/g, '')}/300/450`
    }));

  } catch (error) {
    console.error("Gemini Recs Error:", error);
    return [];
  }
};
