import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Volume2,
} from "lucide-react";

type Song = {
  title: string;
  artist: string;
  videoId: string;
  thumbnail?: string;
};

export default function PlayerControls({
  currentSong,
  currentSongIndex,
  isPlaying,
  handlePlayPause,
  handleNext,
  handlePrevious,
  shuffle,
  setShuffle,
  repeat,
  setRepeat,
  volume,
  setVolume,
}: {
  currentSong: Song;
  currentSongIndex: number;
  isPlaying: boolean;
  handlePlayPause: () => void;
  handleNext: () => void;
  handlePrevious: () => void;
  shuffle: boolean;
  setShuffle: (b: boolean) => void;
  repeat: boolean;
  setRepeat: (b: boolean) => void;
  volume: number;
  setVolume: (v: number) => void;
}) {
  return (
    <div>
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
              <div className="font-medium truncate text-white text-sm sm:text-base">
                {currentSong.title}
              </div>
              <div className="text-xs sm:text-sm text-gray-400 truncate">
                {currentSong.artist}
              </div>
            </div>
          </div>
          {/* Center Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
            <button
              type="button"
              onClick={() => setShuffle(!shuffle)}
              className={`sm:block sm:p-2 p-2 rounded-full transition-all duration-200 hover:scale-110 cursor-pointer ${
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
              className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors hover:scale-110 cursor-pointer"
              title="Previous Song"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              type="button"
              onClick={handlePlayPause}
              className="p-3 sm:p-4 border-1 border-violet-800 bg-black/10 rounded-full transition-all duration-200 hover:scale-110 shadow-lg cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Play className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors hover:scale-110 cursor-pointer"
              title="Next Song"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              type="button"
              onClick={() => setRepeat(!repeat)}
              className={`sm:block p-2 sm:p-2 rounded-full transition-all duration-200 hover:scale-110 cursor-pointer ${
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
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 justify-end sm:max-w-sm">
            <div className="hidden lg:block">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 justify-end sm:max-w-sm">
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
                  <span className="text-xs sm:text-sm text-gray-400 w-6 sm:w-8 text-right">
                    {volume}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile Song Info */}
        <div className="sm:hidden pt-2 border-t border-white/10 mt-2">
          <div className="text-center">
            <div className="font-medium text-white text-sm truncate">
              {currentSong.title}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {currentSong.artist}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
