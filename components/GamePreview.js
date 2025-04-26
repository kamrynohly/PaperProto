// 'use client';

// import { useEffect, useRef, useState } from 'react';

// export default function GamePreview({ gameCode, gameType, size = 'small' }) {
//   const iframeRef = useRef(null);
//   const [loaded, setLoaded] = useState(false);

//   // map size prop to tailwind classes
//   const sizeClasses = {
//     small: 'h-32 w-full',
//     medium: 'h-48 w-full',
//     custom: '',
//   };

//   useEffect(() => {
//     const iframe = iframeRef.current;
//     if (!iframe) return;
//     setLoaded(false);

//     const onLoad = () => setLoaded(true);
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
//                 const container = document.getElementById('game-container');
//                 ${gameCode}
//               } catch(e) {
//                 document.body.innerHTML = '<div style="color:#EC4899;text-align:center;">Game Preview Error</div>';
//                 console.error(e);
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
//     </div>
//   );
// }
