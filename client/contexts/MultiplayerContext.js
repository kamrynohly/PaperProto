'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { getPlayers } from '../utils/grpcClient';

// Create the context
const MultiplayerContext = createContext();

// Custom hook to use the multiplayer context
export const useMultiplayer = () => {
  const context = useContext(MultiplayerContext);
  if (!context) {
    throw new Error('useMultiplayer must be used within a MultiplayerProvider');
  }
  return context;
};

// Provider component
export const MultiplayerProvider = ({ children }) => {
  const { currentUser, userData } = useAuth();
  
  // Game session state
  const [gameSessionID, setGameSessionID] = useState(null);
  const [creatorID, setCreatorID] = useState(null);
  const [creatorUsername, setCreatorUsername] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  
  // Player stream reference
  const [playerStream, setPlayerStream] = useState(null);
  
  // Use a ref to track existing player IDs to avoid state updates causing re-renders
  const existingPlayerIdsRef = useRef(new Set());
  
  // Effect to determine if current user is host
  useEffect(() => {
    if (userData?.userID && creatorID) {
      const isUserHost = userData.userID === creatorID;
      if (isHost !== isUserHost) {
        setIsHost(isUserHost);
      }
    }
  }, [userData?.userID, creatorID, isHost]);
  
  // Effect to clean up player stream on unmount
  useEffect(() => {
    return () => {
      if (playerStream) {
        playerStream.cancel();
      }
    };
  }, [playerStream]);
  
  // Function to initialize a new game session
  const initializeGameSession = (sessionID, hostID, hostUsername) => {
    // Reset player tracking first
    existingPlayerIdsRef.current = new Set();
    
    // Batch state updates as much as possible
    setPlayers([{
      userID: hostID,
      username: hostUsername
    }]);
    
    // These will trigger the useEffect for player monitoring
    setGameSessionID(sessionID);
    setCreatorID(hostID);
    setCreatorUsername(hostUsername);
    
    // Add host to tracked players
    existingPlayerIdsRef.current.add(hostID);
    
    // We don't need to call startPlayerMonitoring here anymore
    // as the useEffect will handle that when gameSessionID changes
  };
  
  // Function to join an existing game session
  const joinGameSession = (sessionID) => {
    // Don't do anything if we're already in this session
    if (gameSessionID === sessionID) {
      console.log('Already in this game session, no need to rejoin');
      return;
    }
    
    console.log(`Joining game session: ${sessionID}`);
    
    // Reset player tracking first
    existingPlayerIdsRef.current = new Set();
    
    // Reset state in a single batch to avoid multiple renders
    setPlayers([]);
    setCreatorID(null);
    setCreatorUsername(null);
    
    // This needs to be the last state update to trigger the useEffect only once
    setGameSessionID(sessionID);
  };
  
  // Function to start monitoring for players - moved outside of render and into a useEffect
  const startPlayerMonitoring = (sessionID) => {
    // Don't log every time - this contributes to console spam
    
    // Validate required data
    if (!sessionID || !userData || !currentUser?.uid) {
      console.error('Missing required data for player monitoring');
      return;
    }
  };
  
  // Move stream setup to a dedicated useEffect to prevent infinite loops
  useEffect(() => {
    // Don't do anything if we don't have the required data
    if (!gameSessionID || !userData?.userID || !currentUser?.uid) {
      return;
    }
    
    console.log('Setting up player monitoring subscription');
    
    // Cancel existing stream if any
    if (playerStream) {
      playerStream.cancel();
    }
    
    // Create a local variable to track if this effect is still mounted
    let isMounted = true;
    
    try {
      // Create the stream - using a try/catch to handle any initialization errors
      const stream = getPlayers(gameSessionID, currentUser.uid);
      
      // Configure stream before storing its reference
      // Listen for data events
      stream.on('data', (player) => {
        if (!isMounted) return; // Don't update state if unmounted
        if (!player || !player.userID) return;
        
        // Only update state if this is a new player
        if (!existingPlayerIdsRef.current.has(player.userID)) {
          existingPlayerIdsRef.current.add(player.userID);
          
          // Use functional update to avoid closure issues with stale state
          setPlayers(prevPlayers => {
            // Double-check we don't already have this player (extra safety)
            if (prevPlayers.some(p => p.userID === player.userID)) {
              return prevPlayers;
            }
            
            // If this is the first player and we don't have creator info yet
            if (prevPlayers.length === 0 && !creatorID && player.userID) {
              // Update creator info
              if (typeof player.username === 'string') {
                setTimeout(() => {
                  if (isMounted) {
                    setCreatorID(player.userID);
                    setCreatorUsername(player.username);
                  }
                }, 0);
              }
            }
            
            return [...prevPlayers, player];
          });
        }
      });
      
      // Handle errors
      stream.on('error', (error) => {
        if (!isMounted) return;
        console.error('Player monitoring stream error:', error);
        // Implement reconnection logic if needed
      });
      
      // Handle stream end
      stream.on('end', () => {
        if (!isMounted) return;
        console.log('Player monitoring stream ended');
        // Maybe attempt to resubscribe after a delay
      });
      
      // Store reference to the stream AFTER configuration
      if (isMounted) {
        setPlayerStream(stream);
      }
      
      // Cleanup function
      return () => {
        isMounted = false;
        if (stream) {
          try {
            stream.cancel();
          } catch (error) {
            console.error('Error canceling stream:', error);
          }
        }
      };
    } catch (error) {
      console.error('Failed to setup player monitoring subscription:', error);
      return () => { isMounted = false; };
    }
  }, [gameSessionID]); // Reduced dependencies to only gameSessionID
  
  // Function to clear game session
  const clearGameSession = () => {
    // Cancel player stream
    if (playerStream) {
      playerStream.cancel();
    }
    
    // Reset state
    setGameSessionID(null);
    setCreatorID(null);
    setCreatorUsername(null);
    setPlayers([]);
    setPlayerStream(null);
    existingPlayerIdsRef.current = new Set();
  };
  
  // Context value
  const value = {
    // State
    gameSessionID,
    creatorID,
    creatorUsername,
    players,
    isHost,
    
    // Actions
    initializeGameSession,
    joinGameSession,
    clearGameSession
  };
  
  return (
    <MultiplayerContext.Provider value={value}>
      {children}
    </MultiplayerContext.Provider>
  );
};

export default MultiplayerContext;