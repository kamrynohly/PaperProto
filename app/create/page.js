"use client"
// app/page.js
import { useState, useEffect } from 'react';
import ChatInterface from '../../components/ChatInterface';
import GameDisplay from '../../components/GameDisplay';
import { Gamepad2, MessageSquare, AlertTriangle } from 'lucide-react';
import BottomNavigation from '../../components/BottomNavigation';

export default function Home() {
  const [gameCode, setGameCode] = useState(null);
  const [gameType, setGameType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Add class to trigger the CRT power-on animation
    document.getElementById('game-container')?.classList.add('crt-on');
  }, []);

  // Updated to receive both gameType and gameCode directly
  const handleGameGeneration = async (type, code) => {
    setLoading(true);
    setError(null);
    
    try {
      // If code is provided directly, use it
      if (code) {
        setGameType(type);
        setGameCode(code);
        console.log(`Received ${type} game code directly, length: ${code.length}`);
      } else {
        // Fallback to the old way of generating code if needed
        console.warn("No game code provided, this should not happen with the consolidated approach");
      }
    } catch (error) {
      console.error('Error processing game:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 retro-grid-bg">
      {/* Header with retro styling */}
      <header className="bg-indigo-900 border-b-4 border-pink-500 shadow-lg">
        <div className="container mx-auto py-4 px-4">
          <h1 className="text-3xl font-bold text-center tracking-wider text-pink-500" 
              style={{ 
                textShadow: '2px 2px 0px #4F46E5, 4px 4px 0px #2D3748',
                fontFamily: '"Press Start 2P", cursive'
              }}>
            GAME GENERATOR
          </h1>
        </div>
      </header>

      <main className="container mx-auto p-4 pt-6">
        {error && (
          <div className="mb-4 p-4 bg-red-900 text-pink-200 border-4 border-red-500 rounded-lg shadow-[4px_4px_0px_0px_rgba(239,68,68)]">
            <div className="flex items-center">
              <AlertTriangle size={24} className="mr-2 text-red-400" />
              <p className="font-medium">ERROR DETECTED: {error}</p>
            </div>
            <p className="text-sm mt-1 ml-8">Please check your API key configuration and try again.</p>
          </div>
        )}
        
        <div id="game-container" className="flex flex-col md:flex-row gap-4 h-[80vh]">
          {/* Left side - Chat with Claude */}
          <div className="md:w-1/3 bg-gray-800 border-4 border-indigo-600 rounded-lg shadow-[6px_6px_0px_0px_rgba(79,70,229)] overflow-hidden">
            <div className="px-4 py-2 bg-indigo-800 border-b-4 border-indigo-500 flex items-center">
              <MessageSquare size={20} className="mr-2 text-pink-400" />
              <h2 className="text-lg font-bold text-white"
                  style={{ 
                    textShadow: '1px 1px 0px #4F46E5',
                    fontFamily: '"Press Start 2P", cursive',
                    fontSize: '12px'
                  }}>
                CHAT CONSOLE
              </h2>
            </div>
            <ChatInterface onGameRequest={handleGameGeneration} />
          </div>
          
          {/* Right side - Game Display */}
          <div className="md:w-2/3 bg-gray-800 border-4 border-indigo-600 rounded-lg shadow-[6px_6px_0px_0px_rgba(79,70,229)] overflow-hidden">
            <div className="px-4 py-2 bg-indigo-800 border-b-4 border-indigo-500 flex items-center">
              <Gamepad2 size={20} className="mr-2 text-pink-400" />
              <h2 className="text-lg font-bold text-white"
                  style={{ 
                    textShadow: '1px 1px 0px #4F46E5',
                    fontFamily: '"Press Start 2P", cursive',
                    fontSize: '12px'
                  }}>
                GAME SCREEN
              </h2>
            </div>
            <GameDisplay 
              gameCode={gameCode} 
              gameType={gameType} 
              loading={loading} 
            />
          </div>
        </div>
      </main>
      <BottomNavigation/>

      {/* Optional: Scanline effect for CRT feel */}
      <div className="fixed inset-0 pointer-events-none scanline opacity-30"></div>
    </div>
  );
}