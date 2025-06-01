import React, { useState } from "react"

type Song = {
  title: string
  artist: string
  videoId: string
  thumbnail?: string
}

const removePlaylist = () => {

  localStorage.removeItem("playlistData")
  window.location.href = "/playlist"
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    removePlaylist()
    setShowDeleteConfirm(false)
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 h-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Queue</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400 bg-white/10 px-3 py-1 rounded-full">
                {songs.length} songs
              </span>
              <span 
                className="cursor-pointer text-sm text-purple-400 bg-white/10 px-3 py-1 rounded-full hover:scale-105 hover:bg-purple-500/20 transition-all duration-200" 
                onClick={handleDeleteClick}
              >
                Clear
              </span>
            </div>
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 duration-300"
          onClick={handleCancelDelete}
        >
          <div 
            className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-8 max-w-lg w-full mx-4 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
                <svg className="w-10 h-10 text-purple-400 animate-in fade-in-0 duration-300 delay-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Clear Current Playlist?</h3>
              <p className="text-gray-300 mb-2 leading-relaxed">
                This will remove your current playlist and cannot be undone.
              </p>
              <p className="text-sm text-purple-300 mb-8 bg-purple-500/10 rounded-xl p-3 border border-purple-500/20">
                <span className="font-medium">Don't worry!</span> We'll automatically load the default playlist so you can keep enjoying music.
              </p>
              <div className="flex space-x-4 justify-center">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="cursor-pointer px-8 py-3 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white rounded-2xl transition-all duration-200 font-medium shadow-lg hover:shadow-purple-500/25 hover:scale-105 active:scale-95"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleCancelDelete}
                  className="cursor-pointer px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all duration-200 font-medium border border-white/20 hover:border-white/30 hover:scale-105 active:scale-95"
                >
                  Keep
                </button>
                
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}