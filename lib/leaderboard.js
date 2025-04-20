import { doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Submit a score to the leaderboard
export async function submitScore(gameUuid, userId, userName, score) {
  try {
    // Reference to the leaderboard document
    const leaderboardRef = doc(db, "leaderboards", gameUuid);
    
    // Check if leaderboard exists
    const leaderboardDoc = await getDoc(leaderboardRef);
    
    if (!leaderboardDoc.exists()) {
      // Create new leaderboard with first score
      await setDoc(leaderboardRef, {
        game_uuid: gameUuid,
        scores: [{
          userId,
          userName,
          score,
          timestamp: serverTimestamp()
        }]
      });
      return true;
    } else {
      // Get current scores
      const currentLeaderboard = leaderboardDoc.data();
      const currentScores = currentLeaderboard.scores || [];
      
      // Add new score
      const newScore = {
        userId,
        userName,
        score,
        timestamp: serverTimestamp()
      };
      
      // Combine and sort scores
      const allScores = [...currentScores, newScore];
      const sortedScores = allScores
        .sort((a, b) => b.score - a.score) // Sort descending
        .slice(0, 10); // Keep only top 10
      
      // Update leaderboard
      await updateDoc(leaderboardRef, {
        scores: sortedScores
      });
      return true;
    }
  } catch (error) {
    console.error("Error submitting score:", error);
    return false;
  }
}

// Get leaderboard for a game
export async function getLeaderboard(gameUuid) {
  try {
    const leaderboardRef = doc(db, "leaderboards", gameUuid);
    const leaderboardDoc = await getDoc(leaderboardRef);
    
    if (leaderboardDoc.exists()) {
      return leaderboardDoc.data().scores || [];
    }
    return [];
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    return [];
  }
}