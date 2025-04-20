// app/community/page.jsx
'use client';

import { useState, useEffect } from 'react';
import BottomNavigation from '../../components/BottomNavigation';
import Image from 'next/image';
import Link from 'next/link';

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    const fetchGames = async () => {
      // Simulating API fetch delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      const mockGames = [
        {
          id: 1,
          title: 'Pixel Adventure',
          description: 'A retro platformer with challenging levels and hidden secrets',
          image: '/images/pixel-adventure.png',
          rating: 4.9,
          plays: 254789
        },
        {
          id: 2,
          title: 'Cosmic Invaders',
          description: 'Classic space shooter with modern twists and power-ups',
          image: '/images/cosmic-invaders.png',
          rating: 4.8,
          plays: 198423
        },
        {
          id: 3,
          title: 'Dungeon Crawler',
          description: 'Explore procedurally generated dungeons filled with loot and enemies',
          image: '/images/dungeon-crawler.png',
          rating: 4.7,
          plays: 187654
        },
        {
          id: 4,
          title: 'Neon Racer',
          description: 'High-speed racing in a retro-futuristic city landscape',
          image: '/images/neon-racer.png',
          rating: 4.6,
          plays: 176532
        },
        {
          id: 5,
          title: 'Retro Quest',
          description: 'An epic RPG adventure inspired by 8-bit classics',
          image: '/images/retro-quest.png',
          rating: 4.5,
          plays: 154321
        },
        {
          id: 6,
          title: 'Puzzle Master',
          description: 'Brain-teasing puzzles that increase in difficulty as you progress',
          image: '/images/puzzle-master.png',
          rating: 4.4,
          plays: 143210
        },
        {
          id: 7,
          title: 'Beat Blaster',
          description: 'Rhythm game with retro synth music and pixel art visualizations',
          image: '/images/beat-blaster.png',
          rating: 4.3,
          plays: 132109
        },
        {
          id: 8,
          title: 'Castle Defense',
          description: 'Tower defense game with strategic depth and pixel art charm',
          image: '/images/castle-defense.png',
          rating: 4.2,
          plays: 121098
        }
      ];
      
      setGames(mockGames);
      setFilteredGames(mockGames);
      setIsLoading(false);
    };

    fetchGames();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredGames(games);
      return;
    }
    
    const filtered = games.filter(game => 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredGames(filtered);
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
            PAPERPROTO COMMUNITY
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-lg border-2 border-indigo-600 shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-indigo-400">Find Your Next Game</h2>
            <div className="flex space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search games..."
                className="flex-grow px-4 py-2 bg-gray-700 border-2 border-indigo-500 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-pink-600 hover:bg-pink-700 rounded font-bold transition-colors duration-200 border-2 border-pink-500 shadow-md"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-indigo-400 border-b-2 border-indigo-700 pb-2">
            Top Rated Games
          </h2>
          
          {isLoading ? (
            <div className="col-span-2 flex justify-center items-center h-64">
             <div className="w-16 h-16 pixel-spinner"></div>
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-xl text-gray-400">No games found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map((game) => (
                <Link key={game.id} href={`/games/${game.id}`}>
                  <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform duration-200 hover:transform hover:scale-105 border-2 border-gray-700 hover:border-indigo-500 h-full flex flex-col">
                    <div className="relative h-48 w-full bg-gray-700">
                      {/* In a real app, use actual images */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-4xl font-bold text-indigo-500">
                          {game.title.charAt(0)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 flex-grow">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-bold text-pink-400 mb-2">{game.title}</h3>
                        <div className="flex items-center text-yellow-400 ml-2">
                          ★ {game.rating}
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                        {game.description}
                      </p>
                      <div className="text-xs text-indigo-400 mt-auto">
                        {formatPlays(game.plays)} plays
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNavigation/>
    </div>
  );
}