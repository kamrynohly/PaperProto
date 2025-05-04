// // utils/store_game_data.js

// import { doc, getDoc, updateDoc, deleteField, increment } from 'firebase/firestore';
// import { db } from '../client/lib/firebase';

// export async function update_game_leaderboard(game_id, user_id, user_score) {
//     try {
//         // Reference to the game document
//         const gameRef = doc(db, 'games', game_id);
//         // Get the current document
//         const gameSnap = await getDoc(gameRef);

//         if (gameSnap.exists()) {
//             // Get current leaderboard or initialize empty object if it doesn't exist
//             const leaderboard = gameSnap.data().leaderboard || {};
            
//             // Update the leaderboard with the new score for the user
//             leaderboard[user_id] = user_score;
            
//             // Update the document in Firestore
//             await updateDoc(gameRef, {
//                 leaderboard: leaderboard
//             });
            
//             return { success: true };
//         } else {
//             // If the document doesn't exist, create it
//             await setDoc(gameRef, {
//                 leaderboard: {
//                     [user_id]: user_score
//                 }
//             });
            
//             return { success: true };
//         }
//     } catch (error) {
//         console.error('Error updating game leaderboard:', error);
//         throw error;
//     }
// }