// components/LeaderboardScreen.js
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Trophy, RotateCcw } from 'lucide-react';

export default function LeaderboardScreen({ gameId, score, onRestart }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Get top 10 scores for this game
        const scoresRef = collection(db, 'game_scores');
        const q = query(
          scoresRef,
          where('game_id', '==', gameId),
          orderBy('score', 'desc'),
          limit(10)
        );
        
        const querySnapshot = await getDocs(q);
        const scores = [];
        querySnapshot.forEach((doc) => {
          scores.push(doc.data());
        });
        
        setLeaderboard(scores);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    if (gameId) {
      fetchLeaderboard();
    }
  }, [gameId]);

  // Check if current user's score is on the leaderboard
  const userOnLeaderboard = currentUser && leaderboard.some(entry => 
    entry.user_id === currentUser.uid && entry.score === score
  );

  // Check if current score would make the leaderboard
  const wouldMakeLeaderboard = 
    score > 0 && 
    (leaderboard.length < 10 || score > leaderboard[leaderboard.length - 1]?.score || 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-md bg-gray-800 border-4 border-indigo-600 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-indigo-800 border-b-4 border-indigo-500 flex items-center">
          <Trophy size={20} className="mr-2 text-yellow-400" />
          <h3 className="text-lg font-bold text-white" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '12px' }}>
            HIGH SCORES
          </h3>
        </div>
        
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 size={24} className="animate-spin text-pink-500" />
            </div>
          ) : (
            <>
              {score > 0 && (
                <div className="mb-4 p-2 bg-pink-900 bg-opacity-30 border-2 border-pink-500 rounded text-center">
                  <p className="text-pink-300" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>
                    YOUR SCORE: {score}
                  </p>
                  {!userOnLeaderboard && wouldMakeLeaderboard && (
                    <p className="text-pink-300 mt-1" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '8px' }}>
                      CONGRATS! YOU MADE THE LEADERBOARD!
                    </p>
                  )}
                </div>
              )}
              
              <table className="w-full mb-4">
                <thead>
                  <tr className="border-b-2 border-indigo-700">
                    <th className="text-left text-pink-300 pb-2" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>RANK</th>
                    <th className="text-left text-pink-300 pb-2" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>PLAYER</th>
                    <th className="text-right text-pink-300 pb-2" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>SCORE</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.length > 0 ? (
                    leaderboard.map((entry, index) => (
                      <tr key={index} className={
                        currentUser && entry.user_id === currentUser.uid && entry.score === score
                          ? "bg-pink-900 bg-opacity-30"
                          : index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
                      }>
                        <td className="py-1 text-gray-200" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>
                          {index + 1}
                        </td>
                        <td className="py-1 text-gray-200" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>
                          {entry.username}
                        </td>
                        <td className="py-1 text-right text-gray-200" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>
                          {entry.score}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-gray-400" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>
                        NO SCORES YET
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
          
          <div className="flex justify-center">
            <button
              onClick={onRestart}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md border-b-4 border-pink-800 flex items-center"
              style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}
            >
              <RotateCcw size={16} className="mr-2" /> PLAY AGAIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}