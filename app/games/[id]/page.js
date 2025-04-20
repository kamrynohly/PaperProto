// app/games/[id]/page.js
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, deleteField, increment } from 'firebase/firestore';
import { db } from '../../../lib/firebase'; // You'll need to create this
import BottomNavigation from '../../../components/BottomNavigation';
import GameDisplay from '../../../components/GameDisplay';

export default function GamePage({ params }) {
  const router = useRouter();
  const gameId = use(params).id; // Unwrap params with React.use()
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        // Fetch the game from Firestore using the unwrapped gameId
        const gameRef = doc(db, 'games', gameId);
        const gameSnap = await getDoc(gameRef);
        
        console.log(gameSnap)

        if (gameSnap.exists()) {
          // Convert the document to a game object with the document ID
          const gameData = {
            id: gameSnap.id,
            ...gameSnap.data()
          };
          
          setGame(gameData);

          // Add a view to the game!
      
          // Update the user's project_ids array to include the new game UUID
          if (gameData) {
            // Get a reference to the user's document
            const gameRef = doc(db, "games", gameData.id);
            
            // Get the current project_ids array or initialize a new one if it doesn't exist
            const currentPlays = gameData.playCount || 0;
            await updateDoc(gameRef, {
              playCount: currentPlays + 1
            });
          }

          // Check if this game is in the user's favorites (would need user auth)
          // This is a placeholder - implement user auth and user data fetching
          // fetchUserGameData(gameId);
        } else {
          // Handle case when game is not found
          console.error("Game not found");
          // Optional: redirect to 404 page
          // router.push('/404');
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch game:", error);
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId, router]);

  const handleRatingClick = (rating) => {
    setUserRating(rating);
    // In a real app, you would send this to your API

    console.log(`Rating game ${gameId} with ${rating} stars`);
  };

  // const toggleFavorite = () => {
  //   setIsFavorite(!isFavorite);
  //   // In a real app, you would send this to your API
  //   // Example implementation with user auth:
  //   const gameRef = doc(db, 'games', game.id);
  //   const userRef = doc(db, 'users', game.creator_id);

  //   if (isFavorite) {
  //     await updateDoc(userRef, {
  //       [`favorites.${gameId}`]: true
  //     });
  //   } else {
  //     await updateDoc(userRef, {
  //       [`favorites.${gameId}`]: deleteField()
  //     });
  //   }
  //   console.log(`${!isFavorite ? 'Adding' : 'Removing'} game ${gameId} ${!isFavorite ? 'to' : 'from'} favorites`);
  // };

  const toggleFavorite = async () => {
    // Toggle state locally first for responsive UI
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    
    try {
      // Make sure we have the game data
      if (!game) {
        console.error("Game data is not available");
        return;
      }
      
      // Need to import deleteField and update imports at the top
      // import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
      
      const gameRef = doc(db, 'games', game.id);
      // Note: You might want to use the current user's ID instead of game.creator_id
      // This would typically come from your auth system
      const userRef = doc(db, 'users', game.creator_id);
      
      if (newFavoriteState) {
        // Adding to favorites
        await updateDoc(userRef, {
          [`favorites.${gameId}`]: true
        });
        
        // Optionally update the game's favorite count if you track this
        await updateDoc(gameRef, {
          favCount: increment(1)
        });
      } else {
        // Removing from favorites
        await updateDoc(userRef, {
          [`favorites.${gameId}`]: deleteField()
        });
        
        // Optionally update the game's favorite count if you track this
        await updateDoc(gameRef, {
          favCount: increment(-1)
        });
      }
      
      console.log(`${newFavoriteState ? 'Added' : 'Removed'} game ${gameId} ${newFavoriteState ? 'to' : 'from'} favorites`);
    } catch (error) {
      // Revert UI state if operation fails
      setIsFavorite(!newFavoriteState);
      console.error("Error updating favorites:", error);
    }
  };

  const formatPlays = (plays) => {
    if (!plays) return '0'; // Handle undefined plays

    if (plays >= 1000000) {
      return `${(plays / 1000000).toFixed(1)}M`;
    } else if (plays >= 1000) {
      return `${(plays / 1000).toFixed(1)}K`;
    }
    return plays.toString();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      {/* Header with retro styling */}
      <header className="bg-indigo-900 border-b-4 border-pink-500 shadow-lg">
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-4xl font-bold text-center tracking-wider text-pink-500" 
              style={{ 
                textShadow: '2px 2px 0px #4F46E5, 4px 4px 0px #2D3748',
                fontFamily: '"Press Start 2P", cursive'
              }}>
            PAPERPROTO GAMES
          </h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col container mx-auto px-2 py-4">
        {/* Back button */}
        <Link href="/community" className="inline-flex items-center mb-6 text-indigo-400 hover:text-indigo-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Arcade
        </Link>
        
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="w-16 h-16 pixel-spinner"></div>
          </div>
        ) : game ? (
         <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700 shadow-xl flex">
            <div className="grid grid-cols-1 lg:grid-cols-2 flex-1">
              
              {/* Left side - Game info */}
              <div className="p-6 lg:p-8 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-3xl font-bold text-pink-400">{game.title}</h1>
                  <button 
                    onClick={toggleFavorite} 
                    className={`p-2 rounded-full transition-colors ${isFavorite ? 'text-red-500 bg-gray-700' : 'text-gray-400 hover:text-red-500 hover:bg-gray-700'}`}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="flex items-center text-yellow-400 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 font-bold">{game.rating ? game.rating.toFixed(1) : '0.0'}</span>
                  </div>
                  <span className="text-gray-400">{formatPlays(game.playCount)} plays</span>
                </div>
                
                <div className="prose prose-invert max-w-none mb-8 flex-grow">
                  <p className="text-gray-300">{game.description}</p>
                </div>
                
                <div className="mt-auto">
                  <div className="mb-6">
                    <p className="text-gray-300 mb-2">Rate this game:</p>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleRatingClick(rating)}
                          className={`text-2xl mx-1 transition-colors ${userRating >= rating ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-300'}`}
                          aria-label={`Rate ${rating} stars`}
                        >
                          ★
                        </button>
                      ))}
                      {userRating > 0 && (
                        <span className="ml-2 text-gray-300">Your rating: {userRating}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
                      Share Game
                    </button>
                    <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                      Report Issue
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Right side - Game canvas */}
              <div className="flex-4">
              <GameDisplay 
               gameCode={game.gameCode} 
                gameType={game.title} 
                loading={loading} 
              />
           </div>
              
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-xl text-gray-400">Game not found.</p>
            <Link href="/community" className="inline-block mt-4 px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
              Return to Arcade
            </Link>
          </div>
        )}
      </main>
      {/* <BottomNavigation /> */}
    </div>
  );
}