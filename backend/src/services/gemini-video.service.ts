import { GoogleGenAI } from '@google/genai';

interface ExtractedMovie {
  title: string;
  year?: number;
  confidence: 'high' | 'medium' | 'low';
}

interface VideoMetadata {
  title?: string;
  description?: string;
  platform: 'youtube';
}

interface CacheEntry {
  movies: ExtractedMovie[];
  metadata: VideoMetadata;
  timestamp: number;
}

export class GeminiVideoService {
  private ai: GoogleGenAI | null = null;
  private cache = new Map<string, CacheEntry>();

  constructor() {
    // Don't initialize immediately - wait until first use
    // This prevents server crash if API key is missing
  }

  // ... (existing private methods remain unchanged)

  private ensureInitialized() {
    if (!this.ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not set in environment variables. Please add it to your .env file.');
      }
      this.ai = new GoogleGenAI({ apiKey });
    }
  }

  /**
   * Parse video URL and detect platform
   */
  parseVideoUrl(url: string): { platform: 'youtube' | null; videoId: string | null } {
    // YouTube Shorts patterns
    const youtubePatterns = [
      /(?:youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/
    ];

    // Check YouTube
    for (const pattern of youtubePatterns) {
      const match = url.match(pattern);
      if (match) {
        return { platform: 'youtube', videoId: match[1] };
      }
    }

    return { platform: null, videoId: null };
  }

  /**
   * Fetch video metadata (title, description)
   */
  async getVideoMetadata(url: string, platform: 'youtube'): Promise<VideoMetadata> {
    try {
      // For YouTube, we can extract from the page or use oEmbed
      const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
      if (response.ok) {
        const data = await response.json() as { title?: string; description?: string };
        return {
          title: data.title,
          description: data.description || '',
          platform: 'youtube'
        };
      }
    } catch (error) {
      console.error('Error fetching video metadata:', error);
    }

    return { platform };
  }

  /**
   * Extract movie names from video description using Gemini AI
   */
  async extractMoviesFromText(text: string): Promise<ExtractedMovie[]> {

    this.ensureInitialized();
    
    const prompt = `
Analyze the following text and extract ALL movie titles mentioned.

Text:
"""
${text}
"""

Instructions:
- Extract every movie title you can identify
- Include the release year if mentioned
- Rate your confidence for each movie (high/medium/low)
- High confidence: Explicitly mentioned as a movie
- Medium confidence: Likely a movie but could be ambiguous
- Low confidence: Might be a movie but uncertain

Return ONLY a valid JSON array in this exact format, with no additional text:
[
  {"title": "Movie Name", "year": 2020, "confidence": "high"},
  {"title": "Another Movie", "confidence": "medium"}
]

If no movies are found, return an empty array: []
`;

    try {

      const response = await this.ai!.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      

      const responseText = response.text || '';

      
      // Extract JSON from the response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const movies = JSON.parse(jsonMatch[0]);

        return movies;
      }
      

      return [];
    } catch (error: any) {
      console.error('Error extracting movies from text:');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error status:', error.status);
      console.error('Full error:', JSON.stringify(error, null, 2));
      
      // Provide helpful error messages
      if (error.status === 429) {
        throw new Error('Gemini API rate limit exceeded. Please try again in a few moments.');
      } else if (error.status === 403) {
        throw new Error('Gemini API key is invalid or does not have access. Please check your API key.');
      } else if (error.status === 404) {
        throw new Error('Gemini model not found. The API key might not have access to this model.');
      }
      
      throw new Error(`Failed to analyze video: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Analyze video content using Gemini AI with video understanding
   * This analyzes the actual video content (visual + audio), not just description
   */
  async analyzeVideoContent(videoUrl: string, platform: 'youtube'): Promise<ExtractedMovie[]> {

    this.ensureInitialized();
    
    const prompt = `
Analyze this ${platform} video and extract ALL movie titles mentioned or shown:

IMPORTANT: Look for movies in:
1. Spoken dialogue/narration (what people say in the video)
2. Visual elements (movie posters, screenshots, title cards shown on screen)
3. Text overlays and captions
4. Any references to movies in any form

For each movie found, provide:
- Exact title (as accurately as possible)
- Release year (if you can determine it from context)
- Confidence level:
  * "high": Clearly and explicitly mentioned or shown
  * "medium": Strongly implied or partially visible
  * "low": Possibly referenced but uncertain

Return ONLY a valid JSON array in this exact format, with no additional text:
[
  {"title": "Movie Name", "year": 2020, "confidence": "high"},
  {"title": "Another Movie", "confidence": "medium"}
]

If no movies are found, return an empty array: []
`;

    try {

      
      // Use Gemini's multimodal capabilities to analyze the video
      const response = await this.ai!.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              { 
                fileData: {
                  mimeType: 'video/*',
                  fileUri: videoUrl
                }
              }
            ]
          }
        ]
      });
      

      
      const responseText = response.text || '';
      // Extract JSON from the response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const movies = JSON.parse(jsonMatch[0]);

        return movies;
      }
      

      return [];
      
    } catch (error: any) {
      console.error('Error analyzing video content:');
      console.error('Error details:', error);
      
      // If video analysis fails, fall back to description analysis

      const metadata = await this.getVideoMetadata(videoUrl, platform);
      const textToAnalyze = `${metadata.title || ''}\n\n${metadata.description || ''}`;
      
      if (textToAnalyze.trim()) {
        return await this.extractMoviesFromText(textToAnalyze);
      }
      
      throw new Error('Failed to analyze video content');
    }
  }

  /**
   * Main entry point for video extraction
   */
  async extractMoviesFromVideo(videoUrl: string): Promise<{
    movies: ExtractedMovie[];
    metadata: VideoMetadata;
  }> {
    // Check cache first
    const cleanUrl = videoUrl.trim();

    
    if (this.cache.has(cleanUrl)) {
      const cached = this.cache.get(cleanUrl)!;
      return { movies: cached.movies, metadata: cached.metadata };
    }
    



    
    // Parse URL and detect platform
    const { platform, videoId } = this.parseVideoUrl(videoUrl);
    
    if (!platform || !videoId) {
      console.error('Invalid video URL:', videoUrl);
      throw new Error('Invalid video URL. Please provide a valid YouTube Shorts URL.');
    }



    // Get video metadata

    const metadata = await this.getVideoMetadata(videoUrl, platform);


    // Extract movies from video content

    const movies = await this.analyzeVideoContent(videoUrl, platform);


    // Cache the result
    this.cache.set(cleanUrl, {
      movies,
      metadata,
      timestamp: Date.now()
    });

    return { movies, metadata };
  }
}

export const geminiVideoService = new GeminiVideoService();
