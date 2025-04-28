"use client"
// components/GameModeModal.js

import { useState } from 'react';

export default function GameModeModal({ isOpen, onClose, onSelectMode }) {
  const [selectedMode, setSelectedMode] = useState(null);

  if (!isOpen) return null;

  const handleSelect = (mode) => {
    setSelectedMode(mode);
    // Pass the selected mode back to the parent component
    onSelectMode(mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-0 flex items-center justify-center z-50">
      <div className="bg-indigo-900 border-4 border-pink-500 text-white px-6 py-4 rounded-md shadow-[0px_0px_15px_5px_rgba(236,72,153,0.5)] w-full max-w-md">
        <div className="text-center">
          <p className="text-lg font-bold text-pink-400" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '18px' }}>
            SELECT GAME MODE
          </p>
          <p className="mt-2 text-sm text-indigo-200 mb-6">Choose the number of players for your game</p>
          
          <div className="grid grid-cols-2 gap-4 mt-4 mb-6">
            <button 
              onClick={() => handleSelect('single')}
              className={`p-4 border-4 ${
                selectedMode === 'single' 
                  ? 'bg-pink-600 border-pink-400' 
                  : 'bg-indigo-700 border-indigo-500 hover:bg-indigo-600'
              } rounded-lg transition-all duration-200 pixel-border flex flex-col items-center`}
            >
              <span className="text-3xl mb-2">👤</span>
              <span className="font-pixelify">One Player</span>
            </button>
            
            <button 
              onClick={() => handleSelect('multi')}
              className={`p-4 border-4 ${
                selectedMode === 'multi' 
                  ? 'bg-pink-600 border-pink-400' 
                  : 'bg-indigo-700 border-indigo-500 hover:bg-indigo-600'
              } rounded-lg transition-all duration-200 pixel-border flex flex-col items-center`}
            >
              <span className="text-3xl mb-2">👥</span>
              <span className="font-pixelify">Two Players</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}