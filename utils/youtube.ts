export async function searchYouTubePlaylist(query: string): Promise<{
  playlistId: string;
  playlistTitle: string;
  playlistThumbnail: string;
} | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return null;

  const searchQuery = `${query} playlist`;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist&maxResults=1&q=${encodeURIComponent(
    searchQuery
  )}&key=${apiKey}`;

  console.log("YouTube playlist search URL:", url);

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    const item = data.items?.[0];
    if (!item || !item.id?.playlistId) return null;

    return {
      playlistId: item.id.playlistId,
      playlistTitle: item.snippet.title,
      playlistThumbnail:
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.default?.url ||
        "",
    };
  } catch (error) {
    console.error("YouTube playlist search error:", error);
    return null;
  }
}

export async function getPlaylistItems(
  playlistId: string,
  maxResults: number
): Promise<
  {
    title: string;
    artist: string;
    videoId: string;
    thumbnail: string;
  }[]
> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${apiKey}`;

  console.log("YouTube playlist items URL:", url);

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();

    const items = data.items || [];
    const songs = items
      .map((item: any) => {
        const snippet = item.snippet;
        const title = snippet.title;

        let artist = snippet.videoOwnerChannelTitle || "Unknown Artist";
        let songTitle = title;

        if (title.includes(" - ")) {
          const parts = title.split(" - ");
          if (parts.length >= 2) {
            artist = parts[0].trim();
            songTitle = parts.slice(1).join(" - ").trim();
          }
        }

        return {
          title: songTitle,
          artist: artist.replace(/\s*-\s*Topic$/, ""),
          videoId: snippet.resourceId?.videoId || "",
          thumbnail:
            snippet.thumbnails?.high?.url ||
            snippet.thumbnails?.default?.url ||
            "",
        };
      })
      .filter((song: { videoId: string }) => song.videoId);

    interface Song {
      title: string;
      artist: string;
      videoId: string;
      thumbnail: string;
    }

    const videoIds: string[] = songs
      .map((song: Song) => song.videoId)
      .filter(Boolean);
    if (videoIds.length === 0) return songs;

    return songs.map((song: Song) => ({
      ...song,
    }));
  } catch (error) {
    console.error("YouTube playlist items error:", error);
    return [];
  }
}
