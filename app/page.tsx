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

      // แยก validSongs (มี videoId) และ fallbackSongs (ไม่มี videoId)
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
        // ถ้ามีเพลงแต่ไม่มี videoId เลย ให้แจ้งเตือน user
        if (data.songs.length > 0) {
          throw new Error("No playable songs found for your prompt. Please try a different prompt or be more specific.")
        }
        throw new Error("No valid songs in response")
      }

      // Store in localStorage
      const playlistData = {
        songs: validSongs,
        prompt: prompt.trim(),
        createdAt: new Date().toISOString()
      }
      localStorage.setItem("playlistData", JSON.stringify(playlistData))

      // Navigate to playlist page
      router.push("/playlist")
    } catch (err: any) {
      console.error("Error generating playlist:", err)
      setError(err.message || "An error occurred while generating the playlist")
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
    <div className="flex flex-col items-center justify-center text-center min-h-screen px-4 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
          AI Playlist Songs
        </h1>
        
        <div className="mb-8 space-y-4">
          <div className="text-purple-300 text-2xl md:text-4xl font-bold">
            Create Playlist With Just a Prompt
          </div>
          <div className="text-gray-300 font-semibold text-lg">
            SynthSpells – AI spells your vibe into sound ✨
          </div>
        </div>

        <div className="w-full max-w-2xl mx-auto mb-6">
          <Textarea
            className="h-40 w-full resize-none bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
            placeholder="Describe your mood, activity, or vibe... &#10;&#10;Examples:&#10;• Studying late at night with rain outside&#10;• Relaxing Sunday morning with coffee&#10;• Working out but chill vibes&#10;• Nostalgic summer evening"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value)
              if (error) clearError()
            }}
            onKeyDown={handleKeyDown}
            maxLength={500}
          />
          <div className="text-right text-sm text-gray-400 mt-1">
            {prompt.length}/500
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 max-w-2xl mx-auto">
            <div className="flex justify-between items-start">
              <span>{error}</span>
              <button 
                onClick={clearError}
                className="ml-2 text-red-300 hover:text-red-100"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className={`px-8 py-3 rounded-lg text-white font-semibold text-lg transition-all duration-200 ${
            loading || !prompt.trim()
              ? "bg-gray-600 cursor-not-allowed opacity-50"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Summoning Your Playlist...</span>
            </div>
          ) : (
            "✨ Generate Playlist"
          )}
        </button>

        <div className="mt-8 text-gray-400 text-sm">
          <p>Powered by OpenAI • Creates 5 curated lofi/chill songs</p>
          <p className="mt-1">Press Enter to generate or Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  )
}