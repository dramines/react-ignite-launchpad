const imageCache = new Map<string, HTMLImageElement>();
const videoCache = new Map<string, HTMLVideoElement>();

// Quality levels for different image sizes
const QUALITY_LEVELS = {
  thumbnail: 40,  // Very low quality for thumbnails
  preview: 60,    // Medium quality for previews
  full: 75       // Higher quality for full view
};

export const optimizeImageUrl = (url: string, width: number = 800, quality?: 'thumbnail' | 'preview' | 'full'): string => {
  // If it's already an optimized URL or not a valid URL, return as is
  if (!url || url.includes('?w=') || !url.startsWith('http')) {
    return url;
  }

  // Determine quality based on width and requested quality level
  let imageQuality = QUALITY_LEVELS.preview; // default
  if (quality) {
    imageQuality = QUALITY_LEVELS[quality];
  } else if (width <= 200) {
    imageQuality = QUALITY_LEVELS.thumbnail;
  } else if (width >= 800) {
    imageQuality = QUALITY_LEVELS.full;
  }

  // Add quality and width parameters
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}w=${width}&q=${imageQuality}&blur=1`;
};

export const preloadVideo = (src: string): Promise<void> => {
  if (videoCache.has(src)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    
    video.onloadeddata = () => {
      videoCache.set(src, video);
      resolve();
    };
    video.onerror = reject;
    
    video.src = src;
  });
};

export const preloadImage = (src: string, width: number = 800, quality?: 'thumbnail' | 'preview' | 'full'): Promise<void> => {
  const optimizedSrc = optimizeImageUrl(src, width, quality);
  
  if (imageCache.has(optimizedSrc)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      imageCache.set(optimizedSrc, img);
      resolve();
    };
    img.onerror = reject;
    
    img.loading = 'lazy';
    img.decoding = 'async';
    
    img.src = optimizedSrc;
  });
};

export const generateSrcSet = (src: string, quality?: 'thumbnail' | 'preview' | 'full'): string => {
  if (!src) return '';
  
  // Optimized sizes for better performance
  const sizes = [160, 320, 480, 640, 800];
  return sizes
    .map(size => `${optimizeImageUrl(src, size, quality)} ${size}w`)
    .join(', ');
};

// Clear cache when it gets too large
export const clearImageCache = () => {
  if (imageCache.size > 100) {
    imageCache.clear();
  }
  if (videoCache.size > 20) {
    videoCache.clear();
  }
};