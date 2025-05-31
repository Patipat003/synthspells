import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { searchYouTube, getRandomFallbackVideoId } from '@/utils/youtube';

interface Song {
  title: string;
  artist: string;
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

    // Ask OpenAI for 10 songs
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that suggests songs.
                Return a list of 10 songs in the following JSON format:
                [{"title": "song title", "artist": "artist name"}]`,
        },
        { role: 'user', content: prompt },
      ],
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      return NextResponse.json({ error: 'No content from OpenAI' }, { status: 500 });
    }

    let songsFromAI: Song[] = [];
    try {
      const parsed = JSON.parse(content);
      if (!Array.isArray(parsed)) throw new Error('Invalid format');
      songsFromAI = parsed.slice(0, 10);
    } catch (err) {
      console.error('AI response parse error:', content);
      return NextResponse.json({ error: 'Invalid AI response format' }, { status: 500 });
    }

    // Search YouTube for each song
    const songs = await Promise.all(
      songsFromAI.map(async ({ title, artist }) => {
        const query = `${title} ${artist} official audio`;
        const result = await searchYouTube(query);

        return {
          title,
          artist,
          videoId: result?.videoId || getRandomFallbackVideoId(),
          thumbnail: result?.thumbnail || 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg',
        };
      })
    );

    return NextResponse.json({ songs });
  } catch (error) {
    console.error('Playlist route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected error' },
      { status: 500 }
    );
  }
}
