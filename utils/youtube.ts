export async function searchYouTube(query: string): Promise<{ videoId: string; thumbnail: string } | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return null;

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&key=${apiKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    const item = data.items?.[0];
    if (!item || !item.id?.videoId) return null;

    return {
      videoId: item.id.videoId,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
    };
  } catch (error) {
    console.error("YouTube search error:", error);
    return null;
  }
}

export const fallbackVideoIds = [
  '5qap5aO4i9A',
  'jfKfPfyJRdk',
  'DWcJFNfaw9c',
  'lTRiuFIWV54',
  'tJYLxjInP0g',
];

export function getRandomFallbackVideoId(): string {
  return fallbackVideoIds[Math.floor(Math.random() * fallbackVideoIds.length)];
}
