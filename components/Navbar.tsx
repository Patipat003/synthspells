"use client";

import Link from "next/link";
import { Plus, Music, Sparkles, Menu } from "lucide-react";

const Navbar = () => {
  return (
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

          <Link
            href="/"
            className="flex items-center gap-2 border-1 border-violet-800 bg-black/10 px-4 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>New</span>
          </Link>
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
                <Link
                  href="/"
                  className="flex items-center gap-3 text-lg font-semibold transition-all duration-300 px-3 py-2 rounded-lg group"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  <span>New</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
