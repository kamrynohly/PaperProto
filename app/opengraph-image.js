// // app/opengraph-image.js
// import { ImageResponse } from 'next/og';

// // No fs or path imports needed

// export const runtime = 'edge';

// export const alt = 'PaperProto - From pen & paper straight to play!';
// export const size = {
//   width: 1200,
//   height: 630,
// };

// export const contentType = 'image/png';

// export default async function OG() {
//   // Load fonts (optimized for Edge runtime)
//   let fonts = [];
//   try {
//     const pressStart2P = await fetch(
//       new URL('../public/fonts/PressStart2P-Regular.ttf', import.meta.url)
//     ).then((res) => res.arrayBuffer());
    
//     const pixelifySans = await fetch(
//       new URL('../public/fonts/PixelifySans-Regular.ttf', import.meta.url)
//     ).then((res) => res.arrayBuffer());
    
//     fonts = [
//       {
//         name: 'Press Start 2P',
//         data: pressStart2P,
//         style: 'normal',
//         weight: 400
//       },
//       {
//         name: 'Pixelify Sans',
//         data: pixelifySans,
//         style: 'normal',
//         weight: 400
//       }
//     ];
//   } catch (e) {
//     console.log('Error loading fonts:', e);
//     // Continue without custom fonts if they fail to load
//   }
  
//   return new ImageResponse(
//     (
//       <div
//         style={{
//           height: '100%',
//           width: '100%',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           background: 'linear-gradient(to bottom, rgb(22, 27, 34), rgb(17, 24, 39))',
//           position: 'relative',
//         }}
//       >
//         {/* Pixel corners */}
//         <div style={{ position: 'absolute', top: 0, left: 0, width: '24px', height: '24px', borderTop: '8px solid #ec4899', borderLeft: '8px solid #ec4899' }} />
//         <div style={{ position: 'absolute', top: 0, right: 0, width: '24px', height: '24px', borderTop: '8px solid #ec4899', borderRight: '8px solid #ec4899' }} />
//         <div style={{ position: 'absolute', bottom: 0, left: 0, width: '24px', height: '24px', borderBottom: '8px solid #ec4899', borderLeft: '8px solid #ec4899' }} />
//         <div style={{ position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px', borderBottom: '8px solid #ec4899', borderRight: '8px solid #ec4899' }} />
        
//         <div
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             backgroundColor: '#312e81',
//             borderRadius: '50%',
//             border: '8px solid #ec4899',
//             width: '150px',
//             height: '150px',
//             marginBottom: '30px',
//             boxShadow: '0px 0px 20px rgba(236, 72, 153, 0.5)',
//           }}
//         >
//           {/* Gamepad icon */}
//           <div style={{ fontSize: '80px' }}>🎮</div>
//         </div>
        
//         <h1
//           style={{
//             fontSize: '80px',
//             fontWeight: 'bold',
//             color: '#ec4899',
//             margin: '0',
//             textShadow: '4px 4px 0px #4F46E5, 8px 8px 0px #2D3748',
//             fontFamily: '"Press Start 2P", sans-serif',
//           }}
//         >
//           PaperProto
//         </h1>
        
//         <p
//           style={{
//             fontSize: '36px',
//             color: '#a5b4fc',
//             margin: '30px 0 0 0',
//             textShadow: '2px 2px 0px #1F2937',
//             fontFamily: '"Pixelify Sans", sans-serif',
//           }}
//         >
//           From pen to play!
//         </p>
        
//         {/* CRT scanline effect */}
//         <div 
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
//             backgroundSize: '100% 4px',
//             pointerEvents: 'none',
//             opacity: 0.2,
//           }}
//         />
//       </div>
//     ),
//     {
//       ...size,
//       fonts: fonts
//     }
//   );
// }

// app/opengraph-image.js
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'PaperProto - From pen & paper straight to play!';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function OG() {
  // Load fonts (optimized for Edge runtime)
  const fontData = await Promise.all([
    fetch(new URL('../public/fonts/PressStart2P-Regular.ttf', import.meta.url)).then(res => 
      res.arrayBuffer().catch(e => {
        console.error("Failed to load Press Start 2P font:", e);
        return null;
      })
    ),
    fetch(new URL('../public/fonts/PixelifySans-Regular.ttf', import.meta.url)).then(res => 
      res.arrayBuffer().catch(e => {
        console.error("Failed to load Pixelify Sans font:", e);
        return null;
      })
    )
  ]).catch(e => {
    console.error("Error loading fonts:", e);
    return [null, null];
  });

  // Filter out any fonts that failed to load
  const fonts = [
    fontData[0] && {
      name: 'Press Start 2P',
      data: fontData[0],
      style: 'normal',
      weight: 400
    },
    fontData[1] && {
      name: 'Pixelify Sans',
      data: fontData[1],
      style: 'normal',
      weight: 400
    }
  ].filter(Boolean);
  
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom, rgb(22, 27, 34), rgb(17, 24, 39))',
            position: 'relative',
          }}
        >
          {/* Pixel corners */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '24px', height: '24px', borderTop: '8px solid #ec4899', borderLeft: '8px solid #ec4899' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: '24px', height: '24px', borderTop: '8px solid #ec4899', borderRight: '8px solid #ec4899' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '24px', height: '24px', borderBottom: '8px solid #ec4899', borderLeft: '8px solid #ec4899' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px', borderBottom: '8px solid #ec4899', borderRight: '8px solid #ec4899' }} />
          
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#312e81',
              borderRadius: '50%',
              border: '8px solid #ec4899',
              width: '150px',
              height: '150px',
              marginBottom: '30px',
              boxShadow: '0px 0px 20px rgba(236, 72, 153, 0.5)',
            }}
          >
            {/* Gamepad icon */}
            <div style={{ fontSize: '80px' }}>🎮</div>
          </div>
          
          <h1
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: '#ec4899',
              margin: '0',
              textShadow: '4px 4px 0px #4F46E5, 8px 8px 0px #2D3748',
              fontFamily: fonts.length > 0 ? '"Press Start 2P", sans-serif' : 'system-ui, sans-serif',
            }}
          >
            PaperProto
          </h1>
          
          <p
            style={{
              fontSize: '36px',
              color: '#a5b4fc',
              margin: '30px 0 0 0',
              textShadow: '2px 2px 0px #1F2937',
              fontFamily: fonts.length > 1 ? '"Pixelify Sans", sans-serif' : 'system-ui, sans-serif',
            }}
          >
            From pen to play!
          </p>
          
          {/* CRT scanline effect */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
              backgroundSize: '100% 4px',
              pointerEvents: 'none',
              opacity: 0.2,
            }}
          />
        </div>
      ),
      {
        ...size,
        fonts: fonts
      }
    );
  } catch (e) {
    console.error("Error generating OpenGraph image:", e);
    
    // Fallback to a simpler version if the image generation fails
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom, rgb(22, 27, 34), rgb(17, 24, 39))',
          }}
        >
          <h1
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: '#ec4899',
              margin: '0',
              textShadow: '4px 4px 0px #4F46E5',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            PaperProto
          </h1>
          
          <p
            style={{
              fontSize: '36px',
              color: '#a5b4fc',
              margin: '30px 0 0 0',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            From pen to play!
          </p>
        </div>
      ),
      {
        ...size,
        // Use system fonts as fallback
      }
    );
  }
}