// app/community/page.jsx
'use client';

import { useState, useEffect } from 'react';
import BottomNavigation from '../../components/BottomNavigation';
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../lib/firebase'; // You'll need to create this file

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesCollectionRef = collection(db, "games");
        const querySnapshot = await getDocs(gamesCollectionRef);
        
        const gamesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setGames(gamesData);
        setFilteredGames(gamesData);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredGames(games);
      return;
    }
    
    const filtered = games.filter(game => 
      game.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredGames(filtered);
  };

  const formatPlays = (plays) => {
    if (!plays) return '0';
    
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
            PAPERPROTO ARCADE
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
                      {/* If there's an image URL, display it */}
                      {game.image ? (
                        <Image 
                          src={game.image} 
                          alt={game.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-4xl font-bold text-indigo-500">
                            {game.title?.charAt(0) || '?'}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 flex-grow">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-bold text-pink-400 mb-2">{game.title || 'Untitled Game'}</h3>
                        <div className="flex items-center text-yellow-400 ml-2">
                          ★ {game.rating || '0.0'}
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                        {game.description || 'No description available'}
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