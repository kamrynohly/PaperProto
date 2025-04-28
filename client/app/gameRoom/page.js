'use client';

import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useMultiplayer } from '../../contexts/MultiplayerContext';
import BottomNavigation from '../../components/BottomNavigation';
import { launchGameRoom, joinGameRoom, heartbeat } from '../../utils/grpcClient';

export default function MultiplayerPage() {
  const [sessionCode, setSessionCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  const router = useRouter();

  // Current user data
  const { currentUser, userData } = useAuth();
  const { initializeGameSession, joinGameSession } = useMultiplayer();

  // Check server connection on component mount
  useEffect(() => {
    checkServerStatus();
  }, []);
  
  // Function to check server connection status using gRPC heartbeat
  const checkServerStatus = async () => {
    setServerStatus('checking');
    try {
      const result = await heartbeat("requesterID", "serverID");
      
      if (result && result.status) {
        setServerStatus('online');
      } else {
        setServerStatus('offline');
      }
    } catch (error) {
      console.error('Server heartbeat failed:', error);
      setServerStatus('offline');
    }
  };
  
  const handleJoinGame = async (e) => {
    e.preventDefault();
    if (!sessionCode.trim()) {
      setError('Please enter a valid game session code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the joinGameRoom gRPC function
      const result = await joinGameRoom(
        sessionCode, 
        currentUser.uid, 
        currentUser.username
      );
      
      // TODO: handle status
      if (result) {
        // Set the game session in the multiplayer context
        joinGameSession(sessionCode, currentUser.uid, currentUser.username);
        
        // Navigate to the waiting room
        router.push(`/waiting`);
      } else {
        setError('Failed to join game. The session may not exist or has ended.');
      }
    } catch (error) {
      console.error('Error joining game:', error);
      setError(error.message || 'An error occurred while joining the game.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGame = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const gameSessionID = uuidv4();
    const userID = currentUser.uid;
    const username = userData.username;
    
    try {
      const result = await launchGameRoom(gameSessionID, userID, username);
      
      if (result) {
        console.log("Creating game session...");
        
        // Initialize game session in context
        initializeGameSession(gameSessionID, userID, username);
        
        // Navigate to waiting room
        router.push(`/waiting`);
      } else {
        console.log("Something went wrong creating game session");
        setError("Failed to create game session. Please try again.");
      }
    } catch (error) {
      console.error('Game session creation failed:', error);
      setError(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Get status indicator color
  const getStatusColor = () => {
    switch (serverStatus) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  // Get status text
  const getStatusText = () => {
    switch (serverStatus) {
      case 'online': return 'Server Online';
      case 'offline': return 'Server Offline';
      default: return 'Checking Server Status...';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-6 pb-20 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-pink-500 mb-8" 
            style={{ textShadow: '0px 0px 8px rgba(236, 72, 153, 0.6)' }}>
          Multiplayer
        </h1>
        
        {/* Server Status Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center px-4 py-2 rounded-full bg-gray-800 border border-gray-700">
            <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor()}`}></div>
            <span className="text-sm">{getStatusText()}</span>
            <button 
              onClick={checkServerStatus} 
              className="ml-3 text-xs text-indigo-400 hover:text-indigo-300"
              aria-label="Refresh server status"
            >
              ↻
            </button>
          </div>
        </div>
        
        {/* Create Game Section */}
        <div className="bg-gray-800 rounded-lg border-2 border-indigo-500 p-6 mb-8 shadow-lg"
             style={{ boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)' }}>
          <h2 className="text-xl font-semibold mb-4 text-indigo-400">Create New Game</h2>
          <p className="text-gray-300 mb-4">
            Start a new multiplayer game session and invite friends to join.
          </p>
          <button 
            onClick={handleCreateGame}
            disabled={isLoading || serverStatus === 'offline'}
            className="block w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-md text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 disabled:bg-pink-800 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Game'}
          </button>
          {serverStatus === 'offline' && 
            <p className="mt-2 text-sm text-yellow-400">Cannot create game while server is offline</p>
          }
        </div>
        
        {/* Join Game Section */}
        <div className="bg-gray-800 rounded-lg border-2 border-indigo-500 p-6 shadow-lg"
             style={{ boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)' }}>
          <h2 className="text-xl font-semibold mb-4 text-indigo-400">Join Game Session</h2>
          
          <form onSubmit={handleJoinGame}>
            <div className="mb-4">
              <label htmlFor="sessionCode" className="block text-sm font-medium text-gray-300 mb-1">
                Game Session Code
              </label>
              <input
                type="text"
                id="sessionCode"
                value={sessionCode}
                onChange={(e) => {
                  setSessionCode(e.target.value);
                  setError('');
                }}
                placeholder="Enter game session code..."
                className="w-full px-4 py-2 bg-gray-700 rounded-md border border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-white"
              />
              {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
            </div>
            
            <button
              type="submit"
              disabled={serverStatus === 'offline'}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:bg-indigo-800 disabled:cursor-not-allowed"
            >
              Join Game
            </button>
            {serverStatus === 'offline' && 
              <p className="mt-2 text-sm text-yellow-400">Cannot join game while server is offline</p>
            }
          </form>
        </div>
      </div>
      <BottomNavigation/>
    </div>
  );
}