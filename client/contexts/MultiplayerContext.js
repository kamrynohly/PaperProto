// 'use client';

// import { createContext, useContext, useState, useEffect, useRef } from 'react';
// import { useAuth } from './AuthContext';
// import { getPlayers } from '../utils/grpcClient';

// // Create the context
// const MultiplayerContext = createContext();

// // Custom hook to use the multiplayer context
// export const useMultiplayer = () => {
//   const context = useContext(MultiplayerContext);
//   if (!context) {
//     throw new Error('useMultiplayer must be used within a MultiplayerProvider');
//   }
//   return context;
// };

// // Provider component
// export const MultiplayerProvider = ({ children }) => {
//   const { currentUser, userData } = useAuth();
  
//   // Game session state
//   const [gameSessionID, setGameSessionID] = useState(null);
//   const [creatorID, setCreatorID] = useState(null);
//   const [creatorUsername, setCreatorUsername] = useState(null);
//   const [players, setPlayers] = useState([]);
//   const [isHost, setIsHost] = useState(false);
  
//   // Player stream reference
//   const playerStreamRef = useRef(null);
  
//   // Use a ref to track existing player IDs to avoid state updates causing re-renders
//   const existingPlayerIdsRef = useRef(new Set());
  
//   // Effect to determine if current user is host
//   useEffect(() => {
//     if (userData && creatorID) {
//       setIsHost(userData.userID === creatorID);
//     }
//   }, [userData, creatorID]);
  
//   // Effect to clean up player stream on unmount
//   useEffect(() => {
//     return () => {
//       if (playerStreamRef.current) {
//         playerStreamRef.current.cancel();
//       }
//     };
//   }, []);
  
//   // Function to initialize a new game session
//   const initializeGameSession = (sessionID, hostID, hostUsername) => {
//     // Reset player tracking first
//     existingPlayerIdsRef.current = new Set();
    
//     // Set all game session states at once to prevent multiple renders
//     setGameSessionID(sessionID);
//     setCreatorID(hostID);
//     setCreatorUsername(hostUsername);
//     setPlayers([{
//       userID: hostID,
//       username: hostUsername
//     }]);
    
//     // Add host to tracked players
//     existingPlayerIdsRef.current.add(hostID);
//   };
  
//   // Function to join an existing game session
//   const joinGameSession = (sessionID) => {
//     // Only update if the session ID is different
//     if (gameSessionID === sessionID) return;
    
//     // Reset player tracking first
//     existingPlayerIdsRef.current = new Set();
//     setPlayers([]);
    
//     // Set game session ID
//     setGameSessionID(sessionID);
//   };
  
//   // Move stream setup to a dedicated useEffect to prevent infinite loops
//   useEffect(() => {
//     // Skip if no game session ID or missing user data
//     if (!gameSessionID || !userData || !currentUser?.uid) {
//       return;
//     }
    
//     console.log('Setting up player monitoring subscription');
    
//     // Cancel existing stream if any
//     if (playerStreamRef.current) {
//       playerStreamRef.current.cancel();
//       playerStreamRef.current = null;
//     }
    
//     // Create the stream
//     const stream = getPlayers(gameSessionID, currentUser.uid);
    
//     // Store reference in ref to avoid state updates
//     playerStreamRef.current = stream;
    
//     // Listen for data events
//     stream.on('data', (player) => {
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
    
//     // Cleanup function
//     return () => {
//       if (stream) {
//         stream.cancel();
//       }
//     };
//   }, [gameSessionID, currentUser?.uid, userData]);
  
//   // Function to clear game session
//   const clearGameSession = () => {
//     // Cancel player stream
//     if (playerStreamRef.current) {
//       playerStreamRef.current.cancel();
//       playerStreamRef.current = null;
//     }
    
//     // Reset state
//     setGameSessionID(null);
//     setCreatorID(null);
//     setCreatorUsername(null);
//     setPlayers([]);
//     existingPlayerIdsRef.current = new Set();
//   };
  
//   // Context value
//   const value = {
//     // State
//     gameSessionID,
//     creatorID,
//     creatorUsername,
//     players,
//     isHost,
    
//     // Actions
//     initializeGameSession,
//     joinGameSession,
//     clearGameSession
//   };
  
//   return (
//     <MultiplayerContext.Provider value={value}>
//       {children}
//     </MultiplayerContext.Provider>
//   );
// };

