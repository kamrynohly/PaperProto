// app/layout.js
// 'use client';

import { AuthProvider } from '../contexts/AuthContext';
import './globals.css';

// export const metadata = {
//   metadataBase: new URL('https://paper-proto.com'),
//   title: 'PaperProto - From pen to play',
//   description: 'Transform hand-drawn sketches into playable prototypes',
//   openGraph: {
//     title: 'PaperProto - From pen to play',
//     description: 'Transform hand-drawn sketches into playable prototypes',
//     url: 'https://paper-proto.com',
//     siteName: 'PaperProto',
//     images: [
//       {
//         url: 'https://www.paper-proto.com/opengraph-image', // Note: changed to .png extension
//         width: 1200,
//         height: 630,
//         alt: 'PaperProto - From pen to play!',
//       },
//     ],
//     locale: 'en_US',
//     type: 'website',
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'PaperProto - From pen to play!',
//     description: 'Transform hand-drawn sketches into playable prototypes',
//     images: ['/opengraph-image'], // Note: changed to .png extension
//   },
// };

// app/layout.js
export const metadata = {
  metadataBase: new URL('https://paper-proto.com'),
  title: 'PaperProto - From pen to play',
  description: 'Transform hand-drawn sketches into playable prototypes',
  openGraph: {
    // No need to specify images - Next.js will use app/opengraph-image.js
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PaperProto - From pen to play!',
    description: 'Transform hand-drawn sketches into playable prototypes',
    // No need to specify images - Next.js will use the same image
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {/* Decorative pixelated corners for that retro UI feel */}
          <div className="fixed top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-pink-500"></div>
          <div className="fixed top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-pink-500"></div>
          <div className="fixed bottom-0 left-0 z-100 w-12 h-12 border-b-4 border-l-4 border-pink-500"></div>
          <div className="fixed bottom-0 right-0 z-100 w-12 h-12 border-b-4 border-r-4 border-pink-500"></div>
          {/* Pages demonstrated by the children */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}