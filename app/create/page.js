"use client"
// app/page.js
import { useState, useEffect } from 'react';
import ChatInterface from '../../components/ChatInterface';
import GameDisplay from '../../components/GameDisplay';
import { Gamepad2, MessageSquare, AlertTriangle, Share2 } from 'lucide-react';
import BottomNavigation from '../../components/BottomNavigation';
import { useAuth } from '../../contexts/AuthContext';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase'; // Assuming you have a firebase config file
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

export default function Home() {
  const [gameCode, setGameCode] = useState(null);
  const [gameType, setGameType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [gameTitle, setGameTitle] = useState('');
  const [gameDescription, setGameDescription] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  
  const { currentUser, userData } = useAuth(); // Get user data from AuthContext

  useEffect(() => {
    setMounted(true);
    // Add class to trigger the CRT power-on animation
    document.getElementById('game-container')?.classList.add('crt-on');
  }, []);

  // Updated to receive both gameType and gameCode directly
  const handleGameGeneration = async (type, code) => {
    setLoading(true); // Set loading to true when game generation starts
    setError(null);
    
    try {
      // Simulate a delay to show loading state/dino game (remove in production)
      // This is just for testing - you can remove this setTimeout in production
      await new Promise(resolve => setTimeout(resolve, 5000));
      
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
      setLoading(false); // Set loading to false when game generation completes
    }
  };

  // Handle publish game functionality
  const handlePublishGame = async () => {
    if (!gameCode || !gameTitle.trim() || !gameDescription.trim()) {
      setError("Please generate a game and provide a title and description");
      return;
    }

    // Check if user is authenticated
    if (!currentUser) {
      setError("You must be logged in to publish a game");
      return;
    }
    
    // Get user information from the currentUser and userData objects
    const userId = currentUser.uid;
    // If userData exists and has a username, use that, otherwise fall back to display name or email
    const userName = userData?.username || 
                     currentUser.displayName || 
                     currentUser.email?.split('@')[0] || 
                     'Anonymous User';
    
    console.log("Publishing game with creator ID:", userId);
    
    setPublishing(true);
    setError(null);
    
    try {
      const gameUuid = uuidv4();
      
      // Create game document in Firestore
      await setDoc(doc(db, "games", gameUuid), {
        game_uuid: gameUuid,
        creator_id: userId,
        creator_name: userName,
        title: gameTitle,
        description: gameDescription,
        gameType: gameType,
        gameCode: gameCode,
        playCount: 0,
        favCount: 0,
        createdAt: new Date()
      });
      
      // Update the user's project_ids array to include the new game UUID
      if (userData) {
        // Get a reference to the user's document
        const userRef = doc(db, "users", userId);
        
        // Get the current project_ids array or initialize a new one if it doesn't exist
        const currentProjectIds = userData.project_ids || [];

        // Get current number of games
        const gameCount = userData.gameCount || 0;
        
        // Add the new game UUID to the array if it's not already there
        if (!currentProjectIds.includes(gameUuid)) {
          // Update the user document to include the new game in project_ids
          await updateDoc(userRef, {
            gameCount: gameCount + 1,
            project_ids: [...currentProjectIds, gameUuid]
          });
          
          console.log("Updated user's project_ids with new game:", gameUuid);
        }
      }
      
      setPublishSuccess(true);
      
      // Reset form and close modal after a short delay
      setTimeout(() => {
        setPublishSuccess(false);
        setShowPublishModal(false);
        setGameTitle('');
        setGameDescription('');
      }, 2000);
      
    } catch (error) {
      console.error('Error publishing game:', error);
      setError(error.message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 retro-grid-bg">
      {/* Header with retro styling */}
      <header className="bg-indigo-900 border-b-4 border-pink-500 shadow-lg">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-center tracking-wider text-pink-500" 
              style={{ 
                textShadow: '2px 2px 0px #4F46E5, 4px 4px 0px #2D3748',
                fontFamily: '"Press Start 2P", cursive'
              }}>
            GAME GENERATOR
          </h1>
          {gameCode && (
            <button 
              onClick={() => setShowPublishModal(true)}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md border-2 border-pink-400 shadow-[2px_2px_0px_0px_rgba(236,72,153)] transition-all hover:shadow-[1px_1px_0px_0px_rgba(236,72,153)] flex items-center"
              style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}
            >
              <Share2 size={16} className="mr-2" />
              PUBLISH
            </button>
          )}
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
            <ChatInterface onGameRequest={handleGameGeneration} setLoading={setLoading}/>
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
            {/* Pass explicitly loading={loading} to ensure the prop is passed */}
            <GameDisplay 
              gameCode={gameCode} 
              gameType={gameType} 
              loading={loading} 
            />
          </div>
        </div>
      </main>
      
      <BottomNavigation/>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border-4 border-pink-500 rounded-lg shadow-[8px_8px_0px_0px_rgba(79,70,229)] w-full max-w-md overflow-hidden">
            <div className="px-4 py-3 bg-indigo-800 border-b-4 border-indigo-500">
              <h3 className="text-lg font-bold text-white"
                  style={{ 
                    textShadow: '1px 1px 0px #4F46E5',
                    fontFamily: '"Press Start 2P", cursive',
                    fontSize: '12px'
                  }}>
                PUBLISH YOUR GAME
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              {publishSuccess ? (
                <div className="bg-green-800 text-green-200 p-4 rounded-lg border-2 border-green-500 text-center animate-pulse">
                  Game published successfully!
                </div>
              ) : (
                <>
                  <div>
                    <label htmlFor="gameTitle" className="block mb-1 text-pink-300 font-bold" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>
                      GAME TITLE
                    </label>
                    <input
                      type="text"
                      id="gameTitle"
                      value={gameTitle}
                      onChange={(e) => setGameTitle(e.target.value)}
                      className="w-full bg-gray-700 border-2 border-indigo-500 rounded-md px-3 py-2 text-white focus:border-pink-500 focus:outline-none"
                      placeholder="Enter game title..."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="gameDescription" className="block mb-1 text-pink-300 font-bold" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>
                      DESCRIPTION
                    </label>
                    <textarea
                      id="gameDescription"
                      value={gameDescription}
                      onChange={(e) => setGameDescription(e.target.value)}
                      className="w-full bg-gray-700 border-2 border-indigo-500 rounded-md px-3 py-2 text-white focus:border-pink-500 focus:outline-none h-32 resize-none"
                      placeholder="Enter game description..."
                    />
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setShowPublishModal(false)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md border-2 border-gray-500 shadow-[2px_2px_0px_0px_rgba(107,114,128)] transition-all hover:shadow-[1px_1px_0px_0px_rgba(107,114,128)]"
                      style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}
                    >
                      CANCEL
                    </button>
                    
                    <button
                      onClick={handlePublishGame}
                      disabled={publishing || !gameTitle.trim() || !gameDescription.trim()}
                      className={`px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md border-2 border-pink-400 shadow-[2px_2px_0px_0px_rgba(236,72,153)] transition-all hover:shadow-[1px_1px_0px_0px_rgba(236,72,153)] flex items-center ${(publishing || !gameTitle.trim() || !gameDescription.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}
                    >
                      {publishing ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          PUBLISHING...
                        </>
                      ) : (
                        'PUBLISH GAME'
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Optional: Scanline effect for CRT feel */}
      <div className="fixed inset-0 pointer-events-none scanline opacity-30"></div>
    </div>
  );
}