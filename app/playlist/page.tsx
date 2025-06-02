"use client"

import { usePlaylistState } from "@/app/playlist/usePlaylistState"
import { useYouTubePlayer } from "@/app/playlist/useYouTubePlayer"
import PlaylistSidebar from "@/app/playlist/PlaylistSidebar"
import PlayerControls from "@/app/playlist/PlayerControls"
import SongInfo from "@/app/playlist/SongInfo"

export default function PlaylistPage() {
  const {
    songs,
    currentSongIndex,
    setCurrentSongIndex,
    shuffle,
    setShuffle,
    repeat,
    setRepeat,
    volume,
    setVolume,
    isPlaying,
    setIsPlaying,
    handleSelectSong,
    handleNext,
    handlePrevious,
  } = usePlaylistState()

  const {
    playerContainerRef,
    handlePlayPause,
  } = useYouTubePlayer({
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
  })

  const currentSong = songs[currentSongIndex]

  return (
    <div className="lg:max-h-screen min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="mx-auto max-w-6xl pt-6 px-4">
        <div className="grid lg:grid-cols-7 gap-6 w-full">
          {/* Video Player */}
          <div className="lg:col-span-4">
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="bg-black rounded-xl overflow-hidden mb-8 aspect-video">
                <div ref={playerContainerRef} id="youtube-player" className="w-full h-full"></div>
              </div>
              <SongInfo currentSong={currentSong} currentSongIndex={currentSongIndex} isPlaying={isPlaying} />
            </div>
          </div>
          {/* Playlist Sidebar */}
          <div className="lg:col-span-3">
            <PlaylistSidebar
              songs={songs}
              currentSongIndex={currentSongIndex}
              isPlaying={isPlaying}
              handleSelectSong={handleSelectSong}
            />
          </div>
        </div>
      </div>
      {/* Bottom Player Controls */}
      <PlayerControls
        currentSong={currentSong}
        currentSongIndex={currentSongIndex}
        isPlaying={isPlaying}
        handlePlayPause={handlePlayPause}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        shuffle={shuffle}
        setShuffle={setShuffle}
        repeat={repeat}
        setRepeat={setRepeat}
        volume={volume}
        setVolume={setVolume}
      />
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