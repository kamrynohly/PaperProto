// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import BottomNavigation from '../../components/BottomNavigation';

// // Configure the gRPC server URL
// const GRPC_SERVER_URL = process.env.NEXT_PUBLIC_GRPC_SERVER_URL || 'http://127.0.0.1:5001';

// // Create the client directly
// const client = new PaperProtoServerClient(GRPC_SERVER_URL);

// // Helper functions (reuse from your grpcClient.js)
// function generateSessionID() {
//   return `game_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
// }

// function generateUserID() {
//   return `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
// }

// // Helper to check success response
// function isSuccessResponse(response) {
//   return response && response.getStatus() === 0; // 0 = SUCCESS in the proto enum
// }

// export default function MultiplayerPage() {
//   const [sessionCode, setSessionCode] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();
  
//   const handleJoinGame = (e) => {
//     e.preventDefault();
//     if (!sessionCode.trim()) {
//       setError('Please enter a valid game session code');
//       return;
//     }
    
//     router.push(`/gameroom/${sessionCode}`);
//   };
  
//   // Update your handleCreateGame function to properly create and navigate to a game room
// const handleCreateGame = async () => {
//   try {
//     setIsLoading(true);
//     setError('');
    
//     // Generate unique IDs
//     const gameSessionID = generateSessionID();
//     const hostID = generateUserID();
//     const hostUsername = "Host"; // Or get from input
    
//     // Create the request object
//     const request = new service_pb.LaunchGameRoomRequest();
    
//     // Set the required fields (using the correct method names based on your proto definition)
//     request.setGamesessionid(gameSessionID);
//     request.setHostid(hostID);
//     request.setHostusername(hostUsername);
    
//     console.log('Sending request:', request.toObject());
    
//     // Call the gRPC method
//     const response = await client.launchGameRoom(request);
//     console.log('Response received:', response.toObject());
    
//     // Store user data for the game session
//     localStorage.setItem('userID', hostID);
//     localStorage.setItem('username', hostUsername);
//     localStorage.setItem('gameSessionID', gameSessionID);
    
//     // Navigate to the game room
//     router.push(`/gameroom/${gameSessionID}`);
    
//   } catch (err) {
//     console.error('Error creating game room:', err);
//     setError(`Failed to create game: ${err.message}`);
//   } finally {
//     setIsLoading(false);
//   }
// };
  
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
//           <button 
//             onClick={handleCreateGame}
//             disabled={isLoading}
//             className="block w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-md text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 disabled:bg-pink-800 disabled:cursor-not-allowed"
//           >
//             {isLoading ? 'Creating...' : 'Create Game'}
//           </button>
//           {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
//         </div>
//       </div>
//       <BottomNavigation/>
//     </div>
//   );
// }

// app/components/LaunchGameRoom.js
'use client';

import { useState } from 'react';
import { launchGameRoom } from '../../utils/grpcClient';

export default function LaunchGameRoomComponent() {
  const [gameSessionID, setGameSessionID] = useState('');
  const [hostID, setHostID] = useState('');
  const [hostUsername, setHostUsername] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await launchGameRoom(gameSessionID, hostID, hostUsername);
      setResult(response);
    } catch (err) {
      console.error('Error launching game room:', err);
      setError(err.message || 'Failed to launch game room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white text-black rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Launch Game Room</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Game Session ID:</label>
          <input
            type="text"
            value={gameSessionID}
            onChange={(e) => setGameSessionID(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">Host ID:</label>
          <input
            type="text"
            value={hostID}
            onChange={(e) => setHostID(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">Host Username:</label>
          <input
            type="text"
            value={hostUsername}
            onChange={(e) => setHostUsername(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Launching...' : 'Launch Game Room'}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {result && (
        <div className={`mt-4 p-3 rounded-md ${
          result.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Message:</strong> {result.message}</p>
        </div>
      )}
    </div>
  );
}