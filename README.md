# 🎶 SynthSpells

**AI-powered playlist summoner** — Generate YouTube playlists from text prompts

![App Preview](./public/cover.png)

## 🔗 Demo
https://synthspells.vercel.app/

## What is SynthSpells?

SynthSpells is a web app that lets you **create playlists** based on moods or situations.  
Simply type what you want, and the app will fetch a matching YouTube playlist.

Examples:

>- *"Chill songs for studying"*
>- *"Anime songs"*

It also supports direct playlist URLs or prompt-based routes:

>- https://synthspells.vercel.app/city-pop-80s-japan  
>- https://synthspells.vercel.app/PLRswASHacZ9V1lIVh-IGESiRFlYoL8I-y  

How it works:
1. **ChatGPT** converts your text prompt into a potential YouTube playlist name (e.g., `lofi chill cafe playlist`)  
2. The **YouTube Data API** searches for the playlist  
3. The app lists the songs and lets you play them instantly  

## 🧱 Tech Stack

- **Framework**: Next.js + TypeScript + Tailwind CSS  
- **AI**: OpenAI ChatGPT  
- **Music API**: YouTube Data API  
- **Hosting**: Vercel  

## 🚀 Getting Started

**Create a `.env.local` file**

```env
OPENAI_API_KEY=your_openai_key
YOUTUBE_API_KEY=your_youtube_key
```

```bash
git clone https://github.com/Patipat003/synthspells
cd synthspells
npm install
npm run dev
```
