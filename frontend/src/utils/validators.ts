/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate if URL is a YouTube Shorts video
 */
export const isValidVideoUrl = (url: string): boolean => {
  if (!isValidUrl(url)) return false;
  
  const youtubePattern = /(?:youtube\.com\/shorts\/|youtu\.be\/)/;
  
  return youtubePattern.test(url);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

/**
 * Validate space name (non-empty, reasonable length)
 */
export const isValidSpaceName = (name: string): boolean => {
  return name.trim().length > 0 && name.trim().length <= 50;
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
