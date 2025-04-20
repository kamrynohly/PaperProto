// app/layout.js
'use client';

import { AuthProvider } from '../contexts/AuthContext';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {/* Decorative pixelated corners for that retro UI feel */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-pink-500"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-pink-500"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-pink-500"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-pink-500"></div>
          {/* Pages demonstrated by the children */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}