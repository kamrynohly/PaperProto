"use client"
// components/GameDisplayMulti.js

import { useState, useEffect, useRef } from 'react';
import DinoGame from './DinoGame';
import { subscribeToGameUpdates, sendGameUpdate } from '../utils/grpcClient';
import { useAuth } from '../contexts/AuthContext';
import { useMultiplayer } from '../contexts/MultiplayerContext';

export default function GameDisplayMulti({ gameCode, gameType, loading }) {
  const [gameTitle, setGameTitle] = useState('');
  const [gameMessages, setGameMessages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const gameContainerRef = useRef(null);
  const iframeRef = useRef(null);
  const streamRef = useRef(null);
  const { currentUser, userData } = useAuth();
  const { gameId, gameSessionID, players, creatorID, creatorUsername } = useMultiplayer();

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

  useEffect(() => {
    const initGame = () => {
        console.log("initializing game: tell it if it is player 1 or player 2")
        let player = "you are player 1"
        if (players[0].userID === creatorID) {
          console.log("you are player 1")
        } else {
          console.log("you are player 2")
          player = "you are player 2"
        }
    
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
              type: "initGame",
              update: player
            }, '*');
          }
      }

    if (loaded) {
        if (players.length > 1) {
            initGame();
        }
    }
  }, [loaded, players, creatorID]);

  // Setup message listener for communication from iframe
  useEffect(() => {
    const handleMessage = async (event) => {
      console.log('Message received from game:', event.data);
      
      // Verify message format
      if (event.data && typeof event.data.type === 'string') {
        // Store message for debugging or state management
        setGameMessages(prev => [...prev, event.data]);
        
        switch(event.data.type) {
          case 'updateGameState':
            console.log('Game state updated:', event.data.update);

            try {
                console.log("user data", userData)
              const response = await sendGameUpdate(currentUser.uid, String(event.data.update));
              console.log('Game update response:', response);
            } catch (error) {
              console.error('Failed to send game update:', error);
            }
            break;
          case 'gameOver':
            console.log('Game over. Final score:', event.data.update);
            //todo: Implement leaderboard and replay button
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
  }, [userData]);

  // Function to update game in the iframe
  const updateGame = (type, update) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: type,
        update: update
      }, '*');
    }
  };

  // Setup game update subscription
  useEffect(() => {
    // Only subscribe if gameCode exists and we have userData
    if (!gameCode) return;
    
    try {
      console.log('Setting up game update subscription');
      console.log("current user:", currentUser.uid)
      console.log("game session id:", gameSessionID)
      
      // Create the stream
      const stream = subscribeToGameUpdates({
        gameSessionID: gameSessionID,
        userID: currentUser.uid
      });
      
      // Store reference to the stream
      streamRef.current = stream;
      
      // Listen for data events
      stream.on('data', (update) => {
        console.log('Received game update:', update);
        updateGame("updateGameState", update);
      });
      
      // Handle errors
      stream.on('error', (error) => {
        console.error('Game update stream error:', error);
        // Implement reconnection logic if needed
      });
      
      // Handle stream end
      stream.on('end', () => {
        console.log('Game update stream ended');
        // Maybe attempt to resubscribe after a delay
      });
    } catch (error) {
      console.error('Failed to setup game update subscription:', error);
    }
    
    // Clean up when component unmounts or gameCode changes
    return () => {
      if (streamRef.current) {
        console.log('Cancelling game update subscription');
        streamRef.current.cancel();
        streamRef.current = null;
      }
    };
  }, [gameCode, userData]);

  // Render the generated game into an iframe
  useEffect(() => {
    if (!gameCode || !gameContainerRef.current) return;

    try {
      // Clear previous content
      gameContainerRef.current.innerHTML = '';
      if (iframeRef.current) iframeRef.current.remove();

      // Create sandbox iframe
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.sandbox = 'allow-scripts';
      iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      iframe.title = gameTitle || 'Game';
      
      // Reset loaded state when changing games
      setLoaded(false);

      // Store reference
      iframeRef.current = iframe;
      gameContainerRef.current.appendChild(iframe);

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
                window.callParentFunction = function(type, ...args) {
                  window.parent.postMessage({
                    type: type,
                  }, '*');
                };

                Promise.all(promises).finally(() => {
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
          window.removeEventListener('message', handleIframeMessage);
        }
      };
      
      window.addEventListener('message', handleIframeMessage);

    } catch (error) {
      console.error('Error rendering game:', error);
      gameContainerRef.current.innerHTML = `
        <div class="p-4 bg-indigo-900 text-red-300 rounded-lg pixel-border">
          <p class="font-bold retro-text text-sm">Error rendering game:</p>
          <p>${error.message}</p>
        </div>
      `;
    }
  }, [gameCode, gameTitle]);

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
              ref={gameContainerRef}
              className={`w-full h-full flex items-center justify-center overflow-auto pixel-border rounded-lg bg-gray-800 crt-on transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-30'}`}
            />
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