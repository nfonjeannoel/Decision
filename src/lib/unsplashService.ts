// Unsplash API service for fetching contextual images
// Documentation: https://unsplash.com/documentation

// NOTE: Unsplash Source API (source.unsplash.com) has been deprecated and is being shut down
// This implementation uses pre-selected images from Unsplash with direct URLs
// For production use, you should use the official Unsplash API with authentication

/**
 * Fetch a specific image for a search term
 * Using direct Unsplash image URLs for reliability
 * @param keywords Search terms for the image
 * @returns URL to the image
 */
export const getUnsplashImage = (keywords: string): string => {
  // Use a set of pre-selected images based on keywords
  const imageMap: Record<string, string> = {
    // Default images for common search terms
    'decision': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop',
    'choice': 'https://images.unsplash.com/photo-1629739884942-2a1d64dc7072?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop',
    'brainstorming': 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop',
    'teamwork': 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop',
    'analysis': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop',
    'strategy': 'https://images.unsplash.com/photo-1535572290543-960a8046f5af?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop',
    'planning': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop',
    'comparison': 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop',
    'data': 'https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop',
    'analytics': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop',
    'solution': 'https://images.unsplash.com/photo-1518349619113-03114f06ac3a?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop',
    'recommendation': 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop',
    'success': 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop',
    'achievement': 'https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop',
  };

  // Banner images - wider format
  const bannerImages = [
    'https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920&h=600&fit=crop'
  ];

  // Try to find a match for the keyword
  const keyword = keywords.toLowerCase().split(' ')[0];
  if (keyword in imageMap) {
    return imageMap[keyword];
  }

  // If we're looking for a banner (based on dimensions in the keyword)
  if (keywords.includes('1920') || keywords.includes('banner')) {
    // Use Math.random to select a random banner
    const randomIndex = Math.floor(Math.random() * bannerImages.length);
    return bannerImages[randomIndex];
  }

  // Fallback image if no keyword matches
  return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop';
};

/**
 * Get a consistent banner image that won't change
 * @returns URL to the banner image
 */
export const getDailyUnsplashImage = (): string => {
  // Return a specific banner image
  return 'https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920&h=600&fit=crop';
};

/**
 * Get a specific, deterministic image for a given keyword
 * Always returns the same image for the same keyword
 * @param keyword Search term for the image
 * @returns URL to the image
 */
export const getConsistentUnsplashImage = (keyword: string): string => {
  // Map of keywords to specific images
  const imageMap: Record<string, string> = {
    'decision making choice options selection': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop',
    'analysis strategy priority planning': 'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop',
    'comparison data analytics visualization': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop',
    'solution recommendation success achievement': 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop',
  };

  // Return the matched image or a fallback
  return imageMap[keyword] || 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop';
}; 