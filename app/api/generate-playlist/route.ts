import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { searchYouTubePlaylist, getPlaylistItems } from "@/utils/youtube";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that creates YouTube search queries or extracts YouTube IDs.

          Given the user's input, do the following:

          - If the input is a YouTube playlist URL, extract and return only the playlist ID.
          - If the input is a YouTube video URL, extract and return only the video ID.
          - Otherwise, create a concise search query that would find a relevant playlist on YouTube by shortening or simplifying the user's input.

          Examples:
          - Input: "https://www.youtube.com/playlist?list=PL123ABC" → Output: "PL123ABC"
          - Input: "lofi hip hop chill music" → Output: "lofi hip hop chill"
          - Input: "90s rock hits" → Output: "90s rock hits"
          - Input: "workout motivation music" → Output: "workout motivation"
          - Input: "jazz for studying" → Output: "jazz study"

          Return only the extracted ID or search query, nothing else.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const searchQuery = completion.choices[0].message.content?.trim();
    if (!searchQuery) {
      return NextResponse.json(
        { error: "No search query generated" },
        { status: 500 }
      );
    }

    console.log("Generated search query:", searchQuery);

    const playlistInfo = await searchYouTubePlaylist(searchQuery);
    if (!playlistInfo) {
      return NextResponse.json({ error: "No playlist found" }, { status: 404 });
    }

    console.log("Found playlist:", playlistInfo.playlistTitle);

    const findsong = await getPlaylistItems(playlistInfo.playlistId, 50);

    const songs = findsong
      .slice()
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));

    if (songs.length === 0) {
      return NextResponse.json(
        { error: "No songs found in playlist" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      songs,
      playlistInfo: {
        title: playlistInfo.playlistTitle,
        thumbnail: playlistInfo.playlistThumbnail,
      },
    });
  } catch (error) {
    console.error("Playlist route error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
