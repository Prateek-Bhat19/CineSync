const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = (): string | null => {
  return localStorage.getItem('cinesync_token');
};

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
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw error;
  }

  return response.json();
};

const apiService = {
  get: async (url: string, config?: any) => {
    const response = await apiClient(url, { method: 'GET', ...config });
    return { data: response };
  },
  post: async (url: string, data?: any) => {
    const response = await apiClient(url, { method: 'POST', body: JSON.stringify(data) });
    return { data: response };
  },
  delete: async (url: string) => {
    const response = await apiClient(url, { method: 'DELETE' });
    return { data: response };
  }
};

export interface ExtractedMovie {
  title: string;
  year?: number;
  confidence: 'high' | 'medium' | 'low';
  tmdbId?: number;
  posterPath?: string;
  overview?: string;
}

export interface VideoExtraction {
  id: string;
  videoUrl: string;
  platform: 'youtube';
  videoTitle?: string;
  extractedMovies: ExtractedMovie[];
  extractedAt: Date;
}

export interface AnalyzeVideoResponse {
  message: string;
  extraction: VideoExtraction | null;
}

export interface AddToListRequest {
  movieIds: number[];
  destination: {
    type: 'personal' | 'space';
    listId?: string;
  };
}

class VideoExtractionService {
  /**
   * Analyze video URL and extract movies
   */
  async analyzeVideo(videoUrl: string): Promise<AnalyzeVideoResponse> {
    const response = await apiService.post('/video-extraction/analyze', { videoUrl });
    return response.data;
  }

  /**
   * Add extracted movies to watchlist or space
   */
  async addMoviesToList(
    extractionId: string,
    request: AddToListRequest
  ): Promise<{ message: string; addedCount: number }> {
    const response = await apiService.post(
      `/video-extraction/${extractionId}/add-to-list`,
      request
    );
    return response.data;
  }

  /**
   * Get extraction history
   */
  async getExtractionHistory(page = 1, limit = 10): Promise<{
    extractions: VideoExtraction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const response = await apiService.get('/video-extraction/history', {
      params: { page, limit }
    });
    return response.data;
  }

  /**
   * Delete extraction
   */
  async deleteExtraction(extractionId: string): Promise<{ message: string }> {
    const response = await apiService.delete(`/video-extraction/${extractionId}`);
    return response.data;
  }

  /**
   * Validate video URL
   */
  isValidVideoUrl(url: string): { valid: boolean; platform?: 'youtube' } {
    // YouTube patterns
    const youtubePatterns = [
      /(?:youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/
    ];

    for (const pattern of youtubePatterns) {
      if (pattern.test(url)) {
        return { valid: true, platform: 'youtube' };
      }
    }

    return { valid: false };
  }
}

export const videoExtractionService = new VideoExtractionService();
