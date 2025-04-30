// components/RetroLeaderboard.js
import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Make sure you have this import
import { useAuth } from '../contexts/AuthContext'; // Import auth context

export default function RetroLeaderboard({ gameId, newScore = null, refreshKey }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { currentUser } = useAuth();

  // Load leaderboard data from Firebase on component mount or when refreshKey changes
  useEffect(() => {
    fetchLeaderboard();
  }, [gameId, refreshKey]);

  // Process new score when it's passed as prop
  useEffect(() => {
    if (newScore && currentUser) {
      handleNewScore(newScore);
    }
  }, [newScore, currentUser]);

  // Fetch leaderboard data from Firestore
  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const leaderboardRef = collection(db, 'leaderboards', gameId, 'scores');
      const q = query(leaderboardRef, orderBy('score', 'desc'), limit(3));
      const querySnapshot = await getDocs(q);
      
      const scores = [];
      querySnapshot.forEach((doc) => {
        scores.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setLeaderboard(scores);
    } catch (err) {
      console.error('Error loading leaderboard data:', err);
      setError('Failed to load high scores');
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new score
  const handleNewScore = async (score) => {
    if (!currentUser) return;
    
    try {
      // Create new entry
      const newEntry = {
        name: currentUser.displayName || 'Anonymous Player',
        score: parseInt(score),
        userId: currentUser.uid,
        date: new Date().toISOString()
      };
      
      // Add to Firebase
      const leaderboardRef = collection(db, 'leaderboards', gameId, 'scores');
      await addDoc(leaderboardRef, newEntry);
      
      // Refresh leaderboard
      await fetchLeaderboard();
      
      // Show success message
      setSuccess(true);
      
      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error('Error adding score:', err);
      setError('Failed to save your score');
    }
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
          {loading ? (
            <div className="py-6 text-center">
              <div className="inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
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
                        ${newScore && currentUser && entry.userId === currentUser.uid && entry.score === parseInt(newScore) ? 'bg-pink-900 bg-opacity-30' : ''}
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
                      NO SCORES YET
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {error && (
        <div className="px-3 pb-3 text-red-400 text-center text-xs"
            style={{ fontFamily: '"Press Start 2P", cursive' }}>
          {error}
        </div>
      )}
      
      {success && (
        <div className="px-3 pb-3 text-green-400 text-center text-xs animate-pulse"
            style={{ fontFamily: '"Press Start 2P", cursive' }}>
          SCORE SAVED!
        </div>
      )}
    </div>
  );
}