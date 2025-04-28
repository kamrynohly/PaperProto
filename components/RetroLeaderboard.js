// components/RetroLeaderboard.js
import { useState, useEffect } from 'react';

export default function RetroLeaderboard({ gameId }) {
  const [playerName, setPlayerName] = useState('');
  const [playerScore, setPlayerScore] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Load leaderboard data from localStorage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem(`leaderboard-${gameId}`);
    if (storedData) {
      try {
        setLeaderboard(JSON.parse(storedData));
      } catch (err) {
        console.error('Error loading leaderboard data:', err);
        setLeaderboard([]);
      }
    }
  }, [gameId]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!playerScore || isNaN(parseInt(playerScore))) {
      setError('Please enter a valid score');
      return;
    }
    
    setIsSubmitting(true);
    
    // Create new entry
    const newEntry = {
      id: Date.now().toString(),
      name: playerName.trim(),
      score: parseInt(playerScore),
      date: new Date().toISOString()
    };
    
    // Add to leaderboard, sort, and keep top 10
    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    // Update state and localStorage
    setLeaderboard(updatedLeaderboard);
    localStorage.setItem(`leaderboard-${gameId}`, JSON.stringify(updatedLeaderboard));
    
    // Reset form
    setPlayerName('');
    setPlayerScore('');
    setIsSubmitting(false);
    setSuccess(true);
    
    // Clear success message after 2 seconds
    setTimeout(() => setSuccess(false), 2000);
  };

  // Format date for display (e.g., "Apr 20")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg border-2 border-indigo-500">
      {/* Header */}
      <div className="bg-indigo-900 px-4 py-3 border-b-4 border-pink-500">
        <h4 className="text-xl font-bold text-pink-400"
            style={{ fontFamily: '"Press Start 2P", cursive', textShadow: '2px 2px 0px #2D3748' }}>
          HIGH SCORES
        </h4>
      </div>
      
      {/* Leaderboard table */}
      <div className="p-3">
        <div className="bg-gray-800 rounded overflow-hidden border-2 border-indigo-700">
          <table className="w-full">
            <thead>
              <tr className="bg-indigo-800">
                <th className="py-2 px-2 text-indigo-300 text-left text-xs"
                    style={{ fontFamily: '"Press Start 2P", cursive' }}>
                  RANK
                </th>
                <th className="py-2 text-indigo-300 text-left text-xs"
                    style={{ fontFamily: '"Press Start 2P", cursive' }}>
                  PLAYER
                </th>
                <th className="py-2 text-indigo-300 text-right text-xs"
                    style={{ fontFamily: '"Press Start 2P", cursive' }}>
                  SCORE
                </th>
                <th className="py-2 pr-2 text-indigo-300 text-right text-xs"
                    style={{ fontFamily: '"Press Start 2P", cursive' }}>
                  DATE
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => (
                  <tr 
                    key={entry.id} 
                    className={`
                      ${index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'} 
                      hover:bg-indigo-800 transition-colors duration-150
                      ${index === 0 ? 'bg-indigo-900 bg-opacity-40' : ''}
                    `}
                  >
                    <td className="py-2 px-2 text-yellow-400 text-xs"
                        style={{ fontFamily: '"Press Start 2P", cursive' }}>
                      {index + 1}
                    </td>
                    <td className="py-2 text-gray-100 text-xs"
                        style={{ fontFamily: '"Press Start 2P", cursive' }}>
                      {entry.name}
                    </td>
                    <td className="py-2 text-right text-pink-400 text-xs"
                        style={{ fontFamily: '"Press Start 2P", cursive' }}>
                      {entry.score.toLocaleString()}
                    </td>
                    <td className="py-2 pr-2 text-right text-gray-400 text-xs"
                        style={{ fontFamily: '"Press Start 2P", cursive' }}>
                      {formatDate(entry.date)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-400 text-xs"
                      style={{ fontFamily: '"Press Start 2P", cursive' }}>
                    Sneak peek... exciting things to come!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Submit form */}
      <div className="px-3 pb-3">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="YOUR NAME"
              maxLength={15}
              className="px-3 py-2 bg-gray-800 border-2 border-indigo-600 rounded text-white text-xs"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
              disabled={isSubmitting}
            />
            <input
              type="number"
              value={playerScore}
              onChange={(e) => setPlayerScore(e.target.value)}
              placeholder="YOUR SCORE"
              className="px-3 py-2 bg-gray-800 border-2 border-indigo-600 rounded text-white text-xs"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
              disabled={isSubmitting}
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded border-2 border-pink-500 transition-colors duration-150 text-xs"
            style={{ 
              fontFamily: '"Press Start 2P", cursive',
              boxShadow: '0 4px 0 #4F46E5'
            }}
          >
            {isSubmitting ? 'SUBMITTING...' : 'SUBMIT SCORE'}
          </button>
          
          {error && (
            <div className="mt-2 text-red-400 text-center text-xs"
                style={{ fontFamily: '"Press Start 2P", cursive' }}>
              {error}
            </div>
          )}
          
          {success && (
            <div className="mt-2 text-green-400 text-center text-xs animate-pulse"
                style={{ fontFamily: '"Press Start 2P", cursive' }}>
              SCORE ADDED!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}