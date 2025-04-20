// app/layout.js
'use client';

import { AuthProvider } from '../contexts/AuthContext';
import BottomNavigation from '../components/BottomNavigation';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <BottomNavigation />
        </AuthProvider>
      </body>
    </html>
  );
}