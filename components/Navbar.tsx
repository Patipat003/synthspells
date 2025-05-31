"use client"

import Link from "next/link"
import { Plus, Music, Sparkles } from "lucide-react"


const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-800 text-white px-6 py-4 sticky top-0 z-50 shadow-2xl backdrop-blur-sm border-b border-purple-700/50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo Section */}
        <Link 
          href="/" 
          className="flex items-center gap-2 text-2xl font-bold hover:text-purple-200 transition-all duration-300 group"
        >
          <Sparkles className="w-7 h-7 text-purple-300 group-hover:text-yellow-300 transition-colors duration-300 group-hover:animate-pulse" />
          <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            SynthSpells
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <Link 
            href="/playlist" 
            className="flex items-center gap-2 text-lg font-semibold hover:text-purple-200 transition-all duration-300 hover:scale-105 group"
          >
            <Music className="w-5 h-5 group-hover:animate-bounce" />
            <span>Playlist</span>
          </Link>
          
          <Link 
            href="/new" 
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-4 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>New</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar