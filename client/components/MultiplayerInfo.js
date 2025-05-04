'use client';

import { useMultiplayer } from '../contexts/MultiplayerContext';

// This component presents information about multiplayer games, such as
// which users are currently playing.

export default function MultiplayerInfo({ currentUserId }) {
  const { players, gameSessionID } = useMultiplayer();
  
  // Filter out the current player
  const otherPlayers = players.filter(player => player.userID !== currentUserId);
  
  if (!gameSessionID || otherPlayers.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-gray-700 rounded-lg p-3 mb-4">
    <div>ID: {gameSessionID}</div>
    <div>Players: {players.map(player => player.username).join(', ')}</div>
      <p className="text-gray-300">
        Playing with: 
        <span className="font-bold text-pink-400 ml-2">
          {otherPlayers.map(player => player.username).join(', ')}
        </span>
      </p>
    </div>
  );
}