// app/api/playlist/route.ts
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { searchYouTubePlaylist, getPlaylistItems } from '@/utils/youtube';

interface Song {
  title: string;
  artist: string;
  videoId: string;
  thumbnail: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Ask OpenAI to create a search query for YouTube playlist
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that creates YouTube playlist search queries.
                Based on the user's request, create a concise search query that would find a relevant playlist on YouTube.
                
                Examples:
                - "lofi hip hop chill music" → "lofi hip hop chill"
                - "90s rock hits" → "90s rock hits"
                - "workout motivation music" → "workout motivation"
                - "jazz for studying" → "jazz study"
                
                Return only the search query, nothing else.`,
        },
        { role: 'user', content: prompt },
      ],
    });

    const searchQuery = completion.choices[0].message.content?.trim();
    if (!searchQuery) {
      return NextResponse.json({ error: 'No search query generated' }, { status: 500 });
    }

    console.log('Generated search query:', searchQuery);

    // Search for a playlist
    const playlistInfo = await searchYouTubePlaylist(searchQuery);
    if (!playlistInfo) {
      return NextResponse.json({ error: 'No playlist found' }, { status: 404 });
    }

    console.log('Found playlist:', playlistInfo.playlistTitle);

    // Get songs from the playlist
    const songs = await getPlaylistItems(playlistInfo.playlistId, 10);
    
    if (songs.length === 0) {
      return NextResponse.json({ error: 'No songs found in playlist' }, { status: 404 });
    }

    return NextResponse.json({ 
      songs,
      playlistInfo: {
        title: playlistInfo.playlistTitle,
        thumbnail: playlistInfo.playlistThumbnail
      }
    });

  } catch (error) {
    console.error('Playlist route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected error' },
      { status: 500 }
    );
  }
}