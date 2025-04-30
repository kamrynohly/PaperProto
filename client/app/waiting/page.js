'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useMultiplayer } from '../../contexts/MultiplayerContext';
import BottomNavigation from '../../components/BottomNavigation';
import { heartbeat } from '../../utils/grpcClient';

export default function WaitingRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { userData } = useAuth();
  const { gameId, gameSessionID, players, joinGameSession, fetchPlayers } = useMultiplayer();
  
  const [serverStatus, setServerStatus] = useState('checking');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [lastPolled, setLastPolled] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(null);
  
  // Ref to track if we've already joined the session
  const hasJoinedSessionRef = useRef(false);
  // Ref to store interval ID for polling
  const pollingIntervalRef = useRef(null);

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
  
  // Start player polling when component mounts
  const startPlayerPolling = () => {
    // Clear any existing interval first
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    // Set up polling interval
    pollingIntervalRef.current = setInterval(() => {
      if (gameSessionID) {
        fetchPlayers(gameSessionID);
        setLastPolled(new Date());
      }
    }, 1000); 
  };
  
  // Stop player polling when component unmounts
  const stopPlayerPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      console.log("stopped polling: ", players)
    }
  };
  
  // Join the game session when component mounts
//   useEffect(() => {
//     // Only join if we have the required data AND haven't joined yet
//     if (params.id && userData && !hasJoinedSessionRef.current) {
//       joinGameSession(params.id);
//       // Mark that we've joined to prevent repeated calls
//       hasJoinedSessionRef.current = true;
//     }
//   }, [params.id, userData, joinGameSession]);
  
  // Start polling when gameSessionID is available
  useEffect(() => {
    if (gameSessionID && userData) {
      startPlayerPolling();
    }
    
    return () => {
      stopPlayerPolling();
    };
  }, [gameSessionID, userData]);
  
  // Check server connection on component mount
  useEffect(() => {
    checkServerStatus();
    
    // Poll for server status every 30 seconds
    const statusInterval = setInterval(checkServerStatus, 30000);
    
    return () => {
      clearInterval(statusInterval);
    };
  }, []);

  // Effect to monitor player count and start countdown when it reaches 2 players
  useEffect(() => {
    // Check if we have at least 2 players and server is online
    if (
      players.length >= 2 && 
      serverStatus === 'online' && 
      !isRedirecting && 
      gameSessionID &&
      countdown === null
    ) {
      // Start 3 second countdown
      setCountdown(3);
      setIsRedirecting(true);
    }
  }, [players.length, serverStatus, isRedirecting, gameSessionID, countdown]);
  
  // Countdown effect
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Redirect when countdown reaches 0
      router.push(`/games/${gameId}`);
    }
  }, [countdown, router, gameId]);
  
  // Function to copy game session ID to clipboard
  const copySessionCode = () => {
    navigator.clipboard.writeText(gameSessionID)
      .then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        setCopySuccess('Failed to copy');
      });
  };
  
  // Function to leave the waiting room
  const handleLeaveRoom = () => {
    router.push('/multiplayer');
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
          Waiting Room
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
        
        {/* Game Session Code */}
        <div className="bg-gray-800 rounded-lg border-2 border-indigo-500 p-6 mb-8 shadow-lg"
            style={{ boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)' }}>
        <h2 className="text-xl font-semibold mb-4 text-indigo-400">Game Session</h2>
        
        <div className="flex flex-col sm:flex-row items-stretch mb-4">
            <div className="bg-gray-700 px-4 py-2 rounded-t-md sm:rounded-l-md sm:rounded-tr-none border border-gray-600 text-white break-all">
            {gameSessionID}
            </div>
            <button 
            onClick={copySessionCode}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-b-md sm:rounded-r-md sm:rounded-bl-none border border-indigo-600 text-white transition-colors duration-200 whitespace-nowrap"
            >
            {copySuccess || 'Copy'}
            </button>
        </div>
        
        <p className="text-gray-300 text-sm">
            Share this code with friends to let them join your game.
        </p>
        </div>
        
        {/* Players List */}
        <div className="bg-gray-800 rounded-lg border-2 border-indigo-500 p-6 mb-8 shadow-lg"
             style={{ boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)' }}>
          <h2 className="text-xl font-semibold mb-4 text-indigo-400">Players</h2>
          
          {players.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <p>Waiting for players to join...</p>
              <div className="mt-3 w-8 h-8 border-t-2 border-indigo-500 border-r-2 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <ul className="space-y-2">
              {players.map((player, index) => (
                <li 
                  key={player.userID || index}
                  className="bg-gray-700 rounded-md px-4 py-3 flex items-center"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center mr-3 flex-shrink-0">
                    {player.username ? player.username.charAt(0).toUpperCase() : '?'}
                  </div>
                  <span className="flex-1">{player.username || 'Unknown'}</span>
                  {index === 0 && (
                    <span className="bg-pink-600 text-xs px-2 py-1 rounded-md ml-2">Host</span>
                  )}
                  {player.userID === userData?.userID && (
                    <span className="bg-indigo-600 text-xs px-2 py-1 rounded-md ml-2">You</span>
                  )}
                </li>
              ))}
            </ul>
          )}
          
          <div className="mt-6 text-sm text-gray-400 text-center">
            {players.length} {players.length === 1 ? 'player' : 'players'} in the room
          </div>
        </div>
        
        {/* Countdown Display */}
        {countdown !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg border-2 border-pink-500 p-8 text-center shadow-lg" 
                 style={{ boxShadow: '0 0 20px rgba(236, 72, 153, 0.6)' }}>
              <h2 className="text-2xl font-bold mb-4 text-white">
                Game Starting
              </h2>
              <div className="text-6xl font-bold text-pink-500 mb-4" 
                   style={{ textShadow: '0px 0px 10px rgba(236, 72, 153, 0.8)' }}>
                {countdown}
              </div>
              <p className="text-gray-300">
                Redirecting to game...
              </p>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button 
            onClick={handleLeaveRoom}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-md text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Leave Room
          </button>
          
          <button 
            disabled={serverStatus === 'offline' || players.length < 2 || isRedirecting}
            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-4 rounded-md text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 disabled:bg-pink-800 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Starting...' : 'Start Game'}
          </button>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-center text-red-200">
            {error}
          </div>
        )}
        
        {/* Player count message */}
        {players.length < 2 && (
          <div className="mt-4 text-yellow-400 text-sm text-center">
            At least 2 players are needed to start the game
          </div>
        )}
        
        {/* Auto-start notification when enough players have joined */}
        {players.length >= 2 && !countdown && (
          <div className="mt-4 text-green-400 text-sm text-center">
            Game will start automatically when 2 players have joined
          </div>
        )}
      </div>
      <BottomNavigation/>
    </div>
  );
}