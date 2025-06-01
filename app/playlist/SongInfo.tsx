import React from "react"

type Song = {
  title: string
  artist: string
  videoId: string
  thumbnail?: string
}

export default function SongInfo({
  currentSong,
  currentSongIndex,
  isPlaying,
}: {
  currentSong: Song
  currentSongIndex: number
  isPlaying: boolean
}) {
  return (
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
  )
}
