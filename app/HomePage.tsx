"use client";

import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type HomePageProps = {
  defaultPrompt?: string;
};

export default function HomePage({ defaultPrompt = "" }: HomePageProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const hasAutoSearched = useRef(false);

  useEffect(() => {
    if (defaultPrompt) {
      setPrompt(defaultPrompt);

      if (!hasAutoSearched.current) {
        hasAutoSearched.current = true;
        handleGenerate(defaultPrompt);
      }
    }
  }, [defaultPrompt]);

  const handleGenerate = async (customPrompt?: string) => {
    const usedPrompt = (customPrompt ?? prompt).trim();
    if (!usedPrompt || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate-playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: usedPrompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate playlist");
      }

      if (!data.songs || !Array.isArray(data.songs)) {
        throw new Error("Invalid response format - no songs received");
      }

      const validSongs = data.songs.filter(
        (song: any) =>
          song &&
          typeof song.title === "string" &&
          typeof song.artist === "string" &&
          typeof song.videoId === "string" &&
          song.title.trim() &&
          song.artist.trim() &&
          song.videoId.trim()
      );

      if (validSongs.length === 0) {
        throw new Error(
          "No playable songs found in the playlist. Please try a different prompt or be more specific."
        );
      }

      const playlistData = {
        songs: validSongs,
        prompt: usedPrompt,
        playlistInfo: data.playlistInfo || null,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("playlistData", JSON.stringify(playlistData));

      router.push("/playlist");
    } catch (err: any) {
      console.error("Error generating playlist:", err);

      if (err.message.includes("404")) {
        setError(
          "No suitable playlist found for your request. Try using different keywords or be more specific."
        );
      } else if (err.message.includes("quota")) {
        setError("Service temporarily unavailable. Please try again later.");
      } else {
        setError(
          err.message || "An error occurred while generating the playlist"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error]);

  const clearError = () => setError("");

  return (
    <div className="flex flex-col items-center text-center max-h-screen w-screen px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl h-full mt-6 sm:mt-16">
        {/* Main Heading */}
        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            AI Playlist Songs
          </h1>
        </div>

        {/* Subtitle Section */}
        <div className="mb-12 space-y-1 sm:space-y-2 sm:text-sm">
          <div className="text-purple-300 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
            Discover Curated Playlists With AI
          </div>
          <div className="text-gray-300 font-semibold text-sm sm:text-base md:text-lg px-2">
            SynthSpells – AI finds the perfect playlist for your vibe ✨
          </div>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-2xl mx-auto mb-3 sm:mb-4">
          <Textarea
            className="h-56 sm:h-42 w-full bg-gray-800/20 border-violet-600 text-white placeholder-violet-400 text-sm sm:text-base resize-none focus:ring-1 focus:ring-violet-500"
            placeholder="Describe your vibe…  (e.g. lofi hip hop for studying)"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (error) clearError();
            }}
            onKeyDown={handleKeyDown}
            maxLength={500}
          />
          <div className="text-right text-xs sm:text-sm text-gray-400 mt-1">
            {prompt.length}/500
          </div>
          <div className="text-center text-xs text-gray-400 italic">
            also you can paste playlist url from youtube
          </div>
        </div>

        {/* Generate Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => handleGenerate()}
            disabled={loading || !prompt.trim()}
            className={`w-full sm:w-1/3 px-6 sm:px-8 py-3 sm:py-3 rounded-lg text-white font-semibold text-sm sm:text-base transition-all duration-200 ${
              loading || !prompt.trim()
                ? "bg-gray-600 cursor-not-allowed opacity-50"
                : "bg-black/10 border-1 border-violet-500 hover:scale-105 shadow-lg hover:shadow-purple-500/25 cursor-pointer"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs sm:text-sm">
                  Finding Perfect Playlist...
                </span>
              </div>
            ) : (
              <span className="text-xs sm:text-sm">Find Playlist</span>
            )}
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-gray-400 text-xs px-2">
          <p>• Powered by OpenAI & YouTube •</p>
        </div>
      </div>
    </div>
  );
}
