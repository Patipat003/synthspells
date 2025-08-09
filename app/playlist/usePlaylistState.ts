import { useState, useEffect, useRef } from "react";

type Song = {
  title: string;
  artist: string;
  videoId: string;
  thumbnail?: string;
};

type PlaylistInfo = {
  title: string;
  thumbnail: string;
};

const defaultSongs: Song[] = [
  {
    title:
      "Glamorous x 9 Am In Calabasas (Xxtristanxo Full TikTok Remix) [made by purple drip boy]",
    artist: "purple drip boy",
    videoId: "Wd-pEeff9Rs",
    thumbnail: "https://i.ytimg.com/vi/Wd-pEeff9Rs/hqdefault.jpg",
  },
  {
    title: "I watch the moon",
    artist: "Khaos Lan",
    videoId: "WBgpL0c9dCQ",
    thumbnail: "https://i.ytimg.com/vi/WBgpL0c9dCQ/hqdefault.jpg",
  },
  {
    title: "Fainted",
    artist: "Narvent",
    videoId: "dJWFUBAUM0E",
    thumbnail: "https://i.ytimg.com/vi/dJWFUBAUM0E/hqdefault.jpg",
  },
  {
    title: "Memory Reboot",
    artist: "Narvent",
    videoId: "wL8DVHuWI7Y",
    thumbnail: "https://i.ytimg.com/vi/wL8DVHuWI7Y/hqdefault.jpg",
  },
  {
    title: "Her Eyes",
    artist: "Narvent",
    videoId: "cIhNXNR27Sc",
    thumbnail: "https://i.ytimg.com/vi/cIhNXNR27Sc/hqdefault.jpg",
  },
  {
    title: "Dream Space",
    artist: "DVRST",
    videoId: "dSPiDFZmAnQ",
    thumbnail: "https://i.ytimg.com/vi/dSPiDFZmAnQ/hqdefault.jpg",
  },
  {
    title: "ENDLESS LOVE",
    artist: "DVRST",
    videoId: "fC1HF29n9UA",
    thumbnail: "https://i.ytimg.com/vi/fC1HF29n9UA/hqdefault.jpg",
  },
  {
    title: "Close Eyes",
    artist: "DVRST",
    videoId: "ao4RCon11eY",
    thumbnail: "https://i.ytimg.com/vi/ao4RCon11eY/hqdefault.jpg",
  },
  {
    title: "After Dark",
    artist: "Mr.Kitty",
    videoId: "Cl5Vkd4N03Q",
    thumbnail: "https://i.ytimg.com/vi/Cl5Vkd4N03Q/hqdefault.jpg",
  },
  {
    title: "Drained",
    artist: "auritni",
    videoId: "95XmCt17-Dg",
    thumbnail: "https://i.ytimg.com/vi/95XmCt17-Dg/hqdefault.jpg",
  },
  {
    title: "TOKYO-3",
    artist: "auritni",
    videoId: "WCpir8ytV9Y",
    thumbnail: "https://i.ytimg.com/vi/WCpir8ytV9Y/hqdefault.jpg",
  },
  {
    title: "Despond",
    artist: "auritni",
    videoId: "6RC5wI5MQfE",
    thumbnail: "https://i.ytimg.com/vi/6RC5wI5MQfE/hqdefault.jpg",
  },
  {
    title: "supїdo",
    artist: "фрози",
    videoId: "TryBShCWfKc",
    thumbnail: "https://i.ytimg.com/vi/TryBShCWfKc/hqdefault.jpg",
  },
  {
    title: "bounce (i just wanna dance)",
    artist: "фрози",
    videoId: "S2DLrhb-078",
    thumbnail: "https://i.ytimg.com/vi/S2DLrhb-078/hqdefault.jpg",
  },
  {
    title: "Japan",
    artist: "prod.jk8",
    videoId: "GW7AYygYrio",
    thumbnail: "https://i.ytimg.com/vi/GW7AYygYrio/hqdefault.jpg",
  },
  {
    title: "doodle",
    artist: "Zachz Winner",
    videoId: "AtXtXhZqc4s",
    thumbnail: "https://i.ytimg.com/vi/AtXtXhZqc4s/hqdefault.jpg",
  },
  {
    title: "linga guli guli",
    artist: "Zachz Winner",
    videoId: "8lifVcl1jgg",
    thumbnail: "https://i.ytimg.com/vi/8lifVcl1jgg/hqdefault.jpg",
  },
  {
    title: "SEA OF PROBLEMS",
    artist: "GLICHERY",
    videoId: "gtpCl_QWaLg",
    thumbnail: "https://i.ytimg.com/vi/gtpCl_QWaLg/hqdefault.jpg",
  },
  {
    title: "ONE CHANCE",
    artist: "INTERWORLD",
    videoId: "q1tAnXBUpno",
    thumbnail: "https://i.ytimg.com/vi/q1tAnXBUpno/hqdefault.jpg",
  },
  {
    title: "RAPTURE",
    artist: "INTERWORLD",
    videoId: "i5zR6toPVQ8",
    thumbnail: "https://i.ytimg.com/vi/i5zR6toPVQ8/hqdefault.jpg",
  },
  {
    title: "METAMORPHOSIS",
    artist: "INTERWORLD",
    videoId: "317RHaFF7Xk",
    thumbnail: "https://i.ytimg.com/vi/317RHaFF7Xk/hqdefault.jpg",
  },
  {
    title: "Grimes - 4AM (skeler. Remix)",
    artist: "ROYAL PHONK",
    videoId: "5C2fAfuharU",
    thumbnail: "https://i.ytimg.com/vi/5C2fAfuharU/hqdefault.jpg",
  },
  {
    title: "SO TIRED",
    artist: "NUEKI",
    videoId: "turCAoWsH-U",
    thumbnail: "https://i.ytimg.com/vi/turCAoWsH-U/hqdefault.jpg",
  },
];

