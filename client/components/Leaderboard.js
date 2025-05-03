// components/Leaderboard.js
import { useState, useEffect } from 'react';

export default function Leaderboard({ gameId }) {
  const [playerName, setPlayerName] = useState('');
  const [playerScore, setPlayerScore] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
    
    if (!playerName.trim() || !playerScore || isNaN(parseInt(playerScore))) {
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
      .slice(0, 10);
    
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
    <div className="bg-gray-800 rounded-lg border-2 border-indigo-600 p-4 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-pink-400"
          style={{ fontFamily: '"Press Start 2P", cursive' }}>
        HIGH SCORES
      </h3>
      
      {/* Leaderboard table */}
      <div className="mb-4 overflow-hidden border-2 border-indigo-700 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-indigo-900">
              <th className="py-2 text-indigo-300 text-left pl-3">#</th>
              <th className="py-2 text-indigo-300 text-left">PLAYER</th>
              <th className="py-2 text-indigo-300 text-right">SCORE</th>
              <th className="py-2 text-indigo-300 text-right pr-3">DATE</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length > 0 ? (
              leaderboard.map((entry, index) => (
                <tr 
                  key={entry.id} 
                  className={`${index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'} hover:bg-indigo-800`}
                >
                  <td className="py-2 pl-3 text-yellow-400">{index + 1}</td>
                  <td className="py-2 text-gray-100">{entry.name}</td>
                  <td className="py-2 text-right text-pink-400">{entry.score.toLocaleString()}</td>
                  <td className="py-2 text-right pr-3 text-gray-400">{formatDate(entry.date)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No scores yet. Be the first!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Submit form */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Your name"
            maxLength={15}
            className="px-3 py-2 bg-gray-700 border-2 border-indigo-600 rounded text-white"
            disabled={isSubmitting}
          />
          <input
            type="number"
            value={playerScore}
            onChange={(e) => setPlayerScore(e.target.value)}
            placeholder="Your score"
            className="px-3 py-2 bg-gray-700 border-2 border-indigo-600 rounded text-white"
            disabled={isSubmitting}
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded font-bold border-2 border-pink-500 transition-colors"
        >
          {isSubmitting ? 'SUBMITTING...' : 'SUBMIT SCORE'}
        </button>
        
        {success && (
          <div className="mt-2 text-green-400 text-center text-sm">
            Score submitted successfully!
          </div>
        )}
      </form>
    </div>
  );
}