// export default MultiplayerContext;


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
  const [pollingEnabled, setPollingEnabled] = useState(false);
  
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
  const joinGameSession = (sessionID) => {
    // Only update if the session ID is different
    if (gameSessionID === sessionID) return;
    
    // Reset player tracking first
    existingPlayerIdsRef.current = new Set();
    setPlayers([]);
    
    // Set game session ID
    setGameSessionID(sessionID);
  };
  
  // Move stream setup to a dedicated useEffect to prevent infinite loops
  useEffect(() => {
    // Skip if no game session ID or missing user data
    if (!gameSessionID || !userData || !currentUser?.uid) {
      return;
    }
    
    console.log('Setting up player monitoring subscription');
    
    // Cancel existing stream if any
    if (playerStreamRef.current) {
      playerStreamRef.current.cancel();
      playerStreamRef.current = null;
    }
    
    // Create the stream
    const stream = getPlayers(gameSessionID, currentUser.uid);
    
    // Store reference in ref to avoid state updates
    playerStreamRef.current = stream;
    
    // Listen for data events
    stream.on('data', (player) => {
      if (!player || !player.userID) return;
      
      // Only update state if this is a new player
      if (!existingPlayerIdsRef.current.has(player.userID)) {
        existingPlayerIdsRef.current.add(player.userID);
        
        setPlayers(prevPlayers => {
          // Double-check we don't already have this player (extra safety)
          if (prevPlayers.some(p => p.userID === player.userID)) {
            return prevPlayers;
          }
          return [...prevPlayers, player];
        });
        
        // We need to be careful about setting creator info to avoid re-renders
        if (player.isCreator && !creatorID && player.userID) {
          setCreatorID(player.userID);
          if (typeof player.username === 'string') {
            setCreatorUsername(player.username);
          }
        }
      }
    });
    
    // Handle errors
    stream.on('error', (error) => {
      console.error('Player monitoring stream error:', error);
      // Implement reconnection logic if needed
    });
    
    // Handle stream end
    stream.on('end', () => {
      console.log('Player monitoring stream ended');
      // Maybe attempt to resubscribe after a delay
    });
    
    // Cleanup function
    return () => {
      if (stream) {
        stream.cancel();
      }
    };
  }, [gameSessionID, currentUser?.uid, userData]);
  
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
    setPollingEnabled(false);
    existingPlayerIdsRef.current = new Set();
  };
  
  // Function to enable polling for players
  const enablePolling = () => {
    setPollingEnabled(true);
  };
  
  // Function to disable polling for players
  const disablePolling = () => {
    setPollingEnabled(false);
  };

  // Effect for polling player data
  useEffect(() => {
    // Skip if polling is disabled or no game session
    if (!pollingEnabled || !gameSessionID || !userData || !currentUser?.uid) {
      return;
    }
    
    // Setup interval for polling
    const pollInterval = setInterval(() => {
      console.log('Polling for players...');
      
      // Create a new stream for each poll
      const pollStream = getPlayers(gameSessionID, currentUser.uid);
      
      // Listen for data events
      pollStream.on('data', (player) => {
        if (!player || !player.userID) return;
        
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
          
          // Set creator info if needed
          if (player.isCreator && !creatorID && player.userID) {
            setCreatorID(player.userID);
            if (typeof player.username === 'string') {
              setCreatorUsername(player.username);
            }
          }
        }
      });
      
      // Handle errors
      pollStream.on('error', (error) => {
        console.error('Player polling stream error:', error);
      });
      
      // Automatically close the poll stream after a short time
      setTimeout(() => {
        if (pollStream) {
          pollStream.cancel();
        }
      }, 2000);
      
    }, 5000); // Poll every 5 seconds
    
    // Cleanup function
    return () => {
      clearInterval(pollInterval);
    };
  }, [pollingEnabled, gameSessionID, currentUser?.uid, userData]);

  // Context value
  const value = {
    // State
    gameSessionID,
    creatorID,
    creatorUsername,
    players,
    isHost,
    pollingEnabled,
    
    // Actions
    initializeGameSession,
    joinGameSession,
    clearGameSession,
    enablePolling,
    disablePolling
  };
  
  return (
    <MultiplayerContext.Provider value={value}>
      {children}
    </MultiplayerContext.Provider>
  );
};

export default MultiplayerContext;