export function usePlaylistState() {
  const [songs, setSongs] = useState<Song[]>(defaultSongs);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [volume, setVolume] = useState(35);
  const [prompt, setPrompt] = useState("");
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        const stored = localStorage.getItem("playlistData");
        if (stored) {
          const data = JSON.parse(stored);
          if (
            data.songs &&
            Array.isArray(data.songs) &&
            data.songs.length > 0
          ) {
            setSongs(data.songs);
            setPrompt(data.prompt || "");
            setPlaylistInfo(data.playlistInfo || null);
            setCurrentSongIndex(0);
          } else {
            setSongs(defaultSongs);
          }
        } else {
          setSongs(defaultSongs);
        }
      } catch (error) {
        console.error("Failed to load playlist from localStorage:", error);
        setSongs(defaultSongs);
      }
    }
  }, [isClient]);

  const handleSelectSong = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (shuffle) {
      let nextIndex = Math.floor(Math.random() * songs.length);
      if (songs.length > 1) {
        while (nextIndex === currentSongIndex) {
          nextIndex = Math.floor(Math.random() * songs.length);
        }
      }
      setCurrentSongIndex(nextIndex);
    } else {
      setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    }
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (shuffle) {
      let prevIndex = Math.floor(Math.random() * songs.length);
      if (songs.length > 1) {
        while (prevIndex === currentSongIndex) {
          prevIndex = Math.floor(Math.random() * songs.length);
        }
      }
      setCurrentSongIndex(prevIndex);
    } else {
      setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
    }
    setIsPlaying(true);
  };

  return {
    songs,
    setSongs,
    currentSongIndex,
    setCurrentSongIndex,
    isPlaying,
    setIsPlaying,
    shuffle,
    setShuffle,
    repeat,
    setRepeat,
    volume,
    setVolume,
    prompt,
    isClient,
    handleSelectSong,
    handleNext,
    handlePrevious,
  };
}
