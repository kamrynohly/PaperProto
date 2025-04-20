// components/GamePreview.js
'use client';

import { useState, useEffect } from 'react';
import { Gamepad2 } from 'lucide-react';

export default function GamePreview({ gameCode, gameType, size = 'small' }) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Size classes for different preview sizes
  const sizeClasses = {
    small: 'h-32 w-full', // For cards in grid views
    medium: 'h-48 w-full', // For larger displays
    custom: '' // For custom sizing via parent component
  };
  
  // Initialize the game preview when component mounts
  useEffect(() => {
    setMounted(true);
    
    if (gameCode) {
      try {
        // Small timeout to ensure the container is rendered
        setTimeout(() => {
          const previewContainer = document.getElementById(`game-preview-${gameType}`);
          
          if (previewContainer) {
            // Clear previous content
            previewContainer.innerHTML = '';
            
            // Create a new iframe for isolation
            const iframeElement = document.createElement('iframe');
            iframeElement.style.width = '100%';
            iframeElement.style.height = '100%';
            iframeElement.style.border = 'none';
            iframeElement.style.overflow = 'hidden';
            previewContainer.appendChild(iframeElement);
            
            // Set up content in the iframe
            const iframeContent = iframeElement.contentDocument || iframeElement.contentWindow.document;
            
            // Add the necessary HTML structure
            iframeContent.open();
            iframeContent.write(`
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body {
                      margin: 0;
                      padding: 0;
                      overflow: hidden;
                      background-color: #1F2937;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      width: 100%;
                      height: 100%;
                    }
                    #game-container {
                      width: 100%;
                      height: 100%;
                      position: relative;
                    }
                    /* Add your game-specific styles here */
                  </style>
                </head>
                <body>
                  <div id="game-container"></div>
                  <script>
                    try {
                      // Sandbox the game code execution
                      (function() {
                        const gameContainer = document.getElementById('game-container');
                        ${gameCode}
                        // Add any initialization code if needed
                      })();
                    } catch(error) {
                      console.error('Error running game preview:', error);
                      document.body.innerHTML = '<div style="color: #EC4899; text-align: center;">Game Preview Error</div>';
                    }
                  </script>
                </body>
              </html>
            `);
            iframeContent.close();
            
            setLoading(false);
          }
        }, 100);
      } catch (error) {
        console.error('Error rendering game preview:', error);
        setError(error.message);
        setLoading(false);
      }
    }
  }, [gameCode, gameType]);
  
  if (!mounted) {
    return null;
  }
  
  if (error) {
    return (
      <div className={`bg-gray-800 flex items-center justify-center ${sizeClasses[size]}`}>
        <div className="text-pink-500 text-sm">Error loading preview</div>
      </div>
    );
  }
  
  return (
    <div className={`relative ${sizeClasses[size]} bg-gray-800 overflow-hidden`}>
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 pixel-spinner"></div>
        </div>
      ) : null}
      
      <div 
        id={`game-preview-${gameType}`}
        className={`absolute inset-0 ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      ></div>
      
      {/* Fallback if no game code is available */}
      {!gameCode && (
        <div className="absolute inset-0 flex items-center justify-center bg-indigo-900">
          <Gamepad2 size={24} className="text-pink-500" />
        </div>
      )}
    </div>
  );
}