const imageCache = new Map<string, HTMLImageElement>();

export const optimizeImageUrl = (url: string, width: number = 800): string => {
  // If it's already an optimized URL or not a valid URL, return as is
  if (!url || url.includes('?w=') || !url.startsWith('http')) {
    return url;
  }

  // Add quality and width parameters
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}w=${width}&q=75`;
};

export const preloadImage = (src: string, width: number = 800): Promise<void> => {
  const optimizedSrc = optimizeImageUrl(src, width);
  
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
    
    // Set loading and decoding attributes
    img.loading = 'lazy';
    img.decoding = 'async';
    
    // Set source last
    img.src = optimizedSrc;
  });
};

export const generateSrcSet = (src: string): string => {
  if (!src) return '';
  
  const sizes = [320, 640, 768, 1024, 1280];
  return sizes
    .map(size => `${optimizeImageUrl(src, size)} ${size}w`)
    .join(', ');
};

// Clear cache when it gets too large
export const clearImageCache = () => {
  if (imageCache.size > 100) {
    imageCache.clear();
  }
};