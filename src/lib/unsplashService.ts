// Unsplash API service for fetching contextual images
// Documentation: https://unsplash.com/documentation

// We're using the Unsplash Source API which doesn't require authentication
// Note: For production usage with higher rate limits, use the official Unsplash API with authentication

/**
 * Fetch a random image from Unsplash based on search terms
 * @param keywords Search terms for the image
 * @param width Image width
 * @param height Image height
 * @returns URL to the image
 */
export const getUnsplashImage = (keywords: string, width: number = 800, height: number = 600): string => {
  // URL encode the keywords
  const query = encodeURIComponent(keywords);
  
  // Unsplash Source API format: https://source.unsplash.com/{size}/?{keywords}
  return `https://source.unsplash.com/random/${width}x${height}/?${query}`;
};

/**
 * Get a random daily image for a specific keyword that won't change throughout the day
 * Good for consistent UI elements or page headers
 * @param keyword Search term for the image
 * @param width Image width
 * @param height Image height
 * @returns URL to the image
 */
export const getDailyUnsplashImage = (keyword: string, width: number = 800, height: number = 600): string => {
  // URL encode the keyword
  const query = encodeURIComponent(keyword);
  
  // Daily photo that changes once per day
  return `https://source.unsplash.com/random/daily/${width}x${height}/?${query}`;
};

/**
 * Get a specific, deterministic image for a given keyword
 * Always returns the same image for the same keyword
 * @param keyword Search term for the image
 * @param width Image width
 * @param height Image height
 * @returns URL to the image
 */
export const getConsistentUnsplashImage = (keyword: string, width: number = 800, height: number = 600): string => {
  // URL encode the keyword
  const query = encodeURIComponent(keyword);
  
  // Using the feature to get deterministic images based on keyword
  return `https://source.unsplash.com/featured/${width}x${height}/?${query}`;
}; 