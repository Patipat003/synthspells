import React from "react"

type Song = {
  title: string
  artist: string
  videoId: string
  thumbnail?: string
}

export default function PlaylistSidebar({
  songs,
  currentSongIndex,
  isPlaying,
  handleSelectSong,
}: {
  songs: Song[]
  currentSongIndex: number
  isPlaying: boolean
  handleSelectSong: (index: number) => void
}) {
  return (
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
  )
}
