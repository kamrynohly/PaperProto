"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatInterface from '../../components/ChatInterface';
import GameDisplay from '../../components/GameDisplay';
import GameDisplayMulti from '../../components/GameDisplayMulti';
import { Gamepad2, MessageSquare, AlertTriangle, Share2, Users } from 'lucide-react';
import BottomNavigation from '../../components/BottomNavigation';
import { useAuth } from '../../contexts/AuthContext';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const router = useRouter();
  const [gameCode, setGameCode] = useState(null);
  const [gameType, setGameType] = useState(null);
  const [gameMode, setGameMode] = useState(null); // New state for game mode
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [gameTitle, setGameTitle] = useState('');
  const [gameDescription, setGameDescription] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [gameImage, setGameImage] = useState(null);
  const [gameImagePreview, setGameImagePreview] = useState(null);

  const { currentUser, userData } = useAuth();

  useEffect(() => {
    setMounted(true);
    document.getElementById('game-container')?.classList.add('crt-on');
  }, []);

  // Optimized to prevent unnecessary re-renders
  const handleGameGeneration = async (type, code, mode) => {
    setLoading(true);
    setError(null);
    try {
      // Only update these if they've changed to prevent unnecessary re-renders
      if (type !== gameType) setGameType(type);
      if (mode !== gameMode) setGameMode(mode);
      
      // For the code, only update if content has changed
      if (code && code !== gameCode) {
        setGameCode(code);
        console.log(`Received ${type} game code, length: ${code.length}, mode: ${mode}`);
      } else if (!code) {
        console.warn("No game code provided");
      }
    } catch (error) {
      console.error('Error processing game:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setGameImagePreview(ev.target.result);
    reader.readAsDataURL(file);
    setGameImage(file);
  };

  const handlePublishGame = async () => {
    if (!gameCode || !gameTitle.trim() || !gameDescription.trim()) {
      setError("Please generate a game and provide a title and description");
      return;
    }
    
    // Check if user is logged in
    if (!currentUser) {
      // Redirect to auth page instead of just showing an error
      router.push('/auth');
      return;
    }
  
    const userId = currentUser.uid;
    const userName = userData?.username || currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous User';
  
    setPublishing(true);
    setError(null);

    try {
      const gameUuid = uuidv4();
      const imageBase64 = gameImagePreview || null;

      // Include gameMode in the data saved to Firestore
      await setDoc(doc(db, "games", gameUuid), {
        game_uuid: gameUuid,
        creator_id: userId,
        creator_name: userName,
        title: gameTitle,
        description: gameDescription,
        gameType: gameType,
        gameCode: gameCode,
        gameMode: gameMode, // Save the game mode to database
        image: imageBase64,
        playCount: 0,
        favCount: 0,
        createdAt: new Date()
      });

      if (userData) {
        const userRef = doc(db, "users", userId);
        const currentProjectIds = userData.project_ids || [];
        const gameCount = userData.gameCount || 0;
        if (!currentProjectIds.includes(gameUuid)) {
          await updateDoc(userRef, {
            gameCount: gameCount + 1,
            project_ids: [...currentProjectIds, gameUuid]
          });
        }
      }

      setPublishSuccess(true);
      setTimeout(() => {
        setPublishSuccess(false);
        setShowPublishModal(false);
        setGameTitle('');
        setGameDescription('');
        setGameImage(null);
        setGameImagePreview(null);
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
                onClick={() => {
                if (!currentUser) {
                    router.push('/auth');
                } else {
                    setShowPublishModal(true);
                }
                }}
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
            <div className="px-4 py-2 bg-indigo-800 border-b-4 border-indigo-500 flex items-center justify-between">
              <div className="flex items-center">
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
              
              {/* Display game mode if available */}
              {gameMode && (
                <div className="flex items-center bg-indigo-700 px-3 py-1 rounded-full border border-indigo-500">
                  <Users size={14} className="mr-1 text-pink-400" />
                  <span className="text-xs text-white" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '8px' }}>
                    {gameMode === 'single' ? '1P MODE' : '2P MODE'}
                  </span>
                </div>
              )}
            </div>
            {/* Pass explicitly loading={loading} to ensure the prop is passed */}
            {
                gameMode === 'single' ? (
                    <GameDisplay 
                        gameCode={gameCode} 
                        gameType={gameType}
                        loading={loading} 
                    />
                ) : (
                    <GameDisplayMulti
                        gameCode={gameCode} 
                        gameType={gameType}
                        loading={loading} 
                    />
                )
            }
          </div>
        </div>
      </main>
      
      <BottomNavigation/>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border-4 border-pink-500 rounded-lg w-full max-w-md">
            <div className="p-4 border-b-4 border-indigo-500 bg-indigo-800">
              <h3 className="text-lg text-white font-bold">PUBLISH YOUR GAME</h3>
            </div>
            <div className="p-6 space-y-4">
              {publishSuccess ? (
                <div className="bg-green-800 text-green-200 p-4 rounded text-center animate-pulse">
                  Game published successfully!
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm text-pink-300 font-bold">GAME TITLE</label>
                    <input
                      type="text"
                      value={gameTitle}
                      onChange={(e) => setGameTitle(e.target.value)}
                      className="w-full bg-gray-700 border-2 border-indigo-500 rounded px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-pink-300 font-bold">DESCRIPTION</label>
                    <textarea
                      value={gameDescription}
                      onChange={(e) => setGameDescription(e.target.value)}
                      className="w-full bg-gray-700 border-2 border-indigo-500 rounded px-3 py-2 text-white h-24 resize-none"
                    />
                  </div>

                  {/* Display game mode in the publish modal */}
                  <div>
                    <label className="block text-sm text-pink-300 font-bold">GAME MODE</label>
                    <div className="mt-1 text-white bg-gray-700 border-2 border-indigo-500 rounded px-3 py-2 flex items-center">
                      <Users size={16} className="mr-2 text-indigo-400" />
                      <span>{gameMode === 'single' ? 'One Player Mode' : 'Two Player Mode'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-pink-300 font-bold">COVER IMAGE</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 text-white" />
                    {gameImagePreview && (
                      <img src={gameImagePreview} className="w-full h-32 object-cover rounded mt-2" alt="Cover Preview" />
                    )}
                  </div>

                  <div className="flex justify-between">
                    <button onClick={() => setShowPublishModal(false)} className="px-4 py-2 bg-gray-700 text-white rounded">Cancel</button>
                    <button
                      onClick={handlePublishGame}
                      disabled={publishing || !gameTitle.trim() || !gameDescription.trim()}
                      className="px-4 py-2 bg-pink-600 text-white rounded disabled:opacity-50"
                    >
                      {publishing ? 'Publishing...' : 'Publish Game'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
