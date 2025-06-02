"use client"

import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return
    
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/generate-playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate playlist")
      }

      if (!data.songs || !Array.isArray(data.songs)) {
        throw new Error("Invalid response format - no songs received")
      }

      // ตรวจสอบว่าได้เพลงที่มี videoId มาจาก playlist
      const validSongs = data.songs.filter((song: any) => 
        song && 
        typeof song.title === 'string' && 
        typeof song.artist === 'string' && 
        typeof song.videoId === 'string' &&
        song.title.trim() && 
        song.artist.trim() && 
        song.videoId.trim()
      )

      if (validSongs.length === 0) {
        throw new Error("No playable songs found in the playlist. Please try a different prompt or be more specific.")
      }

      // Store in localStorage พร้อมข้อมูล playlist
      const playlistData = {
        songs: validSongs,
        prompt: prompt.trim(),
        playlistInfo: data.playlistInfo || null, // ข้อมูล playlist ที่ได้จาก YouTube
        createdAt: new Date().toISOString()
      }
      localStorage.setItem("playlistData", JSON.stringify(playlistData))

      router.push("/playlist")
    } catch (err: any) {
      console.error("Error generating playlist:", err)
      
      if (err.message.includes('404')) {
        setError("No suitable playlist found for your request. Try using different keywords or be more specific.")
      } else if (err.message.includes('quota')) {
        setError("Service temporarily unavailable. Please try again later.")
      } else {
        setError(err.message || "An error occurred while generating the playlist")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  const clearError = () => setError("")

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="w-full max-w-4xl">
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white leading-tight">
          AI Playlist Songs
        </h1>
        
        {/* Subtitle Section */}
        <div className="mb-6 sm:mb-8 space-y-2 sm:space-y-4">
          <div className="text-purple-300 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
            Discover Curated Playlists With AI
          </div>
          <div className="text-gray-300 font-semibold text-base sm:text-lg md:text-xl px-2">
            SynthSpells – AI finds the perfect playlist for your vibe ✨
          </div>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-2xl mx-auto mb-4 sm:mb-6">
          <Textarea
            className="h-32 sm:h-40 w-full resize-none bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 text-sm sm:text-base"
            placeholder="Describe your vibe…  (e.g. lofi hip hop for studying, 90s rock hits, jazz for relaxing)"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value)
              if (error) clearError()
            }}
            onKeyDown={handleKeyDown}
            maxLength={500}
          />
          <div className="text-right text-xs sm:text-sm text-gray-400 mt-1">
            {prompt.length}/500
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 max-w-2xl mx-auto text-sm sm:text-base">
            <div className="flex justify-between items-start">
              <span className="flex-1 text-left">{error}</span>
              <button 
                onClick={clearError}
                className="ml-2 text-red-300 hover:text-red-100 flex-shrink-0 text-lg"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-white font-semibold text-base sm:text-lg transition-all duration-200 ${
            loading || !prompt.trim()
              ? "bg-gray-600 cursor-not-allowed opacity-50"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm sm:text-base">Finding Perfect Playlist...</span>
            </div>
          ) : (
            <span className="text-sm sm:text-base">🎵 Find Playlist</span>
          )}
        </button>

        {/* Footer Info */}
        <div className="mt-6 sm:mt-8 text-gray-400 text-xs sm:text-sm px-2">
          <p>• Powered by OpenAI & YouTube •</p>
        </div>
      </div>
    </div>
  )
}