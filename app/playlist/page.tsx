"use client"

import { useEffect, useState, useRef } from "react"
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Shuffle, 
  Repeat, 
  Home, 
  Volume2,
  Music,
  Clock,
  Heart,
  MoreHorizontal,
  ListMusic
} from "lucide-react"
import { useRouter } from "next/navigation"

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

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export default function PlaylistPage() {
  const [songs, setSongs] = useState<Song[]>(defaultSongs)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [volume, setVolume] = useState(50)
  const [prompt, setPrompt] = useState("")
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo | null>(null)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const playerRef = useRef<any>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const currentSong = songs[currentSongIndex]

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

    window.onYouTubeIframeAPIReady = () => {
      initializePlayer()
    }

    loadYouTubeAPI()

    if (window.YT && window.YT.Player) {
      initializePlayer()
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy()
        } catch (error) {
          console.warn('Error destroying player:', error)
        }
      }
    }
  }, [])

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

  // Auto-play next song function - ใช้ useRef เพื่อเข้าถึง state ล่าสุด
  const shuffleRef = useRef(shuffle)
  const repeatRef = useRef(repeat)
  const songsRef = useRef(songs)
  const currentSongIndexRef = useRef(currentSongIndex)

  // อัพเดท refs เมื่อ state เปลี่ยน
  useEffect(() => {
    shuffleRef.current = shuffle
  }, [shuffle])

  useEffect(() => {
    repeatRef.current = repeat
  }, [repeat])

  useEffect(() => {
    songsRef.current = songs
  }, [songs])

  useEffect(() => {
    currentSongIndexRef.current = currentSongIndex
  }, [currentSongIndex])

  const playNextSong = () => {
    console.log('Playing next song...', { 
      repeat: repeatRef.current, 
      shuffle: shuffleRef.current,
      currentIndex: currentSongIndexRef.current,
      totalSongs: songsRef.current.length
    })

    if (repeatRef.current) {
      // ถ้าเปิด repeat ให้เล่นเพลงเดิมซ้ำ
      try {
        console.log('Repeating current song')
        setTimeout(() => {
          playerRef.current?.seekTo(0)
          playerRef.current?.playVideo()
          setIsPlaying(true)
        }, 500)
      } catch (error) {
        console.warn('Error repeating song:', error)
      }
      return
    }

    if (shuffleRef.current) {
      // ถ้าเปิด shuffle ให้สุ่มเพลงถัดไป
      let nextIndex = Math.floor(Math.random() * songsRef.current.length)
      if (songsRef.current.length > 1) {
        while (nextIndex === currentSongIndexRef.current) {
          nextIndex = Math.floor(Math.random() * songsRef.current.length)
        }
      }
      console.log('Shuffling to song index:', nextIndex)
      setCurrentSongIndex(nextIndex)
    } else {
      // เล่นเพลงถัดไปตามลำดับ
      const nextIndex = (currentSongIndexRef.current + 1) % songsRef.current.length
      console.log('Playing next song in order:', nextIndex)
      setCurrentSongIndex(nextIndex)
    }
    setIsPlaying(true)
  }

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
            try {
              setIsPlayerReady(true)
              event.target.setVolume(volume)
            } catch (error) {
              console.warn('Failed to set initial volume:', error)
            }
          },
          onStateChange: (event: any) => {
            try {
              console.log('Player state changed:', event.data)
              if (event.data === window.YT.PlayerState.ENDED) {
                // เมื่อเพลงจบให้เล่นเพลงถัดไป
                console.log('Song ended, playing next...')
                setIsPlaying(false)
                setTimeout(() => {
                  playNextSong()
                }, 1000) // รอ 1 วินาทีก่อนเล่นเพลงต่อไป
              } else if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true)
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false)
              }
            } catch (error) {
              console.warn('Error handling player state change:', error)
            }
          },
          onError: (error: any) => {
            console.warn('YouTube player error:', error)
            setIsPlaying(false)
            
            // แสดงข้อความแจ้งเตือนสำหรับข้อผิดพลาดต่างๆ
            let errorMessage = 'เกิดข้อผิดพลาดในการเล่นวิดีโอ'
            
            if (error.data === 2) {
              errorMessage = 'Video ID Not correct'
            } else if (error.data === 5) {
              errorMessage = 'HTML5 player error'
            } else if (error.data === 100) {
              errorMessage = 'Not found - Video may have been removed or is private'
            } else if (error.data === 101 || error.data === 150) {
              errorMessage = 'Uploaders have disabled playback on other websites'
            }
            
            alert(`${errorMessage}`)
            
            // ลองเล่นเพลงถัดไปเมื่อเกิด error
            setTimeout(() => {
              console.log('Error occurred, trying to play next song...')
              playNextSong()
            }, 2000)
          }
        },
      })
    } catch (error) {
      console.error('Failed to initialize YouTube player:', error)
    }
  }

  // Update player when song changes
  useEffect(() => {
    if (!isPlayerReady || !playerRef.current || !currentSong) return

    try {
      playerRef.current.loadVideoById(currentSong.videoId)
      if (isPlaying) {
        setTimeout(() => {
          try {
            playerRef.current?.playVideo()
          } catch (error) {
            console.warn('Failed to auto-play video:', error)
          }
        }, 100)
      }
    } catch (error) {
      console.warn('Error loading video:', error)
    }
  }, [currentSongIndex, currentSong, isPlayerReady])

  // Update volume
  useEffect(() => {
    if (!isPlayerReady || !playerRef.current) return

    try {
      playerRef.current.setVolume(volume)
    } catch (error) {
      console.warn('Error setting volume:', error)
    }
  }, [volume, isPlayerReady])

  const handlePlayPause = () => {
    if (!isPlayerReady || !playerRef.current) return

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
      }
    } catch (error) {
      console.warn('Error playing/pausing video:', error)
    }
  }

  const handleNext = () => {
    if (shuffle) {
      let nextIndex = Math.floor(Math.random() * songs.length)
      // ถ้าสุ่มได้เพลงเดิม ให้สุ่มใหม่ (ถ้ามีหลายเพลง)
      if (songs.length > 1) {
        while (nextIndex === currentSongIndex) {
          nextIndex = Math.floor(Math.random() * songs.length)
        }
      }
      setCurrentSongIndex(nextIndex)
    } else {
      // ถ้าไม่ shuffle ไปเพลงถัดไปปกติ
      setCurrentSongIndex((prev) => (prev + 1) % songs.length)
    }
    setIsPlaying(true)
  }

  const handlePrevious = () => {
    if (shuffle) {
      // ถ้าเปิด shuffle ให้สุ่มเพลงก่อนหน้า
      let prevIndex = Math.floor(Math.random() * songs.length)
      if (songs.length > 1) {
        while (prevIndex === currentSongIndex) {
          prevIndex = Math.floor(Math.random() * songs.length)
        }
      }
      setCurrentSongIndex(prevIndex)
    } else {
      // ถ้าไม่ shuffle ไปเพลงก่อนหน้าปกติ
      setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length)
    }
    setIsPlaying(true)
  }

  const handleSelectSong = (index: number) => {
    setCurrentSongIndex(index)
    setIsPlaying(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">

      {/* Main Content */}
      <div className="scale-90 max-w-6xl mx-auto pb-32">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Video Player - Larger */}
          <div className="lg:col-span-2">
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="bg-black rounded-xl overflow-hidden mb-6" style={{ aspectRatio: '16/9' }}>
                <div ref={playerContainerRef} id="youtube-player" className="w-full h-full"></div>
              </div>
              
              {/* Current Song Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0">
                  {currentSong.thumbnail ? (
                    <img 
                      src={currentSong.thumbnail} 
                      alt={currentSong.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                      {currentSongIndex + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white truncate">{currentSong.title}</h3>
                  <p className="text-gray-400 truncate">{currentSong.artist}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-purple-400">Now Playing</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                      <div className="w-1 h-3 bg-purple-400 rounded-full animate-pulse delay-75"></div>
                      <div className="w-1 h-3 bg-purple-400 rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Playlist Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 h-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Queue</h3>
                  <span className="text-sm text-gray-400 bg-white/10 px-3 py-1 rounded-full">
                    {songs.length} songs
                  </span>
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                  {songs.map((song, index) => (
                    <div
                      key={`${song.videoId}-${index}`}
                      className={`group cursor-pointer p-4 rounded-xl transition-colors duration-200 ${
                        index === currentSongIndex 
                          ? "bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50" 
                          : "hover:bg-white/10"
                      }`}
                      onClick={() => handleSelectSong(index)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                          {song.thumbnail ? (
                            <img 
                              src={song.thumbnail} 
                              alt={song.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center text-sm font-medium ${
                              index === currentSongIndex 
                                ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white" 
                                : "bg-white/10 text-gray-300"
                            }`}>
                              {index === currentSongIndex && isPlaying ? (
                                <div className="flex space-x-1">
                                  <div className="w-1 h-4 bg-white rounded-full animate-pulse"></div>
                                  <div className="w-1 h-4 bg-white rounded-full animate-pulse delay-75"></div>
                                  <div className="w-1 h-4 bg-white rounded-full animate-pulse delay-150"></div>
                                </div>
                              ) : (
                                index + 1
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium truncate ${
                            index === currentSongIndex ? "text-white" : "text-gray-200"
                          }`}>
                            {song.title}
                          </div>
                          <div className="text-sm text-gray-400 truncate">{song.artist}</div>
                        </div>
                        {index === currentSongIndex && (
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Player Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Current Song Mini Info */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0 max-w-xs sm:max-w-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-lg overflow-hidden">
                {currentSong.thumbnail ? (
                  <img 
                    src={currentSong.thumbnail} 
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-xs sm:text-sm">
                    {currentSongIndex + 1}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 hidden sm:block">
                <div className="font-medium truncate text-white text-sm sm:text-base">{currentSong.title}</div>
                <div className="text-xs sm:text-sm text-gray-400 truncate">{currentSong.artist}</div>
              </div>
            </div>

            {/* Center Controls */}
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
              {/* Hide shuffle and repeat on mobile */}
              <button
                type="button"
                onClick={() => setShuffle(!shuffle)}
                className={`hidden sm:block p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                  shuffle 
                    ? "text-purple-400 bg-purple-400/20" 
                    : "text-gray-400 hover:text-white"
                }`}
                title={shuffle ? "Disable Shuffle" : "Enable Shuffle"}
              >
                <Shuffle className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                onClick={handlePrevious}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors hover:scale-110"
                title="Previous Song"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <button
                type="button"
                onClick={handlePlayPause}
                className="p-3 sm:p-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5 sm:ml-1" />}
              </button>
              
              <button
                type="button"
                onClick={handleNext}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors hover:scale-110"
                title="Next Song"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              {/* Hide repeat on mobile */}
              <button
                type="button"
                onClick={() => setRepeat(!repeat)}
                className={`hidden sm:block p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                  repeat 
                    ? "text-purple-400 bg-purple-400/20" 
                    : "text-gray-400 hover:text-white"
                }`}
                title={repeat ? "Disable Repeat" : "Enable Repeat"}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 justify-end max-w-xs sm:max-w-sm">
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <div className="flex items-center space-x-1 sm:space-x-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-16 sm:w-20 lg:w-24 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer slider"
                  title="Volume"
                />
                <span className="text-xs sm:text-sm text-gray-400 w-6 sm:w-8 text-right">{volume}</span>
              </div>
            </div>
          </div>

          {/* Mobile Song Info - Show only on mobile when song info is hidden */}
          <div className="sm:hidden pt-2 border-t border-white/10 mt-2">
            <div className="text-center">
              <div className="font-medium text-white text-sm truncate">{currentSong.title}</div>
              <div className="text-xs text-gray-400 truncate">{currentSong.artist}</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.7);
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.3);
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.3);
        }
      `}</style>
    </div>
  )
}