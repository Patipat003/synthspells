"use client";
import { useEffect, useState } from "react";

export default function PetWidget() {
  const [count, setCount] = useState<number>(0);
  const [showHeart, setShowHeart] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const fetchCount = async () => {
    const res = await fetch("/api/pet-count");
    const text = await res.text();
    console.log("Response Text:", text);
    try {
      const data = JSON.parse(text);
      setCount(data.count);
    } catch (e) {
      console.error("JSON parse error:", e);
    }
  };

  const handlePet = async () => {
    setShowHeart(true);
    setIsClicked(true);
    await fetch("/api/pet-count", { method: "POST" });
    fetchCount();
    setTimeout(() => setShowHeart(false), 800);
    setTimeout(() => setIsClicked(false), 200);
  };

  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <div className="fixed bottom-0 right-4 z-50">
      <div className="flex items-center space-x-3">
        {/* Animated Character */}
        <div
          onClick={handlePet}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`cursor-pointer select-none relative transition-all duration-200 ${
            isClicked ? 'scale-90' : 'hover:scale-110'
          }`}
        >
          {isHovered && (
            <div className="absolute bottom-0 right-12 transform -translate-x-4/5 text-white font-bold py-1 rounded-full shadow-lg transition-all duration-200">
              <span className="text-sm">{count}</span>
            </div>
          )}

          {/* Animated GIF */}
          <img 
            src="https://media.tenor.com/7lirhLLRJWAAAAAj/ai-hoshino-ai-dance.gif"
            alt="Animated character"
            className="w-14 h-14 object-cover"
          />

          {/* Floating Hearts Animation */}
          {showHeart && (
            <>
              <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 animate-bounce text-red-500 text-2xl">
                ❤️
              </div>
              <div className="absolute -top-16 left-1/2 animate-pulse text-pink-500 text-lg">
                💕
              </div>
              <div className="absolute -top-16 right-2 animate-ping text-red-400 text-lg">
                💖
              </div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce text-pink-600 text-xl font-bold">
                +1
              </div>
            </>
          )}

          {/* Sparkle Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-75"></div>
            <div className="absolute top-2 right-0 w-1 h-1 bg-blue-300 rounded-full animate-pulse"></div>
            <div className="absolute bottom-0 left-2 w-1 h-1 bg-green-300 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}