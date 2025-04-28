export const metadata = {
    metadataBase: new URL('https://paper-proto.com'),
    title: 'PaperProto - From pen to play',
    description: 'Transform hand-drawn sketches into playable prototypes',
    openGraph: {
      title: 'PaperProto - From pen to play',
      description: 'Transform hand-drawn sketches into playable prototypes',
      url: 'https://paper-proto.com',
      siteName: 'PaperProto',
      images: [
        {
          url: '/opengraph-image.png', // Note: changed to .png extension
          width: 1200,
          height: 630,
          alt: 'PaperProto - From pen & paper straight to play!',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'PaperProto - From pen & paper straight to play!',
      description: 'Transform hand-drawn sketches into playable prototypes',
      images: ['/opengraph-image'], // Note: changed to .png extension
    },
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }