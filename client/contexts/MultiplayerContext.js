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
  const [gameId, setGameId] = useState(null);
  const [gameSessionID, setGameSessionID] = useState(null);
  const [creatorID, setCreatorID] = useState(null);
  const [creatorUsername, setCreatorUsername] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  
  // Player stream reference
  const playerStreamRef = useRef(null);
  
  // Use a ref to track existing player IDs to avoid state updates causing re-renders
  const existingPlayerIdsRef = useRef(new Set());
  
  // Effect to determine if current user is host
  useEffect(() => {
    if (userData && creatorID) {
      setIsHost(userData.userID === creatorID);
    }
  }, [userData, creatorID]);

  useEffect(() => {
    console.log("these are new players:", players)
  }, [players])
  
  // Effect to clean up player stream on unmount
  useEffect(() => {
    return () => {
      if (playerStreamRef.current) {
        playerStreamRef.current.cancel();
      }
    };
  }, []);

  // Function to fetch players for a specific game session
  const fetchPlayers = async (sessionID) => {
    if (!sessionID || !userData || !currentUser?.uid) {
      return;
    }
    
    console.log('Fetching players for session:', sessionID);
    
    // Cancel existing stream if any
    if (playerStreamRef.current) {
      playerStreamRef.current.cancel();
      playerStreamRef.current = null;
    }
    
    // Reset player tracking for fresh fetch
    existingPlayerIdsRef.current = new Set();
    
    // Create the stream
    const stream = getPlayers(sessionID, currentUser.uid);
    
    // Store reference in ref to avoid state updates
    playerStreamRef.current = stream;
    
    stream.on('data', (response) => {
        if (!response || !response.getUserid || !response.getUsername) return;
        
        const player = {
        userID: response.getUserid(),
        username: response.getUsername()
        };
        
        if (!player.userID) return;
        
        console.log('Received player data:', player);
        
        // Only update state if this is a new player
        if (!existingPlayerIdsRef.current.has(player.userID)) {
            console.log("adding player to existingPlayerIdsRef:", player.userID)
        existingPlayerIdsRef.current.add(player.userID);
        
        setPlayers(prevPlayers => {
            // Double-check we don't already have this player
            if (prevPlayers.some(p => p.userID == player.userID)) {
                return prevPlayers;
            }
            console.log("adding player to players:", player)
            
            // Update creator info if needed
            if (player.username === creatorUsername || (prevPlayers.length === 0 && !creatorID)) {
                setCreatorID(player.userID);
                setCreatorUsername(player.username);
            }
            
            return [...prevPlayers, player];
        });
        }
    });

    // Handle errors
    stream.on('error', (error) => {
      console.error('Player monitoring stream error:', error);
      // TODO: handle later!
    });
    
    // Handle stream end
    stream.on('end', () => {
        console.log('Player monitoring stream ended');
        // TODO: reconnect?
        setTimeout(() => {
        if (gameSessionID) {
            console.log('Attempting to reconnect player stream...');
            fetchPlayers(gameSessionID);
        }
        }, 2000); // Wait 2 seconds before reconnecting
    });
  };
  
  // Function to initialize a new game session
  const initializeGameSession = (gameId, sessionID, hostID, hostUsername) => {
    // Reset player tracking first
    existingPlayerIdsRef.current = new Set();
    
    // Set all game session states at once to prevent multiple renders
    setGameId(gameId);
    setGameSessionID(sessionID);
    setCreatorID(hostID);
    setCreatorUsername(hostUsername);
    setPlayers([{
      userID: hostID,
      username: hostUsername
    }]);
    
    // Add host to tracked players
    existingPlayerIdsRef.current.add(hostID);
    console.log("initialized game session, here are the players:", players)
  };
  
  
  // Function to join an existing game session
  const joinGameSession = (gameId, sessionID, userID, username) => {
      // Only update if the session ID is different
      if (gameSessionID === sessionID) return;
      
      // Reset player tracking first
      existingPlayerIdsRef.current = new Set();
      // setPlayers([]);
      
      // Set game session ID
      setGameId(gameId);
      setGameSessionID(sessionID);
      
      // Add the joining player to the tracked players first
      if (userID && username) {
        existingPlayerIdsRef.current.add(userID);
        setPlayers([{
            userID,
            username
        }]);
      }
    
    // Add the joining player to the tracked players first
    if (userID && username) {
      existingPlayerIdsRef.current.add(userID);
      setPlayers([{
        userID,
        username
      }]);
    }
    
    // Fetch players for this session
    fetchPlayers(sessionID);
  };

  // Function to clear game session
  const clearGameSession = () => {
    // Cancel player stream
    if (playerStreamRef.current) {
      playerStreamRef.current.cancel();
      playerStreamRef.current = null;
    }
    // Reset state
    setGameSessionID(null);
    setCreatorID(null);
    setCreatorUsername(null);
    setPlayers([]);
    existingPlayerIdsRef.current = new Set();
  };
  
  // Context value
  const value = {
    // State
    gameId,
    gameSessionID,
    creatorID,
    creatorUsername,
    players,
    isHost,
    
    // Actions
    initializeGameSession,
    joinGameSession,
    clearGameSession,
    fetchPlayers
  };
  
  return (
    <MultiplayerContext.Provider value={value}>
      {children}
    </MultiplayerContext.Provider>
  );
};

export default MultiplayerContext;