// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import BottomNavigation from '../../components/BottomNavigation';

// export default function MultiplayerPage() {
//   const [sessionCode, setSessionCode] = useState('');
//   const [error, setError] = useState('');
  
//   const handleJoinGame = (e) => {
//     e.preventDefault();
//     if (!sessionCode.trim()) {
//       setError('Please enter a valid game session code');
//       return;
//     }
    
//     // Here you would typically validate the code and redirect
//     // For now, let's just simulate a redirect
//     window.location.href = `/gameroom/${sessionCode}`;
//   };
  
//   return (
//     <div className="min-h-screen bg-gray-900 text-white pt-6 pb-20 px-4">
//       <div className="max-w-md mx-auto">
//         <h1 className="text-3xl font-bold text-center text-pink-500 mb-8" 
//             style={{ textShadow: '0px 0px 8px rgba(236, 72, 153, 0.6)' }}>
//           Multiplayer
//         </h1>
        
//         <div className="bg-gray-800 rounded-lg border-2 border-indigo-500 p-6 mb-8 shadow-lg"
//              style={{ boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)' }}>
//           <h2 className="text-xl font-semibold mb-4 text-indigo-400">Join Game Session</h2>
          
//           <form onSubmit={handleJoinGame}>
//             <div className="mb-4">
//               <label htmlFor="sessionCode" className="block text-sm font-medium text-gray-300 mb-1">
//                 Game Session Code
//               </label>
//               <input
//                 type="text"
//                 id="sessionCode"
//                 value={sessionCode}
//                 onChange={(e) => {
//                   setSessionCode(e.target.value);
//                   setError('');
//                 }}
//                 placeholder="Enter 6-digit code..."
//                 className="w-full px-4 py-2 bg-gray-700 rounded-md border border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-white"
//               />
//               {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
//             </div>
            
//             <button
//               type="submit"
//               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
//             >
//               Join Game
//             </button>
//           </form>
//         </div>
        
//         <div className="bg-gray-800 rounded-lg border-2 border-indigo-500 p-6 shadow-lg"
//              style={{ boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)' }}>
//           <h2 className="text-xl font-semibold mb-4 text-indigo-400">Create New Game</h2>
//           <p className="text-gray-300 mb-4">
//             Start a new multiplayer game session and invite friends to join.
//           </p>
//           <Link 
//             href="/create-game"
//             className="block w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-md text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
//           >
//             Create Game
//           </Link>
//         </div>
//       </div>
//       <BottomNavigation/>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BottomNavigation from '../../components/BottomNavigation';
import paperProtoClient from '../../lib/paperProtoClient';

export default function CreateGamePage() {
  const [username, setUsername] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const router = useRouter();
  
  // Check server connection on component mount
  useEffect(() => {
    const checkServerConnection = async () => {
      // try {
      //   // Generate a temporary ID for the heartbeat request
      //   const tempID = 'check_' + Math.random().toString(36).substring(2, 7);
      //   // const response = await paperProtoClient.heartbeat(tempID);
        
      //   if (paperProtoClient.isSuccessResponse(response)) {
          setConnectionStatus('connected');
      //   } else {
      //     setConnectionStatus('error');
      //     setError('Server responded but with an error status');
      //   }
      // } catch (err) {
      //   console.error('Server connection check failed:', err);
      //   setConnectionStatus('disconnected');
      //   setError('Could not connect to the game server. Please try again later.');
      // }
    };
    
    checkServerConnection();
  }, []);
  
  const handleCreateGame = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a display name');
      return;
    }
    
    if (connectionStatus !== 'connected') {
      setError('Cannot create a game: server connection issue');
      return;
    }
    
    setIsCreating(true);
    setError('');
    
    try {
      // Generate session and user IDs
      const gameSessionID = paperProtoClient.generateSessionID();
      const hostID = paperProtoClient.generateUserID();
      
      // Launch the game room
      const response = await paperProtoClient.launchGameRoom(
        gameSessionID,
        hostID,
        username.trim()
      );
      
      if (paperProtoClient.isSuccessResponse(response)) {
        // Store user info in localStorage for persistence across pages
        localStorage.setItem('paperProto_userID', hostID);
        localStorage.setItem('paperProto_username', username.trim());
        localStorage.setItem('paperProto_isHost', 'true');
        localStorage.setItem('paperProto_gameSessionID', gameSessionID);
        
        // Navigate to the game room page
        router.push(`/gameroom/${gameSessionID}`);
      } else {
        setError('Failed to create game room: ' + (response.errorMessage || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error creating game room:', err);
      setError('Failed to create game room: ' + err.message);
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-6 pb-20 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-pink-500 mb-8" 
            style={{ textShadow: '0px 0px 8px rgba(236, 72, 153, 0.6)' }}>
          Create Game Room
        </h1>
        
        <div className="bg-gray-800 rounded-lg border-2 border-indigo-500 p-6 mb-4 shadow-lg"
             style={{ boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)' }}>
          
          {connectionStatus === 'checking' && (
            <div className="mb-4 text-center text-yellow-300">
              <p>Connecting to game server...</p>
              <div className="mt-2 w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-yellow-300 h-2.5 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>
          )}
          
          {connectionStatus === 'disconnected' && (
            <div className="mb-4 text-center text-red-400">
              <p>Cannot connect to game server</p>
              <p className="text-sm mt-1">Please try again later</p>
            </div>
          )}
          
          {connectionStatus === 'connected' && (
            <div className="mb-4 text-center text-green-400">
              <p>Connected to game server</p>
              <div className="mt-2 w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-green-400 h-2.5 rounded-full w-full"></div>
              </div>
            </div>
          )}
          
          <h2 className="text-xl font-semibold mb-4 text-indigo-400">Host a New Game</h2>
          
          <form onSubmit={handleCreateGame}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Enter your display name..."
                className="w-full px-4 py-2 bg-gray-700 rounded-md border border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-white"
                disabled={isCreating || connectionStatus !== 'connected'}
              />
              {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
            </div>
            
            <button
              type="submit"
              disabled={isCreating || connectionStatus !== 'connected'}
              className={`w-full font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                isCreating || connectionStatus !== 'connected'
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-pink-600 hover:bg-pink-700 text-white focus:ring-pink-500'
              }`}
            >
              {isCreating ? 'Creating Game...' : 'Create Game Room'}
            </button>
          </form>
        </div>
        
        <div className="text-center">
          <Link 
            href="/multiplayer"
            className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
          >
            ← Back to Multiplayer Menu
          </Link>
        </div>
      </div>
      <BottomNavigation/>
    </div>
  );
}