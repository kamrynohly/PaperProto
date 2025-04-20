"use client"
// app/page.js
import { useState } from 'react';
import ChatInterface from '../../components/ChatInterface';
import GameDisplay from '../../components/GameDisplay';

export default function Home() {
  const [gameCode, setGameCode] = useState(null);
  const [gameType, setGameType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
      </header>

      <main className="container mx-auto p-0 pt-4">
        {error && (
          <div className="mb-4 p-0 bg-red-100 text-red-800 rounded-lg">
            <p className="font-medium">Error: {error}</p>
            <p className="text-sm mt-1">Please check your API key configuration and try again.</p>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-2 h-[95vh]">
          {/* Left side - Chat with Claude */}
          <div className="flex-2 bg-white rounded-lg shadow-md overflow-hidden">
            <ChatInterface onGameRequest={handleGameGeneration} />
          </div>
          
          {/* Right side - Game Display */}
          <div className="flex-5 bg-white rounded-lg shadow-md overflow-hidden">
            <GameDisplay 
              gameCode={gameCode} 
              gameType={gameType} 
              loading={loading} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}