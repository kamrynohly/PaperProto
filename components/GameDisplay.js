"use client"
// components/GameDisplay.js

import { useState, useEffect, useRef } from 'react';
import DinoGame from './DinoGame';

export default function GameDisplay({ gameCode, gameType, loading }) {
  const [gameTitle, setGameTitle] = useState('');
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
      iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      iframe.title = gameTitle || 'Game';

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

      // Write into iframe with dark theme
      setTimeout(() => {
        const doc = iframe.contentDocument;
        doc.open();
        doc.write(`
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
            ${htmlContent}
            <script>
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
                // Run any exposed game loops
                [window.gameLoop, window.update, window.animate, window.draw, window.render, window.loop]
                  .filter(fn => typeof fn === 'function')
                  .forEach(fn => { try { fn(); } catch(e){} });
              });

              ${jsContent}
            </script>
          </body>
          </html>
        `);
        doc.close();
      }, 0);

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
            <div className="absolute bottom-30 left-0 right-0 text-center z-10">
              <p className="text-lg font-medium retro-text text-indigo-300">
                Play while we cook!
              </p>
            </div>
          </div>
        ) : gameCode ? (
          <div
            ref={gameContainerRef}
            className="w-full h-full flex items-center justify-center overflow-auto pixel-border rounded-lg bg-gray-800 crt-on"
          />
        ) : (
          <div className="text-center max-w-md bg-gray-800 p-8 rounded-lg pixel-border crt-on">
            <p className="text-lg font-medium retro-text text-indigo-300 mb-2">
              What would you like to play?
            </p>
            <p className="text-sm text-pink-400 font-normal">
              Describe your game and I'll create it for you!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}