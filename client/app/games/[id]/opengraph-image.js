// app/games/[id]/opengraph-image.js

import { ImageResponse } from 'next/og';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

// Define image dimensions and type
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Generate the OG image
export default async function Image({ params }) {
  // Get game ID from params
  const gameId = params.id;
  
  // Default values
  let title = 'PaperProto Arcade';
  let rating = '0.0';
  let plays = 0;
  let coverImage = null;
  
  try {
    // Fetch game data
    const gameRef = doc(db, 'games', gameId);
    const gameSnap = await getDoc(gameRef);
    
    if (gameSnap.exists()) {
      const gameData = gameSnap.data();
      title = gameData.title || 'Untitled Game';
      rating = gameData.rating ? gameData.rating.toFixed(1) : '0.0';
      plays = gameData.playCount || gameData.plays || 0;
      coverImage = gameData.cover_image || gameData.image;
    }
  } catch (error) {
    console.error('Error fetching game data:', error);
  }
  
  // Return the image response
  // Note: This requires JSX syntax even in a .js file
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #1e293b, #0f172a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        {/* Game cover image */}
        {coverImage && (
          <div
            style={{
              width: '80%',
              height: '60%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              marginBottom: '30px',
            }}
          >
            <img
              src={coverImage}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        )}
        
        {/* Game title */}
        <h1
          style={{
            fontSize: '50px',
            fontWeight: 'bold',
            color: '#ec4899',
            margin: '0',
            marginBottom: '16px',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          }}
        >
          {title}
        </h1>
        
        {/* Game stats */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '24px',
              color: '#eab308',
            }}
          >
            ★ {rating}
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#94a3b8',
            }}
          >
            {plays} plays
          </div>
        </div>
        
        {/* Site branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            fontSize: '24px',
            color: '#818cf8',
            fontWeight: 'bold',
          }}
        >
          PAPERPROTO ARCADE
        </div>
      </div>
    ),
    { ...size }
  );
}

// In your game page file (app/games/[id]/page.js):
// Add this metadata function to provide OG tags when the game page is shared

export async function generateMetadata({ params }) {
  const gameId = params.id;
  
  try {
    // Fetch game data
    const gameRef = doc(db, 'games', gameId);
    const gameSnap = await getDoc(gameRef);
    
    if (!gameSnap.exists()) {
      return {
        title: 'Game Not Found | PaperProto Arcade',
        description: 'The requested game could not be found',
      };
    }
    
    // Get game data
    const game = {
      id: gameSnap.id,
      ...gameSnap.data()
    };
    
    // Get game image (cover or regular)
    const gameImage = game.cover_image || game.image;
    
    // Your site URL (update this with your actual URL)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://paper-proto-one.vercel.app/';

    // For sharing without an image, use the dynamic OG image generator
    const ogImageUrl = gameImage || `${baseUrl}/games/${gameId}/opengraph-image`;
    
    return {
      title: `${game.title} | PaperProto Arcade`,
      description: game.description || 'Play retro-style games in your browser',
      openGraph: {
        title: game.title,
        description: game.description || 'Play this awesome game on PaperProto Arcade!',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `Cover image for ${game.title}`,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: game.title,
        description: game.description || 'Play this awesome game on PaperProto Arcade!',
        images: [ogImageUrl],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'PaperProto Arcade',
      description: 'Play retro-style games in your browser',
    };
  }
}