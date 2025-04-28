// app/metadata.js
export const metadata = {
    title: 'PaperProto - From pen to play',
    description: 'Transform hand-drawn sketches into playable prototypes',
    openGraph: {
      title: 'PaperProto - From pen to play',
      description: 'Transform hand-drawn sketches into playable prototypes',
      url: 'https://paper-proto.com',
      siteName: 'PaperProto',
      images: [
        {
          url: '/og-image.png', // Place this image in your public folder
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
      images: ['/og-image.png'],
    },
}