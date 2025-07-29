"use client";

import Link from "next/link";
import { Plus, Music, Sparkles, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

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
      window.location.href = "/playlist";
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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const clearError = () => setError("");

  return (
    <>
      <nav className="bg-black/10 text-white px-4 sm:px-6 py-4 sticky top-0 z-50 border-b border-white/10 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl sm:text-2xl font-bold hover:text-purple-200 transition-all duration-300 group"
          >
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-purple-300 group-hover:text-yellow-300 transition-colors duration-300 group-hover:animate-pulse" />
            <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              SynthSpells
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/playlist"
              className="flex items-center gap-2 text-lg font-semibold hover:text-purple-200 transition-all duration-300 hover:scale-105 group"
            >
              <Music className="w-5 h-5 group-hover:animate-bounce" />
              <span>Playlist</span>
            </Link>

            <button
              onClick={openModal}
              className="flex items-center gap-2 border-1 border-violet-800 bg-black/10 px-4 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>New</span>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className="justify-end content-center drawer-end block md:hidden">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              <label
                htmlFor="my-drawer-4"
                className="drawer-button flex items-center gap-2 border-1 border-violet-800 bg-black/10 px-4 py-2 rounded-md font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </label>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer-4"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <ul className="menu bg-indigo-950 text-gray-300 px-4 sm:px-6 py-4 sticky top-0 z-50 border-b border-white/10 shadow-2xl backdrop-blur-sm min-h-full w-80 p-4">
                <li>
                  <Link
                    href="/playlist"
                    className="flex items-center gap-3 text-lg font-semibold transition-all duration-300 px-3 py-2 rounded-lg group"
                  >
                    <Music className="w-5 h-5 group-hover:animate-bounce" />
                    <span>Playlist</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={openModal}
                    className="flex items-center gap-3 text-lg font-semibold transition-all duration-300 px-3 py-2 rounded-lg group w-full text-left"
                  >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    <span>New</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 duration-300"
          onClick={closeModal}
        >
          <div
            className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-8 max-w-lg w-full mx-4 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">New Playlist</h2>
            </div>
            <div className="w-full max-w-2xl mx-auto mb-3 sm:mb-4">
              <div className="mb-6">
                <Textarea
                  className="h-56 sm:h-42 w-full bg-gray-800/20 border-violet-600 text-white placeholder-violet-400 text-sm sm:text-base resize-none focus:ring-1 focus:ring-violet-500"
                  placeholder="Describe your vibe…"
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

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  disabled={loading || !prompt.trim()}
                  className={`w-full px-6 py-3 rounded-lg text-white font-semibold text-sm sm:text-base transition-all duration-200 ${
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
