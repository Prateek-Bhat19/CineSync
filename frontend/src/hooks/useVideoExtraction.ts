import { useState } from 'react';
import { videoExtractionService, VideoExtraction } from '../services/video-extraction.service';
import { isValidVideoUrl } from '../utils/validators';

export const useVideoExtraction = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [extraction, setExtraction] = useState<VideoExtraction | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const analyzeVideo = async () => {
    setError('');
    setSuccess('');

    if (!isValidVideoUrl(videoUrl)) {
      setError('Please enter a valid YouTube Shorts URL');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await videoExtractionService.analyzeVideo(videoUrl);
      
      if (result.extraction) {
        setExtraction(result.extraction);
        setSuccess(`Found ${result.extraction.extractedMovies.length} movies!`);
      } else {
        setError(result.message || 'No movies found in this video');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze video');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setVideoUrl('');
    setExtraction(null);
    setError('');
    setSuccess('');
  };

  return {
    videoUrl,
    setVideoUrl,
    extraction,
    isAnalyzing,
    error,
    success,
    analyzeVideo,
    reset
  };
};
