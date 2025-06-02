import { useEffect, useRef, useState } from "react"

type Song = {
  title: string
  artist: string
  videoId: string
  thumbnail?: string
}

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export function useYouTubePlayer({
  songs,
  currentSongIndex,
  setCurrentSongIndex,
  isPlaying,
  setIsPlaying,
  shuffle,
  repeat,
  volume,
  setShuffle,
  setRepeat,
}: {
  songs: Song[]
  currentSongIndex: number
  setCurrentSongIndex: (i: number) => void
  isPlaying: boolean
  setIsPlaying: (b: boolean) => void
  shuffle: boolean
  repeat: boolean
  volume: number
  setShuffle: (b: boolean) => void
  setRepeat: (b: boolean) => void
}) {
  const playerRef = useRef<any>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const currentSong = songs[currentSongIndex]

  // ...existing refs for shuffle, repeat, etc...

  const shuffleRef = useRef(shuffle)
  const repeatRef = useRef(repeat)
  const songsRef = useRef(songs)
  const currentSongIndexRef = useRef(currentSongIndex)

  useEffect(() => { shuffleRef.current = shuffle }, [shuffle])
  useEffect(() => { repeatRef.current = repeat }, [repeat])
  useEffect(() => { songsRef.current = songs }, [songs])
  useEffect(() => { currentSongIndexRef.current = currentSongIndex }, [currentSongIndex])

  const playNextSong = () => {
    if (repeatRef.current) {
      setTimeout(() => {
        playerRef.current?.seekTo(0)
        playerRef.current?.playVideo()
        setIsPlaying(true)
      }, 500)
      return
    }
    if (shuffleRef.current) {
      let nextIndex = Math.floor(Math.random() * songsRef.current.length)
      if (songsRef.current.length > 1) {
        while (nextIndex === currentSongIndexRef.current) {
          nextIndex = Math.floor(Math.random() * songsRef.current.length)
        }
      }
      setCurrentSongIndex(nextIndex)
    } else {
      const nextIndex = (currentSongIndexRef.current + 1) % songsRef.current.length
      setCurrentSongIndex(nextIndex)
    }
    setIsPlaying(true)
  }

  // Load YouTube IFrame API
  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const script = document.createElement('script')
        script.src = 'https://www.youtube.com/iframe_api'
        script.async = true
        document.body.appendChild(script)
      }
    }
    window.onYouTubeIframeAPIReady = () => { initializePlayer() }
    loadYouTubeAPI()
    if (window.YT && window.YT.Player) { initializePlayer() }
    return () => {
      if (playerRef.current) {
        try { playerRef.current.destroy() } catch {}
      }
    }
    // eslint-disable-next-line
  }, [])

  // Initialize YouTube player
  const initializePlayer = () => {
    if (!window.YT || !window.YT.Player || !playerContainerRef.current) return
    try {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: currentSong.videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          fs: 1,
          cc_load_policy: 0,
          enablejsapi: 1,
          origin: window.location.origin,
          host: 'https://www.youtube-nocookie.com'
        },
        events: {
          onReady: (event: any) => {
            setIsPlayerReady(true)
            event.target.setVolume(volume)
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false)
              setTimeout(() => { playNextSong() }, 500)
            } else if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true)
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false)
            }
          },
          onError: () => {
            setIsPlaying(false)
            setTimeout(() => { playNextSong() }, 2000)
          }
        },
      })
    } catch {}
  }

  // Update player when song changes
  useEffect(() => {
    if (!isPlayerReady || !playerRef.current || !currentSong) return
    try {
      playerRef.current.loadVideoById(currentSong.videoId)
      if (isPlaying) {
        setTimeout(() => { playerRef.current?.playVideo() }, 100)
      }
    } catch {}
  }, [currentSongIndex, currentSong, isPlayerReady])

  // Update volume
  useEffect(() => {
    if (!isPlayerReady || !playerRef.current) return
    try { playerRef.current.setVolume(volume) } catch {}
  }, [volume, isPlayerReady])

  const handlePlayPause = () => {
    if (!isPlayerReady || !playerRef.current) return
    try {
      if (isPlaying) playerRef.current.pauseVideo()
      else playerRef.current.playVideo()
    } catch {}
  }

  return {
    playerRef,
    playerContainerRef,
    isPlayerReady,
    handlePlayPause,
  }
}
