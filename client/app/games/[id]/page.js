// app/games/[id]/page.js
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, arrayRemove, increment, arrayUnion, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import BottomNavigation from '../../../components/BottomNavigation';
import GameDisplay from '../../../components/GameDisplay';
import { useAuth } from '../../../contexts/AuthContext';
import RetroLeaderboard from '../../../components/RetroLeaderboard';
import { MultiplayerProvider } from '../../../contexts/MultiplayerContext';
import MultiplayerInfo from '../../../components/MultiplayerInfo';

export default function GamePage({ params }) {
  const router = useRouter();
  const gameId = use(params).id;
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const { currentUser, userData } = useAuth();

  // Initial data fetch
  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        const gameRef = doc(db, 'games', gameId);
        const gameSnap = await getDoc(gameRef);
        
        if (gameSnap.exists()) {
          const gameData = {
            id: gameSnap.id,
            ...gameSnap.data()
          };
          
          setGame(gameData);

          // Add a view count
          const currentPlays = gameData.playCount || 0;
          await updateDoc(gameRef, {
            playCount: currentPlays + 1
          });
        } else {
          console.error("Game not found");
          setGame(null);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch game:", error);
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  // Real-time listener for favorites changes
  useEffect(() => {
    if (!currentUser) return;
    
    console.log("Setting up real-time listener for user favorites");
    
    // Set up real-time listener on the user document
    const userRef = doc(db, 'users', currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (userDoc) => {
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const favorites = userData.favorites || [];
        console.log("Favorites updated in real-time:", favorites);
        setIsFavorite(favorites.includes(gameId));
      }
    }, (error) => {
      console.error("Error in favorites listener:", error);
    });
    
    // Clean up listener when component unmounts
    return () => {
      console.log("Cleaning up favorites listener");
      unsubscribe();
    };
  }, [currentUser, gameId]);
  
  // Real-time listener for game data changes
  useEffect(() => {
    console.log("Setting up real-time listener for game data");
    
    const gameRef = doc(db, 'games', gameId);
    const unsubscribe = onSnapshot(gameRef, (gameDoc) => {
      if (gameDoc.exists()) {
        const gameData = {
          id: gameDoc.id,
          ...gameDoc.data()
        };
        console.log("Game data updated in real-time:", gameData);
        setGame(gameData);
      } else {
        console.error("Game document no longer exists");
        setGame(null);
      }
    }, (error) => {
      console.error("Error in game data listener:", error);
    });
    
    // Clean up listener when component unmounts
    return () => {
      console.log("Cleaning up game data listener");
      unsubscribe();
    };
  }, [gameId]);

  // Handle rating updates
  useEffect(() => {
    if (!currentUser || !game) return;
    
    // Check if user has already rated this game
    const userRef = doc(db, 'users', currentUser.uid);
    getDoc(userRef).then((userDoc) => {
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const ratings = userData.ratings || {};
        if (ratings[gameId]) {
          setUserRating(ratings[gameId]);
        }
      }
    }).catch(error => {
      console.error("Error fetching user ratings:", error);
    });
  }, [currentUser, gameId, game]);

  const handleRatingClick = async (rating) => {
    // Store the current rating before updating
    const previousRating = userRating;
    
    // Update local state for immediate UI feedback
    setUserRating(rating);
    
    try {
      // Make sure we have the game data and user
      if (!game || !currentUser) {
        console.error("Game data or user is not available");
        return;
      }
      
      // Get refs
      const userRef = doc(db, 'users', currentUser.uid);
      const gameRef = doc(db, 'games', gameId);
      const creatorRef = doc(db, 'users', game.creator_id);
      
      // Get current user document to check for existing rating
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        console.error("User document not found");
        return;
      }
      
      const userData = userDoc.data();
      const userRatings = userData.ratings || {};
      const storedPreviousRating = userRatings[gameId] || 0;
      
      // Get current game document to update ratings array
      const gameDoc = await getDoc(gameRef);
      if (!gameDoc.exists()) {
        console.error("Game document not found");
        return;
      }
      
      const gameData = gameDoc.data();
      const currentRatings = gameData.ratings || [];
      let updatedRatings = [...currentRatings];
      
      // If user already rated, remove their previous rating
      if (storedPreviousRating > 0) {
        // Remove one instance of their previous rating
        const index = updatedRatings.indexOf(storedPreviousRating);
        if (index !== -1) {
          updatedRatings.splice(index, 1);
        }
      }
      
      // Add new rating
      updatedRatings.push(rating);
      
      // Calculate new average
      const avgRating = updatedRatings.length > 0 
        ? updatedRatings.reduce((sum, r) => sum + r, 0) / updatedRatings.length 
        : 0;
      
      // Update game document with new ratings array and average
      await updateDoc(gameRef, {
        ratings: updatedRatings,
        rating: avgRating // Update the avg_rating field
      });
      
      // Update user document with their new rating
      await updateDoc(userRef, {
        [`ratings.${gameId}`]: rating
      });
      
      console.log(`Updated rating for game ${gameId} to ${rating} stars (avg: ${avgRating.toFixed(1)})`);
    } catch (error) {
      // Revert UI state if operation fails
      setUserRating(previousRating);
      console.error("Error updating rating:", error);
    }
  };

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
      
      // Check if user data is available
      if (!currentUser) {
        console.error("User data is not available");
        return;
      }
      
      // Get the current user reference
      const userRef = doc(db, 'users', currentUser.uid);
      const gameRef = doc(db, 'games', game.id);
      const creatorRef = doc(db, 'users', game.creator_id)
      
      if (newFavoriteState) {
        // Adding to favorites - using arrayUnion to add to array
        await updateDoc(userRef, {
          favorites: arrayUnion(gameId)  // This creates the array if it doesn't exist
        });
        
        // Optionally update the game's favorite count
        await updateDoc(gameRef, {
          favCount: increment(1)
        });

        // Update the creator's stats
        await updateDoc(creatorRef, {
          favCount: increment(1)
        })
      } else {
        // Removing from favorites - using arrayRemove
        await updateDoc(userRef, {
          favorites: arrayRemove(gameId)
        });
        
        // Optionally update the game's favorite count
        await updateDoc(gameRef, {
          favCount: increment(-1)
        });

        await updateDoc(creatorRef, {
          favCount: increment(-1)
        })
      }
      
      console.log(`${newFavoriteState ? 'Added' : 'Removed'} game ${game.id} ${newFavoriteState ? 'to' : 'from'} favorites`);
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
    <MultiplayerProvider>
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

      <main className="flex-1 flex flex-col container mx-auto px-4 py-4">
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
                  <span className="text-gray-400">{formatPlays(game.plays)} plays</span>
                </div>
                

                <div className="prose prose-invert max-w-none mb-8">
                  <p className="text-gray-300">{game.description}</p>
                </div>

                {/* todo: Multiplayer */}
                {/* display other player's name if it is multiplayer */}
                <div className="mt-4 mb-6">
                    <MultiplayerInfo currentUserId={currentUser?.uid} />
                </div>
                
                {/* Leaderboard */}
                {/* <div className="mt-4 mb-6">
                  <RetroLeaderboard gameId={gameId} />
                </div> */}
                
                <div className="mt-auto">
                  <div className="mb-6">
                    <p className="text-gray-300 mb-2">Rate this game:</p>
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRatingClick(star)}
                            className={`text-2xl mx-1 transition-colors ${
                              userRating >= star 
                                ? 'text-yellow-400' 
                                : 'text-gray-600 hover:text-yellow-300'
                            }`}
                            aria-label={`Rate ${star} stars`}
                            disabled={!currentUser}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <div className="ml-4">
                        {userRating > 0 ? (
                          <span className="text-gray-300 inline-block min-w-16">Your rating: {userRating}</span>
                        ) : currentUser ? (
                          <span className="text-gray-400 inline-block min-w-16">Not rated yet</span>
                        ) : (
                          <span className="text-gray-500 inline-block min-w-16">Sign in to rate</span>
                        )}
                      </div>
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
    </MultiplayerProvider>
  );
}