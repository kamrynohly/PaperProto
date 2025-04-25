"use client"
// components/GameDisplay.js

import { useState, useEffect, useRef } from 'react';
import DinoGame from './DinoGame';

export default function GameDisplay({ gameCode, gameType, loading }) {
  const [gameTitle, setGameTitle] = useState('');
  const [gameMessages, setGameMessages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const gameContainerRef = useRef(null);
  const iframeRef = useRef(null);

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

  // Setup message listener for communication from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      // Process messages from the game
      console.log('Message received from game:', event.data);
      
      // Verify message format
      if (event.data && typeof event.data.function === 'string' && Array.isArray(event.data.arguments)) {
        // Store message for debugging or state management
        setGameMessages(prev => [...prev, event.data]);
        
        // Handle different function calls from the game
        switch(event.data.function) {
          case 'updateScore':
            // Example: updateScore(score)
            console.log('Score updated:', event.data.arguments[0]);
            break;
            
          case 'gameOver':
            // Example: gameOver(finalScore, newHighScore)
            console.log('Game over. Final score:', event.data.arguments[0]);
            break;
            
          case 'resize':
            // Example: resize(width, height)
            if (iframeRef.current && event.data.arguments[0]) {
              iframeRef.current.style.height = `${event.data.arguments[0]}px`;
            }
            break;
            
          case 'ready':
            // Example: ready()
            console.log('Game is ready');
            setLoaded(true);
            break;
            
          case 'error':
            // Example: error(message)
            console.error('Game error:', event.data.arguments[0]);
            break;
            
          // Add more function handlers as needed
        }
      }
    };

    // Add message event listener
    window.addEventListener('message', handleMessage);

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Function to call game functions in the iframe
  const callGameFunction = (functionName, ...args) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        function: functionName,
        arguments: args
      }, '*');
    }
  };

  // Example methods to call game functions
  const startGame = () => callGameFunction('startGame');
  const pauseGame = () => callGameFunction('pauseGame');
  const resetGame = () => callGameFunction('resetGame');
  const setDifficulty = (level) => callGameFunction('setDifficulty', level);

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

      callGameFunction('initialize', {});

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
                // Setup communication with parent window
                window.callParentFunction = function(functionName, ...args) {
                  window.parent.postMessage({
                    function: functionName,
                    arguments: args
                  }, '*');
                };
                
                // Listen for function calls from parent
                window.addEventListener('message', function(event) {
                  // Process messages from parent
                  console.log('Message from parent:', event.data);
                  
                  // Verify message format
                  if (event.data && typeof event.data.function === 'string' && Array.isArray(event.data.arguments)) {
                    // Call the appropriate function if it exists
                    const functionName = event.data.function;
                    const args = event.data.arguments;
                    
                    // Check if the function exists in window scope
                    if (typeof window[functionName] === 'function') {
                      try {
                        window[functionName](...args);
                      } catch (error) {
                        console.error('Error calling function ' + functionName + ':', error);
                        window.callParentFunction('error', error.message);
                      }
                    } else {
                      console.warn('Function not found:', functionName);
                      window.callParentFunction('error', 'Function not found: ' + functionName);
                    }
                  }
                });
                
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

                Promise.all(promises).finally(() => {
                  // Set up a resize observer to automatically adjust iframe height
                  const resizeGame = function() {
                    const body = document.body;
                    const html = document.documentElement;
                    const width = Math.max(body.scrollWidth, body.offsetWidth, 
                                         html.clientWidth, html.scrollWidth, html.offsetWidth);
                    const height = Math.max(body.scrollHeight, body.offsetHeight, 
                                          html.clientHeight, html.scrollHeight, html.offsetHeight);
                    
                    window.callParentFunction('resize', width, height);
                  };
                  
                  // Initial resize
                  resizeGame();
                  
                  // Add resize observer to handle content changes
                  const resizeObserver = new ResizeObserver(() => {
                    resizeGame();
                  });
                  resizeObserver.observe(document.body);
                  
                  // Run any exposed game loops
                  [window.gameLoop, window.update, window.animate, window.draw, window.render, window.loop]
                    .filter(fn => typeof fn === 'function')
                    .forEach(fn => { try { fn(); } catch(e){} });
                    
                  // Notify parent that game is loaded and ready
                  window.callParentFunction('ready', '${gameTitle}');
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
            {/* Loading message */}
            <div className="absolute bottom-30 left-0 right-0 text-center">
              {/* <p className="text-lg font-medium retro-text text-indigo-300">
                Play while we cook!
              </p> */}
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
            {/* Optional: Game control buttons */}
            {/* 
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <button onClick={startGame} className="px-3 py-1 text-sm bg-indigo-700 text-white rounded-md shadow-lg">Start</button>
              <button onClick={pauseGame} className="px-3 py-1 text-sm bg-indigo-700 text-white rounded-md shadow-lg">Pause</button>
              <button onClick={resetGame} className="px-3 py-1 text-sm bg-indigo-700 text-white rounded-md shadow-lg">Reset</button>
            </div>
            */}
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