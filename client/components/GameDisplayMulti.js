"use client"
// components/GameDisplayMulti.js

import { useState, useEffect, useRef } from 'react';
import DinoGame from './DinoGame';
import RetroLeaderboard from './RetroLeaderboard';
import { subscribeToGameUpdates, sendGameUpdate } from '../utils/grpcClient';
import { useAuth } from '../contexts/AuthContext';
import { useMultiplayer } from '../contexts/MultiplayerContext';

export default function GameDisplayMulti({ gameCode, gameType, loading }) {
  const [gameTitle, setGameTitle] = useState('');
  const [gameMessages, setGameMessages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [gameKey, setGameKey] = useState(Date.now()); // Key for forcing re-render
  const [lastScore, setLastScore] = useState(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const gameContainerRef = useRef(null);
  const iframeRef = useRef(null);
  const streamRef = useRef(null);
  const loadTimeoutRef = useRef(null);
  const { currentUser, userData } = useAuth();
  const { gameId, gameSessionID, players, creatorID, creatorUsername } = useMultiplayer();

  // Log multiplayer context for debugging
  useEffect(() => {
    console.log("Multiplayer context:", { 
      gameId, 
      gameSessionID, 
      playersCount: players?.length, 
      creatorID,
      isFirstLoad
    });
  }, [gameId, gameSessionID, players, creatorID, isFirstLoad]);

  // Update display title when gameType changes
  useEffect(() => {
    if (gameType) {
      const formattedType = gameType
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      setGameTitle(formattedType);
    }
  }, [gameType]);

  // Setup game initialization with retry mechanism
  useEffect(() => {
    let initTimer = null;
    
    const initGame = () => {
      if (!iframeRef.current || !iframeRef.current.contentWindow) {
        console.log("iframe not ready yet, delaying initialization");
        return;
      }
      
      console.log("initializing game: assign player 1 or player 2");
      console.log("current user:", currentUser?.uid);
      console.log("creator id:", creatorID);
      
      let player;
      if (currentUser?.uid === creatorID) {
        player = "you are player 1";
        console.log("you are player 1");
      } else {
        player = "you are player 2";
        console.log("you are player 2");
      }
      
      try {
        iframeRef.current.contentWindow.postMessage({
          type: "initGame",
          update: player
        }, '*');
        console.log("Game initialization message sent");
      } catch (err) {
        console.error("Error sending init message to iframe:", err);
      }
    };

    // Initialize the game when loaded and multiplayer context is available
    if (loaded) {
      // For the first load or when players aren't available yet, default to player 1
      if (isFirstLoad || !players || players.length <= 1) {
        console.log("First load or players not available yet, defaulting to player 1");
        if (iframeRef.current && iframeRef.current.contentWindow) {
          try {
            iframeRef.current.contentWindow.postMessage({
              type: "initGame",
              update: "you are player 1"
            }, '*');
            console.log("Default player 1 initialization sent");
            
            // Mark that we've initialized this game
            setIsFirstLoad(false);
          } catch (err) {
            console.error("Error sending default init message:", err);
          }
        }
      } 
      // If we have proper multiplayer context with multiple players
      else if (players.length > 1) {
        // Clear any existing init timer
        if (initTimer) clearTimeout(initTimer);
        
        // Add a small delay to ensure iframe is fully loaded
        initTimer = setTimeout(initGame, 500);
      }
    }

    return () => {
      if (initTimer) clearTimeout(initTimer);
    };
  }, [loaded, players, creatorID, currentUser, isFirstLoad]);

  // Setup message listener for communication from iframe
  useEffect(() => {
    const handleMessage = async (event) => {
      console.log('1. Message received from this clients subclient game:', event.data);
      
      // Verify message format
      if (event.data && typeof event.data.type === 'string') {
        // Store message for debugging or state management
        setGameMessages(prev => [...prev, event.data]);
        
        switch(event.data.type) {
          case 'updateGameState':
            console.log('2. Preparing to send local game state to other player:', event.data.update);

            try {
              if (!currentUser?.uid) {
                console.error('Cannot send game update: currentUser.uid is undefined');
                return;
              }
              
              if (!gameSessionID) {
                console.error('Cannot send game update: gameSessionID is undefined');
                return;
              }
              
              const response = await sendGameUpdate(currentUser.uid, String(event.data.update), gameSessionID);
              console.log('3. Game update response:', response);
            } catch (error) {
              console.error('3. Failed to send game update:', error);
            }
            break;
          case 'gameOver':
            console.log('🥇 Game over. Add to score:', event.data.update);
            // Handle game over - save score to Firebase
            if (event.data.update && !isNaN(parseInt(event.data.update))) {
              // Save the score to Firebase via RetroLeaderboard component
              setLastScore(parseInt(event.data.update));
              
              // Save score through Firebase directly - moved to the game page component
              // This will let the parent (game page) know a score was recorded
              if (window.parent) {
                window.parent.postMessage({
                  type: 'gameOver',
                  score: parseInt(event.data.update)
                }, '*');
              }
              
              // Show the play again button overlay
              const overlay = document.createElement('div');
              overlay.id = 'game-over-overlay';
              overlay.style.position = 'absolute';
              overlay.style.top = '0';
              overlay.style.left = '0';
              overlay.style.width = '100%';
              overlay.style.height = '100%';
              overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
              overlay.style.display = 'flex';
              overlay.style.flexDirection = 'column';
              overlay.style.justifyContent = 'center';
              overlay.style.alignItems = 'center';
              overlay.style.zIndex = '1000';
              
              const scoreDisplay = document.createElement('div');
              scoreDisplay.textContent = `SCORE: ${parseInt(event.data.update)}`;
              scoreDisplay.style.fontFamily = '"Press Start 2P", cursive';
              scoreDisplay.style.color = '#ec4899'; // Pink color
              scoreDisplay.style.fontSize = '24px';
              scoreDisplay.style.marginBottom = '20px';
              
              const playAgainBtn = document.createElement('button');
              playAgainBtn.textContent = 'PLAY AGAIN';
              playAgainBtn.style.padding = '10px 20px';
              playAgainBtn.style.backgroundColor = '#7c3aed'; // Purple
              playAgainBtn.style.color = 'white';
              playAgainBtn.style.border = '2px solid #a78bfa';
              playAgainBtn.style.borderRadius = '4px';
              playAgainBtn.style.fontFamily = '"Press Start 2P", cursive';
              playAgainBtn.style.cursor = 'pointer';
              playAgainBtn.style.boxShadow = '0 4px 0 #4F46E5';
              
              playAgainBtn.onclick = () => {
                // Remove overlay
                if (gameContainerRef.current && gameContainerRef.current.contains(overlay)) {
                  gameContainerRef.current.removeChild(overlay);
                }
                
                // Regenerate game by setting a new key
                setGameKey(Date.now());
              };
              
              overlay.appendChild(scoreDisplay);
              overlay.appendChild(playAgainBtn);
              
              // Append to the game container
              if (gameContainerRef.current) {
                gameContainerRef.current.appendChild(overlay);
              }
            }
            break;
          case 'ready':
            console.log('Game is ready:', event.data.update);
            break;
          case 'loaded':
            console.log('Game is loaded');
            setLoaded(true);
            // Clear any pending force-load timeout
            if (loadTimeoutRef.current) {
              clearTimeout(loadTimeoutRef.current);
            }
            break;
          case 'error':
            console.error('Game error:', event.data.update);
            break;
        }
      }
    };

    // Add message event listener
    window.addEventListener('message', handleMessage);

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [currentUser, gameContainerRef, gameSessionID]);

  // Function to restart the game
  const handleRestartGame = () => {
    setGameKey(Date.now());
    setLastScore(null);
    setLoaded(false); // Reset loaded state to trigger loading indicator
    setIsFirstLoad(true); // Reset first load flag to re-initialize
  };

  // Function to manually force loaded state
  const forceLoadedState = () => {
    setLoaded(true);
    console.log("Forced loaded state to true");
  };

  // Function to update game in the iframe
  const updateGame = (type, update) => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) {
      console.error("Cannot update game: iframe not ready");
      return;
    }
    
    // Extract the game state from the gRPC response object
    let gameState = update;
    
    // Check if it's a complex object with expected properties
    if (update && typeof update !== 'string') {
      // Try to use the protobuf getters first
      if (typeof update.getGamestate === 'function') {
        gameState = update.getGamestate();
      }
      // Fall back to accessing the u array if getters don't work
      else if (update.u && Array.isArray(update.u) && update.u.length > 1) {
        // The second element in the 'u' array contains our game state
        gameState = update.u[1];
      }
    }
    
    console.log("Sending game state to iframe:", gameState);
    
    try {
      iframeRef.current.contentWindow.postMessage({
        type: type,
        update: gameState
      }, '*');
    } catch (err) {
      console.error("Error sending update to iframe:", err);
    }
  };

  // Setup game update subscription with auto-reconnect and limits
  useEffect(() => {
    // Skip if we're missing any required data
    if (!gameCode) {
      console.log("Missing gameCode, skipping subscription setup");
      return;
    }
    
    if (!currentUser?.uid) {
      console.log("Missing currentUser.uid, skipping subscription setup");
      return;
    }
    
    if (!gameSessionID) {
      console.log("Missing gameSessionID, skipping subscription setup");
      return;
    }
    
    let isActive = true;
    let reconnectTimer = null;
    let reconnectCount = 0;
    const MAX_RECONNECT_ATTEMPTS = 5;
    
    const setupStream = () => {
      console.log('Setting up game update subscription');
      
      // Cancel any existing subscription
      if (streamRef.current) {
        streamRef.current.cancel();
        streamRef.current = null;
      }
      
      try {
        // Create the stream with a callback function
        const stream = subscribeToGameUpdates(
          gameSessionID, 
          currentUser.uid,
          (update) => {
            console.log('Received update from other player:', update);
            if (update && update.fromPlayerID !== currentUser.uid) {
              console.log('Forwarding update from player:', update.fromPlayerID);
              updateGame("updateGameState", update.gameState);
            }
          }
        );
        
        // Reset reconnect counter on successful connection
        reconnectCount = 0;
        
        // Store reference to the stream
        streamRef.current = stream;
        
        // Handle stream ending and errors
        const handleDisconnect = (reason) => {
          console.log(`Stream disconnected: ${reason}`);
          
          // Clear any pending reconnect
          if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
          }
          
          // Schedule reconnection if component is still mounted and we haven't exceeded max attempts
          if (isActive && reconnectCount < MAX_RECONNECT_ATTEMPTS) {
            console.log(`Scheduling reconnection (attempt ${reconnectCount + 1}/${MAX_RECONNECT_ATTEMPTS})...`);
            reconnectCount++;
            
            // Backoff strategy: wait longer between retries
            const backoffTime = 1000 * Math.min(reconnectCount, 5);
            console.log(`Waiting ${backoffTime}ms before reconnecting`);
            
            reconnectTimer = setTimeout(() => {
              console.log('Attempting to reconnect...');
              setupStream();
            }, backoffTime);
          } else if (reconnectCount >= MAX_RECONNECT_ATTEMPTS) {
            console.error('Max reconnection attempts reached. Multiplayer may not function correctly.');
          }
        };
        
        stream.on('error', (error) => {
          console.error('Game update stream error:', error);
          handleDisconnect('error');
        });
        
        stream.on('end', () => {
          console.log('Game update stream ended normally');
          handleDisconnect('end');
        });
        
      } catch (error) {
        console.error('Failed to setup game update subscription:', error);
        
        // Schedule retry with limit
        if (isActive && reconnectCount < MAX_RECONNECT_ATTEMPTS) {
          reconnectCount++;
          const backoffTime = 2000 * Math.min(reconnectCount, 5);
          reconnectTimer = setTimeout(setupStream, backoffTime);
        }
      }
    };
    
    // Initial setup
    setupStream();
    
    // Cleanup
    return () => {
      isActive = false;
      
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      
      if (streamRef.current) {
        console.log('Cancelling game update subscription');
        streamRef.current.cancel();
        streamRef.current = null;
      }
    };
  }, [gameCode, currentUser?.uid, gameSessionID]);

  // Render the generated game into an iframe with timeout protection
  useEffect(() => {
    if (!gameCode || !gameContainerRef.current) return;
    
    // Clear any previous overlay
    const existingOverlay = document.getElementById('game-over-overlay');
    if (existingOverlay && existingOverlay.parentNode) {
      existingOverlay.parentNode.removeChild(existingOverlay);
    }

    // Reset isFirstLoad state when game code changes
    setIsFirstLoad(true);

    // Clear any existing timeout
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    // Set loading timeout to prevent indefinite loading
    const longLoadingTimeout = setTimeout(() => {
      if (!loaded) {
        console.error("Game loading timeout exceeded");
        setLoaded(true); // Force loaded state to prevent indefinite spinner
        
        // Display error message
        if (gameContainerRef.current) {
          gameContainerRef.current.innerHTML = `
            <div class="p-4 bg-indigo-900 text-red-300 rounded-lg pixel-border">
              <p class="font-bold retro-text text-sm">Game loading timed out</p>
              <p>There may be an issue with the multiplayer connection. Try refreshing the page or restarting the game.</p>
            </div>
          `;
        }
      }
    }, 15000); // 15 second timeout
    
    loadTimeoutRef.current = longLoadingTimeout;

    try {
      // Clear previous content
      if (gameContainerRef.current) {
        gameContainerRef.current.innerHTML = '';
      }
      
      if (iframeRef.current) {
        iframeRef.current.remove();
      }

      // Create sandbox iframe
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.sandbox = 'allow-scripts allow-same-origin';
      iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      iframe.title = gameTitle || 'Game';
      iframe.crossOrigin = "anonymous";
      
      // Reset loaded state when changing games
      setLoaded(false);

      // Store reference
      iframeRef.current = iframe;
      gameContainerRef.current.appendChild(iframe);
      
      // Set a shorter timeout to force loaded state if needed
      const shortLoadingTimeout = setTimeout(() => {
        if (!loaded) {
          console.log("Forcing loaded state after short timeout");
          setLoaded(true);
        }
      }, 5000); // 5 second shorter timeout

      // Extract HTML, CSS, JS from the generated code
      let htmlContent = '', cssContent = '', jsContent = '';
      const htmlMatch = gameCode.match(/<html[^>]*>([\s\S]*)<\/html>/i);
      const bodyMatch = gameCode.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      const cssMatch  = gameCode.match(/<style[^>]*>([\s\S]*)<\/style>/i);
      const jsMatch   = gameCode.match(/<script[^>]*>([\s\S]*)<\/script>/i);

      if (htmlMatch) htmlContent = htmlMatch[1];
      else if (bodyMatch) htmlContent = bodyMatch[1];
      else htmlContent = gameCode;

      if (cssMatch) cssContent = cssMatch[1];
      if (jsMatch)  jsContent  = jsMatch[1];

      // Build a complete HTML document
      const doc = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${gameTitle || 'Game'}</title>
          <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Pixelify+Sans:wght@400..700&display=swap" rel="stylesheet">
          <style>
            body {
              margin:0; padding:0;
              overflow:hidden;
              display:flex; justify-content:center; align-items:center;
              width:100%; height:100%;
              background-color: #161B22;
              color: #FFFFFF;
              font-family: 'Pixelify Sans', sans-serif;
            }
            ${cssContent}
          </style>
        </head>
        <body>
          <div id="game-container">
            ${htmlContent}
          </div>
          <script>
            (function() {
              try {
                // Track image loading
                const OriginalImage = window.Image;
                const promises = [];
                window.Image = function() {
                  const img = new OriginalImage();
                  promises.push(new Promise(r => {
                    img.onload = r;
                    img.onerror = r;
                  }));
                  return img;
                };

                // Define callParentFunction for iframe to call parent
                window.callParentFunction = function(type, data) {
                  window.parent.postMessage({
                    type: type,
                    update: data
                  }, '*');
                };

                // Define a forced loaded mechanism in case promises don't resolve
                const forceLoadTimeout = setTimeout(() => {
                  console.log("Force sending loaded message after timeout");
                  window.callParentFunction('loaded');
                }, 3000);

                Promise.all(promises).finally(() => {
                  // Clear forced timeout if promises resolved naturally
                  clearTimeout(forceLoadTimeout);
                  
                  // Run any exposed game loops
                  [window.gameLoop, window.update, window.animate, window.draw, window.render, window.loop]
                    .filter(fn => typeof fn === 'function')
                    .forEach(fn => { try { fn(); } catch(e){} });
                    
                  // Notify parent that game is loaded
                  window.callParentFunction('ready', '${gameTitle}');
                  
                  // Set loaded state
                  setTimeout(() => {
                    window.callParentFunction('loaded');
                  }, 500);
                });

                ${jsContent}
                
              } catch(e) {
                document.body.innerHTML = '<div style="color:#EC4899;text-align:center;">Game Error: ' + e.message + '</div>';
                console.error(e);
                window.callParentFunction('error', e.message);
                // Still try to mark as loaded even if there's an error
                window.callParentFunction('loaded');
              }
            })();
          </script>
        </body>
        </html>
      `;

      // Use srcdoc for better security
      iframe.srcdoc = doc;
      
      // Set up listener for loaded message
      const handleIframeMessage = (event) => {
        if (event.data && event.data.type === 'loaded') {
          setLoaded(true);
          // Clear the short timeout when we get a loaded message
          clearTimeout(shortLoadingTimeout);
          window.removeEventListener('message', handleIframeMessage);
        }
      };
      
      window.addEventListener('message', handleIframeMessage);

    } catch (error) {
      console.error('Error rendering game:', error);
      if (gameContainerRef.current) {
        gameContainerRef.current.innerHTML = `
          <div class="p-4 bg-indigo-900 text-red-300 rounded-lg pixel-border">
            <p class="font-bold retro-text text-sm">Error rendering game:</p>
            <p>${error.message}</p>
          </div>
        `;
      }
      setLoaded(true); // Force loaded state to prevent indefinite spinner
    }

    // Clear timeout on cleanup
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    };
  }, [gameCode, gameTitle, gameKey]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center bg-gray-900 p-2">
        {loading ? (
          <div className="relative w-full h-full flex flex-col">
            {/* Dino fallback */}
            <div className="flex-1 w-full h-full pixel-border rounded-lg overflow-hidden bg-gray-800 crt-on">
              <DinoGame />
            </div>
          </div>
        ) : gameCode ? (
          <div className="relative w-full h-full">
            {/* Loading spinner */}
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <div
              key={gameKey} // Add key for forced re-render
              ref={gameContainerRef}
              className={`w-full h-full flex items-center justify-center overflow-auto pixel-border rounded-lg bg-gray-800 crt-on transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-30'}`}
            />
            
            {/* Debug controls */}
            {loading && (
              <div className="absolute top-2 right-2 z-50">
                <button 
                  onClick={() => setLoaded(true)} 
                  className="px-2 py-1 bg-red-600 text-white text-xs rounded">
                  Force Stop Loading
                </button>
              </div>
            )}

            {gameCode && (
              <div className="absolute bottom-2 right-2 z-50">
                <button 
                  onClick={() => setShowDebugInfo(!showDebugInfo)} 
                  className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                  {showDebugInfo ? 'Hide Debug' : 'Debug'}
                </button>
                
                {showDebugInfo && (
                  <div className="bg-black bg-opacity-80 p-2 mt-1 text-xs text-gray-300 rounded w-64">
                    <div>Loaded: {loaded ? 'Yes' : 'No'}</div>
                    <div>First Load: {isFirstLoad ? 'Yes' : 'No'}</div>
                    <div>Players: {players?.length || 0}</div>
                    <div>Game Key: {gameKey}</div>
                    <div>Session ID: {gameSessionID ? gameSessionID.substring(0, 8) + '...' : 'None'}</div>
                    <div className="flex gap-1 mt-1">
                      <button 
                        onClick={handleRestartGame} 
                        className="px-2 py-1 bg-indigo-600 text-white rounded text-xs">
                        Restart Game
                      </button>
                      <button 
                        onClick={forceLoadedState} 
                        className="px-2 py-1 bg-green-600 text-white rounded text-xs">
                        Force Loaded
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center max-w-md bg-gray-800 p-8 rounded-lg pixel-border crt-on">
            <p className="text-lg font-medium retro-text text-indigo-300 mb-2">
              What would you like to play?
            </p>
            <p className="text-sm text-pink-400 font-normal">
              Describe your game and I will create it for you!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}