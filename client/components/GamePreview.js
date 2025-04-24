// 'use client';

// import { useEffect, useRef, useState } from 'react';

// export default function GamePreview({ gameCode, gameType, size = 'small' }) {
//   const iframeRef = useRef(null);
//   const [loaded, setLoaded] = useState(false);
//   const [gameMessages, setGameMessages] = useState([]);

//   // map size prop to tailwind classes
//   const sizeClasses = {
//     small: 'h-32 w-full',
//     medium: 'h-48 w-full',
//     custom: '',
//   };

//   // Setup message listener for communication from iframe
//   useEffect(() => {
//     const handleMessage = (event) => {
//       // Process messages from the game
//       console.log('Message received from game:', event.data);
      
//       // Verify message format
//       if (event.data && typeof event.data.function === 'string' && Array.isArray(event.data.arguments)) {
//         // Store message for debugging or state management
//         setGameMessages(prev => [...prev, event.data]);
        
//         // Handle different function calls from the game
//         switch(event.data.function) {
//           case 'updateScore':
//             // Example: updateScore(score)
//             console.log('Score updated:', event.data.arguments[0]);
//             break;
            
//           case 'gameOver':
//             // Example: gameOver(finalScore, newHighScore)
//             console.log('Game over. Final score:', event.data.arguments[0]);
//             break;
            
//           case 'resize':
//             // Example: resize(width, height)
//             if (iframeRef.current && event.data.arguments[1]) {
//               iframeRef.current.style.height = `${event.data.arguments[1]}px`;
//             }
//             break;
            
//           case 'ready':
//             // Example: ready()
//             console.log('Game is ready');
//             break;
            
//           // Add more function handlers as needed
//         }
//       }
//     };

//     // Add message event listener
//     window.addEventListener('message', handleMessage);

//     // Cleanup
//     return () => {
//       window.removeEventListener('message', handleMessage);
//     };
//   }, []);

//   // Function to send function calls to the game
//   const callGameFunction = (functionName, ...args) => {
//     if (iframeRef.current && iframeRef.current.contentWindow) {
//       iframeRef.current.contentWindow.postMessage({
//         function: functionName,
//         arguments: args
//       }, '*');
//     }
//   };

//   useEffect(() => {
//     const iframe = iframeRef.current;
//     if (!iframe) return;
//     setLoaded(false);

//     const onLoad = () => {
//       setLoaded(true);
//       // Example: Once loaded, you could initialize the game
//       callGameFunction('initialize', {});
//     };
    
//     iframe.addEventListener('load', onLoad);

//     // Build a fresh HTML blob each time
//     const html = `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width,initial-scale=1">
//           <style>body{margin:0;padding:0;overflow:hidden;background:#1F2937}</style>
//         </head>
//         <body>
//           <div id="game-container"></div>
//           <script>
//             (function() {
//               try {
//                 // Setup communication with parent window
//                 window.callParentFunction = function(functionName, ...args) {
//                   window.parent.postMessage({
//                     function: functionName,
//                     arguments: args
//                   }, '*');
//                 };
                
//                 // Listen for function calls from parent
//                 window.addEventListener('message', function(event) {
//                   // Process messages from parent
//                   console.log('Message from parent:', event.data);
                  
//                   // Verify message format
//                   if (event.data && typeof event.data.function === 'string' && Array.isArray(event.data.arguments)) {
//                     // Call the appropriate function if it exists
//                     const functionName = event.data.function;
//                     const args = event.data.arguments;
                    
//                     // Check if the function exists in window scope
//                     if (typeof window[functionName] === 'function') {
//                       window[functionName](...args);
//                     } else {
//                       console.warn('Function not found:', functionName);
//                     }
//                   }
//                 });
                
//                 // Set up a resize observer to automatically adjust iframe height
//                 const resizeObserver = new ResizeObserver(() => {
//                   const body = document.body;
//                   const html = document.documentElement;
//                   const width = Math.max(body.scrollWidth, body.offsetWidth, 
//                                        html.clientWidth, html.scrollWidth, html.offsetWidth);
//                   const height = Math.max(body.scrollHeight, body.offsetHeight, 
//                                        html.clientHeight, html.scrollHeight, html.offsetHeight);
                  
//                   window.callParentFunction('resize', width, height);
//                 });
                
//                 // Observe the body for size changes
//                 resizeObserver.observe(document.body);
                
//                 // Initialize the game container
//                 const container = document.getElementById('game-container');
//                 ${gameCode}
                
//                 // Notify parent that game is ready
//                 window.callParentFunction('ready');
//               } catch(e) {
//                 document.body.innerHTML = '<div style="color:#EC4899;text-align:center;">Game Preview Error</div>';
//                 console.error(e);
//                 window.parent.postMessage({
//                   function: 'error',
//                   arguments: [e.message]
//                 }, '*');
//               }
//             })();
//           </script>
//         </body>
//       </html>
//     `;

//     // Replace entire iframe content safely
//     iframe.srcdoc = html;

//     return () => {
//       iframe.removeEventListener('load', onLoad);
//     };
//   }, [gameCode]);

//   // Example methods to call game functions
//   const startGame = () => callGameFunction('startGame');
//   const pauseGame = () => callGameFunction('pauseGame');
//   const resetGame = () => callGameFunction('resetGame');
//   const setDifficulty = (level) => callGameFunction('setDifficulty', level);

//   return (
//     <div className={`relative ${sizeClasses[size]}`}>
//       {/* spinner */}
//       {!loaded && (
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="w-8 h-8 pixel-spinner"></div>
//         </div>
//       )}
//       <iframe
//         ref={iframeRef}
//         sandbox="allow-scripts"
//         className={`absolute inset-0 border-none transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
//       />
//       {/* Optional: Game control buttons 
//       <div className="absolute bottom-2 right-2 flex space-x-2">
//         <button onClick={startGame} className="px-2 py-1 text-xs bg-indigo-700 text-white rounded">Start</button>
//         <button onClick={pauseGame} className="px-2 py-1 text-xs bg-indigo-700 text-white rounded">Pause</button>
//         <button onClick={resetGame} className="px-2 py-1 text-xs bg-indigo-700 text-white rounded">Reset</button>
//       </div>
//       */}
//     </div>
//   );
// }