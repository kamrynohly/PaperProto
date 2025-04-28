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
  const playerStreamRef = useRef(null);
  
  // Use a ref to track existing player IDs to avoid state updates causing re-renders
  const existingPlayerIdsRef = useRef(new Set());
  
  // Effect to determine if current user is host
  useEffect(() => {
    if (userData && creatorID) {
      setIsHost(userData.userID === creatorID);
    }
  }, [userData, creatorID]);
  
  // Effect to clean up player stream on unmount
  useEffect(() => {
    return () => {
      if (playerStreamRef.current) {
        playerStreamRef.current.cancel();
      }
    };
  }, []);

  // Function to fetch players for a specific game session
//   const fetchPlayers = async (sessionID) => {
//     if (!sessionID || !userData || !currentUser?.uid) {
//       return;
//     }
    
//     console.log('Fetching players for session:', sessionID);
    
//     // Cancel existing stream if any
//     if (playerStreamRef.current) {
//       playerStreamRef.current.cancel();
//       playerStreamRef.current = null;
//     }
    
//     // Reset player tracking for fresh fetch
//     existingPlayerIdsRef.current = new Set();
    
//     // Create the stream
//     const stream = getPlayers(sessionID, currentUser.uid);
    
//     // Store reference in ref to avoid state updates
//     playerStreamRef.current = stream;
    
//     // Listen for data events
//     stream.on('data', (player) => {
//         console.log("NEW PLAYER?????", player)
//       if (!player || !player.userID) return;
      
//       // Only update state if this is a new player
//       if (!existingPlayerIdsRef.current.has(player.userID)) {
//         existingPlayerIdsRef.current.add(player.userID);
        
//         setPlayers(prevPlayers => {
//           // Double-check we don't already have this player (extra safety)
//           if (prevPlayers.some(p => p.userID === player.userID)) {
//             return prevPlayers;
//           }
//           return [...prevPlayers, player];
//         });
        
//         // We need to be careful about setting creator info to avoid re-renders
//         if (player.isCreator && !creatorID && player.userID) {
//           setCreatorID(player.userID);
//           if (typeof player.username === 'string') {
//             setCreatorUsername(player.username);
//           }
//         }
//       }
//     });
    
//     // Handle errors
//     stream.on('error', (error) => {
//       console.error('Player monitoring stream error:', error);
//       // Implement reconnection logic if needed
//     });
    
//     // Handle stream end
//     stream.on('end', () => {
//       console.log('Player monitoring stream ended');
//       // Maybe attempt to resubscribe after a delay
//     });
//   };

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
    
// <<<<<<< Updated upstream
    // Create the stream
    const stream = getPlayers(sessionID, currentUser.uid);
    
    // Store reference in ref to avoid state updates
    playerStreamRef.current = stream;
    
    // In MultiplayerContext.js
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
        existingPlayerIdsRef.current.add(player.userID);
        
        setPlayers(prevPlayers => {
            // Double-check we don't already have this player
            if (prevPlayers.some(p => p.userID === player.userID)) {
            return prevPlayers;
            }
            return [...prevPlayers, player];
        });
        
        // Update creator info if needed
        if (player.username === creatorUsername || (prevPlayers.length === 0 && !creatorID)) {
            setCreatorID(player.userID);
            setCreatorUsername(player.username);
        }
        }
    });
// =======
    // // Create the stream with a callback function
    // const stream = getPlayers(
    //   sessionID, 
    //   currentUser.uid, 
    //   (player) => {
    //     console.log("Player received:", player.username);
        
    //     if (!player || !player.userID) return;
        
    //     // Only update state if this is a new player
    //     if (!existingPlayerIdsRef.current.has(player.userID)) {
    //       existingPlayerIdsRef.current.add(player.userID);
          
    //       setPlayers(prevPlayers => {
    //         // Double-check we don't already have this player (extra safety)
    //         if (prevPlayers.some(p => p.userID === player.userID)) {
    //           return prevPlayers;
    //         }
    //         return [...prevPlayers, player];
    //       });
          
    //       // We need to be careful about setting creator info to avoid re-renders
    //       if (player.isCreator && !creatorID && player.userID) {
    //         setCreatorID(player.userID);
    //         if (typeof player.username === 'string') {
    //           setCreatorUsername(player.username);
    //         }
    //       }
    //     }
    //   }
    // );
    
    // // Store reference in ref to avoid state updates
    // playerStreamRef.current = stream;
// >>>>>>> Stashed changes
    
    // Handle errors
    stream.on('error', (error) => {
      console.error('Player monitoring stream error:', error);
      // Implement reconnection logic if needed
    });
    
    // Handle stream end
    // Handle stream end
    stream.on('end', () => {
        console.log('Player monitoring stream ended');
        // Implement reconnection logic
        setTimeout(() => {
        if (gameSessionID) {
            console.log('Attempting to reconnect player stream...');
            fetchPlayers(gameSessionID);
        }
        }, 2000); // Wait 2 seconds before reconnecting
    });
  };
  
  // Function to initialize a new game session
  const initializeGameSession = (sessionID, hostID, hostUsername) => {
    // Reset player tracking first
    existingPlayerIdsRef.current = new Set();
    
    // Set all game session states at once to prevent multiple renders
    setGameSessionID(sessionID);
    setCreatorID(hostID);
    setCreatorUsername(hostUsername);
    setPlayers([{
      userID: hostID,
      username: hostUsername
    }]);
    
    // Add host to tracked players
    existingPlayerIdsRef.current.add(hostID);
  };
  
  // Function to join an existing game session
//   const joinGameSession = (sessionID, userID, username) => {
//     // Only update if the session ID is different
//     if (gameSessionID === sessionID) return;
    
//     // Reset player tracking first
//     existingPlayerIdsRef.current = new Set();
//     setPlayers([]);
    
//     // Set game session ID
//     setGameSessionID(sessionID);
    
//     // Fetch players for this session
//     fetchPlayers(sessionID);
//   };
  
    // Function to join an existing game session
    const joinGameSession = (sessionID, userID, username) => {
        // Only update if the session ID is different
        if (gameSessionID === sessionID) return;
        
        // Reset player tracking first
        existingPlayerIdsRef.current = new Set();
        setPlayers([]);
        
        // Set game session ID
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
    gameSessionID,
    creatorID,
    creatorUsername,
    players,
    isHost,
    
    // Actions
    initializeGameSession,
    joinGameSession,
    clearGameSession,
    fetchPlayers // Export the new function
  };
  
  return (
    <MultiplayerContext.Provider value={value}>
      {children}
    </MultiplayerContext.Provider>
  );
};

export default MultiplayerContext;