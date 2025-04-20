"use client"
// components/GameDisplay.js
import { useState, useEffect, useRef } from 'react';

export default function GameDisplay({ gameCode, gameType, loading }) {
  const [gameTitle, setGameTitle] = useState('');
  const gameContainerRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (gameType) {
      // Format game type for display
      const formattedType = gameType
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      setGameTitle(formattedType);
    }
  }, [gameType]);

  useEffect(() => {
    if (!gameCode || !gameContainerRef.current) return;
    
    try {
      // Clear previous content
      gameContainerRef.current.innerHTML = '';
      
      // Clean up previous iframe
      if (iframeRef.current) {
        iframeRef.current.remove();
      }
      
      // Create a sandbox iframe to run the game in
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      iframe.title = gameTitle || 'Game';
      
      // Store reference for cleanup
      iframeRef.current = iframe;
      gameContainerRef.current.appendChild(iframe);
      
      // Extract HTML, CSS, and JavaScript from the generated code
      let htmlContent = '';
      let cssContent = '';
      let jsContent = '';
      
      // Simple regex to extract parts, can be improved for more complex code
      const htmlMatch = gameCode.match(/<html[^>]*>([\s\S]*)<\/html>/i);
      const bodyMatch = gameCode.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      const cssMatch = gameCode.match(/<style[^>]*>([\s\S]*)<\/style>/i);
      const jsMatch = gameCode.match(/<script[^>]*>([\s\S]*)<\/script>/i);
      
      // Extract HTML content
      if (htmlMatch) {
        htmlContent = htmlMatch[1];
      } else if (bodyMatch) {
        htmlContent = bodyMatch[1];
      } else {
        // Assume the code is HTML if not explicitly marked
        htmlContent = gameCode;
      }
      
      // Extract CSS if present
      if (cssMatch) {
        cssContent = cssMatch[1];
      }
      
      // Extract JavaScript if present
      if (jsMatch) {
        jsContent = jsMatch[1];
      }
      
      // Wait for iframe to be available
      setTimeout(() => {
        // Get iframe document
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        // Write content to iframe
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${gameTitle || 'Game'}</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                overflow: hidden;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #f8f9fa;
              }
              canvas {
                display: block;
                margin: 0 auto;
              }
              ${cssContent}
            </style>
          </head>
          <body>
            ${htmlContent}
            <script>
              // Image loading handler
              const imagesToLoad = new Set();
              const imageLoadPromises = [];
              
              // Original image constructor
              const OriginalImage = window.Image;
              
              // Override Image constructor to track loading
              window.Image = function() {
                const img = new OriginalImage();
                
                // Add to tracking set
                imagesToLoad.add(img);
                
                // Create a promise for this image
                const promise = new Promise((resolve) => {
                  img.onload = () => {
                    resolve();
                  };
                  img.onerror = () => {
                    console.warn('Failed to load image:', img.src);
                    resolve(); // Resolve anyway to not block the game
                  };
                });
                
                imageLoadPromises.push(promise);
                
                return img;
              };
              
              // Wait for all images to load before starting any animation
              function waitForImages() {
                if (imageLoadPromises.length === 0) {
                  return Promise.resolve();
                }
                
                return Promise.all(imageLoadPromises)
                  .then(() => {
                    console.log('All images loaded successfully');
                  })
                  .catch(error => {
                    console.error('Error loading images:', error);
                  });
              }
              
              // Main game code
              ${jsContent}
              
              // Find game loop functions
              const possibleLoopFunctions = [
                window.gameLoop,
                window.update,
                window.animate,
                window.draw,
                window.render,
                window.loop
              ].filter(fn => typeof fn === 'function');
              
              // Start game loops after images load
              if (possibleLoopFunctions.length > 0) {
                waitForImages().then(() => {
                  possibleLoopFunctions.forEach(fn => {
                    try {
                      fn();
                    } catch (e) {
                      console.error('Error starting game loop:', e);
                    }
                  });
                });
              }
            </script>
          </body>
          </html>
        `);
        iframeDoc.close();
      }, 0);
      
    } catch (error) {
      console.error('Error rendering game:', error);
      
      // Show error message
      gameContainerRef.current.innerHTML = `
        <div class="p-4 bg-red-100 text-red-800 rounded-lg">
          <p class="font-bold">Error rendering game:</p>
          <p>${error.message}</p>
        </div>
      `;
    }
  }, [gameCode, gameTitle]);

  return (
    <div className="flex flex-col h-full">
      {gameTitle && (
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">{gameTitle} Game</h2>
        </div>
      )}
      
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
        {loading ? (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Generating your game...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a moment as Claude creates your custom game.</p>
          </div>
        ) : gameCode ? (
          <div 
            ref={gameContainerRef} 
            className="w-full h-full flex items-center justify-center overflow-auto"
          ></div>
        ) : (
          <div className="text-center max-w-md">
            <img 
              src="/game-controller.svg" 
              alt="Game controller" 
              className="w-16 h-16 mx-auto mb-6 text-gray-400"
            />
            <p className="text-lg font-medium text-gray-700 mb-2">Tell Claude what game you would like to play</p>
          </div>
        )}
      </div>
    </div>
  );
}