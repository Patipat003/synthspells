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
  MoreHorizontal
} from "lucide-react"
import { useRouter } from "next/navigation"

type Song = {
  title: string
  artist: string
  videoId: string
}

const defaultSongs: Song[] = [
  { title: "Die With A Smile", artist: "Lady Gaga", videoId: "RVDCeVG90Rg" },
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
          setCurrentSongIndex(0)
        }
      }
    } catch (error) {
      console.error("Failed to load playlist from localStorage:", error)
    }
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
            try {
              setIsPlayerReady(true)
              event.target.setVolume(volume)
            } catch (error) {
              console.warn('Failed to set initial volume:', error)
            }
          },
          onStateChange: (event: any) => {
            try {
              if (event.data === window.YT.PlayerState.ENDED) {
                // เมื่อเพลงจบให้หยุดเล่น ไม่ข้ามไปเพลงถัดไป
                setIsPlaying(false)
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
            // เมื่อเกิด error ให้หยุดเล่น ไม่ข้ามไปเพลงถัดไป
            setIsPlaying(false)
            
            // แสดงข้อความแจ้งเตือนสำหรับข้อผิดพลาดต่างๆ
            let errorMessage = 'เกิดข้อผิดพลาดในการเล่นวิดีโอ'
            
            if (error.data === 2) {
              errorMessage = 'Video ID ไม่ถูกต้อง'
            } else if (error.data === 5) {
              errorMessage = 'ไม่รองรับการเล่นบน HTML5 player'
            } else if (error.data === 100) {
              errorMessage = 'ไม่พบวิดีโอหรือถูกลบแล้ว'
            } else if (error.data === 101 || error.data === 150) {
              errorMessage = 'ผู้อัปโหลดไม่อนุญาตให้ฝังวิดีโอนี้'
            }
            
            alert(`${errorMessage}: ${currentSong.title}`)
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

  // ปิดการทำงานของ handleNext - ไม่ให้ข้ามเพลง
  const handleNext = () => {
    // ปิดการทำงาน - ไม่ทำอะไร
    return
  }

  // ปิดการทำงานของ handlePrevious - ไม่ให้ข้ามเพลง
  const handlePrevious = () => {
    // ปิดการทำงาน - ไม่ทำอะไร
    return
  }

  const handleSelectSong = (index: number) => {
    setCurrentSongIndex(index)
    setIsPlaying(true)
  }

  const handleGoHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Video Player - Larger */}
          <div className="lg:col-span-2">
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="bg-black rounded-xl overflow-hidden mb-6" style={{ aspectRatio: '16/9' }}>
                <div ref={playerContainerRef} id="youtube-player" className="w-full h-full"></div>
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
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${
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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Current Song Mini Info */}
            <div className="flex items-center space-x-4 flex-1 min-w-0 max-w-sm">
              <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold">
                {currentSongIndex + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate text-white">{currentSong.title}</div>
                <div className="text-sm text-gray-400 truncate">{currentSong.artist}</div>
              </div>
            </div>

            {/* Center Controls */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setShuffle(!shuffle)}
                className={`p-2 rounded-full transition-all duration-200 opacity-50 cursor-not-allowed ${
                  shuffle 
                    ? "text-purple-400 bg-purple-400/20" 
                    : "text-gray-400"
                }`}
                title="Shuffle (Disabled)"
                disabled
              >
                <Shuffle className="w-4 h-4" />
              </button>
              
              <button
                onClick={handlePrevious}
                className="p-2 text-gray-400 opacity-50 cursor-not-allowed transition-colors"
                title="Previous (Disabled)"
                disabled
              >
                <SkipBack className="w-5 h-5" />
              </button>
              
              <button
                onClick={handlePlayPause}
                className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
              
              <button
                onClick={handleNext}
                className="p-2 text-gray-400 opacity-50 cursor-not-allowed transition-colors"
                title="Next (Disabled)"
                disabled
              >
                <SkipForward className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setRepeat(!repeat)}
                className={`p-2 rounded-full transition-all duration-200 opacity-50 cursor-not-allowed ${
                  repeat 
                    ? "text-purple-400 bg-purple-400/20" 
                    : "text-gray-400"
                }`}
                title="Repeat (Disabled)"
                disabled
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-3 flex-1 justify-end max-w-sm">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-24 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer slider"
                  title="Volume"
                />
                <span className="text-sm text-gray-400 w-8 text-right">{volume}</span>
              </div>
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