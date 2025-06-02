import { useState, useEffect, useRef } from "react"

type Song = {
  title: string
  artist: string
  videoId: string
  thumbnail?: string
}

type PlaylistInfo = {
  title: string
  thumbnail: string
}

const defaultSongs: Song[] = [
  { title: "I watch the moon", artist: "Khaos Lan", videoId: "WBgpL0c9dCQ", thumbnail: "https://i.ytimg.com/vi/WBgpL0c9dCQ/hqdefault.jpg" },
  { title: "Fainted", artist: "Narvent", videoId: "dJWFUBAUM0E", thumbnail: "https://i.ytimg.com/vi/dJWFUBAUM0E/hqdefault.jpg" },
  { title: "Memory Reboot", artist: "Narvent", videoId: "mHSnuL-LGNU", thumbnail: "https://i.ytimg.com/vi/mHSnuL-LGNU/hqdefault.jpg" },
  { title: "Dream Space", artist: "DVRST", videoId: "dSPiDFZmAnQ", thumbnail: "https://i.ytimg.com/vi/dSPiDFZmAnQ/hqdefault.jpg" },
  { title: "Close Eyes", artist: "DVRST", videoId: "ao4RCon11eY", thumbnail: "https://i.ytimg.com/vi/ao4RCon11eY/hqdefault.jpg" },
  { title: "After Dark", artist: "Mr.Kitty", videoId: "Cl5Vkd4N03Q", thumbnail: "https://i.ytimg.com/vi/Cl5Vkd4N03Q/hqdefault.jpg" },
  { title: "Drained", artist: "auritni", videoId: "95XmCt17-Dg", thumbnail: "https://i.ytimg.com/vi/95XmCt17-Dg/hqdefault.jpg" },
  { title: "TOKYO-3", artist: "auritni", videoId: "WCpir8ytV9Y", thumbnail: "https://i.ytimg.com/vi/WCpir8ytV9Y/hqdefault.jpg" },
  { title: "Despond", artist: "auritni", videoId: "6RC5wI5MQfE", thumbnail: "https://i.ytimg.com/vi/6RC5wI5MQfE/hqdefault.jpg" },
  { title: "SEA OF PROBLEMS", artist: "GLICHERY", videoId: "gtpCl_QWaLg", thumbnail: "https://i.ytimg.com/vi/gtpCl_QWaLg/hqdefault.jpg" },
  { title: "RAPTURE", artist: "INTERWORLD", videoId: "i5zR6toPVQ8", thumbnail: "https://i.ytimg.com/vi/i5zR6toPVQ8/hqdefault.jpg" },
  { title: "METAMORPHOSIS", artist: "INTERWORLD", videoId: "317RHaFF7Xk", thumbnail: "https://i.ytimg.com/vi/317RHaFF7Xk/hqdefault.jpg" },
  { title: "SO TIRED", artist: "NUEKI", videoId: "turCAoWsH-U", thumbnail: "https://i.ytimg.com/vi/turCAoWsH-U/hqdefault.jpg" },
]

// ฟังก์ชันสำหรับสุ่มลำดับเพลง
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function usePlaylistState() {
  // เริ่มต้นด้วยเพลง default ก่อน (ไม่สุ่ม)
  const [songs, setSongs] = useState<Song[]>(defaultSongs)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [volume, setVolume] = useState(50)
  const [prompt, setPrompt] = useState("")
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo | null>(null)
  const [isClient, setIsClient] = useState(false)

  // ตรวจสอบว่าอยู่ใน client หรือไม่
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load และ shuffle เฉพาะใน client
  useEffect(() => {
    if (isClient) {
      try {
        const stored = localStorage.getItem("playlistData")
        if (stored) {
          const data = JSON.parse(stored)
          if (data.songs && Array.isArray(data.songs) && data.songs.length > 0) {
            // สุ่มเพลงที่โหลดจาก localStorage
            setSongs(shuffleArray(data.songs))
            setPrompt(data.prompt || "")
            setPlaylistInfo(data.playlistInfo || null)
            setCurrentSongIndex(0)
          } else {
            // ถ้าไม่มีเพลงใน localStorage ให้สุ่มเพลง default
            setSongs(shuffleArray(defaultSongs))
          }
        } else {
          // ถ้าไม่มี localStorage ให้สุ่มเพลง default
          setSongs(shuffleArray(defaultSongs))
        }
      } catch (error) {
        console.error("Failed to load playlist from localStorage:", error)
        // ถ้าเกิดข้อผิดพลาด ให้สุ่มเพลง default
        setSongs(shuffleArray(defaultSongs))
      }
    }
  }, [isClient])

  const handleSelectSong = (index: number) => {
    setCurrentSongIndex(index)
    setIsPlaying(true)
  }

  const handleNext = () => {
    if (shuffle) {
      let nextIndex = Math.floor(Math.random() * songs.length)
      if (songs.length > 1) {
        while (nextIndex === currentSongIndex) {
          nextIndex = Math.floor(Math.random() * songs.length)
        }
      }
      setCurrentSongIndex(nextIndex)
    } else {
      setCurrentSongIndex((prev) => (prev + 1) % songs.length)
    }
    setIsPlaying(true)
  }

  const handlePrevious = () => {
    if (shuffle) {
      let prevIndex = Math.floor(Math.random() * songs.length)
      if (songs.length > 1) {
        while (prevIndex === currentSongIndex) {
          prevIndex = Math.floor(Math.random() * songs.length)
        }
      }
      setCurrentSongIndex(prevIndex)
    } else {
      setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length)
    }
    setIsPlaying(true)
  }

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
  }
}