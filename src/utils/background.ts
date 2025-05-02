export const setBackgroundImage = (element: HTMLElement, imageUrl: string, isDark: boolean) => {
  const gradient = isDark
    ? 'rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)'
    : 'rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)';
  element.style.backgroundImage = `linear-gradient(${gradient}), url('${imageUrl}')`;
};

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
  'https://images.unsplash.com/photo-1472396961693-142e6e269027'
];

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

export const getRandomImage = async () => {
  if (!UNSPLASH_ACCESS_KEY) {
    return DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)];
  }
  try {
    const response = await fetch(
      'https://api.unsplash.com/photos/random?query=nature,landscape&orientation=landscape',
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          'Accept-Version': 'v1'
        }
      }
    );
    if (!response.ok) throw new Error();
    const data = await response.json();
    return data.urls.regular;
  } catch {
    return DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)];
  }
}; 