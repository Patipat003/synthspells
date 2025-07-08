"use client";

import { usePlaylistState } from "@/app/playlist/usePlaylistState";
import { useYouTubePlayer } from "@/app/playlist/useYouTubePlayer";
import PlaylistSidebar from "@/app/playlist/PlaylistSidebar";
import PlayerControls from "@/app/playlist/PlayerControls";
import SongInfo from "@/app/playlist/SongInfo";

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
  } = usePlaylistState();

  const { playerContainerRef, handlePlayPause } = useYouTubePlayer({
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
  });

  const currentSong = songs[currentSongIndex];

  return (
    <div className="lg:max-h-screen min-h-screen text-white">
      <div className="mx-auto max-w-6xl pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 w-full md:px-2 px-6">
          {/* Video Player */}
          <div className="lg:col-span-4">
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-full">
              <div className="bg-black rounded-xl overflow-hidden mb-4 aspect-video">
                <div
                  ref={playerContainerRef}
                  id="youtube-player"
                  className="w-full h-full"
                ></div>
              </div>
              <SongInfo
                currentSong={currentSong}
                currentSongIndex={currentSongIndex}
                isPlaying={isPlaying}
              />
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
    </div>
  );
}
