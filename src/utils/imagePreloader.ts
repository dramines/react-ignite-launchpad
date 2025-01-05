export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadImages = async (images: string[]): Promise<void[]> => {
  const preloadPromises = images.map(src => preloadImage(src));
  return Promise.all(preloadPromises);
};

export const criticalImages = [
  '/banner.png',
  '/banner2.png',
  '/banner3.png',
  '/logo.png',
  '/Men1.png',
  '/Men2.png',
  '/Men3.png'
];

export const secondaryImages = [
  '/Articles/1.png',
  '/Articles/2.png',
  '/Articles/3.png',
  '/Articles/4.png'
];