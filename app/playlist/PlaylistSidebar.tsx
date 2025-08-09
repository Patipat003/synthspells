import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaRegTrashAlt } from "react-icons/fa";

type Song = {
  title: string;
  artist: string;
  videoId: string;
  thumbnail?: string;
};

const removePlaylist = () => {
  localStorage.removeItem("playlistData");
  window.location.href = "/playlist";
};

export default function PlaylistSidebar({
  songs,
  currentSongIndex,
  isPlaying,
  handleSelectSong,
}: {
  songs: Song[];
  currentSongIndex: number;
  isPlaying: boolean;
  handleSelectSong: (index: number) => void;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    removePlaylist();
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 h-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Queue</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400 bg-white/10 px-3 py-1 rounded-full">
                {songs.length} songs
              </span>
              <span
                className="cursor-pointer text-sm text-violet-400 bg-white/10 px-3 py-1 rounded-full hover:scale-105 hover:bg-violet-500/20 transition-all duration-200"
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
                    ? "bg-gradient-to-r from-violet-600/30 to-pink-600/30 border border-violet-500/50"
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
                      <div
                        className={`w-full h-full flex items-center justify-center text-sm font-medium ${
                          index === currentSongIndex
                            ? "bg-gradient-to-br from-violet-500 to-red-500 text-white"
                            : "bg-white/10 text-gray-300"
                        }`}
                      >
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
                    <div
                      className={`font-medium truncate ${
                        index === currentSongIndex
                          ? "text-white"
                          : "text-gray-200"
                      }`}
                    >
                      {song.title}
                    </div>
                    <div className="text-sm text-gray-400 truncate">
                      {song.artist}
                    </div>
                  </div>
                  {index === currentSongIndex && (
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancelDelete}
          >
            <motion.div
              className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-8 max-w-lg w-full mx-4 shadow-2xl"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center border border-violet-500/30">
                  <FaRegTrashAlt className="text-4xl text-violet-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Clear Current Playlist?
                </h3>
                <p className="text-gray-300 mb-2 leading-relaxed">
                  This will remove your current playlist and cannot be undone.
                </p>
                <p className="text-sm text-violet-300 mb-8 bg-violet-500/10 rounded-xl p-3 border border-violet-500/20">
                  <span className="font-medium">Don't worry!</span> We'll
                  automatically load the default playlist so you can keep
                  enjoying music.
                </p>
                <div className="flex space-x-4 justify-center">
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="w-full sm:w-1/4 px-6 sm:px-8 py-3 sm:py-3 rounded-lg text-red-500 font-semibold text-sm sm:text-base transition-all duration-200 bg-black/10 border border-red-500 hover:scale-105 shadow-lg hover:shadow-red-500/25 cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelDelete}
                    className="w-full sm:w-1/4 px-6 sm:px-8 py-3 sm:py-3 rounded-lg text-white font-semibold text-sm sm:text-base transition-all duration-200 bg-black/10 border border-gray-500 hover:scale-105 shadow-lg hover:shadow-gray-500/25 cursor-pointer"
                  >
                    Keep
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
