// app/page.js
'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { Gamepad2 } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * This file initializes our overall web application.
 * It only points the user towards their dashboard if they are already authenticated.
 * If the user is not authenticated, it points them to login or create an account.
*/
export default function Home() {
  const { currentUser } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Add class to trigger the CRT power-on animation
    document.getElementById('main-container')?.classList.add('crt-on');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 retro-grid-bg">      
      <div id="main-container" className="max-w-md w-full space-y-8 bg-gray-800 p-8 border-4 border-indigo-600 rounded-lg shadow-[8px_8px_0px_0px_rgba(79,70,229)]">
        <div>
          {/* Game controller icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 flex items-center justify-center bg-indigo-900 rounded-full border-4 border-pink-500 mb-4">
              <Gamepad2 size={48} className="text-pink-500" />
            </div>
          </div>
          
          <h1 className="mt-6 text-center text-4xl font-extrabold text-pink-500"
              style={{ 
                textShadow: '2px 2px 0px #4F46E5, 4px 4px 0px #2D3748',
                fontFamily: '"Press Start 2P", cursive'
              }}>
            PaperProto
          </h1>
          
          <p className="mt-6 text-center text-lg text-indigo-300"
             style={{ 
                textShadow: '1px 1px 0px #1F2937',
                fontFamily: '"Press Start 2P", cursive'
              }}>
            From pen to play.
          </p>
        </div>

        {/* 
          If the user is already logged in, they will be presented with only the choice to view their dashboard.
          Otherwise, the user will be presented with a "Start Game" option to create their account or login.
        */}
        <div className="flex flex-col space-y-6 items-center pt-4">
          {currentUser ? (
            <Link
              href="/profile"
              className="group relative w-64 flex justify-center py-3 px-4 border-2 border-indigo-400 text-md font-bold rounded-md text-white bg-indigo-600 hover:bg-indigo-500 transition-transform duration-200 hover:translate-y-[-2px] shadow-[2px_2px_0px_0px_rgba(79,70,229)]"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <div className="pt-4 text-center">
                <p className="text-indigo-400 text-xs" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '12px' }}>
                  PRESS START TO BEGIN
                </p>
                <div className="mt-2 text-pink-400 animate-pulse">▼</div>
              </div>
              <Link
                href="/auth"
                className="group relative w-64 flex justify-center py-3 px-4 border-2 border-pink-400 text-md font-bold rounded-md text-white bg-pink-600 hover:bg-pink-500 transition-transform duration-200 hover:translate-y-[-2px] shadow-[2px_2px_0px_0px_rgba(236,72,153)]"
              >
                GET STARTED
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Scanline effect for CRT feel */}
      <div className="fixed inset-0 pointer-events-none scanline"></div>
    </div>
  );
}