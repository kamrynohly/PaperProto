// app/community/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BottomNavigation from '../../components/BottomNavigation';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../lib/firebase';

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const snapshot = await getDocs(collection(db, "games"));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGames(data);
        setFilteredGames(data);
      } catch (err) {
        console.error("Error fetching games:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGames();
  }, []);

  // Real-time search as user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredGames(games);
      return;
    }
    
    const q = searchQuery.toLowerCase();
    const filtered = games.filter(g =>
      g.title?.toLowerCase().includes(q) ||
      g.description?.toLowerCase().includes(q)
    );
    
    setFilteredGames(filtered);
  }, [searchQuery, games]);

  const formatPlays = (plays) => {
    if (!plays) return '0';
    if (plays >= 1e6) return `${(plays / 1e6).toFixed(1)}M`;
    if (plays >= 1e3) return `${(plays / 1e3).toFixed(1)}K`;
    return plays.toString();
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-indigo-900 border-b-4 border-pink-500 shadow-lg">
        <div className="container mx-auto py-6 px-4">
          <h1
            className="text-4xl font-bold text-center tracking-wider text-pink-500"
            style={{
              textShadow: '2px 2px 0px #4F46E5, 4px 4px 0px #2D3748',
              fontFamily: '"Press Start 2P", cursive'
            }}
          >
            PAPERPROTO ARCADE
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Enhanced Search */}
        <div className="mb-12 text-center mx-auto">
          <div className="bg-gray-800 p-6 rounded-lg border-2 border-indigo-600 shadow-lg relative">
            <h2 className="text-2xl font-bold mb-4 text-indigo-400" 
                style={{
                  fontFamily: '"Press Start 2P", cursive',
                  fontSize: '1.25rem'
                }}>
              Find Your Next Obsession :)
            </h2>
            
            <div className="relative">
              <div className={`flex items-center rounded-lg overflow-hidden transition-all duration-300 ${searchFocused ? 'ring-2 ring-pink-500' : ''}`}>
                <div className="absolute left-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search games by title or description..."
                  className="w-full px-10 py-3 bg-gray-700 border-2 border-indigo-500 rounded-lg focus:outline-none text-white transition-all"
                  style={{
                    boxShadow: searchFocused ? '0 0 15px rgba(168, 85, 247, 0.5)' : 'none'
                  }}
                />
                
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {searchQuery && (
                <div className="absolute right-0 bottom-0 translate-y-full mt-2 text-gray-400 text-sm">
                  {filteredGames.length} {filteredGames.length === 1 ? 'result' : 'results'} found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Games Grid Header */}
        <div className="flex justify-between items-center mb-6 border-b-2 border-indigo-700 pb-2">
          <h2 className="text-2xl font-bold text-indigo-400">
            {searchQuery ? 'Search Results' : 'Top Rated Games'}
          </h2>
          
          {searchQuery && (
            <button 
              onClick={clearSearch}
              className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
            >
              <span className="mr-1">Clear Search</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Games Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 pixel-spinner"></div>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center border-2 border-indigo-700">
            <p className="text-xl text-gray-400 mb-4">
              No games found matching {searchQuery}
            </p>
            <button
              onClick={clearSearch}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded font-bold transition-colors duration-200"
            >
              View All Games
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map(game => (
              <Link key={game.id} href={`/games/${game.id}`}>
                <div className="bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-gray-700 hover:border-indigo-500 h-full flex flex-col">
                  <div className="relative h-48 w-full bg-gray-700">
                    {game.cover_image ? (
                      <Image
                        src={game.cover_image}
                        alt={game.title || 'Game cover'}
                        fill
                        className="object-cover"
                      />
                    ) : game.image ? (
                      <Image
                        src={game.image}
                        alt={game.title || 'Game thumbnail'}
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
                    
                    {/* Highlight matches */}
                    {searchQuery && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-indigo-900 bg-opacity-80 px-2 py-1 rounded text-xs text-white">
                          Match
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-grow">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-bold text-pink-400 mb-2">
                        {game.title || 'Untitled Game'}
                      </h3>
                      <div className="flex items-center text-yellow-400 ml-2">
                        ★ {game.rating || '0.0'}
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                      {game.description || 'No description available'}
                    </p>
                    <div className="text-xs text-indigo-400 mt-auto">
                      {formatPlays(game.playCount ?? game.plays)} plays
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <BottomNavigation/>
    </div>
  );
}