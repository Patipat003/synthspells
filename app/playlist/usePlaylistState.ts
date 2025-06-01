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
  { title: "OMG", artist: "NewJeans", videoId: "sVTy_wmn5SU" },
]

export function usePlaylistState() {
  const [songs, setSongs] = useState<Song[]>(defaultSongs)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [volume, setVolume] = useState(50)
  const [prompt, setPrompt] = useState("")
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo | null>(null)

  // Load playlist from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("playlistData")
      if (stored) {
        const data = JSON.parse(stored)
        if (data.songs && Array.isArray(data.songs) && data.songs.length > 0) {
          setSongs(data.songs)
          setPrompt(data.prompt || "")
          setPlaylistInfo(data.playlistInfo || null)
          setCurrentSongIndex(0)
        }
      }
    } catch (error) {
      console.error("Failed to load playlist from localStorage:", error)
    }
  }, [])

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
    playlistInfo,
    handleSelectSong,
    handleNext,
    handlePrevious,
  }
}