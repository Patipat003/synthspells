export async function searchYouTube(query: string): Promise<{ videoId: string; thumbnail: string }> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return { videoId: 'O48gok_FLCg', thumbnail: '' };

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&key=${apiKey}`;
  console.log("YouTube search URL:", url);
  try {
    const res = await fetch(url);
    if (!res.ok) return { videoId: '', thumbnail: '' };
    const data = await res.json();

    const item = data.items?.[0];
    if (!item || !item.id?.videoId) return { videoId: '', thumbnail: '' };

    return {
      videoId: item.id.videoId || 'O48gok_FLCg',
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
    };
  } catch (error) {
    console.error("YouTube search error:", error);
    return { videoId: 'O48gok_FLCg', thumbnail: '' };
  }
}
