// app/games/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BottomNavigation from '../../../components/BottomNavigation';

export default function GamePage({ params }) {
  const router = useRouter();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    const fetchGame = async () => {
      try {
        // Simulate API fetch delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // This is mock data - in a real app you'd fetch from an API
        const mockGames = [
          {
            id: 1,
            title: 'Pixel Adventure',
            description: 'A retro platformer with challenging levels and hidden secrets. Players explore various pixel-art worlds, collecting power-ups and defeating enemies. The game features tight controls, secret areas in every level, and an original chiptune soundtrack that enhances the retro gaming experience. Special abilities can be unlocked as you progress through the increasingly difficult levels.',
            rating: 4.9,
            plays: 254789,
            canvasData: {
              width: 800,
              height: 600,
              backgroundColor: '#000'
            }
          },
          {
            id: 2,
            title: 'Cosmic Invaders',
            description: 'Classic space shooter with modern twists and power-ups. Defend Earth from waves of alien invaders in this reimagined arcade classic. Features include multiple weapon types, screen-clearing bombs, and challenging boss fights. The difficulty scales with your performance, ensuring that both casual and hardcore players will find an appropriate challenge level.',
            rating: 4.8,
            plays: 198423,
            canvasData: {
              width: 800,
              height: 600,
              backgroundColor: '#000022'
            }
          },
          {
            id: 3,
            title: 'Dungeon Crawler',
            description: 'Explore procedurally generated dungeons filled with loot and enemies. Each run through the dungeon is unique, with randomized layouts, treasures, and enemy placements. Collect magical items that synergize in unexpected ways to create powerful builds. Features perma-death mechanics balanced with persistent upgrades that make each subsequent run more manageable.',
            rating: 4.7,
            plays: 187654,
            canvasData: {
              width: 800,
              height: 600,
              backgroundColor: '#111'
            }
          },
          {
            id: 4,
            title: 'Neon Racer',
            description: 'High-speed racing in a retro-futuristic city landscape. Feel the rush as you drift around tight corners and activate boost pads to overtake competitors. The stylized neon visuals create an immersive cyberpunk atmosphere, complemented by a synth-wave soundtrack that responds dynamically to your racing performance.',
            rating: 4.6,
            plays: 176532,
            canvasData: {
              width: 800,
              height: 600,
              backgroundColor: '#120022'
            }
          },
          {
            id: 5,
            title: 'Retro Quest',
            description: 'An epic RPG adventure inspired by 8-bit classics. Embark on a hero\'s journey across a vast pixel world, completing quests and upgrading your character. The turn-based combat system emphasizes strategy and preparation, while the branching narrative allows for multiple endings based on the choices you make throughout your adventure.',
            rating: 4.5,
            plays: 154321,
            canvasData: {
              width: 800,
              height: 600,
              backgroundColor: '#042200'
            }
          },
          {
            id: 6,
            title: 'Puzzle Master',
            description: 'Brain-teasing puzzles that increase in difficulty as you progress. Each level introduces new mechanics that build upon previous concepts, creating an engaging learning curve. Solve logic puzzles, spatial challenges, and pattern recognition tests that will exercise different areas of your brain. The minimalist art style keeps the focus on the puzzles themselves.',
            rating: 4.4,
            plays: 143210,
            canvasData: {
              width: 800,
              height: 600,
              backgroundColor: '#001133'
            }
          },
          {
            id: 7,
            title: 'Beat Blaster',
            description: 'Rhythm game with retro synth music and pixel art visualizations. Match your actions to the beat of the music to maximize your score and create impressive visual effects. Features tracks from indie chiptune and synthwave artists, with difficulty levels ranging from casual to extreme. The visual feedback system makes it accessible even to players new to the rhythm game genre.',
            rating: 4.3,
            plays: 132109,
            canvasData: {
              width: 800,
              height: 600,
              backgroundColor: '#330033'
            }
          },
          {
            id: 8,
            title: 'Castle Defense',
            description: 'Tower defense game with strategic depth and pixel art charm. Position your defenders wisely to protect your castle from waves of diverse enemies. Research and upgrade technologies to unlock new tower types and special abilities. The campaign mode features a story that unfolds as you defend different regions of your kingdom.',
            rating: 4.2,
            plays: 121098,
            canvasData: {
              width: 800,
              height: 600,
              backgroundColor: '#221100'
            }
          }
        ];
        
        // Find the game with the matching ID
        const foundGame = mockGames.find(g => g.id === parseInt(params.id));
        
        if (foundGame) {
          setGame(foundGame);
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
  }, [params.id, router]);

  const handleRatingClick = (rating) => {
    setUserRating(rating);
    // In a real app, you would send this to your API
    console.log(`Rating game ${params.id} with ${rating} stars`);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, you would send this to your API
    console.log(`${!isFavorite ? 'Adding' : 'Removing'} game ${params.id} ${!isFavorite ? 'to' : 'from'} favorites`);
  };

  const formatPlays = (plays) => {
    if (plays >= 1000000) {
      return `${(plays / 1000000).toFixed(1)}M`;
    } else if (plays >= 1000) {
      return `${(plays / 1000).toFixed(1)}K`;
    }
    return plays.toString();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
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

      <main className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link href="/community" className="inline-flex items-center mb-6 text-indigo-400 hover:text-indigo-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Community
        </Link>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 pixel-spinner"></div>
          </div>
        ) : game ? (
          <div className="bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
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
                    <span className="ml-1 font-bold">{game.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-400">{formatPlays(game.plays)} plays</span>
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
              <div className="bg-black p-6 flex items-center justify-center">
                <div className="w-full h-full min-h-[500px] relative">
                  {/* This is where the game canvas would be rendered */}
                  <div 
                    className="w-full h-full rounded-lg border border-gray-700 flex items-center justify-center" 
                    style={{
                      backgroundColor: game.canvasData?.backgroundColor || '#000',
                      minHeight: '500px'
                    }}
                  >
                    <div className="text-center">
                      <div className="text-6xl font-bold text-indigo-500 mb-4 animate-pulse">
                        {game.title.charAt(0)}
                      </div>
                      <p className="text-gray-400">Game canvas would load here</p>
                      <button className="mt-4 px-4 py-2 bg-pink-600 rounded hover:bg-pink-700 transition-colors">
                        Start Game
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-xl text-gray-400">Game not found.</p>
            <Link href="/community" className="inline-block mt-4 px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
              Return to Community
            </Link>
          </div>
        )}
      </main>
      {/* <BottomNavigation /> */}
    </div>
  );
}