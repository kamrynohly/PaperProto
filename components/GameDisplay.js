"use client"
// components/GameDisplay.js
import { useState, useEffect, useRef } from 'react';

export default function GameDisplay({ gameCode, gameType, loading }) {
  const [gameTitle, setGameTitle] = useState('');
  const gameContainerRef = useRef(null);
  const iframeRef = useRef(null);
  const dinoGameRef = useRef(null);

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

  // Initialize dino game when in loading state
  // Initialize dino game when component mounts or loading state changes
  useEffect(() => {
    // When loading starts, initialize the dino game
    if (loading && dinoGameRef.current) {
      console.log("Loading state detected, initializing dino game");
      initDinoGame();
    }
    // When loading ends, clean up the dino game
    else if (!loading && dinoGameRef.current) {
      console.log("Loading finished, cleaning up dino game");
      dinoGameRef.current.innerHTML = '';
    }
  }, [loading]);

  // Initialize the dino game
  const initDinoGame = () => {
    if (!dinoGameRef.current) return;
    
    const dinoGame = dinoGameRef.current;
    dinoGame.innerHTML = '';
    
    // Create a sandbox iframe for the dino game
    const dinoIframe = document.createElement('iframe');
    dinoIframe.style.width = '100%';
    dinoIframe.style.height = '100%';
    dinoIframe.style.border = 'none';
    dinoIframe.allow = 'accelerometer; autoplay';
    dinoIframe.title = 'Dino Game';
    
    dinoGame.appendChild(dinoIframe);
    
    // Wait for iframe to be ready
    setTimeout(() => {
      const iframeDoc = dinoIframe.contentDocument || dinoIframe.contentWindow.document;
      
      // Write the dino game code to the iframe
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Dino Game</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              overflow: hidden;
              background-color: #f7f7f7;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              font-family: 'Courier New', monospace;
            }
            
            .game-container {
              width: 600px;
              height: 150px;
              position: relative;
              overflow: hidden;
              border-bottom: 1px solid #ccc;
            }
            
            #dino {
              width: 44px;
              height: 47px;
              position: absolute;
              bottom: 0;
              left: 50px;
              background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAvCAYAAACYECivAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF62lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDYwLCAyMDIwLzA1LzEyLTE2OjA0OjE3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMTAtMDdUMTc6NTg6MzgrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTEwLTA3VDE4OjAyOjAyKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTEwLTA3VDE4OjAyOjAyKzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjFkYTkwY2ZjLTZiMjAtNGNmYi1iYzAwLTdhMzRhZTU5YzM4NCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxOGRhZGQ5MC1kMmZlLTRkOGYtYWZkOS0zMTk2MTRkNmIwOWIiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxOGRhZGQ5MC1kMmZlLTRkOGYtYWZkOS0zMTk2MTRkNmIwOWIiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjE4ZGFkZDkwLWQyZmUtNGQ4Zi1hZmQ5LTMxOTYxNGQ2YjA5YiIgc3RFdnQ6d2hlbj0iMjAyMC0xMC0wN1QxNzo1ODozOCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjFkYTkwY2ZjLTZiMjAtNGNmYi1iYzAwLTdhMzRhZTU5YzM4NCIgc3RFdnQ6d2hlbj0iMjAyMC0xMC0wN1QxODowMjowMiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+eFUKaQAAB0FJREFUWMPFmHtsU1UcxytjMAQM/+AKyNYHwmMjFKb4wv3BNBLDZIPgY/xhfCXGRww+oj4Sif5hTKJxjAcmMZqYqGBkbB1MSsQHI7oJKzJ1yjKHbOA2aXt7z7m9Pe3tuR/n3t7btnf8QUp7e3v49PzO7/z6O7+fhG9/etGYVFFfMjnJPK3FyTNGQ8lkjB8/Xpr01QvXmLVw3o9PNW6tLNmzZgVVVqpQlUrF/1Iyplrt15N+ZZLxzwnmjZtM5NZ3trjW9Vrtm9atW+dJSUmBzZs3g9VqDVvjx48H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");
            }
            
            .cactus {
              width: 17px;
              height: 35px;
              position: absolute;
              bottom: 0;
              background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAjCAYAAABR/e3fAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFyGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDYwLCAyMDIwLzA1LzEyLTE2OjA0OjE3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMTAtMDdUMTc6NTg6MzgrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTEwLTA3VDE4OjAyOjI1KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTEwLTA3VDE4OjAyOjI1KzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg3ZGZkM2Y2LThjNGEtNGMwNC1hOWZhLTMxMjM5ZDY5ZjMyNyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4N2RmZDNmNi04YzRhLTRjMDQtYTlmYS0zMTIzOWQ2OWYzMjciIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4N2RmZDNmNi04YzRhLTRjMDQtYTlmYS0zMTIzOWQ2OWYzMjciPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjg3ZGZkM2Y2LThjNGEtNGMwNC1hOWZhLTMxMjM5ZDY5ZjMyNyIgc3RFdnQ6d2hlbj0iMjAyMC0xMC0wN1QxNzo1ODozOCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKE1hY2ludG9zaCkiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+KVGecQAAATRJREFUSMftlD9Lw1AUxV80qI1NqyDoIHRRUNdSRBQcXFzESXCwCjrYQVx0ahEkS0f/QMFJcegoLh2KjhX8BKVfQReHDq4OHWwimJDXpJZM9gznvXtP7iMveafplErOrKUj6Jz2TLCLDNKe5ZnELTL3Ai/FSMuwiUmEkYZhRPCBDwTwjELUbsM61hBDHPvoiwTGNxaNP5GJDJKYQQU/eMHExX7dLHOHV1yjXIsvIW8StYZxia2OV4MxpYNZuYZ1zZ/H1hWhOxQ1rzkW0JdpIh/OcG+/tWzW7NVl9O9aCwpvyDuONYzjfefzM3KuiTTJfqLaICvYVJ4x5ZZIYI+LvKHfVjFn2YuiA/rR3v4vESxijQu1m4g1fGEPZ45tUvbpNh6wjyOlAeMUU1qR/3GqBSt+AaP4wX2RwYBHAAAAAElFTkSuQmCC");
            }
            
            .cloud {
              position: absolute;
              width: 46px;
              height: 14px;
              background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAOCAYAAABXnXStAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF42lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDYwLCAyMDIwLzA1LzEyLTE2OjA0OjE3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMTAtMDdUMTc6NTg6MzgrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTEwLTA3VDE4OjAyOjEyKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTEwLTA3VDE4OjAyOjEyKzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyI+PC9yZGY6RGVzY3JpcHRpb24+PC9yZGY6UkRGPjwveDp4bXBtZXRhPjw/eHBhY2tldCBlbmQ9InIiPz5jF/z2AAAA10lEQVRIie3VP2oCQRTH8Y9ibcQqhYKQE4idpaPYC3oCL5ETeAsvkcoLeIecQFArOztBEFRQwSKiEBB/bGbBJlUKdxeW/cLA8N787n5hmGHK8n9cYoy9yHp4xQDljMYe0MA9yhiHwTd0UEjgXvxgFn7Ywws6OI1wO/jMwO3jKyReoom36PgSD/85uIEP7GJUTxT/gOsV7hp3uFgCl0d9DXeJ19C/ZF2/rsNxsLRF4OYJ4K/3eN45W/wNcZ7nW+AabGAvDdDEKxpsd1pR2hPOUqnF2P6Xf4vSL1SxKGtBv3LBAAAAAElFTkSuQmCC");
            }
            
            .ground {
              position: absolute;
              bottom: 0;
              width: 100%;
              height: 1px;
              background-color: #ccc;
            }
            
            .score {
              position: absolute;
              top: 10px;
              right: 10px;
              font-size: 16px;
              font-weight: bold;
            }
            
            .game-over {
              display: none;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              font-size: 24px;
              font-weight: bold;
              text-align: center;
            }
            
            .start-message {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -75px);
              font-size: 16px;
              text-align: center;
              background-color: rgba(255, 255, 255, 0.8);
              padding: 10px;
              border-radius: 5px;
              font-family: 'Courier New', monospace;
            }
            
            .restart-btn {
              margin-top: 10px;
              padding: 5px 10px;
              font-size: 16px;
              cursor: pointer;
              background-color: #4a5568;
              color: white;
              border: none;
              border-radius: 4px;
            }
            
            .restart-btn:hover {
              background-color: #2d3748;
            }
          </style>
        </head>
        <body>
          <div class="game-container">
            <div class="score">Score: 0</div>
            <div class="ground"></div>
            <div id="dino"></div>
            <div class="start-message">
              Press SPACE or tap screen to jump
              <br>
              Play while your game is loading!
            </div>
            <div class="game-over">
              Game Over
              <br>
              <button class="restart-btn">Restart</button>
            </div>
          </div>
          
          <script>
            document.addEventListener('DOMContentLoaded', () => {
              const dino = document.getElementById('dino');
              const gameContainer = document.querySelector('.game-container');
              const scoreDisplay = document.querySelector('.score');
              const gameOverMsg = document.querySelector('.game-over');
              const startMessage = document.querySelector('.start-message');
              const restartBtn = document.querySelector('.restart-btn');
              
              let isJumping = false;
              let isGameOver = false;
              let gameStarted = false;
              let score = 0;
              let gravity = 0.9;
              let position = 0;
              let cacti = [];
              let clouds = [];
              let gameSpeed = 5;
              let jumpCount = 0;
              
              // Handle jump
              function jump() {
                if (isGameOver) return;
                
                if (!gameStarted) {
                  gameStarted = true;
                  startMessage.style.display = 'none';
                  generateObstacles();
                  generateClouds();
                  gameLoop();
                }
                
                if (isJumping) return;
                
                isJumping = true;
                jumpCount = 0;
                
                let jumpInterval = setInterval(() => {
                  // Jump up
                  if (jumpCount < 15) {
                    position += 5;
                    jumpCount++;
                  } 
                  // Fall down
                  else if (jumpCount < 30) {
                    position -= 5;
                    jumpCount++;
                  } else {
                    clearInterval(jumpInterval);
                    isJumping = false;
                    position = 0;
                  }
                  
                  // Apply position
                  if (position < 0) position = 0;
                  dino.style.bottom = position + 'px';
                }, 20);
              }
              
              // Generate cacti
              function generateObstacles() {
                if (isGameOver) return;
                
                let randomTime = Math.random() * 2000 + 1000;
                
                setTimeout(() => {
                  if (!isGameOver) {
                    const cactus = document.createElement('div');
                    cactus.classList.add('cactus');
                    gameContainer.appendChild(cactus);
                    cactus.style.left = '600px';
                    
                    cacti.push(cactus);
                    moveObstacle(cactus);
                    generateObstacles();
                  }
                }, randomTime);
              }
              
              // Generate clouds
              function generateClouds() {
                if (isGameOver) return;
                
                let randomTime = Math.random() * 3000 + 2000;
                
                setTimeout(() => {
                  if (!isGameOver) {
                    const cloud = document.createElement('div');
                    cloud.classList.add('cloud');
                    gameContainer.appendChild(cloud);
                    
                    const randomHeight = Math.random() * 70 + 40;
                    cloud.style.top = randomHeight + 'px';
                    cloud.style.left = '600px';
                    
                    clouds.push(cloud);
                    moveCloud(cloud);
                    generateClouds();
                  }
                }, randomTime);
              }
              
              // Move obstacles
              function moveObstacle(cactus) {
                let left = 600;
                let timerId = setInterval(() => {
                  if (isGameOver) {
                    clearInterval(timerId);
                    return;
                  }
                  
                  left -= gameSpeed;
                  cactus.style.left = left + 'px';
                  
                  // Check collision
                  if (left < 60 && left > 0 && position < 35) {
                    // Collision detected
                    gameOver();
                    clearInterval(timerId);
                  }
                  
                  // Remove off-screen cacti
                  if (left < -30) {
                    cactus.remove();
                    cacti = cacti.filter(c => c !== cactus);
                    clearInterval(timerId);
                    score++;
                    scoreDisplay.textContent = 'Score: ' + score;
                    
                    // Increase game speed
                    if (score % 10 === 0 && gameSpeed < 12) {
                      gameSpeed += 0.5;
                    }
                  }
                }, 20);
              }
              
              // Move clouds
              function moveCloud(cloud) {
                let left = 600;
                let speed = gameSpeed * 0.5; // Clouds move slower
                
                let timerId = setInterval(() => {
                  if (isGameOver) {
                    clearInterval(timerId);
                    return;
                  }
                  
                  left -= speed;
                  cloud.style.left = left + 'px';
                  
                  // Remove off-screen clouds
                  if (left < -50) {
                    cloud.remove();
                    clouds = clouds.filter(c => c !== cloud);
                    clearInterval(timerId);
                  }
                }, 20);
              }
              
              // Game loop
              function gameLoop() {
                if (!isGameOver) {
                  requestAnimationFrame(gameLoop);
                }
              }
              
              // Game over function
              function gameOver() {
                isGameOver = true;
                gameOverMsg.style.display = 'block';
              }
              
              // Restart game
              function restartGame() {
                // Remove all cacti and clouds
                cacti.forEach(cactus => cactus.remove());
                cacti = [];
                
                clouds.forEach(cloud => cloud.remove());
                clouds = [];
                
                // Reset variables
                isGameOver = false;
                isJumping = false;
                score = 0;
                gameSpeed = 5;
                position = 0;
                
                // Update UI
                scoreDisplay.textContent = 'Score: 0';
                gameOverMsg.style.display = 'none';
                dino.style.bottom = '0px';
                
                // Start game
                generateObstacles();
                generateClouds();
                gameLoop();
              }
              
              // Event listeners
              document.addEventListener('keydown', (e) => {
                if (e.code === 'Space') {
                  e.preventDefault();
                  if (isGameOver) {
                    restartGame();
                  } else {
                    jump();
                  }
                }
              });
              
              // Touch support for mobile
              document.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (isGameOver) {
                  restartGame();
                } else {
                  jump();
                }
              });
              
              restartBtn.addEventListener('click', restartGame);
            });
          </script>
        </body>
        </html>
      `);
      iframeDoc.close();
    }, 0);
  };

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
      {/* {gameTitle && (
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">{gameTitle} Game</h2>
        </div>
      )} */}
      
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
        {loading ? (
          <div className="relative w-full h-full flex flex-col">
            {/* Container for the dino game */}
            <div ref={dinoGameRef} className="flex-1 w-full h-full border-4 border-indigo-400 rounded-lg overflow-hidden"></div>
            {/* Loading message */}
            <div className="absolute bottom-4 left-0 right-0 text-center z-10">
              <div className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
                <p className="text-lg font-medium">Generating your custom game...</p>
                <p className="text-sm mt-1">Play the dino game while you wait!</p>
              </div>
            </div>
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